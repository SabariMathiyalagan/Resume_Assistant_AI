import os
from flask import Flask, request, jsonify, session
from flask_cors import CORS
import fitz  
from werkzeug.security import generate_password_hash, check_password_hash
import sqlite3
from inference import get_analysis
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

app.secret_key = os.getenv('FLASK_SECRET_KEY')  
app.config['SESSION_COOKIE_SAMESITE'] = 'None'
app.config['SESSION_COOKIE_SECURE'] = True

CORS(app, resources={r"/api/*": {"origins": os.getenv('FRONTEND_URL')}}, supports_credentials=True)

def init_db():
    with sqlite3.connect('users.db') as conn:
        cursor = conn.cursor()
        cursor.execute(''' 
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL
            )
        ''')
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS resumes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                name TEXT NOT NULL,
                resume_text TEXT NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        ''')
        conn.commit()

@app.route('/api/analyze', methods=['POST'])
def analyze():
    job_description_text = request.form.get('jobDescription')
    text = ""
    if 'resume' in request.files:
        resume_file = request.files['resume']
        if resume_file.filename == '':
            return jsonify({'message': 'No selected file'}), 400

        if resume_file and resume_file.filename.endswith('.pdf'):
            # Ensure the 'uploads' directory exists
            uploads_dir = 'uploads'
            if not os.path.exists(uploads_dir):
                os.makedirs(uploads_dir)

            # Save the file
            resume_file_path = os.path.join(uploads_dir, resume_file.filename)
            resume_file.save(resume_file_path)

            # Extract text from the PDF using PyMuPDF
            doc = fitz.open(resume_file_path)
            for page in doc:
                text += page.get_text()
    else:
        text = request.form['resume_text']        
    analysis = get_analysis(text, job_description_text)

    return jsonify({'message': 'File uploaded successfully!', 'analysis': analysis}), 200


@app.route('/api/register', methods=['POST'])
def register():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        name = request.form['name']
        hashed_password = generate_password_hash(password)
        
        try:
            with sqlite3.connect('users.db') as conn:
                cursor = conn.cursor()
                cursor.execute('SELECT * FROM users WHERE email = ?', (email,))
                existing_user = cursor.fetchone()
                if existing_user:
                    return jsonify({'message': 'Email already exists. Please choose a different one.'}), 400

                cursor.execute('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', (name, email, hashed_password))
                conn.commit()
                return jsonify({'message': 'Registration successful!', 'redirect': '/login'}), 201
        except Exception as e:
            print(str(e))
            return jsonify({'message': f'An error occurred: {str(e)}'}), 500

@app.route('/api/login', methods=['POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        
        try:
            with sqlite3.connect('users.db') as conn:
                cursor = conn.cursor()
                cursor.execute('SELECT * FROM users WHERE email = ?', (email,))
                user = cursor.fetchone()

                if not user:
                    return jsonify({'message': 'Invalid email or password'}), 400
                
                stored_password = user[3]
                if check_password_hash(stored_password, password):

                    session['user_email'] = email
                    user_email = session.get('user_email')
                    return jsonify({
                        'message': 'Login successful!',
                        'user_email': email
                    }), 200
                else:
                    return jsonify({'message': 'Invalid email or password'}), 400
        except Exception as e:
            print(str(e))
            return jsonify({'message': f'An error occurred: {str(e)}'}), 500

# Add a logout route to clear the session
@app.route('/api/logout', methods=['POST'])
def logout():
    # Clear the session
    session.clear()
    
    response = jsonify({'message': 'Logged out successfully'})
    

    response.set_cookie('session', '', 
                       expires=0, 
                       path='/',
                       secure=True,
                       samesite='None',
                       httponly=True)  # Add httponly if your cookie uses it
    
    return response, 200

# Add a route to check session status
@app.route('/api/check-auth', methods=['GET'])
def check_auth():
    user_email = session.get('user_email')
    if user_email:
        return jsonify({'login': True, 'user_email': user_email}), 200
    return jsonify({'login': False}), 200
@app.route('/api/resume-upload', methods=['POST'])
def resume_upload():
    if 'resume' not in request.files:
        return jsonify({'message': 'No file part'}), 400
    
    resume_file = request.files['resume']
    resume_name = resume_file.filename
    if resume_name == '':
        return jsonify({'message': 'No selected file'}), 400

    if resume_file and resume_name.endswith('.pdf'):
        uploads_dir = 'uploads'
        if not os.path.exists(uploads_dir):
            os.makedirs(uploads_dir)

        # Save the file
        resume_file_path = os.path.join(uploads_dir, resume_name)
        resume_file.save(resume_file_path)

        # Extract text from the PDF using PyMuPDF
        doc = fitz.open(resume_file_path)
        text = ""
        for page in doc:
            text += page.get_text()
        
        user_email = session['user_email']
        try:
            with sqlite3.connect('users.db') as conn:
                cursor = conn.cursor()
                cursor.execute('SELECT id FROM users WHERE email = ?', (user_email,))
                user_id = cursor.fetchone()[0]
                cursor.execute('INSERT INTO resumes (user_id, name, resume_text) VALUES (?, ?, ?)', (user_id, resume_name, text))
                conn.commit()
                return jsonify({'message': 'File uploaded successfully!'}), 200
        except Exception as e:
            print(str(e))
            return jsonify({'message': f'An error occurred: {str(e)}'}), 500
        # Return a response
        

    return jsonify({'message': 'Invalid file type'}), 400
@app.route('/api/fetch-resume', methods=['GET'])
def fetch_resume():
    user_email = session['user_email']
    try:
        with sqlite3.connect('users.db') as conn:
            cursor = conn.cursor()
            cursor.execute('SELECT id FROM users WHERE email = ?', (user_email,))
            user_id = cursor.fetchone()[0]
            cursor.execute('SELECT id, name, resume_text FROM resumes WHERE user_id = ?', (user_id,))
            resumes = cursor.fetchall()  # Fetch all rows matching the user_id
            if resumes:
                resume_list = [{'id': resume[0], 'name': resume[1], 'text': resume[2]} for resume in resumes]
                return jsonify({'message': 'Resumes fetched successfully!', 'resumes': resume_list}), 200
            else:
                return jsonify({'message': 'No resumes found for this user.'}), 200
    except Exception as e:
        print(str(e))
        return jsonify({'message': f'An error occurred: {str(e)}'}), 500

@app.route('/api/delete-resume/<int:resume_id>', methods=['DELETE'])
def delete_resume(resume_id):
    try:
        with sqlite3.connect('users.db') as conn:
            cursor = conn.cursor()
            cursor.execute('DELETE FROM resumes WHERE id = ?', (resume_id,))
            conn.commit()
            return jsonify({'message': 'Resume deleted successfully'}), 200
    except Exception as e:
        print(str(e))
        return jsonify({'message': f'An error occurred: {str(e)}'}), 500
if __name__ == '__main__':
    init_db()
    app.run(debug=True, port= os.getenv('FLASK_PORT'))
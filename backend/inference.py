import requests
import os
from dotenv import load_dotenv

load_dotenv()
def get_analysis(resume_text, job_description_text):
    api_url_1 = os.getenv('HUGGINGFACE_API_URL_1')
    api_url_2 = os.getenv('HUGGINGFACE_API_URL_2')
    auth_token = os.getenv('HUGGINGFACE_AUTH_TOKEN')
    input_text = f"""<|begin_of_text|><|start_header_id|>system<|end_header_id|>
    \nYou are an expert resume analyzer. Your job is to analyze both the resume and job description below together and categorize how well the resume fits the job description and give it as a response. Your response should either be 0 1 or 2. 0 means no fit between the resume and job description. 1 means potential fit between the resume and job description, 2 means good fit between the resume and job description.\n\n<|eot_id|><|start_header_id|>user<|end_header_id|>
    \nResume: {resume_text}
    Job Description:{job_description_text}<|eot_id|><|start_header_id|>assistant<|end_header_id|>\n"""
    
    
    api_url = api_url_1
    headers = {
        "Accept" : "application/json",
        "Authorization": f"Bearer {auth_token}",
        "Content-Type": "application/json"
    }

    def query(payload):
        response = requests.post(api_url, headers=headers, json=payload)
        return response.json()

    output = query({
        "inputs": input_text,
        "parameters": {
        "max_new_tokens": 150
    }
    })
    label = int(output[0]['generated_text'][-1])
    input_text2 = f"""<|user|>
You are an expert resume reviewer and career advisor. I will provide a resume, a job description, and a fit label (0 for no fit, 1 for potential fit, 2 for good fit). Based on the fit label:
If the label is 0, provide EXACTLY 8 bullet points with detailed and actionable feedback on how to improve the resume to better fit the job description.
If the label is 1, provide EXACTLY 5 bullet points with helpful and actionable feedback on how to improve the resume to better fit the job description.
If the label is 2, provide EXACTLY 3 bullet points with concise and actionable feedback on how to further optimize the resume to fit the job description.
Output ONLY the feedback as bullet points(ONLY THE SPECIFIED NUMBER) and nothing else. Do not include introductions, explanations, or closing statements.
\nResume: {resume_text}
Job Description:{job_description_text}
Label: {label}
<|end|>
<|assistant|>\n""" 
    api_url = api_url_2
    output2 = query({
	"inputs": input_text2,
    "parameters": {
        "temperature": 0.1
    }
    })
    output_text = output2[0]['generated_text']
    last_text = output_text.rpartition('<|assistant|>\n')[-1]
    if label == 0:
        last_text = "Your resume is a no fit\nFeedback:\n" + last_text
    elif label == 1:
        last_text = "Your resume is a potential fit\nFeedback:\n" + last_text
    else:
        last_text = "Your resume is a Good fit\nFeedback:\n" + last_text


    return last_text


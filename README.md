# **Resume Feedback AI**

## **About the app**

Resume Assistant AI is a web application designed to help users improve their resumes and increase their chances of landing a job position. The application classifies a resume and job description as either: No Fit, Potential Fit, or Good Fit using a finetuned LLM and then generates personalized feedback on how to better align the resume with the given job description through prompt engineering.

The application uses a React-based frontend and a Flask backend. The AI models include a fine-tuned LLaMA 3.2 model hosted on AWS using Hugging Face Inference Endpoints for classification and a Microsoft Phi Instruct model for generating feedback, accessed using Hugging Face's serverless inference API. 

## **Functionalities**

1. **User Authentication**  
   * Registration and login functionality  
   * Session management with secure cookie handling  
2. **Resume Management**  
   * Add and delete resumes linked to a user account  
   * Resumes and user information are stored in an SQLite3 database  
3. **LLM Usage**  
   * Classification of resume and job description  
   * Generation of specialized feedback  
4. **Cloud-Hosted AI Models**  
   * Fine-tuned LLaMA 3.2 model hosted on AWS via Hugging Face Inference Endpoints  
   * Microsoft Phi Instruct model accessed through Hugging Face’s serverless inference API  
5. **Frontend**  
   * Built using React for a seamless user experience  
   * Features intuitive UI components for uploading resumes and viewing feedback  
6. **Backend**  
   * Flask server which provides RESTFUL API services

**Flowchart**

 \!\[Flowchart\](Flowchart.jpg)

**Walkthrough**

 \!\[Walkthrough\](Walkthrough.mp4)

## **Compatibility**

* The frontend application is compatible with modern browsers including:  
  * Google Chrome (version 90+)  
  * Mozilla Firefox (version 85+)  
  * Microsoft Edge (version 90+)  
  * Safari (version 14+)  
* The backend requires Python 3.9+ and Flask 2.0+.

## **Updates**

* Future enhancements:  
  * Add support for uploading and parsing job descriptions directly from files.  
  * Improve classification accuracy by further fine-tuning the LLaMA model.  
  * Use unsupervised learning on a resumes and job descriptions corpus on the feedback AI model to generate better feedback  
  * Introduce support for additional resume formats (e.g., DOCX).  
  * Settings feature so the user can decide which features to turn on and off


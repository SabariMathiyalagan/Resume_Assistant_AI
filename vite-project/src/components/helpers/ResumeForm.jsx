import React, { useState, useEffect } from "react";
import axios from 'axios';
import UploadSection from "./UploadSection";
import InputBox from "./InputBox";
import SubmitBtn from "./SubmitBtn";

function ResumeForm({ 
  userResumes = [], 
  showUploadToggle = false 
}) {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [uploadMethod, setUploadMethod] = useState('upload');
  const [selectedResume, setSelectedResume] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponseMessage('');

    try {
      const formData = new FormData();
      formData.append('jobDescription', jobDescription);

      if (showUploadToggle && uploadMethod === 'select') {
        formData.append('resume_text', selectedResume);
      } else {
        formData.append('resume', resumeFile);
      }
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const response = await axios.post(`${backendUrl}/api/analyze`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true
      });
      
      setResponseMessage(response.data.analysis);
    } catch (error) {
      setResponseMessage('Failed to analyze resume. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (responseMessage) {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [responseMessage]); 

  return (
    <div className="card shadow-lg">
      <div className="card-body p-4">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            {showUploadToggle && (
              <div className="mb-3">
                <label className="form-label fw-medium">Choose Resume Method</label>
                <div className="btn-group w-100 mb-3">
                  <button
                    type="button"
                    onClick={() => setUploadMethod('select')}
                    className={`btn ${uploadMethod === 'select' ? 'btn-primary' : 'btn-outline-secondary'}`}
                  >
                    Select Existing Resume
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadMethod('upload')}
                    className={`btn ${uploadMethod === 'upload' ? 'btn-primary' : 'btn-outline-secondary'}`}
                  >
                    Upload New Resume
                  </button>
                </div>
              </div>
            )}

            {(!showUploadToggle || uploadMethod === 'upload') && (
              <>
                <label className="form-label">Upload Resume</label>
                <UploadSection resumeFile={resumeFile} setResumeFile={setResumeFile} />
              </>
            )}

            {showUploadToggle && uploadMethod === 'select' && (
              <select
                className="form-select"
                value={selectedResume}
                onChange={(e) => setSelectedResume(e.target.value)}
                required
              >
                <option value="">Choose a resume...</option>
                {userResumes.map((resume) => (
                  <option key={resume.id} value={resume.text}>
                    {resume.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="mb-4">
            <InputBox
              name="Job Description"
              rows={6}
              placeholder="Paste the job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </div>

          <SubmitBtn
            disabled={
              (!showUploadToggle && !resumeFile) ||
              (showUploadToggle && uploadMethod === 'select' && !selectedResume) ||
              (showUploadToggle && uploadMethod === 'upload' && !resumeFile) ||
              !jobDescription ||
              loading
            }
            loading={loading}
            name="Analyze"
          />
        </form>

        {responseMessage && (
          <div className="mt-4 p-3 bg-white rounded" style={{ whiteSpace: 'pre-wrap' }}>
            <span
              style={{
                fontSize: 24,
                color: responseMessage.includes('no fit')
                  ? 'red'
                  : responseMessage.includes('potential fit')
                  ? 'orange'
                  : 'green',
                fontWeight: 'bold',
              }}
            >
              {responseMessage.split('\n')[0]}
            </span>
            <br />
            {responseMessage.split('\n').slice(1).join('\n')}
          </div>
        )}
      </div>
    </div>
  );
}

export default ResumeForm;

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import axios from 'axios';

function AddResumeBtn ({ fetchUserResumes }) {
  const [error, setError] = useState('');

  const handleNewResumeUpload = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('resume', file);

      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        const response = await axios.post(`${backendUrl}/api/resume-upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true
        });
        fetchUserResumes();
        alert(response.data.message);
      } catch (error) {
        console.error('Error uploading resume:', error);
        setError('Failed to upload resume');
      }
    }
  };

  return (
    <div>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      <label className="btn btn-primary d-flex align-items-center">
        <Plus size={20} className="me-2" />
        Add Resume
        <input
          type="file"
          className="d-none"
          accept=".pdf"
          onChange={handleNewResumeUpload}
        />
      </label>
    </div>
  );
};

export default AddResumeBtn;
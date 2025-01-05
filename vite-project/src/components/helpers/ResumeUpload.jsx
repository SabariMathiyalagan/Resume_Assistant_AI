import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import axios from 'axios';

function ResumeUpload ({ resume, fetchUserResumes })  {
  const [error, setError] = useState('');

  const deleteResume = async () => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      await axios.delete(`${backendUrl}/api/delete-resume/${resume.id}`, {
        withCredentials: true
      });
      fetchUserResumes();
    } catch (error) {
      console.error('Error deleting resume:', error);
      setError('Failed to delete resume');
    }
  };

  return (
    <div className="col-12 col-md-6 col-lg-4">
      <div className="card h-100 shadow-sm">
        <div className="card-body">
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          <FileText className="mb-2" size={24} />
          <p className="card-text fw-medium">{resume.name}</p>
          <button
            className="btn btn-danger btn-sm mt-2"
            onClick={deleteResume}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumeUpload;
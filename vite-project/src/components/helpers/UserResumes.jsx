import React, {useEffect} from 'react';
import ResumeUpload from './ResumeUpload';
import AddResumeBtn from './AddResumeBtn';

function UserResumes({ userResumes, fetchUserResumes }) {
    useEffect(() => {
        fetchUserResumes();
    
    }, []) 
  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fs-4 fw-bold">My Resumes</h2>
        <AddResumeBtn 
          fetchUserResumes={fetchUserResumes}
        />
      </div>
      
      <div className="row g-4">
        {userResumes.map((resume) => (
          <ResumeUpload
            key={resume.id}
            resume={resume}
            fetchUserResumes={fetchUserResumes}
          />
        ))}
      </div>
    </div>
  );
}

export default UserResumes;
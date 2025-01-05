import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ResumeForm from '../helpers/ResumeForm';
import UserResumes from '../helpers/UserResumes';
import DashboardSidebar from '../helpers/DashboardSidebar';
import LoadingScreen from '../helpers/LoadingScreen';
function UserPage() {
  const [activeTab, setActiveTab] = useState('resumes');
  const [userResumes, setUserResumes] = useState([]);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const response = await axios.get('http://localhost:8080/api/check-auth', {
        withCredentials: true
      });
      
      if (!response.data.login) {
        window.location.href = "/";
        return;
      }
      
      setIsAuthenticated(true);
    } catch (error) {
      console.log(error);
      window.location.href = "/";
    } finally {
      setIsLoading(false);
    }
  }

  const fetchUserResumes = async () => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const response = await axios.get(`${backendUrl}/api/fetch-resume`, {
        withCredentials: true
      });
      if (response.data.resumes) {
        setUserResumes(response.data.resumes);
      } else {
        setUserResumes([]);
      }
    } catch (error) {
      console.error('Error fetching resumes:', error);
      setError('Failed to load resumes');
    }
  };

  if (isLoading) {
    return <LoadingScreen/>
  }

  if (!isAuthenticated) {
    return null; 
  }

  return (
    <div className="d-flex vh-100">
      <div className="bg-white shadow" style={{ width: '250px' }}>
        <div className="p-4 h-100">
          <DashboardSidebar activeTab={activeTab} setActiveTab={setActiveTab}/>
        </div>
      </div>

      <div className="flex-grow-1 p-4 bg-light">
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        
        {activeTab === 'resumes' ? (
          <UserResumes 
            userResumes={userResumes}
            fetchUserResumes={fetchUserResumes}
          />
        ) : (
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-12 col-lg-8">
                <h2 className="fs-4 fw-bold mb-4">Resume Assistant</h2>
                <ResumeForm 
                  showUploadToggle={true}
                  userResumes={userResumes}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserPage;
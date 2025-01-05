import React, {useState, useEffect} from 'react';
import SignUpBtn from '../helpers/SignUpBtn';
import Header from '../helpers/Header';
import ResumeForm from '../helpers/ResumeForm';
import LoadingScreen from '../helpers/LoadingScreen';
import axios from 'axios';


function HomePage() {
   const [isLoading, setIsLoading] = useState(true);
   const [isAuthenticated, setIsAuthenticated] = useState(false);
   useEffect(() => {
    checkAuth();
  }, [])
   async function checkAuth() {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const response = await axios.get(`${backendUrl}/api/check-auth`, {
        withCredentials: true
      });
      
      if (response.data.login) {
        window.location.href = "/dashboard";
        return;
      }
      
      setIsAuthenticated(true);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }
   if (isLoading) {
    return <LoadingScreen/>
  }

  if (!isAuthenticated) {
    return null; 
  }
  return (
    <div className="container py-1">
      <div className="d-flex justify-content-end mb-3">
        <SignUpBtn/>

      </div>
      
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="text-center mb-5">
            <Header title = {"Resume Assistant"} description={"Upload your resume and paste a job description to check your match."}/>
          </div>
          <ResumeForm/>
          
        </div>
      </div>
    </div>
  );
};

export default HomePage;
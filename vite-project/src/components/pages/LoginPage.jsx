import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import InputBox from '../helpers/InputBox';
import SubmitBtn from '../helpers/SubmitBtn';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const response = await axios.post(`${backendUrl}/api/login`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true
      });


      alert(response.data.message);  


      window.location.href = "/dashboard";  
    } catch (error) {

      alert(error.response?.data?.message || 'An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5 d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="card shadow-lg p-4" style={{ maxWidth: '500px', width: '100%' }}>
        <h2 className="text-center mb-4">Login</h2>
        <form onSubmit={handleLogin}>
          <InputBox name={"Email"} type={"email"} placeholder={"Enter your email"} value={email} onChange={(e) => setEmail(e.target.value)} required={true} rows={1}/>
          <InputBox name={"Password"} type={"password"} placeholder={"Enter your password"} value={password} onChange={(e) => setPassword(e.target.value)} required={true} rows={1}/>
          
        <SubmitBtn loading={loading} disabled={!email || !password || loading} name={"Login"}/>
        </form>
        <div className="text-center mt-3">
          <NavLink to="/register">Don't have an account?</NavLink>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

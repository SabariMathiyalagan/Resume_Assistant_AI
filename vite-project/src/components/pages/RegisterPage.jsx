import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import InputBox from '../helpers/InputBox';
import SubmitBtn from '../helpers/SubmitBtn';
function RegisterPage() {
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append('email', email); 
    formData.append('password', password);
    formData.append('name', fullName);

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const response = await axios.post(`${backendUrl}/api/register`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data.message);

      if (response.data.message) {
        alert(response.data.message);
      }
      if(response.status == 201) {
        console.log('in')
        window.location.href="/login"
      }
    } catch (error) {
      console.error('Error Registering User:', error);
      if (error.response && error.response.data.message) {
        alert(error.response.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5 d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="card shadow-lg p-4" style={{ maxWidth: '500px', width: '100%' }}>
        <h2 className="text-center mb-4">Sign Up</h2>
        <form onSubmit={handleRegister}>
          <InputBox name={"Full Name"} type={"text"} placeholder={"Enter your Full Name"} value={fullName} onChange={(e) => setFullName(e.target.value)} required={true} rows={1}/>
            <InputBox name={"Email"} type={"email"} placeholder={"Enter your email"} value={email} onChange={(e) => setEmail(e.target.value)} required={true} rows={1}/>
          <InputBox name={"Password"} type={"password"} placeholder={"Enter your password"} value={password} onChange={(e) => setPassword(e.target.value)} required={true} rows={1}/>
          <SubmitBtn loading={loading} disabled={!fullName || !email || !password || loading} name={"Create Account"}/>

        </form>
        <div className="text-center mt-3">
          <NavLink to="/login">Already have an account?</NavLink>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

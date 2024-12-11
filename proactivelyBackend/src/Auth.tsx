import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Register.css';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8083/auth', {
        user: username,
        pwd: password,
      }, 
        { withCredentials: true }
      );
      console.log(response.data);
      setMessage(response.data.success);
      console.log("Success!");

      // Store the token in localStorage
      const { accessToken, role } = response.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('role', role);
      console.log("printing accesstoken");
      console.log(accessToken);
      console.log(response.data.role);

      setMessage('Login successful! Redirecting...');

      if (response.data.role === 'Speaker') {
        console.log("Authorized!");
        navigate('/speakerprofile');
      }
      else {
        console.log("unauthorized");
        navigate('/home');
      }
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Login failed.');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
        <label htmlFor="username">Username:</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" style={{ marginTop: '10px', padding: '10px', background: '#4CAF50', color: 'white' }}>
          Login
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Register;

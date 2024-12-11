import React, { useState } from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { Radio, RadioGroup, FormLabel } from '@mui/material';
import axios from 'axios';
import './Register.css';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fName, setFName] = useState('');
  const [lName, setLName] = useState('');
  const [role, setRole] = useState('');
  const [emailid, setEmail] = useState('');
  const [message, setMessage] = useState('');


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8083/register', {
        user: username,
        pwd: password,
        fName: fName,
        lName: lName,
        role: role,
        emailid: emailid
      });
      setMessage(response.data.success);
      console.log("Success!");
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Registration failed.');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
      <label htmlFor="fName">First Name:</label>
        <input
          id="fName"
          type="text"
          value={fName}
          onChange={(e) => setFName(e.target.value)}
          required
        />
        <label htmlFor="lName">Last Name:</label>
        <input
          id="lName"
          type="text"
          value={lName}
          onChange={(e) => setLName(e.target.value)}
          required
        />
        <label htmlFor="username">Username:</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <label htmlFor="emailid">Email ID:</label>
        <input
          id="emailid"
          type="text"
          value={emailid}
          onChange={(e) => setEmail(e.target.value)}
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
        
        <FormControl>
        <FormLabel id="demo-radio-buttons-group-label">Role:</FormLabel>
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          defaultValue="female"
          name="radio-buttons-group"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <FormControlLabel value="Speaker" control={<Radio />} label="Speaker" />
          <FormControlLabel value="User" control={<Radio />} label="User" />
        </RadioGroup>
      </FormControl>

        <button type="submit" style={{ marginTop: '10px', padding: '10px', background: '#4CAF50', color: 'white' }}>
          Register
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Register;

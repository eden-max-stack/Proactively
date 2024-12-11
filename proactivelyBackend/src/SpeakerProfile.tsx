import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SpeakerProfile: React.FC = () => {
    const [expertise, setExpertise] = useState('');
    const [price, setPrice] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    // State variables for user details
    const [fName, setFName] = useState('');
    const [lName, setLName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');

    const handleLogout = async () => {
        try {
            const response = await axios.get('http://localhost:8083/logout', {
                withCredentials: true , // Include cookies for server-side token invalidation
            });

            console.log(response);

            if (response.status == 204) {
                console.log('Logged out successfully');
                localStorage.removeItem('accessToken');
                navigate('/auth');
            } else {
                console.error('Logout failed');
            }

            console.log("successfully logged out!");
          } catch (err) {
            console.error('Error logging out:', err);
          }
      };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('accessToken'); // Ensure token is stored on login
            if (!token) {
                console.log("user not logged in.");
                navigate('/');
            }
            console.log('user is logged in.');
            const response_details = await axios.get('http://localhost:8083/userdetails', {
                headers: { Authorization: `Bearer ${token}` }
            });

            const { fName, lName, email, username } = response_details.data;
                setFName(fName);
                setLName(lName);
                setEmail(email);
                setUsername(username);

            console.log("fetched details of speaker");

            const response = await axios.post(
                'http://localhost:8083/speakerprofile',
                { expertise, price_per_session: price },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setMessage(response.data.message);
        } catch (error: any) {
            setMessage(error.response?.data?.message || 'Error saving profile.');
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
            <h2>Create/Update Profile</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <label>
                    First Name:
                    <input
                        value={fName}
                        placeholder={fName}
                        readOnly
                    />
                </label>
            <label>
                    Last Name:
                    <textarea
                        value={lName}
                        placeholder={lName}
                        readOnly
                    />
                </label>
            <label>
                    Username:
                    <input
                        value={username}
                        placeholder={username}
                        readOnly
                    />
                </label>
            <label>
                    Email ID:
                    <input
                        value={email}
                        placeholder={email}
                        readOnly
                    />
                </label>
                <label>
                    Expertise:
                    <textarea
                        value={expertise}
                        onChange={(e) => setExpertise(e.target.value)}
                        placeholder="Enter your expertise"
                        required
                        rows={4}
                    />
                </label>
                <label>
                    Price per Session:
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="Enter price"
                        required
                        step="0.01"
                    />
                </label>
                <button type="submit" style={{ padding: '10px', background: '#4CAF50', color: 'white' }}>
                    Save Profile
                </button>
            </form>
            <button onClick={handleLogout} style={{ marginTop: '20px', padding: '10px 20px' }}>
                Logout
            </button>
            {message && <p>{message}</p>}
        </div>
        
    );
};

export default SpeakerProfile;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Home.css';


const Home: React.FC = () => {
  const [data, setData] = useState<any[]>([]); // Speaker profiles
  const [error, setError] = useState<string | null>(null);
  const [userLoggedIn, setUserLoggedIn] = useState<boolean>(false); // User login status
  const [bookedSessions, setBookedSessions] = useState<Record<string, string[]>>({}); // Store booked sessions per speaker

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Log to debug
        console.log("Fetching data...");
        
        // Fetch speaker profiles
        const response = await axios.get('http://localhost:8083/home/');
        console.log('Speaker Profiles:', response.data);
        setData(response.data);

        // Fetch booked sessions
        const token = localStorage.getItem('accessToken');
        const bookingsResponse = await axios.get('http://localhost:8083/bookings/', {
            headers: {
              Authorization: `Bearer ${ token }`  // Replace with the actual token
            }
          })
        if (!bookingsResponse) {
            console.error("user not logged in")
            setUserLoggedIn(false);
        }
        else {
            setUserLoggedIn(true);
            console.log('Booked Sessions:', bookingsResponse.data);
            setBookedSessions(bookingsResponse.data);
        }
      } catch (error: any) {
        // Detailed error handling
        console.error('Error:', error.response || error.message);
        setError('Problem fetching data. Check the console for more details.');
      }
    };

    // Call the async function inside useEffect
    fetchData();

    // Add a cleanup function in case of component unmount
    return () => {
      console.log('Cleanup called');
    };
  }, []); // Empty dependency array ensures this runs only once after the initial render

  const handleBooking = async (speakerId: string, sessionTime: string) => {
    if (!userLoggedIn) {
      alert('You must be logged in to book a session.');
      return;
    }
    const token = localStorage.getItem('accessToken');
    console.log(token);
    if (!token) {
        throw new Error('Token not found');
      }
    try {
      // Send booking request
      const response = await axios.post(
        'http://localhost:8083/bookings/', 
        { speakerId, sessionTime }, // Request payload
        { 
          headers: { Authorization: `Bearer ${token}` }, // Authorization header
          withCredentials: true // Send credentials (cookies) with the request
        }
      );

      alert('Session successfully booked!');
      // Update booked sessions state
      setBookedSessions((prev) => ({
        ...prev,
        [speakerId]: [...(prev[speakerId] || []), sessionTime],
      }));
    } catch (error: any) {
      console.error('Booking error:', error.response || error.message);
      alert('Unable to book session. Please try again.');
    }
  };

  const renderSessionButtons = (speakerId: string) => {
    const availableHours = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];
    const bookedHours = bookedSessions[speakerId] || [];

    return availableHours.map((time) => (
      <button
        key={time}
        disabled={bookedHours.includes(time)} // Disable button if already booked
        onClick={() => handleBooking(speakerId, time)}
        className={`session-button ${bookedHours.includes(time) ? 'booked' : ''}`}
      >
        {time} HRS
      </button>
    ));
  };

  return (
    <div className="app-container">
      <h1>Welcome to my app</h1>
      {error && <p>{error}</p>}
      {data.length > 0 ? (
        <div className="profiles-container">
          {data.map((profile, index) => {
            const speakerId = profile.username; // Set the speakerId from the username
            return (
              <div key={index} className="profile-card">
                <h2 className="profile-name">
                  {profile.firstName} {profile.lastName}
                </h2>
                <p>Email: {profile.email}</p>
                <p>Expertise: {profile.expertise}</p>
                <p>Price per session: ${profile.price_per_session}</p>
                <div className="sessions-container">
                  {renderSessionButtons(speakerId)} {/* Pass the speakerId here */}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Home;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './Register';
import Auth from './Auth';
import SpeakerProfile from './SpeakerProfile';
import Home from './Home';
import NavBar from './NavBar';

const App: React.FC = () => {
  return (
    <Router>
      <div>
        <NavBar />
        <div className='main-content'>
        <Home />
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/speakerprofile" element={<SpeakerProfile />} />
          <Route path="/home" element={<Home/>} />
          {/* Add other routes as needed */}
        </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;

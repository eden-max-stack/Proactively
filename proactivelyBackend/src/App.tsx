import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Register from './Register';
import Auth from './Auth';
import SpeakerProfile from './SpeakerProfile';
import Home from './Home';

const App: React.FC = () => {
  return (
    <Router>
      <div>
        <nav style={{ padding: '10px', background: '#ddd' }}>
          <Link to="/register" style={{ margin: '10px' }}>Register</Link>
          <Link to="/auth" style={{ margin: '10px' }}>Login</Link>          
          {/* Add other navigation links as needed */}
        </nav>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/speakerprofile" element={<SpeakerProfile />} />
          <Route path="/home" element={<Home/>} />
          {/* Add other routes as needed */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faBell } from '@fortawesome/free-solid-svg-icons';
import logo from '../assets/logo3.png';
import axios from 'axios';

const Navbar = ({ profilePicture }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user data for the logged-in user
        const response = await axios.get(`http://localhost:5000/users/${sessionStorage.getItem('userId')}`);

        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('userId');
    window.location.reload(); // Refresh the page after logout
  };

  return (
    <div className="navbar" style={{ display: 'flex', alignItems: 'center' }}>
      <div className="logo profile-pic icons2" style={{ display: 'flex', alignItems: 'center' }}>
        <img src={logo} alt="Logo" style={{ width: '50px', marginRight: '10px' }} />
        <h3 style={{ margin: 0 }}>Connectify</h3>
      </div>
      <div className="search">
        <input type="text" placeholder="Search" className="search-input" />
      </div>
      <div className="icons" style={{ display: 'flex', alignItems: 'center' }}>
        <div className="icon-border">
          <i><FontAwesomeIcon icon={faEnvelope} /></i>
        </div>
        <div className="icon-border">
          <i><FontAwesomeIcon icon={faBell} /></i>
        </div>
        <div className="profile-pic icons2" style={{ position: 'relative', cursor: 'pointer' }} onClick={toggleMenu}>
          <img src={profilePicture} alt="Profile" style={{ width: '50px', borderRadius: '50%', marginRight: '10px' }} />
          {menuOpen && (
            <div className="profile-menu" style={{ position: 'absolute', top: '50px', right: 0, background: '#fff', border: '1px solid #ccc', borderRadius: '5px', padding: '10px', zIndex: 999 }}>
              {userData && (
                <>
                                   <p style={{ margin: 0 }}><strong>User Name:</strong> {userData.username}</p>
                  <p style={{ margin: 0 }}><strong>Name:</strong> {userData.name}</p>
                  <p style={{ margin: 0 }}><strong>Email:</strong> {userData.email}</p> </>
              )}
              <button onClick={handleLogout} style={{ margin: '10px 10px', cursor: 'pointer', padding: '5px 10px', background: '#f00', color: '#fff', border: 'none' }}>Logout</button>
              <button onClick={toggleMenu} style={{ cursor: 'pointer', padding: '5px 10px', background: '#ccc', color: '#000', border: 'none' }}>Close</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;

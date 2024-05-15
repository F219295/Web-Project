import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faBell } from '@fortawesome/free-solid-svg-icons';
import logo from '../assets/logo3.jpg';
import empty from '../assets/empty.jpg';
import axios from 'axios';

const Navbar = ({ profilePicture }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = sessionStorage.getItem('userId');
      if (userId) {
        try {
          const response = await axios.get(`http://localhost:5000/users/${userId}`);
          setUserData(response.data);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('userId');
    setUserData(null);
    window.location.reload();
  };

  const handleSignIn = () => {
    // Implement sign-in logic here
    alert('Sign-in logic not implemented.');
  };

  return (
    <div className="navbar" style={{ display: 'flex', alignItems: 'center' }}>
      <div className="logo profile-pic icons2" style={{ display: 'flex', alignItems: 'center' }}>
        <img src={logo} alt="Logo" style={{ width: '50px', marginRight: '10px', borderRadius: '10%' }} />
        <h2 className="second-font" style={{ margin: 0 }}><strong className='second-font'>Connectify</strong></h2>
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
          <img
            src={userData ? profilePicture : empty}
            alt="Profile"
            style={{ width: '50px', borderRadius: '50%', marginRight: '10px' }}
          />
          {menuOpen && (
            <>
              <div className="menu-overlay" onClick={toggleMenu} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0, 0, 0, 0.5)', zIndex: 998 }}></div>
              <div className="profile-menu" style={{ position: 'absolute', top: '50px', right: 0, background: '#fff', border: '1px solid #ccc', borderRadius: '5px', padding: '20px', zIndex: 999, width: '600%' }}>
                {userData ? (
                  <>
                    <p style={{ margin: 0 }}><strong className='color'>User Name:</strong> {userData.username}</p>
                    <p style={{ margin: 0 }}><strong className='color'>Name:</strong> {userData.name}</p>
                    <p style={{ margin: 0 }}><strong className='color'>Email:</strong> {userData.email}</p>
                    <button onClick={handleLogout} style={{ margin: '10px 0', cursor: 'pointer', padding: '5px 10px', background: '#f00', color: '#fff', border: 'none' }}>Logout</button>
                  </>
                ) : (
                  <button onClick={handleSignIn} style={{ margin: '10px 0', cursor: 'pointer', padding: '5px 10px', background: '#16a085', color: '#fff', border: 'none' }}>Sign In</button>
                )}
                <button onClick={toggleMenu} style={{ cursor: 'pointer', padding: '5px 10px', background: '#ccc', color: '#000',marginLeft:'10px', border: 'none' }}>Close</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;

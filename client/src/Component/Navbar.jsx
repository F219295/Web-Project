import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faBell } from '@fortawesome/free-solid-svg-icons';
import logo from '../assets/cat.png'; 
import profile from '../assets/cat.png'; 
const Navbar = () => {
  return (
    <div className="navbar">
      <div className="logo">
      <img src={logo} alt="Logo" />
      </div>
      <div className="search">
        <input type="text" placeholder="Search" className="search-input" />
       
      </div>
      <div className="icons">
      
        <div className="icon-border">
          <i><FontAwesomeIcon icon={faEnvelope} /></i>
        </div>
        <div className="icon-border">
          <i><FontAwesomeIcon icon={faBell} /></i>
        </div>
        <div className="profile-pic icons2">
          <img src={profile} alt="Logo" />
          </div>
      </div>
    </div>
  );
};

export default Navbar;

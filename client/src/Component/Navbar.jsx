import React from 'react';

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="logo">
        <img src="logo.png" alt="Logo" />
      </div>
      <div className="search">
        <input type="text" placeholder="Search" />
      </div>
      <div className="icons">
        <i className="fas fa-envelope"></i>
        <i className="fas fa-bell"></i>
        <div className="profile-border"></div> {/* Round border for profile image */}
        <div className="profile-pic">
          <img src="profile-pic.jpg" alt="Profile" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;

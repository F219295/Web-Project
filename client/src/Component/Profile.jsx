import React from 'react';
import './Login.css'; // Import your CSS file

const Profile = () => {
  return (
    <div className="profile-container">
      <div className="profile-wrapper">
        <div className="profile-title">Profile</div>
        <div className="profile-top-bar">
          <div className="profile-logo">Logo</div>
          <div className="profile-search">
            <input type="text" placeholder="Search" />
          </div>
          <div className="profile-icons">
            <i className="fas fa-envelope"></i>
            <i className="fas fa-bell"></i>
          </div>
        </div>
        <div className="profile-section">
          <div className="profile-left-section">
            <div className="profile-heading">Friend List</div>
            <div className="profile-friend-list">
              <div className="profile-friend">
                <img src="friend1.jpg" alt="Friend 1" />
                <div className="profile-name">Friend 1</div>
              </div>
              <div className="profile-friend">
                <img src="friend2.jpg" alt="Friend 2" />
                <div className="profile-name">Friend 2</div>
              </div>
              {/* Add more friends as needed */}
            </div>
          </div>
          <div className="profile-right-section">
            <div className="profile-info">
              <div className="profile-pic">
                <img src="profile-pic.jpg" alt="Profile Picture" />
              </div>
              <div className="profile-user-name">John Doe</div>
              <div className="profile-caption">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>
              <div className="profile-main-image">
                <img src="main-image.jpg" alt="Main Image" />
              </div>
              <div className="profile-actions">
                <i className="fas fa-thumbs-up"></i>
                <i className="fas fa-comment"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

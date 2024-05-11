import React from 'react';
import Navbar from './Navbar'; // Assuming Navbar component is defined in Navbar.js

const Home = () => {
  return (
    <div>
      <Navbar />
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px' }}>
        <div style={{ width: '25%' }}>
          <h2>Suggestions</h2>
          <div style={{ textAlign: 'center' }}>
            <h3>Profile Picture</h3>
            <img src="profile.jpg" alt="Profile" style={{ width: '100px', height: '100px', borderRadius: '50%' }} />
            <p>Name</p>
          </div>
        </div>
        <div style={{ width: '50%', textAlign: 'center' }}>
          <div>
            <h3>Profile Picture</h3>
            <img src="profile.jpg" alt="Profile" style={{ width: '150px', height: '150px', borderRadius: '50%' }} />
            <p>Name</p>
          </div>
          <div>
            <p>Caption</p>
            <img src="image.jpg" alt="Image" style={{ width: '100%', borderRadius: '5px', marginBottom: '10px' }} />
          </div>
        </div>
        <div style={{ width: '25%' }}>
          <h2>Right Side</h2>
        </div>
      </div>
    </div>
  );
};

export default Home;

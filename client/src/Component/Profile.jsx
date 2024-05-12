import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import './Login.css'; // Import your CSS file
import axios from 'axios'; // Import axios for HTTP requests
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState(null);
  const [status, setStatus] = useState('');

  useEffect(() => {
    // Retrieve user data from session storage
    const userId = sessionStorage.getItem("userId");
    console.log("User Id from session storage:", userId);
    if (userId) {
      setUserData({ userId });
      console.log("User Data:", { userId });
    }
  }, []);

  const handleCaptionChange = (event) => {
    setCaption(event.target.value);
  };

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };
  const handlePost = async () => {
    try {
      // Check if user data exists
      if (!userData || !userData.userId) {
        console.error("User data not found");
        return;
      }
  
      // Check if image and caption are present
      if (!image || !caption) {
        console.error("Image or caption is missing");
        return;
      }
  
      const formData = new FormData();
      formData.append('image', image); // Append the image file
      formData.append('caption', caption); // Append the caption
      formData.append('userId', userData.userId); // Append the userId
  
      // Make a POST request to the server to store the post
      const response = await axios.post('http://localhost:5000/post', formData, {
        headers: {
          'Content-Type': 'multipart/form-data' // Set the content type for FormData
        }
      });
  
      if (response.status === 201) {
        setStatus('Post stored successfully!');
      } else {
        setStatus('Failed to store post.');
      }
    } catch (error) {
      console.error('Error posting:', error);
      setStatus('Failed to store post.');
    }
  };
  

  return (
    <div className="profile-container">
      <div className="profile-wrapper">
        <Navbar />
        <div className="profile-section">
          <div className="profile-left-section">
            <div className="profile-heading">Friend List</div>
            <div className="profile-friend-list">
              {/* Check if friends array exists before mapping */}
              {/* Place your friend list rendering logic here */}
            </div>
          </div>
          <div className="profile-right-section">
            <div className="profile-info">
              <div>
                <input type="file" onChange={handleImageChange} />
                <input type="text" value={caption} onChange={handleCaptionChange} placeholder="Enter caption" />
                <button onClick={handlePost}>Post</button>
                {status && <div className="status">{status}</div>}
              </div>
              {/* Check if posts array exists before mapping */}
              {/* Place your post rendering logic here */}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;

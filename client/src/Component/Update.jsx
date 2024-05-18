import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Update = ({ onUpdated }) => {
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState(null);
  const [status, setStatus] = useState('');
  const [postId, setPostId] = useState('');

  useEffect(() => {
    // Fetch post ID from session storage
    const postIdFromSession = sessionStorage.getItem("postId");
    if (postIdFromSession) {
      console.log("Post ID from session storage:", postIdFromSession);
      setPostId(postIdFromSession);
    }
  }, []);

  const handleCaptionChange = (event) => {
    setCaption(event.target.value);
  };

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append('caption', caption); // Add the caption to the form data
      if (image) {
        formData.append('image', image); // Add the image to the form data if it exists
      }

      const response = await axios.put(`http://localhost:5000/posts/${postId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.status === 200) {
        setStatus('Post updated successfully!');
        // Optional: Call the onUpdated callback if provided
        if (onUpdated) {
          onUpdated();
        }
        // Redirect to the desired page after 2 seconds
        setTimeout(() => {
          window.location.href = '/profile'; // Redirect to profile page after 2 seconds
        }, 2000);
      } else {
        setStatus('Failed to update post.');
      }
    } catch (error) {
      console.error('Error updating post:', error);
      setStatus('Failed to update post.');
    }
  };

  return (
    <div style={{ margin: '80px' }}>
      <div className="profile-heading third-font">Update <span className='color'>Post</span></div>
      <h3 style={{ marginTop: '30px' }}>Enter the Image : </h3>
      <input
        type="text"
        value={caption}
        onChange={handleCaptionChange}
        placeholder="Enter new caption"
        style={{ width: 'calc(100% - 80px)', padding: '8px', borderRadius: '5px', border: '2px solid #16a085', marginBottom: '10px' }} />
      <input type="file" onChange={handleImageChange} style={{ marginBottom: '30px' }} />
      <button onClick={handleUpdate} style={{ backgroundColor: '#16a085', color: '#fff', padding: '10px', borderRadius: '5px', border: 'none', marginBottom: '50px', marginLeft: '10px' }}>Update</button>
      {status && <div className="status">{status}</div>}
    </div>
  );
};

export default Update;

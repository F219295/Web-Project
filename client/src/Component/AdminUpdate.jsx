import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminUpdate = ({ onUpdated }) => {
  const [fullname, setFullname] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState(null);
  const [status, setStatus] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    // Fetch user data from session storage
    const userData = JSON.parse(sessionStorage.getItem('userData'));
    if (userData) {
      console.log('User data from session storage:', userData);
      const { _id, fullname, username, email } = userData;
      setUserId(_id);
      setFullname(fullname);
      setUsername(username);
      setEmail(email);
    }
  }, []);

  const handleFullnameChange = (event) => {
    setFullname(event.target.value);
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleUpdate = async () => {
    try {
      console.log('Updating user with data:', {
        fullname,
        username,
        email,
        password,
        profilePicture: image ? image.name : 'No image selected'
      });

      const formData = new FormData();
      formData.append('fullname', fullname);
      formData.append('username', username);
      formData.append('email', email);
      formData.append('password', password);
      if (image) {
        formData.append('profilePicture', image);
      }

      const response = await axios.put(`http://localhost:5000/users/${userId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.status === 200) {
        setStatus('User updated successfully!');
        if (onUpdated) {
          onUpdated();
        }
      } else {
        setStatus('Failed to update user.');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      setStatus('Failed to update user.');
    }
  };

  return (
    <div style={{ margin: '80px' }}>
      <div className="profile-heading third-font">Update <span className='color'>User</span></div>
      <input
        type="text"
        value={fullname}
        onChange={handleFullnameChange}
        placeholder="Enter full name"
        style={{ width: 'calc(100% - 80px)', padding: '8px', borderRadius: '5px', border: '2px solid #16a085', marginBottom: '10px' }} />
      <input
        type="text"
        value={username}
        onChange={handleUsernameChange}
        placeholder="Enter username"
        style={{ width: 'calc(100% - 80px)', padding: '8px', borderRadius: '5px', border: '2px solid #16a085', marginBottom: '10px' }} />
      <input
        type="email"
        value={email}
        onChange={handleEmailChange}
        placeholder="Enter email"
        style={{ width: 'calc(100% - 80px)', padding: '8px', borderRadius: '5px', border: '2px solid #16a085', marginBottom: '10px' }} />
      <input
        type="password"
        value={password}
        onChange={handlePasswordChange}
        placeholder="Enter password"
        style={{ width: 'calc(100% - 80px)', padding: '8px', borderRadius: '5px', border: '2px solid #16a085', marginBottom: '10px' }} />
      <input type="file" onChange={handleImageChange}   style={{
                paddingTop:'10px',
                backgroundColor: '#16a085',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }} />
      
      <button onClick={handleUpdate} style={{ backgroundColor: '#16a085', color: '#fff', padding: '10px', borderRadius: '5px', border: 'none', marginBottom: '50px', marginLeft: '10px' }}>Update</button>
      {status && <div className="status">{status}</div>}
    </div>
  );
};

export default AdminUpdate;

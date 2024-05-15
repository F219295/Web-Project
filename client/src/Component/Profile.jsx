import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import axios from 'axios'; // Import axios for HTTP requests

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState(null);
  const [status, setStatus] = useState('');
  const [posts, setPosts] = useState([]);
  const [profilePicture, setProfilePicture] = useState('');
  const [friendList, setFriendList] = useState([]);

  useEffect(() => {
    // Retrieve user data from session storage
    const userId = sessionStorage.getItem("userId");
    console.log("User Id from session storage:", userId);
    if (userId) {
      setUserData({ userId });
      console.log("User Data:", { userId });
      fetchPosts(userId); // Fetch posts for the user
      fetchUserProfile(userId); // Fetch user profile data
      fetchFriendList(userId); // Fetch friend list for the user
    }
  }, []);

  const fetchPosts = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5000/posts/${userId}`);
      const postsWithUserDetails = response.data.map(async (post) => {
        const userResponse = await axios.get(`http://localhost:5000/users/${post.user}`);
        return { ...post, user: userResponse.data };
      });
      const postsData = await Promise.all(postsWithUserDetails);
      setPosts(postsData); // Set the posts for the user
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };
  
  const fetchUserProfile = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5000/users/${userId}`);
      setProfilePicture(`http://localhost:5000/uploads/${response.data.profilePicture}`);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchFriendList = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5000/friends/${userId}`);
      setFriendList(response.data); // Set the friend list for the user
    } catch (error) {
      console.error('Error fetching friend list:', error);
    }
  };

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
        console.error('User data not found');
        return;
      }

      // Check if image and caption are present
      if (!image || !caption) {
        console.error('Image or caption is missing');
        return;
      }

      const formData = new FormData();
      formData.append('image', image); // Append the image file
      formData.append('caption', caption); // Append the caption
      formData.append('userId', userData.userId); // Append the userId

      // Make a POST request to the server to store the post
      const response = await axios.post('http://localhost:5000/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data' // Set the content type for FormData
        }
      });

      if (response.status === 201) {
        setStatus('Post stored successfully!');
        fetchPosts(userData.userId); // Refresh posts after posting
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
        <Navbar profilePicture={profilePicture} />
        <div className="profile-section">
          <div className="profile-left-section">
            <div className="profile-heading third-font">Friend <span className='color'>List</span></div>
            <div className="profile-friend-list">
              {friendList.map((friend) => (
                <div key={friend._id} style={{ textAlign: 'center', marginTop: '20px', padding: '10px', border: '2px solid #16a085', borderRadius: '5px' }}>
                  <div style={{ marginBottom: '2px' }}>
                    <img src={`http://localhost:5000/uploads/${friend.profilePicture}`} alt="Profile" style={{ width: '150px', height: '150px', borderRadius: '10%', marginBottom: '10px' }} />
                  </div>
                  <p style={{ fontWeight: 'bold', marginBottom: '10px' }}>{friend.name}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="profile-right-section">
            <div className="profile-info">
              <div>
              <div className="profile-heading third-font">New <span className='color'>Post</span></div>
                <h3 style={{marginTop: '30px'}}>Enter the Image : </h3>
                <input type="file" onChange={handleImageChange} style={{marginBottom: '30px'}} />
                <input type="text" value={caption} onChange={handleCaptionChange} placeholder="Enter caption" style={{width: 'calc(100% - 80px)', padding: '8px', borderRadius: '5px', border: '2px solid #16a085', marginBottom: '10px'}} />
                <button onClick={handlePost} style={{backgroundColor: '#16a085', color: '#fff', padding: '10px', borderRadius: '5px', border: 'none', marginBottom: '50px', marginLeft:'10px'}}>Post</button>
                {status && <div className="status">{status}</div>}
              </div>
              <div className="post-grid">
                {posts.map((post) => (
                  <div key={post._id} className="post">
                    <div className="user-profile profile-pic icons2">
                      <img src={`http://localhost:5000/uploads/${post.user.profilePicture}`} alt="Profile" className="profile-picture" />
                      <span style={{fontWeight: 'bold', marginLeft: '10px'}}>{post.user.name}</span>
                    </div>
                    <div className="post-caption" style={{fontSize: '25px', marginBottom: '25px'}}>{post.caption}</div>
                    <div className="post-image" style={{  borderRadius: '5px' }}>
                      <img src={`http://localhost:5000/uploads/${post.imagePath}`} alt="Post" className="post-picture" style={{ width: '350px', height: 'auto',border:'1px solid #16a085', borderRadius: '5px', marginBottom: '50px', boxShadow:'0px 2px 4px rgba(0, 0, 0, 0.1)'}} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>

    
  );
};

export default Profile;

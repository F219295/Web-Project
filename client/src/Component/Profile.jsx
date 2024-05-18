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
  const [menuVisible, setMenuVisible] = useState({}); // State to manage menu visibility for each post
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState({}); // State to manage delete confirmation visibility

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

  const toggleMenu = (postId) => {
    setMenuVisible(prevState => ({
      ...prevState,
      [postId]: !prevState[postId]
    }));
    setDeleteConfirmationVisible({}); // Close delete confirmation on opening menu
  };

  const toggleDeleteConfirmation = (postId) => {
    setDeleteConfirmationVisible(prevState => ({
      ...prevState,
      [postId]: !prevState[postId]
    }));
    setMenuVisible({}); // Close menu on opening delete confirmation
  };

  const handleUpdate = async (postId) => {
    try {
      // Fetch post data for the given postId
      const response = await axios.get(`http://localhost:5000/posts/${postId}`);
      const postData = response.data;
  
      // Store post data and userId in sessionStorage to access them on the update page
      sessionStorage.setItem('postId', postId);
      sessionStorage.setItem('userId', userData.userId);
  
      // Navigate to the update page
      window.location.href = '/Update';
    } catch (error) {
      console.error('Error updating post:', error);
      setStatus('Failed to update post.');
    }
  };
  

  const handleDelete = async (postId) => {
    try {
      // Make a DELETE request to delete the post
      const response = await axios.delete(`http://localhost:5000/posts/${postId}`);

      if (response.status === 200) {
        setStatus('Post deleted successfully!');
        fetchPosts(userData.userId); // Refresh posts after deleting
      } else {
        setStatus('Failed to delete post.');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      setStatus('Failed to delete post.');
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
                  <img src={`http://localhost:5000/uploads/${friend.profilePicture}`} alt="Profile" style={{ width: '150px', height: '150px', borderRadius: '10%', marginBottom: '10px', border:'5px solid #c3eae2' }} />
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
                    <div className="user-profile profile-pic icons3">
                      <img src={`http://localhost:5000/uploads/${post.user.profilePicture}`} alt="Profile" className="profile-picture" />
                      <span style={{fontWeight: 'bold', marginLeft: '10px'}}>{post.user.name}</span>
                      <i className="fas fa-ellipsis-vertical" style={{marginLeft: 'auto', cursor: 'pointer',marginLeft:'220px', fontSize:'22px', paddingTop:'10px'}} onClick={() => toggleMenu(post._id)}></i>
                      {menuVisible[post._id] && (
                        <>
                          <div className="menu-overlay" onClick={() => toggleMenu(post._id)} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0, 0, 0, 0.5)', zIndex: 998 }}></div>
                          <div className="menu" style={{ padding: '30px', backgroundColor: '#fff', borderRadius: '5px', position: 'absolute', top: '80%', left: '70%', transform: 'translate(-50%, -50%)', zIndex: '999', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <button onClick={() => handleUpdate(post._id)} style={{ backgroundColor: '#16a085', color: '#fff', padding: '8px 16px', borderRadius: '25px', border: 'none', margin: '5px 0', cursor: 'pointer' }}>Update</button>
                            <button onClick={() => toggleDeleteConfirmation(post._id)} style={{ backgroundColor: '#e74c3c', color: '#fff', padding: '8px 16px', borderRadius: '25px', border: 'none', margin: '5px 0', cursor: 'pointer' }}>Delete</button>
                            <button onClick={() => toggleMenu(post._id)} style={{ backgroundColor: '#ccc', color: 'black', padding: '8px 16px', borderRadius: '25px', border: 'none', margin: '5px 0', cursor: 'pointer' }}>Close</button>
                          </div>
                        </>
                      )}
                      {deleteConfirmationVisible[post._id] && (
                        <>
                          <div className="menu-overlay" onClick={() => toggleDeleteConfirmation(post._id)} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0, 0, 0, 0.5)', zIndex: 998 }}></div>
                          <div className="menu" style={{ padding: '30px', backgroundColor: '#fff', borderRadius: '5px', position: 'absolute', top: '80%', left: '70%', transform: 'translate(-50%, -50%)', zIndex: '999', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <p>Are you sure you want to delete this post?</p>
                            <button onClick={() => handleDelete(post._id)} style={{ backgroundColor: '#e74c3c', color: '#fff', padding: '8px 16px', borderRadius: '25px', border: 'none', margin: '5px 0', cursor: 'pointer' }}>Yes, Delete</button>
                            <button onClick={() => toggleDeleteConfirmation(post._id)} style={{ backgroundColor: '#ccc', color: 'black', padding: '8px 16px', borderRadius: '25px', border: 'none', margin: '5px 0', cursor: 'pointer' }}>Cancel</button>
                          </div>
                        </>
                      )}
                    </div>
                    <div className="post-caption" style={{fontSize: '25px', marginBottom: '25px'}}>{post.caption}</div>
                    <div className="post-image" style={{  borderRadius: '5px' }}>
                      <img src={`http://localhost:5000/uploads/${post.imagePath}`} alt="Post" className="post-picture" style={{ width: '350px', height: 'auto', border: '1px solid #16a085', borderRadius: '5px', marginBottom: '50px', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};
  
export default Profile;

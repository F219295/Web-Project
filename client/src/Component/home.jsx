import React, { useState, useEffect } from 'react';
import Navbar from './Navbar'; // Assuming Navbar component is defined in Navbar.js
import axios from 'axios'; // Import axios for HTTP requests

const Home = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [profilePicture, setProfilePicture] = useState('');
  const [userData, setUserData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [posts, setPosts] = useState([]); // Add posts state

  const usersPerPage = 1;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Retrieve userId from session storage
        const userId = sessionStorage.getItem("userId");
        console.log("User Id from session storage:", userId); // Log userId
  
        // Check if userId is valid
        if (!userId) {
          console.error('User Id not found in session storage');
          return;
        }
  
        // Fetch user data including suggestions
        const response = await axios.get(`http://localhost:5000/users/${userId}`);
        const userData = response.data;
        userData.userId = userId; // Ensure userId is included in userData
  
        // Set user data to state
        setUserData(userData);
  
        // Set profile picture
        setProfilePicture(`http://localhost:5000/uploads/${userData.profilePicture}`);
  
        // Fetch user's suggestions
        const suggestionsResponse = await axios.get('http://localhost:5000/users');
        const suggestionsData = suggestionsResponse.data.filter(user => !userData.friends.includes(user._id));
  
        // Set suggestions to state
        setSuggestions(suggestionsData);
  
        // Fetch friends' posts
        userData.friends.forEach(async (friendId) => {
          await fetchPosts(friendId);
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
  
    fetchUserData();
  }, []);
  
  const fetchPosts = async (userId) => {
    try {
      console.log('Fetching posts for user:', userId);
      const response = await axios.get(`http://localhost:5000/posts/${userId}`);
      console.log('Posts fetched:', response.data); // Log the posts fetched

      // Ensure each post has a user object
      const fetchedPosts = response.data.map(post => ({
        ...post,
        user: post.user || { profilePicture: '', name: 'Unknown User' }
      }));

      setPosts((prevPosts) => [...prevPosts, ...fetchedPosts]);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const addFriend = async (userId, friendId) => {
    try {
      const response = await axios.post(`http://localhost:5000/add-friend`, {
        userId: userId,
        friendId: friendId
      });
      console.log('Friend added. Response:', response.data); // Log response data
      // Update the suggestions list after adding a friend
      const updatedSuggestions = suggestions.filter(user => user.id !== friendId);
      setSuggestions(updatedSuggestions);
    } catch (error) {
      console.error('Error adding friend:', error);
    }
  };
  
  
  // Logic for pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = suggestions.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <Navbar profilePicture={profilePicture} />
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px' }}>
        <div style={{ width: '20%', marginLeft: '2%' }}>
          <h2 className='third-font'><span className='color'>S</span>uggestions:</h2>
          <div>
          {currentUsers.map((user) => (
  <div key={user._id} style={{ textAlign: 'center', marginTop: '20px', padding: '10px', border: '2px solid #16a085', borderRadius: '5px' }}>
    <div style={{ marginBottom: '2px' }}>
      <img src={`http://localhost:5000/uploads/${user.profilePicture}`} alt="Profile" style={{ width: '150px', height: '150px', borderRadius: '10%', marginBottom: '10px' }} />
    </div>
    <p style={{ fontWeight: 'bold', marginBottom: '10px' }}>{user.name}</p>
    <button onClick={() => addFriend(userData?.userId, user._id)} style={{ backgroundColor: '#16a085', color: '#fff', padding: '8px 16px', borderRadius: '5px', border: 'none' }}>Add Friend</button>
  </div>
))}

          </div>
          <div style={{ marginTop: '20px' }}>
            {Array.from({ length: Math.ceil(suggestions.length / usersPerPage) }, (_, i) => (
              <button key={i} onClick={() => paginate(i + 1)} style={{ padding: '5px 10px', margin: '0 5px', backgroundColor: '#16a085', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      
        <div style={{ width: '70%' }}>
        <h2 className='third-font'><span className='color'>F</span>riends Post:</h2>
          <div className="profile-right-section">
            <div className="profile-info">
              <div>
                {userData && userData.status && <div className="status">{userData.status}</div>}
              </div>
              <div className="post-grid">
                {posts.map((post) => (
                  <div key={post._id} className="post">
                    <div className="user-profile profile-pic icons2">
                      <img src={`http://localhost:5000/uploads/${post.user.profilePicture}`} alt="Profile" className="profile-picture" />
                      <span style={{ fontWeight: 'bold', marginLeft: '10px' }}>{post.user.name}</span>
                    </div>
                    <div className="post-caption" style={{ fontSize: '25px', marginBottom: '25px' }}>{post.caption}</div>
                    <div className="post-image" style={{ borderRadius: '5px' }}>
                      <img src={`http://localhost:5000/uploads/${post.imagePath}`} alt="Post" className="post-picture" style={{ width: '350px', height: 'auto', border: '1px solid #16a085', borderRadius: '5px', marginBottom: '50px', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;






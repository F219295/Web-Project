import React, { useState, useEffect } from 'react';
import Navbar from './Navbar'; // Assuming Navbar component is defined in Navbar.js
import axios from 'axios'; // Import axios for HTTP requests

const Home = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [profilePicture, setProfilePicture] = useState('');
  const [userData, setUserData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  useEffect(() => {
    // Fetch user data from the backend
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/users');
        setSuggestions(response.data); // Set user data to state
      
        // Assuming the profile picture is stored in the first user's data
        if (response.data.length > 0) {
          setProfilePicture(response.data[0].profilePicture);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }

      const userId = sessionStorage.getItem("userId");
      console.log("User Id from session storage:", userId);
      if (userId) {
        setUserData({ userId });
        console.log("User Data:", { userId });
        fetchPosts(userId); // Fetch posts for the user
        fetchUserProfile(userId); // Fetch user profile data
      }
    };

    fetchUserData(); // Call the fetchUserData function
  }, []);

  const fetchUserProfile = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5000/users/${userId}`);
      setProfilePicture(`http://localhost:5000/uploads/${response.data.profilePicture}`);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  // Function to fetch posts for the user
  const fetchPosts = async (userId) => {
    try {
      // Fetch posts from the backend using userId
      // Replace this with your actual implementation
      console.log('Fetching posts for user:', userId);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  // Function to handle adding a friend
  const addFriend = async (userId, friendId) => {
    try {
      // Make a POST request to add friend endpoint
      const response = await axios.post(`http://localhost:5000/add-friend`, {
        userId: userId,
        friendId: friendId
      });
      console.log(response.data.message);

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
        <div style={{ width: '25%' }}>
          <h2>Suggestions:</h2>
          <div>
            {/* Map through currentUsers array to render profile pictures, names, and add friend button */}
            {currentUsers.map((user) => (
              <div key={user.id} style={{ textAlign: 'center', marginTop: '20px', padding: '10px', border: '2px solid #16a085', borderRadius: '5px' }}>
                <div style={{ marginBottom: '10px' }}>
                  <img src={`http://localhost:5000/uploads/${user.profilePicture}`} alt="Profile" style={{ width: '100px', height: '100px', borderRadius: '50%', marginBottom: '10px' }} />
                </div>
                <p style={{ fontWeight: 'bold' }}>{user.name}</p>
                <button onClick={() => addFriend(userData.userId, user.id)} style={{ backgroundColor: '#16a085', color: '#fff', padding: '8px 16px', borderRadius: '5px', border: 'none' }}>Add Friend</button>
              </div>
            ))}
          </div>
          {/* Pagination */}
          <div style={{ marginTop: '20px' }}>
            {Array.from({ length: Math.ceil(suggestions.length / usersPerPage) }, (_, i) => (
              <button key={i} onClick={() => paginate(i + 1)} style={{ padding: '5px 10px', margin: '0 5px', backgroundColor: '#16a085', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                {i + 1}
              </button>
            ))}
          </div>
        </div>
        <div style={{ width: '50%', textAlign: 'center' }}>
          {/* Place your content here */}
        </div>
        <div style={{ width: '25%' }}>
          <h2>Right Side</h2>
        </div>
      </div>
    </div>
  );
};

export default Home;

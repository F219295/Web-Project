import React, { useState, useEffect } from "react";
import axios from "axios";


const Admin = () => {
  const [users, setUsers] = useState([]);


  useEffect(() => {
    // Fetch user data from the server
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/users");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  const handleViewPassword = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5000/users/${userId}`);
      const hashedPassword = response.data.password;
  
      // Decrypt the hashed password (assuming no encryption, just hashing)
      // Display the decrypted password
      alert(`Password: ${hashedPassword}`);
    } catch (error) {
      console.error("Error viewing password:", error);
    }
  };
 
  

  const handleUpdateUser = (userId) => {
    // Redirect to the update user page
    sessionStorage.setItem("userId", userId);
    window.location.href = '/AdminUpdate';
  };
  

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:5000/users/${userId}`);
      setUsers(users.filter((user) => user._id !== userId));
      alert("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div style={{ margin: '10px 0', padding: '30px' }}>
      <div className="profile-heading third-font" style={{ marginBottom: '20px', fontSize: '24px', color: '#333' }}>Admin <span className='color'>Panel</span></div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ padding: '10px', backgroundColor: '#f2f2f2', color: '#333', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Name</th>
            <th style={{ padding: '10px', backgroundColor: '#f2f2f2', color: '#333', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Username</th>
            <th style={{ padding: '10px', backgroundColor: '#f2f2f2', color: '#333', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Email</th>
            <th style={{ padding: '10px', backgroundColor: '#f2f2f2', color: '#333', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Password</th>
            <th style={{ padding: '10px', backgroundColor: '#f2f2f2', color: '#333', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Profile Picture</th>
            <th style={{ padding: '10px', backgroundColor: '#f2f2f2', color: '#333', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>{user.name}</td>
              <td style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>{user.username}</td>
              <td style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>{user.email}</td>
              <td style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>*****</td> {/* Display masked password */}
              <td style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>
                <img  src={`http://localhost:5000/uploads/${user.profilePicture}`}  alt="Profile" style={{ maxWidth: '80px', maxHeight: '50px' }} />
              </td>
              <td style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>
                <button onClick={() => handleViewPassword(user._id)} style={{ marginRight: '10px', padding: '5px 10px', backgroundColor: '#16a085', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>View Password</button>
                <button onClick={() => handleUpdateUser(user._id)} style={{ marginRight: '10px', padding: '5px 10px', backgroundColor: '#16a085', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Update</button>
                <button onClick={() => handleDeleteUser(user._id)} style={{ padding: '5px 10px', backgroundColor: '#f00', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Admin;

import React, { useState } from 'react';
import './home.css'; // Make sure to import your CSS file

// Navbar Component
function Navbar() {
    const [showSettingsMenu, setShowSettingsMenu] = useState(false);
    const [darkMode, setDarkMode] = useState(false);

    const toggleSettingsMenu = () => {
        setShowSettingsMenu(!showSettingsMenu);
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    return (
        <nav>
            <div className="nav_left">
                <img src="images/logo.png" alt="Logo" className="logo" />
                <ul>
                    <li><img src="images/notification.png" alt="notification" /></li>
                    <li><img src="images/inbox.png" alt="inbox" /></li>
                    <li><img src="images/video.png" alt="video" /></li>
                </ul>
            </div>
            <div className="nav_right">
                <div className="search_box">
                    <img src="images/search.png" alt="search" />
                    <input type="search" placeholder="Search" />
                </div>
                <div className={`nav_user_icon ${showSettingsMenu ? 'online_icon' : ''}`} onClick={toggleSettingsMenu}>
                    <img src="images/profile-pic.png" alt="profile" />
                </div>
            </div>
            <div className={`setting_menu ${showSettingsMenu ? 'setting_menu_height' : ''}`}>
                <div id="dark_btn" className={`dark_btn ${darkMode ? 'dark_btn_on' : ''}`} onClick={toggleDarkMode}>
                    <span></span>
                </div>
                {/* Setting Menu Content */}
            </div>
        </nav>
    );
}

// Main Content Component
function MainContent() {
    const [postValue, setPostValue] = useState('');

    const handleInputChange = (e) => {
        setPostValue(e.target.value);
    };

    const handlePostClick = () => {
        // Handle post action
    };

    return (
        <div className="container">
            {/* Left Sidebar Component */}
            {/* Main Content Component */}
            <div className="main_content">
                {/* Story Gallery Component */}
                <div className="story_gallery">
                    {/* Story Components */}
                </div>
                <div className="post_container">
                    {/* Post Input Container */}
                    <input id="input_vlaue" value={postValue} onChange={handleInputChange} placeholder="What's on Your Mind" />
                    <button id="button_value" onClick={handlePostClick}>Post</button>
                    {/* Add Post Link Component */}
                </div>
                {/* Post Components */}
                {/* Load More Button */}
                <button type="button" className="our_btn">Load More</button>
                <footer>
                    <p>Copyright 2022 - Easy Tutorial Youtube Channel</p>
                </footer>
            </div>
            {/* Right Sidebar Component */}
        </div>
    );
}

// Root Component
function Home() {
    return (
        <>
            <Navbar />
            <MainContent />
        </>
    );
}

export default Home;

import React, { useState, useEffect } from "react";
import axios from "axios";

function PostForm({ user }) {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("caption", caption);
      formData.append("userId", user.id); // Assuming user object has id field

      // Send post request to server to save image and caption
      await axios.post("http://localhost:5000/post", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Clear form fields after successful submission
      setCaption("");
      setImage(null);

      // Refresh posts after submitting new post
      // Implement this function based on how you fetch existing posts
    } catch (error) {
      console.error("Error submitting post:", error);
    }
  };

  return (
    <div>
      <h2>Post Now</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="caption">Caption:</label>
          <input
            type="text"
            id="caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="image">Image:</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>
        <button type="submit">Post</button>
      </form>
    </div>
  );
}

function Post({ post }) {
  const [likes, setLikes] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState(post.comments);

  const handleLike = async () => {
    // Send request to server to toggle like status
    try {
      // Example implementation: toggle like status based on user's previous action
      if (isLiked) {
        // Unlike post
        setLikes((prevLikes) => prevLikes - 1);
        setIsLiked(false);
      } else {
        // Like post
        setLikes((prevLikes) => prevLikes + 1);
        setIsLiked(true);
      }

      // Update like status in the database
      // Implement this based on your server logic
    } catch (error) {
      console.error("Error toggling like status:", error);
    }
  };

  const handleComment = () => {
    // Implement functionality to add comments
  };

  return (
    <div className="post">
      <img src={post.imageURL} alt="Post" />
      <p>{post.caption}</p>
      <div>
        <button onClick={handleLike}>
          {isLiked ? "Unlike" : "Like"} ({likes})
        </button>
        <button onClick={handleComment}>Comment</button>
      </div>
      <div>
        {/* Display comments */}
        {comments.map((comment) => (
          <div key={comment._id}>
            <p>{comment.text}</p>
            {/* Display commenter's name */}
          </div>
        ))}
      </div>
    </div>
  );
}

function Home({ user }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Fetch posts from the server when the component mounts
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      // Fetch posts from the server
      const response = await axios.get("http://localhost:5000/posts");
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  return (
    <div>
      <PostForm user={user} />
      <h2>Existing Posts</h2>
      <div className="post-container">
        {posts.map((post) => (
          <Post key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
}

export default Home;

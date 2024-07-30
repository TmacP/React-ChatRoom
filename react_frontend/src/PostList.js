// PostList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navigation from './Navigation';
import { useParams } from 'react-router-dom';
import CreatePost from './CreatePost';
import Reply from './Reply'; // Import the Reply component


const PostList = () => {
  const { channelID } = useParams();
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null); // Track the selected post for reply

  useEffect(() => {
    axios.get(`http://0.0.0.0:8080/getposts/${channelID}`)
      .then(response => setPosts(response.data.posts))
      .catch(error => console.error(error));
  }, [channelID]);

  const organizePosts = (posts) => {
    const postMap = new Map();
  
    // First pass: Create a map of posts and their replies
    posts.forEach(post => {
      const parentId = post.parent_id !== null ? post.parent_id : 'root';
      if (!postMap.has(parentId)) {
        postMap.set(parentId, { post: [], replies: [] });
      }
  
      if (post.parent_id !== null) {
        postMap.get(parentId).replies.push(post);
      } else {
        postMap.get(parentId).post.push(post);
      }
    });
  
    // Second pass: Link replies to their parent posts
    posts.forEach(post => {
      const parentId = post.parent_id !== null ? post.parent_id : 'root';
      if (postMap.has(post.id)) {
        post.replies = postMap.get(post.id).replies;
      }
    });
  
    return postMap.get('root') ? postMap.get('root').post : [];
  };
  
  const organizedPosts = organizePosts(posts);

  const renderPosts = (posts) => {
    return posts.map(post => (
      <li key={post.id}>
        {/* Display post content */}
        {post.topic} - {post.data}
  
        {/* Display post image if available */}
        {post.image && (
          <div>
            {/* <img src={`http://localhost:8080/public/testimage.png`} alt="Post Image" />} */}
            <img
              src={`http://localhost:8080/` + post.image}
              alt="Post Image"
              style={{ width: '500px', height: 'auto' }}
              onLoad={() => console.log(`Image loaded successfully for post ${post.id}: ${post.image}`)}
              onError={() => console.error(`Error loading image for post ${post.id}: ${post.image}`)}
            />
          </div>
        )}
  
        {/* Button to trigger reply */}
        <button onClick={() => setSelectedPost(post.id)}>Reply</button>
  
        {selectedPost === post.id && (
          <Reply
            selectedChannel={channelID}
            parentID={post.id}
            onReply={() => setSelectedPost(null)} // Reset selected post after replying
          />
        )}
  
        {/* Display replies */}
        {post.replies && post.replies.length > 0 && (
          <ul>{renderPosts(post.replies)}</ul>
        )}
      </li>
    ));
  };
  

  return (
    <div>
      <Navigation />
      <CreatePost selectedChannel={channelID} />
      <h2>Responses</h2>
      <ul>{renderPosts(organizedPosts)}</ul>
    </div>
  );
};

export default PostList;
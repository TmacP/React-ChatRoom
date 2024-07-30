// CreatePost.js
import React, { useState } from 'react';
import axios from 'axios';

const CreatePost = ({ selectedChannel, selectedPost }) => {

  const [data, setData] = useState('');
  const [image, setImage] = useState(null);
  

  const addPost = () => {
    const parentID = selectedPost || null;
    const formData = new FormData();
    formData.append('channelID', selectedChannel);
    formData.append('parentID', parentID);
    formData.append('data', data);
    formData.append('image', image); // Append image file

    axios.post('http://0.0.0.0:8080/addpost', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then((response) => {
        console.log(response.data);
        window.location.reload();
      })
      .catch((error) => console.error(error));
  };


  return (
    <div>
      {/* Existing code... */}
      <div>
        <h2>Ask Question</h2>
        <label>
          Question:
          <input type="text" value={data} onChange={e => setData(e.target.value)} />
        </label>

        <label>
          Image:
          <input type="file" onChange={e => setImage(e.target.files[0])} />
        </label>

        <button onClick={addPost}>Ask</button>
      </div>
    </div>
  );
};

export default CreatePost;

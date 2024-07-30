// Reply.js
import React, { useState } from 'react';
import axios from 'axios';
import VoteButtons from './VoteButtons'; // Import the VoteButtons component

const Reply = ({ selectedChannel, parentID, onReply }) => {
  const [reply, setReply] = useState('');
  const [image, setImage] = useState(null);

  const addReply = () => {
    const formData = new FormData();
    formData.append('channelID', selectedChannel);
    formData.append('parentID', parentID);
    formData.append('topic', ''); // Assuming replies don't have a separate topic
    formData.append('data', reply);
    formData.append('image', image); // Append image file

    axios.post('http://0.0.0.0:8080/addpost', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(response => {
        console.log(response.data);
        onReply(); // Notify the parent component that a reply has been added
        setReply(''); // Clear the input field after adding the reply
        window.location.reload();
      })
      .catch(error => console.error(error));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      addReply();
    }
  };

  return (
    <div>
      <label>
        Reply to:
        <input
          type="text"
          value={reply}
          onChange={e => setReply(e.target.value)}
          onKeyDown={handleKeyDown} // Trigger addReply on Enter key press
        />
      </label>

      <label>
        Image:
        <input type="file" onChange={e => setImage(e.target.files[0])} />
      </label>

      <button onClick={addReply}>Add Reply</button>

      {/* Render the VoteButtons component */}
      <VoteButtons />
    </div>
  );
};

export default Reply;

// CreateChannel.js
import React, { useState } from 'react';
import axios from 'axios';
import Navigation from './Navigation';

const ChannelForm = ({ onAddChannel }) => {
  const [channelName, setChannelName] = useState('');

  const addChannel = () => {
    axios.post('http://0.0.0.0:8080/addchannel', { channelName })
      .then(response => {
        console.log(response.data);
        onAddChannel();
      })
      .catch(error => console.error(error));
  };

  return (
    <div>
      <Navigation />
      <h2>Create Channel</h2>
      <label>
        Channel Name:
        <input type="text" value={channelName} onChange={e => setChannelName(e.target.value)} />
      </label>
      <button onClick={addChannel}>Add Channel</button>
    </div>
  );
};

export default ChannelForm;

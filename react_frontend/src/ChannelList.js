// ChannelList.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';
import Navigation from './Navigation';
import CreatePost from './CreatePost'; // Import the CreatePost component
import PostList from './PostList';
import CreateChannel from './CreateChannel';

const ChannelList = () => {
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);
    const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://0.0.0.0:8080/getchannels')
      .then(response => setChannels(response.data.channels))
      .catch(error => console.error(error));
  }, []);

  const handleChannelClick = (channel) => {
    setSelectedChannel(channel);
    navigate(`/PostList/${channel.id}`); // Navigate to the PostsList route
  };

  return (
    <div>
      <Navigation />
      <h2>Channels</h2>
      <ul>
        {channels.map(channel => (
          <li key={channel.id} onClick={() => handleChannelClick(channel)}>
            {channel.channel_name}
          </li>
        ))}
      </ul>
      {selectedChannel && (
        <div>
          <PostList channelID={selectedChannel.id} channel_name={selectedChannel.channel_name} />
          <CreatePost selectedChannel={selectedChannel} />

        </div>
      )}
    </div>
  );
};

export default ChannelList;

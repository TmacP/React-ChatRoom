// Navigation.js
import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/ChannelList">Channels</Link>
        </li>
        <li>
          <Link to="/CreateChannel">Create</Link>
        </li>
        <li>
          <Link to="/AuthPage">Login</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;

// LandingPage.js

import React from 'react';
import Navigation from './Navigation'; // Import your Navigation component

const LandingPage = () => {
  return (
    <div>
      <Navigation /> {/* Render the Navigation component */}
      <h1>Welcome to the Channel-Based Programming Tool!</h1>
      <h2>Key Features:</h2>
        <ul>
          <li>Post programming questions and receive responses from the community.</li>
          <li>Create channels to organize discussions on specific topics.</li>
          <li>Engage in conversations by posting messages and replies.</li>
          <li>Rate posts with a thumbs-up/down.</li>
          <li>Search for content.</li>
        </ul>
        <h2>Get Started:</h2>
        <p>
          To begin, Register for an account. Explore the various channels or create a new one. Engage in discussions by posting questions or providing answers. Use the search feature to find relevant content, and don't forget to rate and rank posts to contribute to the community's knowledge!
        </p>
    </div>
  );
};

export default LandingPage;

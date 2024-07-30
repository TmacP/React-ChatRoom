// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './LandingPage';
import PostList from './PostList'; 
import CreatePost from './CreatePost';
import ChannelList from './ChannelList';
import CreateChannel from './CreateChannel';
import RegisterForm from './RegisterForm';
import LoginForm from './LoginForm';
import AuthPage from './AuthPage';
import './App.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/PostList/:channelID" element={<PostList />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/CreatePost" element={<CreatePost />} />
        <Route path="/ChannelList" element={<ChannelList />} />
        <Route path="/CreateChannel" element={<CreateChannel />} />
        <Route path="/RegisterForm" element={<RegisterForm />} /> 
        <Route path="/LoginForm" element={<LoginForm />} />
        <Route path="/AuthPage" element={<AuthPage />} />
      </Routes>
    </Router>
  );
};

export default App;

import React, { useState } from 'react';
import Navigation from './Navigation';

const LoginForm = ({ onToggleForm }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include', // Include credentials (cookies) in the request
      });

      if (response.ok) {
        console.log('Login successful');
        // Redirect or perform other actions after successful login
      } else {
        console.error('Error during login');
      }
    } catch (error) {
      console.error('Error during login', error);
    }
  };

  return (
    <div>
      <Navigation />
      {/* Login Section */}
      <div>
        <p>Login</p>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
        <p onClick={onToggleForm}>Don't have an account? Register here.</p>
      </div>
    </div>
  );
};

export default LoginForm;

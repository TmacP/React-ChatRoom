import React, { useState } from 'react';
import Navigation from './Navigation';

const RegisterForm = ({ onToggleForm }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleRegister = async () => {
    try {
      const response = await fetch('http://localhost:8080/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, name }),
      });

      if (response.ok) {
        console.log('User registered successfully');
        // Show an alert for successful registration
        alert('User registered successfully');
        // Clear input fields
        setUsername('');
        setPassword('');
        setName('');
      } else {
        console.error('Error registering user');
      }
    } catch (error) {
      console.error('Error registering user', error);
    }
  };

  return (
    <div>
      <Navigation />
      {/* Registration Section */}
      <div>
        <p>Create Account</p>
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
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button onClick={handleRegister}>Register</button>
        <p onClick={onToggleForm}>Already have an account? Login here.</p>
      </div>
    </div>
  );
};

export default RegisterForm;

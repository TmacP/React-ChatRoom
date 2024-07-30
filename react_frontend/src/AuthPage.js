import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const AuthPage = () => {
  const [isRegistering, setIsRegistering] = useState(false);

  const toggleForm = () => {
    setIsRegistering(!isRegistering);
  };

  return (
    <div>
      {isRegistering ? (
        <RegisterForm onToggleForm={toggleForm} />
      ) : (
        <LoginForm onToggleForm={toggleForm} />
      )}
    </div>
  );
};

export default AuthPage;

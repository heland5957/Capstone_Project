import React from 'react';

const Login = ({ onLogin }) => {
  const handleLogin = () => {
    const username = prompt('Please enter your username:');
    const password = prompt('Please enter your password:');

    // Admin login
    if (username === 'admin' && password === 'admin') {
      onLogin(username); // Pass the username to onLogin
    } else {
      alert('Invalid credentials. Please try again.');
    }
  };

  return (
    <div>
      <button onClick={handleLogin} className="login-btn">User Login</button>
    </div>
  );
};

export default Login;

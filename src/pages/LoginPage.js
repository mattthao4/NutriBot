import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css'; // We will create this file next

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }

    // Hardcoded credentials
    const hardcodedUsername = 'testUser';
    const hardcodedPassword = 'password123';

    if (username === hardcodedUsername && password === hardcodedPassword) {
      // Simulate successful login
      console.log('Login successful');

      const hasCompletedOnboarding = localStorage.getItem('hasCompletedOnboarding');

      if (!hasCompletedOnboarding) {
        // For first-time users, navigate to the start of the onboarding flow.
        // The 'hasCompletedOnboarding' flag will be set at the END of the full onboarding process.
        navigate('/onboarding/goals'); 
      } else {
        navigate('/');
      }
    } else {
      setError('Invalid username or password.');
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-form-card">
        <div className="login-header">
          {/* You can add a logo or icon here if desired, similar to onboarding */}
          <img src="/nutribot-logo-placeholder.png" alt="NutriBot Logo" className="login-logo" />
          <h2>Welcome Back!</h2>
          <p>Please login to continue to NutriBot.</p>
        </div>
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g., testUser"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="e.g., password123"
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="login-button">Login</button>
        </form>
        {/* Optional: Links for "Forgot Password?" or "Create Account" can go here */}
      </div>
    </div>
  );
};

export default LoginPage; 
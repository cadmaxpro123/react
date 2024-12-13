import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignIn.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import companyLogo from './images/cadmax.png';
import githubLogo from './images/github.jfif';
import facebookLogo from './images/facebook.jfif';
import googleLogo from './images/google.jfif';
import appleLogo from './images/apple.jfif';
import { FaCaretDown } from 'react-icons/fa';

const SignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [organizationUrl, setOrganizationUrl] = useState('');
  const [showFields, setShowFields] = useState(false);
  const [showOrgField, setShowOrgField] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Send a POST request to the login API
    const response = await fetch('https://kugtde.zapto.org/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
        remember_me: rememberMe,
      }),
    });

    if (response.ok) {
      // Parse the response to get the token (assuming the response contains the token)
      const data = await response.json();
      const access_token = data.access_token; // Get the access token from the response
      // const token_type = data.token_type;     // Get the token type (usually "bearer")

      // Store the access token and token type in localStorage
      localStorage.setItem('token', access_token);
      // Navigate to the dashboard after successful login
      navigate('/dashboard');
    } else {
      // Handle login failure
      alert('Login failed');
    }
  };


  const handleOrgSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('/api/org-login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        organization_url: organizationUrl,
        remember_me: rememberMe,
      }),
    });

    if (response.ok) {
      navigate('/dashboard');
    } else {
      // Handle organization URL login error here
      alert('Organization login failed');
    }
  };

  const handleCadmaxClick = () => {
    if (showFields) {
      setShowFields(false);
    } else {
      setShowFields(true);
      setShowOrgField(false);
    }
  };

  const handleOrgClick = () => {
    if (showOrgField) {
      setShowOrgField(false);
    } else {
      setShowOrgField(true);
      setShowFields(false);
    }
  };

  return (
    <div className="sign-in-container">
      <div className="sign-in-box">
        <img src={companyLogo} alt="Company Logo" className="company-logo" />

        <div className="sign-in-form">
          <h2>Sign In</h2>

          <div className="dropdown-btn" onClick={handleCadmaxClick}>
            <span>Cadmax Login</span>
            <FaCaretDown />
          </div>

          {showFields && !showOrgField && (
            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="username">Name:</label>
                <input
                  id="username"
                  className="input-field"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  required
                />
              </div>
              <div>
                <label htmlFor="password">Password:</label>
                <div className="password-container">
                  <input
                    id="password"
                    className="input-field"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                  <span
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>
              <div className="checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label> Keep me signed in</label>
              </div>
              <button className="submit-btn" type="submit">Sign In</button>
            </form>
          )}

          <div className="dropdown-btn" onClick={handleOrgClick}>
            <span>Organization URL</span>
            <FaCaretDown />
          </div>

          {showOrgField && !showFields && (
            <form onSubmit={handleOrgSubmit}>
              <div>
                <label htmlFor="org-url">Link:</label>
                <input
                  id="org-url"
                  className="input-field"
                  type="text"
                  value={organizationUrl}
                  onChange={(e) => setOrganizationUrl(e.target.value)}
                  placeholder="Enter Organization URL"
                  required
                />
              </div>
              <div className="checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label> Remember this URL</label>
              </div>
              <button className="submit-btn" type="submit">Continue</button>
            </form>
          )}

          <hr className="org-logos-divider" />

          <div className="logos-container">
            <img
              src={githubLogo}
              alt="GitHub"
              className="logo"
              onClick={() => window.location.href = 'https://github.com'}
            />
            <div className="logo-divider"></div>
            <img
              src={facebookLogo}
              alt="Facebook"
              className="logo"
              onClick={() => window.location.href = 'https://facebook.com'}
            />
            <div className="logo-divider"></div>
            <img
              src={googleLogo}
              alt="Google"
              className="logo"
              onClick={() => window.location.href = 'https://google.com'}
            />
            <div className="logo-divider"></div>
            <img
              src={appleLogo}
              alt="Apple"
              className="logo"
              onClick={() => window.location.href = 'https://apple.com'}
            />
          </div>

          <div className="no-account-text">
            No account? <a href="http://cadmaxpro.com/index.html" target="_blank" rel="noopener noreferrer">Create an account</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;

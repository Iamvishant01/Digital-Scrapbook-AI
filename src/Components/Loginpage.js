// src/components/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/welcome', { state: { name } });
  };

  return (
    <div className="Login-Container">
        <form class="form" onSubmit={handleSubmit}>
          <p class="form-title">Ready to Relive Your Memories ☺️ ?</p>
            <div class="input-container">
              <input type="text"             value={name}
                    onChange={(e) => setName(e.target.value)}
                    required placeholder="Enter your name"/>
              <span>
              </span>
          </div>
          <div class="input-container">
              <input type="email" required placeholder="Enter email"/>
            </div>
            <button type="submit" class="submit">Let’s Scrap It 😍 !</button>
          <p class="signup-link">we don't save your information or history</p>
        </form>
    </div>
    
  );
};

export default LoginPage;

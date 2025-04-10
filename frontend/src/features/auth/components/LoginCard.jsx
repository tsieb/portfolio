// File: /frontend/src/features/auth/components/LoginCard.jsx
// Login card component

import { Link } from 'react-router-dom';
import { FaHeadphones, FaMusic } from 'react-icons/fa';

const LoginCard = ({ onMusicLogin }) => {
  return (
    <div className="card mx-auto" style={{ maxWidth: '450px' }}>
      <div className="card__header">
        <div className="flex-center mb-md">
          <FaHeadphones className="text-electric-cyan" style={{ fontSize: '3rem' }} />
        </div>
        <h1 className="text-center">Welcome to Music Activity</h1>
        <p className="text-center text-secondary mb-lg">Share your listening habits with the world</p>
      </div>
      
      <div className="card__body">
        <button 
          onClick={onMusicLogin}
          className="btn btn-gradient w-full mb-lg"
          aria-label="Continue with Music Service"
        >
          <FaMusic className="mr-sm" />
          Continue with Music Service
        </button>
        
        <div className="text-center text-small text-tertiary">
          <p>By continuing, you agree to our <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>.</p>
          <p>We'll never post to your account without your permission.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginCard;
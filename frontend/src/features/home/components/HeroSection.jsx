// File: /frontend/src/features/home/components/HeroSection.jsx
// Hero section component for the homepage

import { FaMusic, FaChevronDown } from 'react-icons/fa';
import CurrentlyPlaying from '../../spotify/components/CurrentlyPlaying';

const HeroSection = ({ scrolled, backgroundStyle, onScrollDown }) => {
  return (
    <section 
      className={`hero ${scrolled ? 'hero--scrolled' : ''}`}
      style={backgroundStyle}
    >
      <div className="container">
        <div className="hero__content">
          <div className="hero__logo">
            <FaMusic className="text-electric-cyan" />
            <span className="text-gradient">Music Activity</span>
          </div>
          
          <CurrentlyPlaying variant="hero" />
          
          <div className="hero__scroll-indicator" onClick={onScrollDown}>
            <span>Scroll to see more</span>
            <FaChevronDown className="hero__scroll-icon animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
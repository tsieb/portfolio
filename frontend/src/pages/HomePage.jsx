// File: /frontend/src/pages/HomePage.jsx
// Redesigned home page focused on current track with immersive design

import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useSpotify } from '../features/spotify/hooks/useSpotify';
import CurrentlyPlaying from '../features/spotify/components/CurrentlyPlaying';
import RecentlyPlayed from '../features/spotify/components/RecentlyPlayed';
import SpotifyStats from '../features/spotify/components/SpotifyStats';
import { FaSpotify, FaUserCircle, FaChevronDown } from 'react-icons/fa';

const HomePage = () => {
  const { currentTrack, isPlaying } = useSpotify();
  const [scrolled, setScrolled] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const mainRef = useRef(null);
  
  // Handle scroll events for UI transitions
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setScrolled(scrollPosition > 50);
      setShowContent(scrollPosition > window.innerHeight * 0.4);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Scroll down handler for the hero section
  const handleScrollDown = () => {
    if (mainRef.current) {
      window.scrollTo({
        top: window.innerHeight * 0.9,
        behavior: 'smooth'
      });
    }
  };
  
  // Generate background style based on current track
  const getBackgroundStyle = () => {
    if (isPlaying && currentTrack?.albumImageUrl) {
      return {
        backgroundImage: `
          linear-gradient(
            rgba(0, 0, 0, 0.8), 
            rgba(0, 0, 0, 0.7)
          ),
          url(${currentTrack.albumImageUrl})
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      };
    }
    
    return {
      background: 'var(--gradient-dark)'
    };
  };
  
  return (
    <div className="home-page" ref={mainRef}>
      {/* Hero section with fullscreen current track */}
      <section 
        className={`hero ${scrolled ? 'hero--scrolled' : ''}`}
        style={getBackgroundStyle()}
      >
        <div className="hero__container">
          <div className="hero__logo">
            <FaSpotify />
            <span>Music Activity</span>
          </div>
          
          <div className="hero__content">
            <CurrentlyPlaying variant="hero" />
            
            <div className="hero__scroll-indicator" onClick={handleScrollDown}>
              <span>Scroll to see more</span>
              <FaChevronDown className="hero__scroll-icon" />
            </div>
          </div>
        </div>
      </section>
      
      {/* Main content section */}
      <section className={`content ${showContent ? 'content--visible' : ''}`}>
        <div className="container">
          {/* Sticky mini player that appears when scrolled */}
          {isPlaying && currentTrack && (
            <div className={`mini-player ${scrolled ? 'mini-player--visible' : ''}`}>
              <CurrentlyPlaying variant="mini" />
            </div>
          )}
          
          <div className="content__header">
            <h2 className="content__title">My Music Activity</h2>
            <p className="content__description">
              Track what I'm listening to in real-time through Spotify's API.
              <Link to="/login" className="content__cta">
                <FaUserCircle />
                <span>Create your own music profile</span>
              </Link>
            </p>
          </div>
          
          <div className="content__grid">
            <div className="content__section">
              <h3 className="content__section-title">Recent Tracks</h3>
              <RecentlyPlayed />
            </div>
            
            <div className="content__section">
              <h3 className="content__section-title">Listening Stats</h3>
              <SpotifyStats />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
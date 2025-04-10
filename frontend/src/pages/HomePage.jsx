// File: /frontend/src/pages/HomePage.jsx
// Homepage with music activity display

import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useSpotify } from '../features/spotify/hooks/useSpotify';
import CurrentlyPlaying from '../features/spotify/components/CurrentlyPlaying';
import RecentlyPlayed from '../features/spotify/components/RecentlyPlayed';
import SpotifyStats from '../features/spotify/components/SpotifyStats';
import { FaMusic, FaUserCircle, FaChevronDown } from 'react-icons/fa';

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
        <div className="container">
          <div className="hero__content">
            <div className="hero__logo">
              <FaMusic className="text-electric-cyan" />
              <span className="text-gradient">Music Activity</span>
            </div>
            
            <CurrentlyPlaying variant="hero" />
            
            <div className="hero__scroll-indicator" onClick={handleScrollDown}>
              <span>Scroll to see more</span>
              <FaChevronDown className="hero__scroll-icon animate-bounce" />
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
          
          <div className="section-header text-center mb-xl">
            <h2 className="section-title">My Music Activity</h2>
            <p className="section-subtitle">
              Track what I'm listening to in real-time through the music API.
              <Link to="/login" className="btn btn-primary ml-md">
                <FaUserCircle className="mr-xs" />
                <span>Create your own music profile</span>
              </Link>
            </p>
          </div>
          
          <div className="grid grid--cols-2">
            <div className="grid--item">
              <h3 className="mb-md">Recent Tracks</h3>
              <RecentlyPlayed />
            </div>
            
            <div className="grid--item">
              <h3 className="mb-md">Listening Stats</h3>
              <SpotifyStats />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
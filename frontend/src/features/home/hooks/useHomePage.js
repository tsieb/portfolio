// File: /frontend/src/features/home/hooks/useHomePage.js
// Custom hook to manage HomePage state and effects

import { useState, useEffect, useRef } from 'react';
import { useSpotify } from '../../spotify/hooks/useSpotify';

export const useHomePage = () => {
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

  return {
    currentTrack,
    isPlaying,
    scrolled,
    showContent,
    mainRef,
    handleScrollDown,
    getBackgroundStyle
  };
};
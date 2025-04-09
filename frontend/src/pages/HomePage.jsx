// File: /frontend/src/pages/HomePage.jsx
// Enhanced homepage with new theme and effects

import { useEffect, useState } from 'react';
import CurrentlyPlaying from '../features/spotify/components/CurrentlyPlaying';
import RecentlyPlayed from '../features/spotify/components/RecentlyPlayed';
import SpotifyStats from '../features/spotify/components/SpotifyStats';
import { FaSpotify, FaHeadphones, FaUser } from 'react-icons/fa';
import './HomePage.scss';

/**
 * Enhanced home page component with new theme and animations
 */
const HomePage = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Trigger animations after component mount
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="home-page">
      <section className={`hero ${isVisible ? 'hero--visible' : ''}`}>
        <div className="hero__bg-shapes">
          <div className="hero__bg-shape hero__bg-shape--1"></div>
          <div className="hero__bg-shape hero__bg-shape--2"></div>
          <div className="hero__bg-shape hero__bg-shape--3"></div>
        </div>
        
        <div className="hero__content">
          <div className="hero__icon">
            <FaHeadphones />
          </div>
          <h1 className="hero__title">Music Portfolio</h1>
          <p className="hero__description">
            I'm a web developer passionate about creating beautiful and functional applications.
            Check out what I'm currently listening to and my music stats below.
          </p>
          <div className="hero__spotify-badge">
            <FaSpotify className="hero__spotify-icon" />
            <span>Powered by Spotify API</span>
          </div>
        </div>
      </section>
      
      <section className={`section ${isVisible ? 'section--visible' : ''}`}>
        <h2 className="section__title">My Spotify Activity</h2>
        <p className="section__description">
          I love music! Here's what I'm currently listening to and some of my recent tracks.
        </p>
        
        <div className="spotify-widgets">
          <CurrentlyPlaying />
          <RecentlyPlayed />
          <SpotifyStats />
        </div>
      </section>
      
      <section className={`section section--about ${isVisible ? 'section--visible' : ''}`}>
        <div className="about-card">
          <div className="about-card__header">
            <div className="about-card__avatar">
              <FaUser />
            </div>
            <h2 className="about-card__title">About Me</h2>
          </div>
          <div className="about-card__content">
            <p>
              Hi! I'm a web developer with a passion for creating engaging, user-friendly experiences. 
              This portfolio showcases both my development skills and my music taste, pulling real-time 
              data from the Spotify API.
            </p>
            <p>
              This responsive application is built with React for the frontend and Node.js for the backend,
              with a completely custom UI design. It features real-time updates, smooth animations, and 
              a modern dark theme.
            </p>
            <div className="tech-stack">
              <div className="tech-stack__title">Built with:</div>
              <div className="tech-stack__items">
                <span className="tech-stack__item">React</span>
                <span className="tech-stack__item">Node.js</span>
                <span className="tech-stack__item">Express</span>
                <span className="tech-stack__item">MongoDB</span>
                <span className="tech-stack__item">Spotify API</span>
                <span className="tech-stack__item">Chart.js</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
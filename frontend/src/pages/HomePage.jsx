// File: /frontend/src/pages/HomePage.jsx
// Home page component

import CurrentlyPlaying from '../features/spotify/components/CurrentlyPlaying';
import RecentlyPlayed from '../features/spotify/components/RecentlyPlayed';
import SpotifyStats from '../features/spotify/components/SpotifyStats';
import './HomePage.scss';

/**
 * Home page component that displays the user's portfolio information
 * and Spotify listening data
 */
const HomePage = () => {
  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero__content">
          <h1 className="hero__title">Welcome to My Portfolio</h1>
          <p className="hero__description">
            I'm a web developer passionate about creating beautiful and functional applications.
            Check out what I'm currently listening to and my music stats below.
          </p>
        </div>
      </section>
      
      <section className="section">
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
    </div>
  );
};

export default HomePage;
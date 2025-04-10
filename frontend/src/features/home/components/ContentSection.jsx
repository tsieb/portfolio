// File: /frontend/src/features/home/components/ContentSection.jsx
// Content section component for the homepage

import { Link } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import CurrentlyPlaying from '../../spotify/components/CurrentlyPlaying';
import RecentlyPlayed from '../../spotify/components/RecentlyPlayed';
import SpotifyStats from '../../spotify/components/SpotifyStats';

const ContentSection = ({ showContent, scrolled, isPlaying }) => {
  return (
    <section className={`content ${showContent ? 'content--visible' : ''}`}>
      <div className="container">
        {/* Sticky mini player that appears when scrolled */}
        {isPlaying && scrolled && (
          <div className="mini-player mini-player--visible">
            <CurrentlyPlaying variant="mini" />
          </div>
        )}
        
        <div className="section-header text-center mb-xl">
          <h2 className="section-title">My Music Activity</h2>
          <p className="section-subtitle">
            Track what I'm listening to in real-time through the Spotify API.
          </p>
          <div className="mt-lg">
            <Link to="/login" className="btn btn-primary">
              <FaUserCircle className="mr-xs" />
              <span>Create your own music profile</span>
            </Link>
          </div>
        </div>
        
        <div className="grid grid--cols-2 gap-lg">
          <div className="grid__item">
            <h3 className="mb-md">Recent Tracks</h3>
            <RecentlyPlayed />
          </div>
          
          <div className="grid__item">
            <h3 className="mb-md">Listening Stats</h3>
            <SpotifyStats />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContentSection;
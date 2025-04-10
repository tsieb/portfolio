// File: /frontend/src/features/home/components/ContentSection.jsx
// Content section component for the homepage

import { Link } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import CurrentlyPlaying from '../../spotify/components/CurrentlyPlaying';
import RecentlyPlayed from '../../spotify/components/RecentlyPlayed';
import SpotifyStats from '../../spotify/components/SpotifyStats';

const ContentSection = ({ showContent, scrolled, isPlaying, currentTrack }) => {
  return (
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
  );
};

export default ContentSection;
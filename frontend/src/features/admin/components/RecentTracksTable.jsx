// File: /frontend/src/features/admin/components/RecentTracksTable.jsx
// Recent tracks table component

import { FaMusic } from 'react-icons/fa';

const RecentTracksTable = ({ recentTracks }) => {
  if (!recentTracks || recentTracks.length === 0) {
    return (
      <div className="admin-empty">
        <FaMusic />
        <p>No recent tracks found.</p>
      </div>
    );
  }
  
  return (
    <div className="admin-table-container">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Track</th>
            <th>Artist</th>
            <th>Album</th>
            <th>Played At</th>
          </tr>
        </thead>
        <tbody>
          {recentTracks.map(track => (
            <tr key={track._id}>
              <td className="admin-track-cell">
                {track.albumImageUrl && (
                  <img
                    src={track.albumImageUrl}
                    alt={`${track.albumName} cover`}
                    className="admin-track-image"
                  />
                )}
                <span>{track.trackName}</span>
              </td>
              <td>{track.artistName}</td>
              <td>{track.albumName}</td>
              <td>{new Date(track.playedAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentTracksTable;
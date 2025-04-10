// File: /frontend/src/pages/HomePage.jsx
// Homepage with music activity display

import { useHomePage } from '../features/home/hooks/useHomePage';
import HeroSection from '../features/home/components/HeroSection';
import ContentSection from '../features/home/components/ContentSection';

const HomePage = () => {
  const {
    currentTrack,
    isPlaying,
    scrolled,
    showContent,
    mainRef,
    handleScrollDown,
    getBackgroundStyle
  } = useHomePage();

  return (
    <div className="home-page" ref={mainRef}>
      <HeroSection 
        scrolled={scrolled} 
        backgroundStyle={getBackgroundStyle()} 
        onScrollDown={handleScrollDown} 
      />
      
      <ContentSection 
        showContent={showContent} 
        scrolled={scrolled} 
        isPlaying={isPlaying} 
        currentTrack={currentTrack} 
      />
    </div>
  );
};

export default HomePage;
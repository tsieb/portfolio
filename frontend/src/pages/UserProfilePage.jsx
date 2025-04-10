// File: /frontend/src/pages/UserProfilePage.jsx
// User profile page showing a user's music activity

import { useUserProfile } from '../features/user/hooks/useUserProfile';
import ProfileLoading from '../features/user/components/ProfileLoading';
import ProfileError from '../features/user/components/ProfileError';
import ProfileNotFound from '../features/user/components/ProfileNotFound';
import ProfileRestricted from '../features/user/components/ProfileRestricted';
import ProfileHeader from '../features/user/components/ProfileHeader';
import ProfileContent from '../features/user/components/ProfileContent';

const UserProfilePage = () => {
  const { userProfile, loading, error, isOwner } = useUserProfile();
  
  if (loading) {
    return <ProfileLoading />;
  }
  
  if (error) {
    return <ProfileError message={error} />;
  }
  
  if (!userProfile) {
    return <ProfileNotFound />;
  }
  
  // Check if profile is private and user doesn't have access
  if (!userProfile.isPublic && !isOwner && !userProfile.hasAccess) {
    return <ProfileRestricted />;
  }
  
  return (
    <div className="user-profile">
      <ProfileHeader userProfile={userProfile} />
      <ProfileContent userId={userProfile._id} />
    </div>
  );
};

export default UserProfilePage;
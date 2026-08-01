import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function MyProfile() {
  const { user, ready } = useAuth();
  const location = useLocation();
  if (!ready) return null;
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  return <Navigate to={user.profile?.username ? `/community/member/${user.profile.username}` : '/community/profile'} replace />;
}

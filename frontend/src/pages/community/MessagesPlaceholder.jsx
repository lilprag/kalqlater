import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function MessagesPlaceholder() {
  const { user, ready } = useAuth(); const location = useLocation();
  if (!ready) return null;
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  return <main className="mx-auto max-w-2xl px-4 py-20 text-center"><p className="text-xs font-semibold uppercase tracking-[.2em] text-brand-teal">Community</p><h1 className="mt-3 font-display text-4xl">Messaging is being prepared</h1><p className="mt-4 text-brand-subtle">You can currently use a connected member’s visible public links to continue the conversation.</p></main>;
}

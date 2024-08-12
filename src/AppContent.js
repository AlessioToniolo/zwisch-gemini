import React, { useContext } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { AuthContext } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import RideHistory from './pages/RideHistory';
import RequestRide from './pages/RequestRide';
import OfferRide from './pages/OfferRide';

function AuthenticatedApp() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/ride-history" element={<RideHistory />} />
        <Route path="/request-ride" element={<RequestRide />} />
        <Route path="/offer-ride" element={<OfferRide />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

function UnauthenticatedApp() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

function AppContent() {
  const { currentUser, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  return currentUser ? <AuthenticatedApp /> : <UnauthenticatedApp />;
}

export default AppContent;
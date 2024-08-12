import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationsProvider } from './contexts/NotificationsContext';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { lightTheme, darkTheme } from './theme';
import PrivateRoute from './components/PrivateRoute';
import AuthPage from './pages/AuthPage';
import Layout from './components/Layout';
import Home from './pages/Home';
import ForgotPassword from './pages/ForgotPassword';
import Profile from './pages/Profile';
import RideHistory from './pages/RideHistory';
import RequestRide from './pages/RequestRide';
import OfferRide from './pages/OfferRide';
import PushNotifications from './components/PushNotifications';
import DemoPage from './pages/DemoPage';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <AuthProvider>
        <NotificationsProvider>
          <Router>
            <Routes>
              <Route path="/auth" element={<AuthPage darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} />
              <Route path="/forgot-password" element={<ForgotPassword darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} />
              <Route path="/demo" element={<DemoPage darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} />
              <Route element={<PrivateRoute />}>
                <Route element={<Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode} />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/ride-history" element={<RideHistory />} />
                  <Route path="/request-ride" element={<RequestRide />} />
                  <Route path="/offer-ride" element={<OfferRide />} />
                </Route>
              </Route>
              <Route path="*" element={<Navigate to="/auth" />} />
            </Routes>
            <PushNotifications />
          </Router>
        </NotificationsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
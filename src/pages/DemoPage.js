import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Box, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const DemoPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate('/');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleDemoLogin = async () => {
    setLoading(true);
    setError('');

    try {
      const { user } = await signInAnonymously();
      await setDoc(doc(db, 'users', user.uid), {
        name: 'Demo User',
        email: 'demo@example.com',
        userType: 'demo',
        createdAt: new Date(),
      });
      // Navigation will be handled by the useEffect
    } catch (error) {
      console.error('Error during demo login:', error);
      setError('Failed to start demo. Please try again. Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h4" gutterBottom>
          Welcome to Zwisch Demo
        </Typography>
        <Typography variant="body1" align="center" paragraph>
          Experience Zwisch without creating an account. This demo allows you to explore the app's features with sample data.
        </Typography>
        {error && (
          <Typography color="error" align="center" paragraph>
            {error}
          </Typography>
        )}
        <Button
          variant="contained"
          color="primary"
          onClick={handleDemoLogin}
          disabled={loading}
          sx={{ mt: 2 }}
        >
          {loading ? <CircularProgress size={24} /> : 'Start Demo'}
        </Button>
        <Button
          variant="text"
          color="primary"
          onClick={() => navigate('/auth')}
          sx={{ mt: 2 }}
        >
          Back to Login
        </Button>
      </Box>
    </Container>
  );
};

export default DemoPage;
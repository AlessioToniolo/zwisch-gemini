import React from 'react';
import { Typography, Button, Container } from '@mui/material';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <Container maxWidth="sm" style={{ marginTop: '2rem', textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        Welcome to Zwisch
      </Typography>
      <Typography variant="body1" paragraph>
        Connect with fellow students for eco-friendly rides to school.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        component={Link}
        to="/request-ride"
        style={{ marginRight: '1rem' }}
      >
        Request a Ride
      </Button>
      <Button
        variant="contained"
        color="secondary"
        component={Link}
        to="/offer-ride"
      >
        Offer a Ride
      </Button>
    </Container>
  );
};

export default Home;
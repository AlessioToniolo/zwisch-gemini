import React, { useState, useContext } from 'react';
import { TextField, Button, Typography, Container, CircularProgress } from '@mui/material';
import { AuthContext } from '../contexts/AuthContext';
import { db } from '../firebase';
import { matchRideOffer } from '../utils/aiMatching';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';

const OfferRide = () => {
  const [offer, setOffer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { currentUser } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Process the offer using AI
      const processedOffer = await matchRideOffer(offer);

      // Save the driver availability to db
      await addDoc(collection(db, 'driverAvailability'), {
        userId: currentUser.uid,
        userEmail: currentUser.email,
        rawOffer: offer,
        processedOffer,
        status: 'active',
        createdAt: new Date(),
      });

      setSuccess(true);
      setOffer('');
    } catch (error) {
      console.error('Error processing driver availability:', error);
      setError('Failed to process driver availability. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Offer a Ride
      </Typography>
      {error && (
        <Typography color="error" gutterBottom>
          {error}
        </Typography>
      )}
      {success && (
        <Typography color="success" gutterBottom>
          Ride offer successfully submitted!
        </Typography>
      )}
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Describe your ride offer"
          multiline
          rows={4}
          value={offer}
          onChange={(e) => setOffer(e.target.value)}
          margin="normal"
          placeholder="E.g., Available for morning rides on weekdays from 7 AM to 9 AM, prefer pickups in downtown area"
          disabled={loading}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
          sx={{ mt: 2 }}
        >
          {loading ? <CircularProgress size={24} /> : 'Submit Offer'}
        </Button>
      </form>
    </Container>
  );
};

export default OfferRide;
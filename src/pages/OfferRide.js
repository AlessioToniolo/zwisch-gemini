import React, { useState, useContext, useEffect } from 'react';
import { Container, Typography, TextField, Button, CircularProgress, Box, List, ListItem, ListItemText } from '@mui/material';
import { AuthContext } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, addDoc, query, where, getDocs, orderBy, Timestamp } from 'firebase/firestore';
import { matchRideOffer } from '../utils/aiMatching';
import { performRideMatching } from '../utils/rideMatching';

const OfferRide = () => {
  const [offer, setOffer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [offers, setOffers] = useState([]);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    fetchOffers();
  }, [currentUser]);

  const fetchOffers = async () => {
    try {
      const q = query(
        collection(db, 'driverAvailability'),
        where('userId', '==', currentUser.uid),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const offersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOffers(offersData);
    } catch (error) {
      console.error('Error fetching ride offers:', error);
      setError('Failed to fetch ride offers. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Processing ride offer...');
      const processedOffer = await matchRideOffer(offer);
      console.log('Processed offer:', processedOffer);

      console.log('Adding offer to Firestore...');
      const docRef = await addDoc(collection(db, 'driverAvailability'), {
        userId: currentUser.uid,
        userEmail: currentUser.email,
        rawOffer: offer,
        processedOffer,
        status: 'active',
        createdAt: Timestamp.now(),
      });
      console.log('Offer added with ID:', docRef.id);

      console.log('Performing ride matching...');
      await performRideMatching();
      console.log('Ride matching completed');

      setOffer('');
      await fetchOffers();
      console.log('Offers fetched and updated');
    } catch (error) {
      console.error('Error submitting ride offer:', error);
      setError(`Failed to submit ride offer. Please try again. ${error.message}`);

      if (error.stack) {
        console.error('Error stack:', error.stack);
      }
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
      <Box mt={4}>
        <Typography variant="h6" gutterBottom>
          Your Ride Offers
        </Typography>
        <List>
          {offers.map((ofr) => (
            <ListItem key={ofr.id}>
              <ListItemText
                primary={ofr.rawOffer}
                secondary={`Status: ${ofr.status} | Created: ${ofr.createdAt.toDate().toLocaleString()}`}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Container>
  );
};

export default OfferRide;
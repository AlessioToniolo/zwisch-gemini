import React, { useState, useContext, useEffect } from 'react';
import { Container, Typography, TextField, Button, CircularProgress, Box, List, ListItem, ListItemText } from '@mui/material';
import { AuthContext } from '../contexts/AuthContext';
import { db, collection, addDoc, query, where, getDocs, orderBy, serverTimestamp } from '../firebase';
import { matchRideRequest } from '../utils/aiMatching';
import { performRideMatching } from '../utils/rideMatching';

const RequestRide = () => {
  const [request, setRequest] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [requests, setRequests] = useState([]);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    if (currentUser) {
      fetchRequests();
    }
  }, [currentUser]);

  const fetchRequests = async () => {
    try {
      const q = query(
        collection(db, 'rideRequests'),
        where('userId', '==', currentUser.uid),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const requestsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRequests(requestsData);
    } catch (error) {
      console.error('Error fetching ride requests:', error);
      setError('Failed to fetch ride requests. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Processing ride request...');
      const processedRequest = await matchRideRequest(request);
      console.log('Processed request:', processedRequest);

      console.log('Adding request to Firestore...');
      const docRef = await addDoc(collection(db, 'rideRequests'), {
        userId: currentUser.uid,
        userEmail: currentUser.email,
        rawRequest: request,
        processedRequest,
        status: 'pending',
        createdAt: serverTimestamp(),
      });
      console.log('Request added with ID:', docRef.id);

      console.log('Performing ride matching...');
      await performRideMatching();
      console.log('Ride matching completed');

      setRequest('');
      await fetchRequests();
      console.log('Requests fetched and updated');
    } catch (error) {
      console.error('Error submitting ride request:', error);
      setError(`Failed to submit ride request. Please try again. ${error.message}`);

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
        Request a Ride
      </Typography>
      {error && (
        <Typography color="error" gutterBottom>
          {error}
        </Typography>
      )}
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Describe your ride request"
          multiline
          rows={4}
          value={request}
          onChange={(e) => setRequest(e.target.value)}
          margin="normal"
          placeholder="E.g., Need a ride to school tomorrow morning from 123 Main St at 8 AM"
          disabled={loading}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
          sx={{ mt: 2 }}
        >
          {loading ? <CircularProgress size={24} /> : 'Submit Request'}
        </Button>
      </form>
      <Box mt={4}>
        <Typography variant="h6" gutterBottom>
          Your Ride Requests
        </Typography>
        <List>
          {requests.map((req) => (
            <ListItem key={req.id}>
              <ListItemText
                primary={req.rawRequest}
                secondary={`Status: ${req.status} | Created: ${req.createdAt?.toDate().toLocaleString() || 'N/A'}`}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Container>
  );
};

export default RequestRide;
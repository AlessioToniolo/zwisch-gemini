import React, { useState, useEffect, useContext } from 'react';
import { Container, Typography, List, ListItem, ListItemText, Divider } from '@mui/material';
import { AuthContext } from '../contexts/AuthContext';
import { db } from '../firebase';

const RideHistory = () => {
  const [rides, setRides] = useState([]);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const ridesSnapshot = await db

          .collection('rides')
          .where('userId', '==', currentUser.uid)
          .orderBy('createdAt', 'desc')
          .get();

        const ridesData = ridesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setRides(ridesData);
      } catch (error) {
        console.error('Error fetching ride history:', error);
      }
    };

    fetchRides();
  }, [currentUser]);

  return (
    <Container maxWidth="md" style={{ marginTop: '2rem' }}>
      <Typography variant="h4" gutterBottom>
        Ride History
      </Typography>
      <List>
        {rides.map((ride, index) => (
          <React.Fragment key={ride.id}>
            <ListItem>
              <ListItemText
                primary={`${ride.pickup} to ${ride.destination}`}
                secondary={`Date: ${ride.date}, Time: ${ride.time}, Status: ${ride.status}`}
              />
            </ListItem>
            {index < rides.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
      {rides.length === 0 && (
        <Typography>No ride history found.</Typography>
      )}
    </Container>
  );
};

export default RideHistory;
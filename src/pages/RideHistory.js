import React, { useState, useEffect, useContext } from 'react';
import { Container, Typography, List, ListItem, ListItemText, Divider, CircularProgress } from '@mui/material';
import { AuthContext } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';

const RideHistory = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const q = query(
          collection(db, 'rides'),
          where('userId', '==', currentUser.uid),
          orderBy('createdAt', 'desc'),
          limit(20)
        );
        const ridesSnapshot = await getDocs(q);

        const ridesData = ridesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setRides(ridesData);
      } catch (error) {
        console.error('Error fetching ride history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRides();
  }, [currentUser]);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Ride History
      </Typography>
      {rides.length === 0 ? (
        <Typography>No ride history found.</Typography>
      ) : (
        <List>
          {rides.map((ride, index) => (
            <React.Fragment key={ride.id}>
              <ListItem alignItems="flex-start">
                <ListItemText
                  primary={`${ride.pickup} to ${ride.destination}`}
                  secondary={
                    <>
                      <Typography component="span" variant="body2" color="text.primary">
                        Date: {new Date(ride.createdAt.toDate()).toLocaleDateString()}
                      </Typography>
                      {" — "}
                      {ride.status === 'completed' ? 'Completed' : 'Cancelled'}
                    </>
                  }
                />
              </ListItem>
              {index < rides.length - 1 && <Divider variant="inset" component="li" />}
            </React.Fragment>
          ))}
        </List>
      )}
    </Container>
  );
};

export default RideHistory;
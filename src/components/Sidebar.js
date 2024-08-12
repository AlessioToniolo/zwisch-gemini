import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { List, ListItem, ListItemIcon, ListItemText, Box, Divider, Typography } from '@mui/material';
import { Home, DirectionsCar, History, Person } from '@mui/icons-material';
import { AuthContext } from '../contexts/AuthContext';
import KeyIcon from '@mui/icons-material/Key';

const Sidebar = () => {
  const location = useLocation();
  const { currentUser } = useContext(AuthContext);

  const menuItems = [
    { text: 'Home', icon: <Home />, path: '/' },
    { text: 'Request Ride', icon: <DirectionsCar />, path: '/request-ride' },
    { text: 'Offer Ride', icon: <KeyIcon />, path: '/offer-ride' },
    { text: 'Ride History', icon: <History />, path: '/ride-history' },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            component={Link}
            to={item.path}
            selected={location.pathname === item.path}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      <Box sx={{ flexGrow: 1 }} />
      <Divider />
      <Box sx={{ p: 2 }}>
        <ListItem button component={Link} to="/profile">
          <ListItemIcon><Person /></ListItemIcon>
          <Box>
          <Typography variant='subtitle2'>Profile</Typography>
            {/*<Typography variant="subtitle2">{currentUser?.displayName}</Typography>*/}
            {/*<Typography variant="caption">{currentUser?.email}</Typography>*/}
          </Box>
        </ListItem>
      </Box>
    </Box>
  );
};

export default Sidebar;
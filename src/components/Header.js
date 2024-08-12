import React, { useContext } from 'react';
import { AppBar, Toolbar, Box, Typography, Avatar, IconButton } from '@mui/material';
import { styled } from '@mui/system';
import MenuIcon from '@mui/icons-material/Menu';
import Notifications from './Notifications';
import { AuthContext } from '../contexts/AuthContext';

const ProfileBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0.5, 1),
  borderRadius: 20,
  border: `1px solid ${theme.palette.divider}`,
  cursor: 'pointer',
}));

const Header = ({ onProfileClick }) => {
  const { currentUser } = useContext(AuthContext);

  return (
    <AppBar position="static" sx={{ backgroundColor: '#58F5BB', boxShadow: 'none' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
        </Box>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'center' }}>
          Zwisch
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Notifications />
          <ProfileBox onClick={onProfileClick}>
            <Avatar src={currentUser?.photoURL} alt={currentUser?.displayName} sx={{ width: 32, height: 32, mr: 1 }} />
            <Box>
              <Typography variant="subtitle2">{currentUser?.displayName}</Typography>
              <Typography variant="caption">{currentUser?.email}</Typography>
            </Box>
          </ProfileBox>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
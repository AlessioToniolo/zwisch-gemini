import React from 'react';
import { IconButton, Badge } from '@mui/material';
import { Notifications, Brightness4, Brightness7 } from '@mui/icons-material';

const Navbar = ({ darkMode, toggleDarkMode, notifications }) => {
  return (
    <>
      <IconButton color="inherit" onClick={toggleDarkMode}>
        {darkMode ? <Brightness7 /> : <Brightness4 />}
      </IconButton>
      <IconButton color="inherit">
        <Badge badgeContent={notifications.length} color="secondary">
          <Notifications />
        </Badge>
      </IconButton>
    </>
  );
};

export default Navbar;
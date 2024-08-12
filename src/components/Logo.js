import React from 'react';
import { Box } from '@mui/material';

const Logo = ({ variant = 'default', width = 150 }) => {
  const logoSrc = variant === 'splash' ? '/splash_screen.png' : '/full_logo.png';

  return (
    <Box
      component="img"
      src={logoSrc}
      alt="Zwisch Logo"
      sx={{
        width: width,
        height: 'auto',
        objectFit: 'contain',
      }}
    />
  );
};

export default Logo;
import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';

const SimpleForm = () => {
  const [inputValue, setInputValue] = useState('[initialRequest]');
  const maxLength = 200;

  const handleChange = (e) => {
    if (e.target.value.length <= maxLength) {
      setInputValue(e.target.value);
    }
  };

  return (
    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
        Request a Ride
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
        Talk about your ride's pickup & dropoff locations, schedules, and preferences like a specified driver.
      </Typography>
      <TextField
        fullWidth
        multiline
        rows={4}
        value={inputValue}
        onChange={handleChange}
        variant="outlined"
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '16px',
            borderColor: '#58F5BB',
          },
        }}
      />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Typography variant="caption" color="text.secondary">
          {inputValue.length}/{maxLength}
        </Typography>
      </Box>
      <Button
        variant="contained"
        color="primary"
        fullWidth
        sx={{
          borderRadius: '20px',
          textTransform: 'none',
          fontWeight: 'bold',
        }}
      >
        Submit Request
      </Button>
    </Box>
  );
};

export default SimpleForm;
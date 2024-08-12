import React, { useState, useEffect, useContext } from 'react';
import { Snackbar, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { requestNotificationPermission, onMessageListener } from '../firebase';
import { AuthContext } from '../contexts/AuthContext';

const PushNotifications = () => {
  const [notification, setNotification] = useState({ title: '', body: '' });
  const [open, setOpen] = useState(false);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    if (currentUser) {
      requestNotificationPermission(currentUser.uid).catch(console.error);
    }

    const unsubscribe = onMessageListener().then((payload) => {
      setNotification({ title: payload.notification.title, body: payload.notification.body });
      setOpen(true);
    }).catch(err => console.log('failed: ', err));

    return () => unsubscribe;
  }, [currentUser]);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      message={`${notification.title}: ${notification.body}`}
      action={
        <IconButton
          size="small"
          aria-label="close"
          color="inherit"
          onClick={handleClose}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      }
    />
  );
};

export default PushNotifications;
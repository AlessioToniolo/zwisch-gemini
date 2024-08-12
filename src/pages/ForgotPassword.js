import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Paper,
  CircularProgress,
  useMediaQuery
} from '@mui/material';
import { styled, useTheme } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import Logo from '../components/Logo';

const StyledPaper = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(8),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(4),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[5],
  [theme.breakpoints.down('sm')]: {
    marginTop: 0,
    height: '100vh',
    borderRadius: 0,
  },
}));

const Form = styled('form')(({ theme }) => ({
  width: '100%',
  marginTop: theme.spacing(1),
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(3, 0, 2),
}));

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      await auth.sendPasswordResetEmail(email);
      setMessage('Check your email for further instructions');
    } catch (error) {
      setError('Failed to reset password. ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: '#58F5BB',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Container component="main" maxWidth="xs" disableGutters={isMobile}>
        <StyledPaper elevation={isMobile ? 0 : 6}>
          <Box display="flex" flexDirection="column" alignItems="center" width="100%">
            <Logo variant="default" width={isMobile ? 60 : 80} />
          </Box>
          <Typography variant="h5" align="center" gutterBottom sx={{ mt: 2 }}>
            Reset Your Password
          </Typography>
          {error && (
            <Typography color="error" align="center">
              {error}
            </Typography>
          )}
          {message && (
            <Typography color="primary" align="center">
              {message}
            </Typography>
          )}
          <Form onSubmit={handleResetPassword}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <SubmitButton
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Reset Password'}
            </SubmitButton>
          </Form>
          <Button
            fullWidth
            variant="text"
            color="primary"
            onClick={() => navigate('/auth')}
            sx={{ mt: 2 }}
          >
            Back to Login
          </Button>
        </StyledPaper>
      </Container>
    </Box>
  );
};

export default ForgotPassword;
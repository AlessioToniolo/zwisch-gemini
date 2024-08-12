import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Box, Link, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { signUp } from '../firebase';
import Logo from './Logo';
import { validateEmail, validateSchoolEmail, validatePassword, validateName, getEmailErrorMessage, getPasswordErrorMessage, getNameErrorMessage } from '../utils/formValidation';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [userType, setUserType] = useState('student');
  const [childEmail, setChildEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      await signUp(email, password, name, userType, userType === 'parent' ? childEmail : null);
      navigate('/');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    if (!validateName(name)) {
      setError(getNameErrorMessage(name));
      return false;
    }
    if (!validateEmail(email) || !validateSchoolEmail(email)) {
      setError(getEmailErrorMessage(email));
      return false;
    }
    if (!validatePassword(password)) {
      setError(getPasswordErrorMessage(password));
      return false;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return false;
    }
    if (userType === 'parent' && (!validateEmail(childEmail) || !validateSchoolEmail(childEmail))) {
      setError(getEmailErrorMessage(childEmail));
      return false;
    }
    return true;
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
      <Container maxWidth="xs">
        <Box
          sx={{
            backgroundColor: 'white',
            padding: 4,
            borderRadius: 2,
            boxShadow: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Logo variant="default" width={150} />
          <Typography variant="h5" align="center" gutterBottom sx={{ mt: 2 }}>
            Create your Zwisch account
          </Typography>
          {error && (
            <Typography color="error" align="center">
              {error}
            </Typography>
          )}
          <form onSubmit={handleSignup} style={{ width: '100%', marginTop: '1rem' }}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="name"
              label="Full Name"
              name="name"
              autoComplete="name"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={!!getNameErrorMessage(name)}
              helperText={getNameErrorMessage(name)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="School Email Address"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!getEmailErrorMessage(email)}
              helperText={getEmailErrorMessage(email)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!getPasswordErrorMessage(password)}
              helperText={getPasswordErrorMessage(password)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={password !== confirmPassword}
              helperText={password !== confirmPassword ? "Passwords don't match" : ""}
            />
            <RadioGroup
              aria-label="user-type"
              name="user-type"
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              sx={{ mt: 2 }}
            >
              <FormControlLabel value="student" control={<Radio />} label="I am a student" />
              <FormControlLabel value="parent" control={<Radio />} label="I am a parent" />
            </RadioGroup>
            {userType === 'parent' && (
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="childEmail"
                label="Child's School Email Address"
                name="childEmail"
                value={childEmail}
                onChange={(e) => setChildEmail(e.target.value)}
                error={!!getEmailErrorMessage(childEmail)}
                helperText={getEmailErrorMessage(childEmail)}
              />
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={loading}
              sx={{ mt: 3, mb: 2 }}
            >
              {loading ? 'Signing Up...' : 'Sign Up'}
            </Button>
          </form>
          <Box sx={{ mt: 2 }}>
            <Link href="/login" variant="body2">
              Already have an account? Sign In
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Signup;
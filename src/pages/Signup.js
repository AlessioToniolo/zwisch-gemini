import React, { useState } from 'react';
import { TextField, Button, Typography, Container, MenuItem, Checkbox, FormControlLabel, Link } from '@mui/material';
import {
  auth, db
} from '../firebase';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const [termsAgreed, setTermsAgreed] = useState(false);
  const history = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!termsAgreed) {
      setError('You must agree to the Terms and Conditions and Privacy Policy');
      return;
    }
    try {
      const { user } = await auth.createUserWithEmailAndPassword(email, password);
      await db
        .collection('users').doc(user.uid).set({
          name,
          email,
          role,
          createdAt: new Date(),
        });
      history.push('/');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Container maxWidth="xs" style={{ marginTop: '2rem' }}>
      <Typography variant="h4" align="center" gutterBottom>
        Sign Up
      </Typography>
      {error && (
        <Typography color="error" align="center">
          {error}
        </Typography>
      )}
      <form onSubmit={handleSignup}>
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
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
        />
        <TextField
          select
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="role"
          label="Role"
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <MenuItem value="student">Student</MenuItem>
          <MenuItem value="parent">Parent</MenuItem>
        </TextField>
        <FormControlLabel
          control={
            <Checkbox
              checked={termsAgreed}
              onChange={(e) => setTermsAgreed(e.target.checked)}
              color="primary"
            />
          }
          label={
            <Typography variant="body2">
              I agree to the{' '}
              <Link href="https://zwisch.app/terms_and_conditions.html" target="_blank" rel="noopener">
                Terms and Conditions
              </Link>{' '}
              and{' '}
              <Link href="https://zwisch.app/privacy_policy.html" target="_blank" rel="noopener">
                Privacy Policy
              </Link>
            </Typography>
          }
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          style={{ marginTop: '1rem' }}
        >
          Sign Up
        </Button>
      </form>
    </Container>
  );
};

export default Signup;
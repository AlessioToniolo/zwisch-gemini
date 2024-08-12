import React, { useState } from 'react';
import {
  Container,
  Box,
  Tabs,
  Tab,
  Typography,
  TextField,
  Button,
  Link,
  Paper,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useMediaQuery
} from '@mui/material';
import { styled, useTheme } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import { signIn, signUp, checkUserExists } from '../firebase';
import Logo from '../components/Logo';
import { validateEmail, validatePassword, validateName, getEmailErrorMessage, getPasswordErrorMessage, getNameErrorMessage } from '../utils/formValidation';

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

const AuthPage = () => {
  const [tab, setTab] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [userType, setUserType] = useState('student');
  const [childEmail, setChildEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
    setError('');
    setSubmitted(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    setLoading(true);
    setError('');

    try {
      if (tab === 0) {
        // Login
        if (!email || !password) {
          throw new Error('Please fill in all fields');
        }
        await signIn(email, password);
        navigate('/');
      } else {
        // Signup
        if (!name || !email || !password || (userType === 'parent' && !childEmail)) {
          throw new Error('Please fill in all fields');
        }
        if (!validateName(name)) {
          throw new Error(getNameErrorMessage(name));
        }
        if (!validateEmail(email)) {
          throw new Error(getEmailErrorMessage(email));
        }
        if (!validatePassword(password)) {
          throw new Error(getPasswordErrorMessage(password));
        }
        if (userType === 'parent') {
          if (!validateEmail(childEmail)) {
            throw new Error('Please enter a valid email for your child');
          }
          const childExists = await checkUserExists(childEmail);
          if (!childExists) {
            throw new Error('Child email is not registered in our system');
          }
        }
        await signUp(email, password, name, userType, userType === 'parent' ? childEmail : null);
        navigate('/');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getFieldError = (fieldName) => {
    if (!submitted) return '';
    switch (fieldName) {
      case 'name':
        return getNameErrorMessage(name);
      case 'email':
        return getEmailErrorMessage(email);
      case 'password':
        return getPasswordErrorMessage(password);
      case 'childEmail':
        return getEmailErrorMessage(childEmail);
      default:
        return '';
    }
  };

  return (
    <Container component="main" maxWidth="xs" disableGutters={isMobile}>
      <StyledPaper elevation={isMobile ? 0 : 6}>
        <Box display="flex" flexDirection="column" alignItems="center" width="100%">
          <Logo variant="default" width={isMobile ? 60 : 80} />
        </Box>
        <Tabs
          value={tab}
          onChange={handleTabChange}
          centered
          sx={{
            mt: 2,
            '& .MuiTab-root': { color: 'text.secondary' },
            '& .Mui-selected': { color: 'primary.main' }
          }}
        >
          <Tab label="Login" />
          <Tab label="Sign Up" />
        </Tabs>
        {error && (
          <Typography color="error" align="center" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
        <Form onSubmit={handleSubmit}>
          {tab === 1 && (
            <>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="name"
                label="Full Name"
                name="name"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={!!getFieldError('name')}
                helperText={getFieldError('name')}
              />
              <FormControl fullWidth variant="outlined" margin="normal">
                <InputLabel id="user-type-label">I am a</InputLabel>
                <Select
                  labelId="user-type-label"
                  id="user-type"
                  value={userType}
                  onChange={(e) => setUserType(e.target.value)}
                  label="I am a"
                >
                  <MenuItem value="student">Student</MenuItem>
                  <MenuItem value="parent">Parent</MenuItem>
                </Select>
              </FormControl>
            </>
          )}
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label={tab === 1 && userType === 'student' ? "School Email Address" : "Email Address"}
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!getFieldError('email')}
            helperText={getFieldError('email')}
          />
          {tab === 1 && userType === 'parent' && (
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
              error={!!getFieldError('childEmail')}
              helperText={getFieldError('childEmail')}
            />
          )}
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete={tab === 0 ? "current-password" : "new-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!getFieldError('password')}
            helperText={getFieldError('password')}
            InputProps={{
              style: { backgroundColor: 'transparent' },
            }}
          />
          <SubmitButton
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : (tab === 0 ? 'Sign In' : 'Sign Up')}
          </SubmitButton>
        </Form>
        {tab === 0 && (
          <Link href="/forgot-password" variant="body2" sx={{ color: 'text.secondary', mt: 2 }}>
            Forgot password?
          </Link>
        )}
        <Button
          fullWidth
          variant="outlined"
          color="primary"
          onClick={() => navigate('/demo')}
          sx={{ mt: 2 }}
        >
          Try Demo
        </Button>
      </StyledPaper>
    </Container>
  );
};

export default AuthPage;
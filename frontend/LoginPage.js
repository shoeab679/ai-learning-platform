import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Divider,
  Alert,
  InputAdornment,
  IconButton,
  Paper
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import PhoneIcon from '@mui/icons-material/Phone';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const LoginContainer = styled(Container)`
  max-width: 400px;
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
`;

const OrDivider = styled(Box)`
  display: flex;
  align-items: center;
  margin: var(--space-4) 0;
  
  &::before,
  &::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid var(--neutral-300);
  }
  
  span {
    margin: 0 var(--space-2);
    color: var(--neutral-500);
    font-size: var(--text-sm);
  }
`;

const SocialButton = styled(Button)`
  display: flex;
  gap: var(--space-2);
  margin-bottom: var(--space-2);
  text-transform: none;
`;

const LoginPage = () => {
  const { login, googleLogin, error } = useAuth();
  const { language } = useTheme();
  const navigate = useNavigate();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoading(true);
    
    try {
      await login({ username, password });
      navigate('/dashboard');
    } catch (error) {
      setLoginError(error.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoogleLogin = async () => {
    // In a real implementation, this would use Google OAuth
    // For MVP, we'll simulate with mock data
    try {
      const mockGoogleProfile = {
        email: 'demo.user@example.com',
        given_name: 'Demo',
        family_name: 'User',
        picture: 'https://ui-avatars.com/api/?name=Demo+User&background=random',
        sub: '123456789'
      };
      
      await googleLogin('mock-google-token', mockGoogleProfile);
      navigate('/dashboard');
    } catch (error) {
      setLoginError(error.response?.data?.message || 'Google login failed.');
    }
  };
  
  return (
    <LoginContainer>
      <Typography variant="h4" align="center" gutterBottom>
        {language === 'english' ? 'Welcome Back!' : 'वापसी पर स्वागत है!'}
      </Typography>
      
      <Typography variant="body2" align="center" color="textSecondary" gutterBottom>
        {language === 'english' 
          ? 'Log in to continue your learning journey' 
          : 'अपनी सीखने की यात्रा जारी रखने के लिए लॉग इन करें'}
      </Typography>
      
      {(loginError || error) && (
        <Alert severity="error" sx={{ my: 2 }}>
          {loginError || error}
        </Alert>
      )}
      
      <Paper elevation={0} sx={{ p: 3, mt: 3 }}>
        <LoginForm onSubmit={handleSubmit}>
          <TextField
            label={language === 'english' ? 'Username / Email / Phone' : 'यूजरनेम / ईमेल / फोन'}
            variant="outlined"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          
          <TextField
            label={language === 'english' ? 'Password' : 'पासवर्ड'}
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            disabled={loading}
          >
            {loading 
              ? (language === 'english' ? 'Logging in...' : 'लॉग इन हो रहा है...') 
              : (language === 'english' ? 'Log In' : 'लॉग इन करें')}
          </Button>
        </LoginForm>
        
        <Box textAlign="right" mt={1}>
          <Button 
            color="primary" 
            size="small"
            onClick={() => navigate('/register')}
          >
            {language === 'english' ? 'Forgot Password?' : 'पासवर्ड भूल गए?'}
          </Button>
        </Box>
        
        <OrDivider>
          <span>{language === 'english' ? 'OR' : 'या'}</span>
        </OrDivider>
        
        <SocialButton
          variant="outlined"
          fullWidth
          onClick={handleGoogleLogin}
          startIcon={<GoogleIcon />}
        >
          {language === 'english' ? 'Continue with Google' : 'Google के साथ जारी रखें'}
        </SocialButton>
        
        <SocialButton
          variant="outlined"
          fullWidth
          onClick={() => navigate('/otp-login')}
          startIcon={<PhoneIcon />}
        >
          {language === 'english' ? 'Login with OTP' : 'OTP के साथ लॉगिन करें'}
        </SocialButton>
      </Paper>
      
      <Box textAlign="center" mt={3}>
        <Typography variant="body2">
          {language === 'english' ? "Don't have an account?" : "खाता नहीं है?"}{' '}
          <Button 
            color="primary" 
            onClick={() => navigate('/register')}
          >
            {language === 'english' ? 'Sign Up' : 'साइन अप करें'}
          </Button>
        </Typography>
      </Box>
    </LoginContainer>
  );
};

export default LoginPage;

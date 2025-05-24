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
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const RegisterContainer = styled(Container)`
  max-width: 500px;
`;

const RegisterForm = styled.form`
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

const RegisterPage = () => {
  const { register, googleLogin, error } = useAuth();
  const { language } = useTheme();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    username: '',
    password: '',
    confirm_password: '',
    class_grade: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [registerError, setRegisterError] = useState('');
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setRegisterError('');
    
    // Validate passwords match
    if (formData.password !== formData.confirm_password) {
      setRegisterError(language === 'english' ? 'Passwords do not match' : 'पासवर्ड मेल नहीं खाते');
      return;
    }
    
    setLoading(true);
    
    try {
      await register(formData);
      navigate('/dashboard');
    } catch (error) {
      setRegisterError(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoogleRegister = async () => {
    // In a real implementation, this would use Google OAuth
    // For MVP, we'll simulate with mock data
    try {
      const mockGoogleProfile = {
        email: 'new.user@example.com',
        given_name: 'New',
        family_name: 'User',
        picture: 'https://ui-avatars.com/api/?name=New+User&background=random',
        sub: '987654321'
      };
      
      await googleLogin('mock-google-token', mockGoogleProfile);
      navigate('/dashboard');
    } catch (error) {
      setRegisterError(error.response?.data?.message || 'Google registration failed.');
    }
  };
  
  return (
    <RegisterContainer>
      <Typography variant="h4" align="center" gutterBottom>
        {language === 'english' ? 'Create Your Account' : 'अपना खाता बनाएं'}
      </Typography>
      
      <Typography variant="body2" align="center" color="textSecondary" gutterBottom>
        {language === 'english' 
          ? 'Join EduSaarthi to start your learning journey' 
          : 'अपनी सीखने की यात्रा शुरू करने के लिए EduSaarthi से जुड़ें'}
      </Typography>
      
      {(registerError || error) && (
        <Alert severity="error" sx={{ my: 2 }}>
          {registerError || error}
        </Alert>
      )}
      
      <Paper elevation={0} sx={{ p: 3, mt: 3 }}>
        <SocialButton
          variant="outlined"
          fullWidth
          onClick={handleGoogleRegister}
          startIcon={<GoogleIcon />}
        >
          {language === 'english' ? 'Sign up with Google' : 'Google के साथ साइन अप करें'}
        </SocialButton>
        
        <OrDivider>
          <span>{language === 'english' ? 'OR' : 'या'}</span>
        </OrDivider>
        
        <RegisterForm onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label={language === 'english' ? 'First Name' : 'पहला नाम'}
                name="first_name"
                variant="outlined"
                fullWidth
                value={formData.first_name}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label={language === 'english' ? 'Last Name' : 'उपनाम'}
                name="last_name"
                variant="outlined"
                fullWidth
                value={formData.last_name}
                onChange={handleChange}
                required
              />
            </Grid>
          </Grid>
          
          <TextField
            label={language === 'english' ? 'Email' : 'ईमेल'}
            name="email"
            type="email"
            variant="outlined"
            fullWidth
            value={formData.email}
            onChange={handleChange}
            required
          />
          
          <TextField
            label={language === 'english' ? 'Phone Number' : 'फोन नंबर'}
            name="phone"
            variant="outlined"
            fullWidth
            value={formData.phone}
            onChange={handleChange}
            required
          />
          
          <TextField
            label={language === 'english' ? 'Username' : 'यूजरनेम'}
            name="username"
            variant="outlined"
            fullWidth
            value={formData.username}
            onChange={handleChange}
            required
          />
          
          <FormControl fullWidth required>
            <InputLabel id="class-grade-label">
              {language === 'english' ? 'Class/Grade' : 'कक्षा/ग्रेड'}
            </InputLabel>
            <Select
              labelId="class-grade-label"
              name="class_grade"
              value={formData.class_grade}
              label={language === 'english' ? 'Class/Grade' : 'कक्षा/ग्रेड'}
              onChange={handleChange}
            >
              {[6, 7, 8, 9, 10, 11, 12, 'college', 'competitive'].map((grade) => (
                <MenuItem key={grade} value={grade}>
                  {typeof grade === 'number' 
                    ? `${language === 'english' ? 'Class' : 'कक्षा'} ${grade}` 
                    : grade === 'college' 
                      ? (language === 'english' ? 'College' : 'कॉलेज')
                      : (language === 'english' ? 'Competitive Exams' : 'प्रतियोगी परीक्षाएं')}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <TextField
            label={language === 'english' ? 'Password' : 'पासवर्ड'}
            name="password"
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            fullWidth
            value={formData.password}
            onChange={handleChange}
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
          
          <TextField
            label={language === 'english' ? 'Confirm Password' : 'पासवर्ड की पुष्टि करें'}
            name="confirm_password"
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            fullWidth
            value={formData.confirm_password}
            onChange={handleChange}
            required
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
              ? (language === 'english' ? 'Creating Account...' : 'खाता बन रहा है...') 
              : (language === 'english' ? 'Create Account' : 'खाता बनाएं')}
          </Button>
        </RegisterForm>
      </Paper>
      
      <Box textAlign="center" mt={3}>
        <Typography variant="body2">
          {language === 'english' ? "Already have an account?" : "पहले से ही खाता है?"}{' '}
          <Button 
            color="primary" 
            onClick={() => navigate('/login')}
          >
            {language === 'english' ? 'Log In' : 'लॉग इन करें'}
          </Button>
        </Typography>
      </Box>
    </RegisterContainer>
  );
};

export default RegisterPage;

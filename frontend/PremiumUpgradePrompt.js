import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../../contexts/ThemeContext';
import { usePremium } from '../../contexts/PremiumContext';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  Paper,
  Divider
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const UpgradeContainer = styled(Paper)`
  padding: var(--space-4);
  margin-bottom: var(--space-4);
  background: ${props => props.darkMode 
    ? 'linear-gradient(135deg, var(--neutral-800) 0%, var(--neutral-900) 100%)'
    : 'linear-gradient(135deg, var(--neutral-100) 0%, var(--neutral-200) 100%)'
  };
  border-left: 4px solid var(--primary-saffron);
  
  .upgrade-title {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    margin-bottom: var(--space-2);
    
    svg {
      color: var(--primary-saffron);
    }
  }
  
  .upgrade-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: var(--space-3);
  }
`;

/**
 * PremiumUpgradePrompt component - Shows a prompt to upgrade to premium
 * 
 * @param {Object} props
 * @param {string} props.message - Custom message to display (optional)
 * @param {string} props.feature - Feature name to mention in the message (optional)
 * @param {boolean} props.compact - Whether to show a compact version (optional)
 */
const PremiumUpgradePrompt = ({ message, feature, compact = false }) => {
  const { language, darkMode } = useTheme();
  const { isPremium } = usePremium();
  const navigate = useNavigate();
  
  // Don't show for premium users
  if (isPremium) {
    return null;
  }
  
  const handleUpgrade = () => {
    navigate('/dashboard/premium');
  };
  
  // Generate default message if not provided
  const defaultMessage = feature 
    ? (language === 'english' 
        ? `Upgrade to premium to unlock unlimited ${feature} and more!` 
        : `असीमित ${feature} और अधिक अनलॉक करने के लिए प्रीमियम में अपग्रेड करें!`)
    : (language === 'english'
        ? 'Upgrade to premium for unlimited access to all features!'
        : 'सभी सुविधाओं तक असीमित पहुंच के लिए प्रीमियम में अपग्रेड करें!');
  
  const displayMessage = message || defaultMessage;
  
  if (compact) {
    return (
      <Button
        variant="outlined"
        color="warning"
        size="small"
        startIcon={<StarIcon />}
        onClick={handleUpgrade}
      >
        {language === 'english' ? 'Upgrade to Premium' : 'प्रीमियम में अपग्रेड करें'}
      </Button>
    );
  }
  
  return (
    <UpgradeContainer elevation={1} darkMode={darkMode ? 1 : 0}>
      <Box className="upgrade-title">
        <StarIcon />
        <Typography variant="h6">
          {language === 'english' ? 'Premium Features Available' : 'प्रीमियम सुविधाएँ उपलब्ध हैं'}
        </Typography>
      </Box>
      
      <Typography variant="body1">
        {displayMessage}
      </Typography>
      
      <Box className="upgrade-actions">
        <Typography variant="body2" color="textSecondary">
          {language === 'english' 
            ? 'Starting at ₹299/month' 
            : '₹299/माह से शुरू'}
        </Typography>
        
        <Button
          variant="contained"
          color="warning"
          endIcon={<ArrowForwardIcon />}
          onClick={handleUpgrade}
        >
          {language === 'english' ? 'View Plans' : 'योजनाएँ देखें'}
        </Button>
      </Box>
    </UpgradeContainer>
  );
};

export default PremiumUpgradePrompt;

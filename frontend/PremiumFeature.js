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
  Chip,
  Tooltip
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import StarIcon from '@mui/icons-material/Star';

const PremiumFeatureWrapper = styled(Box)`
  position: relative;
  
  .premium-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 10;
    border-radius: inherit;
    backdrop-filter: blur(3px);
    color: white;
    padding: var(--space-4);
    text-align: center;
  }
  
  .premium-badge {
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: var(--primary-saffron);
    color: white;
    padding: 4px 8px;
    border-radius: var(--radius-md);
    font-size: var(--text-xs);
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 4px;
    z-index: 5;
  }
`;

/**
 * PremiumFeature component - Wraps content that should be gated behind premium subscription
 * 
 * @param {Object} props
 * @param {string} props.featureType - Type of feature for checking access (e.g., 'quiz', 'ai_tutor', 'content')
 * @param {boolean} props.showBadge - Whether to show premium badge even when user has access
 * @param {React.ReactNode} props.children - Content to display if user has access
 * @param {string} props.message - Custom message to display when locked (optional)
 */
const PremiumFeature = ({ featureType, showBadge = true, children, message }) => {
  const { language } = useTheme();
  const { isPremium, checkFeatureAccess } = usePremium();
  const navigate = useNavigate();
  
  const { hasAccess, message: accessMessage, remainingCount } = checkFeatureAccess(featureType);
  
  const handleUpgrade = () => {
    navigate('/dashboard/premium');
  };
  
  // If user has access, show the content
  if (hasAccess) {
    return (
      <PremiumFeatureWrapper>
        {showBadge && isPremium && (
          <Tooltip title={language === 'english' ? 'Premium Feature' : 'प्रीमियम सुविधा'}>
            <Chip 
              icon={<StarIcon fontSize="small" />} 
              label={language === 'english' ? 'Premium' : 'प्रीमियम'} 
              size="small"
              color="warning"
              className="premium-badge"
            />
          </Tooltip>
        )}
        
        {!isPremium && remainingCount !== null && (
          <Tooltip title={accessMessage}>
            <Chip 
              label={`${remainingCount} ${language === 'english' ? 'left' : 'शेष'}`} 
              size="small"
              color="primary"
              className="premium-badge"
            />
          </Tooltip>
        )}
        
        {children}
      </PremiumFeatureWrapper>
    );
  }
  
  // If user doesn't have access, show locked overlay
  return (
    <PremiumFeatureWrapper>
      <div className="premium-overlay">
        <LockIcon sx={{ fontSize: '3rem', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          {language === 'english' ? 'Premium Feature' : 'प्रीमियम सुविधा'}
        </Typography>
        <Typography variant="body2" gutterBottom>
          {message || accessMessage || (language === 'english' 
            ? 'Upgrade to premium to unlock this feature' 
            : 'इस सुविधा को अनलॉक करने के लिए प्रीमियम में अपग्रेड करें')}
        </Typography>
        <Button 
          variant="contained" 
          color="warning" 
          sx={{ mt: 2 }}
          onClick={handleUpgrade}
          startIcon={<StarIcon />}
        >
          {language === 'english' ? 'Upgrade Now' : 'अभी अपग्रेड करें'}
        </Button>
      </div>
      
      <Chip 
        icon={<LockIcon fontSize="small" />} 
        label={language === 'english' ? 'Premium' : 'प्रीमियम'} 
        size="small"
        color="warning"
        className="premium-badge"
      />
      
      {/* Blur the content */}
      <Box sx={{ filter: 'blur(4px)' }}>
        {children}
      </Box>
    </PremiumFeatureWrapper>
  );
};

export default PremiumFeature;

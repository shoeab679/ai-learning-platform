import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTheme } from '../../contexts/ThemeContext';
import { usePremium } from '../../contexts/PremiumContext';
import {
  Box,
  Typography,
  Paper,
  Divider,
  LinearProgress,
  Tooltip
} from '@mui/material';
import PremiumUpgradePrompt from './PremiumUpgradePrompt';

const UsageLimitsContainer = styled(Paper)`
  padding: var(--space-3);
  margin-bottom: var(--space-4);
  
  .usage-title {
    font-weight: 600;
    margin-bottom: var(--space-2);
  }
  
  .usage-item {
    margin-bottom: var(--space-3);
    
    &:last-child {
      margin-bottom: 0;
    }
  }
  
  .usage-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-1);
  }
  
  .usage-label {
    font-weight: 500;
  }
  
  .usage-count {
    font-size: var(--text-sm);
    color: var(--neutral-600);
  }
  
  .usage-bar {
    height: 8px;
    border-radius: var(--radius-full);
  }
`;

/**
 * UsageLimitsDisplay component - Shows current usage limits for free users
 * 
 * @param {Object} props
 * @param {boolean} props.showUpgradePrompt - Whether to show upgrade prompt below limits
 * @param {string} props.title - Custom title for the component
 */
const UsageLimitsDisplay = ({ showUpgradePrompt = true, title }) => {
  const { language, darkMode } = useTheme();
  const { isPremium, usageLimits, refreshUsageLimits } = usePremium();
  
  // Refresh usage limits on mount
  useEffect(() => {
    refreshUsageLimits();
  }, []);
  
  // Don't show for premium users
  if (isPremium) {
    return null;
  }
  
  // Format resource type for display
  const formatResourceType = (type) => {
    switch (type) {
      case 'quiz':
        return language === 'english' ? 'Daily Quizzes' : 'दैनिक क्विज़';
      case 'ai_tutor':
        return language === 'english' ? 'AI Tutor Questions' : 'AI ट्यूटर प्रश्न';
      case 'content':
        return language === 'english' ? 'Content Views' : 'सामग्री दृश्य';
      default:
        return type;
    }
  };
  
  // If no usage limits data yet, show loading
  if (!usageLimits || Object.keys(usageLimits).length === 0) {
    return (
      <UsageLimitsContainer elevation={1}>
        <Typography className="usage-title">
          {title || (language === 'english' ? 'Your Daily Limits' : 'आपकी दैनिक सीमाएँ')}
        </Typography>
        <LinearProgress />
      </UsageLimitsContainer>
    );
  }
  
  return (
    <>
      <UsageLimitsContainer elevation={1}>
        <Typography className="usage-title">
          {title || (language === 'english' ? 'Your Daily Limits' : 'आपकी दैनिक सीमाएँ')}
        </Typography>
        
        {Object.entries(usageLimits).map(([type, data]) => (
          <Box key={type} className="usage-item">
            <Box className="usage-header">
              <Typography className="usage-label" variant="body2">
                {formatResourceType(type)}
              </Typography>
              <Typography className="usage-count" variant="body2">
                {data.used}/{data.limit}
              </Typography>
            </Box>
            
            <Tooltip 
              title={`${data.remaining} ${language === 'english' ? 'remaining' : 'शेष'}`}
              placement="top"
            >
              <LinearProgress 
                className="usage-bar"
                variant="determinate" 
                value={(data.used / data.limit) * 100} 
                color={data.remaining > 0 ? 'primary' : 'error'}
              />
            </Tooltip>
          </Box>
        ))}
        
        <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 2 }}>
          {language === 'english' 
            ? 'Limits reset at midnight local time' 
            : 'सीमाएँ स्थानीय समय के अनुसार मध्यरात्रि पर रीसेट होती हैं'}
        </Typography>
      </UsageLimitsContainer>
      
      {showUpgradePrompt && (
        <PremiumUpgradePrompt 
          message={language === 'english' 
            ? 'Upgrade to premium for unlimited access with no daily limits!' 
            : 'बिना दैनिक सीमाओं के असीमित पहुंच के लिए प्रीमियम में अपग्रेड करें!'}
        />
      )}
    </>
  );
};

export default UsageLimitsDisplay;

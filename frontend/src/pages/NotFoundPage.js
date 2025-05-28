import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import styled from 'styled-components';

// Styled components
const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: var(--space-4);
  background-color: var(--bg-primary);
`;

const NotFoundCard = styled.div`
  background-color: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  box-shadow: var(--shadow-md);
  text-align: center;
  max-width: 500px;
  width: 100%;
`;

const ErrorCode = styled.div`
  font-size: 8rem;
  font-weight: bold;
  color: var(--primary);
  line-height: 1;
  margin-bottom: var(--space-4);
`;

const ErrorTitle = styled.h1`
  font-size: 2rem;
  color: var(--text-primary);
  margin-bottom: var(--space-4);
`;

const ErrorMessage = styled.p`
  color: var(--text-secondary);
  margin-bottom: var(--space-6);
  line-height: 1.6;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
`;

const Button = styled.button`
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-md);
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &.primary {
    background-color: var(--primary);
    color: white;
    border: none;
    
    &:hover {
      background-color: var(--primary-dark);
    }
  }
  
  &.secondary {
    background-color: transparent;
    color: var(--primary);
    border: 2px solid var(--primary);
    
    &:hover {
      background-color: var(--primary-light);
    }
  }
`;

const NotFoundPage = () => {
  const { language } = useTheme();
  const navigate = useNavigate();
  
  return (
    <PageContainer>
      <NotFoundCard>
        <ErrorCode>404</ErrorCode>
        <ErrorTitle>
          {language === 'english' ? 'Page Not Found' : 'पृष्ठ नहीं मिला'}
        </ErrorTitle>
        <ErrorMessage>
          {language === 'english' 
            ? 'The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.'
            : 'जिस पृष्ठ की आप तलाश कर रहे हैं, वह हटा दिया गया हो सकता है, उसका नाम बदल दिया गया हो, या अस्थायी रूप से अनुपलब्ध हो।'
          }
        </ErrorMessage>
        <ButtonContainer>
          <Button 
            className="primary"
            onClick={() => navigate('/')}
          >
            {language === 'english' ? 'Go to Homepage' : 'होमपेज पर जाएं'}
          </Button>
          <Button 
            className="secondary"
            onClick={() => navigate(-1)}
          >
            {language === 'english' ? 'Go Back' : 'वापस जाएं'}
          </Button>
        </ButtonContainer>
      </NotFoundCard>
    </PageContainer>
  );
};

export default NotFoundPage;

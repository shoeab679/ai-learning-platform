import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../../contexts/ThemeContext';
import { Container, Typography, Link } from '@mui/material';

const FooterContainer = styled.footer`
  background-color: ${props => props.darkMode ? 'var(--neutral-800)' : 'var(--neutral-200)'};
  color: ${props => props.darkMode ? 'var(--neutral-300)' : 'var(--neutral-700)'};
  padding: var(--space-4) 0;
  margin-top: auto;
`;

const FooterContent = styled(Container)`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const FooterLinks = styled.div`
  display: flex;
  gap: var(--space-4);
  
  @media (max-width: 768px) {
    margin-top: var(--space-3);
    flex-wrap: wrap;
    justify-content: center;
  }
`;

const Footer = () => {
  const { darkMode, language } = useTheme();
  
  const currentYear = new Date().getFullYear();
  
  return (
    <FooterContainer darkMode={darkMode ? 1 : 0}>
      <FooterContent>
        <Typography variant="body2">
          &copy; {currentYear} EduSaarthi. {language === 'english' ? 'All rights reserved.' : 'सर्वाधिकार सुरक्षित।'}
        </Typography>
        
        <FooterLinks>
          <Link href="#" color="inherit" underline="hover">
            {language === 'english' ? 'About Us' : 'हमारे बारे में'}
          </Link>
          <Link href="#" color="inherit" underline="hover">
            {language === 'english' ? 'Contact' : 'संपर्क करें'}
          </Link>
          <Link href="#" color="inherit" underline="hover">
            {language === 'english' ? 'Privacy Policy' : 'गोपनीयता नीति'}
          </Link>
          <Link href="#" color="inherit" underline="hover">
            {language === 'english' ? 'Terms of Service' : 'सेवा की शर्तें'}
          </Link>
        </FooterLinks>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;

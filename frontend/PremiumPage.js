import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Chip
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import StarIcon from '@mui/icons-material/Star';
import LockIcon from '@mui/icons-material/Lock';
import PaymentIcon from '@mui/icons-material/Payment';

const PricingContainer = styled(Container)`
  padding-top: var(--space-6);
  padding-bottom: var(--space-6);
`;

const PlanCard = styled(Card)`
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: transform var(--transition-normal), box-shadow var(--transition-normal);
  position: relative;
  overflow: visible;
  
  ${props => props.featured && `
    transform: scale(1.05);
    box-shadow: var(--shadow-xl);
    z-index: 1;
    
    &:hover {
      transform: scale(1.07);
    }
  `}
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-lg);
  }
  
  .MuiCardContent-root {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }
  
  .plan-title {
    font-weight: 600;
    margin-bottom: var(--space-2);
    font-size: var(--text-xl);
  }
  
  .plan-price {
    font-size: var(--text-3xl);
    font-weight: 700;
    margin-bottom: var(--space-2);
    color: ${props => props.featured ? 'var(--primary-green)' : 'var(--primary-blue)'};
  }
  
  .plan-billing {
    color: var(--neutral-600);
    font-size: var(--text-sm);
    margin-bottom: var(--space-4);
  }
  
  .plan-features {
    margin-bottom: var(--space-4);
  }
  
  .featured-badge {
    position: absolute;
    top: -12px;
    right: 24px;
    background-color: var(--primary-saffron);
    color: white;
    padding: 4px 16px;
    border-radius: var(--radius-full);
    font-size: var(--text-xs);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
`;

const FeatureItem = styled(ListItem)`
  padding: var(--space-1) 0;
  
  .MuiListItemIcon-root {
    min-width: 32px;
    color: ${props => props.available ? 'var(--success)' : 'var(--neutral-500)'};
  }
  
  .MuiListItemText-primary {
    font-size: var(--text-sm);
    color: ${props => props.available ? 'inherit' : 'var(--neutral-500)'};
  }
`;

const ComparisonTable = styled(Paper)`
  margin-top: var(--space-8);
  overflow-x: auto;
  
  table {
    width: 100%;
    border-collapse: collapse;
    
    th, td {
      padding: var(--space-3);
      text-align: left;
      border-bottom: 1px solid ${props => props.darkMode ? 'var(--neutral-700)' : 'var(--neutral-300)'};
    }
    
    th {
      font-weight: 600;
      background-color: ${props => props.darkMode ? 'var(--neutral-800)' : 'var(--neutral-200)'};
    }
    
    td:first-child {
      font-weight: 500;
    }
    
    .feature-available {
      color: var(--success);
    }
    
    .feature-unavailable {
      color: var(--neutral-500);
    }
    
    .highlight {
      background-color: ${props => props.darkMode ? 'rgba(19, 136, 8, 0.1)' : 'rgba(19, 136, 8, 0.05)'};
    }
  }
`;

const PremiumPage = () => {
  const { language, darkMode } = useTheme();
  const { isPremium } = useAuth();
  const navigate = useNavigate();
  
  const [selectedPlan, setSelectedPlan] = useState('annual');
  
  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
  };
  
  const handleUpgrade = () => {
    // In a real implementation, this would redirect to a payment gateway
    // For MVP, we'll just show a success message
    alert(language === 'english' 
      ? 'This is a demo. In a real implementation, you would be redirected to a payment gateway.' 
      : 'यह एक डेमो है। वास्तविक कार्यान्वयन में, आपको भुगतान गेटवे पर पुनर्निर्देशित किया जाएगा।');
  };
  
  const plans = {
    free: {
      title: language === 'english' ? 'Free' : 'मुफ्त',
      price: language === 'english' ? '₹0' : '₹0',
      billing: language === 'english' ? 'Forever' : 'हमेशा के लिए',
      features: [
        { text: language === 'english' ? 'Sign-up/login with OTP and Google' : 'OTP और Google के साथ साइन-अप/लॉगिन', available: true },
        { text: language === 'english' ? 'Personalized dashboard' : 'व्यक्तिगत डैशबोर्ड', available: true },
        { text: language === 'english' ? 'AI-powered chatbot tutor (English & Hindi)' : 'AI-संचालित चैटबॉट ट्यूटर (अंग्रेजी और हिंदी)', available: true },
        { text: language === 'english' ? 'CBSE NCERT content for classes 6-10' : 'कक्षा 6-10 के लिए CBSE NCERT सामग्री', available: true },
        { text: language === 'english' ? '5 adaptive quizzes/day per subject' : 'प्रति विषय 5 अनुकूली क्विज़/दिन', available: true },
        { text: language === 'english' ? 'Spoken English mini-course (10 lessons)' : 'स्पोकन इंग्लिश मिनी-कोर्स (10 पाठ)', available: true },
        { text: language === 'english' ? 'Progress tracking with graphs' : 'ग्राफ के साथ प्रगति ट्रैकिंग', available: true },
        { text: language === 'english' ? 'Leaderboards (top 10)' : 'लीडरबोर्ड (शीर्ष 10)', available: true },
        { text: language === 'english' ? 'Unlimited lessons/quizzes' : 'असीमित पाठ/क्विज़', available: false },
        { text: language === 'english' ? 'Competitive exam prep' : 'प्रतियोगी परीक्षा की तैयारी', available: false },
        { text: language === 'english' ? 'Advanced AI analytics' : 'उन्नत AI विश्लेषिकी', available: false },
      ]
    },
    monthly: {
      title: language === 'english' ? 'Premium Monthly' : 'प्रीमियम मासिक',
      price: language === 'english' ? '₹299' : '₹299',
      billing: language === 'english' ? 'per month' : 'प्रति माह',
      features: [
        { text: language === 'english' ? 'All Free features' : 'सभी मुफ्त सुविधाएँ', available: true },
        { text: language === 'english' ? 'Unlimited lessons/quizzes' : 'असीमित पाठ/क्विज़', available: true },
        { text: language === 'english' ? 'Competitive exam prep (JEE/NEET/SSC)' : 'प्रतियोगी परीक्षा की तैयारी (JEE/NEET/SSC)', available: true },
        { text: language === 'english' ? 'Subject-specific mock tests' : 'विषय-विशिष्ट मॉक टेस्ट', available: true },
        { text: language === 'english' ? 'Advanced analytics from AI' : 'AI से उन्नत विश्लेषिकी', available: true },
        { text: language === 'english' ? 'Downloadable PDFs and certificates' : 'डाउनलोड करने योग्य PDF और प्रमाणपत्र', available: true },
        { text: language === 'english' ? 'Offline mode' : 'ऑफलाइन मोड', available: true },
      ]
    },
    annual: {
      title: language === 'english' ? 'Premium Annual' : 'प्रीमियम वार्षिक',
      price: language === 'english' ? '₹2,499' : '₹2,499',
      billing: language === 'english' ? 'per year (save ₹1,089)' : 'प्रति वर्ष (₹1,089 बचाएं)',
      features: [
        { text: language === 'english' ? 'All Free features' : 'सभी मुफ्त सुविधाएँ', available: true },
        { text: language === 'english' ? 'Unlimited lessons/quizzes' : 'असीमित पाठ/क्विज़', available: true },
        { text: language === 'english' ? 'Competitive exam prep (JEE/NEET/SSC)' : 'प्रतियोगी परीक्षा की तैयारी (JEE/NEET/SSC)', available: true },
        { text: language === 'english' ? 'Subject-specific mock tests' : 'विषय-विशिष्ट मॉक टेस्ट', available: true },
        { text: language === 'english' ? 'Advanced analytics from AI' : 'AI से उन्नत विश्लेषिकी', available: true },
        { text: language === 'english' ? 'Downloadable PDFs and certificates' : 'डाउनलोड करने योग्य PDF और प्रमाणपत्र', available: true },
        { text: language === 'english' ? 'Offline mode' : 'ऑफलाइन मोड', available: true },
        { text: language === 'english' ? 'Priority support' : 'प्राथमिकता समर्थन', available: true },
      ]
    }
  };
  
  return (
    <PricingContainer>
      <Box textAlign="center" mb={6}>
        <Typography variant="h3" gutterBottom>
          {language === 'english' ? 'Upgrade to Premium' : 'प्रीमियम में अपग्रेड करें'}
        </Typography>
        <Typography variant="h6" color="textSecondary" gutterBottom>
          {language === 'english' 
            ? 'Unlock the full potential of EduSaarthi' 
            : 'EduSaarthi की पूरी क्षमता को अनलॉक करें'}
        </Typography>
        
        {isPremium && (
          <Chip 
            icon={<StarIcon />} 
            label={language === 'english' ? 'You are a Premium Member' : 'आप एक प्रीमियम सदस्य हैं'} 
            color="success" 
            sx={{ mt: 2 }}
          />
        )}
      </Box>
      
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} sm={6} md={4}>
          <PlanCard>
            <CardContent>
              <Typography className="plan-title">
                {plans.free.title}
              </Typography>
              <Typography className="plan-price">
                {plans.free.price}
              </Typography>
              <Typography className="plan-billing">
                {plans.free.billing}
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <List className="plan-features" disablePadding>
                {plans.free.features.map((feature, index) => (
                  <FeatureItem key={index} disableGutters available={feature.available ? 1 : 0}>
                    <ListItemIcon>
                      {feature.available ? <CheckCircleIcon /> : <CancelIcon />}
                    </ListItemIcon>
                    <ListItemText primary={feature.text} />
                  </FeatureItem>
                ))}
              </List>
              
              <Button 
                variant="outlined" 
                color="primary" 
                fullWidth
                onClick={() => navigate('/dashboard')}
              >
                {language === 'english' ? 'Current Plan' : 'वर्तमान योजना'}
              </Button>
            </CardContent>
          </PlanCard>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <PlanCard featured={selectedPlan === 'annual'}>
            {selectedPlan === 'annual' && (
              <div className="featured-badge">
                {language === 'english' ? 'Best Value' : 'सर्वोत्तम मूल्य'}
              </div>
            )}
            <CardContent>
              <Typography className="plan-title">
                {plans.annual.title}
              </Typography>
              <Typography className="plan-price">
                {plans.annual.price}
              </Typography>
              <Typography className="plan-billing">
                {plans.annual.billing}
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <List className="plan-features" disablePadding>
                {plans.annual.features.map((feature, index) => (
                  <FeatureItem key={index} disableGutters available={feature.available ? 1 : 0}>
                    <ListItemIcon>
                      {feature.available ? <CheckCircleIcon /> : <CancelIcon />}
                    </ListItemIcon>
                    <ListItemText primary={feature.text} />
                  </FeatureItem>
                ))}
              </List>
              
              <Button 
                variant="contained" 
                color="primary" 
                fullWidth
                onClick={() => {
                  handlePlanSelect('annual');
                  handleUpgrade();
                }}
                disabled={isPremium}
                startIcon={<PaymentIcon />}
              >
                {isPremium 
                  ? (language === 'english' ? 'Current Plan' : 'वर्तमान योजना')
                  : (language === 'english' ? 'Upgrade Now' : 'अभी अपग्रेड करें')}
              </Button>
            </CardContent>
          </PlanCard>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <PlanCard featured={selectedPlan === 'monthly'}>
            {selectedPlan === 'monthly' && (
              <div className="featured-badge">
                {language === 'english' ? 'Most Flexible' : 'सबसे लचीला'}
              </div>
            )}
            <CardContent>
              <Typography className="plan-title">
                {plans.monthly.title}
              </Typography>
              <Typography className="plan-price">
                {plans.monthly.price}
              </Typography>
              <Typography className="plan-billing">
                {plans.monthly.billing}
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <List className="plan-features" disablePadding>
                {plans.monthly.features.map((feature, index) => (
                  <FeatureItem key={index} disableGutters available={feature.available ? 1 : 0}>
                    <ListItemIcon>
                      {feature.available ? <CheckCircleIcon /> : <CancelIcon />}
                    </ListItemIcon>
                    <ListItemText primary={feature.text} />
                  </FeatureItem>
                ))}
              </List>
              
              <Button 
                variant="contained" 
                color="primary" 
                fullWidth
                onClick={() => {
                  handlePlanSelect('monthly');
                  handleUpgrade();
                }}
                disabled={isPremium}
                startIcon={<PaymentIcon />}
              >
                {isPremium 
                  ? (language === 'english' ? 'Current Plan' : 'वर्तमान योजना')
                  : (language === 'english' ? 'Upgrade Now' : 'अभी अपग्रेड करें')}
              </Button>
            </CardContent>
          </PlanCard>
        </Grid>
      </Grid>
      
      <ComparisonTable elevation={1} darkMode={darkMode ? 1 : 0}>
        <Typography variant="h6" p={3}>
          {language === 'english' ? 'Feature Comparison' : 'सुविधा तुलना'}
        </Typography>
        <table>
          <thead>
            <tr>
              <th>{language === 'english' ? 'Feature' : 'सुविधा'}</th>
              <th>{language === 'english' ? 'Free' : 'मुफ्त'}</th>
              <th className="highlight">{language === 'english' ? 'Premium' : 'प्रीमियम'}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{language === 'english' ? 'Sign-up/login with OTP and Google' : 'OTP और Google के साथ साइन-अप/लॉगिन'}</td>
              <td className="feature-available"><CheckCircleIcon fontSize="small" /></td>
              <td className="feature-available highlight"><CheckCircleIcon fontSize="small" /></td>
            </tr>
            <tr>
              <td>{language === 'english' ? 'Personalized dashboard' : 'व्यक्तिगत डैशबोर्ड'}</td>
              <td className="feature-available"><CheckCircleIcon fontSize="small" /></td>
              <td className="feature-available highlight"><CheckCircleIcon fontSize="small" /></td>
            </tr>
            <tr>
              <td>{language === 'english' ? 'AI-powered chatbot tutor' : 'AI-संचालित चैटबॉट ट्यूटर'}</td>
              <td className="feature-available"><CheckCircleIcon fontSize="small" /></td>
              <td className="feature-available highlight"><CheckCircleIcon fontSize="small" /></td>
            </tr>
            <tr>
              <td>{language === 'english' ? 'CBSE NCERT content (classes 6-10)' : 'CBSE NCERT सामग्री (कक्षा 6-10)'}</td>
              <td className="feature-available"><CheckCircleIcon fontSize="small" /></td>
              <td className="feature-available highlight"><CheckCircleIcon fontSize="small" /></td>
            </tr>
            <tr>
              <td>{language === 'english' ? 'Daily adaptive quizzes' : 'दैनिक अनुकू
(Content truncated due to size limit. Use line ranges to read in chunks)
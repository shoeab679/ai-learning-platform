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

const OtpCard = styled.div`
  background-color: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  box-shadow: var(--shadow-md);
  max-width: 450px;
  width: 100%;
`;

const CardHeader = styled.div`
  text-align: center;
  margin-bottom: var(--space-6);
`;

const Logo = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: var(--primary);
  margin-bottom: var(--space-4);
`;

const Title = styled.h1`
  font-size: 1.8rem;
  color: var(--text-primary);
  margin-bottom: var(--space-2);
`;

const Subtitle = styled.p`
  color: var(--text-secondary);
  margin-bottom: var(--space-4);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
`;

const FormGroup = styled.div`
  margin-bottom: var(--space-4);
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: var(--space-2);
  color: var(--text-primary);
  font-weight: bold;
`;

const FormInput = styled.input`
  width: 100%;
  padding: var(--space-3);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  background-color: var(--bg-input);
  color: var(--text-primary);
  
  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 2px var(--primary-light);
  }
`;

const OtpInputContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
`;

const OtpInput = styled.input`
  width: 50px;
  height: 60px;
  text-align: center;
  font-size: 1.5rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  background-color: var(--bg-input);
  color: var(--text-primary);
  
  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 2px var(--primary-light);
  }
`;

const Button = styled.button`
  padding: var(--space-3);
  border-radius: var(--radius-md);
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: var(--primary);
  color: white;
  border: none;
  
  &:hover {
    background-color: var(--primary-dark);
  }
  
  &:disabled {
    background-color: var(--disabled);
    cursor: not-allowed;
  }
`;

const ResendLink = styled.button`
  background: none;
  border: none;
  color: var(--primary);
  cursor: pointer;
  font-weight: bold;
  padding: 0;
  margin-top: var(--space-2);
  
  &:hover {
    text-decoration: underline;
  }
  
  &:disabled {
    color: var(--text-tertiary);
    cursor: not-allowed;
  }
`;

const Timer = styled.span`
  color: var(--text-secondary);
`;

const ErrorMessage = styled.div`
  color: var(--error);
  margin-top: var(--space-2);
  font-size: 0.9rem;
`;

const SuccessMessage = styled.div`
  color: var(--success);
  margin-top: var(--space-2);
  font-size: 0.9rem;
`;

const OtpLoginPage = () => {
  const { login } = useAuth();
  const { language } = useTheme();
  const navigate = useNavigate();
  
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [timer, setTimer] = useState(0);
  
  const handleSendOtp = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Validate phone number
    if (!phoneNumber || phoneNumber.length < 10) {
      setError(language === 'english' 
        ? 'Please enter a valid phone number' 
        : 'कृपया एक वैध फोन नंबर दर्ज करें');
      setLoading(false);
      return;
    }
    
    // Simulate API call to send OTP
    setTimeout(() => {
      setOtpSent(true);
      setSuccess(language === 'english' 
        ? 'OTP sent successfully!' 
        : 'OTP सफलतापूर्वक भेजा गया!');
      setLoading(false);
      setTimer(30);
      
      // Start countdown timer
      const interval = setInterval(() => {
        setTimer(prevTimer => {
          if (prevTimer <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    }, 1500);
  };
  
  const handleResendOtp = () => {
    setLoading(true);
    setError('');
    
    // Simulate API call to resend OTP
    setTimeout(() => {
      setSuccess(language === 'english' 
        ? 'OTP resent successfully!' 
        : 'OTP फिर से सफलतापूर्वक भेजा गया!');
      setLoading(false);
      setTimer(30);
      
      // Start countdown timer
      const interval = setInterval(() => {
        setTimer(prevTimer => {
          if (prevTimer <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    }, 1500);
  };
  
  const handleOtpChange = (index, value) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto focus next input
    if (value && index < 3) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };
  
  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };
  
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const otpValue = otp.join('');
    
    // Validate OTP
    if (otpValue.length !== 4) {
      setError(language === 'english' 
        ? 'Please enter a valid 4-digit OTP' 
        : 'कृपया एक वैध 4-अंकीय OTP दर्ज करें');
      setLoading(false);
      return;
    }
    
    // Simulate API call to verify OTP
    setTimeout(() => {
      // For demo, let's say 1234 is the correct OTP
      if (otpValue === '1234') {
        // login({ phone: phoneNumber });
        setSuccess(language === 'english' 
          ? 'OTP verified successfully! Redirecting...' 
          : 'OTP सफलतापूर्वक सत्यापित! पुनर्निर्देशित कर रहा है...');
        
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        setError(language === 'english' 
          ? 'Invalid OTP. Please try again.' 
          : 'अमान्य OTP। कृपया पुन: प्रयास करें।');
      }
      setLoading(false);
    }, 1500);
  };
  
  return (
    <PageContainer>
      <OtpCard>
        <CardHeader>
          <Logo>EduSaarthi</Logo>
          <Title>
            {language === 'english' ? 'OTP Verification' : 'OTP सत्यापन'}
          </Title>
          <Subtitle>
            {otpSent 
              ? (language === 'english' 
                ? `We've sent a 4-digit OTP to ${phoneNumber}` 
                : `हमने ${phoneNumber} पर 4-अंकीय OTP भेजा है`)
              : (language === 'english' 
                ? 'Enter your phone number to receive an OTP' 
                : 'OTP प्राप्त करने के लिए अपना फोन नंबर दर्ज करें')
            }
          </Subtitle>
        </CardHeader>
        
        {!otpSent ? (
          <Form onSubmit={handleSendOtp}>
            <FormGroup>
              <FormLabel>
                {language === 'english' ? 'Phone Number' : 'फोन नंबर'}
              </FormLabel>
              <FormInput 
                type="tel" 
                placeholder={language === 'english' ? 'Enter your phone number' : 'अपना फोन नंबर दर्ज करें'} 
                value={phoneNumber} 
                onChange={(e) => setPhoneNumber(e.target.value)} 
                required 
              />
              {error && <ErrorMessage>{error}</ErrorMessage>}
              {success && <SuccessMessage>{success}</SuccessMessage>}
            </FormGroup>
            
            <Button type="submit" disabled={loading}>
              {loading 
                ? (language === 'english' ? 'Sending...' : 'भेज रहा है...') 
                : (language === 'english' ? 'Send OTP' : 'OTP भेजें')
              }
            </Button>
          </Form>
        ) : (
          <Form onSubmit={handleVerifyOtp}>
            <FormGroup>
              <FormLabel>
                {language === 'english' ? 'Enter OTP' : 'OTP दर्ज करें'}
              </FormLabel>
              <OtpInputContainer>
                {otp.map((digit, index) => (
                  <OtpInput 
                    key={index}
                    id={`otp-${index}`}
                    type="text" 
                    maxLength={1} 
                    value={digit} 
                    onChange={(e) => handleOtpChange(index, e.target.value)} 
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    autoFocus={index === 0}
                    required 
                  />
                ))}
              </OtpInputContainer>
              {error && <ErrorMessage>{error}</ErrorMessage>}
              {success && <SuccessMessage>{success}</SuccessMessage>}
            </FormGroup>
            
            <Button type="submit" disabled={loading}>
              {loading 
                ? (language === 'english' ? 'Verifying...' : 'सत्यापित कर रहा है...') 
                : (language === 'english' ? 'Verify OTP' : 'OTP सत्यापित करें')
              }
            </Button>
            
            <div style={{ textAlign: 'center' }}>
              {timer > 0 ? (
                <Timer>
                  {language === 'english' 
                    ? `Resend OTP in ${timer} seconds` 
                    : `${timer} सेकंड में OTP पुनः भेजें`
                  }
                </Timer>
              ) : (
                <ResendLink 
                  type="button" 
                  onClick={handleResendOtp} 
                  disabled={loading}
                >
                  {language === 'english' ? 'Resend OTP' : 'OTP पुनः भेजें'}
                </ResendLink>
              )}
            </div>
          </Form>
        )}
      </OtpCard>
    </PageContainer>
  );
};

export default OtpLoginPage;

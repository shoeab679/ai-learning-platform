import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';

// Styled components
const HomeContainer = styled.div`
  width: 100%;
`;

const HeroSection = styled.section`
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  color: white;
  padding: 80px 20px;
  text-align: center;
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.5rem;
  margin-bottom: 40px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 40px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const Button = styled(Link)`
  padding: 12px 30px;
  border-radius: 30px;
  font-weight: bold;
  text-decoration: none;
  transition: all 0.3s ease;
  
  &.primary {
    background-color: white;
    color: var(--primary);
    
    &:hover {
      background-color: var(--bg-secondary);
      transform: translateY(-3px);
    }
  }
  
  &.secondary {
    background-color: transparent;
    color: white;
    border: 2px solid white;
    
    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
      transform: translateY(-3px);
    }
  }
`;

const FeaturesSection = styled.section`
  padding: 80px 20px;
  background-color: var(--bg-primary);
`;

const SectionTitle = styled.h2`
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 60px;
  color: var(--text-primary);
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
  max-width: 1200px;
  margin: 0 auto;
`;

const FeatureCard = styled.div`
  background-color: var(--bg-card);
  border-radius: 10px;
  padding: 30px;
  box-shadow: var(--shadow-md);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-10px);
  }
`;

const FeatureIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 20px;
  color: var(--primary);
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 15px;
  color: var(--text-primary);
`;

const FeatureDescription = styled.p`
  color: var(--text-secondary);
  line-height: 1.6;
`;

const TestimonialsSection = styled.section`
  padding: 80px 20px;
  background-color: var(--bg-secondary);
`;

const TestimonialsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const TestimonialCard = styled.div`
  background-color: var(--bg-card);
  border-radius: 10px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: var(--shadow-md);
`;

const TestimonialText = styled.p`
  font-style: italic;
  margin-bottom: 20px;
  color: var(--text-primary);
  line-height: 1.6;
`;

const TestimonialAuthor = styled.div`
  display: flex;
  align-items: center;
`;

const AuthorAvatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: var(--primary-light);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  color: var(--primary);
  font-weight: bold;
`;

const AuthorInfo = styled.div``;

const AuthorName = styled.h4`
  margin: 0;
  color: var(--text-primary);
`;

const AuthorRole = styled.p`
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
`;

const CTASection = styled.section`
  padding: 80px 20px;
  background: linear-gradient(135deg, var(--primary-light) 0%, var(--primary) 100%);
  text-align: center;
  color: white;
`;

const CTATitle = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const CTADescription = styled.p`
  font-size: 1.2rem;
  margin-bottom: 40px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`;

const CTAButton = styled(Link)`
  display: inline-block;
  padding: 15px 40px;
  background-color: white;
  color: var(--primary);
  border-radius: 30px;
  font-weight: bold;
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: var(--bg-secondary);
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
`;

const HomePage = () => {
  const { darkMode, language } = useTheme();
  
  return (
    <HomeContainer>
      <HeroSection>
        <HeroTitle>
          {language === 'english' 
            ? 'EduSaarthi - Your Smart Learning Companion' 
            : 'एडुसारथी - आपका स्मार्ट लर्निंग साथी'}
        </HeroTitle>
        <HeroSubtitle>
          {language === 'english'
            ? 'Personalized learning experiences powered by AI to help you master any subject at your own pace.'
            : 'AI द्वारा संचालित व्यक्तिगत शिक्षण अनुभव जो आपको अपनी गति से किसी भी विषय में महारत हासिल करने में मदद करता है।'}
        </HeroSubtitle>
        <ButtonContainer>
          <Button to="/register" className="primary">
            {language === 'english' ? 'Get Started' : 'शुरू करें'}
          </Button>
          <Button to="/login" className="secondary">
            {language === 'english' ? 'Login' : 'लॉग इन करें'}
          </Button>
        </ButtonContainer>
      </HeroSection>
      
      <FeaturesSection>
        <SectionTitle>
          {language === 'english' ? 'Key Features' : 'मुख्य विशेषताएं'}
        </SectionTitle>
        <FeaturesGrid>
          <FeatureCard>
            <FeatureIcon>🤖</FeatureIcon>
            <FeatureTitle>
              {language === 'english' ? 'AI Tutor' : 'AI ट्यूटर'}
            </FeatureTitle>
            <FeatureDescription>
              {language === 'english'
                ? 'Get personalized help from our AI tutor that adapts to your learning style and needs.'
                : 'हमारे AI ट्यूटर से व्यक्तिगत सहायता प्राप्त करें जो आपकी सीखने की शैली और जरूरतों के अनुसार अनुकूलित होता है।'}
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>📚</FeatureIcon>
            <FeatureTitle>
              {language === 'english' ? 'Comprehensive Courses' : 'व्यापक पाठ्यक्रम'}
            </FeatureTitle>
            <FeatureDescription>
              {language === 'english'
                ? 'Access a wide range of courses across various subjects, designed by education experts.'
                : 'शिक्षा विशेषज्ञों द्वारा डिज़ाइन किए गए विभिन्न विषयों पर व्यापक पाठ्यक्रमों तक पहुंच प्राप्त करें।'}
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>📝</FeatureIcon>
            <FeatureTitle>
              {language === 'english' ? 'Interactive Quizzes' : 'इंटरैक्टिव क्विज़'}
            </FeatureTitle>
            <FeatureDescription>
              {language === 'english'
                ? 'Test your knowledge with interactive quizzes and get instant feedback to improve your understanding.'
                : 'इंटरैक्टिव क्विज़ के साथ अपने ज्ञान का परीक्षण करें और अपनी समझ को बेहतर बनाने के लिए तत्काल प्रतिक्रिया प्राप्त करें।'}
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>📊</FeatureIcon>
            <FeatureTitle>
              {language === 'english' ? 'Progress Tracking' : 'प्रगति ट्रैकिंग'}
            </FeatureTitle>
            <FeatureDescription>
              {language === 'english'
                ? 'Monitor your learning progress with detailed analytics and personalized recommendations.'
                : 'विस्तृत विश्लेषण और व्यक्तिगत सिफारिशों के साथ अपनी सीखने की प्रगति की निगरानी करें।'}
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>🌙</FeatureIcon>
            <FeatureTitle>
              {language === 'english' ? 'Dark Mode' : 'डार्क मोड'}
            </FeatureTitle>
            <FeatureDescription>
              {language === 'english'
                ? 'Study comfortably day or night with our eye-friendly dark mode option.'
                : 'हमारे आंखों के अनुकूल डार्क मोड विकल्प के साथ दिन या रात में आराम से अध्ययन करें।'}
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>🌐</FeatureIcon>
            <FeatureTitle>
              {language === 'english' ? 'Multi-language Support' : 'बहु-भाषा समर्थन'}
            </FeatureTitle>
            <FeatureDescription>
              {language === 'english'
                ? 'Learn in your preferred language with our multi-language support feature.'
                : 'हमारी बहु-भाषा समर्थन सुविधा के साथ अपनी पसंदीदा भाषा में सीखें।'}
            </FeatureDescription>
          </FeatureCard>
        </FeaturesGrid>
      </FeaturesSection>
      
      <TestimonialsSection>
        <SectionTitle>
          {language === 'english' ? 'What Our Students Say' : 'हमारे छात्र क्या कहते हैं'}
        </SectionTitle>
        <TestimonialsContainer>
          <TestimonialCard>
            <TestimonialText>
              {language === 'english'
                ? '"EduSaarthi has completely transformed my learning experience. The AI tutor feels like having a personal teacher available 24/7. I\'ve improved my grades significantly since I started using it!"'
                : '"एडुसारथी ने मेरे सीखने के अनुभव को पूरी तरह से बदल दिया है। AI ट्यूटर ऐसा लगता है जैसे 24/7 एक व्यक्तिगत शिक्षक उपलब्ध हो। इसका उपयोग शुरू करने के बाद से मेरे ग्रेड में काफी सुधार हुआ है!"'}
            </TestimonialText>
            <TestimonialAuthor>
              <AuthorAvatar>RP</AuthorAvatar>
              <AuthorInfo>
                <AuthorName>Rahul Patel</AuthorName>
                <AuthorRole>
                  {language === 'english' ? 'Engineering Student' : 'इंजीनियरिंग छात्र'}
                </AuthorRole>
              </AuthorInfo>
            </TestimonialAuthor>
          </TestimonialCard>
          
          <TestimonialCard>
            <TestimonialText>
              {language === 'english'
                ? '"As a working professional trying to upskill, EduSaarthi has been a game-changer. The flexibility to learn at my own pace and the personalized guidance have helped me master new skills efficiently."'
                : '"एक कामकाजी पेशेवर के रूप में अपस्किल करने की कोशिश कर रहा हूं, एडुसारथी एक गेम-चेंजर रहा है। अपनी गति से सीखने की लचीलापन और व्यक्तिगत मार्गदर्शन ने मुझे नए कौशल को कुशलतापूर्वक सीखने में मदद की है।"'}
            </TestimonialText>
            <TestimonialAuthor>
              <AuthorAvatar>PS</AuthorAvatar>
              <AuthorInfo>
                <AuthorName>Priya Sharma</AuthorName>
                <AuthorRole>
                  {language === 'english' ? 'Software Developer' : 'सॉफ्टवेयर डेवलपर'}
                </AuthorRole>
              </AuthorInfo>
            </TestimonialAuthor>
          </TestimonialCard>
          
          <TestimonialCard>
            <TestimonialText>
              {language === 'english'
                ? '"My daughter was struggling with mathematics, but since we started using EduSaarthi, her confidence has grown tremendously. The interactive quizzes and immediate feedback make learning fun and effective."'
                : '"मेरी बेटी गणित में संघर्ष कर रही थी, लेकिन जब से हमने एडुसारथी का उपयोग करना शुरू किया है, उसका आत्मविश्वास बहुत बढ़ गया है। इंटरैक्टिव क्विज़ और तत्काल प्रतिक्रिया सीखने को मजेदार और प्रभावी बनाते हैं।"'}
            </TestimonialText>
            <TestimonialAuthor>
              <AuthorAvatar>AK</AuthorAvatar>
              <AuthorInfo>
                <AuthorName>Anita Kumar</AuthorName>
                <AuthorRole>
                  {language === 'english' ? 'Parent' : 'अभिभावक'}
                </AuthorRole>
              </AuthorInfo>
            </TestimonialAuthor>
          </TestimonialCard>
        </TestimonialsContainer>
      </TestimonialsSection>
      
      <CTASection>
        <CTATitle>
          {language === 'english' 
            ? 'Ready to Transform Your Learning Journey?' 
            : 'अपनी सीखने की यात्रा को बदलने के लिए तैयार हैं?'}
        </CTATitle>
        <CTADescription>
          {language === 'english'
            ? 'Join thousands of students who are already experiencing the future of education with EduSaarthi.'
            : 'हजारों छात्रों से जुड़ें जो पहले से ही एडुसारथी के साथ शिक्षा के भविष्य का अनुभव कर रहे हैं।'}
        </CTADescription>
        <CTAButton to="/register">
          {language === 'english' ? 'Start Learning Now' : 'अभी सीखना शुरू करें'}
        </CTAButton>
      </CTASection>
    </HomeContainer>
  );
};

export default HomePage;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import axios from 'axios';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Button, 
  Box,
  Skeleton,
  Chip,
  Divider
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SmartToyIcon from '@mui/icons-material/SmartToy';

const API_URL = 'http://localhost:5000/api';

const WelcomeSection = styled(Box)`
  background: linear-gradient(135deg, var(--primary-saffron) 0%, var(--primary-white) 50%, var(--primary-green) 100%);
  padding: var(--space-6) 0;
  border-radius: var(--radius-lg);
  margin-bottom: var(--space-6);
  
  h2 {
    font-family: var(--font-decorative);
    color: var(--primary-blue);
    margin-bottom: var(--space-2);
  }
`;

const StatsCard = styled(Card)`
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: transform var(--transition-normal);
  
  &:hover {
    transform: translateY(-5px);
  }
  
  .MuiCardContent-root {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }
  
  .stat-value {
    font-size: var(--text-3xl);
    font-weight: 600;
    color: ${props => props.color || 'var(--primary-blue)'};
    margin-bottom: var(--space-2);
  }
  
  .stat-label {
    color: var(--neutral-600);
    font-size: var(--text-sm);
  }
  
  .stat-icon {
    font-size: 2.5rem;
    margin-bottom: var(--space-2);
    color: ${props => props.color || 'var(--primary-blue)'};
    opacity: 0.8;
  }
`;

const ContentCard = styled(Card)`
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: transform var(--transition-normal), box-shadow var(--transition-normal);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-lg);
  }
  
  .MuiCardContent-root {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }
  
  .MuiCardMedia-root {
    height: 140px;
  }
  
  .content-title {
    font-weight: 600;
    margin-bottom: var(--space-2);
  }
  
  .content-description {
    color: var(--neutral-600);
    font-size: var(--text-sm);
    margin-bottom: var(--space-4);
  }
  
  .content-meta {
    margin-top: auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .content-subject {
    font-size: var(--text-xs);
    font-weight: 500;
  }
`;

const SectionTitle = styled(Typography)`
  font-weight: 600;
  margin-bottom: var(--space-4);
  display: flex;
  align-items: center;
  
  svg {
    margin-right: var(--space-2);
    color: var(--primary-green);
  }
`;

const DashboardPage = () => {
  const { currentUser } = useAuth();
  const { language, darkMode } = useTheme();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [dailyQuizzes, setDailyQuizzes] = useState([]);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch progress summary
        const progressRes = await axios.get(`${API_URL}/progress/summary`);
        setStats(progressRes.data.summary);
        
        // Fetch content recommendations
        const recommendationsRes = await axios.get(`${API_URL}/content/recommendations/for-me`);
        setRecommendations(recommendationsRes.data.recommendations);
        
        // Fetch daily quizzes
        const quizzesRes = await axios.get(`${API_URL}/quizzes/daily-free`);
        setDailyQuizzes(quizzesRes.data.daily_quizzes);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (language === 'english') {
      if (hour < 12) return 'Good Morning';
      if (hour < 18) return 'Good Afternoon';
      return 'Good Evening';
    } else {
      if (hour < 12) return 'सुप्रभात';
      if (hour < 18) return 'शुभ दोपहर';
      return 'शुभ संध्या';
    }
  };
  
  return (
    <Container>
      <WelcomeSection px={4} py={6}>
        <Typography variant="h2">
          {getGreeting()}, {currentUser?.first_name}!
        </Typography>
        <Typography variant="body1">
          {language === 'english' 
            ? `Continue your learning journey with EduSaarthi. ${stats?.current_streak ? `You're on a ${stats.current_streak} day streak!` : 'Start building your streak today!'}`
            : `EduSaarthi के साथ अपनी सीखने की यात्रा जारी रखें। ${stats?.current_streak ? `आप ${stats.current_streak} दिन के स्ट्रीक पर हैं!` : 'आज से अपना स्ट्रीक बनाना शुरू करें!'}`}
        </Typography>
      </WelcomeSection>
      
      <Grid container spacing={4} mb={6}>
        <Grid item xs={6} sm={3}>
          {loading ? (
            <Skeleton variant="rectangular" height={120} />
          ) : (
            <StatsCard color="var(--primary-green)">
              <CardContent>
                <Box className="stat-icon">
                  <AutoStoriesIcon fontSize="inherit" />
                </Box>
                <Typography className="stat-value">
                  {stats?.total_content || 0}
                </Typography>
                <Typography className="stat-label">
                  {language === 'english' ? 'Lessons Viewed' : 'देखे गए पाठ'}
                </Typography>
              </CardContent>
            </StatsCard>
          )}
        </Grid>
        
        <Grid item xs={6} sm={3}>
          {loading ? (
            <Skeleton variant="rectangular" height={120} />
          ) : (
            <StatsCard color="var(--primary-saffron)">
              <CardContent>
                <Box className="stat-icon">
                  <EmojiEventsIcon fontSize="inherit" />
                </Box>
                <Typography className="stat-value">
                  {stats?.total_quizzes || 0}
                </Typography>
                <Typography className="stat-label">
                  {language === 'english' ? 'Quizzes Completed' : 'पूरे किए गए क्विज़'}
                </Typography>
              </CardContent>
            </StatsCard>
          )}
        </Grid>
        
        <Grid item xs={6} sm={3}>
          {loading ? (
            <Skeleton variant="rectangular" height={120} />
          ) : (
            <StatsCard color="var(--secondary-purple)">
              <CardContent>
                <Box className="stat-icon">
                  <TrendingUpIcon fontSize="inherit" />
                </Box>
                <Typography className="stat-value">
                  {stats?.average_score ? `${Math.round(stats.average_score)}%` : '0%'}
                </Typography>
                <Typography className="stat-label">
                  {language === 'english' ? 'Average Score' : 'औसत स्कोर'}
                </Typography>
              </CardContent>
            </StatsCard>
          )}
        </Grid>
        
        <Grid item xs={6} sm={3}>
          {loading ? (
            <Skeleton variant="rectangular" height={120} />
          ) : (
            <StatsCard color="var(--primary-blue)">
              <CardContent>
                <Box className="stat-icon">
                  <SmartToyIcon fontSize="inherit" />
                </Box>
                <Typography className="stat-value">
                  {stats?.current_streak || 0}
                </Typography>
                <Typography className="stat-label">
                  {language === 'english' ? 'Day Streak' : 'दिन का स्ट्रीक'}
                </Typography>
              </CardContent>
            </StatsCard>
          )}
        </Grid>
      </Grid>
      
      <Box mb={6}>
        <SectionTitle variant="h5" gutterBottom>
          <AutoStoriesIcon />
          {language === 'english' ? 'Recommended for You' : 'आपके लिए अनुशंसित'}
        </SectionTitle>
        
        <Grid container spacing={3}>
          {loading ? (
            Array(4).fill().map((_, i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <Skeleton variant="rectangular" height={140} />
                <Skeleton variant="text" height={30} sx={{ mt: 1 }} />
                <Skeleton variant="text" height={20} />
                <Skeleton variant="text" height={20} width="60%" />
              </Grid>
            ))
          ) : recommendations.length > 0 ? (
            recommendations.slice(0, 4).map((content) => (
              <Grid item xs={12} sm={6} md={3} key={content._id}>
                <ContentCard>
                  <CardMedia
                    component="img"
                    image={content.thumbnail_url || `https://source.unsplash.com/random/300x200?${content.subject_id.name.toLowerCase()}`}
                    alt={content.title}
                  />
                  <CardContent>
                    <Typography className="content-title" variant="h6">
                      {content.title}
                    </Typography>
                    <Typography className="content-description" variant="body2">
                      {content.description.length > 100 
                        ? `${content.description.substring(0, 100)}...` 
                        : content.description}
                    </Typography>
                    <Box className="content-meta">
                      <Chip 
                        label={content.subject_id.name} 
                        size="small" 
                        style={{ 
                          backgroundColor: content.subject_id.color_code || 'var(--primary-green)',
                          color: 'white'
                        }} 
                      />
                      <Button 
                        size="small" 
                        variant="outlined" 
                        color="primary"
                        onClick={() => navigate(`/dashboard/content/${content._id}`)}
                        startIcon={<PlayArrowIcon />}
                      >
                        {language === 'english' ? 'Start' : 'शुरू करें'}
                      </Button>
                    </Box>
                  </CardContent>
                </ContentCard>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography variant="body1" align="center">
                {language === 'english' 
                  ? 'No recommendations available yet. Start exploring courses!' 
                  : 'अभी तक कोई अनुशंसा उपलब्ध नहीं है। पाठ्यक्रम का अन्वेषण शुरू करें!'}
              </Typography>
            </Grid>
          )}
        </Grid>
        
        <Box mt={2} textAlign="right">
          <Button 
            color="primary" 
            onClick={() => navigate('/dashboard/courses')}
          >
            {language === 'english' ? 'View All Courses' : 'सभी पाठ्यक्रम देखें'} →
          </Button>
        </Box>
      </Box>
      
      <Box mb={6}>
        <SectionTitle variant="h5" gutterBottom>
          <EmojiEventsIcon />
          {language === 'english' ? 'Daily Quizzes' : 'दैनिक क्विज़'}
        </SectionTitle>
        
        <Grid container spacing={3}>
          {loading ? (
            Array(3).fill().map((_, i) => (
              <Grid item xs={12} sm={4} key={i}>
                <Skeleton variant="rectangular" height={120} />
                <Skeleton variant="text" height={30} sx={{ mt: 1 }} />
                <Skeleton variant="text" height={20} />
              </Grid>
            ))
          ) : dailyQuizzes.length > 0 ? (
            dailyQuizzes.map((item) => (
              <Grid item xs={12} sm={4} key={item.quiz._id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {item.quiz.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      {item.quiz.subject_id.name} • {item.quiz.questions.length} {language === 'english' ? 'questions' : 'प्रश्न'}
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                      <Chip 
                        label={`${item.attempts_remaining} ${language === 'english' ? 'remaining' : 'शेष'}`} 
                        size="small" 
                        color="primary" 
                      />
                      <Button 
                        variant="contained" 
                        color="primary"
                        size="small"
                        onClick={() => navigate(`/dashboard/quiz/${item.quiz._id}`)}
                      >
                        {language === 'english' ? 'Take Quiz' : 'क्विज़ लें'}
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography variant="body1" align="center">
                {language === 'english' 
                  ? 'You have completed all your daily quizzes. Come back tomorrow for more!' 
                  : 'आपने अपने सभी दैनिक क्विज़ पूरे कर लिए हैं। अधिक के लिए कल वापस आएं!'}
              </Typography>
            </Grid>
          )}
        </Grid>
        
        <Box mt={2} textAlign="right">
          <Button 
            color="primary" 
            onClick={() => navigate('/dashboard/quizzes')}
          >
            {language === 'english' ? 'View All Quizzes' : 'सभी क्विज़ देखें'} →
          </Button>
        </Box>
      </Box>
      
      <Box mb={6}>
        <SectionTitle variant="h5" gutterBottom>
          <SmartToyIcon />
          {language === 'english' ? 'Ask AI Tutor' : 'एआई ट्यूटर से पूछें'}
        </SectionTitle>
        
        <Card>
          <CardContent>
            <Typography variant="body1" gutterBottom>
              {language === 'english' 
                ? 'Have a question? Your AI tutor is here to help you understand any concept or solve problems.' 
                : 'कोई सवाल है? आपका एआई ट्यूटर किसी भी अवधारणा को समझने या समस्याओं को हल करने में आपकी मदद करने के लिए यहां है।'}
            </Typography>
            <Box mt={2} textAlign="center">
              <Button 
                variant="contained" 
                color="primary"
                size="large"
                startIcon={<SmartToyIcon />}
                onClick={() => navigate('/dashboard/ai-tutor')}
              >
                {language === 'english' ? 'Chat with AI Tutor' : 'एआई ट्यूटर से चैट करें'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default DashboardPage;

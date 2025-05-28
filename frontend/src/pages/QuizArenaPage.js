import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Tabs,
  Tab,
  Divider,
  Chip,
  CircularProgress,
  Alert,
  Paper
} from '@mui/material';
import QuizIcon from '@mui/icons-material/Quiz';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import LockIcon from '@mui/icons-material/Lock';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SchoolIcon from '@mui/icons-material/School';

const API_URL = 'http://localhost:5000/api';

const QuizCard = styled(Card)`
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: transform var(--transition-normal), box-shadow var(--transition-normal);
  position: relative;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-lg);
  }
  
  .MuiCardContent-root {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }
  
  .quiz-title {
    font-weight: 600;
    margin-bottom: var(--space-2);
  }
  
  .quiz-description {
    color: var(--neutral-600);
    font-size: var(--text-sm);
    margin-bottom: var(--space-4);
  }
  
  .quiz-meta {
    margin-top: auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
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
  }
`;

const StyledTabs = styled(Tabs)`
  margin-bottom: var(--space-4);
  
  .MuiTab-root {
    text-transform: none;
    font-weight: 500;
  }
`;

const DailyQuizSection = styled(Paper)`
  padding: var(--space-4);
  margin-bottom: var(--space-6);
  background-color: ${props => props.darkMode ? 'var(--neutral-800)' : 'rgba(19, 136, 8, 0.05)'};
  border-left: 4px solid var(--primary-green);
`;

const QuizArenaPage = () => {
  const { language, darkMode } = useTheme();
  const { isPremium } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [dailyQuizzes, setDailyQuizzes] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedSubject, setSelectedSubject] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch subjects
        const subjectsRes = await axios.get(`${API_URL}/content/subjects`);
        setSubjects(subjectsRes.data.subjects);
        
        // Fetch daily quizzes
        const dailyQuizzesRes = await axios.get(`${API_URL}/quizzes/daily-free`);
        setDailyQuizzes(dailyQuizzesRes.data.daily_quizzes);
        
        // Fetch initial quizzes (all subjects)
        await fetchQuizzes();
      } catch (error) {
        console.error('Error fetching quiz arena data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const fetchQuizzes = async (subjectId = null) => {
    try {
      const params = {};
      if (subjectId) params.subject_id = subjectId;
      
      // For MVP, we'll use a fixed class_id
      // In production, this would be based on user's class
      params.class_id = '60f1b5b9e6b3f32f8c9f1234'; // Example class_id
      
      const response = await axios.get(`${API_URL}/quizzes/by-class-subject`, { params });
      setQuizzes(response.data.quizzes);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    }
  };
  
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    
    // Filter by subject based on tab
    if (newValue === 0) {
      // All subjects
      setSelectedSubject(null);
      fetchQuizzes();
    } else {
      const subjectId = subjects[newValue - 1]?._id;
      setSelectedSubject(subjectId);
      fetchQuizzes(subjectId);
    }
  };
  
  return (
    <Container>
      <Box mb={4}>
        <Typography variant="h4" gutterBottom>
          <QuizIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          {language === 'english' ? 'Quiz Arena' : 'क्विज़ अखाड़ा'}
        </Typography>
        <Typography variant="body1" color="textSecondary">
          {language === 'english' 
            ? 'Test your knowledge with our adaptive quizzes.' 
            : 'हमारे अनुकूली क्विज़ के साथ अपने ज्ञान का परीक्षण करें।'}
        </Typography>
      </Box>
      
      {dailyQuizzes.length > 0 && (
        <DailyQuizSection elevation={0} darkMode={darkMode ? 1 : 0}>
          <Box display="flex" alignItems="center" mb={2}>
            <EmojiEventsIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6">
              {language === 'english' ? 'Daily Free Quizzes' : 'दैनिक मुफ्त क्विज़'}
            </Typography>
          </Box>
          
          <Typography variant="body2" color="textSecondary" mb={3}>
            {language === 'english' 
              ? 'Complete these 5 free quizzes per subject each day to earn coins and build your streak!' 
              : 'कॉइन्स कमाने और अपना स्ट्रीक बनाने के लिए प्रतिदिन प्रति विषय इन 5 मुफ्त क्विज़ को पूरा करें!'}
          </Typography>
          
          <Grid container spacing={3}>
            {dailyQuizzes.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item.quiz._id}>
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
            ))}
          </Grid>
        </DailyQuizSection>
      )}
      
      <StyledTabs 
        value={activeTab} 
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab label={language === 'english' ? 'All Subjects' : 'सभी विषय'} />
        {subjects.map(subject => (
          <Tab key={subject._id} label={subject.name} />
        ))}
      </StyledTabs>
      
      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : quizzes.length > 0 ? (
        <Grid container spacing={3}>
          {quizzes.map((quiz) => (
            <Grid item xs={12} sm={6} md={4} key={quiz._id}>
              <QuizCard>
                {quiz.is_premium && (
                  <div className="premium-badge">
                    <LockIcon fontSize="inherit" />
                    {language === 'english' ? 'Premium' : 'प्रीमियम'}
                  </div>
                )}
                <CardContent>
                  <Typography className="quiz-title" variant="h6">
                    {quiz.title}
                  </Typography>
                  <Typography className="quiz-description" variant="body2">
                    {quiz.description.length > 100 
                      ? `${quiz.description.substring(0, 100)}...` 
                      : quiz.description}
                  </Typography>
                  <Box mb={2}>
                    <Chip 
                      icon={<SchoolIcon />}
                      label={`${quiz.questions.length} ${language === 'english' ? 'questions' : 'प्रश्न'}`}
                      size="small"
                      variant="outlined"
                      sx={{ mr: 1 }}
                    />
                    <Chip 
                      label={quiz.difficulty_level}
                      size="small"
                      color={
                        quiz.difficulty_level === 'beginner' ? 'success' :
                        quiz.difficulty_level === 'intermediate' ? 'primary' : 'secondary'
                      }
                    />
                  </Box>
                  <Box className="quiz-meta">
                    <Chip 
                      label={quiz.subject_id.name} 
                      size="small" 
                      style={{ 
                        backgroundColor: quiz.subject_id.color_code || 'var(--primary-green)',
                        color: 'white'
                      }} 
                    />
                    <Button 
                      size="small" 
                      variant="contained" 
                      color="primary"
                      onClick={() => navigate(`/dashboard/quiz/${quiz._id}`)}
                      startIcon={<PlayArrowIcon />}
                      disabled={quiz.is_premium && !isPremium}
                    >
                      {language === 'english' ? 'Start' : 'शुरू करें'}
                    </Button>
                  </Box>
                </CardContent>
              </QuizCard>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" gutterBottom>
            {language === 'english' ? 'No quizzes found' : 'कोई क्विज़ नहीं मिला'}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {language === 'english' 
              ? 'Try selecting a different subject' 
              : 'कोई अलग विषय चुनने का प्रयास करें'}
          </Typography>
        </Box>
      )}
      
      {!isPremium && (
        <Alert 
          severity="info" 
          sx={{ mt: 4 }}
          action={
            <Button color="inherit" size="small" variant="outlined">
              {language === 'english' ? 'Upgrade' : 'अपग्रेड करें'}
            </Button>
          }
        >
          {language === 'english' 
            ? 'Upgrade to Premium for unlimited quizzes and mock tests!' 
            : 'असीमित क्विज़ और मॉक टेस्ट के लिए प्रीमियम में अपग्रेड करें!'}
        </Alert>
      )}
    </Container>
  );
};

export default QuizArenaPage;

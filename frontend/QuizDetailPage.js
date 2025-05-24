import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  LinearProgress,
  Card,
  CardContent,
  Divider,
  Alert,
  CircularProgress,
  Chip
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import TimerIcon from '@mui/icons-material/Timer';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const API_URL = 'http://localhost:5000/api';

const QuizContainer = styled(Paper)`
  padding: var(--space-6);
  margin-bottom: var(--space-4);
  
  @media (max-width: 768px) {
    padding: var(--space-4);
  }
`;

const QuestionNumber = styled(Typography)`
  font-weight: 600;
  color: var(--primary-blue);
  margin-bottom: var(--space-2);
`;

const QuestionText = styled(Typography)`
  font-size: var(--text-xl);
  font-weight: 500;
  margin-bottom: var(--space-4);
`;

const OptionLabel = styled(FormControlLabel)`
  width: 100%;
  margin: 0;
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  transition: background-color var(--transition-fast);
  
  &:hover {
    background-color: ${props => props.darkMode ? 'var(--neutral-700)' : 'var(--neutral-200)'};
  }
  
  &.selected {
    background-color: ${props => props.darkMode ? 'rgba(19, 136, 8, 0.3)' : 'rgba(19, 136, 8, 0.1)'};
  }
  
  &.correct {
    background-color: ${props => props.darkMode ? 'rgba(19, 136, 8, 0.3)' : 'rgba(19, 136, 8, 0.1)'};
  }
  
  &.incorrect {
    background-color: ${props => props.darkMode ? 'rgba(244, 67, 54, 0.3)' : 'rgba(244, 67, 54, 0.1)'};
  }
  
  .MuiFormControlLabel-label {
    width: 100%;
  }
`;

const ProgressContainer = styled(Box)`
  display: flex;
  align-items: center;
  margin-bottom: var(--space-4);
  
  .MuiLinearProgress-root {
    flex-grow: 1;
    margin: 0 var(--space-2);
    height: 8px;
    border-radius: var(--radius-full);
  }
`;

const ResultCard = styled(Card)`
  text-align: center;
  margin-bottom: var(--space-4);
  
  .result-header {
    padding: var(--space-4);
    background-color: ${props => 
      props.passed 
        ? (props.darkMode ? 'rgba(19, 136, 8, 0.2)' : 'rgba(19, 136, 8, 0.1)') 
        : (props.darkMode ? 'rgba(244, 67, 54, 0.2)' : 'rgba(244, 67, 54, 0.1)')};
  }
  
  .result-icon {
    font-size: 4rem;
    color: ${props => props.passed ? 'var(--success)' : 'var(--error)'};
    margin-bottom: var(--space-2);
  }
  
  .result-score {
    font-size: var(--text-4xl);
    font-weight: 700;
    color: ${props => props.passed ? 'var(--success)' : 'var(--error)'};
  }
`;

const QuizDetailPage = () => {
  const { quizId } = useParams();
  const { language, darkMode } = useTheme();
  const { isPremium } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  
  useEffect(() => {
    const fetchQuiz = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/quizzes/${quizId}`);
        setQuiz(response.data.quiz);
        
        // Initialize answers array
        setAnswers(new Array(response.data.quiz.questions.length).fill(null));
        
        // Set timer if quiz has time limit
        if (response.data.quiz.time_limit_minutes) {
          setTimeLeft(response.data.quiz.time_limit_minutes * 60);
        }
      } catch (error) {
        console.error('Error fetching quiz:', error);
        if (error.response?.status === 403 && error.response?.data?.limit_reached) {
          setError('daily_limit');
        } else {
          setError('fetch_error');
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchQuiz();
  }, [quizId]);
  
  // Timer effect
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || quizCompleted) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeLeft, quizCompleted]);
  
  const handleAnswerChange = (value) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    setAnswers(newAnswers);
  };
  
  const handleNextQuestion = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };
  
  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };
  
  const handleSubmitQuiz = async () => {
    try {
      const response = await axios.post(`${API_URL}/quizzes/${quizId}/submit`, {
        answers
      });
      
      setResults(response.data.results);
      setQuizCompleted(true);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      setError('submit_error');
    }
  };
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Container>
    );
  }
  
  if (error === 'daily_limit') {
    return (
      <Container>
        <Alert severity="info" sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            {language === 'english' ? 'Daily Quiz Limit Reached' : 'दैनिक क्विज़ सीमा पहुंच गई'}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {language === 'english' 
              ? 'You have reached your daily limit of 5 quizzes for this subject.' 
              : 'आप इस विषय के लिए 5 क्विज़ की अपनी दैनिक सीमा तक पहुंच गए हैं।'}
          </Typography>
          {!isPremium && (
            <Typography variant="body2" gutterBottom>
              {language === 'english' 
                ? 'Upgrade to premium for unlimited quizzes!' 
                : 'असीमित क्विज़ के लिए प्रीमियम में अपग्रेड करें!'}
            </Typography>
          )}
          <Button 
            variant="contained" 
            color="primary" 
            sx={{ mt: 2 }}
            onClick={() => navigate('/dashboard/quizzes')}
          >
            {language === 'english' ? 'Back to Quiz Arena' : 'क्विज़ अखाड़े पर वापस जाएं'}
          </Button>
        </Alert>
      </Container>
    );
  }
  
  if (error === 'fetch_error') {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            {language === 'english' ? 'Error Loading Quiz' : 'क्विज़ लोड करने में त्रुटि'}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {language === 'english' 
              ? 'There was a problem loading this quiz. Please try again later.' 
              : 'इस क्विज़ को लोड करने में समस्या थी। कृपया बाद में पुनः प्रयास करें।'}
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            sx={{ mt: 2 }}
            onClick={() => navigate('/dashboard/quizzes')}
          >
            {language === 'english' ? 'Back to Quiz Arena' : 'क्विज़ अखाड़े पर वापस जाएं'}
          </Button>
        </Alert>
      </Container>
    );
  }
  
  if (!quiz) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>
          <Typography variant="h6">
            {language === 'english' ? 'Quiz Not Found' : 'क्विज़ नहीं मिला'}
          </Typography>
        </Alert>
      </Container>
    );
  }
  
  if (quizCompleted && results) {
    return (
      <Container>
        <Box mb={4}>
          <Typography variant="h4" gutterBottom>
            {language === 'english' ? 'Quiz Results' : 'क्विज़ परिणाम'}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {quiz.title}
          </Typography>
        </Box>
        
        <ResultCard passed={results.passed} darkMode={darkMode ? 1 : 0}>
          <Box className="result-header">
            {results.passed ? (
              <CheckCircleIcon className="result-icon" />
            ) : (
              <CancelIcon className="result-icon" />
            )}
            <Typography variant="h5" gutterBottom>
              {results.passed 
                ? (language === 'english' ? 'Quiz Passed!' : 'क्विज़ पास!')
                : (language === 'english' ? 'Quiz Failed' : 'क्विज़ असफल')}
            </Typography>
          </Box>
          <CardContent>
            <Typography className="result-score">
              {results.score}/{results.max_score}
            </Typography>
            <Typography variant="h6" color="textSecondary" gutterBottom>
              {results.percentage.toFixed(0)}%
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {language === 'english' ? 'Passing score: ' : 'पासिंग स्कोर: '}{results.passing_score}%
            </Typography>
          </CardContent>
        </ResultCard>
        
        <Box mb={4}>
          <Typography variant="h6" gutterBottom>
            {language === 'english' ? 'Question Review' : 'प्रश्न समीक्षा'}
          </Typography>
          
          {results.questions.map((question, index) => (
            <Card key={index} sx={{ mb: 2 }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {language === 'english' ? 'Question' : 'प्रश्न'} {index + 1}
                  </Typography>
                  {question.is_correct ? (
                    <Chip 
                      icon={<CheckCircleIcon />} 
                      label={language === 'english' ? 'Correct' : 'सही'} 
                      color="success" 
                      size="small" 
                    />
                  ) : (
                    <Chip 
                      icon={<CancelIcon />} 
                      label={language === 'english' ? 'Incorrect' : 'गलत'} 
                      color="error" 
                      size="small" 
                    />
                  )}
                </Box>
                
                <Typography variant="body1" gutterBottom>
                  {question.question_text}
                </Typography>
                
                <Box mt={2} mb={2}>
                  <Typography variant="body2" color="textSecondary">
                    {language === 'english' ? 'Your answer: ' : 'आपका उत्तर: '}
                    <span style={{ 
                      color: question.is_correct ? 'var(--success)' : 'var(--error)',
                      fontWeight: 600
                    }}>
                      {question.user_answer !== null ? question.user_answer : (language === 'english' ? 'Not answered' : 'उत्तर नहीं दिया')}
                    </span>
                  </Typography>
                  
                  {!question.is_correct && (
                    <Typography variant="body2" color="textSecondary">
                      {language === 'english' ? 'Correct answer: ' : 'सही उत्तर: '}
                      <span style={{ color: 'var(--success)', fontWeight: 600 }}>
                        {question.correct_answer}
                      </span>
                    </Typography>
                  )}
                </Box>
                
                {question.explanation && (
                  <>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      <strong>{language === 'english' ? 'Explanation: ' : 'स्पष्टीकरण: '}</strong>
                      {question.explanation}
                    </Typography>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>
        
        <Box display="flex" justifyContent="space-between">
          <Button 
            variant="outlined" 
            onClick={() => navigate('/dashboard/quizzes')}
          >
            {language === 'english' ? 'Back to Quiz Arena' : 'क्विज़ अखाड़े पर वापस जाएं'}
          </Button>
          
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => navigate('/dashboard/progress')}
            startIcon={<EmojiEventsIcon />}
          >
            {language === 'english' ? 'View Progress' : 'प्रगति देखें'}
          </Button>
        </Box>
      </Container>
    );
  }
  
  const currentQuestionData = quiz.questions[currentQuestion];
  
  return (
    <Container>
      <Box mb={4}>
        <Typography variant="h4" gutterBottom>
          {quiz.title}
        </Typography>
        <Typography variant="body1" color="textSecondary">
          {quiz.description}
        </Typography>
      </Box>
      
      <ProgressContainer>
        <Typography variant="body2">
          {currentQuestion + 1}/{quiz.questions.length}
        </Typography>
        <LinearProgress 
          variant="determinate" 
          value={((currentQuestion + 1) / quiz.questions.length) * 100} 
          color="primary"
        />
        {timeLeft !== null && (
          <Box display="flex" alignItems="center">
            <TimerIcon fontSize="small" sx={{ mr: 0.5 }} />
            <Typography variant="body2">
              {formatTime(timeLeft)}
            </Typography>
          </Box>
        )}
      </ProgressContainer>
      
      <QuizContainer elevation={1}>
        <QuestionNumber variant="subtitle1">
          {language === 'english' ? 'Question' : 'प्रश्न'} {currentQuestion + 1}
        </QuestionNumber>
        
        <QuestionText variant="h5">
          {currentQuestionData.question_text}
        </QuestionText>
        
        <FormControl component="fieldset" fullWidth>
          <RadioGroup 
            value={answers[currentQuestion] !== null ? answers[currentQuestion].toString() : ''}
            onChange={(e) => handleAnswerChange(e.target.value)}
          >
            {currentQuestionData.options.map((option, index) => (
              <OptionLabel
                key={index}
                value={index.toString()}
                control={<Radio />}
                label={option.option_text}
                className={answers[currentQuestion] === index.toString() ? 'selected' : ''}
                darkMode={darkMode ? 1 : 0}
              />
            ))}
          </RadioGroup>
        </FormControl>
      </QuizContainer>
      
      <Box display="flex" justifyContent="space-between">
        <Button 
          variant="outlined" 
          onClick={handlePrevQuestion}
          disabled={currentQuestion === 0}
        >
          {language === 'english' ? 'Previous' : 'पिछला'}
        </Button>
        
        {currentQuestion < quiz.questions.length - 1 ? (
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleNextQuestion}
            disabled={answers[currentQuestion] === null}
          >
            {language === 'english' ? 'Next' : 'अगला'}
          </Button>
        ) : (
          <Button 
            variant="contained" 
            co
(Content truncated due to size limit. Use line ranges to read in chunks)
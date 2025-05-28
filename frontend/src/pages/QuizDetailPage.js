import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import styled from 'styled-components';
import axios from 'axios';

// Styled components
const PageContainer = styled.div`
  padding: var(--space-4);
`;

const QuizHeader = styled.div`
  margin-bottom: var(--space-6);
`;

const QuizTitle = styled.h1`
  font-size: 2rem;
  color: var(--text-primary);
  margin-bottom: var(--space-2);
`;

const QuizMeta = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-4);
  color: var(--text-secondary);
  margin-bottom: var(--space-4);
`;

const QuizMetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-2);
`;

const QuizDescription = styled.p`
  color: var(--text-secondary);
  margin-bottom: var(--space-4);
`;

const QuizCard = styled.div`
  background-color: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  box-shadow: var(--shadow-md);
  margin-bottom: var(--space-6);
`;

const ProgressBar = styled.div`
  height: 8px;
  background-color: var(--bg-secondary);
  border-radius: var(--radius-full);
  margin-bottom: var(--space-6);
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background-color: var(--primary);
  width: ${props => props.progress}%;
  transition: width 0.3s ease;
`;

const QuestionNumber = styled.div`
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-bottom: var(--space-2);
`;

const QuestionText = styled.h2`
  font-size: 1.5rem;
  color: var(--text-primary);
  margin-bottom: var(--space-6);
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  margin-bottom: var(--space-6);
`;

const OptionButton = styled.button`
  display: flex;
  align-items: center;
  text-align: left;
  padding: var(--space-4);
  border-radius: var(--radius-md);
  border: 2px solid ${props => 
    props.selected 
      ? 'var(--primary)' 
      : props.correct 
        ? 'var(--success)' 
        : props.incorrect 
          ? 'var(--error)' 
          : 'var(--border-color)'
  };
  background-color: ${props => 
    props.selected 
      ? 'var(--primary-light)' 
      : props.correct 
        ? 'var(--success-light)' 
        : props.incorrect 
          ? 'var(--error-light)' 
          : 'var(--bg-secondary)'
  };
  cursor: ${props => props.disabled ? 'default' : 'pointer'};
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => 
      props.disabled 
        ? props.selected 
          ? 'var(--primary-light)' 
          : props.correct 
            ? 'var(--success-light)' 
            : props.incorrect 
              ? 'var(--error-light)' 
              : 'var(--bg-secondary)'
        : 'var(--bg-hover)'
    };
  }
`;

const OptionLabel = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: ${props => 
    props.selected 
      ? 'var(--primary)' 
      : props.correct 
        ? 'var(--success)' 
        : props.incorrect 
          ? 'var(--error)' 
          : 'var(--bg-tertiary)'
  };
  color: ${props => 
    props.selected || props.correct || props.incorrect 
      ? 'white' 
      : 'var(--text-secondary)'
  };
  margin-right: var(--space-3);
  font-weight: bold;
`;

const OptionText = styled.span`
  flex: 1;
  color: var(--text-primary);
`;

const OptionIcon = styled.span`
  margin-left: var(--space-2);
  color: ${props => 
    props.correct 
      ? 'var(--success)' 
      : 'var(--error)'
  };
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: var(--space-6);
`;

const Button = styled.button`
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-md);
  font-weight: bold;
  cursor: ${props => props.disabled ? 'default' : 'pointer'};
  transition: all 0.2s ease;
  
  ${props => props.variant === 'contained' && `
    background-color: ${props.disabled ? 'var(--disabled)' : 'var(--primary)'};
    color: white;
    border: none;
    
    &:hover {
      background-color: ${props.disabled ? 'var(--disabled)' : 'var(--primary-dark)'};
    }
  `}
  
  ${props => props.variant === 'outlined' && `
    background-color: transparent;
    color: var(--primary);
    border: 2px solid var(--primary);
    
    &:hover {
      background-color: var(--primary-light);
    }
  `}
`;

const ResultCard = styled.div`
  background-color: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  box-shadow: var(--shadow-md);
  text-align: center;
`;

const ResultScore = styled.div`
  font-size: 4rem;
  font-weight: bold;
  color: var(--primary);
  margin-bottom: var(--space-4);
`;

const ResultText = styled.p`
  font-size: 1.2rem;
  color: var(--text-primary);
  margin-bottom: var(--space-6);
`;

const ResultActions = styled.div`
  display: flex;
  justify-content: center;
  gap: var(--space-4);
`;

// Sample quiz data (replace with API data)
const sampleQuiz = {
  id: 1,
  title: 'Introduction to Algebra',
  description: 'Test your knowledge of basic algebraic concepts and equations.',
  subject: 'Mathematics',
  difficulty: 'Intermediate',
  time_limit: 15,
  questions: [
    {
      id: 1,
      text: 'What is the value of x in the equation 2x + 5 = 15?',
      options: [
        { id: 1, text: 'x = 5' },
        { id: 2, text: 'x = 10' },
        { id: 3, text: 'x = 7' },
        { id: 4, text: 'x = 8' }
      ],
      correct_option_id: 1
    },
    {
      id: 2,
      text: 'Simplify the expression: 3(2x - 4) + 5',
      options: [
        { id: 1, text: '6x - 12 + 5' },
        { id: 2, text: '6x - 7' },
        { id: 3, text: '6x - 17' },
        { id: 4, text: '6x - 12 - 5' }
      ],
      correct_option_id: 2
    },
    {
      id: 3,
      text: 'If f(x) = 2x² + 3x - 5, what is f(2)?',
      options: [
        { id: 1, text: '9' },
        { id: 2, text: '11' },
        { id: 3, text: '7' },
        { id: 4, text: '13' }
      ],
      correct_option_id: 3
    },
    {
      id: 4,
      text: 'Solve for y: 3y - 7 = 2y + 5',
      options: [
        { id: 1, text: 'y = 12' },
        { id: 2, text: 'y = -12' },
        { id: 3, text: 'y = 4' },
        { id: 4, text: 'y = -4' }
      ],
      correct_option_id: 1
    },
    {
      id: 5,
      text: 'What is the slope of the line passing through points (2,3) and (4,7)?',
      options: [
        { id: 1, text: 'm = 1' },
        { id: 2, text: 'm = 2' },
        { id: 3, text: 'm = 3' },
        { id: 4, text: 'm = 4' }
      ],
      correct_option_id: 2
    }
  ]
};

const QuizDetailPage = () => {
  const { darkMode, language } = useTheme();
  const { currentUser } = useAuth();
  const [quiz, setQuiz] = useState(sampleQuiz);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(Array(sampleQuiz.questions.length).fill(null));
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(sampleQuiz.time_limit * 60);
  const [quizStarted, setQuizStarted] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  
  // Calculate progress percentage
  const progressPercentage = ((currentQuestion + 1) / quiz.questions.length) * 100;
  
  // Format time remaining
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Start timer when quiz starts
  useEffect(() => {
    if (quizStarted && timeLeft > 0 && !showResults) {
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
    }
  }, [quizStarted, timeLeft, showResults]);
  
  // Fetch quiz data
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        // Replace with actual API call
        // const response = await axios.get(`/api/quizzes/${quizId}`);
        // setQuiz(response.data);
        // setAnswers(Array(response.data.questions.length).fill(null));
        
        // Using sample data for now
        setQuiz(sampleQuiz);
        setAnswers(Array(sampleQuiz.questions.length).fill(null));
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching quiz:', err);
        setError('Failed to load quiz');
        setLoading(false);
      }
    };

    fetchQuiz();
  }, []);
  
  const handleStartQuiz = () => {
    setQuizStarted(true);
  };
  
  const handleSelectOption = (optionId) => {
    if (showFeedback) return;
    
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionId;
    setAnswers(newAnswers);
  };
  
  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      setShowFeedback(false);
    }
  };
  
  const handleNextQuestion = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setShowFeedback(false);
    }
  };
  
  const handleShowFeedback = () => {
    setShowFeedback(true);
  };
  
  const handleSubmitQuiz = () => {
    // Calculate score
    const score = answers.reduce((total, answer, index) => {
      return answer === quiz.questions[index].correct_option_id ? total + 1 : total;
    }, 0);
    
    // Submit to API (replace with actual API call)
    // axios.post('/api/quiz-attempts', {
    //   quiz_id: quiz.id,
    //   answers,
    //   score,
    //   time_taken: quiz.time_limit * 60 - timeLeft
    // });
    
    setShowResults(true);
  };
  
  const handleRetakeQuiz = () => {
    setAnswers(Array(quiz.questions.length).fill(null));
    setCurrentQuestion(0);
    setShowResults(false);
    setTimeLeft(quiz.time_limit * 60);
    setQuizStarted(true);
    setShowFeedback(false);
  };
  
  // Calculate score for results
  const score = answers.reduce((total, answer, index) => {
    return answer === quiz.questions[index].correct_option_id ? total + 1 : total;
  }, 0);
  
  const scorePercentage = Math.round((score / quiz.questions.length) * 100);
  
  if (loading) {
    return <div>Loading quiz...</div>;
  }
  
  if (error) {
    return <div>{error}</div>;
  }
  
  if (!quizStarted) {
    return (
      <PageContainer>
        <QuizHeader>
          <QuizTitle>{quiz.title}</QuizTitle>
          <QuizMeta>
            <QuizMetaItem>
              <span>Subject:</span>
              <strong>{quiz.subject}</strong>
            </QuizMetaItem>
            <QuizMetaItem>
              <span>Difficulty:</span>
              <strong>{quiz.difficulty}</strong>
            </QuizMetaItem>
            <QuizMetaItem>
              <span>Time:</span>
              <strong>{quiz.time_limit} minutes</strong>
            </QuizMetaItem>
            <QuizMetaItem>
              <span>Questions:</span>
              <strong>{quiz.questions.length}</strong>
            </QuizMetaItem>
          </QuizMeta>
          <QuizDescription>{quiz.description}</QuizDescription>
        </QuizHeader>
        
        <Button 
          variant="contained" 
          onClick={handleStartQuiz}
        >
          {language === 'english' ? 'Start Quiz' : 'क्विज़ शुरू करें'}
        </Button>
      </PageContainer>
    );
  }
  
  if (showResults) {
    return (
      <PageContainer>
        <QuizHeader>
          <QuizTitle>{quiz.title}</QuizTitle>
        </QuizHeader>
        
        <ResultCard>
          <ResultScore>{scorePercentage}%</ResultScore>
          <ResultText>
            {language === 'english' 
              ? `You scored ${score} out of ${quiz.questions.length} questions correctly.`
              : `आपने ${quiz.questions.length} में से ${score} प्रश्नों का सही उत्तर दिया।`
            }
          </ResultText>
          
          <ResultActions>
            <Button 
              variant="contained" 
              onClick={handleRetakeQuiz}
            >
              {language === 'english' ? 'Retake Quiz' : 'क्विज़ दोबारा लें'}
            </Button>
            <Button 
              variant="outlined" 
              onClick={() => window.history.back()}
            >
              {language === 'english' ? 'Back to Quizzes' : 'क्विज़ पर वापस जाएं'}
            </Button>
          </ResultActions>
        </ResultCard>
      </PageContainer>
    );
  }
  
  const currentQuestionData = quiz.questions[currentQuestion];
  
  return (
    <PageContainer>
      <QuizHeader>
        <QuizTitle>{quiz.title}</QuizTitle>
        <QuizMeta>
          <QuizMetaItem>
            <span>Time Left:</span>
            <strong>{formatTime(timeLeft)}</strong>
          </QuizMetaItem>
          <QuizMetaItem>
            <span>Question:</span>
            <strong>{currentQuestion + 1} of {quiz.questions.length}</strong>
          </QuizMetaItem>
        </QuizMeta>
      </QuizHeader>
      
      <QuizCard>
        <ProgressBar>
          <ProgressFill progress={progressPercentage} />
        </ProgressBar>
        
        <QuestionNumber>
          {language === 'english' 
            ? `Question ${currentQuestion + 1} of ${quiz.questions.length}`
            : `प्रश्न ${currentQuestion + 1} / ${quiz.questions.length}`
          }
        </QuestionNumber>
        
        <QuestionText>{currentQuestionData.text}</QuestionText>
        
        <OptionsContainer>
          {currentQuestionData.options.map((option) => (
            <OptionButton
              key={option.id}
              selected={answers[currentQuestion] === option.id}
              correct={showFeedback && option.id === currentQuestionData.correct_option_id}
              incorrect={showFeedback && answers[currentQuestion] === option.id && option.id !== currentQuestionData.correct_option_id}
              onClick={() => handleSelectOption(option.id)}
              disabled={showFeedback}
            >
              <OptionLabel
                selected={answers[currentQuestion] === option.id}
                correct={showFeedback && option.id === currentQuestionData.correct_option_id}
                incorrect={showFeedback && answers[currentQuestion] === option.id && option.id !== currentQuestionData.correct_option_id}
              >
                {String.fromCharCode(64 + option.id)}
              </OptionLabel>
              <OptionText>{option.text}</OptionText>
              {showFeedback && option.id === currentQuestionData.correct_option_id && (
                <OptionIcon correct>✓</OptionIcon>
              )}
              {showFeedback && answers[currentQuestion] === option.id && option.id !== currentQuestionData.correct_option_id && (
                <OptionIcon>✗</OptionIcon>
              )}
            </OptionButton>
          ))}
        </OptionsContainer>
        
        <ButtonContainer>
          <Button 
            variant="outlined" 
            onClick={handlePreviousQuestion}
            disabled={currentQuestion === 0}
          >
            {language === 'english' ? 'Previous' : 'पिछला'}
          </Button>
          
          {!showFeedback ? (
            <Button 
              variant="contained" 
              onClick={handleShowFeedback}
              disabled={answers[currentQuestion] === null}
            >
              {language === 'english' ? 'Check Answer' : 'उत्तर जांचें'}
            </Button>
          ) : null}
          
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
              color="primary"
              onClick={handleSubmitQuiz}
              disabled={answers.includes(null)}
            >
              {language === 'english' ? 'Submit Quiz' : 'क्विज़ जमा करें'}
            </Button>
          )}
        </ButtonContainer>
      </QuizCard>
    </PageContainer>
  );
};

export default QuizDetailPage;

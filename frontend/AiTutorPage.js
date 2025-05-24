import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useTheme } from '../../contexts/ThemeContext';
import axios from 'axios';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Avatar,
  CircularProgress,
  Divider,
  IconButton,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import MicIcon from '@mui/icons-material/Mic';
import TranslateIcon from '@mui/icons-material/Translate';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';

const API_URL = 'http://localhost:5000/api';

const ChatContainer = styled(Paper)`
  display: flex;
  flex-direction: column;
  height: 70vh;
  margin-bottom: var(--space-4);
  background-color: ${props => props.darkMode ? 'var(--neutral-800)' : 'var(--neutral-100)'};
`;

const MessagesContainer = styled(Box)`
  flex: 1;
  overflow-y: auto;
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
`;

const MessageBubble = styled(Box)`
  max-width: 80%;
  padding: var(--space-3);
  border-radius: var(--radius-lg);
  position: relative;
  
  &.user {
    align-self: flex-end;
    background-color: ${props => props.darkMode ? 'var(--primary-blue)' : 'var(--primary-green)'};
    color: white;
    border-bottom-right-radius: var(--radius-sm);
  }
  
  &.assistant {
    align-self: flex-start;
    background-color: ${props => props.darkMode ? 'var(--neutral-700)' : 'var(--neutral-200)'};
    color: ${props => props.darkMode ? 'var(--neutral-100)' : 'var(--neutral-900)'};
    border-bottom-left-radius: var(--radius-sm);
  }
`;

const InputContainer = styled(Box)`
  display: flex;
  padding: var(--space-3);
  border-top: 1px solid ${props => props.darkMode ? 'var(--neutral-700)' : 'var(--neutral-300)'};
`;

const SubjectCard = styled(Card)`
  cursor: pointer;
  transition: transform var(--transition-normal), box-shadow var(--transition-normal);
  height: 100%;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-lg);
  }
  
  .MuiCardContent-root {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  &.selected {
    border: 2px solid ${props => props.color || 'var(--primary-green)'};
  }
`;

const SubjectIcon = styled(Avatar)`
  width: 60px;
  height: 60px;
  margin-bottom: var(--space-2);
  background-color: ${props => props.color || 'var(--primary-green)'};
`;

const AiTutorPage = () => {
  const { sessionId } = useParams();
  const { language, darkMode } = useTheme();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [message, setMessage] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [showSubjectSelector, setShowSubjectSelector] = useState(!sessionId);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch subjects
        const subjectsRes = await axios.get(`${API_URL}/content/subjects`);
        setSubjects(subjectsRes.data.subjects);
        
        // Fetch existing sessions
        const sessionsRes = await axios.get(`${API_URL}/ai-tutor/sessions`);
        setSessions(sessionsRes.data.sessions);
        
        // If sessionId is provided, fetch that session
        if (sessionId) {
          const sessionRes = await axios.get(`${API_URL}/ai-tutor/sessions/${sessionId}`);
          setCurrentSession(sessionRes.data.session);
          setShowSubjectSelector(false);
        }
      } catch (error) {
        console.error('Error fetching AI tutor data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [sessionId]);
  
  const handleSubjectSelect = (subject) => {
    setSelectedSubject(subject);
  };
  
  const handleStartSession = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/ai-tutor/sessions`, {
        language: language,
        subject_id: selectedSubject?._id
      });
      
      setCurrentSession(response.data.session);
      setShowSubjectSelector(false);
      navigate(`/dashboard/ai-tutor/${response.data.session.session_id}`);
    } catch (error) {
      console.error('Error creating AI tutor session:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSendMessage = async () => {
    if (!message.trim() || !currentSession) return;
    
    const messageToSend = message;
    setMessage('');
    
    // Optimistically add user message to UI
    setCurrentSession(prev => ({
      ...prev,
      messages: [
        ...prev.messages,
        {
          role: 'user',
          content: messageToSend,
          timestamp: new Date().toISOString(),
          content_type: 'text'
        }
      ]
    }));
    
    try {
      const response = await axios.post(`${API_URL}/ai-tutor/sessions/${currentSession.session_id}/messages`, {
        message: messageToSend,
        content_type: 'text'
      });
      
      // Add AI response to UI
      setCurrentSession(prev => ({
        ...prev,
        messages: [
          ...prev.messages,
          response.data.message
        ]
      }));
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  if (loading && !currentSession && !showSubjectSelector) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Container>
    );
  }
  
  return (
    <Container>
      <Box mb={4}>
        <Typography variant="h4" gutterBottom>
          <SmartToyIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          {language === 'english' ? 'AI Tutor' : 'एआई ट्यूटर'}
        </Typography>
        <Typography variant="body1" color="textSecondary">
          {language === 'english' 
            ? 'Your personal AI tutor to help you learn and understand concepts.' 
            : 'अवधारणाओं को सीखने और समझने में आपकी मदद करने के लिए आपका व्यक्तिगत एआई ट्यूटर।'}
        </Typography>
      </Box>
      
      {showSubjectSelector ? (
        <Box>
          <Typography variant="h6" gutterBottom>
            {language === 'english' ? 'Select a subject to start with:' : 'शुरू करने के लिए एक विषय चुनें:'}
          </Typography>
          
          <Grid container spacing={3} mb={4}>
            {subjects.map((subject) => (
              <Grid item xs={6} sm={4} md={3} key={subject._id}>
                <SubjectCard 
                  onClick={() => handleSubjectSelect(subject)}
                  className={selectedSubject?._id === subject._id ? 'selected' : ''}
                  color={subject.color_code}
                >
                  <CardContent>
                    <SubjectIcon color={subject.color_code}>
                      {subject.name.charAt(0)}
                    </SubjectIcon>
                    <Typography variant="h6">{subject.name}</Typography>
                  </CardContent>
                </SubjectCard>
              </Grid>
            ))}
            <Grid item xs={6} sm={4} md={3}>
              <SubjectCard 
                onClick={() => handleSubjectSelect(null)}
                className={selectedSubject === null ? 'selected' : ''}
              >
                <CardContent>
                  <SubjectIcon>
                    <SmartToyIcon />
                  </SubjectIcon>
                  <Typography variant="h6">
                    {language === 'english' ? 'General Topics' : 'सामान्य विषय'}
                  </Typography>
                </CardContent>
              </SubjectCard>
            </Grid>
          </Grid>
          
          <Box display="flex" justifyContent="center">
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              onClick={handleStartSession}
              disabled={loading}
              startIcon={<SmartToyIcon />}
            >
              {loading 
                ? (language === 'english' ? 'Starting...' : 'शुरू हो रहा है...') 
                : (language === 'english' ? 'Start Tutoring Session' : 'ट्यूटरिंग सत्र शुरू करें')}
            </Button>
          </Box>
          
          {sessions.length > 0 && (
            <Box mt={6}>
              <Typography variant="h6" gutterBottom>
                {language === 'english' ? 'Continue previous sessions:' : 'पिछले सत्र जारी रखें:'}
              </Typography>
              
              <Grid container spacing={2}>
                {sessions.slice(0, 3).map((session) => (
                  <Grid item xs={12} sm={4} key={session.session_id}>
                    <Card>
                      <CardContent>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {session.subject_id?.name || (language === 'english' ? 'General Topics' : 'सामान्य विषय')}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {new Date(session.last_interaction_at).toLocaleDateString()}
                        </Typography>
                        <Box mt={2}>
                          <Button 
                            variant="outlined" 
                            size="small"
                            onClick={() => navigate(`/dashboard/ai-tutor/${session.session_id}`)}
                          >
                            {language === 'english' ? 'Continue' : 'जारी रखें'}
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Box>
      ) : (
        <>
          <ChatContainer elevation={1} darkMode={darkMode ? 1 : 0}>
            <MessagesContainer>
              {currentSession?.messages.map((msg, index) => (
                <MessageBubble 
                  key={index} 
                  className={msg.role === 'user' ? 'user' : 'assistant'}
                  darkMode={darkMode ? 1 : 0}
                >
                  <Box display="flex" alignItems="center" mb={1}>
                    <Avatar 
                      sx={{ 
                        width: 24, 
                        height: 24, 
                        mr: 1,
                        bgcolor: msg.role === 'user' ? 'primary.main' : 'secondary.main'
                      }}
                    >
                      {msg.role === 'user' ? <PersonIcon fontSize="small" /> : <SmartToyIcon fontSize="small" />}
                    </Avatar>
                    <Typography variant="caption" fontWeight={500}>
                      {msg.role === 'user' 
                        ? (language === 'english' ? 'You' : 'आप') 
                        : (language === 'english' ? 'AI Tutor' : 'एआई ट्यूटर')}
                    </Typography>
                  </Box>
                  <Typography variant="body1">{msg.content}</Typography>
                </MessageBubble>
              ))}
            </MessagesContainer>
            
            <InputContainer darkMode={darkMode ? 1 : 0}>
              <TextField
                fullWidth
                placeholder={language === 'english' ? 'Ask your question...' : 'अपना प्रश्न पूछें...'}
                variant="outlined"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                multiline
                maxRows={3}
                sx={{ mr: 2 }}
              />
              <Box display="flex">
                <IconButton color="primary" sx={{ mr: 1 }}>
                  <MicIcon />
                </IconButton>
                <IconButton color="primary" sx={{ mr: 1 }}>
                  <TranslateIcon />
                </IconButton>
                <Button 
                  variant="contained" 
                  color="primary"
                  endIcon={<SendIcon />}
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                >
                  {language === 'english' ? 'Send' : 'भेजें'}
                </Button>
              </Box>
            </InputContainer>
          </ChatContainer>
          
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              {language === 'english' ? 'Quick prompts:' : 'त्वरित प्रॉम्प्ट:'}
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              <Button 
                variant="outlined" 
                size="small"
                onClick={() => setMessage('Explain this concept in simple terms')}
              >
                {language === 'english' ? 'Explain simply' : 'सरल रूप से समझाएं'}
              </Button>
              <Button 
                variant="outlined" 
                size="small"
                onClick={() => setMessage('Give me an example of this')}
              >
                {language === 'english' ? 'Give example' : 'उदाहरण दें'}
              </Button>
              <Button 
                variant="outlined" 
                size="small"
                onClick={() => setMessage('How can I solve this problem?')}
              >
                {language === 'english' ? 'Help solve' : 'हल करने में मदद करें'}
              </Button>
              <Button 
                variant="outlined" 
                size="small"
                onClick={() => setMessage('Summarize this topic for quick revision')}
              >
                {language === 'english' ? 'Summarize' : 'सारांश दें'}
              </Button>
            </Box>
          </Box>
        </>
      )}
    </Container>
  );
};

export default AiTutorPage;

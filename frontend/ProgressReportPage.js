import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
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
  CircularProgress,
  Divider,
  LinearProgress,
  Chip,
  Paper
} from '@mui/material';
import InsightsIcon from '@mui/icons-material/Insights';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';

const API_URL = 'http://localhost:5000/api';

const ProgressCard = styled(Card)`
  height: 100%;
  display: flex;
  flex-direction: column;
  
  .MuiCardContent-root {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }
  
  .progress-title {
    font-weight: 600;
    margin-bottom: var(--space-2);
  }
  
  .progress-value {
    font-size: var(--text-3xl);
    font-weight: 700;
    color: ${props => props.color || 'var(--primary-blue)'};
    margin-bottom: var(--space-2);
  }
  
  .progress-bar {
    margin-bottom: var(--space-2);
  }
`;

const BadgeGrid = styled(Grid)`
  .badge-card {
    text-align: center;
    padding: var(--space-3);
    transition: transform var(--transition-normal);
    
    &:hover {
      transform: translateY(-5px);
    }
    
    .badge-icon {
      width: 60px;
      height: 60px;
      margin: 0 auto var(--space-2);
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background-color: ${props => props.darkMode ? 'var(--neutral-700)' : 'var(--neutral-200)'};
      
      svg {
        font-size: 32px;
        color: ${props => props.color || 'var(--primary-blue)'};
      }
    }
    
    .badge-name {
      font-weight: 600;
      margin-bottom: var(--space-1);
    }
    
    .badge-description {
      font-size: var(--text-sm);
      color: var(--neutral-600);
    }
    
    .badge-date {
      font-size: var(--text-xs);
      color: var(--neutral-500);
      margin-top: var(--space-2);
    }
  }
`;

const ActivityItem = styled(Box)`
  padding: var(--space-3);
  border-left: 3px solid ${props => props.color || 'var(--primary-blue)'};
  background-color: ${props => props.darkMode ? 'var(--neutral-800)' : 'var(--neutral-100)'};
  margin-bottom: var(--space-3);
  border-radius: var(--radius-md);
  
  .activity-title {
    font-weight: 600;
    margin-bottom: var(--space-1);
  }
  
  .activity-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: var(--text-sm);
    color: var(--neutral-600);
  }
`;

const StyledTabs = styled(Tabs)`
  margin-bottom: var(--space-4);
  
  .MuiTab-root {
    text-transform: none;
    font-weight: 500;
  }
`;

const LeaderboardItem = styled(Box)`
  display: flex;
  align-items: center;
  padding: var(--space-2);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-2);
  background-color: ${props => 
    props.isCurrentUser 
      ? (props.darkMode ? 'rgba(19, 136, 8, 0.2)' : 'rgba(19, 136, 8, 0.1)') 
      : 'transparent'};
  
  .rank {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    margin-right: var(--space-3);
    
    &.top-1 {
      background-color: gold;
      color: black;
    }
    
    &.top-2 {
      background-color: silver;
      color: black;
    }
    
    &.top-3 {
      background-color: #cd7f32; /* bronze */
      color: white;
    }
    
    &.other {
      background-color: ${props => props.darkMode ? 'var(--neutral-700)' : 'var(--neutral-300)'};
      color: ${props => props.darkMode ? 'var(--neutral-100)' : 'var(--neutral-900)'};
    }
  }
  
  .user-info {
    flex-grow: 1;
  }
  
  .score {
    font-weight: 600;
    color: ${props => props.isCurrentUser ? 'var(--primary-green)' : 'inherit'};
  }
`;

const ProgressReportPage = () => {
  const { language, darkMode } = useTheme();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [subjectProgress, setSubjectProgress] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [badges, setBadges] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch progress summary
        const summaryRes = await axios.get(`${API_URL}/progress/summary`);
        setSummary(summaryRes.data.summary);
        setSubjectProgress(summaryRes.data.subject_progress);
        setRecentActivity(summaryRes.data.recent_activity);
        
        // Fetch badges
        const badgesRes = await axios.get(`${API_URL}/progress/badges`);
        setBadges(badgesRes.data.badges);
        
        // Fetch leaderboard (default: weekly)
        await fetchLeaderboard('weekly');
      } catch (error) {
        console.error('Error fetching progress data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const fetchLeaderboard = async (timePeriod) => {
    try {
      const params = { time_period: timePeriod };
      const response = await axios.get(`${API_URL}/progress/leaderboard`, { params });
      setLeaderboard(response.data.leaderboard);
      setUserRank(response.data.user_rank);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  };
  
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    
    // Fetch leaderboard based on tab
    const timePeriods = ['daily', 'weekly', 'monthly'];
    fetchLeaderboard(timePeriods[newValue]);
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  if (loading) {
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
          <InsightsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          {language === 'english' ? 'Progress Report' : 'प्रगति रिपोर्ट'}
        </Typography>
        <Typography variant="body1" color="textSecondary">
          {language === 'english' 
            ? 'Track your learning journey and achievements.' 
            : 'अपनी सीखने की यात्रा और उपलब्धियों को ट्रैक करें।'}
        </Typography>
      </Box>
      
      <Grid container spacing={3} mb={6}>
        <Grid item xs={6} sm={3}>
          <ProgressCard color="var(--primary-green)">
            <CardContent>
              <Typography className="progress-title" variant="subtitle2">
                {language === 'english' ? 'Completion Rate' : 'पूर्णता दर'}
              </Typography>
              <Typography className="progress-value">
                {summary?.total_completed || 0}
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                {language === 'english' ? 'Lessons & Quizzes' : 'पाठ और क्विज़'}
              </Typography>
              <LinearProgress 
                className="progress-bar"
                variant="determinate" 
                value={75} 
                color="success"
              />
            </CardContent>
          </ProgressCard>
        </Grid>
        
        <Grid item xs={6} sm={3}>
          <ProgressCard color="var(--primary-saffron)">
            <CardContent>
              <Typography className="progress-title" variant="subtitle2">
                {language === 'english' ? 'Average Score' : 'औसत स्कोर'}
              </Typography>
              <Typography className="progress-value">
                {summary?.average_score ? `${Math.round(summary.average_score)}%` : '0%'}
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                {language === 'english' ? 'Across all quizzes' : 'सभी क्विज़ में'}
              </Typography>
              <LinearProgress 
                className="progress-bar"
                variant="determinate" 
                value={summary?.average_score || 0} 
                color="warning"
              />
            </CardContent>
          </ProgressCard>
        </Grid>
        
        <Grid item xs={6} sm={3}>
          <ProgressCard color="var(--primary-blue)">
            <CardContent>
              <Typography className="progress-title" variant="subtitle2">
                {language === 'english' ? 'Current Streak' : 'वर्तमान स्ट्रीक'}
              </Typography>
              <Box display="flex" alignItems="center">
                <Typography className="progress-value">
                  {summary?.current_streak || 0}
                </Typography>
                <LocalFireDepartmentIcon 
                  sx={{ ml: 1, color: 'var(--primary-saffron)', fontSize: '2rem' }} 
                />
              </Box>
              <Typography variant="body2" color="textSecondary">
                {language === 'english' ? 'Days in a row' : 'लगातार दिन'}
              </Typography>
            </CardContent>
          </ProgressCard>
        </Grid>
        
        <Grid item xs={6} sm={3}>
          <ProgressCard color="var(--secondary-purple)">
            <CardContent>
              <Typography className="progress-title" variant="subtitle2">
                {language === 'english' ? 'Badges Earned' : 'अर्जित बैज'}
              </Typography>
              <Typography className="progress-value">
                {badges.length}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {language === 'english' ? 'Keep learning to earn more!' : 'और अधिक कमाने के लिए सीखते रहें!'}
              </Typography>
            </CardContent>
          </ProgressCard>
        </Grid>
      </Grid>
      
      <Box mb={6}>
        <Typography variant="h5" gutterBottom>
          <TrendingUpIcon sx={{ mr: 1, verticalAlign: 'middle', color: 'var(--primary-green)' }} />
          {language === 'english' ? 'Subject Progress' : 'विषय प्रगति'}
        </Typography>
        
        <Grid container spacing={3}>
          {subjectProgress.map((subject) => (
            <Grid item xs={12} sm={6} md={4} key={subject.subject.id}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Box 
                      width={40} 
                      height={40} 
                      borderRadius="50%" 
                      display="flex" 
                      alignItems="center" 
                      justifyContent="center"
                      bgcolor={subject.subject.color_code || 'var(--primary-green)'}
                      color="white"
                      mr={2}
                    >
                      {subject.subject.name.charAt(0)}
                    </Box>
                    <Typography variant="h6">{subject.subject.name}</Typography>
                  </Box>
                  
                  <Box mb={2}>
                    <Box display="flex" justifyContent="space-between" mb={0.5}>
                      <Typography variant="body2">
                        {language === 'english' ? 'Completion' : 'पूर्णता'}
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {Math.round(subject.completion_percentage)}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={subject.completion_percentage} 
                      sx={{ 
                        height: 8, 
                        borderRadius: 4,
                        bgcolor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: subject.subject.color_code || 'var(--primary-green)'
                        }
                      }}
                    />
                  </Box>
                  
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" color="textSecondary">
                      {language === 'english' ? 'Average Score' : 'औसत स्कोर'}: {Math.round(subject.average_score)}%
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {subject.completed_count}/{subject.total_count}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
      
      <Grid container spacing={4} mb={6}>
        <Grid item xs={12} md={6}>
          <Typography variant="h5" gutterBottom>
            <EmojiEventsIcon sx={{ mr: 1, verticalAlign: 'middle', color: 'var(--primary-saffron)' }} />
            {language === 'english' ? 'Achievements & Badges' : 'उपलब्धियां और बैज'}
          </Typography>
          
          <BadgeGrid container spacing={2} darkMode={darkMode ? 1 : 0}>
            {badges.map((badge) => (
              <Grid item xs={6} sm={4} key={badge.id}>
                <Paper className="badge-card" elevation={1}>
                  <Box className="badge-icon">
                    {badge.id.includes('quiz') ? (
                      <QuizIcon />
                    ) : badge.id.includes('lesson') ? (
                      <MenuBookIcon />
                    ) : badge.id.includes('perfect') ? (
                      <EmojiEventsIcon />
                    ) : (
                      <CheckCircleIcon />
                    )}
                  </Box>
                  <Typography className="badge-name" variant="subtitle2">
                    {badge.name}
                  </Typography>
                  <Typography className="badge-description" variant="body2">
                    {badge.description}
                  </Typography>
                  <Typography className="badge-date" variant="caption">
                    {language === 'english' ? 'Earned on ' : 'अर्जित किया '} 
                    {formatDate(badge.earned_at)}
                  </Typography>
                </Paper>
              </Grid>
            ))}
            
            {badges.length === 0 && (
              <Grid item xs={12}>
                <Box textAlign="center" py={4}>
                  <Typography variant="body1">
                    {language === 'english' 
                      ? 'Complete lessons and quizzes to earn badges!' 
                      : 'बैज अर्जित करने के लिए पाठ और क्विज़ पूरा करें!'}
                  </Typography>
                </Box>
              </Grid>
            )}
          </BadgeGrid>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Typography variant="h5" gutterBottom>
            <InsightsIcon sx={{ mr: 1, verticalAlign: 'middle', color: 'var(--primary-blue)' }} />
            {language === 'english' ? 'Recent Activity' : 'हाल की गतिविधि'}
          </Typography>
          
          {recentActivity.map((activity, index) => (
            <ActivityItem 
              key={index} 
              color={
                activity.progress_type === 'quiz_attempt' 
                  ? 'var(--primary-saffron)' 
                  : 'var(--primary
(Content truncated due to size limit. Use line ranges to read in chunks)
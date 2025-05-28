import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import styled from 'styled-components';
import axios from 'axios';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';

// Styled components
const PageContainer = styled.div`
  padding: var(--space-4);
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  color: var(--text-primary);
  margin-bottom: var(--space-4);
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: var(--space-4);
  margin-bottom: var(--space-6);
`;

const StatCard = styled.div`
  background-color: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  color: var(--primary);
  margin-bottom: var(--space-2);
`;

const StatLabel = styled.div`
  font-size: 1rem;
  color: var(--text-secondary);
`;

const ChartContainer = styled.div`
  background-color: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  box-shadow: var(--shadow-sm);
  margin-bottom: var(--space-6);
  height: 400px;
`;

const ChartTitle = styled.h2`
  font-size: 1.5rem;
  color: var(--text-primary);
  margin-bottom: var(--space-4);
`;

const ChartGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ActivitySection = styled.div`
  background-color: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  box-shadow: var(--shadow-sm);
`;

const ActivityTitle = styled.h2`
  font-size: 1.5rem;
  color: var(--text-primary);
  margin-bottom: var(--space-4);
`;

const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: center;
  padding: var(--space-3);
  border-radius: var(--radius-md);
  background-color: var(--bg-secondary);
  border-left: 4px solid ${props => props.color || 'var(--primary)'};
`;

const ActivityIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${props => props.color || 'var(--primary)'};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: var(--space-3);
  color: white;
  font-size: 1.2rem;
`;

const ActivityContent = styled.div`
  flex: 1;
`;

const ActivityTitle2 = styled.div`
  font-weight: bold;
  color: var(--text-primary);
  margin-bottom: var(--space-1);
`;

const ActivityMeta = styled.div`
  display: flex;
  justify-content: space-between;
  color: var(--text-secondary);
  font-size: 0.9rem;
`;

const TabContainer = styled.div`
  display: flex;
  margin-bottom: var(--space-4);
  border-bottom: 1px solid var(--border-color);
`;

const Tab = styled.button`
  padding: var(--space-3) var(--space-4);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  color: ${props => props.active ? 'var(--primary)' : 'var(--text-secondary)'};
  border-bottom: 2px solid ${props => props.active ? 'var(--primary)' : 'transparent'};
  transition: all 0.3s ease;
  
  &:hover {
    color: var(--primary);
  }
`;

const NoDataMessage = styled.div`
  text-align: center;
  padding: var(--space-6);
  color: var(--text-secondary);
  font-size: 1.1rem;
`;

// Sample data (replace with actual API data)
const sampleProgressData = [
  { date: '2023-01-01', score: 65 },
  { date: '2023-01-08', score: 70 },
  { date: '2023-01-15', score: 68 },
  { date: '2023-01-22', score: 75 },
  { date: '2023-01-29', score: 82 },
  { date: '2023-02-05', score: 78 },
  { date: '2023-02-12', score: 85 },
];

const sampleSubjectData = [
  { name: 'Mathematics', value: 35 },
  { name: 'Science', value: 25 },
  { name: 'English', value: 20 },
  { name: 'History', value: 15 },
  { name: 'Computer', value: 5 },
];

const sampleActivityData = [
  { name: 'Quizzes', completed: 24 },
  { name: 'Lessons', completed: 18 },
  { name: 'AI Tutor', completed: 12 },
  { name: 'Practice', completed: 8 },
];

const sampleRecentActivity = [
  {
    id: 1,
    title: 'Completed Quiz: Algebra Fundamentals',
    progress_type: 'quiz_attempt',
    score: '85%',
    date: '2023-02-12',
    time: '14:30'
  },
  {
    id: 2,
    title: 'Completed Lesson: Introduction to Chemistry',
    progress_type: 'lesson_completion',
    date: '2023-02-11',
    time: '10:15'
  },
  {
    id: 3,
    title: 'AI Tutor Session: English Grammar',
    progress_type: 'ai_tutor',
    duration: '25 mins',
    date: '2023-02-10',
    time: '16:45'
  },
  {
    id: 4,
    title: 'Practice Session: History Dates',
    progress_type: 'practice',
    score: '70%',
    date: '2023-02-09',
    time: '11:20'
  },
];

// COLORS
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const ProgressReportPage = () => {
  const { darkMode } = useTheme();
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [progressData, setProgressData] = useState(sampleProgressData);
  const [subjectData, setSubjectData] = useState(sampleSubjectData);
  const [activityData, setActivityData] = useState(sampleActivityData);
  const [recentActivity, setRecentActivity] = useState(sampleRecentActivity);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch user progress data
  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        setLoading(true);
        // Replace with actual API call
        // const response = await axios.get('/api/progress');
        // setProgressData(response.data.progressData);
        // setSubjectData(response.data.subjectData);
        // setActivityData(response.data.activityData);
        // setRecentActivity(response.data.recentActivity);
        
        // Using sample data for now
        setProgressData(sampleProgressData);
        setSubjectData(sampleSubjectData);
        setActivityData(sampleActivityData);
        setRecentActivity(sampleRecentActivity);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching progress data:', err);
        setError('Failed to load progress data');
        setLoading(false);
      }
    };

    fetchProgressData();
  }, []);

  // Calculate overall stats
  const totalQuizzes = activityData.find(item => item.name === 'Quizzes')?.completed || 0;
  const totalLessons = activityData.find(item => item.name === 'Lessons')?.completed || 0;
  const averageScore = progressData.reduce((sum, item) => sum + item.score, 0) / progressData.length;
  const studyStreak = 7; // Replace with actual calculation

  return (
    <PageContainer>
      <PageTitle>Progress Report</PageTitle>
      
      <TabContainer>
        <Tab 
          active={activeTab === 'overview'} 
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </Tab>
        <Tab 
          active={activeTab === 'subjects'} 
          onClick={() => setActiveTab('subjects')}
        >
          Subjects
        </Tab>
        <Tab 
          active={activeTab === 'activity'} 
          onClick={() => setActiveTab('activity')}
        >
          Activity
        </Tab>
      </TabContainer>
      
      {loading ? (
        <NoDataMessage>Loading progress data...</NoDataMessage>
      ) : error ? (
        <NoDataMessage>{error}</NoDataMessage>
      ) : (
        <>
          {activeTab === 'overview' && (
            <>
              <StatsContainer>
                <StatCard>
                  <StatValue>{totalQuizzes}</StatValue>
                  <StatLabel>Quizzes Completed</StatLabel>
                </StatCard>
                <StatCard>
                  <StatValue>{totalLessons}</StatValue>
                  <StatLabel>Lessons Completed</StatLabel>
                </StatCard>
                <StatCard>
                  <StatValue>{averageScore.toFixed(1)}%</StatValue>
                  <StatLabel>Average Score</StatLabel>
                </StatCard>
                <StatCard>
                  <StatValue>{studyStreak}</StatValue>
                  <StatLabel>Day Streak</StatLabel>
                </StatCard>
              </StatsContainer>
              
              <ChartContainer>
                <ChartTitle>Progress Over Time</ChartTitle>
                <ResponsiveContainer width="100%" height="85%">
                  <LineChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="var(--primary)" 
                      activeDot={{ r: 8 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </>
          )}
          
          {activeTab === 'subjects' && (
            <ChartGrid>
              <ChartContainer>
                <ChartTitle>Subject Distribution</ChartTitle>
                <ResponsiveContainer width="100%" height="85%">
                  <PieChart>
                    <Pie
                      data={subjectData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {subjectData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
              
              <ChartContainer>
                <ChartTitle>Activity Breakdown</ChartTitle>
                <ResponsiveContainer width="100%" height="85%">
                  <BarChart data={activityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="completed" fill="var(--primary)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </ChartGrid>
          )}
          
          {activeTab === 'activity' && (
            <ActivitySection>
              <ActivityTitle>Recent Activity</ActivityTitle>
              
              <ActivityList>
                {recentActivity.map((activity, index) => (
                  <ActivityItem 
                    key={index} 
                    color={
                      activity.progress_type === 'quiz_attempt' 
                        ? 'var(--primary-saffron)' 
                        : activity.progress_type === 'lesson_completion'
                          ? 'var(--primary-green)'
                          : activity.progress_type === 'ai_tutor'
                            ? 'var(--primary-blue)'
                            : 'var(--primary-purple)'
                    }
                  >
                    <ActivityIcon 
                      color={
                        activity.progress_type === 'quiz_attempt' 
                          ? 'var(--primary-saffron)' 
                          : activity.progress_type === 'lesson_completion'
                            ? 'var(--primary-green)'
                            : activity.progress_type === 'ai_tutor'
                              ? 'var(--primary-blue)'
                              : 'var(--primary-purple)'
                      }
                    >
                      {activity.progress_type === 'quiz_attempt' && '📝'}
                      {activity.progress_type === 'lesson_completion' && '📚'}
                      {activity.progress_type === 'ai_tutor' && '🤖'}
                      {activity.progress_type === 'practice' && '⚒️'}
                    </ActivityIcon>
                    
                    <ActivityContent>
                      <ActivityTitle2>{activity.title}</ActivityTitle2>
                      <ActivityMeta>
                        <span>{activity.date} at {activity.time}</span>
                        {activity.score && <span>Score: {activity.score}</span>}
                        {activity.duration && <span>Duration: {activity.duration}</span>}
                      </ActivityMeta>
                    </ActivityContent>
                  </ActivityItem>
                ))}
              </ActivityList>
            </ActivitySection>
          )}
        </>
      )}
    </PageContainer>
  );
};

export default ProgressReportPage;

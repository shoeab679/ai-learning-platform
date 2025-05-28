import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import axios from 'axios';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Skeleton,
  Divider
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import LockIcon from '@mui/icons-material/Lock';
import { useAuth } from '../contexts/AuthContext';

const API_URL = 'http://localhost:5000/api';

const FilterContainer = styled(Box)`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ContentCard = styled(Card)`
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
  
  .MuiCardMedia-root {
    height: 160px;
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

const NoResultsContainer = styled(Box)`
  text-align: center;
  padding: var(--space-8) 0;
`;

const CourseExplorerPage = () => {
  const { language, darkMode } = useTheme();
  const { isPremium } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [content, setContent] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  
  const [filters, setFilters] = useState({
    subject_id: '',
    class_id: '',
    search: ''
  });
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch subjects
        const subjectsRes = await axios.get(`${API_URL}/content/subjects`);
        setSubjects(subjectsRes.data.subjects);
        
        // Fetch classes
        const classesRes = await axios.get(`${API_URL}/content/classes`);
        setClasses(classesRes.data.classes);
        
        // Fetch initial content
        await fetchContent();
      } catch (error) {
        console.error('Error fetching course explorer data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const fetchContent = async () => {
    try {
      let endpoint = `${API_URL}/content/by-class-subject`;
      const params = {};
      
      if (filters.subject_id) params.subject_id = filters.subject_id;
      if (filters.class_id) params.class_id = filters.class_id;
      
      if (filters.search) {
        endpoint = `${API_URL}/content/search/all`;
        params.query = filters.search;
      }
      
      const response = await axios.get(endpoint, { params });
      setContent(filters.search ? response.data.results : response.data.content);
    } catch (error) {
      console.error('Error fetching content:', error);
    }
  };
  
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    
    // Filter by subject based on tab
    if (newValue === 0) {
      // All subjects
      setFilters(prev => ({ ...prev, subject_id: '' }));
    } else {
      const subjectId = subjects[newValue - 1]?._id;
      setFilters(prev => ({ ...prev, subject_id: subjectId }));
    }
  };
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    fetchContent();
  };
  
  useEffect(() => {
    // Refetch content when filters change
    // But not on initial load or when search changes (as we want to trigger search manually)
    if (!loading && filters.subject_id !== undefined) {
      fetchContent();
    }
  }, [filters.subject_id, filters.class_id]);
  
  return (
    <Container>
      <Box mb={4}>
        <Typography variant="h4" gutterBottom>
          {language === 'english' ? 'Course Explorer' : 'पाठ्यक्रम अन्वेषक'}
        </Typography>
        <Typography variant="body1" color="textSecondary">
          {language === 'english' 
            ? 'Explore our comprehensive learning materials across various subjects.' 
            : 'विभिन्न विषयों में हमारी व्यापक शिक्षण सामग्री का अन्वेषण करें।'}
        </Typography>
      </Box>
      
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
      
      <FilterContainer>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="class-filter-label">
            {language === 'english' ? 'Class/Grade' : 'कक्षा/ग्रेड'}
          </InputLabel>
          <Select
            labelId="class-filter-label"
            name="class_id"
            value={filters.class_id}
            label={language === 'english' ? 'Class/Grade' : 'कक्षा/ग्रेड'}
            onChange={handleFilterChange}
          >
            <MenuItem value="">
              {language === 'english' ? 'All Classes' : 'सभी कक्षाएँ'}
            </MenuItem>
            {classes.map(cls => (
              <MenuItem key={cls._id} value={cls._id}>
                {language === 'english' ? `Class ${cls.grade_number}` : `कक्षा ${cls.grade_number}`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <Box component="form" onSubmit={handleSearch} sx={{ display: 'flex', flexGrow: 1 }}>
          <TextField
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder={language === 'english' ? 'Search courses...' : 'पाठ्यक्रम खोजें...'}
            variant="outlined"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <Button type="submit" variant="contained" size="small">
                    {language === 'english' ? 'Search' : 'खोजें'}
                  </Button>
                </InputAdornment>
              )
            }}
          />
        </Box>
      </FilterContainer>
      
      <Divider sx={{ mb: 4 }} />
      
      {loading ? (
        <Grid container spacing={3}>
          {Array(8).fill().map((_, i) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
              <Skeleton variant="rectangular" height={160} />
              <Skeleton variant="text" height={30} sx={{ mt: 1 }} />
              <Skeleton variant="text" height={20} />
              <Skeleton variant="text" height={20} width="60%" />
            </Grid>
          ))}
        </Grid>
      ) : content.length > 0 ? (
        <Grid container spacing={3}>
          {content.map((item) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item._id}>
              <ContentCard>
                {item.is_premium && (
                  <div className="premium-badge">
                    <LockIcon fontSize="inherit" />
                    {language === 'english' ? 'Premium' : 'प्रीमियम'}
                  </div>
                )}
                <CardMedia
                  component="img"
                  image={item.thumbnail_url || `https://source.unsplash.com/random/300x200?${item.subject_id.name.toLowerCase()}`}
                  alt={item.title}
                />
                <CardContent>
                  <Typography className="content-title" variant="h6">
                    {item.title}
                  </Typography>
                  <Typography className="content-description" variant="body2">
                    {item.description.length > 100 
                      ? `${item.description.substring(0, 100)}...` 
                      : item.description}
                  </Typography>
                  <Box className="content-meta">
                    <Box>
                      <Chip 
                        label={item.subject_id.name} 
                        size="small" 
                        style={{ 
                          backgroundColor: item.subject_id.color_code || 'var(--primary-green)',
                          color: 'white',
                          marginRight: 'var(--space-2)'
                        }} 
                      />
                      <Chip 
                        label={`Class ${item.class_id.grade_number}`} 
                        size="small" 
                        variant="outlined"
                      />
                    </Box>
                    <Button 
                      size="small" 
                      variant="contained" 
                      color="primary"
                      onClick={() => navigate(`/dashboard/content/${item._id}`)}
                      startIcon={<PlayArrowIcon />}
                      disabled={item.is_premium && !isPremium}
                    >
                      {language === 'english' ? 'Start' : 'शुरू करें'}
                    </Button>
                  </Box>
                </CardContent>
              </ContentCard>
            </Grid>
          ))}
        </Grid>
      ) : (
        <NoResultsContainer>
          <Typography variant="h6" gutterBottom>
            {language === 'english' ? 'No courses found' : 'कोई पाठ्यक्रम नहीं मिला'}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {language === 'english' 
              ? 'Try adjusting your filters or search terms' 
              : 'अपने फ़िल्टर या खोज शब्दों को समायोजित करने का प्रयास करें'}
          </Typography>
          <Button 
            variant="outlined" 
            color="primary" 
            sx={{ mt: 2 }}
            onClick={() => {
              setFilters({ subject_id: '', class_id: '', search: '' });
              setActiveTab(0);
            }}
          >
            {language === 'english' ? 'Clear Filters' : 'फ़िल्टर साफ़ करें'}
          </Button>
        </NoResultsContainer>
      )}
    </Container>
  );
};

export default CourseExplorerPage;

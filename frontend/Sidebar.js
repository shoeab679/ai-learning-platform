import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useTheme } from '../../contexts/ThemeContext';
import { List, ListItem, ListItemIcon, ListItemText, Divider, Paper } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import QuizIcon from '@mui/icons-material/Quiz';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import InsightsIcon from '@mui/icons-material/Insights';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const SidebarContainer = styled(Paper)`
  height: 100%;
  width: 100%;
  overflow-y: auto;
  background-color: ${props => props.darkMode ? 'var(--neutral-800)' : 'var(--neutral-100)'};
  color: ${props => props.darkMode ? 'var(--neutral-100)' : 'var(--neutral-900)'};
  border-right: 1px solid ${props => props.darkMode ? 'var(--neutral-700)' : 'var(--neutral-300)'};
`;

const SidebarHeader = styled.div`
  padding: var(--space-4);
  text-align: center;
  
  h2 {
    font-family: var(--font-decorative);
    margin-bottom: var(--space-2);
    color: ${props => props.darkMode ? 'var(--primary-saffron)' : 'var(--primary-blue)'};
  }
`;

const StyledListItem = styled(ListItem)`
  margin: var(--space-1) 0;
  border-radius: var(--radius-md);
  
  &.active {
    background-color: ${props => props.darkMode 
      ? 'rgba(255, 153, 51, 0.2)' // saffron with opacity for dark mode
      : 'rgba(19, 136, 8, 0.1)'}; // green with opacity for light mode
    
    .MuiListItemIcon-root {
      color: ${props => props.darkMode ? 'var(--primary-saffron)' : 'var(--primary-green)'};
    }
    
    .MuiListItemText-primary {
      color: ${props => props.darkMode ? 'var(--primary-saffron)' : 'var(--primary-green)'};
      font-weight: 600;
    }
  }
`;

const Sidebar = ({ closeSidebar }) => {
  const { darkMode, language } = useTheme();
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  
  const menuItems = [
    {
      text: language === 'english' ? 'Dashboard' : 'डैशबोर्ड',
      icon: <DashboardIcon />,
      path: '/dashboard'
    },
    {
      text: language === 'english' ? 'Course Explorer' : 'पाठ्यक्रम अन्वेषक',
      icon: <MenuBookIcon />,
      path: '/dashboard/courses'
    },
    {
      text: language === 'english' ? 'Quiz Arena' : 'क्विज़ अखाड़ा',
      icon: <QuizIcon />,
      path: '/dashboard/quizzes'
    },
    {
      text: language === 'english' ? 'AI Tutor' : 'एआई ट्यूटर',
      icon: <SmartToyIcon />,
      path: '/dashboard/ai-tutor'
    },
    {
      text: language === 'english' ? 'Progress Report' : 'प्रगति रिपोर्ट',
      icon: <InsightsIcon />,
      path: '/dashboard/progress'
    },
    {
      text: language === 'english' ? 'My Profile' : 'मेरी प्रोफाइल',
      icon: <AccountCircleIcon />,
      path: '/dashboard/profile'
    }
  ];
  
  const handleItemClick = () => {
    // Close sidebar on mobile after navigation
    if (window.innerWidth < 768) {
      closeSidebar();
    }
  };
  
  return (
    <SidebarContainer elevation={0} darkMode={darkMode ? 1 : 0}>
      <SidebarHeader darkMode={darkMode ? 1 : 0}>
        <h2>EduSaarthi</h2>
        <p>{language === 'english' ? 'Your Learning Companion' : 'आपका लर्निंग साथी'}</p>
      </SidebarHeader>
      
      <Divider />
      
      <List>
        {menuItems.map((item) => (
          <StyledListItem
            key={item.path}
            component={Link}
            to={item.path}
            className={isActive(item.path) ? 'active' : ''}
            onClick={handleItemClick}
            darkMode={darkMode ? 1 : 0}
            button
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </StyledListItem>
        ))}
      </List>
    </SidebarContainer>
  );
};

export default Sidebar;

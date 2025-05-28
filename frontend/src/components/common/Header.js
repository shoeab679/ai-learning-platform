import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { AppBar, Toolbar, IconButton, Typography, Button, Avatar, Menu, MenuItem, Switch, FormControlLabel } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import TranslateIcon from '@mui/icons-material/Translate';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const StyledAppBar = styled(AppBar)`
  background-color: ${props => props.darkMode ? 'var(--neutral-800)' : 'var(--primary-white)'};
  color: ${props => props.darkMode ? 'var(--neutral-100)' : 'var(--neutral-900)'};
  box-shadow: var(--shadow-md);
`;

const Logo = styled(Typography)`
  font-family: var(--font-decorative);
  color: var(--primary-blue);
  margin-right: var(--space-4);
  display: flex;
  align-items: center;
  
  span {
    color: var(--primary-green);
  }
`;

const NavButton = styled(Button)`
  margin-left: var(--space-2);
  text-transform: none;
`;

const Header = ({ toggleSidebar }) => {
  const { isAuthenticated, currentUser, logout } = useAuth();
  const { darkMode, toggleDarkMode, language, toggleLanguage } = useTheme();
  const navigate = useNavigate();
  
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/');
  };
  
  return (
    <StyledAppBar position="sticky" darkMode={darkMode ? 1 : 0}>
      <Toolbar>
        {isAuthenticated && (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleSidebar}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
        )}
        
        <Logo variant="h6" component={Link} to={isAuthenticated ? "/dashboard" : "/"}>
          Edu<span>Saarthi</span>
        </Logo>
        
        <div style={{ flexGrow: 1 }} />
        
        <IconButton color="inherit" onClick={toggleDarkMode} aria-label="toggle dark mode">
          {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
        
        <IconButton color="inherit" onClick={toggleLanguage} aria-label="toggle language">
          <TranslateIcon />
          <Typography variant="caption" sx={{ ml: 0.5 }}>
            {language === 'english' ? 'EN' : 'हि'}
          </Typography>
        </IconButton>
        
        {isAuthenticated ? (
          <>
            <IconButton
              onClick={handleMenu}
              color="inherit"
              aria-label="account"
              aria-controls="menu-appbar"
              aria-haspopup="true"
            >
              {currentUser?.profile_image_url ? (
                <Avatar 
                  src={currentUser.profile_image_url} 
                  alt={`${currentUser.first_name} ${currentUser.last_name}`} 
                  sx={{ width: 32, height: 32 }}
                />
              ) : (
                <AccountCircleIcon />
              )}
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={open}
              onClose={handleClose}
            >
              <MenuItem onClick={() => { handleClose(); navigate('/dashboard/profile'); }}>
                {language === 'english' ? 'Profile' : 'प्रोफाइल'}
              </MenuItem>
              <MenuItem onClick={() => { handleClose(); navigate('/dashboard/progress'); }}>
                {language === 'english' ? 'My Progress' : 'मेरी प्रगति'}
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                {language === 'english' ? 'Logout' : 'लॉग आउट'}
              </MenuItem>
            </Menu>
          </>
        ) : (
          <>
            <NavButton 
              color="inherit" 
              component={Link} 
              to="/login"
            >
              {language === 'english' ? 'Login' : 'लॉगिन'}
            </NavButton>
            <NavButton 
              variant="contained" 
              color="primary" 
              component={Link} 
              to="/register"
            >
              {language === 'english' ? 'Start Learning Free' : 'मुफ्त सीखना शुरू करें'}
            </NavButton>
          </>
        )}
      </Toolbar>
    </StyledAppBar>
  );
};

export default Header;

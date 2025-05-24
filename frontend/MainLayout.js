import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Sidebar from '../components/common/Sidebar';
import { useAuth } from '../contexts/AuthContext';
import styled from 'styled-components';

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.main`
  display: flex;
  flex: 1;
`;

const ContentArea = styled.div`
  flex: 1;
  padding: var(--space-4);
  overflow-y: auto;
`;

const SidebarContainer = styled.div`
  width: 250px;
  transition: width var(--transition-normal);
  
  @media (max-width: 768px) {
    width: ${props => props.isOpen ? '250px' : '0'};
    position: fixed;
    top: 60px;
    left: 0;
    bottom: 0;
    z-index: 100;
  }
`;

const MainLayout = () => {
  const { isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <LayoutContainer>
      <Header toggleSidebar={toggleSidebar} />
      
      <MainContent>
        {isAuthenticated && (
          <SidebarContainer isOpen={sidebarOpen}>
            <Sidebar closeSidebar={() => setSidebarOpen(false)} />
          </SidebarContainer>
        )}
        
        <ContentArea>
          <Outlet />
        </ContentArea>
      </MainContent>
      
      <Footer />
    </LayoutContainer>
  );
};

export default MainLayout;

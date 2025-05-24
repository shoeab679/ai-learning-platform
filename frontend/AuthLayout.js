import React from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';

const AuthContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, var(--primary-saffron) 0%, var(--primary-white) 50%, var(--primary-green) 100%);
  padding: var(--space-4);
`;

const AuthCard = styled.div`
  background-color: var(--neutral-100);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  width: 100%;
  max-width: 450px;
  padding: var(--space-8);
  
  .auth-logo {
    text-align: center;
    margin-bottom: var(--space-6);
    
    img {
      height: 60px;
    }
    
    h1 {
      font-family: var(--font-decorative);
      margin-top: var(--space-2);
      color: var(--primary-blue);
    }
  }
`;

const AuthLayout = ({ children }) => {
  return (
    <AuthContainer>
      <AuthCard>
        <div className="auth-logo">
          <h1>EduSaarthi</h1>
          <p>Your Smart Learning Saarthi</p>
        </div>
        {children}
      </AuthCard>
    </AuthContainer>
  );
};

export default AuthLayout;

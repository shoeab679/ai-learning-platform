import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import styled from 'styled-components';

// Styled components
const PageContainer = styled.div`
  padding: var(--space-4);
  max-width: 1200px;
  margin: 0 auto;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  color: var(--text-primary);
  margin-bottom: var(--space-4);
`;

const ProfileGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: var(--space-6);
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ProfileSidebar = styled.div`
  background-color: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ProfileAvatar = styled.div`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background-color: var(--primary-light);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--space-4);
  color: var(--primary);
  font-size: 3rem;
  font-weight: bold;
`;

const ProfileName = styled.h2`
  font-size: 1.5rem;
  color: var(--text-primary);
  margin-bottom: var(--space-2);
  text-align: center;
`;

const ProfileEmail = styled.p`
  color: var(--text-secondary);
  margin-bottom: var(--space-4);
  text-align: center;
`;

const ProfileStats = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
`;

const StatItem = styled.div`
  background-color: var(--bg-secondary);
  border-radius: var(--radius-md);
  padding: var(--space-3);
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--primary);
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: var(--text-secondary);
`;

const ProfileActions = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
`;

const ActionButton = styled.button`
  padding: var(--space-3);
  border-radius: var(--radius-md);
  border: none;
  background-color: ${props => props.primary ? 'var(--primary)' : 'var(--bg-secondary)'};
  color: ${props => props.primary ? 'white' : 'var(--text-primary)'};
  font-weight: ${props => props.primary ? 'bold' : 'normal'};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.primary ? 'var(--primary-dark)' : 'var(--bg-hover)'};
  }
`;

const ProfileContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
`;

const ProfileCard = styled.div`
  background-color: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  box-shadow: var(--shadow-sm);
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-4);
  padding-bottom: var(--space-3);
  border-bottom: 1px solid var(--border-color);
`;

const CardTitle = styled.h3`
  font-size: 1.2rem;
  color: var(--text-primary);
`;

const CardAction = styled.button`
  background: none;
  border: none;
  color: var(--primary);
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
`;

const FormGroup = styled.div`
  margin-bottom: var(--space-4);
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: var(--space-2);
  color: var(--text-primary);
  font-weight: bold;
`;

const FormInput = styled.input`
  width: 100%;
  padding: var(--space-3);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  background-color: var(--bg-input);
  color: var(--text-primary);
  
  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 2px var(--primary-light);
  }
`;

const FormSelect = styled.select`
  width: 100%;
  padding: var(--space-3);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  background-color: var(--bg-input);
  color: var(--text-primary);
  
  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 2px var(--primary-light);
  }
`;

const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
`;

const PreferenceItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-3) 0;
  border-bottom: 1px solid var(--border-color);
  
  &:last-child {
    border-bottom: none;
  }
`;

const PreferenceLabel = styled.div`
  color: var(--text-primary);
`;

const PreferenceControl = styled.div`
  display: flex;
  align-items: center;
`;

const Switch = styled.label`
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
  
  input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  
  span {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--bg-secondary);
    transition: .4s;
    border-radius: 34px;
    
    &:before {
      position: absolute;
      content: "";
      height: 26px;
      width: 26px;
      left: 4px;
      bottom: 4px;
      background-color: white;
      transition: .4s;
      border-radius: 50%;
    }
  }
  
  input:checked + span {
    background-color: var(--primary);
  }
  
  input:checked + span:before {
    transform: translateX(26px);
  }
`;

const BadgeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: var(--space-4);
`;

const Badge = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const BadgeIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: ${props => props.unlocked ? 'var(--primary-light)' : 'var(--bg-secondary)'};
  color: ${props => props.unlocked ? 'var(--primary)' : 'var(--text-secondary)'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-bottom: var(--space-2);
`;

const BadgeName = styled.div`
  font-size: 0.9rem;
  color: ${props => props.unlocked ? 'var(--text-primary)' : 'var(--text-secondary)'};
  margin-bottom: var(--space-1);
`;

const BadgeStatus = styled.div`
  font-size: 0.8rem;
  color: ${props => props.unlocked ? 'var(--success)' : 'var(--text-tertiary)'};
`;

const ProfilePage = () => {
  const { currentUser, updateProfile } = useAuth();
  const { darkMode, toggleDarkMode, language, toggleLanguage, fontSize, changeFontSize } = useTheme();
  
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || 'John Doe',
    email: currentUser?.email || 'john.doe@example.com',
    phone: currentUser?.phone || '+91 9876543210',
    education: currentUser?.education || 'Bachelor of Technology',
    interests: currentUser?.interests || 'Computer Science, Mathematics'
  });
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // updateProfile(formData);
    setEditMode(false);
  };
  
  const handleCancel = () => {
    setFormData({
      name: currentUser?.name || 'John Doe',
      email: currentUser?.email || 'john.doe@example.com',
      phone: currentUser?.phone || '+91 9876543210',
      education: currentUser?.education || 'Bachelor of Technology',
      interests: currentUser?.interests || 'Computer Science, Mathematics'
    });
    setEditMode(false);
  };
  
  // Sample badges data
  const badges = [
    { id: 1, name: 'First Login', icon: '🎉', unlocked: true },
    { id: 2, name: 'Quiz Master', icon: '📝', unlocked: true },
    { id: 3, name: 'AI Tutor Pro', icon: '🤖', unlocked: false },
    { id: 4, name: 'Course Completer', icon: '🎓', unlocked: true },
    { id: 5, name: 'Perfect Score', icon: '🏆', unlocked: false },
    { id: 6, name: '7-Day Streak', icon: '🔥', unlocked: true },
    { id: 7, name: 'Night Owl', icon: '🦉', unlocked: false },
    { id: 8, name: 'Early Bird', icon: '🐦', unlocked: true }
  ];
  
  return (
    <PageContainer>
      <PageTitle>
        {language === 'english' ? 'My Profile' : 'मेरा प्रोफ़ाइल'}
      </PageTitle>
      
      <ProfileGrid>
        <ProfileSidebar>
          <ProfileAvatar>
            {formData.name.split(' ').map(n => n[0]).join('')}
          </ProfileAvatar>
          <ProfileName>{formData.name}</ProfileName>
          <ProfileEmail>{formData.email}</ProfileEmail>
          
          <ProfileStats>
            <StatItem>
              <StatValue>12</StatValue>
              <StatLabel>
                {language === 'english' ? 'Courses' : 'पाठ्यक्रम'}
              </StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>85%</StatValue>
              <StatLabel>
                {language === 'english' ? 'Avg. Score' : 'औसत स्कोर'}
              </StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>24</StatValue>
              <StatLabel>
                {language === 'english' ? 'Quizzes' : 'क्विज़'}
              </StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>7</StatValue>
              <StatLabel>
                {language === 'english' ? 'Day Streak' : 'दिन स्ट्रीक'}
              </StatLabel>
            </StatItem>
          </ProfileStats>
          
          <ProfileActions>
            <ActionButton primary>
              {language === 'english' ? 'Upgrade to Premium' : 'प्रीमियम में अपग्रेड करें'}
            </ActionButton>
            <ActionButton>
              {language === 'english' ? 'Download Progress Report' : 'प्रगति रिपोर्ट डाउनलोड करें'}
            </ActionButton>
          </ProfileActions>
        </ProfileSidebar>
        
        <ProfileContent>
          <ProfileCard>
            <CardHeader>
              <CardTitle>
                {language === 'english' ? 'Personal Information' : 'व्यक्तिगत जानकारी'}
              </CardTitle>
              <CardAction onClick={() => setEditMode(!editMode)}>
                {editMode 
                  ? (language === 'english' ? 'Cancel' : 'रद्द करें')
                  : (language === 'english' ? 'Edit' : 'संपादित करें')
                }
              </CardAction>
            </CardHeader>
            
            {editMode ? (
              <form onSubmit={handleSubmit}>
                <FormGroup>
                  <FormLabel>
                    {language === 'english' ? 'Full Name' : 'पूरा नाम'}
                  </FormLabel>
                  <FormInput 
                    type="text" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleInputChange} 
                  />
                </FormGroup>
                
                <FormGroup>
                  <FormLabel>
                    {language === 'english' ? 'Email' : 'ईमेल'}
                  </FormLabel>
                  <FormInput 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleInputChange} 
                  />
                </FormGroup>
                
                <FormGroup>
                  <FormLabel>
                    {language === 'english' ? 'Phone Number' : 'फ़ोन नंबर'}
                  </FormLabel>
                  <FormInput 
                    type="tel" 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleInputChange} 
                  />
                </FormGroup>
                
                <FormGroup>
                  <FormLabel>
                    {language === 'english' ? 'Education' : 'शिक्षा'}
                  </FormLabel>
                  <FormInput 
                    type="text" 
                    name="education" 
                    value={formData.education} 
                    onChange={handleInputChange} 
                  />
                </FormGroup>
                
                <FormGroup>
                  <FormLabel>
                    {language === 'english' ? 'Interests' : 'रुचियाँ'}
                  </FormLabel>
                  <FormInput 
                    type="text" 
                    name="interests" 
                    value={formData.interests} 
                    onChange={handleInputChange} 
                  />
                </FormGroup>
                
                <FormActions>
                  <ActionButton type="button" onClick={handleCancel}>
                    {language === 'english' ? 'Cancel' : 'रद्द करें'}
                  </ActionButton>
                  <ActionButton type="submit" primary>
                    {language === 'english' ? 'Save Changes' : 'परिवर्तन सहेजें'}
                  </ActionButton>
                </FormActions>
              </form>
            ) : (
              <>
                <FormGroup>
                  <FormLabel>
                    {language === 'english' ? 'Full Name' : 'पूरा नाम'}
                  </FormLabel>
                  <div>{formData.name}</div>
                </FormGroup>
                
                <FormGroup>
                  <FormLabel>
                    {language === 'english' ? 'Email' : 'ईमेल'}
                  </FormLabel>
                  <div>{formData.email}</div>
                </FormGroup>
                
                <FormGroup>
                  <FormLabel>
                    {language === 'english' ? 'Phone Number' : 'फ़ोन नंबर'}
                  </FormLabel>
                  <div>{formData.phone}</div>
                </FormGroup>
                
                <FormGroup>
                  <FormLabel>
                    {language === 'english' ? 'Education' : 'शिक्षा'}
                  </FormLabel>
                  <div>{formData.education}</div>
                </FormGroup>
                
                <FormGroup>
                  <FormLabel>
                    {language === 'english' ? 'Interests' : 'रुचियाँ'}
                  </FormLabel>
                  <div>{formData.interests}</div>
                </FormGroup>
              </>
            )}
          </ProfileCard>
          
          <ProfileCard>
            <CardHeader>
              <CardTitle>
                {language === 'english' ? 'Preferences' : 'प्राथमिकताएँ'}
              </CardTitle>
            </CardHeader>
            
            <PreferenceItem>
              <PreferenceLabel>
                {language === 'english' ? 'Dark Mode' : 'डार्क मोड'}
              </PreferenceLabel>
              <PreferenceControl>
                <Switch>
                  <input 
                    type="checkbox" 
                    checked={darkMode} 
                    onChange={toggleDarkMode} 
                  />
                  <span></span>
                </Switch>
              </PreferenceControl>
            </PreferenceItem>
            
            <PreferenceItem>
              <PreferenceLabel>
                {language === 'english' ? 'Language' : 'भाषा'}
              </PreferenceLabel>
              <PreferenceControl>
                <FormSelect 
                  value={language} 
                  onChange={(e) => toggleLanguage()}
                >
                  <option value="english">English</option>
                  <option value="hindi">हिंदी</option>
                </FormSelect>
              </PreferenceControl>
            </PreferenceItem>
            
            <PreferenceItem>
              <PreferenceLabel>
                {language === 'english' ? 'Font Size' : 'फ़ॉन्ट आकार'}
              </PreferenceLabel>
              <PreferenceControl>
                <FormSelect 
                  value={fontSize} 
                  onChange={(e) => changeFontSize(e.target.value)}
                >
                  <option value="small">
                    {language === 'english' ? 'Small' : 'छोटा'}
                  </option>
                  <option value="medium">
                    {language === 'english' ? 'Medium' : 'मध्यम'}
                  </option>
                  <option value="large">
                    {language === 'english' ? 'Large' : 'बड़ा'}
                  </option>
                  <option value="x-large">
                    {language === 'english' ? 'Extra Large' : 'अतिरिक्त बड़ा'}
                  </option>
                </FormSelect>
              </PreferenceControl>
            </PreferenceItem>
            
            <PreferenceItem>
              <PreferenceLabel>
                {language === 'english' ? 'Email Notifications' : 'ईमेल सूचनाएँ'}
              </PreferenceLabel>
              <PreferenceControl>
                <Switch>
                  <input type="checkbox" defaultChecked />
                  <span></span>
                </Switch>
              </PreferenceControl>
            </PreferenceItem>
          </ProfileCard>
          
          <ProfileCard>
            <CardHeader>
              <CardTitle>
                {language === 'english' ? 'Achievements & Badges' : 'उपलब्धियां और बैज'}
              </CardTitle>
            </CardHeader>
            
            <BadgeGrid>
              {badges.map(badge => (
                <Badge key={badge.id}>
                  <BadgeIcon unlocked={badge.unlocked}>
                    {badge.icon}
                  </BadgeIcon>
                  <BadgeName unlocked={badge.unlocked}>
                    {badge.name}
                  </BadgeName>
                  <BadgeStatus unlocked={badge.unlocked}>
                    {badge.unlocked 
                      ? (language === 'english' ? 'Unlocked' : 'अनलॉक किया गया')
                      : (language === 'english' ? 'Locked' : 'लॉक किया गया')
                    }
                  </BadgeStatus>
                </Badge>
              ))}
            </BadgeGrid>
          </ProfileCard>
        </ProfileContent>
      </ProfileGrid>
    </PageContainer>
  );
};

export default ProfilePage;

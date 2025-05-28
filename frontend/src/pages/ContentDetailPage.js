import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import styled from 'styled-components';

// Styled components
const PageContainer = styled.div`
  padding: var(--space-4);
  max-width: 1200px;
  margin: 0 auto;
`;

const ContentHeader = styled.div`
  margin-bottom: var(--space-6);
`;

const BreadcrumbNav = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: var(--space-4);
  color: var(--text-secondary);
  font-size: 0.9rem;
`;

const BreadcrumbItem = styled.span`
  cursor: pointer;
  
  &:hover {
    color: var(--primary);
    text-decoration: underline;
  }
`;

const BreadcrumbSeparator = styled.span`
  margin: 0 var(--space-2);
`;

const ContentTitle = styled.h1`
  font-size: 2.5rem;
  color: var(--text-primary);
  margin-bottom: var(--space-2);
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const ContentMeta = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-4);
  color: var(--text-secondary);
  margin-bottom: var(--space-4);
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-2);
`;

const ContentTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
`;

const Tag = styled.span`
  background-color: var(--primary-light);
  color: var(--primary);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-full);
  font-size: 0.9rem;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  gap: var(--space-6);
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const MainContent = styled.div`
  background-color: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  box-shadow: var(--shadow-sm);
`;

const ContentSection = styled.div`
  margin-bottom: var(--space-6);
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  color: var(--text-primary);
  margin-bottom: var(--space-4);
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const SectionContent = styled.div`
  color: var(--text-primary);
  line-height: 1.8;
  
  p {
    margin-bottom: var(--space-4);
  }
  
  ul, ol {
    margin-bottom: var(--space-4);
    padding-left: var(--space-6);
  }
  
  li {
    margin-bottom: var(--space-2);
  }
  
  img {
    max-width: 100%;
    border-radius: var(--radius-md);
    margin: var(--space-4) 0;
  }
  
  blockquote {
    border-left: 4px solid var(--primary);
    padding-left: var(--space-4);
    margin: var(--space-4) 0;
    font-style: italic;
    color: var(--text-secondary);
  }
  
  code {
    background-color: var(--bg-secondary);
    padding: var(--space-1) var(--space-2);
    border-radius: var(--radius-sm);
    font-family: monospace;
  }
  
  pre {
    background-color: var(--bg-secondary);
    padding: var(--space-4);
    border-radius: var(--radius-md);
    overflow-x: auto;
    margin: var(--space-4) 0;
    
    code {
      background-color: transparent;
      padding: 0;
    }
  }
`;

const VideoContainer = styled.div`
  position: relative;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  height: 0;
  overflow: hidden;
  margin-bottom: var(--space-4);
  border-radius: var(--radius-md);
  
  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: none;
  }
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
`;

const SidebarCard = styled.div`
  background-color: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  box-shadow: var(--shadow-sm);
`;

const CardTitle = styled.h3`
  font-size: 1.2rem;
  color: var(--text-primary);
  margin-bottom: var(--space-3);
  padding-bottom: var(--space-2);
  border-bottom: 1px solid var(--border-color);
`;

const ProgressBar = styled.div`
  height: 8px;
  background-color: var(--bg-secondary);
  border-radius: var(--radius-full);
  margin-bottom: var(--space-2);
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background-color: var(--primary);
  width: ${props => props.progress}%;
  transition: width 0.3s ease;
`;

const ProgressText = styled.div`
  display: flex;
  justify-content: space-between;
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-bottom: var(--space-4);
`;

const Button = styled.button`
  width: 100%;
  padding: var(--space-3);
  border-radius: var(--radius-md);
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &.primary {
    background-color: var(--primary);
    color: white;
    border: none;
    
    &:hover {
      background-color: var(--primary-dark);
    }
  }
  
  &.secondary {
    background-color: transparent;
    color: var(--primary);
    border: 2px solid var(--primary);
    
    &:hover {
      background-color: var(--primary-light);
    }
  }
`;

const ResourcesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ResourceItem = styled.li`
  padding: var(--space-2) 0;
  border-bottom: 1px solid var(--border-color);
  
  &:last-child {
    border-bottom: none;
  }
  
  a {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    color: var(--text-primary);
    text-decoration: none;
    
    &:hover {
      color: var(--primary);
    }
  }
`;

const ResourceIcon = styled.span`
  font-size: 1.2rem;
`;

const RelatedContentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
`;

const RelatedContentItem = styled.div`
  display: flex;
  gap: var(--space-3);
  padding-bottom: var(--space-3);
  border-bottom: 1px solid var(--border-color);
  
  &:last-child {
    border-bottom: none;
  }
`;

const RelatedContentImage = styled.div`
  width: 80px;
  height: 60px;
  border-radius: var(--radius-md);
  background-color: var(--bg-secondary);
  flex-shrink: 0;
`;

const RelatedContentInfo = styled.div`
  flex: 1;
`;

const RelatedContentTitle = styled.div`
  font-weight: bold;
  color: var(--text-primary);
  margin-bottom: var(--space-1);
  
  &:hover {
    color: var(--primary);
    cursor: pointer;
  }
`;

const RelatedContentMeta = styled.div`
  font-size: 0.8rem;
  color: var(--text-secondary);
`;

const ContentDetailPage = () => {
  const { contentId } = useParams();
  const { language } = useTheme();
  const navigate = useNavigate();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Sample content data
  const sampleContent = {
    id: '123',
    title: 'Introduction to Algebra: Understanding Variables and Equations',
    subject: 'Mathematics',
    level: 'Intermediate',
    duration: '45 minutes',
    author: 'Dr. Priya Sharma',
    publishedDate: '2023-05-15',
    lastUpdated: '2023-06-10',
    tags: ['Algebra', 'Mathematics', 'Equations', 'Variables'],
    progress: 35,
    sections: [
      {
        id: 's1',
        title: 'What is Algebra?',
        content: `
          <p>Algebra is a branch of mathematics that uses symbols and letters to represent numbers and quantities in formulas and equations. It's a way of expressing mathematical relationships and solving problems.</p>
          
          <p>The word "algebra" comes from the Arabic word "al-jabr," which means "reunion of broken parts." This refers to the process of moving terms from one side of an equation to the other.</p>
          
          <blockquote>Algebra is not just about manipulating symbols; it's about understanding patterns and relationships in mathematics.</blockquote>
          
          <p>In this lesson, we'll explore the fundamental concepts of algebra, focusing on variables and equations.</p>
        `
      },
      {
        id: 's2',
        title: 'Understanding Variables',
        content: `
          <p>A variable is a symbol (usually a letter) that represents an unknown value or a value that can change. In algebra, we commonly use letters like x, y, and z as variables.</p>
          
          <p>For example, in the expression 2x + 3, the letter x is a variable. The value of this expression changes depending on what value x takes:</p>
          
          <ul>
            <li>If x = 1, then 2x + 3 = 2(1) + 3 = 5</li>
            <li>If x = 2, then 2x + 3 = 2(2) + 3 = 7</li>
            <li>If x = 5, then 2x + 3 = 2(5) + 3 = 13</li>
          </ul>
          
          <p>Variables allow us to write general formulas and equations that work for many different values.</p>
        `
      },
      {
        id: 's3',
        title: 'Introduction to Equations',
        content: `
          <p>An equation is a mathematical statement that asserts the equality of two expressions. It consists of two expressions separated by an equals sign (=).</p>
          
          <p>For example, 2x + 3 = 7 is an equation. It states that the expression 2x + 3 is equal to 7.</p>
          
          <p>Solving an equation means finding the value(s) of the variable that make the equation true. For the equation 2x + 3 = 7:</p>
          
          <pre><code>2x + 3 = 7
2x = 7 - 3
2x = 4
x = 4/2
x = 2</code></pre>
          
          <p>We can verify this solution by substituting x = 2 back into the original equation:</p>
          
          <p>2(2) + 3 = 7</p>
          <p>4 + 3 = 7</p>
          <p>7 = 7 ✓</p>
          
          <p>The solution checks out, so x = 2 is the solution to the equation 2x + 3 = 7.</p>
        `
      },
      {
        id: 's4',
        title: 'Video Explanation',
        content: `
          <p>Watch this video for a visual explanation of algebraic concepts:</p>
          
          <div class="video-container">
            <iframe src="https://www.youtube.com/embed/NybHckSEQBI" title="Introduction to Algebra" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          </div>
          
          <p>This video covers the basics of variables and equations, providing examples and step-by-step solutions.</p>
        `
      }
    ],
    resources: [
      { id: 'r1', type: 'pdf', title: 'Algebra Cheat Sheet', url: '#' },
      { id: 'r2', type: 'worksheet', title: 'Practice Problems', url: '#' },
      { id: 'r3', type: 'link', title: 'Interactive Algebra Tool', url: '#' }
    ],
    relatedContent: [
      { id: 'rc1', title: 'Solving Linear Equations', subject: 'Mathematics', level: 'Intermediate' },
      { id: 'rc2', title: 'Introduction to Quadratic Equations', subject: 'Mathematics', level: 'Intermediate' },
      { id: 'rc3', title: 'Algebraic Expressions and Identities', subject: 'Mathematics', level: 'Intermediate' }
    ]
  };
  
  // Fetch content data
  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        // In a real app, you would fetch from an API
        // const response = await axios.get(`/api/content/${contentId}`);
        // setContent(response.data);
        
        // Using sample data for now
        setTimeout(() => {
          setContent(sampleContent);
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error('Error fetching content:', err);
        setError('Failed to load content');
        setLoading(false);
      }
    };
    
    fetchContent();
  }, [contentId]);
  
  if (loading) {
    return (
      <PageContainer>
        <div>Loading content...</div>
      </PageContainer>
    );
  }
  
  if (error) {
    return (
      <PageContainer>
        <div>{error}</div>
      </PageContainer>
    );
  }
  
  return (
    <PageContainer>
      <ContentHeader>
        <BreadcrumbNav>
          <BreadcrumbItem onClick={() => navigate('/dashboard')}>
            {language === 'english' ? 'Dashboard' : 'डैशबोर्ड'}
          </BreadcrumbItem>
          <BreadcrumbSeparator>/</BreadcrumbSeparator>
          <BreadcrumbItem onClick={() => navigate('/dashboard/courses')}>
            {language === 'english' ? 'Courses' : 'पाठ्यक्रम'}
          </BreadcrumbItem>
          <BreadcrumbSeparator>/</BreadcrumbSeparator>
          <BreadcrumbItem onClick={() => navigate('/dashboard/courses')}>
            {content.subject}
          </BreadcrumbItem>
          <BreadcrumbSeparator>/</BreadcrumbSeparator>
          <span>{content.title}</span>
        </BreadcrumbNav>
        
        <ContentTitle>{content.title}</ContentTitle>
        
        <ContentMeta>
          <MetaItem>
            <span>📚</span>
            <span>{content.subject}</span>
          </MetaItem>
          <MetaItem>
            <span>🎯</span>
            <span>{content.level}</span>
          </MetaItem>
          <MetaItem>
            <span>⏱️</span>
            <span>{content.duration}</span>
          </MetaItem>
          <MetaItem>
            <span>👤</span>
            <span>{content.author}</span>
          </MetaItem>
          <MetaItem>
            <span>🔄</span>
            <span>
              {language === 'english' 
                ? `Last updated: ${content.lastUpdated}` 
                : `अंतिम अपडेट: ${content.lastUpdated}`
              }
            </span>
          </MetaItem>
        </ContentMeta>
        
        <ContentTags>
          {content.tags.map((tag, index) => (
            <Tag key={index}>{tag}</Tag>
          ))}
        </ContentTags>
      </ContentHeader>
      
      <ContentGrid>
        <MainContent>
          {content.sections.map((section) => (
            <ContentSection key={section.id}>
              <SectionTitle>{section.title}</SectionTitle>
              <SectionContent 
                dangerouslySetInnerHTML={{ __html: section.content }} 
              />
            </ContentSection>
          ))}
        </MainContent>
        
        <Sidebar>
          <SidebarCard>
            <CardTitle>
              {language === 'english' ? 'Your Progress' : 'आपकी प्रगति'}
            </CardTitle>
            <ProgressBar>
              <ProgressFill progress={content.progress} />
            </ProgressBar>
            <ProgressText>
              <span>{content.progress}% {language === 'english' ? 'complete' : 'पूर्ण'}</span>
              <span>{language === 'english' ? 'Continue' : 'जारी रखें'}</span>
            </ProgressText>
            <Button className="primary">
              {language === 'english' ? 'Continue Learning' : 'सीखना जारी रखें'}
            </Button>
          </SidebarCard>
          
          <SidebarCard>
            <CardTitle>
              {language === 'english' ? 'Resources' : 'संसाधन'}
            </CardTitle>
            <ResourcesList>
              {content.resources.map((resource) => (
                <ResourceItem key={resource.id}>
                  <a href={resource.url} target="_blank" rel="noopener noreferrer">
                    <ResourceIcon>
                      {resource.type === 'pdf' && '📄'}
                      {resource.type === 'worksheet' && '📝'}
                      {resource.type === 'link' && '🔗'}
                    </ResourceIcon>
                    <span>{resource.title}</span>
                  </a>
                </ResourceItem>
              ))}
            </ResourcesList>
          </SidebarCard>
          
          <SidebarCard>
            <CardTitle>
              {language === 'english' ? 'Related Content' : 'संबंधित सामग्री'}
            </CardTitle>
            <RelatedContentList>
              {content.relatedContent.map((item) => (
                <RelatedContentItem key={item.id}>
                  <RelatedContentImage />
                  <RelatedContentInfo>
                    <RelatedContentTitle onClick={() => navigate(`/dashboard/content/${item.id}`)}>
                      {item.title}
                    </RelatedContentTitle>
                    <RelatedContentMeta>
                      {item.subject} • {item.level}
                    </RelatedContentMeta>
                  </RelatedContentInfo>
                </RelatedContentItem>
              ))}
            </RelatedContentList>
          </SidebarCard>
          
          <SidebarCard>
            <CardTitle>
              {language === 'english' ? 'Need Help?' : 'मदद चाहिए?'}
            </CardTitle>
            <p style={{ marginBottom: 'var(--space-4)', color: 'var(--text-secondary)' }}>
              {language === 'english' 
                ? 'Having trouble understanding this topic?' 
                : 'इस विषय को समझने में परेशानी हो रही है?'
              }
            </p>
            <Button 
              className="secondary"
              onClick={() => navigate('/dashboard/ai-tutor')}
            >
              {language === 'english' ? 'Ask AI Tutor' : 'AI ट्यूटर से पूछें'}
            </Button>
          </SidebarCard>
        </Sidebar>
      </ContentGrid>
    </PageContainer>
  );
};

export default ContentDetailPage;

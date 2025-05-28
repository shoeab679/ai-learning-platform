import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create context
const PremiumContext = createContext();

// Provider component
export const PremiumProvider = ({ children }) => {
  const [isPremium, setIsPremium] = useState(false);
  const [premiumPlan, setPremiumPlan] = useState(null);
  const [premiumExpiresAt, setPremiumExpiresAt] = useState(null);
  const [usageLimits, setUsageLimits] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch premium status on component mount
  useEffect(() => {
    const fetchPremiumStatus = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          setLoading(false);
          return;
        }
        
        const config = {
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
          }
        };
        
        const res = await axios.get(`${API_URL}/premium/status`, config);
        
        setIsPremium(res.data.is_premium);
        setPremiumPlan(res.data.premium_plan);
        setPremiumExpiresAt(res.data.premium_expires_at);
        
        // If not premium, fetch usage limits
        if (!res.data.is_premium) {
          const limitsRes = await axios.get(`${API_URL}/premium/usage-limits`, config);
          setUsageLimits(limitsRes.data.usage_limits);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching premium status:', err);
        setError('Failed to fetch premium status');
      } finally {
        setLoading(false);
      }
    };

    fetchPremiumStatus();
  }, []);

  // Upgrade to premium
  const upgradeToPremium = async (plan) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Authentication required');
        setLoading(false);
        return false;
      }
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        }
      };
      
      const body = JSON.stringify({ plan });
      
      const res = await axios.post(`${API_URL}/premium/upgrade`, body, config);
      
      setIsPremium(res.data.is_premium);
      setPremiumPlan(res.data.premium_plan);
      setPremiumExpiresAt(res.data.premium_expires_at);
      setError(null);
      
      return true;
    } catch (err) {
      console.error('Error upgrading to premium:', err);
      setError('Failed to upgrade to premium');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Cancel premium subscription
  const cancelPremium = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Authentication required');
        setLoading(false);
        return false;
      }
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        }
      };
      
      await axios.post(`${API_URL}/premium/cancel`, {}, config);
      
      setError(null);
      return true;
    } catch (err) {
      console.error('Error canceling premium:', err);
      setError('Failed to cancel premium subscription');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Check if a specific feature is available based on premium status and usage limits
  const checkFeatureAccess = (featureType) => {
    // If premium, all features are available
    if (isPremium) {
      return { 
        hasAccess: true, 
        message: null,
        remainingCount: null
      };
    }
    
    // Check usage limits for free users
    if (usageLimits && usageLimits[featureType]) {
      const { remaining } = usageLimits[featureType];
      
      if (remaining > 0) {
        return { 
          hasAccess: true, 
          message: `${remaining} uses remaining today`,
          remainingCount: remaining
        };
      } else {
        return { 
          hasAccess: false, 
          message: 'Daily limit reached. Upgrade to premium for unlimited access.',
          remainingCount: 0
        };
      }
    }
    
    // If feature is premium-only
    if (['competitive_exam', 'mock_test', 'advanced_analytics', 'offline_mode', 'pdf_download'].includes(featureType)) {
      return { 
        hasAccess: false, 
        message: 'Premium feature. Upgrade to access.',
        remainingCount: null
      };
    }
    
    // Default to allowing access if not specified
    return { 
      hasAccess: true, 
      message: null,
      remainingCount: null
    };
  };

  // Refresh usage limits
  const refreshUsageLimits = async () => {
    if (isPremium) return; // No need to refresh for premium users
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) return;
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        }
      };
      
      const limitsRes = await axios.get(`${API_URL}/premium/usage-limits`, config);
      setUsageLimits(limitsRes.data.usage_limits);
    } catch (err) {
      console.error('Error refreshing usage limits:', err);
    }
  };

  return (
    <PremiumContext.Provider
      value={{
        isPremium,
        premiumPlan,
        premiumExpiresAt,
        usageLimits,
        loading,
        error,
        upgradeToPremium,
        cancelPremium,
        checkFeatureAccess,
        refreshUsageLimits
      }}
    >
      {children}
    </PremiumContext.Provider>
  );
};

// Custom hook to use the premium context
export const usePremium = () => {
  const context = useContext(PremiumContext);
  if (context === undefined) {
    throw new Error('usePremium must be used within a PremiumProvider');
  }
  return context;
};

export default PremiumContext;

import React, { createContext, useState, useContext } from 'react';

const PremiumContext = createContext();

export const usePremium = () => useContext(PremiumContext);

export const PremiumProvider = ({ children }) => {
  const [isPremium, setIsPremium] = useState(false);

  const upgradeToPremium = () => {
    setIsPremium(true);
  };

  return (
    <PremiumContext.Provider value={{ isPremium, upgradeToPremium }}>
      {children}
    </PremiumContext.Provider>
  );
};

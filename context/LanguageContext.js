import React, { createContext, useContext, useState } from 'react';

// Criando o contexto
const LanguageContext = createContext();

// Criando o provider
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en'); // ou qualquer valor inicial

  // Função para alterar o idioma
  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook personalizado para acessar o contexto
export const useLanguage = () => useContext(LanguageContext);

import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Chave para armazenar a língua no AsyncStorage
const LANGUAGE_STORAGE_KEY = '@EggTimer:language';

// Criando o contexto
const LanguageContext = createContext();

// Criando o provider
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en'); // valor inicial padrão
  const [isLoading, setIsLoading] = useState(true); // estado de carregamento

  // Carrega a língua salva quando o app inicia
  useEffect(() => {
    const loadSavedLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
        if (savedLanguage !== null) {
          setLanguage(savedLanguage);
        }
      } catch (error) {
        console.log('Erro ao carregar língua salva:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedLanguage();
  }, []);

  // Função para alterar o idioma e salvar no AsyncStorage
  const changeLanguage = async (newLanguage) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, newLanguage);
      setLanguage(newLanguage);
    } catch (error) {
      console.log('Erro ao salvar língua:', error);
      // Ainda muda a língua mesmo se falhar ao salvar
      setLanguage(newLanguage);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, isLoading }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook personalizado para acessar o contexto
export const useLanguage = () => useContext(LanguageContext);

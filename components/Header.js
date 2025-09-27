import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useLanguage } from '../context/LanguageContext';
import { useSound } from '../hooks/useSound';

export default function Header() {
  const { language, changeLanguage } = useLanguage();
  const { playClickSound } = useSound();

  // Caminho das imagens na pasta assets
  const images = {
    pt: require('../assets/brazil.png'),
    en: require('../assets/united-states.png'),
    it: require('../assets/italy.png')
  };

  // Função para lidar com a mudança de idioma
  const handleLanguageChange = (newLanguage) => {
    playClickSound(); // Toca o som
    changeLanguage(newLanguage); // Muda o idioma
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        onPress={() => handleLanguageChange('pt')}
        activeOpacity={0.7}
        style={[styles.flagButton, language === 'pt' && styles.activeFlag]}
      >
        <Image
          source={images.pt}
          style={styles.flagImage}
        />
      </TouchableOpacity>
      
      <TouchableOpacity 
        onPress={() => handleLanguageChange('en')}
        activeOpacity={0.7}
        style={[styles.flagButton, language === 'en' && styles.activeFlag]}
      >
        <Image
          source={images.en}
          style={styles.flagImage}
        />
      </TouchableOpacity>
      
      <TouchableOpacity 
        onPress={() => handleLanguageChange('it')}
        activeOpacity={0.7}
        style={[styles.flagButton, language === 'it' && styles.activeFlag]}
      >
        <Image
          source={images.it}
          style={styles.flagImage}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50, // Ajustado para SafeArea
    right: 20,
    flexDirection: 'row',
    zIndex: 1000,
  },
  flagButton: {
    margin: 3,
    borderRadius: 20,
    padding: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  activeFlag: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 2,
    borderColor: '#ffd900',
  },
  flagImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
});
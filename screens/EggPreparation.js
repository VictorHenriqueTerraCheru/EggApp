import React, { useState, useEffect } from 'react';
import { Text, View, Image, StyleSheet, ScrollView, ImageBackground, TouchableOpacity } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useLanguage } from '../context/LanguageContext';
import { useSound } from '../hooks/useSound';
import * as Font from 'expo-font';

export default function EggPreparation() {
    const navigation = useNavigation();
    const { language } = useLanguage();
    const { playClickSound } = useSound();
    const [fontLoaded, setFontLoaded] = useState(false);

    // Função para navegar para a tela Timer passando o tempo como parâmetro
    const handleImagePress = (time) => {
        playClickSound(); // Toca o som
        navigation.navigate('Timer', { time });
    };

    useEffect(() => {
        const loadFonts = async () => {
            await Font.loadAsync({
                'PressStart2P': require('../assets/fonts/PressStart2P-Regular.ttf'),
            });
            setFontLoaded(true);
        };

        loadFonts();
    }, []);

    // Função para obter o texto do cabeçalho
    const getHeadingText = () => {
        if (language === 'pt') {
            return 'O que você\n vai fazer hoje?';
        } else if (language === 'en') {
            return "What are you\n making today?";
        } else {
            return 'Cosa stai\n preparando oggi?';
        }
    };

    // Exibe uma mensagem de carregamento enquanto as fontes estão sendo carregadas
    if (!fontLoaded) {
        return (
            <SafeAreaProvider>
                <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
                    <View style={styles.loadingContainer}>
                        <Text style={styles.loadingText}>
                            {language === 'pt' ? 'Carregando fontes...' : 
                             language === 'en' ? 'Loading fonts...' : 
                             'Caricamento font...'}
                        </Text>
                    </View>
                </SafeAreaView>
            </SafeAreaProvider>
        );
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
                <ImageBackground
                    source={require('../assets/cloudsPink.png')}
                    style={styles.background}
                    resizeMode="cover"
                >
                    <View style={styles.container}>
                        <Text style={styles.heading}>
                            {getHeadingText()}
                        </Text>

                        <ScrollView 
                            contentContainerStyle={styles.imagesContainer}
                            showsVerticalScrollIndicator={false}
                            bounces={false}
                        >
                            <View style={styles.imageRow}>
                                <TouchableOpacity 
                                    onPress={() => handleImagePress(6)}
                                    activeOpacity={0.8}
                                >
                                    <Image
                                        source={require('../assets/Egg1.png')}
                                        style={[styles.image, styles.image1]}
                                        resizeMode="stretch"
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    onPress={() => handleImagePress(8)}
                                    activeOpacity={0.8}
                                >
                                    <Image
                                        source={require('../assets/Egg2.png')}
                                        style={[styles.image, styles.image2]}
                                        resizeMode="stretch"
                                    />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.imageRow}>
                                <TouchableOpacity 
                                    onPress={() => handleImagePress(10)}
                                    activeOpacity={0.8}
                                >
                                    <Image
                                        source={require('../assets/Egg3.png')}
                                        style={[styles.image, styles.image3]}
                                        resizeMode="stretch"
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    onPress={() => handleImagePress(12)}
                                    activeOpacity={0.8}
                                >
                                    <Image
                                        source={require('../assets/Egg4.png')}
                                        style={[styles.image, styles.image4]}
                                        resizeMode="stretch"
                                    />
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </ImageBackground>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#E6B3FF', // Cor de fundo que combina com sua paleta
    },
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        paddingTop: 30,
        paddingBottom: 30,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 16,
        color: '#cd853f',
    },
    heading: {
        fontSize: 26, // Reduzido para caber melhor
        fontWeight: 'bold',
        color: '#cd853f',
        marginBottom: 30,
        textAlign: 'center',
        fontFamily: 'PressStart2P',
        paddingHorizontal: 10,
    },
    imagesContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
    },
    imageRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 5,
    },
    image: {
        width: 150, // Reduzido para caber melhor na tela
        height: 180, // Reduzido para caber melhor na tela
        margin: 8,
    },
    image1: { 
        height: 210, // Ajustado proporcionalmente
    },
    image4: { 
        height: 210, // Ajustado proporcionalmente
    },
    image2: {},
    image3: {},
});
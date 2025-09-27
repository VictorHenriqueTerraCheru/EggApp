import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ImageBackground, Image, TouchableOpacity } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useLanguage } from '../context/LanguageContext';
import { useSound } from '../hooks/useSound';

export default function TimerFinish({ route, navigation }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(true);
    const animationTimerRef = useRef(null);
    const { language } = useLanguage();
    const { playClickSound, playAlarmSound, stopAlarmSound } = useSound();

    const images = [
        require('../assets/egg_1.png'),
        require('../assets/egg_2.png'),
        require('../assets/egg_3.png'),
        require('../assets/egg_4.png'),
        require('../assets/egg_5.png'),
        require('../assets/egg_6.png'),
        require('../assets/egg_7.png'),
        require('../assets/egg_8.png'),
        require('../assets/egg_9.png')
    ];

    // useFocusEffect para iniciar alarme quando a tela ganha foco
    useFocusEffect(
        React.useCallback(() => {
            // Executa quando a tela ganha foco (equivalente a page_load)
            console.log('TimerFinish screen focused - starting alarm sound');
            
            // Pequeno delay para garantir que tudo carregou
            const timer = setTimeout(() => {
                playAlarmSound();
            }, 500); // 500ms de delay
            
            // Cleanup quando a tela perde foco
            return () => {
                console.log('TimerFinish screen unfocused - stopping alarm sound');
                clearTimeout(timer);
                stopAlarmSound();
            };
        }, []) // Array vazio - só executa quando foca/desfoca a tela
    );

    // Função para trocar de imagem seguindo a lógica do C#
    const changeImage = () => {
        setCurrentImageIndex(prevIndex => {
            let newIndex = prevIndex + 1;
            if (newIndex > images.length - 1) {
                newIndex = 0; // Reinicia após a última imagem
            }
            return newIndex;
        });
    };

    // Effect para controlar a animação (400ms igual ao C#)
    useEffect(() => {
        if (isAnimating) {
            animationTimerRef.current = setInterval(() => {
                changeImage();
            }, 400);
        } else {
            // Para a animação quando isAnimating for false
            if (animationTimerRef.current) {
                clearInterval(animationTimerRef.current);
                animationTimerRef.current = null;
            }
        }

        // Cleanup do timer quando o componente desmontar ou isAnimating mudar
        return () => {
            if (animationTimerRef.current) {
                clearInterval(animationTimerRef.current);
                animationTimerRef.current = null;
            }
        };
    }, [isAnimating]);

    // Função para parar a animação e ir para a tela anterior
    const closeTimerFinish = () => {
        playClickSound(); // Toca som ao fechar
        stopAlarmSound(); // Para o alarme quando fechar
        setIsAnimating(false); // Para a animação antes de navegar
        navigation.navigate('Home'); // Volta para a tela inicial
    };

    // Função para ajustar o tamanho da imagem baseado no índice (como no C#)
    const getImageStyle = () => {
        if (currentImageIndex === 5) { // egg_6.png
            return [styles.image, { height: 220 }]; // Altura maior para egg_6
        }
        return [styles.image, { height: 210 }]; // Altura padrão
    };

    // Função para obter o texto do cabeçalho
    const getHeadingText = () => {
        if (language === 'pt') {
            return 'Seu ovo\nestá pronto!';
        } else if (language === 'en') {
            return 'Your egg\nis done!';
        } else {
            return 'Il tuo uovo\nè pronto!';
        }
    };

    // Função para obter o texto do botão
    const getButtonText = () => {
        if (language === 'pt') {
            return 'Fechar!';
        } else if (language === 'en') {
            return 'Close!';
        } else {
            return 'Chiudere!';
        }
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
                <ImageBackground
                    source={require('../assets/cloudsPink.png')}
                    style={styles.background}
                    resizeMode="cover"
                >
                    <View style={styles.container}>
                        <Text style={[styles.heading, { fontFamily: 'PressStart2P' }]}>
                            {getHeadingText()}
                        </Text>

                        {/* Exibe a animação de imagens em loop sequencial */}
                        <View style={styles.imageContainer}>
                            <Image
                                source={images[currentImageIndex]}
                                style={getImageStyle()} // Aplica tamanho dinâmico
                                resizeMode="stretch" // Igual ao StretchImage do C#
                            />
                        </View>

                        <TouchableOpacity
                            onPress={closeTimerFinish}
                            style={styles.closeButton}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.buttonText}>
                                {getButtonText()}
                            </Text>
                        </TouchableOpacity>
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
        paddingTop: 40,
        paddingBottom: 40,
    },
    heading: {
        fontSize: 32, // Reduzido para caber melhor
        fontWeight: 'bold',
        marginBottom: 40,
        textAlign: 'center',
        color: '#cd853f',
        paddingHorizontal: 10,
    },
    imageContainer: {
        width: 160,
        height: 220, // Altura máxima para acomodar a egg_6
        marginBottom: 40,
        justifyContent: 'flex-start', // Alinha no topo - faz crescer para baixo
        alignItems: 'center',
    },
    image: {
        width: 160,
        // height será definido dinamicamente na função getImageStyle()
    },
    closeButton: {
        marginTop: 20,
        backgroundColor: '#ffffeb',
        width: 220, // Reduzido para caber melhor
        height: 70, // Reduzido para caber melhor
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        borderWidth: 4,
        borderColor: '#eed6fa',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    buttonText: {
        fontSize: 20, // Reduzido para caber melhor
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#ffd900',
        fontFamily: 'PressStart2P',
    },
});
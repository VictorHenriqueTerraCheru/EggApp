import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, Image, TouchableOpacity } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useLanguage } from '../context/LanguageContext';
import { useSound } from '../hooks/useSound';

export default function Timer({ route, navigation }) {
    const { time = 6 } = route.params || {};
    const [remainingTime, setRemainingTime] = useState(time * 60);
    const [isRunning, setIsRunning] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [animacaoCrescente, setAnimacaoCrescente] = useState(true);
    const { language } = useLanguage();
    const { playClickSound, playClockSound, stopClockSound, soundsLoaded } = useSound();

    const images = [
        require('../assets/open_egg1.png'),
        require('../assets/open_egg2.png'),
        require('../assets/open_egg3.png'),
        require('../assets/open_egg4.png'),
    ];

    // Função para formatar o tempo em MM:SS
    const formatTime = (timeInSeconds) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;
        return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    // Função para trocar de imagem seguindo a lógica do C#
    const changeImage = () => {
        setCurrentImageIndex(prevIndex => {
            let newIndex = prevIndex;

            if (animacaoCrescente) {
                newIndex++;
                if (newIndex >= images.length - 1) {
                    newIndex = images.length - 1;
                    setAnimacaoCrescente(false);
                }
            } else {
                newIndex--;
                if (newIndex <= 0) {
                    newIndex = 0;
                    setAnimacaoCrescente(true);
                }
            }

            return newIndex;
        });
    };

    // Função para voltar à tela anterior
    const goBackToEggPreparation = () => {
        playClickSound(); // Toca som ao voltar
        navigation.navigate('EggPreparation');
    };

    // Effect para controlar o som quando pausa/despausa
    useEffect(() => {
        if (isRunning && remainingTime > 0) {
            // Só toca se não estiver já tocando (evita restart)
            playClockSound();
        } else {
            // Para quando pausado
            stopClockSound();
        }
    }, [isRunning]); // Só quando muda pause/play

    // useFocusEffect para iniciar som quando a tela ganha foco
    useFocusEffect(
        React.useCallback(() => {
            // Executa quando a tela ganha foco (equivalente a page_load)
            console.log('Timer screen focused - starting clock sound');
            
            // Pequeno delay para garantir que tudo carregou
            const timer = setTimeout(() => {
                if (isRunning) {
                    playClockSound();
                }
            }, 500); // 500ms de delay
            
            // Cleanup quando a tela perde foco
            return () => {
                console.log('Timer screen unfocused - stopping clock sound');
                clearTimeout(timer);
                stopClockSound();
            };
        }, []) // Array vazio - só executa quando foca/desfoca a tela
    );

    // Effect separado para quando o timer zera
    useEffect(() => {
        if (remainingTime === 0) {
            // Para o som e navega para TimerFinish
            stopClockSound();
            navigation.navigate('TimerFinish');
        }
    }, [remainingTime, navigation]);

    // Effect para o timer principal
    useEffect(() => {
        let timer;
        if (isRunning && remainingTime > 0) {
            timer = setInterval(() => {
                setRemainingTime(prevTime => prevTime - 1);
            }, 1000);
        }

        return () => clearInterval(timer);
    }, [isRunning, remainingTime]);

    // Effect para a animação
    useEffect(() => {
        let animationTimer;
        if (isRunning && remainingTime > 0) {
            animationTimer = setInterval(() => {
                changeImage();
            }, 400);
        }

        return () => clearInterval(animationTimer);
    }, [isRunning, remainingTime, animacaoCrescente]);

    // Limpeza quando o componente é desmontado
    useEffect(() => {
        return () => {
            // Para o som quando sair da tela
            stopClockSound();
        };
    }, []);

    // Função para obter o texto do botão de voltar
    const getBackButtonText = () => {
        if (language === 'pt') {
            return 'Voltar';
        } else if (language === 'en') {
            return 'Back';
        } else {
            return 'Indietro';
        }
    };

    // Função para obter o texto do cabeçalho
    const getHeadingText = () => {
        if (language === 'pt') {
            return 'Seu ovo ficará pronto em...';
        } else if (language === 'en') {
            return 'Your egg will be ready in...';
        } else {
            return 'Il tuo uovo sarà pronto in...';
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
                    {/* Botão de voltar no canto superior esquerdo */}
                    <TouchableOpacity
                        onPress={goBackToEggPreparation}
                        style={styles.backButton}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.backButtonText}>
                            {getBackButtonText()}
                        </Text>
                    </TouchableOpacity>

                    <View style={styles.container}>
                        <Text style={[styles.heading, { fontFamily: 'PressStart2P' }]}>
                            {getHeadingText()}
                        </Text>

                        <View style={styles.imageContainer}>
                            <Image
                                source={images[currentImageIndex]}
                                style={styles.image}
                                resizeMode="contain"
                            />
                        </View>

                        <Text style={styles.bottom}>{formatTime(remainingTime)}</Text>
                    </View>
                </ImageBackground>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#E6B3FF',
    },
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    backButton: {
        position: 'absolute',
        top: 20,
        left: 20,
        backgroundColor: '#ffffeb',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 25,
        borderWidth: 3,
        borderColor: '#eed6fa',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        zIndex: 10,
    },
    backButtonText: {
        fontSize: 12,
        color: '#ffd900',
        fontFamily: 'PressStart2P',
        fontWeight: 'bold',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        paddingTop: 20,
        paddingBottom: 40,
    },
    heading: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 40,
        textAlign: 'center',
        color: '#cd853f',
        paddingHorizontal: 10,
    },
    bottom: {
        fontSize: 60,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#ffd900',
        fontFamily: 'PressStart2P',
        backgroundColor: '#ffffeb87',
        borderRadius: 10,
        padding: 10,
        borderWidth: 4,
        borderColor: '#eed6fa',
        shadowColor: '#000',
    },
    imageContainer: {
        width: 120,
        height: 120,
        marginBottom: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 160,
        height: 160,
    },
});
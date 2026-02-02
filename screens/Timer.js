import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet, ImageBackground, Image, TouchableOpacity } from 'react-native';
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

    // Refs para controlar os toques
    const tapCount = useRef(0);
    const tapTimer = useRef(null);
    const longPressTimer = useRef(null);

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

    // Função para iniciar/pausar o cronômetro
    const startPauseTimer = () => {
        setIsRunning(!isRunning);
    };

    // Função para resetar o cronômetro
    const resetTimer = () => {
        playClickSound(); // Toca som ao resetar
        setRemainingTime(time * 60);
        setIsRunning(true);
        setCurrentImageIndex(0);
        setAnimacaoCrescente(true);
    };

    // Função para voltar à tela anterior
    const goBackToEggPreparation = () => {
        playClickSound(); // Toca som ao voltar
        navigation.navigate('EggPreparation');
    };

    // Função para lidar com o início do toque (onPressIn)
    const handlePressIn = () => {
        // Inicia o timer para long press
        longPressTimer.current = setTimeout(() => {
            // Long press detectado - volta para EggPreparation
            goBackToEggPreparation();
        }, 800); // 800ms para long press
    };

    // Função para lidar com o fim do toque (onPressOut)
    const handlePressOut = () => {
        // Cancela o long press timer
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
            longPressTimer.current = null;
        }

        // Incrementa o contador de toques
        tapCount.current += 1;

        if (tapCount.current === 1) {
            // Primeiro toque - inicia timer para detectar double tap
            tapTimer.current = setTimeout(() => {
                // Single tap - pausa/resume o timer
                startPauseTimer();
                tapCount.current = 0;
            }, 300); // 300ms para detectar double tap
        } else if (tapCount.current === 2) {
            // Double tap detectado - reseta o timer
            if (tapTimer.current) {
                clearTimeout(tapTimer.current);
                tapTimer.current = null;
            }
            resetTimer();
            tapCount.current = 0;
        }
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

    // Limpeza dos timers quando o componente é desmontado
    useEffect(() => {
        return () => {
            if (tapTimer.current) {
                clearTimeout(tapTimer.current);
            }
            if (longPressTimer.current) {
                clearTimeout(longPressTimer.current);
            }
            // Para o som quando sair da tela
            stopClockSound();
        };
    }, []);

    // Função para obter o texto das instruções
    const getInstructionsText = () => {
        if (language === 'pt') {
            return '1 toque: pausar • 2 toques: resetar • Toque longo: voltar';
        } else if (language === 'en') {
            return '1 tap: pause • 2 taps: reset • Long press: back';
        } else {
            return '1 tocco: pausa • 2 tocchi: reset • Pressione lungo: indietro';
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

    // Função para obter o texto do botão
    const getButtonText = () => {
        if (language === 'pt') {
            return 'Resetar';
        } else if (language === 'en') {
            return 'Reset';
        } else {
            return 'Reset';
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

                        <TouchableOpacity
                            onPressIn={handlePressIn}
                            onPressOut={handlePressOut}
                            activeOpacity={0.8}
                        >
                            <View style={styles.imageContainer}>
                                <Image
                                    source={images[currentImageIndex]}
                                    style={styles.image}
                                    resizeMode="contain"
                                />
                            </View>
                        </TouchableOpacity>

                        <Text style={styles.bottom}>{formatTime(remainingTime)}</Text>
{/* 
                        <Text style={styles.instructions}>
                            {getInstructionsText()}
                        </Text>

                        <View style={styles.buttonContainer}>
                            <View style={styles.buttonSpacing} />
                            <Button
                                title={getButtonText()}
                                onPress={resetTimer}
                            />
                        </View> */}
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
        paddingTop: 20,
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
    bottom: {
        fontSize: 60, // Reduzido para caber melhor
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
        width: 160, // Reduzido ligeiramente
        height: 160,
    },
    instructions: {
        fontSize: 11,
        color: '#666',
        textAlign: 'center',
        marginBottom: 10,
        paddingHorizontal: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        marginTop: 15,
    },
    buttonSpacing: {
        width: 20,
    },
});
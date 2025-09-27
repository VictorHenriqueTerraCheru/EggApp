import React, { useState, useEffect, useRef } from 'react';
import { Text, View, Button, StyleSheet, Animated, ScrollView } from 'react-native';

export default function Timer({ route }) {
    const { time } = route.params;  // Recebe o tempo da tela anterior
    const [remainingTime, setRemainingTime] = useState(time * 60);  // Tempo em segundos
    const [isRunning, setIsRunning] = useState(true);  // Inicia o cronômetro automaticamente

    // Animação para o loop das imagens
    const animation = useRef(new Animated.Value(0)).current;

    const images = [
        require('../assets/Egg1.png'),
        require('../assets/Egg2.png'),
        require('../assets/Egg3.png'),
        require('../assets/Egg1.png'),
        require('../assets/Egg2.png'),
        require('../assets/Egg3.png'),
        require('../assets/Egg4.png'),
        require('../assets/Egg1.png'),
        require('../assets/Egg2.png'),
    ];

    // Função para iniciar/pausar o cronômetro
    const startPauseTimer = () => {
        setIsRunning(!isRunning);
    };

    // Função para resetar o cronômetro
    const resetTimer = () => {
        setRemainingTime(time * 60);  // Resetando para o tempo inicial
        setIsRunning(true);  // Inicia o cronômetro automaticamente
    };

    useEffect(() => {
        let timer;
        if (isRunning && remainingTime > 0) {
            timer = setInterval(() => {
                setRemainingTime(prevTime => prevTime - 1);
            }, 1000);
        } else if (remainingTime === 0) {
            clearInterval(timer);
            alert('Ovo pronto!');
        }
        return () => clearInterval(timer);
    }, [isRunning, remainingTime]);

    // Converte segundos para formato MM:SS
    const formatTime = (timeInSeconds) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;
        return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    // Animação do loop das imagens
    useEffect(() => {
        const loopAnimation = () => {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(animation, {
                        toValue: 8,  // Vai até a última imagem (9 fotos)
                        duration: 8000,  // Duração total do loop (tempo do timer)
                        useNativeDriver: true,
                    }),
                    Animated.timing(animation, {
                        toValue: 0,  // Retorna para a primeira imagem
                        duration: 8000,  // Duração total do loop (tempo do timer)
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        };

        loopAnimation();
    }, [remainingTime]);

    // Mapeia as imagens para criar um efeito de loop
    const imageInterpolation = animation.interpolate({
        inputRange: [0, 8],  // Indica o número de imagens
        outputRange: images.map((_, index) => index * 100), // Distância entre as imagens no loop
    });

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Tempo do Ovo: {formatTime(remainingTime)}</Text>

            {/* Exibe o loop de imagens com animação */}
            <ScrollView contentContainerStyle={styles.imagesContainer}>
                <Animated.View style={[styles.imageWrapper, { transform: [{ translateX: imageInterpolation }] }]}>
                    {images.map((image, index) => (
                        <Animated.Image
                            key={index}
                            source={image}
                            style={[styles.image, { opacity: animation.interpolate({ inputRange: [index, index + 1], outputRange: [1, 0] }) }]}
                            resizeMode="contain"
                        />
                    ))}
                </Animated.View>
            </ScrollView>

            <Button title={isRunning ? 'Pausar' : 'Iniciar'} onPress={startPauseTimer} />
            <Button title="Resetar" onPress={resetTimer} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    heading: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    imagesContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageWrapper: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    image: {
        width: 100,  // Definindo o tamanho das imagens
        height: 100,
        margin: 5,
    },
});

import { Audio } from 'expo-av';
import { useEffect, useRef } from 'react';

export const useSound = () => {
    const clickSound = useRef(null);
    const clockSound = useRef(null);
    const alarmSound = useRef(null);

    // Carrega os sons quando o hook é inicializado
    useEffect(() => {
        const loadSounds = async () => {
            try {
                // Configura o modo de áudio
                await Audio.setAudioModeAsync({
                    allowsRecordingIOS: false,
                    staysActiveInBackground: false,
                    playsInSilentModeIOS: true,
                    shouldDuckAndroid: true,
                    playThroughEarpieceAndroid: false,
                });

                // Carrega o som de clique
                const { sound: click } = await Audio.Sound.createAsync(
                    require('../assets/mouseClick.wav'),
                    { shouldPlay: false, volume: 0.5 }
                );
                clickSound.current = click;

                // Carrega o som de relógio
                const { sound: clock } = await Audio.Sound.createAsync(
                    require('../assets/clockSound.wav'),
                    { 
                        shouldPlay: false, 
                        volume: 1,
                        isLooping: true
                    }
                );
                clockSound.current = clock;

                // Carrega o som de alarme
                const { sound: alarm } = await Audio.Sound.createAsync(
                    require('../assets/alarm.mp3'),
                    { 
                        shouldPlay: false, 
                        volume: 0.8, // Volume alto para alarme
                        isLooping: true
                    }
                );
                alarmSound.current = alarm;
            } catch (error) {
                console.warn('Erro ao carregar sons:', error);
            }
        };

        loadSounds();

        // Cleanup: descarrega os sons quando o componente for desmontado
        return () => {
            if (clickSound.current) {
                clickSound.current.unloadAsync();
            }
            if (clockSound.current) {
                clockSound.current.unloadAsync();
            }
            if (alarmSound.current) {
                alarmSound.current.unloadAsync();
            }
        };
    }, []);

    // Função para tocar o som de clique
    const playClickSound = async () => {
        try {
            if (clickSound.current) {
                // Para o som se estiver tocando e reinicia
                await clickSound.current.stopAsync();
                await clickSound.current.setPositionAsync(0);
                await clickSound.current.playAsync();
            }
        } catch (error) {
            console.warn('Erro ao tocar som de clique:', error);
        }
    };

    // Função para iniciar o som de relógio em loop
    const playClockSound = async () => {
        try {
            if (clockSound.current) {
                const status = await clockSound.current.getStatusAsync();
                // Só toca se não estiver já tocando
                if (!status.isPlaying) {
                    await clockSound.current.setPositionAsync(0);
                    await clockSound.current.playAsync();
                }
            }
        } catch (error) {
            console.warn('Erro ao tocar som de relógio:', error);
        }
    };

    // Função para parar o som de relógio
    const stopClockSound = async () => {
        try {
            if (clockSound.current) {
                await clockSound.current.stopAsync();
            }
        } catch (error) {
            console.warn('Erro ao parar som de relógio:', error);
        }
    };

    // Função para iniciar o som de alarme em loop
    const playAlarmSound = async () => {
        try {
            if (alarmSound.current) {
                const status = await alarmSound.current.getStatusAsync();
                // Só toca se não estiver já tocando
                if (!status.isPlaying) {
                    await alarmSound.current.setPositionAsync(0);
                    await alarmSound.current.playAsync();
                }
            }
        } catch (error) {
            console.warn('Erro ao tocar som de alarme:', error);
        }
    };

    // Função para parar o som de alarme
    const stopAlarmSound = async () => {
        try {
            if (alarmSound.current) {
                await alarmSound.current.stopAsync();
            }
        } catch (error) {
            console.warn('Erro ao parar som de alarme:', error);
        }
    };

    return { 
        playClickSound, 
        playClockSound, 
        stopClockSound,
        playAlarmSound,
        stopAlarmSound
    };
};
import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import * as Font from 'expo-font';
import Header from '../components/Header';
import { useLanguage } from '../context/LanguageContext';
import { useSound } from '../hooks/useSound';

export default function Home() {
    const navigation = useNavigation();
    const { language } = useLanguage();
    const { playClickSound } = useSound();

    // Garantir que a fonte foi carregada
    const [fontLoaded, setFontLoaded] = React.useState(false);

    // Carregar a fonte quando o componente for montado
    React.useEffect(() => {
        const loadFonts = async () => {
            await Font.loadAsync({
                'PressStart2P': require('../assets/fonts/PressStart2P-Regular.ttf'),
            });
            setFontLoaded(true);
        };

        loadFonts();
    }, []);

    // Função para obter o texto do título
    const getTitleText = () => {
        if (language === 'pt') {
            return 'Vamos cozinhar\n esse ovo!';
        } else if (language === 'en') {
            return "Let's time\n your egg!";
        } else {
            return 'Cronometri amo\n il tuo uovo!';
        }
    };

    // Função para obter o texto do botão
    const getButtonText = () => {
        if (language === 'pt') {
            return 'Começar';
        } else if (language === 'en') {
            return 'Start';
        } else {
            return 'Inizio';
        }
    };

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
                    <Header />

                    <View style={styles.container}>
                        <Text style={styles.title}>
                            {getTitleText()}
                        </Text>

                        <TouchableOpacity
                            onPress={() => {playClickSound(); navigation.navigate('EggPreparation')}}
                            style={styles.startButton}
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
        paddingHorizontal: 20,
        paddingBottom: 60, // Espaço extra para compensar o Header
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
    title: {
        fontSize: 26, // Reduzido para caber melhor
        color: '#cd853f',
        fontWeight: 'bold',
        textAlign: 'center',
        fontFamily: 'PressStart2P',
        marginBottom: 40,
        paddingHorizontal: 10,
    },
    startButton: {
        marginTop: 20,
        backgroundColor: '#ffffeb',
        width: 200, // Reduzido para caber melhor
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
        fontSize: 18, // Reduzido para caber melhor
        color: '#ffd900',
        fontFamily: 'PressStart2P',
        fontWeight: 'bold',
    },
});
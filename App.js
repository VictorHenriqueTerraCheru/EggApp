import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { LanguageProvider } from './context/LanguageContext';  // Importando o LanguageProvider
import Home from './screens/Home';  // Importando a tela Home
import EggPreparation from './screens/EggPreparation';  // Importando a tela EggPreparation
import Timer from './screens/Timer';  // Cronômetro
import TimerFinish from './screens/TimerFinish';  // Cronômetro
const Stack = createStackNavigator();

export default function App() {
  return (
    <LanguageProvider>  {/* Envolvendo o aplicativo com o LanguageProvider */}
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="EggPreparation" component={EggPreparation} />
          <Stack.Screen name="Timer" component={Timer} />
          <Stack.Screen name="TimerFinish" component={TimerFinish} />
        </Stack.Navigator>
      </NavigationContainer>
    </LanguageProvider>
  );
}

// src/context/timerContext.js

import React, { createContext, useState, useContext, useRef, useEffect } from 'react';

// Criando o contexto do Timer
const TimerContext = createContext();

// Hook customizado para acessar o contexto
export function useTimer() {
  return useContext(TimerContext); // Acessa o contexto do cronômetro
}

// Provedor do contexto Timer
export function TimerProvider({ children }) {
  const [time, setTime] = useState(300); // 5 minutos em segundos
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  // Função para iniciar/pausar o cronômetro
  const startPauseTimer = () => setIsRunning((prev) => !prev);

  // Função para resetar o cronômetro
  const resetTimer = (seconds = 300) => {
    setIsRunning(false);
    setTime(seconds); // Resetando o tempo
  };

  // Função para iniciar o cronômetro
  useEffect(() => {
    if (isRunning && time > 0) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            alert('Ovo pronto!');
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    // Limpeza do intervalo
    return () => clearInterval(intervalRef.current);
  }, [isRunning, time]);

  return (
    <TimerContext.Provider value={{ time, startPauseTimer, resetTimer, isRunning }}>
      {children}
    </TimerContext.Provider>
  );
}

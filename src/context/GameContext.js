import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import useClicks from '../hooks/useClicks';
import useAssistants from '../hooks/useAssistants';
import useGameData from '../hooks/useGameData';
import { useAuth } from './AuthContext';

const GameContext = createContext();

export const GameProvider = ({ children }) => {
    const { clicks, incrementClicks } = useClicks();
    const { assistants, fetchAssistants, updateAssistant, isLoading: isLoadingAssistants } = useAssistants();
    const { inventory, saveClicks, loadGame } = useGameData();
    const { token, user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (token && user) {
                setIsLoading(true);
                try {
                    const gameData = await loadGame();
                    if (gameData) {
                        //Mettre à jour le state ici si nécessaire
                    }
                } finally {
                    setIsLoading(false);
                }
                fetchAssistants();
            }
        };

        fetchData();
    }, [token, user, loadGame, fetchAssistants]);


    const value = {
        clicks,
        inventory,
        assistants,
        incrementClicks,
        saveClicks,
        fetchAssistants,
        updateAssistant,
        isLoading: isLoading || isLoadingAssistants,
    };

    return (
        <GameContext.Provider value={value}>
            {children}
        </GameContext.Provider>
    );
};

export const useGame = () => {
    return useContext(GameContext);
};
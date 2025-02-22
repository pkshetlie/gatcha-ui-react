import React, { createContext, useState, useEffect, useContext } from 'react';
import useClicks from '../hooks/useClicks';
import useAssistants from '../hooks/useAssistants';
import useGameData from '../hooks/useGameData';
import { useAuth } from './AuthContext';
import useInventory from "../hooks/useInventory";

const GameContext = createContext();

export const GameProvider = ({ children }) => {
    const { clicks, incrementClicks } = useClicks();
    const { assistants, fetchAssistants, updateAssistant, isLoading: isLoadingAssistants } = useAssistants();
    const { inventory, fetchInventory } = useInventory();
    const { saveClicks, loadGame } = useGameData();
    const { token, user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [hideNsfw, setShowNsfw] = useState(true);

    const toggleNsfw = () => {
        setShowNsfw((prev) => !prev);
    };

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
                fetchInventory();
            }
        };

        fetchData();
    }, [token, user, loadGame, fetchAssistants, fetchInventory]);


    const value = {
        clicks,
        inventory,
        assistants,
        incrementClicks,
        saveClicks,
        fetchAssistants,
        updateAssistant,
        isLoading: isLoading || isLoadingAssistants,

        hideNsfw, // Ajouter l'état NSFW
        toggleNsfw, // Ajouter la fonction pour basculer NSFW

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

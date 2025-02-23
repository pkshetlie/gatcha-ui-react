import React, { createContext, useState, useEffect, useContext } from 'react';
import useClicks from '../hooks/useClicks';
import useAssistants from '../hooks/useAssistants';
import useGameData from '../hooks/useGameData';
import { useAuth } from './AuthContext';
import useInventory from "../hooks/useInventory";
import api from "../services/api";

const GameContext = createContext();

export const GameProvider = ({ children }) => {
    const { clicks, incrementClicks, initClicks } = useClicks();
    const { assistants, fetchAssistants, updateAssistant, isLoading: isLoadingAssistants } = useAssistants();
    const { inventory, fetchInventory } = useInventory();
    const { saveClicks, loadGame } = useGameData();
    const { token, refreshAccessToken, user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [hideNsfw, setShowNsfw] = useState(true);

    const toggleNsfw = () => {
        setShowNsfw((prev) => !prev);
         api.put('/settings', {nsfw : !hideNsfw}, token, refreshAccessToken);
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

                const data = await api.get('/init', token, refreshAccessToken); // Appels gérés avec le service API
                initClicks(data.clicks);
                setShowNsfw(data.nsfw??false);

                fetchAssistants();
                fetchInventory();
            }
        };

        fetchData();
    }, [token, user, loadGame, fetchAssistants, fetchInventory, initClicks, refreshAccessToken]);


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

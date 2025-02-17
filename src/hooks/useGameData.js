import { useState, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext'; // Import du contexte Auth

function useGameData() {
    const [inventory, setInventory] = useState({ simple: 0, rare: 0, epic: 0 });
    const { token, user } = useAuth(); // Utilisation du contexte Auth

    const saveClicks = useCallback(async (clicks) => {
        if (!token || !user) return;

        try {
            const data = await api.post('/save-game', { clicks }, token);
            setInventory(data.inventory);
            console.log("Sauvegarde des clics réussie", data);
            return true;
        } catch (error) {
            console.error('Error saving clicks:', error);
            return false;
        }
    }, [token, user]); // Dépendances : token et user

    const loadGame = useCallback(async () => {
        if (!token || !user) return;

        try {
            const data = await api.get('/load-game', token);
            return data;
        } catch (error) {
            console.error('Error loading game data:', error);
            return null;
        }
    }, [token, user]); // Dépendances : token et user


    return { inventory, saveClicks, loadGame };
}

export default useGameData;
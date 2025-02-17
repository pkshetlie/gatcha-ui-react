import { useState, useCallback } from 'react';
import api from '../services/api';
import API_BASE_URL from '../config';
import { useAuth } from '../context/AuthContext';

function useAssistants() {
    const [assistants, setAssistants] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { token, user } = useAuth();

    const fetchAssistants = useCallback(async (page = 1) => {
        if (!token || !user) return;

        setIsLoading(true);
        try {
            const data = await api.get(`/cards?page=${page}`, token);

            const formattedAssistants = data.map(card => {
                // Détermine l'URL du portrait
                const portraitName = card.portrait ? card.portrait : null;
                const portraitUrl = portraitName ? `${API_BASE_URL.replace('/api', '')}${portraitName}` : null;

                return {
                    id: card.id,
                    name: card.personnage.name,
                    description: card.personnage.description,
                    imageUrl: card.evolutionSelection?.image ? `${API_BASE_URL.replace('/api', '')}/characters/${card.evolutionSelection.image}` : null, // URL de l'image principale
                    portraitUrl: portraitUrl, // URL du portrait
                    isNsfw: card.evolutionSelection ? card.evolutionSelection.isNsfw : false,
                    bonusAttack: card.bonusAttack,
                    bonusDefense: card.bonusDefense,
                };
            });

            setAssistants(formattedAssistants);
        } catch (error) {
            console.error('Error fetching assistants:', error);
        } finally {
            setIsLoading(false);
        }
    }, [token, user]);

    return { assistants, fetchAssistants, isLoading };
}

export default useAssistants;
import { useState, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import API_BASE_URL from "../config";

function useAssistants() {
    const [assistants, setAssistants] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { token, user } = useAuth();

    const fetchAssistants = useCallback(async (page = 1) => {
        if (!token || !user) return;

        setIsLoading(true);
        try {
            // 1. Récupère la liste des IDs et des noms des assistantes
            const idsData = await api.get(`/cards?page=${page}`, token);
            const assistantList = idsData.map(item => ({ id: item.id, name: item.personnage?.name }));

            // 2. Récupère les détails de chaque assistante
            const assistantDetails = await Promise.all(
                assistantList.map(async (item) => {
                    try {
                        const cardData = await api.get(`/card/${item.id}`, token);

                        // Construire les URLs des images, avec vérification
                        const portraitUrl = cardData?.portrait ? `${API_BASE_URL.replace('/api', '')}${cardData.portrait}` : null;
                        const imageUrl = cardData?.evolution_displayed?.image ? `${API_BASE_URL.replace('/api', '')}${cardData.evolution_displayed.image}` : null;

                        return {
                            id: cardData?.id,
                            name: cardData?.personnage?.name,
                            description: cardData?.personnage?.description,
                            imageUrl: imageUrl,
                            portraitUrl: portraitUrl,
                            isNsfw: cardData?.evolutions_displayable?.some(evo => evo?.isNsfw) || false, // S'assure que c'est un booléen
                            bonusAttack: cardData?.dataset?.bonus?.[1] || 0, //S'assure d'avoir une valeur par défaut
                            bonusDefense: cardData?.dataset?.bonus?.[4] || 0, //S'assure d'avoir une valeur par défaut
                            evolutions: cardData?.evolutions_displayable || [],
                            evolution_displayed: cardData?.evolution_displayed,
                        };
                    } catch (error) {
                        console.error(`Error fetching details for card ${item.id}:`, error);
                        return null; // Retourne null en cas d'erreur pour cette carte
                    }
                })
            );

            // 3. Filtre les résultats pour enlever les cartes qui ont retourné une erreur
            const filteredAssistants = assistantDetails.filter(assistant => assistant !== null);
            setAssistants(filteredAssistants);

        } catch (error) {
            console.error('Error fetching assistants:', error);
        } finally {
            setIsLoading(false);
        }
    }, [token, user]);

    const updateAssistant = useCallback((assistantId, newPortraitUrl, newImageUrl) => {
        setAssistants(prevAssistants =>
            prevAssistants.map(assistant =>
                assistant.id === assistantId ? { ...assistant, portraitUrl: newPortraitUrl, imageUrl: newImageUrl } : assistant
            )
        );
    }, []);

    return { assistants, fetchAssistants, updateAssistant, isLoading };
}

export default useAssistants;
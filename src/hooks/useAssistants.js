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
            // 1. Récupère la liste des IDs des assistantes
            const idsData = await api.get(`/cards?page=${page}`, token);
            const assistantIds = idsData.map(item => item.id);

            // 2. Récupère les détails de chaque assistante
            const assistantDetails = await Promise.all(
              assistantIds.map(async (id) => {
                  try {
                      const cardData = await api.get(`/card/${id}`, token);

                      // Construire les URLs des images
                      const portraitUrl = cardData.portrait ? `${API_BASE_URL.replace('/api', '')}${cardData.portrait}` : null;
                      const imageUrl = cardData.evolution_displayed?.image ? `${API_BASE_URL.replace('/api', '')}${cardData.evolution_displayed.image}` : null;

                      return {
                          id: cardData.id,
                          name: cardData.personnage.name,
                          description: cardData.personnage.description,
                          imageUrl: imageUrl,
                          portraitUrl: portraitUrl,
                          isNsfw: cardData.evolutions_displayable.some(evo => evo.isNsfw), //Vérifie si au moins une évolution est NSFW
                          bonusAttack: cardData.dataset.bonus[1], //Bonus à l'attaque
                          bonusDefense: cardData.dataset.bonus[4], //Bonus à la défense
                          evolutions: cardData.evolutions_displayable,
                      };
                  } catch (error) {
                      console.error(`Error fetching details for card ${id}:`, error);
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

    return { assistants, fetchAssistants, isLoading };
}

export default useAssistants;

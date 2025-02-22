import {useCallback, useState} from 'react';
import api from '../services/api';
import {useAuth} from '../context/AuthContext';

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
            const assistantList = idsData.map(item => ({ ...item }));

            // 2. Récupère les détails de chaque assistante
            // const assistantDetails = await Promise.all(
            //     assistantList.map(async (item) => {
            //         try {
            //             return await api.get(`/card/${item.id}`, token);
            //         } catch (error) {
            //             console.error(`Error fetching details for card ${item.id}:`, error);
            //             return null; // Retourne null en cas d'erreur pour cette carte
            //         }
            //     })
            // );

            // 3. Filtre les résultats pour enlever les cartes qui ont retourné une erreur
            // const filteredAssistants = assistantDetails.filter(assistant => assistant !== null);
            setAssistants(assistantList);

        } catch (error) {
            console.error('Error fetching assistants:', error);
        } finally {
            setIsLoading(false);
        }
    }, [token, user]);

    const updateAssistant = useCallback((newAssistant) => {
        setAssistants(prevAssistants =>
            prevAssistants.map(assistant =>
                assistant.id === newAssistant.id ? { ...assistant, ...newAssistant } : assistant
            )
        );
    }, []);

    return { assistants, fetchAssistants, updateAssistant, isLoading };
}

export default useAssistants;

import { useState, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

function useInventory() {
    const [inventory, setInventory] = useState({ simple: 0, rare: 0, epic: 0 });
    const { token, user } = useAuth();

    const updateInventory = useCallback(async () => {
        if (!token || !user) return;

        try {
            const data = await api.get('/inventory', token); // Remplace '/inventory' par ton endpoint pour récupérer l'inventaire
            setInventory(data);
            return true;
        } catch (error) {
            console.error('Error updating inventory:', error);
            return false;
        }
    }, [token, user]);

    const addScroll = useCallback(async (scrollType, quantity = 1) => {
        //scrollType = simple | rare | epic
        if (!token || !user) return;
        try {
            //const data = await api.post('/add-scroll', { scrollType, quantity }, token); //a voir si l'api est ok
            //setInventory(data.inventory); // Mettre à jour l'inventaire avec la réponse du serveur
            //Simule une réponse de l'api, en attendant
            setInventory(prevInventory => {
                return {
                    ...prevInventory,
                    [scrollType]: prevInventory[scrollType] + quantity
                }
            });

            return true;
        } catch (error) {
            console.error('Error adding scroll:', error);
            return false;
        }
    }, [token, user]);

    return { inventory, updateInventory, addScroll };
}

export default useInventory;
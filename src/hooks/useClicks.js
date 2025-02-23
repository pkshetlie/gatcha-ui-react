import {useState, useCallback, useEffect} from 'react';
import api from "../services/api";

function useClicks() {
    const [clicks, setClicks] = useState(0);
    const [previousClicks, setPreviousClicks] = useState(0); // Nombre de clics pour suivi
    const incrementClicks = useCallback(() => {
        setClicks((prevClicks) => parseInt(prevClicks) + 1);
    }, []);
    const token = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refreshToken");

    const initClicks = useCallback(async (click) => {
        const data = await api.get('/init', token, refreshToken); // Appels gérés avec le service API
        setClicks(data.clicks);
    }, []);

    useEffect(() => {
        const interval = setInterval(async () => {
            if (clicks !== previousClicks) {
                try {
                    // Effectuer un appel API si les clics ont changé
                    setPreviousClicks(clicks); // Met à jour le suivi des clics
                    await api.put('/settings', { clicks, last_clicks: Date.now() }, token, refreshToken);
                    console.log(`Clics mis à jour : ${clicks}`);
                } catch (error) {
                    console.error("Erreur lors de la mise à jour des clics :", error);
                }
            }
        }, 3000); // Vérifie toutes les 3 secondes

        return () => clearInterval(interval); // Nettoie l'intervalle à la destruction du composant
    }, [clicks, previousClicks, token]);


    return { clicks, incrementClicks, initClicks };
}

export default useClicks;

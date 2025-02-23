import {useState, useCallback, useEffect} from 'react';
import api from "../services/api";
import {useAuth} from "../context/AuthContext";

function useClicks() {
    const [clicks, setClicks] = useState(0);
    const [previousClicks, setPreviousClicks] = useState(0); // Nombre de clics pour suivi
    const incrementClicks = useCallback(() => {
        setClicks((prevClicks) => parseInt(prevClicks) + 1);
    }, []);
    const {token, refreshAccessToken} = useAuth();

    const initClicks = useCallback(async (click) => {
        const data = await api.get('/init', token, refreshAccessToken); // Appels gérés avec le service API
        setClicks(data.clicks);
    }, [token, refreshAccessToken]);

    useEffect(() => {
        const interval = setInterval(async () => {
            if (clicks !== previousClicks) {
                try {
                    // Effectuer un appel API si les clics ont changé
                    setPreviousClicks(clicks); // Met à jour le suivi des clics
                    await api.put('/settings', { clicks, last_clicks: Date.now() }, token, refreshAccessToken);
                    console.log(`Clics mis à jour : ${clicks}`);
                } catch (error) {
                    console.error("Erreur lors de la mise à jour des clics :", error);
                }
            }
        }, 1000); // Vérifie toutes les 3 secondes

        return () => clearInterval(interval); // Nettoie l'intervalle à la destruction du composant
    }, [clicks, previousClicks, token,refreshAccessToken]);


    return { clicks, incrementClicks, initClicks };
}

export default useClicks;

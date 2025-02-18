import React, { useState, useCallback } from 'react';
import './Modal.css';
import API_BASE_URL from "../../config";
import api from '../../services/api';  // Import api
import {useGame} from "../../context/GameContext";

function Modal({ imageUrl,portraitUrl, name, description, bonusAttack, bonusDefense, isNsfw, showNsfw, evolutions, onClose, assistantId, token }) {
    const { updateAssistant } = useGame();
    const [isBlurred, setIsBlurred] = useState(isNsfw && !showNsfw);
    const [currentImageUrl, setCurrentImageUrl] = useState(imageUrl); // État pour l'image courante
    const [isLoading, setIsLoading] = useState(false);


    const handleToggleBlur = useCallback(() => {
        setIsBlurred(prevIsBlurred => !prevIsBlurred);
    }, [setIsBlurred]);

    const handleChangeEvolution = useCallback(async (evolutionId) => {
        setIsLoading(true);
        try {
            const response = await api.post('/card/selector/', { card_id: assistantId, evolution_id: evolutionId }, token);
            //Assure toi que l'api retourne bien un element image
            if (response && response.evolution_displayed?.image) {
                const newImageUrl = `${API_BASE_URL.replace('/api', '')}${response.evolution_displayed.image}`;

                setCurrentImageUrl(newImageUrl);
                updateAssistant(assistantId, `${API_BASE_URL.replace('/api', '')}${response.evolution_displayed.portrait}`); // Met à jour l'état global
            }
            else {
                throw new Error('Response mal formé ou image absente de la réponse')
            }


        } catch (error) {
            console.error('Error setting image', error);
        } finally {
            setIsLoading(false);
        }
    }, [setIsBlurred, assistantId, token]);

    const modalStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        overflow: 'auto',
    };

    const modalContentStyle = {
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '80%',
        maxHeight: '90vh',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    overflow: 'auto',
};

    const imageContainerStyle = {
        position: 'relative',
        width: '100%',
        height: '400px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    };

    const imageStyle = {
        maxWidth: '50vh',
        maxHeight: '100vh',
        filter: (showNsfw || !isNsfw || !isBlurred) ? 'none' : 'blur(20px)',
        cursor: 'default',
        objectFit: 'contain',
    };

    const evolutionsListStyle = {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 0,
        margin: '10px 0',
        listStyle: 'none',
        width: '100%'
    };

    const evolutionItemStyle = {
        width: '20%',
        padding: '5px',
        boxSizing: 'border-box',
    };

    const evolutionImageStyle = {
        maxWidth: '100%',
        maxHeight: '120px',
        objectFit: 'contain',
    };

    const stopPropagation = (event) => {
        event.stopPropagation();
    };

    return (
        <div style={modalStyle} onClick={onClose}>
            <div style={modalContentStyle}>
                <div style={imageContainerStyle}>
                    <img src={currentImageUrl} alt={name} style={imageStyle} />
                    {isNsfw && (
                        <button className="modal-nsfw-button" onClick={(event) => {
                            stopPropagation(event);
                            handleToggleBlur();
                        }}>
                            {isBlurred ? 'Reveal' : 'Hide'}
                        </button>
                    )}
                </div>
                {/* Display Evolutions */}
                <ul style={evolutionsListStyle}>
                    {evolutions.map((evolution) => (
                        <li key={evolution.id} style={evolutionItemStyle} onClick={(event) => {
                            stopPropagation(event);
                            handleChangeEvolution(evolution.id);
                        }}>
                            <img
                                src={evolution.image ? `${API_BASE_URL.replace('/api', '')}${evolution.image}` : null}
                                alt={`Evolution ${evolution.id}`}
                                style={evolutionImageStyle}
                            />
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Modal;
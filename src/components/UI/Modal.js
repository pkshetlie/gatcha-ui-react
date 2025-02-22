import React, {useCallback, useState, useEffect} from 'react';
import './Modal.css';
import config from "../../config";
import api from '../../services/api';
import {useGame} from "../../context/GameContext";

function Modal({
                   assistant,
                   onClose,
                   token
               }) {
    const {updateAssistant} = useGame();
    const { hideNsfw } = useGame();
    const [isBlurred, setIsBlurred] = useState(assistant.evolution_displayed.isNsfw && hideNsfw);
    const [isLoading, setIsLoading] = useState(false);

    // Use useEffect to update isBlurred when assistant or showNsfw changes
    useEffect(() => {
        setIsBlurred(assistant.evolution_displayed.isNsfw && hideNsfw);
    }, [assistant.evolution_displayed.isNsfw, hideNsfw]);


    const handleToggleBlur = useCallback(() => {
        setIsBlurred(prevIsBlurred => !prevIsBlurred);
    }, [setIsBlurred]);

    const handleChangeEvolution = useCallback(async (evolution) => {
        setIsLoading(true);
        try {
            const response = await api.post('/card/selector/', {
                card_id: assistant.id,
                evolution_id: evolution.isExtra ? null: evolution.id,
                evolution_extra_id: evolution.isExtra ? evolution.id : null,
            }, token);
            if (response) {
                //setIsBlurred(response.evolution_displayed.isNsfw && !showNsfw); // Set here after api response
                updateAssistant(response);
                setIsBlurred(response.evolution_displayed.isNsfw && hideNsfw)

            } else {
                throw new Error('Response mal formé ou image absente de la réponse')
            }
        } catch (error) {
            console.error('Error setting image', error);
        } finally {
            setIsLoading(false);
        }
    }, [token, updateAssistant, assistant, hideNsfw]);  //Added showNsfw to dependency

    const handleEvolve = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await api.post(`/card/evolve/${assistant.id}`, {}, token); // Corrected API endpoint

            if (response) {
                updateAssistant(response);
                //setIsBlurred(response.evolution_displayed.isNsfw && !showNsfw);
            } else {
                throw new Error('Failed to evolve card or invalid response');
            }
        } catch (error) {
            console.error('Error evolving card', error);
        } finally {
            setIsLoading(false);
        }
    }, [assistant, token, updateAssistant]);

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
        maxWidth: '80vh',
        height: '90vh',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        overflow: 'auto',
    };

    const imageContainerStyle = {
        position: 'relative',
        width: '100%',
        height: '80vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'top',
        overflow: 'hidden',
    };

    const imageStyle = {
        maxWidth: '50vh',
        maxHeight: '100vh',
        filter: (!isBlurred) ? 'none' : 'blur(20px)',
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
        cursor: 'pointer'
    };

    const evolutionImageStyle = {
        maxWidth: '100%',
        maxHeight: '120px',
        objectFit: 'contain',
    };

    const nsfwButtonStyle = {
        position: 'absolute',
        top: '10px',
        right: '10px',
        padding: '8px 12px',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        zIndex: 10,
    };

    function canEvolve(assistant) {
        return assistant.canEvolve && assistant.count >= assistant.samplesToEvolve;
    }

    const evolveButtonStyle = {
        padding: '8px 12px',
        backgroundColor: canEvolve(assistant) ? 'green' : 'gray',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: canEvolve(assistant) ? 'pointer' : 'not-allowed',
        marginTop: '10px',
    };


    const stopPropagation = (event) => {
        event.stopPropagation();
    };


    return (
      <div style={modalStyle} onClick={onClose}>
          <div style={modalContentStyle}>
              <div style={imageContainerStyle}>
                  <img src={config.IMAGE_BASE_URL+assistant.evolution_displayed.image} alt={assistant.name} style={imageStyle}/>
                  {assistant.evolution_displayed.isNsfw && (
                    <button style={nsfwButtonStyle} onClick={(event) => {
                        stopPropagation(event);
                        handleToggleBlur();
                    }}>
                        {isBlurred ? 'Reveal' : 'Hide'}
                    </button>
                  )}
              </div>
              {/* Display Evolutions */}
              <ul style={evolutionsListStyle}>
                  {assistant.evolutions_displayable.map((evolution) => {
                        const combinedEvolutionImageStyle = {
                            ...evolutionImageStyle,
                            filter: hideNsfw && evolution.isNsfw ? 'blur(20px)' : 'none'
                        };
                    return <li key={evolution.id} style={evolutionItemStyle} onClick={(event) => {
                        stopPropagation(event);
                        handleChangeEvolution(evolution);
                    }}>
                        <img
                          src={evolution.image ? `${config.IMAGE_BASE_URL}${evolution.image}` : null}
                          alt={`Evolution ${evolution.id}`}
                          style={combinedEvolutionImageStyle}
                        />
                    </li>
                  }
                  )
                  }
              </ul>

              <button
                style={evolveButtonStyle}
                onClick={(event) => {
                    stopPropagation(event);
                    handleEvolve();
                }}
                disabled={!canEvolve(assistant)}
              >
                  {isLoading ? 'Evolving...' : `Evolve ${assistant.count} / ${assistant.samplesToEvolve}`}
              </button>
          </div>
      </div>
    );
}

export default Modal;

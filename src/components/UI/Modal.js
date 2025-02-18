import React, { useState, useCallback } from 'react';
import './Modal.css';
import API_BASE_URL from "../../config";

function Modal({ imageUrl, name, description, bonusAttack, bonusDefense, isNsfw, showNsfw, evolutions, onClose }) {
    const [isBlurred, setIsBlurred] = useState(isNsfw && !showNsfw);

    const handleToggleBlur = useCallback(() => {
        setIsBlurred(prevIsBlurred => !prevIsBlurred);
    }, [setIsBlurred]);

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
        flexDirection: 'row',
        width: '80%',
        maxHeight: '50vh',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        overflow: 'hidden',
    };

    const imageContainerStyle = {
        position: 'relative',
        width: '100%',
        height: '100vh', /* Augmente la hauteur disponible pour l'image */
        //display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    };

    const imageStyle = {
        maxWidth: '100%',
        maxHeight: '100%',
        filter: (showNsfw || !isNsfw || !isBlurred) ? 'none' : 'blur(20px)',
        cursor: 'default',
        objectFit: 'contain',
    };

    const infoContainerStyle = {
        width: '100%',
        padding: 20,
        color: '#333',
        textAlign: 'left',
        overflowY: 'auto', /* Ajoute un scroll vertical si la description est trop longue */
        maxHeight: '100vh', /* Limite la hauteur des infos */
    };

    const evolutionsListStyle = {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 0,
        margin: 0,
        listStyle: 'none',
    };

    const evolutionItemStyle = {
        width: '50%', /* Chaque image prend la moitié de la largeur */
        maxWidth: '50%',
        padding: '5px',
        boxSizing: 'border-box',
    };

    const evolutionImageStyle = {
        maxWidth: '100%',
        maxHeight: '100px', /* Taille maximale des images d'évolution */
        objectFit: 'contain',
    };

    const stopPropagation = (event) => {
        event.stopPropagation();
    };

    return (
      <div style={modalStyle} onClick={onClose}>
          <div style={modalContentStyle}>
              <div style={imageContainerStyle}>
                  <img src={imageUrl} alt={name} style={imageStyle} />
                  {isNsfw && (
                    <button className="modal-nsfw-button" onClick={(event) => {
                        stopPropagation(event);
                        handleToggleBlur();
                    }}>
                        {isBlurred ? 'Reveal' : 'Hide'}
                    </button>
                  )}
              </div>
              <div style={infoContainerStyle}>
                  <h3>{name}</h3>
                  <p>{description}</p>
                  <p>Bonus Attack: {bonusAttack}</p>
                  <p>Bonus Defense: {bonusDefense}</p>
                  <h4>Evolutions</h4>
                  <ul style={evolutionsListStyle}>
                      {evolutions.map((evolution) => (
                        <li key={evolution.id} style={evolutionItemStyle}>
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
      </div>
    );
}

export default Modal;

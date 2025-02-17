import React, { useState, useCallback } from 'react';
import './Modal.css';

function Modal({ imageUrl, name, description, bonusAttack, bonusDefense, isNsfw, showNsfw, onClose }) {
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
        maxWidth: '90%',
        maxHeight: '90vh',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        overflow: 'hidden',
    };

    const imageContainerStyle = {
        position: 'relative',
        width: '50%',
        display: 'flex',
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
        width: '50%',
        padding: 20,
        color: '#333',
        textAlign: 'left',
        overflow: 'auto',
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
                </div>
            </div>
        </div>
    );
}

export default Modal;
import React, { useState, useCallback } from 'react';
import './AssistantCard.css';
import { useGame } from '../../context/GameContext';
import Modal from '../UI/Modal';

function AssistantCard({ assistant }) {
    const { showNsfw } = useGame();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showName, setShowName] = useState(false);

    const handleImageClick = useCallback(() => {
        setIsModalOpen(true);
    }, [setIsModalOpen]);

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
    }, [setIsModalOpen]);

    const handleMouseEnter = useCallback(() => {
        setShowName(true);
    }, [setShowName]);

    const handleMouseLeave = useCallback(() => {
        setShowName(false);
    }, [setShowName]);

    const portraitStyle = {
        cursor: 'pointer',
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    };

    return (
        <>
            <div
                className="portrait-container"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <img
                    src={assistant.portraitUrl}
                    alt={assistant.name}
                    style={portraitStyle}
                    onClick={handleImageClick}
                />
                {showName && <div className="name-overlay">{assistant.name}</div>}
            </div>

            {isModalOpen && (
                <Modal
                    imageUrl={assistant.imageUrl}
                    name={assistant.name}
                    description={assistant.description}
                    bonusAttack={assistant.bonusAttack}
                    bonusDefense={assistant.bonusDefense}
                    isNsfw={assistant.isNsfw}
                    showNsfw={showNsfw}
                    isBlurred={assistant.isNsfw && !showNsfw} // Initialise isBlurred
                    onToggleBlur={() => { }} // Enlève la fonction
                    onClose={handleCloseModal}
                />
            )}
        </>
    );
}

export default AssistantCard;
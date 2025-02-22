import React, { useState, useCallback } from 'react';
import './AssistantCard.css';
import { useGame } from '../../context/GameContext';
import Modal from '../UI/Modal';
import config from '../../config';
import InfoModal from '../UI/InfoModal';
import {useAuth} from "../../context/AuthContext";

function AssistantCard({ assistant }) {
  const { showNsfw } = useGame();
  const { token } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  const handleImageClick = useCallback(() => {
    setIsModalOpen(true);
  }, [setIsModalOpen]);

  const handleInfoClick = useCallback(() => {
    setIsInfoModalOpen(true);
  }, [setIsInfoModalOpen]);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, [setIsModalOpen]);

  const handleCloseInfoModal = useCallback(() => {
    setIsInfoModalOpen(false);
  }, [setIsInfoModalOpen]);

  const portraitStyle = {
    cursor: 'pointer',
    width: '100%',
    height: '200px', // Hauteur fixe pour les portraits rectangulaires
    objectFit: 'cover',
  };

  return (
    <>
      <div className="assistant-card">
        <div className="portrait-container">
          <img
            src={config.IMAGE_BASE_URL+assistant.evolution_displayed.portrait}
            alt={assistant.personnage.name}
            style={portraitStyle}
          />
          <div className="name-overlay">{assistant.personnage.name}</div>
        </div>
        <div className="buttons-container">
          <button onClick={handleImageClick}>View Image</button>
          <button onClick={handleInfoClick}>View Info</button>
        </div>
      </div>


      {isModalOpen && (
        <Modal
          assistant={assistant}
          showNsfw={showNsfw}
          onClose={handleCloseModal}
          token={token}
        />
      )}
      {isInfoModalOpen && (
        <InfoModal
          assistant={assistant}
          onClose={handleCloseInfoModal}
        />
      )}
    </>
  );
}

export default AssistantCard;

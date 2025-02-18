import React from 'react';
import './InfoModal.css';

function InfoModal({ name, description, bonusAttack, bonusDefense, onClose }) {
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

  const infoContainerStyle = {
    maxWidth: '80%',
    padding: '20px',
    color: '#333',
    textAlign: 'left',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  };

  return (
    <div style={modalStyle} onClick={onClose}>
      <div style={infoContainerStyle}>
        <h3>{name}</h3>
        <p>{description}</p>
        <p>Bonus Attack: {bonusAttack}</p>
        <p>Bonus Defense: {bonusDefense}</p>
      </div>
    </div>
  );
}

export default InfoModal;

import React, { useState } from "react";
import "./CardReveal.css";
import Card from "./Card";
import config from "../../config";
import {useGame} from "../../context/GameContext";

const CardReveal = ({ cards, closeModal, backCardImage }) => {
  const { hideNsfw } = useGame();
  const [currentCardIndex, setCurrentCardIndex] = useState(0); // Indice de la carte visible
  const [flippedIndex, setFlippedIndex] = useState(null); // Indice de la carte actuellement retournée
  const [showGrid, setShowGrid] = useState(false); // Passe à la vue "grille" après la révélation

  // Gestion du clic sur une carte
  const handleCardClick = (index) => {
    // Si la carte cliquée est déjà retournée (recto visible)
    if (flippedIndex === index) {
      // Masque la carte et passe à la suivante
      if (currentCardIndex < cards.length - 1) {
        setCurrentCardIndex((prevIndex) => prevIndex + 1); // Passe à la carte suivante
        setFlippedIndex(null); // Réinitialise l'état de retournement
      } else {
        // Si c'était la dernière carte
        setShowGrid(true); // Passe à l’affichage en grille
      }
    } else {
      // Si la carte montre son dos, on la retourne (affiche le recto)
      setFlippedIndex(index);
    }
  };

  return (
    <div className="modal-overlay">
        {!showGrid ? (
          // Affiche les cartes superposées
            <div className="card-container-pile">
              { cards.map((card, index) => (
            <Card
              key={index}
              frontImage={config.IMAGE_BASE_URL + card.evolution_displayed.image}
              backImage={backCardImage}
              altText={card.personnage.name}
              onClick={() => handleCardClick(index)} // Passe l'index au gestionnaire de clic
              isFlipped={index === flippedIndex} // Retourne uniquement la carte active
              isVisible={index === currentCardIndex} // Affiche uniquement la carte actuelle
              isNsfw={card.evolution_displayed.isNsfw && hideNsfw}
            />
          ))}
            </div>
        ) : (
          // Une fois toutes les cartes révélées, on passe à l'affichage en grille
          <div className="card-container-grid">
            {cards.map((card, index) => (
              <div key={index} className="grid-card">
                <img
                  src={config.IMAGE_BASE_URL + card.evolution_displayed.image}
                  alt={card.personnage.name}
                  className="card-image"
                />
              </div>
            ))}
          </div>
        )}

      {/* Bouton pour fermer la modal */}
      <button className="close-button" onClick={closeModal}>
        X
      </button>
    </div>
  );
};

export default CardReveal;

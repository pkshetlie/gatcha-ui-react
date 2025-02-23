import React from "react";
import "./Card.css";

const Card = ({ frontImage, backImage, altText, onClick, isFlipped, isVisible, isNsfw }) => {
  // Cacher la carte si elle n'est pas visible
  if (!isVisible) return null;

  const style = { filter: isNsfw ? 'blur(20px)' : 'none' };
  return (
    <div
      className={`card-container ${isFlipped ? "flipped" : ""}`}
      onClick={onClick}
    >
      {/* Face avant */}
      <div className="card-face card-front">
        <img src={frontImage} alt={altText} className="card-image" style={style} />
      </div>
      {/* Face arrière */}
      <div
        className="card-face card-back"
        style={{ backgroundImage: `url(${backImage})` }}
      ></div>
    </div>
  );
};

export default Card;

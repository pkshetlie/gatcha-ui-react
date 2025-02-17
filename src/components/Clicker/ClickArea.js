import React from 'react';
import { useGame } from '../../context/GameContext';
import './ClickArea.css';

function ClickArea() {
    const { incrementClicks } = useGame();

    return (
        <button className="click-button" onClick={incrementClicks}>
            Click Me!
        </button>
    );
}

export default ClickArea;
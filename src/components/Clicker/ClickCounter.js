import React from 'react';
import { useGame } from '../../context/GameContext';

const ClickCounter = () => {
    const { clicks } = useGame();

    return (
        <div className="click-counter">
            Clicks: {clicks}
        </div>
    );
};

export default ClickCounter;
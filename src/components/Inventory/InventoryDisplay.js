import React from 'react';
import { useGame } from '../../context/GameContext';

const InventoryDisplay = () => {
    const { inventory } = useGame();

    return (
        <div className="inventory-display">
            <h3>Inventory</h3>
            <p>Simple Parchements: {inventory.simple}</p>
            <p>Rare Parchements: {inventory.rare}</p>
            <p>Epic Parchements: {inventory.epic}</p>
        </div>
    );
};

export default InventoryDisplay;
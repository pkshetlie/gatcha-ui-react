import React from 'react';
import { useGame } from '../../context/GameContext';
import config from '../../config';
import './InventoryDisplay.css';

const InventoryDisplay = () => {
  const { inventory } = useGame();

  return (
    <div className="inventory-display">
      <h3>Inventory</h3>
      <div className="inventory-grid">
        { inventory.map((item, idx) => {
          return <div key={idx} className="inventory-item">
            <img
              src={`${config.INVENTORY_IMAGE_BASE_URL}/${item.enum.name}.png`}
              alt={item.name}
              className="inventory-image"
            />
            <div className="inventory-details">
              <p className="inventory-name">{item.name}</p>
              <p className="inventory-count">{item.count}</p>
            </div>
          </div>
        })}
      </div>
    </div>
  );
};


export default InventoryDisplay;

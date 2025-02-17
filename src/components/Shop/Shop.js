import React from 'react';
import { useGame } from '../../context/GameContext';

const Shop = () => {
    const { inventory } = useGame();

    const handleInvocation = (rarity) => {
        // Logique pour invoquer un assistant en utilisant un parchemin de la rareté spécifiée
        // Appeler une fonction du GameContext pour gérer l'invocation côté serveur
        console.log(`Invocation de ${rarity}`);
    };

    return (
        <div className="shop">
            <h3>Shop</h3>
            <p>Simple Parchements: {inventory.simple}</p>
            <button onClick={() => handleInvocation('simple')} disabled={inventory.simple === 0}>
                Invoquer (Simple)
            </button>
            <p>Rare Parchements: {inventory.rare}</p>
            <button onClick={() => handleInvocation('rare')} disabled={inventory.rare === 0}>
                Invoquer (Rare)
            </button>
            <p>Epic Parchements: {inventory.epic}</p>
            <button onClick={() => handleInvocation('epic')} disabled={inventory.epic === 0}>
                Invoquer (Epic)
            </button>
        </div>
    );
};

export default Shop;
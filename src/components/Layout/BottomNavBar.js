import React from 'react';
import { Link } from 'react-router-dom';
import './BottomNavBar.css'; // Importe le fichier CSS pour les styles

function BottomNavBar() {
    return (
        <nav className="bottom-nav">
            <Link to="/">Home</Link>
            <Link to="/shop">Shop</Link>
            <Link to="/inventory">Inventory</Link>
        </nav>
    );
}

export default BottomNavBar;
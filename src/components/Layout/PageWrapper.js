import React from 'react';
import Header from './Header';
import BottomNavBar from './BottomNavBar'; // Importe la barre de navigation

function PageWrapper({ children }) {
    return (
        <div className="page-wrapper">
            <Header />
            <main className="main-content">
                {children}
            </main>
            <BottomNavBar /> {/* Ajoute la barre de navigation en bas */}
        </div>
    );
}

export default PageWrapper;
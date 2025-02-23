import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import SummonPage from './pages/SummonPage';
import InventoryPage from './pages/InventoryPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { GameProvider } from './context/GameContext';

const AppContent = () => {
    const { user } = useAuth();

    return (
        <GameProvider>
            <Routes>
                <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
                <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
                <Route path="/summon" element={user ? <SummonPage /> : <Navigate to="/login" />} />
                <Route path="/inventory" element={user ? <InventoryPage /> : <Navigate to="/login" />} />
            </Routes>
        </GameProvider>
    );
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <AppContent />
            </Router>
        </AuthProvider>
    );
}

export default App;

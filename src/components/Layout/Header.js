import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LogoutButton from '../Auth/LogoutButton';
import { useGame } from '../../context/GameContext';

function Header() {
    const { user } = useAuth();
    const { showNsfw, toggleNsfw } = useGame();

    return (
        <header className="header">
            <h1>Clicker Game</h1>
            {user ? (
                <div className="header-right">
                    <span>Welcome, {user.username}</span>
                    <button onClick={toggleNsfw}>{showNsfw ? 'Hide NSFW' : 'Show NSFW'}</button>
                    <LogoutButton />
                </div>
            ) : (
                <Link to="/login">Login</Link>
            )}
        </header>
    );
}

export default Header;
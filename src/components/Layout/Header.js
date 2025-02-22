import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LogoutButton from '../Auth/LogoutButton';
import { useGame } from '../../context/GameContext';
import './Header.css';

function Header() {
    const { user } = useAuth();
    const { hideNsfw, toggleNsfw } = useGame(); // Capturer les états depuis GameContext

    return (
      <header className="header">
          <h1>Clicker Game</h1>
          {user ? (
            <div className="header-right">
                <span>Welcome, {user.username}</span>
                <div className="nsfw-toggle">
                    <label className="switch">
                        <input
                          type="checkbox"
                          checked={hideNsfw}
                          onChange={toggleNsfw} // Appelle `toggleNsfw` lorsqu'on clique sur le switch
                        />
                        <span className="slider"></span>
                    </label>
                    <span>{hideNsfw ? 'NSFW enabled' : 'NSFW disabled'}</span>
                </div>
                <LogoutButton />
            </div>
          ) : (
            <Link to="/login">Login</Link>
          )}
      </header>

    );
}

export default Header;

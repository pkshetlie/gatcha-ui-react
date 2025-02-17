import React from 'react';
import LoginForm from '../components/Auth/LoginForm';
import './Login.css'; // Import du fichier CSS

function Login() {
    return (
        React.createElement('div', { className: 'login-page' },
            React.createElement('div', { className: 'login-container' },
                React.createElement('h1', null, 'Welcome!'),
                React.createElement('p', { className: 'login-description' }, 'Connect to start playing.'),
                React.createElement(LoginForm, null)
            )
        )
    );
}

export default Login;
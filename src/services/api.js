import config from '../config';

const retryRequestWithNewToken = async (originalRequest, refreshToken) => {
    // Appeler l'API pour rafraîchir le token
    const response = await fetch(`${config.API_BASE_URL}/token/refresh`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) throw new Error('Failed to refresh access token');

    const data = await response.json();
    localStorage.setItem('token', data.token);

    // Met à jour l'autorisation pour la nouvelle requête
    originalRequest.headers['Authorization'] = `Bearer ${data.token}`;

    return fetch(originalRequest.url, originalRequest); // Relance la requête
};

const api = {
    async get(endpoint, token, refreshToken) {
        const originalRequest = {
            url: `${config.API_BASE_URL}${endpoint}`,
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
        };


        const response = await fetch(originalRequest.url, originalRequest);
        if (response.status === 401) {
            // Token expiré, tente de rafraîchir puis relancer
            return retryRequestWithNewToken(originalRequest, refreshToken);
        }

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        return response.json();
    },

    async post(endpoint, data, token) {
        const response = await fetch(`${config.API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Authorization': token ? `Bearer ${token}` : undefined, // N'incluez le token que s'il est fourni
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            try {
                const errorData = await response.json();
                throw new Error(`API Error: ${response.status} - ${errorData.message || 'Unknown error'}`);
            } catch (jsonError) {
                throw new Error(`API Error: ${response.status} - Could not parse error response`);
            }
        }
        return response.json();
    },

    async put(endpoint, data, token) {
        const response = await fetch(`${config.API_BASE_URL}${endpoint}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        return response.json();
    },

    async delete(endpoint, token) {
        const response = await fetch(`${config.API_BASE_URL}${endpoint}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        return response.json();
    },
};

export default api;

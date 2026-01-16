const API_URL = 'http://localhost:3000';

async function checkAuth() {
    try {
        const response = await fetch(`${API_URL}/api/login/verify`, {
            credentials: 'include'
        });
        
        if (!response.ok) {
            window.location.href = '/pages/login.html';
            return false;
        }
        
        return true;
    } catch (error) {
        window.location.href = '/pages/login.html';
        return false;
    }
}

async function logout() {
    try {
        await fetch(`${API_URL}/api/logout`, {
            method: 'POST',
            credentials: 'include'
        });
        window.location.href = '/pages/login.html';
    } catch (error) {
        console.error('Logout error:', error);
    }
}

if (window.location.pathname.includes('dashboard.html')) {
    checkAuth();
}

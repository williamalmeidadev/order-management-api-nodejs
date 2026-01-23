const API_URL = 'http://localhost:3000';

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');
    const submitButton = e.target.querySelector('button[type="submit"]');
    
    errorMessage.classList.remove('show');
    errorMessage.textContent = '';
    submitButton.disabled = true;
    submitButton.textContent = 'Signing in...';
    
    try {
        const response = await fetch(`${API_URL}/api/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            window.location.href = '/dashboard';
        } else {
            errorMessage.textContent = data.message || 'Login failed';
            errorMessage.classList.add('show');
        }
    } catch (error) {
        errorMessage.textContent = 'Connection error. Please try again.';
        errorMessage.classList.add('show');
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Sign In';
    }
});

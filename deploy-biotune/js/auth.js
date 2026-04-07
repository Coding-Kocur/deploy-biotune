// BioTune Authentication System - Browser-based Backend
// Uses localStorage to simulate database

class AuthSystem {
    constructor() {
        this.storageKey = 'biotune_users';
        this.sessionKey = 'biotune_session';
        this.initializeStorage();
    }

    initializeStorage() {
        if (!localStorage.getItem(this.storageKey)) {
            localStorage.setItem(this.storageKey, JSON.stringify([]));
        }
    }

    // Get all users from storage
    getUsers() {
        return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    }

    // Save users to storage
    saveUsers(users) {
        localStorage.setItem(this.storageKey, JSON.stringify(users));
    }

    // Get current session
    getCurrentUser() {
        const session = localStorage.getItem(this.sessionKey);
        return session ? JSON.parse(session) : null;
    }

    // Register new user
    register(email, password, name = '') {
        const users = this.getUsers();

        // Check if user already exists
        if (users.find(u => u.email === email)) {
            throw new Error('Użytkownik z tym emailem już istnieje');
        }

        // Validate email
        if (!this.validateEmail(email)) {
            throw new Error('Nieprawidłowy adres email');
        }

        // Validate password
        if (password.length < 6) {
            throw new Error('Hasło musi mieć minimum 6 znaków');
        }

        // Create new user
        const user = {
            id: Date.now().toString(),
            email,
            password: this.hashPassword(password), // Simple hash (NOT secure for production!)
            name: name || email.split('@')[0],
            createdAt: new Date().toISOString(),
            provider: 'email'
        };

        users.push(user);
        this.saveUsers(users);

        // Auto login after registration
        this.createSession(user);

        return user;
    }

    // Login with email/password
    login(email, password) {
        const users = this.getUsers();
        const user = users.find(u => u.email === email);

        if (!user) {
            throw new Error('Nie znaleziono użytkownika');
        }

        if (user.password !== this.hashPassword(password)) {
            throw new Error('Nieprawidłowe hasło');
        }

        this.createSession(user);
        return user;
    }

    // OAuth Login (Simulated)
    oauthLogin(provider, userData) {
        const users = this.getUsers();
        let user = users.find(u => u.email === userData.email);

        if (!user) {
            // Create new user from OAuth data
            user = {
                id: Date.now().toString(),
                email: userData.email,
                name: userData.name || userData.email.split('@')[0],
                avatar: userData.picture || null,
                createdAt: new Date().toISOString(),
                provider: provider
            };
            users.push(user);
            this.saveUsers(users);
        }

        this.createSession(user);
        return user;
    }

    // Logout
    logout() {
        localStorage.removeItem(this.sessionKey);
        window.location.href = 'index.html';
    }

    // Create session
    createSession(user) {
        const sessionData = {
            id: user.id,
            email: user.email,
            name: user.name,
            avatar: user.avatar || null,
            provider: user.provider,
            loginTime: new Date().toISOString()
        };
        localStorage.setItem(this.sessionKey, JSON.stringify(sessionData));
    }

    // Check if user is logged in
    isLoggedIn() {
        return this.getCurrentUser() !== null;
    }

    // Simple password hash (NOT SECURE - for demo only!)
    hashPassword(password) {
        // In production use bcrypt or similar!
        return btoa(password + 'biotune_salt');
    }

    // Email validation
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Password reset (simulate sending email)
    requestPasswordReset(email) {
        const users = this.getUsers();
        const user = users.find(u => u.email === email);

        if (!user) {
            throw new Error('Nie znaleziono użytkownika z tym adresem email');
        }

        // In production, this would send an email
        console.log(`Password reset link sent to ${email}`);
        return true;
    }
}

// Initialize auth system
const authSystem = new AuthSystem();

// Simulated Facebook OAuth
function loginWithFacebook() {
    // In production, this would use Facebook SDK
    const mockFacebookUser = {
        email: 'facebook.user@example.com',
        name: 'Facebook User',
        picture: 'https://via.placeholder.com/150'
    };

    try {
        authSystem.oauthLogin('facebook', mockFacebookUser);
        alert('Zalogowano przez Facebook!');
        window.location.href = 'index.html';
    } catch (error) {
        alert('Błąd logowania: ' + error.message);
    }
}

// Simulated Google OAuth
function loginWithGoogle() {
    // In production, this would use Google Identity Services
    const mockGoogleUser = {
        email: 'google.user@example.com',
        name: 'Google User',
        picture: 'https://via.placeholder.com/150'
    };

    try {
        authSystem.oauthLogin('google', mockGoogleUser);
        alert('Zalogowano przez Google!');
        window.location.href = 'index.html';
    } catch (error) {
        alert('Błąd logowania: ' + error.message);
    }
}

// Update UI based on login status
function updateAuthUI() {
    const user = authSystem.getCurrentUser();
    const accountIcon = document.getElementById('account-icon');
    const accountMenu = document.getElementById('account-menu');

    if (user && accountMenu) {
        // User is logged in - show user info
        accountMenu.innerHTML = `
            <div class="user-info">
                <div class="user-avatar">${user.name.charAt(0).toUpperCase()}</div>
                <div class="flex-1">
                    <p class="font-bold text-sm text-black dark:text-white">${user.name}</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">${user.email}</p>
                </div>
            </div>
            <div class="space-y-2">
                <a href="#" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 rounded">
                    Moje zamówienia
                </a>
                <a href="#" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 rounded">
                    Ustawienia konta
                </a>
                <button onclick="authSystem.logout()" class="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-white/10 rounded">
                    Wyloguj się
                </button>
            </div>
        `;
    }
}

// Export for global use
window.authSystem = authSystem;
window.loginWithFacebook = loginWithFacebook;
window.loginWithGoogle = loginWithGoogle;
window.updateAuthUI = updateAuthUI;

// Update UI on page load
document.addEventListener('DOMContentLoaded', updateAuthUI);

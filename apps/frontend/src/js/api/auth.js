import { apiClient } from './client.js';

let currentUser = null;

export const auth = {
    init() {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            try {
                currentUser = JSON.parse(savedUser);
                return true;
            } catch (e) {
                this.logout();
                return false;
            }
        }
        return false;
    },

    getUser() {
        return currentUser;
    },

    isAdmin() {
        return currentUser && currentUser.role === 'Administrador';
    },

    async login(email, password) {
        try {
            const user = await apiClient.post('/login', { email, password });
            currentUser = user;
            localStorage.setItem('user', JSON.stringify(user));
            return { success: true, user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    logout() {
        currentUser = null;
        localStorage.removeItem('user');
    }
};


import { User } from '../types';

// In a real app, this would be a secure backend service.
// For this prototype, we use localStorage to simulate a user database and session management.

const USERS_KEY = 'vesta-users';
const SESSION_KEY = 'vesta-session';

// Initialize with a default user if none exist
const initializeUsers = () => {
    if (!localStorage.getItem(USERS_KEY)) {
        const defaultUsers = [
            { name: 'John Doe', email: 'john.doe@example.com', password: 'password123' },
        ];
        localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
    }
};

initializeUsers();

export const signUp = (name: string, email: string, password: string): Promise<User> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => { // Simulate network delay
            const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
            if (users.find((user: any) => user.email === email)) {
                reject(new Error("An account with this email already exists."));
                return;
            }

            if (password.length < 8) {
                reject(new Error("Password must be at least 8 characters long."));
                return;
            }

            const newUser = { name, email, password }; // In a real app, hash the password
            users.push(newUser);
            localStorage.setItem(USERS_KEY, JSON.stringify(users));

            const sessionUser = { name, email };
            localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
            resolve(sessionUser);
        }, 500);
    });
};

export const login = (email: string, password: string): Promise<User> => {
     return new Promise((resolve, reject) => {
        setTimeout(() => { // Simulate network delay
            const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
            const user = users.find((u: any) => u.email === email);

            if (!user || user.password !== password) {
                reject(new Error("Invalid email or password."));
                return;
            }

            const sessionUser = { name: user.name, email: user.email };
            localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
            resolve(sessionUser);
        }, 500);
    });
};

export const logout = (): void => {
    localStorage.removeItem(SESSION_KEY);
};

export const getCurrentUser = (): User | null => {
    const session = localStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
};

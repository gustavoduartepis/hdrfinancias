import { jsx as _jsx } from "react/jsx-runtime";
import React, { createContext, useContext, useState, useEffect } from 'react';
const AuthContext = createContext(undefined);
// Default users for demonstration
const defaultUsers = [
    {
        id: '1',
        email: 'admin@audiovisual.com',
        password: 'admin123',
        name: 'Administrador',
        role: 'admin'
    },
    {
        id: '2',
        email: 'user@audiovisual.com',
        password: 'user123',
        name: 'Usuário Comum',
        role: 'user'
    }
];
// Get users from localStorage or use default users
const getStoredUsers = () => {
    const stored = localStorage.getItem('audiovisual_users');
    if (stored) {
        try {
            return JSON.parse(stored);
        }
        catch {
            return defaultUsers;
        }
    }
    return defaultUsers;
};
// Save users to localStorage
const saveUsers = (users) => {
    localStorage.setItem('audiovisual_users', JSON.stringify(users));
};
// Initialize users from storage
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    useEffect(() => {
        // Initialize default users if not exists
        const stored = localStorage.getItem('audiovisual_users');
        if (!stored) {
            saveUsers(defaultUsers);
        }
        // Check if user is logged in on app start
        const savedUser = localStorage.getItem('audiovisual_user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);
    const login = async (email, password) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Get fresh users from storage
        const currentUsers = getStoredUsers();
        const foundUser = currentUsers.find(u => u.email === email && u.password === password);
        if (foundUser) {
            const { password: _, ...userWithoutPassword } = foundUser;
            setUser(userWithoutPassword);
            localStorage.setItem('audiovisual_user', JSON.stringify(userWithoutPassword));
            return true;
        }
        return false;
    };
    const register = async (email, password, name, role = 'user') => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Get fresh users from storage
        const currentUsers = getStoredUsers();
        // Check if user already exists
        const existingUser = currentUsers.find(u => u.email === email);
        if (existingUser) {
            return false;
        }
        const newUser = {
            id: Date.now().toString(),
            email,
            name,
            role
        };
        // Add new user to the list and save to localStorage
        const updatedUsers = [...currentUsers, { ...newUser, password }];
        saveUsers(updatedUsers);
        setUser(newUser);
        localStorage.setItem('audiovisual_user', JSON.stringify(newUser));
        return true;
    };
    const logout = () => {
        setUser(null);
        localStorage.removeItem('audiovisual_user');
    };
    const value = {
        user,
        login,
        logout,
        register,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin'
    };
    return (_jsx(AuthContext.Provider, { value: value, children: children }));
};
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

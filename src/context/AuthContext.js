import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkUserSession();
    }, []);

    const checkUserSession = async () => {
        try {
            const userData = await AsyncStorage.getItem('@notes_user');
            if (userData) {
                setUser(JSON.parse(userData));
            }
        } catch (e) {
            console.error('Failed to load user session', e);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        // In a real app, you'd verify credentials against a backend
        // For this local app, if an account exists in storage, we check it
        try {
            const existingUsersStr = await AsyncStorage.getItem('@notes_all_users');
            const existingUsers = existingUsersStr ? JSON.parse(existingUsersStr) : [];

            const foundUser = existingUsers.find(u => u.email === email && u.password === password);

            if (foundUser) {
                // Strip password before saving to active session
                const sessionUser = { id: foundUser.id, name: foundUser.name, email: foundUser.email };
                await AsyncStorage.setItem('@notes_user', JSON.stringify(sessionUser));
                setUser(sessionUser);
                return { success: true };
            } else {
                return { success: false, message: 'Invalid email or password.' };
            }
        } catch (e) {
            return { success: false, message: 'Login failed.' };
        }
    };

    const signup = async (name, email, password) => {
        try {
            const existingUsersStr = await AsyncStorage.getItem('@notes_all_users');
            const existingUsers = existingUsersStr ? JSON.parse(existingUsersStr) : [];

            if (existingUsers.some(u => u.email === email)) {
                return { success: false, message: 'Account with this email already exists.' };
            }

            const newUser = { id: Date.now().toString(), name, email, password };

            // Save to "database" of users
            existingUsers.push(newUser);
            await AsyncStorage.setItem('@notes_all_users', JSON.stringify(existingUsers));

            // Automatically log them in (save to active session)
            const sessionUser = { id: newUser.id, name: newUser.name, email: newUser.email };
            await AsyncStorage.setItem('@notes_user', JSON.stringify(sessionUser));
            setUser(sessionUser);

            return { success: true };
        } catch (e) {
            return { success: false, message: 'Signup failed.' };
        }
    };

    const updateProfile = async (newName, newEmail) => {
        if (!user) return { success: false, message: 'Not logged in.' };

        try {
            const existingUsersStr = await AsyncStorage.getItem('@notes_all_users');
            let existingUsers = existingUsersStr ? JSON.parse(existingUsersStr) : [];

            // Check if email already exists for a *different* user
            if (newEmail !== user.email && existingUsers.some(u => u.email === newEmail)) {
                return { success: false, message: 'Email is already in use by another account.' };
            }

            // Update user in "database"
            existingUsers = existingUsers.map(u => {
                if (u.id === user.id) {
                    return { ...u, name: newName, email: newEmail };
                }
                return u;
            });
            await AsyncStorage.setItem('@notes_all_users', JSON.stringify(existingUsers));

            // Update active session
            const updatedSession = { ...user, name: newName, email: newEmail };
            await AsyncStorage.setItem('@notes_user', JSON.stringify(updatedSession));
            setUser(updatedSession);

            return { success: true };
        } catch (e) {
            console.error('Failed to update profile', e);
            return { success: false, message: 'Failed to update profile.' };
        }
    };

    const logout = async () => {
        try {
            await AsyncStorage.removeItem('@notes_user');
            setUser(null);
        } catch (e) {
            console.error('Failed to log out', e);
        }
    };

    const value = {
        user,
        loading,
        login,
        signup,
        updateProfile,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

import { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';

export const useNotes = () => {
    const { user } = useAuth();
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(false);

    // Use a unique storage key per user so data doesn't mix
    const storageKey = user ? `@notes_data_${user.id}` : null;

    const loadNotes = useCallback(async () => {
        if (!storageKey) return;
        setLoading(true);
        try {
            const storedNotes = await AsyncStorage.getItem(storageKey);
            if (storedNotes) {
                setNotes(JSON.parse(storedNotes));
            } else {
                setNotes([]);
            }
        } catch (e) {
            console.error('Failed to load notes', e);
        } finally {
            setLoading(false);
        }
    }, [storageKey]);

    const addNote = async (title, content) => {
        if (!storageKey) return;
        try {
            const newNote = {
                id: Date.now().toString(),
                title: title.trim(),
                content: content.trim(),
                createdAt: new Date().toISOString(),
            };
            const updatedNotes = [newNote, ...notes];
            await AsyncStorage.setItem(storageKey, JSON.stringify(updatedNotes));
            setNotes(updatedNotes);
            return { success: true };
        } catch (e) {
            console.error('Failed to add note', e);
            return { success: false };
        }
    };

    const deleteNote = async (noteId) => {
        if (!storageKey) return;
        try {
            const updatedNotes = notes.filter((note) => note.id !== noteId);
            await AsyncStorage.setItem(storageKey, JSON.stringify(updatedNotes));
            setNotes(updatedNotes);
            return { success: true };
        } catch (e) {
            console.error('Failed to delete note', e);
            return { success: false };
        }
    };

    const updateNote = async (noteId, newTitle, newContent) => {
        if (!storageKey) return;
        try {
            const updatedNotes = notes.map((note) => {
                if (note.id === noteId) {
                    return {
                        ...note,
                        title: newTitle.trim(),
                        content: newContent.trim(),
                        // Intentionally not updating createdAt so it retains original date, 
                        // or we could add an updatedAt field here
                    };
                }
                return note;
            });
            await AsyncStorage.setItem(storageKey, JSON.stringify(updatedNotes));
            setNotes(updatedNotes);
            return { success: true };
        } catch (e) {
            console.error('Failed to update note', e);
            return { success: false };
        }
    };

    return {
        notes,
        loading,
        loadNotes,
        addNote,
        updateNote,
        deleteNote,
    };
};

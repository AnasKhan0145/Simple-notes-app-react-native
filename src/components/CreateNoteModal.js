import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, Modal, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useNotes } from '../context/useNotes';

export default function CreateNoteModal({ visible, onCancel, existingNote }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const { addNote, updateNote } = useNotes();

    useEffect(() => {
        if (visible) {
            setTitle(existingNote?.title || '');
            setContent(existingNote?.content || '');
        }
    }, [visible, existingNote]);

    const handleSave = async () => {
        if (!title.trim() || !content.trim()) {
            Alert.alert('Hold on', 'Please enter both a title and some content for your note.');
            return;
        }

        let result;
        if (existingNote) {
            result = await updateNote(existingNote.id, title, content);
        } else {
            result = await addNote(title, content);
        }

        if (result.success) {
            onCancel(); // Close modal on success
        } else {
            Alert.alert('Error', 'Failed to save note. Please try again.');
        }
    };

    return (
        <Modal visible={visible} animationType="fade" transparent={true}>
            <KeyboardAvoidingView
                style={styles.modalOverlay}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <View style={styles.inputContainer}>
                    <Text style={styles.headerTitle}>
                        {existingNote ? 'Edit Note' : 'New Note'}
                    </Text>

                    {existingNote && (
                        <View style={styles.previousNoteContainer}>
                            <Text style={styles.previousLabel}>Previous Title:</Text>
                            <Text style={styles.previousText}>{existingNote.title}</Text>
                        </View>
                    )}

                    <Text style={styles.inputLabel}>Title</Text>
                    <TextInput
                        style={styles.titleInput}
                        placeholder="Note Title"
                        placeholderTextColor="#999999"
                        value={title}
                        onChangeText={setTitle}
                        maxLength={60}
                    />

                    <Text style={styles.inputLabel}>Content</Text>
                    <TextInput
                        style={styles.contentInput}
                        placeholder="Start typing your note here..."
                        placeholderTextColor="#999999"
                        value={content}
                        onChangeText={setContent}
                        multiline
                        textAlignVertical="top"
                    />

                    <View style={styles.buttonContainer}>
                        <Pressable style={[styles.button, styles.cancelButton]} onPress={onCancel}>
                            <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
                        </Pressable>
                        <Pressable style={[styles.button, styles.saveButton]} onPress={handleSave}>
                            <Text style={[styles.buttonText, styles.saveButtonText]}>Save</Text>
                        </Pressable>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 20,
    },
    inputContainer: {
        width: Platform.OS === 'web' ? '50%' : '90%', // Use 50% for web, 90% for mobile
        backgroundColor: '#FFFFFF',
        padding: 24,
        borderRadius: 24,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 16,
        elevation: 10,
        maxHeight: '80%', // Ensure it doesn't grow taller than screen
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 20,
        textAlign: 'center',
    },
    previousNoteContainer: {
        backgroundColor: '#F5F6F8',
        padding: 12,
        borderRadius: 8,
        marginBottom: 20,
        borderLeftWidth: 4,
        borderLeftColor: '#A0A0A0',
    },
    previousLabel: {
        fontSize: 12,
        color: '#666666',
        marginBottom: 4,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    previousText: {
        fontSize: 15,
        color: '#333333',
        fontStyle: 'italic',
    },
    inputLabel: {
        fontSize: 14,
        color: '#1A1A1A',
        fontWeight: '600',
        marginBottom: 8,
    },
    titleInput: {
        borderWidth: 1,
        borderColor: '#EAEAEC',
        backgroundColor: '#F5F6F8',
        color: '#1A1A1A',
        padding: 16,
        borderRadius: 12,
        fontSize: 16,
        marginBottom: 20,
    },
    contentInput: {
        borderWidth: 1,
        borderColor: '#EAEAEC',
        backgroundColor: '#F5F6F8',
        color: '#1A1A1A',
        padding: 16,
        borderRadius: 12,
        fontSize: 16,
        height: 120, // Give it some height
    },
    buttonContainer: {
        marginTop: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        flex: 1,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginHorizontal: 8,
    },
    cancelButton: {
        backgroundColor: '#F5F6F8',
    },
    cancelButtonText: {
        color: '#333333',
    },
    saveButton: {
        backgroundColor: '#2D6CDF',
    },
    saveButtonText: {
        color: '#FFFFFF',
    },
    buttonText: {
        fontWeight: '600',
        fontSize: 16,
    }
});

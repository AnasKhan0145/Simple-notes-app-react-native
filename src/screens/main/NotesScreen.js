import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, SafeAreaView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNotes } from '../../context/useNotes';
import { useAuth } from '../../context/AuthContext';
import CreateNoteModal from '../../components/CreateNoteModal';

export default function NotesScreen({ navigation }) {
    const { notes, loading, loadNotes, deleteNote } = useNotes();
    const { user } = useAuth();

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedNote, setSelectedNote] = useState(null);

    useEffect(() => {
        // Load notes when screen mounts
        const unsubscribe = navigation.addListener('focus', () => {
            loadNotes();
        });
        return unsubscribe;
    }, [navigation, loadNotes]);

    const handleOpenModal = (note = null) => {
        setSelectedNote(note);
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
        setSelectedNote(null);
    };

    const renderNoteOptions = (noteId) => {
        deleteNote(noteId);
    };

    const NoteCard = ({ item }) => {
        // Format date nicely
        const date = new Date(item.createdAt);
        const dateString = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

        return (
            <Pressable
                style={styles.card}
                onPress={() => handleOpenModal(item)}
            >
                <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
                    <Pressable hitSlop={10} onPress={() => renderNoteOptions(item.id)}>
                        <Ionicons name="trash-outline" size={20} color="#FF4444" />
                    </Pressable>
                </View>
                <Text style={styles.cardContent} numberOfLines={3}>{item.content}</Text>
                <Text style={styles.cardDate}>{dateString}</Text>
            </Pressable>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>My Notes</Text>
                <Text style={styles.headerSubtitle}>Welcome back, {user?.name.split(' ')[0]}</Text>
            </View>

            {loading ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#2D6CDF" />
                </View>
            ) : notes.length === 0 ? (
                <View style={styles.centerContainer}>
                    <Ionicons name="document-text-outline" size={64} color="#CCCCCC" />
                    <Text style={styles.emptyText}>You don't have any notes yet.</Text>
                </View>
            ) : (
                <FlatList
                    data={notes}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <NoteCard item={item} />}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            )}

            <Pressable
                style={styles.fab}
                onPress={() => handleOpenModal()}
            >
                <Ionicons name="add" size={32} color="#FFFFFF" />
            </Pressable>

            <CreateNoteModal
                visible={isModalVisible}
                onCancel={handleCloseModal}
                existingNote={selectedNote}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F8FA',
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#EAEAEC',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#666666',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        marginTop: 16,
        fontSize: 16,
        color: '#666666',
    },
    listContent: {
        padding: 16,
        paddingBottom: 100, // space for FAB
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 10,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#EAEAEC',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    cardTitle: {
        flex: 1,
        fontSize: 18,
        fontWeight: '700',
        color: '#1A1A1A',
        marginRight: 10,
    },
    cardContent: {
        fontSize: 15,
        lineHeight: 22,
        color: '#4A4A4A',
        marginBottom: 16,
    },
    cardDate: {
        fontSize: 12,
        color: '#999999',
        fontWeight: '500',
        textAlign: 'right',
    },
    fab: {
        position: 'absolute',
        bottom: 30,
        right: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#2D6CDF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#2D6CDF',
        shadowOpacity: 0.4,
        shadowOffset: { width: 0, height: 6 },
        shadowRadius: 12,
        elevation: 8,
    }
});

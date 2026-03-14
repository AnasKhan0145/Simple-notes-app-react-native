import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Pressable, TextInput, Modal, Alert } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';

export default function ProfileScreen() {
    const { user, logout, updateProfile } = useAuth();

    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editName, setEditName] = useState('');
    const [editEmail, setEditEmail] = useState('');

    const openEditModal = () => {
        setEditName(user?.name || '');
        setEditEmail(user?.email || '');
        setIsEditModalVisible(true);
    };

    const handleSaveProfile = async () => {
        if (!editName.trim() || !editEmail.trim()) {
            Alert.alert('Error', 'Name and email cannot be empty.');
            return;
        }
        const result = await updateProfile(editName.trim(), editEmail.trim());
        if (result.success) {
            setIsEditModalVisible(false);
        } else {
            Alert.alert('Error', result.message);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Profile</Text>
            </View>

            <View style={styles.profileSection}>
                <View style={styles.avatarContainer}>
                    <Text style={styles.avatarText}>
                        {user?.name ? user.name.charAt(0).toUpperCase() : '?'}
                    </Text>
                </View>
                <View style={styles.profileInfo}>
                    <Text style={styles.name}>{user?.name || 'Guest User'}</Text>
                    <Text style={styles.email}>{user?.email || 'No email provided'}</Text>
                </View>
                <Pressable style={styles.editBtn} onPress={openEditModal}>
                    <MaterialIcons name="edit" size={20} color="#2D6CDF" />
                </Pressable>
            </View>

            <View style={styles.spacer} />

            <View style={styles.menuContainer}>
                <Pressable style={styles.logoutBtn} onPress={logout}>
                    <Ionicons name="log-out-outline" size={24} color="#FF4444" />
                    <Text style={styles.logoutText}>Log Out</Text>
                </Pressable>
            </View>

            {/* Edit Profile Modal */}
            <Modal visible={isEditModalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Edit Personal Details</Text>

                        <Text style={styles.inputLabel}>Full Name</Text>
                        <TextInput
                            style={styles.input}
                            value={editName}
                            onChangeText={setEditName}
                            placeholder="Enter your name"
                            autoCapitalize="words"
                        />

                        <Text style={styles.inputLabel}>Email Address</Text>
                        <TextInput
                            style={styles.input}
                            value={editEmail}
                            onChangeText={setEditEmail}
                            placeholder="Enter your email"
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />

                        <View style={styles.modalButtons}>
                            <Pressable
                                style={[styles.modalBtn, styles.cancelBtn]}
                                onPress={() => setIsEditModalVisible(false)}
                            >
                                <Text style={styles.cancelBtnText}>Cancel</Text>
                            </Pressable>
                            <Pressable
                                style={[styles.modalBtn, styles.saveBtn]}
                                onPress={handleSaveProfile}
                            >
                                <Text style={styles.saveBtnText}>Save</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
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
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 24,
        backgroundColor: '#FFFFFF',
        marginTop: 20,
        marginHorizontal: 16,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 10,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#EAEAEC',
    },
    avatarContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#2D6CDF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    avatarText: {
        fontSize: 28,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    profileInfo: {
        flex: 1,
    },
    name: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 4,
    },
    email: {
        fontSize: 14,
        color: '#666666',
    },
    spacer: {
        flex: 1,
    },
    menuContainer: {
        padding: 24,
        paddingBottom: 40,
    },
    logoutBtn: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#FF4444',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 12,
        elevation: 2,
        borderWidth: 1,
        borderColor: 'rgba(255, 68, 68, 0.2)',
    },
    logoutText: {
        color: '#FF4444',
        fontSize: 18,
        fontWeight: '600',
        marginLeft: 12,
    },
    editBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F7F8FA',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 20,
    },
    modalContent: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 24,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 16,
        elevation: 10,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 24,
        textAlign: 'center',
    },
    inputLabel: {
        fontSize: 14,
        color: '#666666',
        fontWeight: '600',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#F5F6F8',
        borderWidth: 1,
        borderColor: '#EAEAEC',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: '#1A1A1A',
        marginBottom: 20,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
    },
    modalBtn: {
        flex: 1,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginHorizontal: 8,
    },
    cancelBtn: {
        backgroundColor: '#F5F6F8',
    },
    cancelBtnText: {
        color: '#333333',
        fontSize: 16,
        fontWeight: '600',
    },
    saveBtn: {
        backgroundColor: '#2D6CDF',
    },
    saveBtnText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    }
});

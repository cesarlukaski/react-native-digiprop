import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Switch,
    Alert,
    Modal,
    Pressable
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

const Settings = ({ onNavigateBack }) => {
    const { logout } = useAuth();
    const [settings, setSettings] = useState({
        sounds: true,
        notifications: true,
        termsOfService: true,
        privacyPolicy: true
    });

    const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);

    const toggleSetting = (setting) => {
        setSettings({
            ...settings,
            [setting]: !settings[setting]
        });
    };

    const handleGeneralSettings = () => {
        Alert.alert('General Settings', 'This feature will be implemented in a future update.');
    };

    const handleAbout = () => {
        Alert.alert('About', 'DigiProp v1.0.0\n\nA property management application.');
    };

    const handleLicense = () => {
        Alert.alert('License', 'This application is licensed under the terms of service agreement.');
    };

    const handleDeleteAccount = () => {
        setShowDeleteAccountModal(true);
    };

    const confirmDeleteAccount = () => {
        setShowDeleteAccountModal(false);

        // In a real app, this would call an API to delete the account
        Alert.alert(
            'Account Deleted',
            'Your account has been successfully deleted.',
            [
                {
                    text: 'OK',
                    onPress: () => {
                        // Logout will automatically redirect to login screen
                        // because of the conditional rendering in App.tsx
                        logout();
                    }
                }
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onNavigateBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Settings</Text>
                <View style={styles.headerRight} />
            </View>

            <ScrollView style={styles.scrollView}>
                {/* Settings List */}
                <View style={styles.settingsContainer}>
                    {/* General Settings */}
                    <TouchableOpacity
                        style={styles.settingItem}
                        onPress={handleGeneralSettings}
                    >
                        <Text style={styles.settingText}>General Settings</Text>
                        <Ionicons name="chevron-forward" size={20} color="#888" />
                    </TouchableOpacity>

                    {/* Sounds */}
                    <View style={styles.settingItem}>
                        <Text style={styles.settingText}>Sounds</Text>
                        <Switch
                            value={settings.sounds}
                            onValueChange={() => toggleSetting('sounds')}
                            trackColor={{ false: '#ddd', true: '#4f46e5' }}
                            thumbColor="#fff"
                        />
                    </View>

                    {/* Notifications */}
                    <View style={styles.settingItem}>
                        <Text style={styles.settingText}>Notification</Text>
                        <Switch
                            value={settings.notifications}
                            onValueChange={() => toggleSetting('notifications')}
                            trackColor={{ false: '#ddd', true: '#4f46e5' }}
                            thumbColor="#fff"
                        />
                    </View>

                    {/* About */}
                    <TouchableOpacity
                        style={styles.settingItem}
                        onPress={handleAbout}
                    >
                        <Text style={styles.settingText}>About</Text>
                        <Ionicons name="chevron-forward" size={20} color="#888" />
                    </TouchableOpacity>

                    {/* Sounds (duplicate in the image) */}
                    <View style={styles.settingItem}>
                        <Text style={styles.settingText}>Sounds</Text>
                        <Switch
                            value={settings.sounds}
                            onValueChange={() => toggleSetting('sounds')}
                            trackColor={{ false: '#ddd', true: '#4f46e5' }}
                            thumbColor="#fff"
                        />
                    </View>

                    {/* Notifications (duplicate in the image) */}
                    <View style={styles.settingItem}>
                        <Text style={styles.settingText}>Notification</Text>
                        <Switch
                            value={settings.notifications}
                            onValueChange={() => toggleSetting('notifications')}
                            trackColor={{ false: '#ddd', true: '#4f46e5' }}
                            thumbColor="#fff"
                        />
                    </View>

                    {/* License */}
                    <TouchableOpacity
                        style={styles.settingItem}
                        onPress={handleLicense}
                    >
                        <Text style={styles.settingText}>License</Text>
                        <Ionicons name="chevron-forward" size={20} color="#888" />
                    </TouchableOpacity>

                    {/* Terms of Service */}
                    <View style={styles.settingItem}>
                        <Text style={styles.settingText}>Terms of Service</Text>
                        <Switch
                            value={settings.termsOfService}
                            onValueChange={() => toggleSetting('termsOfService')}
                            trackColor={{ false: '#ddd', true: '#4f46e5' }}
                            thumbColor="#fff"
                        />
                    </View>

                    {/* Privacy Policy */}
                    <View style={styles.settingItem}>
                        <Text style={styles.settingText}>Privacy Policy</Text>
                        <Switch
                            value={settings.privacyPolicy}
                            onValueChange={() => toggleSetting('privacyPolicy')}
                            trackColor={{ false: '#ddd', true: '#4f46e5' }}
                            thumbColor="#fff"
                        />
                    </View>
                </View>

                {/* Delete Account */}
                <TouchableOpacity
                    style={styles.deleteAccountButton}
                    onPress={handleDeleteAccount}
                >
                    <Text style={styles.deleteAccountText}>Delete Account</Text>
                </TouchableOpacity>
            </ScrollView>

            {/* Delete Account Confirmation Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={showDeleteAccountModal}
                onRequestClose={() => setShowDeleteAccountModal(false)}
            >
                <Pressable
                    style={styles.modalOverlay}
                    onPress={() => setShowDeleteAccountModal(false)}
                >
                    <View style={styles.deleteModalContainer}>
                        <View style={styles.deleteModalContent}>
                            <Text style={styles.deleteModalTitle}>Delete Account</Text>
                            <Text style={styles.deleteModalMessage}>
                                Are you sure you want to delete your account? This action cannot be undone.
                            </Text>

                            <View style={styles.deleteModalButtons}>
                                <TouchableOpacity
                                    style={[styles.deleteModalButton, styles.cancelDeleteButton]}
                                    onPress={() => setShowDeleteAccountModal(false)}
                                >
                                    <Text style={styles.cancelDeleteText}>Cancel</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.deleteModalButton, styles.confirmDeleteButton]}
                                    onPress={confirmDeleteAccount}
                                >
                                    <Text style={styles.confirmDeleteText}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Pressable>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    headerRight: {
        width: 32, // To balance the header
    },
    scrollView: {
        flex: 1,
    },
    settingsContainer: {
        backgroundColor: '#fff',
        borderRadius: 8,
        overflow: 'hidden',
        margin: 16,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    settingText: {
        fontSize: 16,
    },
    deleteAccountButton: {
        marginHorizontal: 16,
        marginBottom: 24,
        paddingVertical: 16,
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    deleteAccountText: {
        color: '#ff4444',
        fontSize: 16,
        fontWeight: '500',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteModalContainer: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 8,
        overflow: 'hidden',
    },
    deleteModalContent: {
        padding: 20,
    },
    deleteModalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    deleteModalMessage: {
        fontSize: 14,
        color: '#666',
        marginBottom: 20,
    },
    deleteModalButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    deleteModalButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 4,
        marginLeft: 8,
    },
    cancelDeleteButton: {
        backgroundColor: '#f5f5f5',
    },
    confirmDeleteButton: {
        backgroundColor: '#ff4444',
    },
    cancelDeleteText: {
        color: '#000',
        fontWeight: '500',
    },
    confirmDeleteText: {
        color: '#fff',
        fontWeight: '500',
    },
});

export default Settings; 
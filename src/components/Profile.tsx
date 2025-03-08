import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Image,
    Alert,
    Modal,
    Pressable
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { Ionicons, MaterialIcons, Feather, FontAwesome } from '@expo/vector-icons';
import EditProfile from './EditProfile';
import FAQ from './FAQ';
import Report from './Report';
import Settings from './Settings';

const Profile = ({ onNavigateToHome }) => {
    const { user, logout } = useAuth();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [currentScreen, setCurrentScreen] = useState('profile');
    const [profileData, setProfileData] = useState({
        username: user?.name?.split(' ')[0]?.toLowerCase() || 'pathum',
        fullName: user?.name || 'Pathum Bandara',
        email: user?.email || 'pathum@example.co.uk',
        location: 'Sri Lanka'
    });

    // Mock statistics data
    const stats = {
        assigned: 20,
        completed: 20,
        total: 20
    };

    const handleLogout = () => {
        setShowLogoutModal(false);
        logout();
    };

    const handleEditProfile = () => {
        setCurrentScreen('editProfile');
    };

    const handleNavigateBack = () => {
        setCurrentScreen('profile');
    };

    const handleProfileUpdate = (updatedData) => {
        setProfileData({
            ...profileData,
            ...updatedData
        });
        setCurrentScreen('profile');
    };

    const handleSettings = () => {
        setCurrentScreen('settings');
    };

    const handleFAQ = () => {
        setCurrentScreen('faq');
    };

    const handleReportProblem = () => {
        setCurrentScreen('report');
    };

    if (currentScreen === 'editProfile') {
        return (
            <EditProfile
                onNavigateBack={handleNavigateBack}
                onSave={handleProfileUpdate}
                initialData={profileData}
            />
        );
    }

    if (currentScreen === 'faq') {
        return <FAQ onNavigateBack={handleNavigateBack} />;
    }

    if (currentScreen === 'report') {
        return <Report onNavigateBack={handleNavigateBack} />;
    }

    if (currentScreen === 'settings') {
        return <Settings onNavigateBack={handleNavigateBack} />;
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onNavigateToHome} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Profile Info</Text>
                <View style={styles.headerRight} />
            </View>

            <ScrollView style={styles.scrollView}>
                {/* Profile Card */}
                <View style={styles.profileCard}>
                    <View style={styles.profileInfo}>
                        <View style={styles.avatarContainer}>
                            <FontAwesome name="user-circle" size={32} color="#000" />
                        </View>
                        <View style={styles.profileDetails}>
                            <Text style={styles.profileName}>{profileData.fullName}</Text>
                            <Text style={styles.profileEmail}>{profileData.email}</Text>
                        </View>
                    </View>
                </View>

                {/* Statistics */}
                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{stats.assigned}</Text>
                        <Text style={styles.statLabel}>Assigned</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{stats.completed}</Text>
                        <Text style={styles.statLabel}>Completed</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{stats.total}</Text>
                        <Text style={styles.statLabel}>Total</Text>
                    </View>
                </View>

                {/* Settings Options */}
                <View style={styles.settingsContainer}>
                    <TouchableOpacity style={styles.settingItem} onPress={handleEditProfile}>
                        <View style={styles.settingLeft}>
                            <View style={styles.settingIconContainer}>
                                <Feather name="edit-2" size={20} color="#000" />
                            </View>
                            <Text style={styles.settingText}>Edit Profile</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#888" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.settingItem} onPress={handleSettings}>
                        <View style={styles.settingLeft}>
                            <View style={styles.settingIconContainer}>
                                <Ionicons name="settings-outline" size={20} color="#000" />
                            </View>
                            <Text style={styles.settingText}>Settings</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#888" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.settingItem} onPress={handleFAQ}>
                        <View style={styles.settingLeft}>
                            <View style={styles.settingIconContainer}>
                                <Ionicons name="help-circle-outline" size={20} color="#000" />
                            </View>
                            <Text style={styles.settingText}>FAQ</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#888" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.settingItem} onPress={handleReportProblem}>
                        <View style={styles.settingLeft}>
                            <View style={styles.settingIconContainer}>
                                <Ionicons name="information-circle-outline" size={20} color="#000" />
                            </View>
                            <Text style={styles.settingText}>Report a Problem</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#888" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.settingItem, styles.logoutItem]}
                        onPress={() => setShowLogoutModal(true)}
                    >
                        <View style={styles.settingLeft}>
                            <View style={[styles.settingIconContainer, styles.logoutIconContainer]}>
                                <Ionicons name="log-out-outline" size={20} color="#ff4444" />
                            </View>
                            <Text style={[styles.settingText, styles.logoutText]}>Log Out</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Logout Confirmation Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={showLogoutModal}
                onRequestClose={() => setShowLogoutModal(false)}
            >
                <Pressable
                    style={styles.modalOverlay}
                    onPress={() => setShowLogoutModal(false)}
                >
                    <View style={styles.logoutModalContainer}>
                        <View style={styles.logoutModalContent}>
                            <Text style={styles.logoutModalTitle}>Log Out</Text>
                            <Text style={styles.logoutModalMessage}>
                                Are you sure you want to log out?
                            </Text>

                            <View style={styles.logoutModalButtons}>
                                <TouchableOpacity
                                    style={[styles.logoutModalButton, styles.cancelLogoutButton]}
                                    onPress={() => setShowLogoutModal(false)}
                                >
                                    <Text style={styles.cancelLogoutText}>Cancel</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.logoutModalButton, styles.confirmLogoutButton]}
                                    onPress={handleLogout}
                                >
                                    <Text style={styles.confirmLogoutText}>Log Out</Text>
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
    profileCard: {
        backgroundColor: '#fff',
        padding: 16,
        marginBottom: 16,
    },
    profileInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    profileDetails: {
        flex: 1,
    },
    profileName: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    profileEmail: {
        fontSize: 14,
        color: '#666',
    },
    statsContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 16,
        marginBottom: 16,
        justifyContent: 'space-between',
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 14,
        color: '#666',
    },
    statDivider: {
        width: 1,
        height: '80%',
        backgroundColor: '#eee',
    },
    settingsContainer: {
        backgroundColor: '#fff',
        borderRadius: 8,
        overflow: 'hidden',
        marginBottom: 24,
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
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    settingIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    settingText: {
        fontSize: 16,
    },
    logoutItem: {
        borderBottomWidth: 0,
        marginTop: 16,
    },
    logoutIconContainer: {
        backgroundColor: '#ffeeee',
    },
    logoutText: {
        color: '#ff4444',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoutModalContainer: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 8,
        overflow: 'hidden',
    },
    logoutModalContent: {
        padding: 20,
    },
    logoutModalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    logoutModalMessage: {
        fontSize: 14,
        color: '#666',
        marginBottom: 20,
    },
    logoutModalButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    logoutModalButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 4,
        marginLeft: 8,
    },
    cancelLogoutButton: {
        backgroundColor: '#f5f5f5',
    },
    confirmLogoutButton: {
        backgroundColor: '#ff4444',
    },
    cancelLogoutText: {
        color: '#000',
        fontWeight: '500',
    },
    confirmLogoutText: {
        color: '#fff',
        fontWeight: '500',
    },
});

export default Profile; 
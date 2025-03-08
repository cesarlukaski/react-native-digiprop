import React from 'react';
import { StyleSheet, View, Platform, StatusBar, UIManager, LogBox } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import Auth from './src/components/Auth';
import Home from './src/components/Home';

// Ignore specific warnings that might occur in React Native
LogBox.ignoreLogs([
    'ViewPropTypes will be removed from React Native',
    'AsyncStorage has been extracted from react-native',
    'Possible Unhandled Promise Rejection'
]);

// Enable layout animation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Main app content that uses the auth context
const AppContent = () => {
    const { user } = useAuth();

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            {user ? <Home /> : <Auth />}
        </View>
    );
};

// Root component that provides the auth context
export default function App() {
    return (
        <SafeAreaProvider>
            <PaperProvider>
                <AuthProvider>
                    <AppContent />
                </AuthProvider>
            </PaperProvider>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        // These style properties help ensure proper z-index handling on all platforms
        ...(Platform.OS === 'ios' ? { zIndex: 1 } : { elevation: 1 }),
    },
});
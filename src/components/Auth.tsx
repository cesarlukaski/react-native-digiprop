import React, { useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import Login from './Login';
import SignUp from './SignUp';
import ForgotPassword from './ForgotPassword';

enum AuthScreen {
    LOGIN = 'login',
    SIGNUP = 'signup',
    FORGOT_PASSWORD = 'forgot_password',
}

const Auth = () => {
    const [currentScreen, setCurrentScreen] = useState<AuthScreen>(AuthScreen.LOGIN);

    const navigateToLogin = () => {
        setCurrentScreen(AuthScreen.LOGIN);
    };

    const navigateToSignUp = () => {
        setCurrentScreen(AuthScreen.SIGNUP);
    };

    const navigateToForgotPassword = () => {
        setCurrentScreen(AuthScreen.FORGOT_PASSWORD);
    };

    const renderScreen = () => {
        switch (currentScreen) {
            case AuthScreen.LOGIN:
                return <Login onNavigateToSignUp={navigateToSignUp} onNavigateToForgotPassword={navigateToForgotPassword} />;
            case AuthScreen.SIGNUP:
                return <SignUp onNavigateToLogin={navigateToLogin} onNavigateToForgotPassword={navigateToForgotPassword} />;
            case AuthScreen.FORGOT_PASSWORD:
                return <ForgotPassword onNavigateToLogin={navigateToLogin} />;
            default:
                return <Login onNavigateToSignUp={navigateToSignUp} onNavigateToForgotPassword={navigateToForgotPassword} />;
        }
    };

    return (
        <View style={styles.container}>
            {renderScreen()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        // These style properties help ensure proper z-index handling on all platforms
        ...(Platform.OS === 'ios' ? { zIndex: 1 } : { elevation: 1 }),
    },
});

export default Auth; 
import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import {
    TextInput,
    Button,
    HelperText,
    Snackbar,
} from 'react-native-paper';
import { useAuth } from '../context/AuthContext';

interface LoginFormData {
    email: string;
    password: string;
}

interface LoginFormErrors {
    email: string;
    password: string;
}

interface LoginProps {
    onNavigateToSignUp: () => void;
    onNavigateToForgotPassword: () => void;
}

const Login = ({ onNavigateToSignUp, onNavigateToForgotPassword }: LoginProps) => {
    const { login, isLoading, error } = useAuth();
    const [formData, setFormData] = useState<LoginFormData>({
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState<LoginFormErrors>({
        email: '',
        password: '',
    });

    const [focusedField, setFocusedField] = useState<string | null>(null);
    const [isRememberMe, setIsRememberMe] = useState<boolean>(false);
    const [snackbarVisible, setSnackbarVisible] = useState<boolean>(false);
    const [snackbarMessage, setSnackbarMessage] = useState<string>('');

    const validateForm = (): boolean => {
        const newErrors: LoginFormErrors = {
            email: '',
            password: '',
        };
        let isValid = true;

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
            isValid = false;
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSignIn = async () => {
        if (validateForm()) {
            const success = await login(formData.email, formData.password);

            if (!success && error) {
                setSnackbarMessage(error);
                setSnackbarVisible(true);
            }
        }
    };

    const handleSignUp = () => {
        onNavigateToSignUp();
    };

    const handleForgotPassword = () => {
        onNavigateToForgotPassword();
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.loginContainer}>
                    {/* Text Logo */}
                    <View style={styles.logoContainer}>
                        <Text style={styles.logoText}>DIGIPROP</Text>
                    </View>

                    {/* Welcome Text */}
                    <Text style={styles.welcomeText}>Welcome back</Text>
                    <Text style={styles.subText}>Login to your account</Text>

                    {/* Login Form */}
                    <View style={styles.formContainer}>
                        <View style={styles.inputContainer}>
                            <TextInput
                                mode="outlined"
                                label="Email"
                                placeholder="Enter email"
                                value={formData.email}
                                onChangeText={(text) => setFormData({ ...formData, email: text })}
                                onFocus={() => setFocusedField('email')}
                                onBlur={() => setFocusedField(null)}
                                style={[
                                    styles.input,
                                    focusedField === 'email' && styles.focusedInput
                                ]}
                                error={!!errors.email}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                disabled={isLoading}
                            />
                            {!!errors.email && (
                                <HelperText type="error" visible={!!errors.email}>
                                    {errors.email}
                                </HelperText>
                            )}
                        </View>

                        <View style={styles.inputContainer}>
                            <TextInput
                                mode="outlined"
                                label="Password"
                                placeholder="Password"
                                value={formData.password}
                                onChangeText={(text) => setFormData({ ...formData, password: text })}
                                onFocus={() => setFocusedField('password')}
                                onBlur={() => setFocusedField(null)}
                                style={[
                                    styles.input,
                                    focusedField === 'password' && styles.focusedInput
                                ]}
                                secureTextEntry
                                error={!!errors.password}
                                disabled={isLoading}
                            />
                            {!!errors.password && (
                                <HelperText type="error" visible={!!errors.password}>
                                    {errors.password}
                                </HelperText>
                            )}
                        </View>

                        <View style={styles.forgotPasswordContainer}>
                            <TouchableOpacity onPress={handleForgotPassword} disabled={isLoading}>
                                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                            </TouchableOpacity>
                        </View>

                        <Button
                            mode="contained"
                            onPress={handleSignIn}
                            style={styles.loginButton}
                            labelStyle={styles.loginButtonText}
                            disabled={isLoading}
                            loading={isLoading}
                        >
                            {isLoading ? 'Logging in...' : 'Log In'}
                        </Button>

                        {/* Social Login Options */}
                        <View style={styles.socialLoginContainer}>
                            <Text style={styles.orText}>Or login with</Text>
                            <View style={styles.socialIconsRow}>
                                <TouchableOpacity style={styles.socialIcon} disabled={isLoading}>
                                    <Text style={styles.socialIconText}>G</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.socialIcon} disabled={isLoading}>
                                    <Text style={styles.socialIconText}>f</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.socialIcon} disabled={isLoading}>
                                    <Text style={styles.socialIconText}>in</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Sign Up Link */}
                        <View style={styles.signupContainer}>
                            <Text style={styles.signupText}>Don't have an account? </Text>
                            <TouchableOpacity onPress={handleSignUp} disabled={isLoading}>
                                <Text style={styles.signupLink}>Sign up</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Error Snackbar */}
            <Snackbar
                visible={snackbarVisible}
                onDismiss={() => setSnackbarVisible(false)}
                duration={3000}
                action={{
                    label: 'OK',
                    onPress: () => setSnackbarVisible(false),
                }}
            >
                {snackbarMessage}
            </Snackbar>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        // Keep the z-index for proper rendering
        ...(Platform.OS === 'ios' ? { zIndex: 1 } : { elevation: 1 }),
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 16,
    },
    loginContainer: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    logoText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#4f46e5',
        letterSpacing: 1,
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
    },
    subText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 24,
    },
    formContainer: {
        width: '100%',
    },
    inputContainer: {
        marginBottom: 16,
        zIndex: 1, // Keep z-index for proper stacking
    },
    input: {
        backgroundColor: 'white',
    },
    focusedInput: {
        // borderColor: '#4f46e5',
        // borderWidth: 2,
    },
    forgotPasswordContainer: {
        alignItems: 'flex-end',
        marginBottom: 16,
    },
    forgotPasswordText: {
        color: '#4f46e5',
        fontSize: 14,
    },
    loginButton: {
        paddingVertical: 8,
        backgroundColor: '#4f46e5',
        marginBottom: 24,
    },
    loginButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    socialLoginContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    orText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 16,
    },
    socialIconsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    socialIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'white',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 8,
    },
    socialIconText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    signupContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    signupText: {
        fontSize: 14,
        color: '#666',
    },
    signupLink: {
        fontSize: 14,
        color: '#4f46e5',
        fontWeight: 'bold',
    },
});

export default Login; 
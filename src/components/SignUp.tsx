import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    ScrollView,
    Image,
} from 'react-native';
import {
    TextInput,
    Button,
    HelperText,
    Snackbar,
    IconButton,
} from 'react-native-paper';
import { useAuth } from '../context/AuthContext';

interface SignUpFormData {
    name: string;
    username: string;
    email: string;
    password: string;
    location: string;
}

interface SignUpFormErrors {
    name: string;
    username: string;
    email: string;
    password: string;
    location: string;
}

interface SignUpProps {
    onNavigateToLogin: () => void;
    onNavigateToForgotPassword: () => void;
}

const SignUp = ({ onNavigateToLogin, onNavigateToForgotPassword }: SignUpProps) => {
    const { signup, isLoading, error } = useAuth();

    const [formData, setFormData] = useState<SignUpFormData>({
        name: '',
        username: '',
        email: '',
        password: '',
        location: '',
    });

    const [errors, setErrors] = useState<SignUpFormErrors>({
        name: '',
        username: '',
        email: '',
        password: '',
        location: '',
    });

    const [focusedField, setFocusedField] = useState<string | null>(null);
    const [snackbarVisible, setSnackbarVisible] = useState<boolean>(false);
    const [snackbarMessage, setSnackbarMessage] = useState<string>('');
    const [passwordVisible, setPasswordVisible] = useState<boolean>(false);

    const validateForm = (): boolean => {
        const newErrors: SignUpFormErrors = {
            name: '',
            username: '',
            email: '',
            password: '',
            location: '',
        };
        let isValid = true;

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
            isValid = false;
        }

        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
            isValid = false;
        }

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
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSignUp = async () => {
        if (validateForm()) {
            // For the mock API, we'll just pass name, email, and password
            const success = await signup(formData.name, formData.email, formData.password);

            if (!success && error) {
                setSnackbarMessage(error);
                setSnackbarVisible(true);
            }
        }
    };

    const handleForgotPassword = () => {
        onNavigateToForgotPassword(); // Direct navigation to forgot password
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
                <View style={styles.signupContainer}>
                    {/* Logo */}
                    <View style={styles.logoContainer}>
                        <Text style={styles.logoText}>DIGIPROP</Text>
                    </View>

                    {/* Register Text */}
                    <Text style={styles.registerText}>Register</Text>
                    <Text style={styles.subText}>Create your new account</Text>

                    {/* Signup Form */}
                    <View style={styles.formContainer}>
                        <TextInput
                            mode="outlined"
                            label="Name"
                            placeholder="Name"
                            value={formData.name}
                            onChangeText={(text) => setFormData({ ...formData, name: text })}
                            onFocus={() => setFocusedField('name')}
                            onBlur={() => setFocusedField(null)}
                            style={[
                                styles.input,
                                focusedField === 'name' && styles.focusedInput
                            ]}
                            error={!!errors.name}
                            disabled={isLoading}
                        />
                        {!!errors.name && (
                            <HelperText type="error" visible={!!errors.name}>
                                {errors.name}
                            </HelperText>
                        )}

                        <TextInput
                            mode="outlined"
                            label="Username"
                            placeholder="Username"
                            value={formData.username}
                            onChangeText={(text) => setFormData({ ...formData, username: text })}
                            onFocus={() => setFocusedField('username')}
                            onBlur={() => setFocusedField(null)}
                            style={[
                                styles.input,
                                focusedField === 'username' && styles.focusedInput
                            ]}
                            error={!!errors.username}
                            disabled={isLoading}
                        />
                        {!!errors.username && (
                            <HelperText type="error" visible={!!errors.username}>
                                {errors.username}
                            </HelperText>
                        )}

                        <TextInput
                            mode="outlined"
                            label="Email"
                            placeholder="Email"
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
                            secureTextEntry={!passwordVisible}
                            error={!!errors.password}
                            disabled={isLoading}
                            right={
                                <TextInput.Icon
                                    icon={passwordVisible ? "eye-off" : "eye"}
                                    onPress={() => setPasswordVisible(!passwordVisible)}
                                />
                            }
                        />
                        {!!errors.password && (
                            <HelperText type="error" visible={!!errors.password}>
                                {errors.password}
                            </HelperText>
                        )}

                        <TextInput
                            mode="outlined"
                            label="Location"
                            placeholder="Location"
                            value={formData.location}
                            onChangeText={(text) => setFormData({ ...formData, location: text })}
                            onFocus={() => setFocusedField('location')}
                            onBlur={() => setFocusedField(null)}
                            style={[
                                styles.input,
                                focusedField === 'location' && styles.focusedInput
                            ]}
                            error={!!errors.location}
                            disabled={isLoading}
                        />
                        {!!errors.location && (
                            <HelperText type="error" visible={!!errors.location}>
                                {errors.location}
                            </HelperText>
                        )}

                        <View style={styles.forgotPasswordContainer}>
                            <TouchableOpacity onPress={handleForgotPassword} disabled={isLoading}>
                                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                            </TouchableOpacity>
                        </View>

                        <Button
                            mode="contained"
                            onPress={handleSignUp}
                            style={styles.signupButton}
                            labelStyle={styles.signupButtonText}
                            disabled={isLoading}
                            loading={isLoading}
                        >
                            Sign In
                        </Button>

                        {/* Social Login Options */}
                        <View style={styles.socialLoginContainer}>
                            <Text style={styles.orText}>or</Text>
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

                        {/* Login Link */}
                        <View style={styles.loginContainer}>
                            <Text style={styles.loginText}>Already have an account? </Text>
                            <TouchableOpacity onPress={onNavigateToLogin} disabled={isLoading}>
                                <Text style={styles.loginLink}>Log in</Text>
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
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 16,
    },
    signupContainer: {
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
    registerText: {
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
        gap: 12,
    },
    input: {
        backgroundColor: 'white',
        marginBottom: 0,
    },
    focusedInput: {
        // borderColor: '#4f46e5',
        // borderWidth: 2,
    },
    forgotPasswordContainer: {
        alignItems: 'flex-end',
        marginTop: 4,
        marginBottom: 16,
    },
    forgotPasswordText: {
        color: '#4f46e5',
        fontSize: 14,
    },
    signupButton: {
        paddingVertical: 8,
        backgroundColor: '#000',
        marginBottom: 24,
    },
    signupButtonText: {
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
        // borderColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 8,
    },
    socialIconText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 16,
    },
    loginText: {
        fontSize: 14,
        color: '#666',
    },
    loginLink: {
        fontSize: 14,
        color: '#4f46e5',
        fontWeight: 'bold',
    },
});

export default SignUp; 
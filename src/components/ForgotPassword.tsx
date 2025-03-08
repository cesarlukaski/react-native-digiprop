import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import {
    TextInput,
    Button,
    HelperText,
    Snackbar,
} from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import { verifyCode, resetPassword } from '../services/api';

// Define the steps in the password reset flow
enum ResetStep {
    EMAIL_ENTRY = 'email_entry',
    VERIFICATION_CODE = 'verification_code',
    NEW_PASSWORD = 'new_password',
    CONFIRMATION = 'confirmation',
}

interface ForgotPasswordFormData {
    email: string;
    verificationCode: string;
    newPassword: string;
    confirmPassword: string;
}

interface ForgotPasswordFormErrors {
    email: string;
    verificationCode: string;
    newPassword: string;
    confirmPassword: string;
}

const ForgotPassword = ({ onNavigateToLogin }: { onNavigateToLogin: () => void }) => {
    const { forgotPassword, isLoading, error } = useAuth();
    const [currentStep, setCurrentStep] = useState<ResetStep>(ResetStep.EMAIL_ENTRY);

    const [formData, setFormData] = useState<ForgotPasswordFormData>({
        email: '',
        verificationCode: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [errors, setErrors] = useState<ForgotPasswordFormErrors>({
        email: '',
        verificationCode: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [focusedField, setFocusedField] = useState<string | null>(null);
    const [snackbarVisible, setSnackbarVisible] = useState<boolean>(false);
    const [snackbarMessage, setSnackbarMessage] = useState<string>('');
    const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState<boolean>(false);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);

    const validateEmailStep = (): boolean => {
        const newErrors = { ...errors, email: '' };
        let isValid = true;

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const validateVerificationStep = (): boolean => {
        const newErrors = { ...errors, verificationCode: '' };
        let isValid = true;

        if (!formData.verificationCode.trim()) {
            newErrors.verificationCode = 'Verification code is required';
            isValid = false;
        } else if (formData.verificationCode.length < 6) {
            newErrors.verificationCode = 'Verification code must be at least 6 characters';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const validateNewPasswordStep = (): boolean => {
        const newErrors = { ...errors, newPassword: '', confirmPassword: '' };
        let isValid = true;

        if (!formData.newPassword) {
            newErrors.newPassword = 'New password is required';
            isValid = false;
        } else if (formData.newPassword.length < 6) {
            newErrors.newPassword = 'Password must be at least 6 characters';
            isValid = false;
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
            isValid = false;
        } else if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmitEmail = async () => {
        if (validateEmailStep()) {
            setIsProcessing(true);
            try {
                // Send verification code to the user's email
                const success = await forgotPassword(formData.email);

                if (success) {
                    setCurrentStep(ResetStep.VERIFICATION_CODE);
                    setSnackbarMessage('Verification code sent to your email. For testing, check the console log.');
                    setSnackbarVisible(true);
                } else if (error) {
                    setSnackbarMessage(error);
                    setSnackbarVisible(true);
                }
            } catch (err) {
                setSnackbarMessage('An error occurred. Please try again.');
                setSnackbarVisible(true);
            } finally {
                setIsProcessing(false);
            }
        }
    };

    const handleSubmitVerification = async () => {
        if (validateVerificationStep()) {
            setIsProcessing(true);
            try {
                // Verify the code
                const response = await verifyCode(formData.email, formData.verificationCode);

                if (response.success && response.data?.valid) {
                    setCurrentStep(ResetStep.NEW_PASSWORD);
                } else {
                    setSnackbarMessage(response.error || 'Invalid verification code');
                    setSnackbarVisible(true);
                }
            } catch (err) {
                setSnackbarMessage('An error occurred. Please try again.');
                setSnackbarVisible(true);
            } finally {
                setIsProcessing(false);
            }
        }
    };

    const handleSubmitNewPassword = async () => {
        if (validateNewPasswordStep()) {
            setIsProcessing(true);
            try {
                // Reset the password
                const response = await resetPassword(formData.email, formData.newPassword);

                if (response.success) {
                    setCurrentStep(ResetStep.CONFIRMATION);
                } else {
                    setSnackbarMessage(response.error || 'Failed to reset password');
                    setSnackbarVisible(true);
                }
            } catch (err) {
                setSnackbarMessage('An error occurred. Please try again.');
                setSnackbarVisible(true);
            } finally {
                setIsProcessing(false);
            }
        }
    };

    const handleFinish = () => {
        onNavigateToLogin();
    };

    const renderEmailStep = () => (
        <>
            <Text style={styles.stepTitle}>Forgot your password?</Text>
            <Text style={styles.stepDescription}>Enter your email to reset your password</Text>

            <TextInput
                mode="outlined"
                label="Email"
                placeholder="Enter your email"
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
                disabled={isProcessing}
            />
            {!!errors.email && (
                <HelperText type="error" visible={!!errors.email}>
                    {errors.email}
                </HelperText>
            )}

            <Button
                mode="contained"
                onPress={handleSubmitEmail}
                style={styles.submitButton}
                labelStyle={styles.submitButtonText}
                disabled={isProcessing}
                loading={isProcessing}
            >
                Send Code
            </Button>
        </>
    );

    const renderVerificationStep = () => (
        <>
            <Text style={styles.stepTitle}>Forgot your password?</Text>
            <Text style={styles.stepDescription}>Enter the verification code sent to your email</Text>

            <TextInput
                mode="outlined"
                label="Verification Code"
                placeholder="Enter verification code"
                value={formData.verificationCode}
                onChangeText={(text) => setFormData({ ...formData, verificationCode: text })}
                onFocus={() => setFocusedField('verificationCode')}
                onBlur={() => setFocusedField(null)}
                style={[
                    styles.input,
                    focusedField === 'verificationCode' && styles.focusedInput
                ]}
                error={!!errors.verificationCode}
                keyboardType="number-pad"
                disabled={isProcessing}
            />
            {!!errors.verificationCode && (
                <HelperText type="error" visible={!!errors.verificationCode}>
                    {errors.verificationCode}
                </HelperText>
            )}

            <Button
                mode="contained"
                onPress={handleSubmitVerification}
                style={styles.submitButton}
                labelStyle={styles.submitButtonText}
                disabled={isProcessing}
                loading={isProcessing}
            >
                Verify
            </Button>
        </>
    );

    const renderNewPasswordStep = () => (
        <>
            <Text style={styles.stepTitle}>Create New Password</Text>
            <Text style={styles.stepDescription}>Your new password must be different from previous passwords</Text>

            <TextInput
                mode="outlined"
                label="New Password"
                placeholder="Enter new password"
                value={formData.newPassword}
                onChangeText={(text) => setFormData({ ...formData, newPassword: text })}
                onFocus={() => setFocusedField('newPassword')}
                onBlur={() => setFocusedField(null)}
                style={[
                    styles.input,
                    focusedField === 'newPassword' && styles.focusedInput
                ]}
                secureTextEntry={!passwordVisible}
                error={!!errors.newPassword}
                disabled={isProcessing}
                right={
                    <TextInput.Icon
                        icon={passwordVisible ? "eye-off" : "eye"}
                        onPress={() => setPasswordVisible(!passwordVisible)}
                    />
                }
            />
            {!!errors.newPassword && (
                <HelperText type="error" visible={!!errors.newPassword}>
                    {errors.newPassword}
                </HelperText>
            )}

            <TextInput
                mode="outlined"
                label="Confirm Password"
                placeholder="Confirm new password"
                value={formData.confirmPassword}
                onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
                onFocus={() => setFocusedField('confirmPassword')}
                onBlur={() => setFocusedField(null)}
                style={[
                    styles.input,
                    focusedField === 'confirmPassword' && styles.focusedInput
                ]}
                secureTextEntry={!confirmPasswordVisible}
                error={!!errors.confirmPassword}
                disabled={isProcessing}
                right={
                    <TextInput.Icon
                        icon={confirmPasswordVisible ? "eye-off" : "eye"}
                        onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                    />
                }
            />
            {!!errors.confirmPassword && (
                <HelperText type="error" visible={!!errors.confirmPassword}>
                    {errors.confirmPassword}
                </HelperText>
            )}

            <Button
                mode="contained"
                onPress={handleSubmitNewPassword}
                style={styles.submitButton}
                labelStyle={styles.submitButtonText}
                disabled={isProcessing}
                loading={isProcessing}
            >
                Reset
            </Button>
        </>
    );

    const renderConfirmationStep = () => (
        <>
            <Text style={styles.stepTitle}>Create New Password</Text>
            <Text style={styles.stepDescription}>Your password has been successfully reset</Text>

            <Button
                mode="contained"
                onPress={handleFinish}
                style={styles.submitButton}
                labelStyle={styles.submitButtonText}
            >
                Sign In
            </Button>
        </>
    );

    const renderCurrentStep = () => {
        switch (currentStep) {
            case ResetStep.EMAIL_ENTRY:
                return renderEmailStep();
            case ResetStep.VERIFICATION_CODE:
                return renderVerificationStep();
            case ResetStep.NEW_PASSWORD:
                return renderNewPasswordStep();
            case ResetStep.CONFIRMATION:
                return renderConfirmationStep();
            default:
                return renderEmailStep();
        }
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
                <View style={styles.forgotPasswordContainer}>
                    {/* Logo */}
                    <View style={styles.logoContainer}>
                        <Text style={styles.logoText}>DIGIPROP</Text>
                    </View>

                    {/* Form Content */}
                    <View style={styles.formContainer}>
                        {renderCurrentStep()}
                    </View>

                    {/* Back to Login Link */}
                    {currentStep !== ResetStep.CONFIRMATION && (
                        <View style={styles.loginContainer}>
                            <TouchableOpacity onPress={onNavigateToLogin} disabled={isProcessing}>
                                <Text style={styles.loginLink}>Back to Login</Text>
                            </TouchableOpacity>
                        </View>
                    )}
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
    forgotPasswordContainer: {
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
        marginBottom: 24,
    },
    logoText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#4f46e5',
        letterSpacing: 1,
    },
    formContainer: {
        width: '100%',
        gap: 12,
    },
    stepTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
    },
    stepDescription: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 24,
    },
    input: {
        backgroundColor: 'white',
        marginBottom: 8,
    },
    focusedInput: {
        // borderColor: '#4f46e5',
        // borderWidth: 2,
    },
    submitButton: {
        paddingVertical: 8,
        backgroundColor: '#000',
        marginTop: 16,
    },
    submitButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    loginContainer: {
        alignItems: 'center',
        marginTop: 24,
    },
    loginLink: {
        fontSize: 14,
        color: '#4f46e5',
        fontWeight: 'bold',
    },
});

export default ForgotPassword; 
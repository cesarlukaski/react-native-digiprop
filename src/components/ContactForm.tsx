import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from 'react-native';
import {
    TextInput,
    Button,
    Checkbox,
    Title,
    HelperText,
} from 'react-native-paper';

interface FormData {
    name: string;
    email: string;
    phone: string;
    message: string;
    acceptTerms: boolean;
}

interface FormErrors {
    name: string;
    email: string;
    phone: string;
    message: string;
}

const ContactForm = () => {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        phone: '',
        message: '',
        acceptTerms: false,
    });

    const [errors, setErrors] = useState<FormErrors>({
        name: '',
        email: '',
        phone: '',
        message: '',
    });

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {
            name: '',
            email: '',
            phone: '',
            message: '',
        };
        let isValid = true;

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
            isValid = false;
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
            isValid = false;
        }

        if (!formData.message.trim()) {
            newErrors.message = 'Message is required';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            // Submit form data
            console.log('Form submitted:', formData);
            Alert.alert('Success', 'Form submitted successfully!');

            // Reset form
            setFormData({
                name: '',
                email: '',
                phone: '',
                message: '',
                acceptTerms: false,
            });
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.formContainer}>
                    <Title style={styles.title}>Contact Form</Title>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>
                            Name/Username <Text style={styles.required}>*</Text>
                        </Text>
                        <TextInput
                            mode="outlined"
                            placeholder="Enter your name"
                            value={formData.name}
                            onChangeText={(text) => setFormData({ ...formData, name: text })}
                            style={styles.input}
                            error={!!errors.name}
                        />
                        {!!errors.name && (
                            <HelperText type="error" visible={!!errors.name}>
                                {errors.name}
                            </HelperText>
                        )}
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>
                            Email <Text style={styles.required}>*</Text>
                        </Text>
                        <TextInput
                            mode="outlined"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChangeText={(text) => setFormData({ ...formData, email: text })}
                            keyboardType="email-address"
                            style={styles.input}
                            error={!!errors.email}
                        />
                        {!!errors.email && (
                            <HelperText type="error" visible={!!errors.email}>
                                {errors.email}
                            </HelperText>
                        )}
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Phone</Text>
                        <TextInput
                            mode="outlined"
                            placeholder="Enter your phone number"
                            value={formData.phone}
                            onChangeText={(text) => setFormData({ ...formData, phone: text })}
                            keyboardType="phone-pad"
                            style={styles.input}
                            error={!!errors.phone}
                        />
                        {!!errors.phone && (
                            <HelperText type="error" visible={!!errors.phone}>
                                {errors.phone}
                            </HelperText>
                        )}
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>
                            Message <Text style={styles.required}>*</Text>
                        </Text>
                        <TextInput
                            mode="outlined"
                            placeholder="Enter your message"
                            value={formData.message}
                            onChangeText={(text) => setFormData({ ...formData, message: text })}
                            multiline
                            numberOfLines={5}
                            style={[styles.input, styles.textArea]}
                            error={!!errors.message}
                        />
                        {!!errors.message && (
                            <HelperText type="error" visible={!!errors.message}>
                                {errors.message}
                            </HelperText>
                        )}
                    </View>

                    <View style={styles.checkboxContainer}>
                        <Checkbox
                            status={formData.acceptTerms ? 'checked' : 'unchecked'}
                            onPress={() =>
                                setFormData({ ...formData, acceptTerms: !formData.acceptTerms })
                            }
                        />
                        <Text style={styles.checkboxLabel}>
                            I accept the terms and conditions
                        </Text>
                    </View>

                    <Button
                        mode="contained"
                        onPress={handleSubmit}
                        style={styles.submitButton}
                        labelStyle={styles.submitButtonText}
                    >
                        Submit
                    </Button>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
    },
    formContainer: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        marginBottom: 16,
    },
    title: {
        textAlign: 'center',
        marginBottom: 24,
        fontSize: 24,
        fontWeight: 'bold',
    },
    inputContainer: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        fontWeight: '500',
    },
    required: {
        color: 'red',
    },
    input: {
        backgroundColor: 'white',
    },
    textArea: {
        height: 120,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    checkboxLabel: {
        marginLeft: 8,
    },
    submitButton: {
        paddingVertical: 8,
        backgroundColor: '#4f46e5',
    },
    submitButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
});

export default ContactForm; 
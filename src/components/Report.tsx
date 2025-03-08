import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

const Report = ({ onNavigateBack }) => {
    const [formData, setFormData] = useState({
        issueType: 'bug',
        description: '',
        email: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = () => {
        // Validate form
        if (!formData.description.trim()) {
            Alert.alert('Error', 'Please describe the issue');
            return;
        }

        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            Alert.alert(
                'Report Submitted',
                'Thank you for your report. We will look into this issue and get back to you soon.',
                [{ text: 'OK', onPress: onNavigateBack }]
            );
        }, 1500);
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onNavigateBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Report a Problem</Text>
                <View style={styles.headerRight} />
            </View>

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
                {/* Form Fields */}
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Issue Type</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={formData.issueType}
                            onValueChange={(itemValue) =>
                                setFormData({ ...formData, issueType: itemValue })
                            }
                            style={styles.picker}
                        >
                            <Picker.Item label="Bug Report" value="bug" />
                            <Picker.Item label="Feature Request" value="feature" />
                            <Picker.Item label="Account Issue" value="account" />
                            <Picker.Item label="Other" value="other" />
                        </Picker>
                    </View>
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Description</Text>
                    <TextInput
                        style={styles.textArea}
                        value={formData.description}
                        onChangeText={(text) => setFormData({ ...formData, description: text })}
                        placeholder="Please describe the issue in detail"
                        multiline
                        numberOfLines={6}
                        textAlignVertical="top"
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Email (optional)</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.email}
                        onChangeText={(text) => setFormData({ ...formData, email: text })}
                        placeholder="Enter your email for follow-up"
                        keyboardType="email-address"
                    />
                </View>

                <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleSubmit}
                    disabled={isSubmitting}
                >
                    <Text style={styles.submitButtonText}>
                        {isSubmitting ? 'Submitting...' : 'Submit'}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
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
    contentContainer: {
        padding: 16,
    },
    formGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    pickerContainer: {
        backgroundColor: '#fff',
        borderWidth: 1,
        // borderColor: '#ddd',
        borderRadius: 8,
        overflow: 'hidden',
    },
    picker: {
        height: 50,
    },
    input: {
        backgroundColor: '#fff',
        borderWidth: 1,
        // borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
    textArea: {
        backgroundColor: '#fff',
        borderWidth: 1,
        // borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        minHeight: 120,
    },
    submitButton: {
        backgroundColor: '#000',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
        marginTop: 16,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default Report; 
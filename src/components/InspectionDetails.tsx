import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Switch
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

interface InspectionDetailsProps {
    onNavigateBack: () => void;
    onNext: () => void;
    inspectionData?: any; // This would be properly typed in a real app
}

const InspectionDetails = ({ onNavigateBack, onNext, inspectionData }: InspectionDetailsProps) => {
    const [formData, setFormData] = useState({
        propertyCondition: '',
        cleanlinessRating: 0,
        maintenanceIssues: '',
        tenantFeedback: '',
        photosRequired: true,
        followUpNeeded: false
    });

    const handleRatingSelect = (rating: number) => {
        setFormData({ ...formData, cleanlinessRating: rating });
    };

    const handleNext = () => {
        // Here you would typically validate the form and save the data
        onNext();
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onNavigateBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Inspection Details</Text>
                <View style={styles.headerRight} />
            </View>

            <ScrollView style={styles.scrollView}>
                <View style={styles.content}>
                    <Text style={styles.sectionTitle}>Property Assessment</Text>

                    {/* Property Condition */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Property Condition</Text>
                        <TextInput
                            style={styles.textArea}
                            placeholder="Describe the overall condition of the property"
                            placeholderTextColor="#888"
                            multiline
                            numberOfLines={4}
                            textAlignVertical="top"
                            value={formData.propertyCondition}
                            onChangeText={(text) => setFormData({ ...formData, propertyCondition: text })}
                        />
                    </View>

                    {/* Cleanliness Rating */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Cleanliness Rating</Text>
                        <View style={styles.ratingContainer}>
                            {[1, 2, 3, 4, 5].map((rating) => (
                                <TouchableOpacity
                                    key={rating}
                                    style={[
                                        styles.ratingButton,
                                        formData.cleanlinessRating === rating && styles.ratingButtonSelected
                                    ]}
                                    onPress={() => handleRatingSelect(rating)}
                                >
                                    <Text
                                        style={[
                                            styles.ratingText,
                                            formData.cleanlinessRating === rating && styles.ratingTextSelected
                                        ]}
                                    >
                                        {rating}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <Text style={styles.ratingDescription}>
                            {formData.cleanlinessRating === 1 && 'Poor - Requires immediate attention'}
                            {formData.cleanlinessRating === 2 && 'Below Average - Needs improvement'}
                            {formData.cleanlinessRating === 3 && 'Average - Acceptable condition'}
                            {formData.cleanlinessRating === 4 && 'Good - Well maintained'}
                            {formData.cleanlinessRating === 5 && 'Excellent - Exceptionally clean'}
                        </Text>
                    </View>

                    {/* Maintenance Issues */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Maintenance Issues</Text>
                        <TextInput
                            style={styles.textArea}
                            placeholder="List any maintenance issues that need attention"
                            placeholderTextColor="#888"
                            multiline
                            numberOfLines={4}
                            textAlignVertical="top"
                            value={formData.maintenanceIssues}
                            onChangeText={(text) => setFormData({ ...formData, maintenanceIssues: text })}
                        />
                    </View>

                    {/* Tenant Feedback */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Tenant Feedback (if applicable)</Text>
                        <TextInput
                            style={styles.textArea}
                            placeholder="Enter any feedback provided by the tenant"
                            placeholderTextColor="#888"
                            multiline
                            numberOfLines={4}
                            textAlignVertical="top"
                            value={formData.tenantFeedback}
                            onChangeText={(text) => setFormData({ ...formData, tenantFeedback: text })}
                        />
                    </View>

                    {/* Photos Required */}
                    <View style={styles.switchContainer}>
                        <Text style={styles.switchLabel}>Photos Required</Text>
                        <Switch
                            value={formData.photosRequired}
                            onValueChange={(value) => setFormData({ ...formData, photosRequired: value })}
                            trackColor={{ false: '#d1d1d1', true: '#000' }}
                            thumbColor="#fff"
                        />
                    </View>

                    {/* Follow-up Needed */}
                    <View style={styles.switchContainer}>
                        <Text style={styles.switchLabel}>Follow-up Needed</Text>
                        <Switch
                            value={formData.followUpNeeded}
                            onValueChange={(value) => setFormData({ ...formData, followUpNeeded: value })}
                            trackColor={{ false: '#d1d1d1', true: '#000' }}
                            thumbColor="#fff"
                        />
                    </View>
                </View>
            </ScrollView>

            {/* Next Button */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.nextButton}
                    onPress={handleNext}
                >
                    <Text style={styles.nextButtonText}>Next</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
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
    content: {
        padding: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 16,
    },
    inputContainer: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 8,
        color: '#333',
    },
    textArea: {
        borderWidth: 1,
        // borderColor: '#ddd',
        borderRadius: 4,
        paddingHorizontal: 12,
        paddingVertical: 12,
        fontSize: 16,
        minHeight: 100,
    },
    ratingContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    ratingButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
        // borderColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    ratingButtonSelected: {
        backgroundColor: '#000',
        borderColor: '#000',
    },
    ratingText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    ratingTextSelected: {
        color: '#fff',
    },
    ratingDescription: {
        fontSize: 14,
        color: '#666',
        marginTop: 8,
    },
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        paddingVertical: 8,
    },
    switchLabel: {
        fontSize: 16,
        color: '#333',
    },
    buttonContainer: {
        padding: 16,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    nextButton: {
        backgroundColor: '#000',
        borderRadius: 4,
        paddingVertical: 12,
        alignItems: 'center',
    },
    nextButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default InspectionDetails; 
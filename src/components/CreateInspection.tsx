import React, { useState, useRef, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Platform,
    Animated
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Helper function for cross-platform storage
const Storage = {
    setItem: async (key: string, value: string): Promise<void> => {
        try {
            if (Platform.OS === 'web') {
                localStorage.setItem(key, value);
            } else {
                await AsyncStorage.setItem(key, value);
            }
        } catch (error) {
            console.error(`Error storing ${key}:`, error);
        }
    },

    getItem: async (key: string): Promise<string | null> => {
        try {
            if (Platform.OS === 'web') {
                return localStorage.getItem(key);
            } else {
                return await AsyncStorage.getItem(key);
            }
        } catch (error) {
            console.error(`Error retrieving ${key}:`, error);
            return null;
        }
    },

    removeItem: async (key: string): Promise<void> => {
        try {
            if (Platform.OS === 'web') {
                localStorage.removeItem(key);
            } else {
                await AsyncStorage.removeItem(key);
            }
        } catch (error) {
            console.error(`Error removing ${key}:`, error);
        }
    }
};

interface CreateInspectionProps {
    onNavigateBack: () => void;
    onNext: (data: any) => void;
}

const CreateInspection = ({ onNavigateBack, onNext }: CreateInspectionProps) => {
    const [formData, setFormData] = useState({
        address: 'Raumoth Eduardoland NewBenny,lincoln grove Park KR',
        client: 'Akrom',
        inspectionType: 'Mid term',
        date: new Date(),
        time: new Date(),
        keyLocation: 'With landlord',
        additionalNotes: '',
        bathroom: '02',
        bedroom: '04',
        images: [] as string[] // Add images array to formData
    });

    const [showInspectionTypeDropdown, setShowInspectionTypeDropdown] = useState(false);
    const [showKeyLocationDropdown, setShowKeyLocationDropdown] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    const inspectionTypes = [
        'Initial Inspection',
        'Mid term',
        'Final Inspection',
        'Maintenance Inspection',
        'Other'
    ];

    const keyLocations = [
        'With Owner',
        'With Agent',
        'In Lockbox',
        'With landlord',
        'With Tenant',
        'Other'
    ];

    const handleInspectionTypeSelect = (type: string) => {
        setFormData({ ...formData, inspectionType: type });
        setShowInspectionTypeDropdown(false);
    };

    const handleKeyLocationSelect = (location: string) => {
        setFormData({ ...formData, keyLocation: location });
        setShowKeyLocationDropdown(false);
    };

    const toggleInspectionTypeDropdown = () => {
        setShowInspectionTypeDropdown(!showInspectionTypeDropdown);
        if (!showInspectionTypeDropdown) {
            setShowKeyLocationDropdown(false);
        }
    };

    const toggleKeyLocationDropdown = () => {
        setShowKeyLocationDropdown(!showKeyLocationDropdown);
        if (!showKeyLocationDropdown) {
            setShowInspectionTypeDropdown(false);
        }
    };

    const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || formData.date;
        setShowDatePicker(Platform.OS === 'ios');
        setFormData({ ...formData, date: currentDate });
    };

    const handleTimeChange = (event, selectedTime) => {
        const currentTime = selectedTime || formData.time;
        setShowTimePicker(Platform.OS === 'ios');
        setFormData({ ...formData, time: currentTime });
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        }).toUpperCase();
    };

    const formatTime = (time: Date) => {
        return time.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    };

    // Load saved data on component mount
    useEffect(() => {
        const loadSavedData = async () => {
            try {
                const savedInspectionData = await Storage.getItem('inspectionData');
                const savedInspectionImages = await Storage.getItem('inspectionImages');

                if (savedInspectionData) {
                    const parsedData = JSON.parse(savedInspectionData);

                    // Convert date string back to Date object if it exists
                    if (parsedData.date) {
                        parsedData.date = new Date(parsedData.date);
                    }

                    // Convert time string back to Date object if it exists
                    if (parsedData.time) {
                        parsedData.time = new Date(parsedData.time);
                    }

                    setFormData(prevData => ({ ...prevData, ...parsedData }));
                }

                if (savedInspectionImages) {
                    const parsedImages = JSON.parse(savedInspectionImages);
                    setFormData(prevData => ({
                        ...prevData,
                        images: parsedImages
                    }));
                }
            } catch (error) {
                console.error('Error loading saved inspection data:', error);
            }
        };

        loadSavedData();
    }, []);

    // Save form data whenever it changes
    useEffect(() => {
        Storage.setItem('inspectionData', JSON.stringify(formData));
    }, [formData]);

    const handleNext = () => {
        // Specifically store any collected images to ensure they persist
        if (formData.images && formData.images.length > 0) {
            Storage.setItem('inspectionImages', JSON.stringify(formData.images));
        }

        // Create the inspection data to pass to the next screen
        const inspectionData = {
            ...formData,
            inspectionDate: formatDate(formData.date),
            inspectionTime: formatTime(formData.time)
        };

        // Call the onNext callback with the inspection data
        onNext(inspectionData);
    };

    // Add states to track focused inputs
    const [focusedInput, setFocusedInput] = useState(null);

    // Add a function to handle input focus
    const handleInputFocus = (inputName) => {
        setFocusedInput(inputName);

        // Close any open dropdowns when focusing on an input
        setShowInspectionTypeDropdown(false);
        setShowKeyLocationDropdown(false);
    };

    // Add a function to handle input blur
    const handleInputBlur = () => {
        setFocusedInput(null);
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onNavigateBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Create Inspection</Text>
                <View style={styles.headerRight} />
            </View>

            <ScrollView style={styles.scrollView}>
                <View style={styles.content}>
                    <Text style={styles.sectionTitle}>Property Details</Text>

                    {/* Address */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Address</Text>
                        <View style={[
                            styles.textInputContainer,
                            focusedInput === 'address' && styles.inputFocused
                        ]}>
                            <TextInput
                                style={styles.textInput}
                                value={formData.address}
                                onChangeText={(text) => setFormData({ ...formData, address: text })}
                                onFocus={() => handleInputFocus('address')}
                                onBlur={handleInputBlur}
                            />
                        </View>
                    </View>

                    {/* Client */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Client</Text>
                        <View style={[
                            styles.textInputContainer,
                            focusedInput === 'client' && styles.inputFocused
                        ]}>
                            <TextInput
                                style={styles.textInput}
                                value={formData.client}
                                onChangeText={(text) => setFormData({ ...formData, client: text })}
                                onFocus={() => handleInputFocus('client')}
                                onBlur={handleInputBlur}
                            />
                        </View>
                    </View>

                    {/* Inspection Type */}
                    <View style={[styles.inputContainer, { zIndex: 1000 }]}>
                        <Text style={styles.inputLabel}>Inspection Type</Text>
                        <TouchableOpacity
                            style={[
                                styles.dropdownInput,
                                showInspectionTypeDropdown && styles.dropdownActive
                            ]}
                            onPress={toggleInspectionTypeDropdown}
                        >
                            <Text style={formData.inspectionType ? styles.inputText : styles.placeholderText}>
                                {formData.inspectionType || 'Inspection type'}
                            </Text>
                            <Ionicons
                                name={showInspectionTypeDropdown ? "chevron-up" : "chevron-down"}
                                size={20}
                                color="#888"
                            />
                        </TouchableOpacity>

                        {showInspectionTypeDropdown && (
                            <View style={[
                                styles.dropdown,
                                styles.dropdownAbsolute
                            ]}>
                                {inspectionTypes.map((type, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={styles.dropdownItem}
                                        onPress={() => handleInspectionTypeSelect(type)}
                                    >
                                        <Text style={styles.dropdownItemText}>{type}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>

                    {/* Date */}
                    <View style={styles.inputContainer}>
                        <TouchableOpacity
                            style={styles.dropdownInput}
                            onPress={() => setShowDatePicker(true)}
                        >
                            <Text style={styles.inputText}>
                                {formatDate(formData.date)}
                            </Text>
                            <Ionicons name="calendar-outline" size={20} color="#888" />
                        </TouchableOpacity>

                        {showDatePicker && (
                            <DateTimePicker
                                value={formData.date}
                                mode="date"
                                display="default"
                                onChange={handleDateChange}
                            />
                        )}
                    </View>

                    {/* Time */}
                    <View style={styles.inputContainer}>
                        <TouchableOpacity
                            style={styles.dropdownInput}
                            onPress={() => setShowTimePicker(true)}
                        >
                            <Text style={styles.inputText}>
                                {formatTime(formData.time)}
                            </Text>
                            <Ionicons name="time-outline" size={20} color="#888" />
                        </TouchableOpacity>

                        {showTimePicker && (
                            <DateTimePicker
                                value={formData.time}
                                mode="time"
                                display="default"
                                onChange={handleTimeChange}
                            />
                        )}
                    </View>

                    {/* Key Location */}
                    <View style={[styles.inputContainer, { zIndex: 999 }]}>
                        <Text style={styles.inputLabel}>Key Location</Text>
                        <TouchableOpacity
                            style={[
                                styles.dropdownInput,
                                showKeyLocationDropdown && styles.dropdownActive
                            ]}
                            onPress={toggleKeyLocationDropdown}
                        >
                            <Text style={formData.keyLocation ? styles.inputText : styles.placeholderText}>
                                {formData.keyLocation || 'Key Location'}
                            </Text>
                            <Ionicons
                                name={showKeyLocationDropdown ? "chevron-up" : "chevron-down"}
                                size={20}
                                color="#888"
                            />
                        </TouchableOpacity>

                        {showKeyLocationDropdown && (
                            <View style={[
                                styles.dropdown,
                                styles.dropdownAbsolute
                            ]}>
                                {keyLocations.map((location, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={styles.dropdownItem}
                                        onPress={() => handleKeyLocationSelect(location)}
                                    >
                                        <Text style={styles.dropdownItemText}>{location}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>

                    {/* Bedroom */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Bedroom</Text>
                        <View style={[
                            styles.textInputContainer,
                            focusedInput === 'bedroom' && styles.inputFocused
                        ]}>
                            <TextInput
                                style={styles.textInput}
                                value={formData.bedroom}
                                onChangeText={(text) => setFormData({ ...formData, bedroom: text })}
                                onFocus={() => handleInputFocus('bedroom')}
                                onBlur={handleInputBlur}
                                keyboardType="numeric"
                            />
                        </View>
                    </View>

                    {/* Bathroom */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Bathroom</Text>
                        <View style={[
                            styles.textInputContainer,
                            focusedInput === 'bathroom' && styles.inputFocused
                        ]}>
                            <TextInput
                                style={styles.textInput}
                                value={formData.bathroom}
                                onChangeText={(text) => setFormData({ ...formData, bathroom: text })}
                                onFocus={() => handleInputFocus('bathroom')}
                                onBlur={handleInputBlur}
                                keyboardType="numeric"
                            />
                        </View>
                    </View>

                    {/* Additional Notes */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Additional Notes (Optional)</Text>
                        <View style={[
                            styles.textInputContainer,
                            focusedInput === 'notes' && styles.inputFocused,
                            { minHeight: 100 }
                        ]}>
                            <TextInput
                                style={[styles.textInput, styles.textArea]}
                                value={formData.additionalNotes}
                                onChangeText={(text) => setFormData({ ...formData, additionalNotes: text })}
                                onFocus={() => handleInputFocus('notes')}
                                onBlur={handleInputBlur}
                                multiline
                                textAlignVertical="top"
                            />
                        </View>
                    </View>

                    {/* Next Button */}
                    <TouchableOpacity
                        style={styles.nextButton}
                        onPress={handleNext}
                    >
                        <Text style={styles.nextButtonText}>Next</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        zIndex: 1,
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
        marginTop: 8,
    },
    inputContainer: {
        marginBottom: 16,
        position: 'relative',
        zIndex: 1,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 8,
        color: '#333',
    },
    textInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        // borderColor: '#ddd',
        borderRadius: 4,
        backgroundColor: '#fff',
    },
    textInput: {
        flex: 1,
        paddingHorizontal: 12,
        paddingVertical: 12,
        fontSize: 16,
    },
    inputFocused: {
        // borderColor: '#ddd',
        borderWidth: 1,
        backgroundColor: '#fff',
    },
    inputIcon: {
        marginRight: 10,
    },
    dropdownInput: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        // borderColor: '#ddd',
        borderRadius: 4,
        paddingHorizontal: 12,
        paddingVertical: 12,
        backgroundColor: '#fff',
    },
    dropdownActive: {
        borderColor: '#000',
        borderWidth: 2,
    },
    dropdown: {
        backgroundColor: '#fff',
        borderWidth: 1,
        // borderColor: '#ddd',
        borderRadius: 4,
        zIndex: 1000,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        maxHeight: 200,
        overflow: 'hidden',
    },
    dropdownAbsolute: {
        position: 'absolute',
        top: 74, // position below the input
        left: 0,
        right: 0,
    },
    dropdownItem: {
        paddingHorizontal: 12,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    dropdownItemText: {
        fontSize: 16,
    },
    textArea: {
        borderWidth: 1,
        // borderColor: '#ddd',
        borderRadius: 4,
        paddingHorizontal: 12,
        paddingVertical: 12,
        fontSize: 16,
        minHeight: 120,
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
    inputText: {
        fontSize: 16,
        color: '#000',
    },
    placeholderText: {
        fontSize: 16,
        color: '#888',
    },
});

export default CreateInspection; 
import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Image,
    Alert,
    Modal,
    Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
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

interface PropertyDetailsProps {
    onNavigateBack: () => void;
    onNext: () => void;
    inspectionData?: any; // This would be properly typed in a real app
}

const PropertyDetails = ({ onNavigateBack, onNext, inspectionData }: PropertyDetailsProps) => {
    const [formData, setFormData] = useState({
        line1: '',
        line2: '',
        city: '',
        state: '',
        country: '',
        postalCode: '',
        reference: '',
        client: '',
        propertyType: '',
        furnishing: '',
        bedRooms: '',
        bathRooms: '',
        carAge: '',
        parking: '',
        additionalNotes: '',
        date: 'October 15, 2024'
    });

    const [coverImage, setCoverImage] = useState<string | null>(null);
    const [showImageOptions, setShowImageOptions] = useState(false);

    // Add state for active dropdowns
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [focusedInput, setFocusedInput] = useState<string | null>(null);
    const [showDatePicker, setShowDatePicker] = useState(false);

    // Load saved data on component mount
    useEffect(() => {
        const loadSavedData = async () => {
            try {
                const savedPropertyData = await Storage.getItem('propertyData');
                const savedCoverImage = await Storage.getItem('propertyCoverImage');

                if (savedPropertyData) {
                    setFormData(JSON.parse(savedPropertyData));
                }

                if (savedCoverImage) {
                    setCoverImage(savedCoverImage);
                }
            } catch (error) {
                console.error('Error loading saved property data:', error);
            }
        };

        loadSavedData();
    }, []);

    // Save form data whenever it changes
    useEffect(() => {
        Storage.setItem('propertyData', JSON.stringify(formData));
    }, [formData]);

    // Save cover image whenever it changes
    useEffect(() => {
        if (coverImage) {
            Storage.setItem('propertyCoverImage', coverImage);
        }
    }, [coverImage]);

    const handleUploadImage = () => {
        // Show the image options modal
        setShowImageOptions(true);
    };

    const handleTakePhoto = async () => {
        try {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestCameraPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert('Permission to access camera was denied');
                    return;
                }
            }

            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (!result.canceled && result.assets.length > 0) {
                setCoverImage(result.assets[0].uri);
                setShowImageOptions(false);
            }
        } catch (error) {
            console.error('Error taking photo:', error);
            Alert.alert('Error', 'There was an error taking the photo.');
        }
    };

    const handleSelectFromGallery = async () => {
        try {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert('Permission to access media library was denied');
                    return;
                }
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (!result.canceled && result.assets.length > 0) {
                setCoverImage(result.assets[0].uri);
                setShowImageOptions(false);
            }
        } catch (error) {
            console.error('Error selecting image from gallery:', error);
            Alert.alert('Error', 'There was an error selecting the image.');
        }
    };

    const handleNext = () => {
        // Here you would typically validate the form and save the data
        onNext();
    };

    // Toggle dropdown function
    const toggleDropdown = (dropdownName) => {
        if (activeDropdown === dropdownName) {
            setActiveDropdown(null);
        } else {
            setActiveDropdown(dropdownName);
            // Close any focused inputs
            setFocusedInput(null);
            // Close date picker if open
            setShowDatePicker(false);
        }
    };

    // Handle input focus
    const handleInputFocus = (inputName: string) => {
        setFocusedInput(inputName);
        // Close any open dropdowns when focusing on an input
        setActiveDropdown(null);
    };

    // Handle input blur
    const handleInputBlur = () => {
        setFocusedInput(null);
    };

    // Toggle date picker
    const toggleDatePicker = () => {
        setShowDatePicker(!showDatePicker);
        // Close any open dropdowns
        setActiveDropdown(null);
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
                    {/* Upload Cover Image */}
                    <View style={styles.uploadSection}>
                        <Text style={styles.sectionLabel}>Upload cover image</Text>
                        <TouchableOpacity
                            style={styles.uploadContainer}
                            onPress={handleUploadImage}
                        >
                            {coverImage ? (
                                <Image source={{ uri: coverImage }} style={styles.coverImage} />
                            ) : (
                                <View style={styles.uploadPlaceholder}>
                                    <MaterialIcons name="photo-camera" size={32} color="#888" />
                                    <Text style={styles.uploadText}>You can Select 4 images</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* Address Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Address</Text>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Line 1</Text>
                            <View style={[
                                styles.textInputContainer,
                                focusedInput === 'line1' && styles.inputFocused
                            ]}>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="Line 1"
                                    value={formData.line1}
                                    onChangeText={(text) => setFormData({ ...formData, line1: text })}
                                    onFocus={() => handleInputFocus('line1')}
                                    onBlur={handleInputBlur}
                                />
                            </View>
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Line 2</Text>
                            <View style={[
                                styles.textInputContainer,
                                focusedInput === 'line2' && styles.inputFocused
                            ]}>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="Line 2"
                                    value={formData.line2}
                                    onChangeText={(text) => setFormData({ ...formData, line2: text })}
                                    onFocus={() => handleInputFocus('line2')}
                                    onBlur={handleInputBlur}
                                />
                            </View>
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>City</Text>
                            <View style={[
                                styles.textInputContainer,
                                focusedInput === 'city' && styles.inputFocused
                            ]}>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="City"
                                    value={formData.city}
                                    onChangeText={(text) => setFormData({ ...formData, city: text })}
                                    onFocus={() => handleInputFocus('city')}
                                    onBlur={handleInputBlur}
                                />
                            </View>
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>State</Text>
                            <View style={[
                                styles.textInputContainer,
                                focusedInput === 'state' && styles.inputFocused
                            ]}>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="State"
                                    value={formData.state}
                                    onChangeText={(text) => setFormData({ ...formData, state: text })}
                                    onFocus={() => handleInputFocus('state')}
                                    onBlur={handleInputBlur}
                                />
                            </View>
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Country</Text>
                            <View style={[
                                styles.textInputContainer,
                                focusedInput === 'country' && styles.inputFocused
                            ]}>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="Country"
                                    value={formData.country}
                                    onChangeText={(text) => setFormData({ ...formData, country: text })}
                                    onFocus={() => handleInputFocus('country')}
                                    onBlur={handleInputBlur}
                                />
                            </View>
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Postal Code</Text>
                            <View style={[
                                styles.textInputContainer,
                                focusedInput === 'postalCode' && styles.inputFocused
                            ]}>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="Postal code"
                                    value={formData.postalCode}
                                    onChangeText={(text) => setFormData({ ...formData, postalCode: text })}
                                    onFocus={() => handleInputFocus('postalCode')}
                                    onBlur={handleInputBlur}
                                />
                            </View>
                        </View>
                    </View>

                    {/* Date picker field in Further Details style */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Further Details</Text>
                        {/* Status Indicator */}
                        <View style={styles.statusIndicator}>
                            <Text style={styles.statusText}>Completed</Text>
                        </View>

                        {/* Date Field */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Date</Text>
                            <TouchableOpacity
                                style={styles.dateInput}
                                onPress={toggleDatePicker}
                            >
                                <Text style={styles.dateText}>{formData.date}</Text>
                                <Ionicons name="calendar-outline" size={20} color="#888" />
                            </TouchableOpacity>

                            {showDatePicker && (
                                <View style={styles.datePickerContainer}>
                                    <View style={styles.calendarHeader}>
                                        <Text style={styles.calendarTitle}>Select Date</Text>
                                    </View>

                                    <TouchableOpacity
                                        style={styles.dateOption}
                                        onPress={() => {
                                            setFormData({ ...formData, date: 'October 15, 2024' });
                                            setShowDatePicker(false);
                                        }}
                                    >
                                        <Text style={styles.dateOptionText}>October 15, 2024</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.dateOption}
                                        onPress={() => {
                                            setFormData({ ...formData, date: 'October 16, 2024' });
                                            setShowDatePicker(false);
                                        }}
                                    >
                                        <Text style={styles.dateOptionText}>October 16, 2024</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.dateOption}
                                        onPress={() => {
                                            setFormData({ ...formData, date: 'October 17, 2024' });
                                            setShowDatePicker(false);
                                        }}
                                    >
                                        <Text style={styles.dateOptionText}>October 17, 2024</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.closeButton}
                                        onPress={() => setShowDatePicker(false)}
                                    >
                                        <Text style={styles.closeButtonText}>Close</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    </View>

                    {/* Create Property Button */}
                    <TouchableOpacity style={styles.createPropertyButton}>
                        <Text style={styles.createPropertyButtonText}>Create Property</Text>
                    </TouchableOpacity>

                    {/* Property Details Section */}
                    <View style={styles.section}>
                        <View style={styles.inputContainer}>
                            <View style={[
                                styles.textInputContainer,
                                focusedInput === 'reference' && styles.inputFocused
                            ]}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Reference"
                                    value={formData.reference}
                                    onChangeText={(text) => setFormData({ ...formData, reference: text })}
                                    onFocus={() => handleInputFocus('reference')}
                                    onBlur={handleInputBlur}
                                />
                            </View>
                        </View>

                        <View style={styles.inputContainer}>
                            <View style={[
                                styles.textInputContainer,
                                focusedInput === 'client' && styles.inputFocused
                            ]}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Client"
                                    value={formData.client}
                                    onChangeText={(text) => setFormData({ ...formData, client: text })}
                                    onFocus={() => handleInputFocus('client')}
                                    onBlur={handleInputBlur}
                                />
                            </View>
                        </View>

                        <View style={[styles.inputContainer, { zIndex: 1000 }]}>
                            <TouchableOpacity
                                style={[
                                    styles.dropdownInput,
                                    activeDropdown === 'propertyType' && styles.dropdownActive
                                ]}
                                onPress={() => toggleDropdown('propertyType')}
                            >
                                <Text style={styles.dropdownPlaceholder}>Property type</Text>
                                <Ionicons
                                    name={activeDropdown === 'propertyType' ? "chevron-up" : "chevron-down"}
                                    size={20}
                                    color="#888"
                                />
                            </TouchableOpacity>

                            {activeDropdown === 'propertyType' && (
                                <View style={styles.dropdownList}>
                                    {['House', 'Flat', 'Apartment', 'Bungalow', 'Maisonette'].map((type) => (
                                        <TouchableOpacity
                                            key={type}
                                            style={styles.dropdownItem}
                                            onPress={() => {
                                                setFormData({ ...formData, propertyType: type });
                                                setActiveDropdown(null);
                                            }}
                                        >
                                            <Text>{type}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        </View>

                        <View style={[styles.inputContainer, { zIndex: 999 }]}>
                            <TouchableOpacity
                                style={[
                                    styles.dropdownInput,
                                    activeDropdown === 'furnishing' && styles.dropdownActive
                                ]}
                                onPress={() => toggleDropdown('furnishing')}
                            >
                                <Text style={styles.dropdownPlaceholder}>Furnishing</Text>
                                <Ionicons
                                    name={activeDropdown === 'furnishing' ? "chevron-up" : "chevron-down"}
                                    size={20}
                                    color="#888"
                                />
                            </TouchableOpacity>

                            {activeDropdown === 'furnishing' && (
                                <View style={styles.dropdownList}>
                                    {['Furnished', 'Unfurnished', 'Part Furnished'].map((type) => (
                                        <TouchableOpacity
                                            key={type}
                                            style={styles.dropdownItem}
                                            onPress={() => {
                                                setFormData({ ...formData, furnishing: type });
                                                setActiveDropdown(null);
                                            }}
                                        >
                                            <Text>{type}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        </View>

                        <View style={styles.inputContainer}>
                            <TouchableOpacity style={styles.dropdownInput}>
                                <Text style={styles.dropdownPlaceholder}>Bed Rooms</Text>
                                <Ionicons name="chevron-down" size={20} color="#888" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.inputContainer}>
                            <TouchableOpacity style={styles.dropdownInput}>
                                <Text style={styles.dropdownPlaceholder}>Bath Rooms</Text>
                                <Ionicons name="chevron-down" size={20} color="#888" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.inputContainer}>
                            <TouchableOpacity style={styles.dropdownInput}>
                                <Text style={styles.dropdownPlaceholder}>Car age</Text>
                                <Ionicons name="chevron-down" size={20} color="#888" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.inputContainer}>
                            <TouchableOpacity style={styles.dropdownInput}>
                                <Text style={styles.dropdownPlaceholder}>Parking</Text>
                                <Ionicons name="chevron-down" size={20} color="#888" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.inputContainer}>
                            <View style={[
                                styles.textInputContainer,
                                focusedInput === 'notes' && styles.inputFocused,
                                { minHeight: 100 }
                            ]}>
                                <TextInput
                                    style={[styles.input, styles.textArea]}
                                    placeholder="Additional Notes"
                                    value={formData.additionalNotes}
                                    onChangeText={(text) => setFormData({ ...formData, additionalNotes: text })}
                                    onFocus={() => handleInputFocus('notes')}
                                    onBlur={handleInputBlur}
                                    multiline
                                    textAlignVertical="top"
                                />
                            </View>
                        </View>
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

            {/* Image Options Modal */}
            <Modal
                visible={showImageOptions}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowImageOptions(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Upload Cover Image</Text>

                        <TouchableOpacity
                            style={styles.modalOption}
                            onPress={handleTakePhoto}
                        >
                            <MaterialIcons name="camera-alt" size={24} color="#000" />
                            <Text style={styles.modalOptionText}>Take Photo</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.modalOption}
                            onPress={handleSelectFromGallery}
                        >
                            <MaterialIcons name="photo-library" size={24} color="#000" />
                            <Text style={styles.modalOptionText}>Choose from Gallery</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.modalCancelButton}
                            onPress={() => setShowImageOptions(false)}
                        >
                            <Text style={styles.modalCancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
    uploadSection: {
        marginBottom: 24,
    },
    sectionLabel: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 8,
    },
    uploadContainer: {
        height: 150,
        borderWidth: 1,
        // borderColor: '#ddd',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
    },
    uploadPlaceholder: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    uploadText: {
        marginTop: 8,
        fontSize: 14,
        color: '#888',
    },
    coverImage: {
        width: '100%',
        height: '100%',
        borderRadius: 8,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 16,
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
    input: {
        flex: 1,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 14,
    },
    inputFocused: {
        // borderColor: '#ddd',
        borderWidth: 1,
        backgroundColor: '#fff',
    },
    dropdownInput: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        // borderColor: '#ddd',
        borderRadius: 4,
        paddingHorizontal: 12,
        paddingVertical: 10,
        backgroundColor: '#fff',
        zIndex: 10,
    },
    dropdownActive: {
        // borderColor: '#ddd',
        borderWidth: 1,
        backgroundColor: '#fff',
    },
    dropdownList: {
        position: 'absolute',
        top: 45,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        borderWidth: 1,
        // borderColor: '#ddd',
        borderRadius: 4,
        zIndex: 999,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        maxHeight: 200,
        overflow: 'hidden',
    },
    dropdownItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    dropdownPlaceholder: {
        fontSize: 14,
        color: '#888',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    createPropertyButton: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 4,
        paddingVertical: 10,
        alignItems: 'center',
        marginBottom: 24,
    },
    createPropertyButtonText: {
        color: '#000',
        fontSize: 14,
        fontWeight: '500',
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
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 20,
        width: '80%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 20,
        textAlign: 'center',
    },
    modalOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    modalOptionText: {
        fontSize: 16,
        marginLeft: 12,
    },
    modalCancelButton: {
        marginTop: 16,
        paddingVertical: 12,
        alignItems: 'center',
    },
    modalCancelButtonText: {
        color: '#ff3b30',
        fontSize: 16,
        fontWeight: '500',
    },
    statusIndicator: {
        backgroundColor: '#4CAF50',
        borderRadius: 20,
        paddingVertical: 4,
        paddingHorizontal: 12,
        alignSelf: 'flex-start',
        marginBottom: 16,
    },
    statusText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '500',
    },
    dateInput: {
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
    dateText: {
        fontSize: 16,
        color: '#000',
    },
    datePickerContainer: {
        position: 'absolute',
        top: 50,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        borderWidth: 1,
        // borderColor: '#ddd',
        borderRadius: 4,
        zIndex: 1000,
        padding: 12,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    calendarHeader: {
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 8,
        marginBottom: 12,
    },
    calendarTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    dateOption: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    dateOptionText: {
        fontSize: 16,
    },
    closeButton: {
        backgroundColor: '#000',
        borderRadius: 4,
        paddingVertical: 8,
        marginTop: 16,
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
});

export default PropertyDetails; 
import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Image,
    TextInput,
    FlatList,
    Modal,
    Pressable,
    Alert,
    ActivityIndicator,
    Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { Ionicons, MaterialIcons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Profile from './Profile';
import CreateInspection from './CreateInspection';
import InspectionConfirmation from './InspectionConfirmation';
import InspectionDetails from './InspectionDetails';
import PropertyDetails from './PropertyDetails';
import RoomSelection from './RoomSelection';
import RoomInspection from './RoomInspection';
import ImageSelection from './ImageSelection';
import DateSelector from './DateSelector';
import InspectionSummary from './InspectionSummary';
import api, { Inspection } from '../services/api';
import * as ImagePicker from 'expo-image-picker';

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

// Mock property data
const propertyData = [
    {
        id: '1',
        title: 'Raumoth Eduardoland NewBenny,lincoln grove Park KR',
        image: null, // Will be replaced with actual image later
        inventoryType: 'Not setup',
        status: 'Completed',
        inspectionDate: '2024 OCT 17',
        bedrooms: '04',
        bathrooms: '02',
    },
    {
        id: '2',
        title: 'Raumoth Eduardoland NewBenny,lincoln grove Park KR',
        image: null, // Will be replaced with actual image later
        inventoryType: 'Not setup',
        status: 'In Progress',
        inspectionDate: '2024 NOV 05',
        bedrooms: '03',
        bathrooms: '02',
    },
];

const Home = () => {
    const { user, logout } = useAuth();
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [showPropertyOptions, setShowPropertyOptions] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [filters, setFilters] = useState({
        completed: false,
        assigned: false,
        inProgress: false
    });
    const [currentScreen, setCurrentScreen] = useState('home');
    const [inspectionData, setInspectionData] = useState({
        address: '',
        client: '',
        inspectionDate: '',
        inspectionTime: '',
        inventoryType: '',
        locationKey: '',
        bathroom: '',
        bedroom: '',
        additionalNotes: ''
    });
    const [selectedRoom, setSelectedRoom] = useState('');
    const [selectedRooms, setSelectedRooms] = useState<string[]>([
        'Schedule of Condition',
        'EV Charger'
    ]);
    const [currentRoomIndex, setCurrentRoomIndex] = useState(0);
    const [roomInspectionData, setRoomInspectionData] = useState({});
    const [roomPhotos, setRoomPhotos] = useState({});
    const [dateTimeData, setDateTimeData] = useState({
        date: '',
        time: '',
        inspectionType: '',
        keyLocation: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [inspections, setInspections] = useState<Inspection[]>([]);
    const [error, setError] = useState('');
    const [currentInspectionId, setCurrentInspectionId] = useState<number | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    // Fetch inspections on component mount
    useEffect(() => {
        fetchInspections();

        // Load saved inspection data from storage if available
        const loadSavedData = async () => {
            try {
                const savedInspectionData = await Storage.getItem('inspectionData');
                const savedSelectedRooms = await Storage.getItem('selectedRooms');
                const savedRoomInspectionData = await Storage.getItem('roomInspectionData');
                const savedRoomPhotos = await Storage.getItem('roomPhotos');

                if (savedInspectionData) {
                    const parsedData = JSON.parse(savedInspectionData);
                    console.log('Loaded saved inspection data:', parsedData);
                    setInspectionData(parsedData);

                    // If there's no address, set a default one for testing
                    if (!parsedData.address) {
                        const defaultData = {
                            ...parsedData,
                            address: 'Raumoth Eduardoland NewBenny,lincoln grove Park KR'
                        };
                        setInspectionData(defaultData);
                        await Storage.setItem('inspectionData', JSON.stringify(defaultData));
                    }
                } else {
                    // Set default data if nothing is saved
                    const defaultData = {
                        address: 'Raumoth Eduardoland NewBenny,lincoln grove Park KR',
                        client: '',
                        inspectionDate: '',
                        inspectionTime: '',
                        inventoryType: '',
                        locationKey: '',
                        bathroom: '',
                        bedroom: '',
                        additionalNotes: ''
                    };
                    setInspectionData(defaultData);
                    await Storage.setItem('inspectionData', JSON.stringify(defaultData));
                }

                if (savedSelectedRooms) {
                    const parsedRooms = JSON.parse(savedSelectedRooms);
                    if (Array.isArray(parsedRooms)) {
                        setSelectedRooms(parsedRooms);
                    }
                }

                if (savedRoomInspectionData) {
                    setRoomInspectionData(JSON.parse(savedRoomInspectionData));
                }

                if (savedRoomPhotos) {
                    setRoomPhotos(JSON.parse(savedRoomPhotos));
                }
            } catch (error) {
                console.error('Error loading saved data:', error);
            }
        };

        loadSavedData();
    }, []);

    // Save inspection data whenever it changes
    useEffect(() => {
        Storage.setItem('inspectionData', JSON.stringify(inspectionData));
    }, [inspectionData]);

    // Save selected rooms whenever they change
    useEffect(() => {
        Storage.setItem('selectedRooms', JSON.stringify(selectedRooms));
    }, [selectedRooms]);

    // Save room inspection data whenever it changes
    useEffect(() => {
        Storage.setItem('roomInspectionData', JSON.stringify(roomInspectionData));
    }, [roomInspectionData]);

    // Save room photos whenever they change
    useEffect(() => {
        Storage.setItem('roomPhotos', JSON.stringify(roomPhotos));
    }, [roomPhotos]);

    const fetchInspections = async () => {
        try {
            setIsLoading(true);
            const response = await api.getInspections();
            if (response.success && response.data) {
                setInspections(response.data);
            } else {
                setError('Failed to fetch inspections');
            }
        } catch (err) {
            setError('An error occurred while fetching inspections');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchInspections();
        setRefreshing(false);
    };

    const handlePropertyPress = (property) => {
        setSelectedProperty(property);
        setShowPropertyOptions(true);
    };

    const handleEditProperty = () => {
        // Handle edit property logic
        console.log('Edit property:', selectedProperty);
        setShowPropertyOptions(false);
    };

    const handleDeleteProperty = () => {
        setShowPropertyOptions(false);
        setShowDeleteModal(true);
    };

    const confirmDeleteProperty = () => {
        // Handle delete property logic
        console.log('Delete property:', selectedProperty);
        setShowDeleteModal(false);
        setSelectedProperty(null);
    };

    const handleFilterChange = (filterName) => {
        setFilters({
            ...filters,
            [filterName]: !filters[filterName]
        });
    };

    const navigateToProfile = () => {
        setCurrentScreen('profile');
    };

    const navigateToHome = () => {
        setCurrentScreen('home');
    };

    const navigateToCreateInspection = () => {
        // Reset inspection data when starting a new inspection
        setInspectionData({
            address: '',
            client: '',
            inspectionDate: '',
            inspectionTime: '',
            inventoryType: '',
            locationKey: '',
            bathroom: '',
            bedroom: '',
            additionalNotes: ''
        });
        setRoomInspectionData({});
        setRoomPhotos({});
        setDateTimeData({
            date: '',
            time: '',
            inspectionType: '',
            keyLocation: ''
        });
        setCurrentInspectionId(null);
        setCurrentScreen('createInspection');
    };

    const handleCreateInspectionNext = (data) => {
        // Update the inspection data with the form data
        const updatedData = {
            ...inspectionData,
            ...data
        };

        // Make sure the address is persisted
        setInspectionData(updatedData);

        // Explicitly save address to storage
        const saveData = async () => {
            try {
                const storedData = await Storage.getItem('inspectionData');
                let parsedData = storedData ? JSON.parse(storedData) : {};
                parsedData = {
                    ...parsedData,
                    ...updatedData
                };
                await Storage.setItem('inspectionData', JSON.stringify(parsedData));
            } catch (error) {
                console.error('Error saving inspection data:', error);
            }
        };

        saveData();

        // Navigate to the confirmation screen
        setCurrentScreen('inspectionConfirmation');
    };

    const handleConfirmationBack = () => {
        // Go back to the create inspection screen
        setCurrentScreen('createInspection');
    };

    const handleConfirmationSave = () => {
        // Navigate to the property details screen
        setCurrentScreen('propertyDetails');
    };

    const handlePropertyDetailsBack = () => {
        // Go back to the confirmation screen
        setCurrentScreen('inspectionConfirmation');
    };

    const handlePropertyDetailsNext = () => {
        // Navigate to the room selection screen
        setCurrentScreen('roomSelection');
    };

    const handleRoomSelectionBack = () => {
        // Go back to the property details screen
        setCurrentScreen('propertyDetails');
    };

    const handleSaveRoomSelection = (selectedItems) => {
        setSelectedRooms(selectedItems);
        Storage.setItem('selectedRooms', JSON.stringify(selectedItems));
        setCurrentRoomIndex(0);
        setSelectedRoom(selectedItems[0]);
        setCurrentScreen('dateSelector');
    };

    const handleDateSelectorBack = () => {
        // Go back to the room selection screen
        setCurrentScreen('roomSelection');
    };

    const handleDateSelection = async (date, time, inspectionType, keyLocation) => {
        // Save the date and time data
        setDateTimeData({
            date,
            time,
            inspectionType,
            keyLocation
        });

        // Update the inspection data with the date/time information
        const updatedInspectionData = {
            ...inspectionData,
            inspectionDate: date,
            inspectionTime: time,
            inventoryType: inspectionType,
            locationKey: keyLocation
        };

        setInspectionData(updatedInspectionData);

        try {
            // Save the inspection data to the API
            setIsLoading(true);
            const response = await api.createInspection(updatedInspectionData);

            if (response.success && response.data) {
                // Save the inspection ID for future updates
                setCurrentInspectionId(response.data.id);

                // Navigate to the inspection summary screen
                setCurrentScreen('inspectionSummary');
            } else {
                Alert.alert('Error', 'Failed to save inspection data. Please try again.');
            }
        } catch (err) {
            Alert.alert('Error', 'Failed to save inspection data. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRoomSelectionNext = () => {
        // This is now handled by handleSaveRoomSelection
        // Keeping this for backward compatibility
        if (selectedRooms.length > 0) {
            setSelectedRoom(selectedRooms[0]);
            setCurrentRoomIndex(0);
            setCurrentScreen('imageSelection');
        } else {
            // Navigate to the inspection details screen if no rooms are selected
            setCurrentScreen('inspectionDetails');
        }
    };

    const handleSelectRoom = (roomName) => {
        // Set the selected room and navigate to the image selection screen
        setSelectedRoom(roomName);
        // Find the index of the selected room in the selectedRooms array
        const index = selectedRooms.indexOf(roomName);
        setCurrentRoomIndex(index >= 0 ? index : 0);
        setCurrentScreen('imageSelection');
    };

    const handleImageSelectionBack = () => {
        // Go back to the room selection screen
        setCurrentScreen('roomSelection');
    };

    const pickImageFromGallery = async () => {
        try {
            // Request permission
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert('Permission Required', 'Sorry, we need camera roll permissions to make this work!');
                    return;
                }
            }

            // Launch image picker
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 0.8,
            });

            if (!result.canceled && result.assets.length > 0) {
                const imageUri = result.assets[0].uri;

                // In a real app, we would upload the image to a server
                // For now, just store it locally
                const updatedRoomPhotos = {
                    ...roomPhotos,
                    [selectedRoom]: [...(roomPhotos[selectedRoom] || []), imageUri]
                };

                setRoomPhotos(updatedRoomPhotos);
                Storage.setItem('roomPhotos', JSON.stringify(updatedRoomPhotos));
            }
        } catch (error) {
            console.error('Error picking image:', error);
            Alert.alert('Error', 'Failed to pick image. Please try again.');
        }
    };

    const takePhotoWithCamera = async () => {
        try {
            // Request camera permission
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestCameraPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert('Permission Required', 'Sorry, we need camera permissions to make this work!');
                    return;
                }
            }

            // Launch camera
            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 0.8,
            });

            if (!result.canceled && result.assets.length > 0) {
                const imageUri = result.assets[0].uri;

                // In a real app, we would upload the image to a server
                // For now, just store it locally
                const updatedRoomPhotos = {
                    ...roomPhotos,
                    [selectedRoom]: [...(roomPhotos[selectedRoom] || []), imageUri]
                };

                setRoomPhotos(updatedRoomPhotos);
                Storage.setItem('roomPhotos', JSON.stringify(updatedRoomPhotos));
            }
        } catch (error) {
            console.error('Error taking photo:', error);
            Alert.alert('Error', 'Failed to take photo. Please try again.');
        }
    };

    const handleSelectFromGallery = async () => {
        try {
            setIsLoading(true);

            // The pickImageFromGallery function now handles everything internally
            await pickImageFromGallery();

            // Navigate back to room inspection
            setCurrentScreen('roomInspection');
        } catch (error) {
            console.error('Error selecting from gallery:', error);
            Alert.alert('Error', 'Failed to select image from gallery');
        } finally {
            setIsLoading(false);
        }
    };

    const handleTakePhoto = async () => {
        try {
            setIsLoading(true);

            // The takePhotoWithCamera function now handles everything internally
            await takePhotoWithCamera();

            // Navigate back to room inspection
            setCurrentScreen('roomInspection');
        } catch (error) {
            console.error('Error taking photo:', error);
            Alert.alert('Error', 'Failed to take photo');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRoomInspectionBack = () => {
        // Go back to the image selection screen
        setCurrentScreen('imageSelection');
    };

    const handleRoomInspectionSave = async () => {
        try {
            setIsLoading(true);

            // Save the room inspection data
            const updatedRoomData = {
                ...roomInspectionData,
                [selectedRoom]: {
                    completed: true,
                    timestamp: new Date().toISOString(),
                    photos: roomPhotos[selectedRoom] || []
                }
            };

            setRoomInspectionData(updatedRoomData);

            // Save to storage
            Storage.setItem('roomInspectionData', JSON.stringify(updatedRoomData));

            // Ensure all photos are saved properly
            if (roomPhotos[selectedRoom] && roomPhotos[selectedRoom].length > 0) {
                // Save the specific room photos
                const roomPhotosKey = `roomPhotos_${selectedRoom.replace(/\s+/g, '_')}`;
                await Storage.setItem(roomPhotosKey, JSON.stringify(roomPhotos[selectedRoom]));

                // Also save all room photos together
                await Storage.setItem('roomPhotos', JSON.stringify(roomPhotos));

                console.log(`Saved ${roomPhotos[selectedRoom].length} photos for ${selectedRoom}`);
            }

            // Update the inspection with the room data
            if (currentInspectionId) {
                await api.updateInspection(currentInspectionId, {
                    roomInspectionData: updatedRoomData,
                    roomPhotos: roomPhotos
                });
            }

            // Check if there are more rooms to inspect
            if (currentRoomIndex < selectedRooms.length - 1) {
                // Move to the room selection screen to continue with other rooms
                setCurrentScreen('roomSelection');
            } else {
                // If all rooms are inspected, go to the date selector screen
                setCurrentScreen('dateSelector');
            }
        } catch (err) {
            Alert.alert('Error', 'Failed to save room inspection data. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleNextRoom = () => {
        // Navigate to the next room in the list
        if (currentRoomIndex < selectedRooms.length - 1) {
            const nextIndex = currentRoomIndex + 1;
            setCurrentRoomIndex(nextIndex);
            setSelectedRoom(selectedRooms[nextIndex]);
            // Go to image selection for the next room
            setCurrentScreen('imageSelection');
        } else {
            // If we're at the last room, go to the date selector screen
            setCurrentScreen('dateSelector');
        }
    };

    const handlePreviousRoom = () => {
        // Navigate to the previous room in the list
        if (currentRoomIndex > 0) {
            const prevIndex = currentRoomIndex - 1;
            setCurrentRoomIndex(prevIndex);
            setSelectedRoom(selectedRooms[prevIndex]);
            // Stay in the room inspection screen for the previous room
            // We don't go back to image selection since we already have photos
        } else {
            // If we're at the first room, go back to the room selection screen
            setCurrentScreen('roomSelection');
        }
    };

    const handleInspectionSummaryBack = () => {
        // Go back to the date selector screen
        setCurrentScreen('dateSelector');
    };

    const handleEditInspectionInfo = () => {
        // Navigate to the date selector to edit inspection info
        setCurrentScreen('dateSelector');
    };

    const handleEditInspectionReport = () => {
        // Navigate to the room selection screen to edit the report
        setCurrentScreen('roomSelection');
    };

    const handleSubmitInspection = async () => {
        try {
            setIsLoading(true);

            // Prepare the complete inspection data with proper status type
            const completeInspectionData = {
                ...inspectionData,
                roomInspectionData,
                selectedRooms,
                dateTimeData,
                status: 'completed' as const,
                submittedAt: new Date().toISOString()
            };

            let response;

            if (currentInspectionId) {
                // Update existing inspection
                response = await api.updateInspection(currentInspectionId, completeInspectionData);
            } else {
                // Create new inspection
                response = await api.createInspection(completeInspectionData);
            }

            if (response.success && response.data) {
                // Clear the saved data after successful submission
                await Storage.removeItem('inspectionData');
                await Storage.removeItem('selectedRooms');
                await Storage.removeItem('roomInspectionData');
                await Storage.removeItem('roomPhotos');

                // Reset the state
                setInspectionData({
                    address: '',
                    client: '',
                    inspectionDate: '',
                    inspectionTime: '',
                    inventoryType: '',
                    locationKey: '',
                    bathroom: '',
                    bedroom: '',
                    additionalNotes: ''
                });
                setSelectedRooms([]);
                setRoomInspectionData({});
                setRoomPhotos({});
                setDateTimeData({
                    date: '',
                    time: '',
                    inspectionType: '',
                    keyLocation: ''
                });

                // Navigate back to home
                setCurrentScreen('home');

                // Refresh the inspections list
                fetchInspections();

                Alert.alert('Success', 'Inspection submitted successfully!');
            } else {
                Alert.alert('Error', response.error || 'Failed to submit inspection');
            }
        } catch (err) {
            Alert.alert('Error', 'An error occurred while submitting the inspection');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInspectionDetailsBack = () => {
        // Go back to the room selection screen
        setCurrentScreen('roomSelection');
    };

    const handleInspectionDetailsNext = () => {
        // In a real app, this would navigate to the next step or complete the process
        // For now, we'll just go back to the home screen
        setCurrentScreen('home');
    };

    const handleViewInspection = (inspection) => {
        if (inspection && inspection.id) {
            setCurrentInspectionId(inspection.id);
            setCurrentScreen('inspectionDetails');
        } else {
            console.error('Invalid inspection object', inspection);
        }
    };

    const renderInspectionItem = ({ item }) => (
        <TouchableOpacity
            style={styles.inspectionCard}
            onPress={() => handleViewInspection(item)}
        >
            {/* Inspection Image */}
            <View style={styles.inspectionImageContainer}>
                {item.photos && item.photos.length > 0 ? (
                    <Image
                        source={{ uri: item.photos[0].uri || item.photos[0].url }}
                        style={styles.inspectionImage}
                    />
                ) : (
                    <View style={styles.emptyImageContainer}>
                        <MaterialIcons name="photo-camera" size={32} color="#ccc" />
                        <Text style={styles.emptyImageText}>No Images</Text>
                    </View>
                )}
            </View>

            <View style={styles.inspectionHeader}>
                <Text style={styles.inspectionAddress} numberOfLines={1}>{item.address}</Text>
                <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>{item.status}</Text>
                </View>
            </View>

            <View style={styles.inspectionDetails}>
                <View style={styles.detailRow}>
                    <MaterialIcons name="event" size={16} color="#666" />
                    <Text style={styles.detailText}>{item.inspectionDate}</Text>
                </View>

                <View style={styles.detailRow}>
                    <MaterialIcons name="person" size={16} color="#666" />
                    <Text style={styles.detailText}>{item.client}</Text>
                </View>

                <View style={styles.detailRow}>
                    <MaterialIcons name="home" size={16} color="#666" />
                    <Text style={styles.detailText}>
                        {item.bedroom} bed, {item.bathroom} bath
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    // Filter inspections based on the selected filters
    const filteredInspections = inspections.filter((inspection: any) => {
        if (filters.completed && inspection.status.toLowerCase() !== 'completed') {
            return false;
        }
        if (filters.assigned && !inspection.assignedTo) {
            return false;
        }
        if (filters.inProgress && inspection.status.toLowerCase() !== 'in progress') {
            return false;
        }
        return true;
    });

    // Loading overlay
    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#000" />
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    if (currentScreen === 'profile') {
        return <Profile onNavigateToHome={navigateToHome} />;
    }

    if (currentScreen === 'createInspection') {
        return (
            <CreateInspection
                onNavigateBack={navigateToHome}
                onNext={handleCreateInspectionNext}
            />
        );
    }

    if (currentScreen === 'inspectionConfirmation') {
        return (
            <InspectionConfirmation
                onNavigateBack={handleConfirmationBack}
                onSave={handleConfirmationSave}
                inspectionData={inspectionData}
            />
        );
    }

    if (currentScreen === 'propertyDetails') {
        return (
            <PropertyDetails
                onNavigateBack={handlePropertyDetailsBack}
                onNext={handlePropertyDetailsNext}
                inspectionData={inspectionData}
            />
        );
    }

    if (currentScreen === 'roomSelection') {
        return (
            <RoomSelection
                onNavigateBack={handleRoomSelectionBack}
                onNext={handleRoomSelectionNext}
                onSelectRoom={handleSelectRoom}
                onSaveSelection={handleSaveRoomSelection}
            />
        );
    }

    if (currentScreen === 'dateSelector') {
        return (
            <DateSelector
                onNavigateBack={handleDateSelectorBack}
                onSelect={handleDateSelection}
                initialData={dateTimeData}
            />
        );
    }

    if (currentScreen === 'imageSelection') {
        return (
            <ImageSelection
                onNavigateBack={handleImageSelectionBack}
                onSelectFromGallery={handleSelectFromGallery}
                onTakePhoto={handleTakePhoto}
                roomName={selectedRoom}
            />
        );
    }

    if (currentScreen === 'roomInspection') {
        return (
            <RoomInspection
                onNavigateBack={handleRoomInspectionBack}
                onSave={handleRoomInspectionSave}
                onNextRoom={handleNextRoom}
                onPreviousRoom={handlePreviousRoom}
                roomName={selectedRoom}
                totalRooms={selectedRooms.length}
                currentRoomIndex={currentRoomIndex}
            />
        );
    }

    if (currentScreen === 'inspectionSummary') {
        return (
            <InspectionSummary
                onNavigateBack={handleInspectionSummaryBack}
                onEditInfo={handleEditInspectionInfo}
                onEditReport={handleEditInspectionReport}
                onSubmit={handleSubmitInspection}
                inspectionData={inspectionData}
                roomsInspected={selectedRooms}
                roomInspectionData={roomInspectionData}
            />
        );
    }

    if (currentScreen === 'inspectionDetails') {
        return (
            <InspectionDetails
                onNavigateBack={handleInspectionDetailsBack}
                onNext={handleInspectionDetailsNext}
                inspectionData={inspectionData}
            />
        );
    }

    // Home screen with list of inspections
    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>DigiProp</Text>
                <View style={styles.headerRight}>
                    <TouchableOpacity
                        style={styles.filterButton}
                        onPress={() => setShowFilterModal(true)}
                    >
                        <Feather name="filter" size={22} color="#000" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={navigateToProfile}>
                        <MaterialIcons name="account-circle" size={28} color="#000" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search inspections..."
                    placeholderTextColor="#888"
                />
                <TouchableOpacity style={styles.searchButton}>
                    <Ionicons name="search" size={20} color="#000" />
                </TouchableOpacity>
            </View>

            {/* Inspections List */}
            {filteredInspections.length > 0 ? (
                <FlatList
                    data={filteredInspections}
                    renderItem={renderInspectionItem}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={styles.listContainer}
                    onRefresh={onRefresh}
                    refreshing={refreshing}
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <MaterialIcons name="home-work" size={64} color="#ccc" />
                    <Text style={styles.emptyText}>No inspections yet</Text>
                    <Text style={styles.emptySubtext}>
                        Create your first inspection by tapping the button below
                    </Text>
                </View>
            )}

            {/* Create Inspection Button */}
            <View style={styles.createButtonContainer}>
                <TouchableOpacity
                    style={styles.createButton}
                    onPress={navigateToCreateInspection}
                >
                    <MaterialIcons name="add" size={24} color="#fff" />
                    <Text style={styles.createButtonText}>Create Inspection</Text>
                </TouchableOpacity>
            </View>

            {/* Filter Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={showFilterModal}
                onRequestClose={() => setShowFilterModal(false)}
            >
                <View style={styles.filterModalContainer}>
                    <View style={styles.filterModalContent}>
                        <View style={styles.filterModalHeader}>
                            <Text style={styles.filterModalTitle}>Filter</Text>
                            <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                                <Ionicons name="close" size={24} color="#000" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.filterOptions}>
                            <TouchableOpacity
                                style={styles.filterOption}
                                onPress={() => handleFilterChange('completed')}
                            >
                                <Text style={styles.filterOptionText}>Completed</Text>
                                <View style={[
                                    styles.filterCheckbox,
                                    filters.completed && styles.filterCheckboxSelected
                                ]}>
                                    {filters.completed && (
                                        <Ionicons name="checkmark" size={16} color="#fff" />
                                    )}
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.filterOption}
                                onPress={() => handleFilterChange('assigned')}
                            >
                                <Text style={styles.filterOptionText}>Assigned</Text>
                                <View style={[
                                    styles.filterCheckbox,
                                    filters.assigned && styles.filterCheckboxSelected
                                ]}>
                                    {filters.assigned && (
                                        <Ionicons name="checkmark" size={16} color="#fff" />
                                    )}
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.filterOption}
                                onPress={() => handleFilterChange('inProgress')}
                            >
                                <Text style={styles.filterOptionText}>In Progress</Text>
                                <View style={[
                                    styles.filterCheckbox,
                                    filters.inProgress && styles.filterCheckboxSelected
                                ]}>
                                    {filters.inProgress && (
                                        <Ionicons name="checkmark" size={16} color="#fff" />
                                    )}
                                </View>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            style={styles.applyFilterButton}
                            onPress={() => setShowFilterModal(false)}
                        >
                            <Text style={styles.applyFilterButtonText}>Apply Filters</Text>
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
        backgroundColor: '#f5f5f5',
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
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    filterButton: {
        marginRight: 16,
        padding: 4,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    searchInput: {
        flex: 1,
        height: 40,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        paddingHorizontal: 12,
        fontSize: 14,
    },
    searchButton: {
        marginLeft: 12,
    },
    listContainer: {
        padding: 16,
    },
    inspectionCard: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    inspectionImageContainer: {
        height: 150,
        borderRadius: 8,
        overflow: 'hidden',
        marginBottom: 12,
        backgroundColor: '#f0f0f0',
    },
    inspectionImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    emptyImageContainer: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyImageText: {
        marginTop: 8,
        fontSize: 14,
        color: '#999',
    },
    inspectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    inspectionAddress: {
        fontSize: 16,
        fontWeight: '600',
        flex: 1,
    },
    statusBadge: {
        backgroundColor: '#4CAF50',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 4,
    },
    statusText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '500',
    },
    inspectionDetails: {
        marginTop: 8,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    detailText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 8,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 16,
        color: '#333',
    },
    emptySubtext: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginTop: 8,
    },
    createButtonContainer: {
        position: 'absolute',
        bottom: 24,
        left: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        paddingHorizontal: 16,
        zIndex: 10,
    },
    createButton: {
        backgroundColor: '#000',
        borderRadius: 28,
        paddingVertical: 12,
        paddingHorizontal: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
        maxWidth: 300,
        width: '100%',
    },
    createButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#000',
    },
    filterModalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1100,
    },
    filterModalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        padding: 20,
        zIndex: 1101,
    },
    filterModalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    filterModalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    filterOptions: {
        marginBottom: 20,
    },
    filterOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    filterOptionText: {
        fontSize: 16,
    },
    filterCheckbox: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 1,
        // borderColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center',
    },
    filterCheckboxSelected: {
        backgroundColor: '#4CAF50',
        borderColor: '#4CAF50',
    },
    applyFilterButton: {
        backgroundColor: '#000',
        borderRadius: 4,
        paddingVertical: 12,
        alignItems: 'center',
    },
    applyFilterButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default Home; 
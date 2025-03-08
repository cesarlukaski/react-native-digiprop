import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Image,
    FlatList,
    Dimensions,
    ProgressBarAndroid,
    Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

interface RoomInspectionProps {
    onNavigateBack: () => void;
    onSave: () => void;
    onNextRoom?: () => void;
    onPreviousRoom?: () => void;
    roomName: string;
    totalRooms?: number;
    currentRoomIndex?: number;
}

// Add an interface for the Photo type
interface Photo {
    id: string;
    uri: string;
}

// Add an interface for the DoorFrame type
interface DoorFrame {
    id: string;
    name: string;
    condition: string;
    photos: Photo[];
}

const RoomInspection = ({
    onNavigateBack,
    onSave,
    onNextRoom,
    onPreviousRoom,
    roomName,
    totalRooms = 1,
    currentRoomIndex = 0
}: RoomInspectionProps) => {
    const [doorFrames, setDoorFrames] = useState<DoorFrame[]>([
        { id: '1', name: 'Door frame', condition: 'Good', photos: [] },
        { id: '2', name: 'Door frame', condition: 'Good', photos: [] }
    ]);
    const [condition, setCondition] = useState('Good');
    const [notes, setNotes] = useState('');
    const [photos, setPhotos] = useState([]);
    const [checklistItems, setChecklistItems] = useState([
        { id: '1', name: 'Walls Condition', checked: false },
        { id: '2', name: 'Flooring Condition', checked: false },
        { id: '3', name: 'Lighting Functionality', checked: false },
        { id: '4', name: 'Windows & Blinds', checked: false },
        { id: '5', name: 'Electrical Outlets', checked: false }
    ]);

    const screenWidth = Dimensions.get('window').width;
    const photoSize = (screenWidth - 80) / 4; // 4 photos per row with padding

    const handleAddPhoto = (doorFrameId) => {
        // In a real app, this would open the device's camera or image picker
        // For demo purposes, we'll add a placeholder image
        const newPhoto = {
            id: Date.now().toString(),
            uri: 'https://via.placeholder.com/150',
        };

        setDoorFrames(doorFrames.map(frame =>
            frame.id === doorFrameId
                ? { ...frame, photos: [...frame.photos, newPhoto] }
                : frame
        ));
    };

    const handleRemovePhoto = (doorFrameId, photoId) => {
        setDoorFrames(doorFrames.map(frame =>
            frame.id === doorFrameId
                ? { ...frame, photos: frame.photos.filter(photo => photo.id !== photoId) }
                : frame
        ));
    };

    const toggleChecklistItem = (id) => {
        setChecklistItems(
            checklistItems.map(item =>
                item.id === id ? { ...item, checked: !item.checked } : item
            )
        );
    };

    const calculateProgress = () => {
        return ((currentRoomIndex + 1) / totalRooms) * 100;
    };

    const renderDoorFrame = (doorFrame) => (
        <View key={doorFrame.id} style={styles.doorFrameContainer}>
            <View style={styles.doorFrameHeader}>
                <Text style={styles.doorFrameTitle}>{doorFrame.name}</Text>
                <View style={styles.doorFrameActions}>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleAddPhoto(doorFrame.id)}
                    >
                        <MaterialIcons name="photo-camera" size={20} color="#000" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                        <MaterialIcons name="edit" size={20} color="#000" />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.conditionContainer}>
                <Text style={styles.conditionLabel}>Condition</Text>
                <Text style={styles.conditionValue}>{doorFrame.condition}</Text>
            </View>

            <View style={styles.photoGrid}>
                {doorFrame.photos.length > 0 ? (
                    doorFrame.photos.map(photo => (
                        <View key={photo.id} style={[styles.photoContainer, { width: photoSize, height: photoSize }]}>
                            <Image source={{ uri: photo.uri }} style={styles.photo} />
                            <TouchableOpacity
                                style={styles.removePhotoButton}
                                onPress={() => handleRemovePhoto(doorFrame.id, photo.id)}
                            >
                                <MaterialIcons name="close" size={16} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    ))
                ) : null}

                {/* Always show at least one empty photo placeholder */}
                {Array.from({ length: Math.max(1, 4 - doorFrame.photos.length) }).map((_, index) => (
                    <TouchableOpacity
                        key={`empty-${index}`}
                        style={[styles.emptyPhotoContainer, { width: photoSize, height: photoSize }]}
                        onPress={() => handleAddPhoto(doorFrame.id)}
                    />
                ))}
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onNavigateBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{roomName}</Text>
                <View style={styles.headerRight} />
            </View>

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
                {Platform.OS === 'android' ? (
                    <ProgressBarAndroid
                        styleAttr="Horizontal"
                        indeterminate={false}
                        progress={calculateProgress() / 100}
                        style={styles.progressBar}
                    />
                ) : (
                    <View style={styles.progressBarIOS}>
                        <View
                            style={[
                                styles.progressFill,
                                { width: `${calculateProgress()}%` }
                            ]}
                        />
                    </View>
                )}
                <Text style={styles.progressText}>
                    {currentRoomIndex + 1} of {totalRooms} rooms
                </Text>
            </View>

            <ScrollView style={styles.scrollView}>
                <View style={styles.content}>
                    {doorFrames.map(renderDoorFrame)}
                </View>
            </ScrollView>

            {/* Navigation Buttons */}
            <View style={styles.navigationContainer}>
                {onPreviousRoom && (
                    <TouchableOpacity
                        style={styles.navigationButton}
                        onPress={onPreviousRoom}
                    >
                        <Ionicons name="arrow-back" size={20} color="#000" />
                        <Text style={styles.navigationButtonText}>Previous</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={onSave}
                >
                    <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>

                {onNextRoom && (
                    <TouchableOpacity
                        style={styles.navigationButton}
                        onPress={onNextRoom}
                    >
                        <Text style={styles.navigationButtonText}>Next</Text>
                        <Ionicons name="arrow-forward" size={20} color="#000" />
                    </TouchableOpacity>
                )}
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
    progressContainer: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#f9f9f9',
    },
    progressBar: {
        height: 4,
        width: '100%',
    },
    progressBarIOS: {
        height: 4,
        width: '100%',
        backgroundColor: '#eee',
        borderRadius: 2,
    },
    progressFill: {
        height: 4,
        backgroundColor: '#000',
        borderRadius: 2,
    },
    progressText: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
        textAlign: 'right',
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: 16,
    },
    doorFrameContainer: {
        marginBottom: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 16,
    },
    doorFrameHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    doorFrameTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    doorFrameActions: {
        flexDirection: 'row',
    },
    actionButton: {
        padding: 6,
        marginLeft: 8,
    },
    conditionContainer: {
        marginBottom: 12,
    },
    conditionLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    conditionValue: {
        fontSize: 14,
        color: '#333',
    },
    photoGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 8,
    },
    photoContainer: {
        margin: 4,
        position: 'relative',
    },
    photo: {
        width: '100%',
        height: '100%',
        borderRadius: 4,
    },
    emptyPhotoContainer: {
        margin: 4,
        borderWidth: 1,
        // borderColor: '#ddd',
        borderRadius: 4,
        backgroundColor: '#f9f9f9',
    },
    removePhotoButton: {
        position: 'absolute',
        top: 4,
        right: 4,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    navigationContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    navigationButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
    },
    navigationButtonText: {
        fontSize: 14,
        color: '#000',
        marginHorizontal: 4,
    },
    saveButton: {
        backgroundColor: '#000',
        borderRadius: 4,
        paddingVertical: 12,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default RoomInspection; 
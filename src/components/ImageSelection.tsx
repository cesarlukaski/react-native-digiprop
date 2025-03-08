import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
    ScrollView,
    Alert,
    Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

interface ImageSelectionProps {
    onNavigateBack: () => void;
    onSelectFromGallery: () => void;
    onTakePhoto: () => void;
    roomName: string;
}

const ImageSelection = ({
    onNavigateBack,
    onSelectFromGallery,
    onTakePhoto,
    roomName
}: ImageSelectionProps) => {
    const [selectedImages, setSelectedImages] = useState<string[]>([]);

    const pickImage = async () => {
        try {
            // Request permission 
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert('Permission Required', 'Sorry, we need camera roll permissions to make this work!');
                    return;
                }
            }

            // Pick multiple images
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: false,
                allowsMultipleSelection: true,
                quality: 0.8,
            });

            if (!result.canceled && result.assets.length > 0) {
                const newImages = result.assets.map(asset => asset.uri);
                setSelectedImages([...selectedImages, ...newImages]);
                // Also call the parent handler
                onSelectFromGallery();
            }
        } catch (error) {
            console.error('Error picking image:', error);
            Alert.alert('Error', 'Failed to pick image. Please try again.');
        }
    };

    const takePicture = async () => {
        try {
            // Request camera permission
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestCameraPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert('Permission Required', 'Sorry, we need camera permissions to make this work!');
                    return;
                }
            }

            // Take a picture
            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 0.8,
            });

            if (!result.canceled && result.assets.length > 0) {
                setSelectedImages([...selectedImages, result.assets[0].uri]);
                // Also call the parent handler
                onTakePhoto();
            }
        } catch (error) {
            console.error('Error taking picture:', error);
            Alert.alert('Error', 'Failed to take picture. Please try again.');
        }
    };

    const removeImage = (index: number) => {
        const newImages = [...selectedImages];
        newImages.splice(index, 1);
        setSelectedImages(newImages);
    };

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

            <ScrollView style={styles.scrollView}>
                <View style={styles.content}>
                    {/* Image Icon */}
                    <View style={styles.imageIconContainer}>
                        <MaterialIcons name="photo-library" size={64} color="#000" />
                        <Text style={styles.selectImagesText}>Add photos for {roomName}</Text>
                    </View>

                    {/* Selected Images Preview */}
                    {selectedImages.length > 0 && (
                        <View style={styles.previewContainer}>
                            <Text style={styles.previewTitle}>Selected Images</Text>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.previewScroll}
                            >
                                {selectedImages.map((uri, index) => (
                                    <View key={`${uri}-${index}`} style={styles.imagePreviewContainer}>
                                        <Image source={{ uri }} style={styles.imagePreview} />
                                        <TouchableOpacity
                                            style={styles.removeImageButton}
                                            onPress={() => removeImage(index)}
                                        >
                                            <Feather name="x" size={16} color="#fff" />
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </ScrollView>
                        </View>
                    )}

                    {/* Gallery Button */}
                    <TouchableOpacity
                        style={styles.galleryButton}
                        onPress={pickImage}
                    >
                        <MaterialIcons name="photo-library" size={20} color="#000" style={styles.buttonIcon} />
                        <Text style={styles.galleryButtonText}>Select from Gallery</Text>
                    </TouchableOpacity>

                    {/* Camera Button */}
                    <TouchableOpacity
                        style={styles.cameraButton}
                        onPress={takePicture}
                    >
                        <MaterialIcons name="camera-alt" size={20} color="#fff" style={styles.buttonIcon} />
                        <Text style={styles.cameraButtonText}>Take Photo</Text>
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
    },
    scrollView: {
        flex: 1,
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
    content: {
        padding: 16,
        alignItems: 'center',
    },
    imageIconContainer: {
        alignItems: 'center',
        marginBottom: 24,
        marginTop: 16,
    },
    selectImagesText: {
        fontSize: 16,
        fontWeight: '500',
        marginTop: 16,
    },
    previewContainer: {
        width: '100%',
        marginBottom: 24,
    },
    previewTitle: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 12,
    },
    previewScroll: {
        paddingBottom: 8,
    },
    imagePreviewContainer: {
        position: 'relative',
        marginRight: 12,
    },
    imagePreview: {
        width: 100,
        height: 100,
        borderRadius: 8,
    },
    removeImageButton: {
        position: 'absolute',
        top: -8,
        right: -8,
        backgroundColor: '#ff3b30',
        borderRadius: 12,
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    galleryButton: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 4,
        paddingVertical: 12,
        alignItems: 'center',
        marginBottom: 12,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    buttonIcon: {
        marginRight: 8,
    },
    galleryButtonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '500',
    },
    cameraButton: {
        width: '100%',
        backgroundColor: '#000',
        borderRadius: 4,
        paddingVertical: 12,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    cameraButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
});

export default ImageSelection; 
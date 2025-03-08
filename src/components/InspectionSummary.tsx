import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Image,
    Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

interface InspectionSummaryProps {
    onNavigateBack: () => void;
    onEditInfo: () => void;
    onEditReport: () => void;
    onSubmit: () => void;
    inspectionData: {
        address: string;
        client: string;
        inspectionDate: string;
        inspectionTime: string;
        inventoryType: string;
        locationKey: string;
        bathroom: string;
        bedroom: string;
    };
    roomsInspected: string[];
    roomInspectionData: Record<string, any>;
}

const InspectionSummary = ({
    onNavigateBack,
    onEditInfo,
    onEditReport,
    onSubmit,
    inspectionData,
    roomsInspected,
    roomInspectionData
}: InspectionSummaryProps) => {
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    // Count completed rooms
    const completedRooms = Object.keys(roomInspectionData).filter(
        room => roomInspectionData[room]?.completed
    ).length;

    const handleSubmitPress = () => {
        setShowConfirmModal(true);
    };

    const handleConfirmSubmit = () => {
        setShowConfirmModal(false);
        onSubmit();
    };

    const handleCancelSubmit = () => {
        setShowConfirmModal(false);
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onNavigateBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Inspection Info</Text>
                <View style={styles.headerRight} />
            </View>

            <ScrollView style={styles.scrollView}>
                <View style={styles.content}>
                    {/* Property Image */}
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' }}
                        style={styles.propertyImage}
                    />

                    <Text style={styles.sectionTitle}>Further Details</Text>

                    {/* Inspection Status */}
                    <View style={styles.fieldContainer}>
                        <Text style={styles.fieldLabel}>Inspection status</Text>
                        <View style={styles.statusContainer}>
                            <Text style={styles.statusText}>Completed</Text>
                        </View>
                    </View>

                    {/* Address */}
                    <View style={styles.fieldContainer}>
                        <Text style={styles.fieldLabel}>Address</Text>
                        <Text style={styles.fieldValue}>{inspectionData.address}</Text>
                    </View>

                    {/* Inspection Date and Time */}
                    <View style={styles.rowContainer}>
                        <View style={[styles.fieldContainer, styles.halfWidth]}>
                            <Text style={styles.fieldLabel}>Inspection Date</Text>
                            <Text style={styles.fieldValue}>{inspectionData.inspectionDate}</Text>
                        </View>
                        <View style={[styles.fieldContainer, styles.halfWidth]}>
                            <Text style={styles.fieldLabel}>Inspection Time</Text>
                            <Text style={styles.fieldValue}>{inspectionData.inspectionTime}</Text>
                        </View>
                    </View>

                    {/* Inventory Type and Location Key */}
                    <View style={styles.rowContainer}>
                        <View style={[styles.fieldContainer, styles.halfWidth]}>
                            <Text style={styles.fieldLabel}>Inventory Type</Text>
                            <Text style={styles.fieldValue}>{inspectionData.inventoryType}</Text>
                        </View>
                        <View style={[styles.fieldContainer, styles.halfWidth]}>
                            <Text style={styles.fieldLabel}>Location Key</Text>
                            <Text style={styles.fieldValue}>{inspectionData.locationKey}</Text>
                        </View>
                    </View>

                    {/* Bathroom and Bedroom */}
                    <View style={styles.rowContainer}>
                        <View style={[styles.fieldContainer, styles.halfWidth]}>
                            <Text style={styles.fieldLabel}>Bathroom</Text>
                            <Text style={styles.fieldValue}>{inspectionData.bathroom}</Text>
                        </View>
                        <View style={[styles.fieldContainer, styles.halfWidth]}>
                            <Text style={styles.fieldLabel}>Bedroom</Text>
                            <Text style={styles.fieldValue}>{inspectionData.bedroom}</Text>
                        </View>
                    </View>

                    {/* Rooms Inspected Summary */}
                    <View style={styles.fieldContainer}>
                        <Text style={styles.fieldLabel}>Rooms Inspected</Text>
                        <Text style={styles.fieldValue}>{completedRooms} of {roomsInspected.length} rooms</Text>
                        <View style={styles.roomsList}>
                            {roomsInspected.map((room, index) => (
                                <View key={index} style={styles.roomItem}>
                                    <MaterialIcons
                                        name={roomInspectionData[room]?.completed ? "check-circle" : "radio-button-unchecked"}
                                        size={16}
                                        color={roomInspectionData[room]?.completed ? "#4CAF50" : "#888"}
                                    />
                                    <Text style={[
                                        styles.roomText,
                                        roomInspectionData[room]?.completed ? styles.completedRoomText : styles.pendingRoomText
                                    ]}>
                                        {room}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.editInfoButton}
                    onPress={onEditInfo}
                >
                    <Text style={styles.editInfoButtonText}>Edit Info</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.editReportButton}
                    onPress={onEditReport}
                >
                    <Text style={styles.editReportButtonText}>Edit Report</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleSubmitPress}
                >
                    <Text style={styles.submitButtonText}>Submit Inspection</Text>
                </TouchableOpacity>
            </View>

            {/* Confirmation Modal */}
            <Modal
                visible={showConfirmModal}
                transparent={true}
                animationType="fade"
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Submit Inspection</Text>
                        <Text style={styles.modalMessage}>
                            Are you sure you want to submit this inspection? Once submitted, it cannot be edited.
                        </Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={styles.modalCancelButton}
                                onPress={handleCancelSubmit}
                            >
                                <Text style={styles.modalCancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.modalConfirmButton}
                                onPress={handleConfirmSubmit}
                            >
                                <Text style={styles.modalConfirmButtonText}>Submit</Text>
                            </TouchableOpacity>
                        </View>
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
    propertyImage: {
        width: '100%',
        height: 150,
        borderRadius: 8,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 16,
    },
    fieldContainer: {
        marginBottom: 16,
    },
    fieldLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
    },
    fieldValue: {
        fontSize: 14,
        color: '#000',
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    halfWidth: {
        width: '48%',
    },
    statusContainer: {
        backgroundColor: '#4CAF50',
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderRadius: 16,
        alignSelf: 'flex-start',
    },
    statusText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '500',
    },
    roomsList: {
        marginTop: 8,
    },
    roomItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    roomText: {
        fontSize: 14,
        marginLeft: 8,
    },
    completedRoomText: {
        color: '#4CAF50',
    },
    pendingRoomText: {
        color: '#888',
    },
    buttonContainer: {
        padding: 16,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    editInfoButton: {
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 4,
        paddingVertical: 12,
        alignItems: 'center',
        marginBottom: 12,
    },
    editInfoButtonText: {
        color: '#000',
        fontSize: 16,
    },
    editReportButton: {
        backgroundColor: '#000',
        borderRadius: 4,
        paddingVertical: 12,
        alignItems: 'center',
        marginBottom: 12,
    },
    editReportButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    submitButton: {
        backgroundColor: '#4CAF50',
        borderRadius: 4,
        paddingVertical: 12,
        alignItems: 'center',
    },
    submitButtonText: {
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
        padding: 24,
        width: '80%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
    },
    modalMessage: {
        fontSize: 14,
        color: '#666',
        marginBottom: 24,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    modalCancelButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginRight: 12,
    },
    modalCancelButtonText: {
        color: '#666',
        fontSize: 14,
    },
    modalConfirmButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 4,
    },
    modalConfirmButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
    },
});

export default InspectionSummary; 
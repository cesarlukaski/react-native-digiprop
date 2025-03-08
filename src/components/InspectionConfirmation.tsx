import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

interface InspectionConfirmationProps {
    onNavigateBack: () => void;
    onSave: () => void;
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
}

const InspectionConfirmation = ({
    onNavigateBack,
    onSave,
    inspectionData
}: InspectionConfirmationProps) => {
    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onNavigateBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Confirmation</Text>
                <View style={styles.headerRight} />
            </View>

            <ScrollView style={styles.scrollView}>
                <View style={styles.content}>
                    {/* Address */}
                    <View style={styles.infoSection}>
                        <View style={styles.infoIcon}>
                            <MaterialIcons name="location-on" size={20} color="#666" />
                        </View>
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Address</Text>
                            <Text style={styles.infoValue}>{inspectionData.address}</Text>
                        </View>
                    </View>

                    {/* Client */}
                    <View style={styles.infoSection}>
                        <View style={styles.infoIcon}>
                            <MaterialIcons name="person" size={20} color="#666" />
                        </View>
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Client</Text>
                            <Text style={styles.infoValue}>{inspectionData.client}</Text>
                        </View>
                    </View>

                    {/* Inspection Date and Time */}
                    <View style={styles.infoRow}>
                        <View style={styles.infoSection}>
                            <View style={styles.infoIcon}>
                                <MaterialIcons name="event" size={20} color="#666" />
                            </View>
                            <View style={styles.infoContent}>
                                <Text style={styles.infoLabel}>Inspection Date</Text>
                                <Text style={styles.infoValue}>{inspectionData.inspectionDate}</Text>
                            </View>
                        </View>

                        <View style={styles.infoSection}>
                            <View style={styles.infoIcon}>
                                <MaterialIcons name="access-time" size={20} color="#666" />
                            </View>
                            <View style={styles.infoContent}>
                                <Text style={styles.infoLabel}>Inspection Time</Text>
                                <Text style={styles.infoValue}>{inspectionData.inspectionTime}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Inventory Type and Location Key */}
                    <View style={styles.infoRow}>
                        <View style={styles.infoSection}>
                            <View style={styles.infoIcon}>
                                <MaterialIcons name="list-alt" size={20} color="#666" />
                            </View>
                            <View style={styles.infoContent}>
                                <Text style={styles.infoLabel}>Inventory Type</Text>
                                <Text style={styles.infoValue}>{inspectionData.inventoryType}</Text>
                            </View>
                        </View>

                        <View style={styles.infoSection}>
                            <View style={styles.infoIcon}>
                                <MaterialIcons name="vpn-key" size={20} color="#666" />
                            </View>
                            <View style={styles.infoContent}>
                                <Text style={styles.infoLabel}>Location Key</Text>
                                <Text style={styles.infoValue}>{inspectionData.locationKey}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Bathroom and Bedroom */}
                    <View style={styles.infoRow}>
                        <View style={styles.infoSection}>
                            <View style={styles.infoIcon}>
                                <MaterialIcons name="bathtub" size={20} color="#666" />
                            </View>
                            <View style={styles.infoContent}>
                                <Text style={styles.infoLabel}>Bathroom</Text>
                                <Text style={styles.infoValue}>{inspectionData.bathroom}</Text>
                            </View>
                        </View>

                        <View style={styles.infoSection}>
                            <View style={styles.infoIcon}>
                                <MaterialIcons name="hotel" size={20} color="#666" />
                            </View>
                            <View style={styles.infoContent}>
                                <Text style={styles.infoLabel}>Bedroom</Text>
                                <Text style={styles.infoValue}>{inspectionData.bedroom}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Save Button */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={onSave}
                >
                    <Text style={styles.saveButtonText}>Save</Text>
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
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    infoSection: {
        flexDirection: 'row',
        marginBottom: 20,
        alignItems: 'flex-start',
        flex: 1,
    },
    infoIcon: {
        width: 24,
        marginRight: 12,
        alignItems: 'center',
    },
    infoContent: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
    },
    infoValue: {
        fontSize: 14,
        color: '#000',
        fontWeight: '500',
    },
    buttonContainer: {
        padding: 16,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#eee',
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

export default InspectionConfirmation; 
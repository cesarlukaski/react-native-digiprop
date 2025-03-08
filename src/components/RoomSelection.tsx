import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    FlatList,
    Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

interface RoomSelectionProps {
    onNavigateBack: () => void;
    onNext: () => void;
    onSelectRoom: (room: string) => void;
    onSaveSelection: (selectedItems: string[]) => void;
}

const RoomSelection = ({ onNavigateBack, onNext, onSelectRoom, onSaveSelection }: RoomSelectionProps) => {
    const [selectedItems, setSelectedItems] = useState<string[]>([
        'Schedule of Condition',
        'EV Charger'
    ]);
    const [showAllItems, setShowAllItems] = useState(false);

    const allRoomItems = [
        { id: 'schedule', name: 'Schedule of Condition', icon: 'clipboard-text-outline' },
        { id: 'evcharger', name: 'EV Charger', icon: 'ev-station' },
        { id: 'meter', name: 'Meter Reading', icon: 'speed' },
        { id: 'keys', name: 'Keys', icon: 'key' },
        { id: 'keyshandover', name: 'Keys handed over at check in', icon: 'key-change' },
        { id: 'health', name: 'Health and safety / smoke and carbon monoxide', icon: 'smoke-detector' },
        { id: 'frontgarden', name: 'Front garden', icon: 'nature-people' },
        { id: 'garage', name: 'Garage', icon: 'garage' },
        { id: 'exterior', name: 'Exterior front', icon: 'home' }
    ];

    // Filter to only show selected items when not in "Add" mode
    const roomItems = showAllItems
        ? allRoomItems
        : allRoomItems.filter(item => selectedItems.includes(item.name));

    const toggleItemSelection = (itemName: string) => {
        if (selectedItems.includes(itemName)) {
            setSelectedItems(selectedItems.filter(item => item !== itemName));
        } else {
            setSelectedItems([...selectedItems, itemName]);
        }
    };

    const handleCancel = () => {
        onNavigateBack();
    };

    const handleSave = () => {
        // Save the selected items and navigate to the next screen
        onSaveSelection(selectedItems);
    };

    const handleAddItem = () => {
        // Show all items for selection
        setShowAllItems(true);
    };

    const handleDoneAdding = () => {
        // Hide all items and show only selected ones
        setShowAllItems(false);
    };

    const renderItem = ({ item }) => {
        const isSelected = selectedItems.includes(item.name);

        return (
            <TouchableOpacity
                style={styles.itemContainer}
                onPress={() => toggleItemSelection(item.name)}
            >
                <View style={styles.itemContent}>
                    {item.icon === 'clipboard-text-outline' || item.icon === 'key-change' ? (
                        <MaterialCommunityIcons name={item.icon} size={24} color="#666" />
                    ) : item.icon === 'ev-station' ? (
                        <MaterialIcons name={item.icon} size={24} color="#666" />
                    ) : (
                        <MaterialIcons name={item.icon} size={24} color="#666" />
                    )}
                    <Text style={styles.itemText}>{item.name}</Text>
                </View>
                <View style={styles.checkboxContainer}>
                    {isSelected ? (
                        <View style={styles.checkedCircle}>
                            <MaterialIcons name="check" size={16} color="#fff" />
                        </View>
                    ) : (
                        <View style={styles.uncheckedCircle} />
                    )}
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onNavigateBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Report</Text>
                {showAllItems ? (
                    <TouchableOpacity style={styles.addButton} onPress={handleDoneAdding}>
                        <Text style={styles.addButtonText}>Done</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
                        <Text style={styles.addButtonText}>+ Add</Text>
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.content}>
                <Text style={styles.sectionTitle}>
                    {showAllItems ? 'Select Items' : 'Selected Items'}
                </Text>

                <FlatList
                    data={roomItems}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContainer}
                />
            </View>

            {/* Bottom Buttons */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={handleCancel}
                >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleSave}
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
    addButton: {
        padding: 4,
    },
    addButtonText: {
        color: '#000',
        fontWeight: '500',
    },
    content: {
        flex: 1,
        padding: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 16,
    },
    listContainer: {
        paddingBottom: 16,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    itemContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemText: {
        fontSize: 14,
        marginLeft: 12,
    },
    checkboxContainer: {
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    uncheckedCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    checkedCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    cancelButton: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        marginRight: 8,
    },
    cancelButtonText: {
        color: '#000',
        fontSize: 16,
    },
    saveButton: {
        flex: 1,
        backgroundColor: '#000',
        borderRadius: 4,
        paddingVertical: 12,
        alignItems: 'center',
        marginLeft: 8,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default RoomSelection; 
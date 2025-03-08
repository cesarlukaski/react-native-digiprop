import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
    TextInput,
    ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

interface DateSelectorProps {
    onNavigateBack: () => void;
    onSelect: (date: string, time: string, inspectionType: string, keyLocation: string) => void;
    initialData?: {
        date?: string;
        time?: string;
        inspectionType?: string;
        keyLocation?: string;
    };
}

const DateSelector = ({
    onNavigateBack,
    onSelect,
    initialData = {}
}: DateSelectorProps) => {
    const [selectedDate, setSelectedDate] = useState(initialData.date || '15');
    const [selectedMonth, setSelectedMonth] = useState('October');
    const [selectedYear, setSelectedYear] = useState('2024');
    const [inspectionType, setInspectionType] = useState(initialData.inspectionType || '');
    const [time, setTime] = useState(initialData.time || '');
    const [keyLocation, setKeyLocation] = useState(initialData.keyLocation || '');
    const [showCalendar, setShowCalendar] = useState(false);
    const [showInspectionTypeDropdown, setShowInspectionTypeDropdown] = useState(false);
    const [showKeyLocationDropdown, setShowKeyLocationDropdown] = useState(false);
    const [focusedInput, setFocusedInput] = useState(null);

    // Generate calendar days
    const daysInMonth = 31; // For simplicity, using 31 days
    const days = Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString());

    // Available months
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Years (current year + 2 years ahead)
    const currentYear = new Date().getFullYear();
    const years = [
        currentYear.toString(),
        (currentYear + 1).toString(),
        (currentYear + 2).toString()
    ];

    const inspectionTypes = [
        'Initial Inspection',
        'Mid-term Inspection',
        'Final Inspection',
        'Maintenance Inspection'
    ];

    const keyLocations = [
        'With Owner',
        'With Agent',
        'In Lockbox',
        'With Tenant'
    ];

    const handleSelectDate = () => {
        const formattedDate = `${selectedMonth} ${selectedDate}, ${selectedYear}`;
        onSelect(formattedDate, time, inspectionType, keyLocation);
    };

    const handleInspectionTypeSelect = (type: string) => {
        setInspectionType(type);
        setShowInspectionTypeDropdown(false);
    };

    const handleKeyLocationSelect = (location: string) => {
        setKeyLocation(location);
        setShowKeyLocationDropdown(false);
    };

    const handleDateSelect = (date: string) => {
        setSelectedDate(date);
    };

    const handleMonthSelect = (month: string) => {
        setSelectedMonth(month);
    };

    const handleYearSelect = (year: string) => {
        setSelectedYear(year);
    };

    // Close all other dropdowns when opening one
    const toggleInspectionTypeDropdown = () => {
        setShowInspectionTypeDropdown(!showInspectionTypeDropdown);
        // Close other dropdowns if opening this one
        if (!showInspectionTypeDropdown) {
            setShowKeyLocationDropdown(false);
            setShowCalendar(false);
        }
    };

    // Close all other dropdowns when opening one
    const toggleKeyLocationDropdown = () => {
        setShowKeyLocationDropdown(!showKeyLocationDropdown);
        // Close other dropdowns if opening this one
        if (!showKeyLocationDropdown) {
            setShowInspectionTypeDropdown(false);
            setShowCalendar(false);
        }
    };

    // Close all other dropdowns when opening the calendar
    const toggleCalendar = () => {
        setShowCalendar(!showCalendar);
        // Close other dropdowns if opening this one
        if (!showCalendar) {
            setShowInspectionTypeDropdown(false);
            setShowKeyLocationDropdown(false);
        }
    };

    // Handle input focus
    const handleInputFocus = (inputName) => {
        setFocusedInput(inputName);
        // Close open dropdowns
        setShowInspectionTypeDropdown(false);
        setShowKeyLocationDropdown(false);
        setShowCalendar(false);
    };

    // Handle input blur
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
                <Text style={styles.headerTitle}>Selection</Text>
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

                    {/* Completed Status */}
                    <View style={styles.statusContainer}>
                        <Text style={styles.statusText}>Completed</Text>
                    </View>

                    {/* Date Selection */}
                    <View style={[styles.inputContainer, { zIndex: 1001 }]}>
                        <Text style={styles.inputLabel}>Date</Text>
                        <TouchableOpacity
                            style={[
                                styles.dropdownInput,
                                showCalendar && styles.dropdownActive
                            ]}
                            onPress={toggleCalendar}
                        >
                            <Text style={styles.inputText}>
                                {`${selectedMonth} ${selectedDate}, ${selectedYear}`}
                            </Text>
                            <Ionicons name="calendar-outline" size={20} color="#888" />
                        </TouchableOpacity>

                        {/* Calendar View */}
                        {showCalendar && (
                            <View style={styles.calendarContainer}>
                                {/* Month Selector */}
                                <View style={styles.datePickerSection}>
                                    <Text style={styles.datePickerLabel}>Month:</Text>
                                    <ScrollView
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                        contentContainerStyle={styles.datePickerOptions}
                                    >
                                        {months.map(month => (
                                            <TouchableOpacity
                                                key={month}
                                                style={[
                                                    styles.dateOption,
                                                    selectedMonth === month && styles.selectedDateOption
                                                ]}
                                                onPress={() => handleMonthSelect(month)}
                                            >
                                                <Text style={[
                                                    styles.dateOptionText,
                                                    selectedMonth === month && styles.selectedDateOptionText
                                                ]}>
                                                    {month}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                </View>

                                {/* Date Selector */}
                                <View style={styles.datePickerSection}>
                                    <Text style={styles.datePickerLabel}>Day:</Text>
                                    <ScrollView
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                        contentContainerStyle={styles.datePickerOptions}
                                    >
                                        {days.map(day => (
                                            <TouchableOpacity
                                                key={day}
                                                style={[
                                                    styles.dateOption,
                                                    selectedDate === day && styles.selectedDateOption
                                                ]}
                                                onPress={() => handleDateSelect(day)}
                                            >
                                                <Text style={[
                                                    styles.dateOptionText,
                                                    selectedDate === day && styles.selectedDateOptionText
                                                ]}>
                                                    {day}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                </View>

                                {/* Year Selector */}
                                <View style={styles.datePickerSection}>
                                    <Text style={styles.datePickerLabel}>Year:</Text>
                                    <ScrollView
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                        contentContainerStyle={styles.datePickerOptions}
                                    >
                                        {years.map(year => (
                                            <TouchableOpacity
                                                key={year}
                                                style={[
                                                    styles.dateOption,
                                                    selectedYear === year && styles.selectedDateOption
                                                ]}
                                                onPress={() => handleYearSelect(year)}
                                            >
                                                <Text style={[
                                                    styles.dateOptionText,
                                                    selectedYear === year && styles.selectedDateOptionText
                                                ]}>
                                                    {year}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                </View>

                                <TouchableOpacity
                                    style={styles.closeCalendarButton}
                                    onPress={() => setShowCalendar(false)}
                                >
                                    <Text style={styles.closeCalendarButtonText}>Done</Text>
                                </TouchableOpacity>
                            </View>
                        )}
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
                            <Text style={inspectionType ? styles.inputText : styles.placeholderText}>
                                {inspectionType || 'Select Inspection Type'}
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

                    {/* Time */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Time</Text>
                        <View style={[
                            styles.textInputContainer,
                            focusedInput === 'time' && styles.inputFocused
                        ]}>
                            <TextInput
                                style={styles.textInput}
                                value={time}
                                onChangeText={setTime}
                                placeholder="Enter time (e.g., 14:30)"
                                placeholderTextColor="#888"
                                onFocus={() => handleInputFocus('time')}
                                onBlur={handleInputBlur}
                            />
                        </View>
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
                            <Text style={keyLocation ? styles.inputText : styles.placeholderText}>
                                {keyLocation || 'Select Key Location'}
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

                    {/* Select Button */}
                    <TouchableOpacity
                        style={styles.selectButton}
                        onPress={handleSelectDate}
                    >
                        <Text style={styles.selectButtonText}>Select</Text>
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
    statusContainer: {
        backgroundColor: '#4CAF50',
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderRadius: 16,
        alignSelf: 'flex-start',
        marginBottom: 16,
    },
    statusText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '500',
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
        // borderColor: '#ddd',
        borderWidth: 1,
        backgroundColor: '#fff',
    },
    inputText: {
        fontSize: 16,
        color: '#000',
    },
    placeholderText: {
        fontSize: 16,
        color: '#888',
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
        top: 74,
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
    selectButton: {
        backgroundColor: '#000',
        borderRadius: 4,
        paddingVertical: 12,
        alignItems: 'center',
        marginTop: 24,
    },
    selectButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    calendarContainer: {
        position: 'absolute',
        top: 50,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        borderWidth: 1,
        // borderColor: '#ddd',
        borderRadius: 4,
        padding: 16,
        zIndex: 1001,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    datePickerSection: {
        marginBottom: 15,
    },
    datePickerLabel: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    datePickerOptions: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
    },
    dateOption: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: '#f0f0f0',
        borderRadius: 20,
        marginRight: 8,
        marginBottom: 8,
    },
    selectedDateOption: {
        backgroundColor: '#000',
    },
    dateOptionText: {
        fontSize: 14,
        color: '#333',
    },
    selectedDateOptionText: {
        color: '#fff',
    },
    closeCalendarButton: {
        backgroundColor: '#000',
        paddingVertical: 10,
        borderRadius: 4,
        alignItems: 'center',
        marginTop: 16,
    },
    closeCalendarButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default DateSelector; 
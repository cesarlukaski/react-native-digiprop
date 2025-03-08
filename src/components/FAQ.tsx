import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    FlatList
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

interface FAQItem {
    id: string;
    question: string;
    answer: string;
    isExpanded: boolean;
}

const FAQ = ({ onNavigateBack }) => {
    const [faqItems, setFaqItems] = useState<FAQItem[]>([
        {
            id: '1',
            question: 'How do I create a new property?',
            answer: 'To create a new property, go to the home screen and tap on the "Create" button at the bottom of the screen. Fill in the required information and tap "Save".',
            isExpanded: false
        },
        {
            id: '2',
            question: 'How do I edit a property?',
            answer: 'To edit a property, go to the property details screen and tap on the edit icon in the top right corner. Make your changes and tap "Save".',
            isExpanded: false
        },
        {
            id: '3',
            question: 'How do I delete a property?',
            answer: 'To delete a property, go to the property details screen and tap on the three dots in the top right corner. Select "Delete" from the menu and confirm your action.',
            isExpanded: false
        },
        {
            id: '4',
            question: 'How do I reset my password?',
            answer: 'To reset your password, go to the login screen and tap on "Forgot Password". Follow the instructions to reset your password.',
            isExpanded: false
        },
        {
            id: '5',
            question: 'How do I update my profile information?',
            answer: 'To update your profile information, go to the profile screen and tap on "Edit Profile". Make your changes and tap "Save".',
            isExpanded: false
        },
        {
            id: '6',
            question: 'How do I contact support?',
            answer: 'To contact support, go to the profile screen and tap on "Report a Problem". Fill in the form and submit your request.',
            isExpanded: false
        },
        {
            id: '7',
            question: 'How do I log out?',
            answer: 'To log out, go to the profile screen and tap on "Log Out" at the bottom of the screen. Confirm your action to log out.',
            isExpanded: false
        },
        {
            id: '8',
            question: 'How do I filter properties?',
            answer: 'To filter properties, go to the home screen and tap on the filter icon in the top right corner. Select your filters and tap "Apply".',
            isExpanded: false
        },
        {
            id: '9',
            question: 'How do I search for a property?',
            answer: 'To search for a property, go to the home screen and use the search bar at the top of the screen. Enter your search query and tap the search icon.',
            isExpanded: false
        },
        {
            id: '10',
            question: 'How do I view my statistics?',
            answer: 'To view your statistics, go to the profile screen. Your statistics are displayed at the top of the screen.',
            isExpanded: false
        }
    ]);

    const toggleExpand = (id: string) => {
        setFaqItems(faqItems.map(item =>
            item.id === id ? { ...item, isExpanded: !item.isExpanded } : item
        ));
    };

    const renderFAQItem = ({ item }: { item: FAQItem }) => (
        <View style={styles.faqItem}>
            <TouchableOpacity
                style={styles.questionContainer}
                onPress={() => toggleExpand(item.id)}
            >
                <Text style={styles.questionText}>{item.question}</Text>
                <MaterialIcons
                    name={item.isExpanded ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                    size={24}
                    color="#666"
                />
            </TouchableOpacity>

            {item.isExpanded && (
                <View style={styles.answerContainer}>
                    <Text style={styles.answerText}>{item.answer}</Text>
                </View>
            )}
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onNavigateBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>FAQ</Text>
                <View style={styles.headerRight} />
            </View>

            <FlatList
                data={faqItems}
                renderItem={renderFAQItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContainer}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
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
    listContainer: {
        padding: 16,
    },
    faqItem: {
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    questionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    questionText: {
        fontSize: 16,
        fontWeight: '500',
        flex: 1,
    },
    answerContainer: {
        padding: 16,
        paddingTop: 0,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    answerText: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
});

export default FAQ; 
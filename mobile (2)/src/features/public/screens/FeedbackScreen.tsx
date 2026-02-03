import { ThemedText } from '@/src/components/themed/ThemedText';
import { ThemedView } from '@/src/components/themed/ThemedView';
import { useThemeColor } from '@/src/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
    useColorScheme,
} from 'react-native';

export default function FeedbackScreen() {
    const colorScheme = useColorScheme();

    const primaryColor = useThemeColor({}, 'primary');
    const textColor = useThemeColor({}, 'text');
    const mutedColor = useThemeColor({}, 'muted');
    const cardColor = useThemeColor({}, 'card');

    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    const categories = [
        { id: 1, name: 'App Experience', icon: 'phone-portrait-outline' },
        { id: 2, name: 'Booking Process', icon: 'calendar-outline' },
        { id: 3, name: 'Navigation', icon: 'navigate-outline' },
        { id: 4, name: 'AI Recommendations', icon: 'sparkles-outline' },
        { id: 5, name: 'Customer Support', icon: 'chatbubble-outline' },
        { id: 6, name: 'Other', icon: 'ellipsis-horizontal-outline' },
    ];

    const ratingLabels = [
        { value: 1, label: 'Poor', emoji: '😞' },
        { value: 2, label: 'Fair', emoji: '😐' },
        { value: 3, label: 'Good', emoji: '😊' },
        { value: 4, label: 'Very Good', emoji: '😄' },
        { value: 5, label: 'Excellent', emoji: '🤩' },
    ];

    const getRatingColor = (star: number, currentRating: number) => {
        if (star <= currentRating) {
            if (currentRating >= 4) return '#FFD700'; // Gold for high ratings
            if (currentRating >= 3) return '#FFA500'; // Orange for medium ratings
            return '#FF6347'; // Red for low ratings
        }
        return mutedColor + '50'; // Muted color for unselected stars
    };

    const submitFeedback = () => {
        // Submit feedback logic
        console.log('Submitting feedback:', { rating, selectedCategory, feedback });
        router.push('/(public)/support/feedback-success' as any); // Assuming this exists or will be created
    };

    return (
        <ThemedView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={styles.backButton}
                    >
                        <Ionicons
                            name="arrow-back"
                            size={24}
                            color={textColor}
                        />
                    </TouchableOpacity>
                    <ThemedText type="title" style={[styles.title, { color: textColor }]}>
                        Share Feedback
                    </ThemedText>
                    <View style={{ width: 24 }} />
                </View>

                {/* Hero Section */}
                <View style={[styles.heroSection, { borderBottomColor: mutedColor + '20' }]}>
                    <Image
                        source={require('@/assets/images/icon.png')}
                        style={styles.heroImage}
                        resizeMode="contain"
                    />
                    <ThemedText type="title" style={[styles.heroTitle, { color: textColor }]}>
                        Help Us Improve!
                    </ThemedText>
                    <ThemedText type="default" style={[styles.heroDescription, { color: mutedColor }]}>
                        Your feedback helps us make Adama Smart Tourism better for everyone.
                    </ThemedText>
                </View>

                {/* Overall Rating */}
                <View style={[styles.section, { borderBottomColor: mutedColor + '20' }]}>
                    <ThemedText type="subtitle" style={[styles.sectionTitle, { color: textColor }]}>
                        Overall Rating
                    </ThemedText>

                    <View style={styles.ratingContainer}>
                        <View style={styles.starsContainer}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <TouchableOpacity
                                    key={star}
                                    onPress={() => setRating(star)}
                                    activeOpacity={0.7}
                                >
                                    <Ionicons
                                        name={star <= rating ? 'star' : 'star-outline'}
                                        size={40}
                                        color={getRatingColor(star, rating)}
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>

                        {rating > 0 && (
                            <View style={styles.ratingLabelContainer}>
                                <ThemedText type="default" style={styles.ratingEmoji}>
                                    {ratingLabels[rating - 1].emoji}
                                </ThemedText>
                                <ThemedText type="default" style={[styles.ratingLabel, { color: primaryColor }]}>
                                    {ratingLabels[rating - 1].label}
                                </ThemedText>
                            </View>
                        )}
                    </View>
                </View>

                {/* Category Selection */}
                <View style={[styles.section, { borderBottomColor: mutedColor + '20' }]}>
                    <ThemedText type="subtitle" style={[styles.sectionTitle, { color: textColor }]}>
                        What would you like to feedback on?
                    </ThemedText>

                    <View style={styles.categoriesGrid}>
                        {categories.map((category) => (
                            <TouchableOpacity
                                key={category.id}
                                style={[
                                    styles.categoryButton,
                                    { backgroundColor: cardColor },
                                    selectedCategory === category.name && [
                                        styles.selectedCategory,
                                        {
                                            backgroundColor: primaryColor + '20',
                                            borderColor: primaryColor
                                        }
                                    ],
                                ]}
                                onPress={() => setSelectedCategory(category.name)}
                                activeOpacity={0.7}
                            >
                                <Ionicons
                                    name={category.icon as any}
                                    size={24}
                                    color={selectedCategory === category.name ? primaryColor : mutedColor}
                                />
                                <ThemedText
                                    type="default"
                                    style={[
                                        styles.categoryName,
                                        { color: mutedColor },
                                        selectedCategory === category.name && [
                                            styles.selectedCategoryName,
                                            { color: primaryColor }
                                        ],
                                    ]}
                                >
                                    {category.name}
                                </ThemedText>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Detailed Feedback */}
                <View style={[styles.section, { borderBottomColor: mutedColor + '20' }]}>
                    <ThemedText type="subtitle" style={[styles.sectionTitle, { color: textColor }]}>
                        Tell us more
                    </ThemedText>

                    <TextInput
                        style={[
                            styles.feedbackInput,
                            {
                                backgroundColor: cardColor,
                                color: textColor,
                                borderColor: mutedColor + '30'
                            }
                        ]}
                        placeholder="What did you like or what can we improve?"
                        placeholderTextColor={mutedColor}
                        value={feedback}
                        onChangeText={setFeedback}
                        multiline
                        numberOfLines={6}
                        textAlignVertical="top"
                    />

                    <ThemedText type="default" style={[styles.charCount, { color: mutedColor }]}>
                        {feedback.length}/500
                    </ThemedText>
                </View>

                {/* Screenshot Upload */}
                <View style={[styles.section, { borderBottomColor: mutedColor + '20' }]}>
                    <ThemedText type="subtitle" style={[styles.sectionTitle, { color: textColor }]}>
                        Add Screenshot (Optional)
                    </ThemedText>

                    <TouchableOpacity
                        style={[
                            styles.uploadButton,
                            {
                                backgroundColor: cardColor,
                                borderColor: mutedColor + '30'
                            }
                        ]}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="camera-outline" size={32} color={mutedColor} />
                        <ThemedText type="default" style={[styles.uploadText, { color: mutedColor }]}>
                            Tap to upload screenshot
                        </ThemedText>
                        <ThemedText type="default" style={[styles.uploadNote, { color: mutedColor }]}>
                            Max 5MB, PNG or JPG
                        </ThemedText>
                    </TouchableOpacity>
                </View>

                {/* Contact Option */}
                <View style={styles.section}>
                    <View style={styles.contactOption}>
                        <Ionicons name="mail-outline" size={24} color={mutedColor} />
                        <View style={styles.contactTexts}>
                            <ThemedText type="default" style={[styles.contactTitle, { color: textColor }]}>
                                Contact me about this feedback
                            </ThemedText>
                            <ThemedText type="default" style={[styles.contactDescription, { color: mutedColor }]}>
                                We may reach out for more details
                            </ThemedText>
                        </View>
                        <Ionicons name="toggle" size={32} color={primaryColor} />
                    </View>
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                    style={[
                        styles.submitButton,
                        { backgroundColor: primaryColor },
                        (rating === 0 || !selectedCategory || !feedback.trim()) && [
                            styles.submitButtonDisabled,
                            { backgroundColor: mutedColor + '30' }
                        ],
                    ]}
                    onPress={submitFeedback}
                    disabled={rating === 0 || !selectedCategory || !feedback.trim()}
                    activeOpacity={0.8}
                >
                    <Ionicons name="paper-plane-outline" size={20} color="white" />
                    <ThemedText type="default" style={styles.submitButtonText}>
                        Submit Feedback
                    </ThemedText>
                </TouchableOpacity>

                {/* Privacy Note */}
                <View style={styles.privacyNote}>
                    <Ionicons name="shield-checkmark-outline" size={16} color={mutedColor} />
                    <ThemedText type="default" style={[styles.privacyText, { color: mutedColor }]}>
                        Your feedback is anonymous unless you choose to share contact details.
                    </ThemedText>
                </View>
            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
    },
    backButton: {
        padding: 8,
        marginLeft: -8,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    heroSection: {
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 40,
        borderBottomWidth: 1,
    },
    heroImage: {
        width: 150,
        height: 150,
        marginBottom: 24,
    },
    heroTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 12,
        textAlign: 'center',
    },
    heroDescription: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
    },
    section: {
        paddingHorizontal: 20,
        paddingVertical: 24,
        borderBottomWidth: 1,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    ratingContainer: {
        alignItems: 'center',
    },
    starsContainer: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 16,
    },
    ratingLabelContainer: {
        alignItems: 'center',
    },
    ratingEmoji: {
        fontSize: 32,
        marginBottom: 8,
    },
    ratingLabel: {
        fontSize: 18,
        fontWeight: '600',
    },
    categoriesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        justifyContent: 'space-between',
    },
    categoryButton: {
        width: '30%',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
    },
    selectedCategory: {
        borderWidth: 2,
    },
    categoryName: {
        marginTop: 8,
        fontSize: 12,
        fontWeight: '500',
        textAlign: 'center',
    },
    selectedCategoryName: {
        fontWeight: '600',
    },
    feedbackInput: {
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        lineHeight: 24,
        minHeight: 150,
        marginBottom: 8,
        borderWidth: 1,
    },
    charCount: {
        textAlign: 'right',
        fontSize: 12,
    },
    uploadButton: {
        alignItems: 'center',
        padding: 40,
        borderRadius: 12,
        borderWidth: 2,
        borderStyle: 'dashed',
    },
    uploadText: {
        marginTop: 12,
        fontSize: 16,
        fontWeight: '500',
    },
    uploadNote: {
        marginTop: 4,
        fontSize: 12,
    },
    contactOption: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    contactTexts: {
        flex: 1,
    },
    contactTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    contactDescription: {
        fontSize: 14,
    },
    submitButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginHorizontal: 20,
        marginVertical: 32,
        paddingVertical: 18,
        borderRadius: 12,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    submitButtonDisabled: {
        opacity: 0.6,
    },
    submitButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    privacyNote: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    privacyText: {
        flex: 1,
        fontSize: 14,
        lineHeight: 20,
    },
});

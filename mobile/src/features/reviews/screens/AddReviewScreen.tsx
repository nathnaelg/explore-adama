import { ThemedText } from '@/src/components/themed/ThemedText';
import { ThemedView } from '@/src/components/themed/ThemedView';
import { useCreateReview } from '@/src/features/reviews/hooks/useReviews';
import { useThemeColor } from '@/src/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useLocalSearchParams } from 'expo-router/build/hooks';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function AddReviewScreen() {
    const { itemId, itemType } = useLocalSearchParams<{ itemId: string, itemType: string }>();
    const { mutate: createReview, isPending } = useCreateReview();

    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');

    const primary = useThemeColor({}, 'primary');
    const text = useThemeColor({}, 'text');
    const muted = useThemeColor({}, 'muted');
    const card = useThemeColor({}, 'card');
    const chip = useThemeColor({}, 'chip');

    const handleSubmit = () => {
        if (!comment.trim()) {
            Alert.alert('Error', 'Please enter a comment');
            return;
        }

        createReview({
            itemId: itemId || '',
            itemType: (itemType as any) || 'PLACE',
            rating,
            comment,
        }, {
            onSuccess: () => {
                Alert.alert('Success', 'Review submitted successfully');
                router.back();
            },
            onError: (err: any) => {
                Alert.alert('Error', err?.response?.data?.message || 'Failed to submit review');
            }
        });
    };

    return (
        <ThemedView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={[styles.header, { backgroundColor: card }]}>
                    <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color={text} /></TouchableOpacity>
                    <ThemedText style={styles.title}>Write a Review</ThemedText>
                    <View style={{ width: 24 }} />
                </View>

                <View style={styles.content}>
                    <View style={styles.section}>
                        <ThemedText style={styles.label}>Rate your experience</ThemedText>
                        <View style={styles.starsContainer}>
                            {[1, 2, 3, 4, 5].map(s => (
                                <TouchableOpacity key={s} onPress={() => setRating(s)}>
                                    <Ionicons name={s <= rating ? 'star' : 'star-outline'} size={40} color="#FFD700" />
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <View style={styles.section}>
                        <ThemedText style={styles.label}>Your thoughts</ThemedText>
                        <TextInput
                            style={[styles.input, { color: text, backgroundColor: chip }]}
                            placeholder="Share your experience..."
                            placeholderTextColor={muted}
                            value={comment}
                            onChangeText={setComment}
                            multiline
                            numberOfLines={6}
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.submitButton, { backgroundColor: primary }, (!comment.trim() || isPending) && { opacity: 0.5 }]}
                        onPress={handleSubmit}
                        disabled={!comment.trim() || isPending}
                    >
                        {isPending ? <ActivityIndicator color="white" /> : <ThemedText style={styles.submitText}>Submit Review</ThemedText>}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20 },
    title: { fontSize: 20, fontWeight: 'bold' },
    content: { padding: 20, gap: 32 },
    section: { gap: 16, alignItems: 'center' },
    label: { fontSize: 18, fontWeight: '600' },
    starsContainer: { flexDirection: 'row', gap: 12 },
    input: { width: '100%', borderRadius: 12, padding: 16, minHeight: 150, textAlignVertical: 'top', fontSize: 16 },
    submitButton: { width: '100%', paddingVertical: 18, borderRadius: 16, alignItems: 'center', marginTop: 20 },
    submitText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});

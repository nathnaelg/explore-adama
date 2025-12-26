import { ThemedText } from '@/src/components/themed/ThemedText';
import { ThemedView } from '@/src/components/themed/ThemedView';
import { useCreateBlogPost } from '@/src/features/blog/hooks/useBlog';
import { blogService } from '@/src/features/blog/services/blog.service';
import { useThemeColor } from '@/src/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

interface FormData {
    title: string;
    body: string;
    category: string;
    tags: string[];
}

interface UploadImage {
    uri: string;
    name: string;
    type: string;
}

export default function CreateBlogScreen() {
    const { mutate: createPost, isPending: submitting } = useCreateBlogPost();

    const bg = useThemeColor({}, 'bg');
    const card = useThemeColor({}, 'card');
    const text = useThemeColor({}, 'text');
    const muted = useThemeColor({}, 'muted');
    const primary = useThemeColor({}, 'primary');

    const [categories] = useState<string[]>(['Nature', 'Food', 'History', 'Hotels', 'Culture']);
    const [formData, setFormData] = useState<FormData>({
        title: '',
        body: '',
        category: 'Nature',
        tags: [],
    });
    const [images, setImages] = useState<UploadImage[]>([]);

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') return;

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: false, // Design suggest single cover photo first
            quality: 0.8,
        });

        if (!result.canceled) {
            const asset = result.assets[0];
            const manipulated = await ImageManipulator.manipulateAsync(
                asset.uri,
                [{ resize: { width: 1200 } }],
                { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
            );
            const newImage = { uri: manipulated.uri, name: `img_${Date.now()}.jpg`, type: 'image/jpeg' };
            setImages([newImage]); // Replace existing for cover photo style
        }
    };

    const handleSubmit = () => {
        // Map UI category back to API values if needed, or just use as is if backend supports it.
        // Assuming backend handles these strings or we map them.
        const apiData = {
            ...formData,
            category: formData.category.toLowerCase(),
        };

        createPost(apiData, {
            onSuccess: async (post) => {
                if (images.length > 0) {
                    for (const img of images) {
                        const fd = new FormData();
                        fd.append('file', img as any);
                        await blogService.uploadMedia(post.id, fd);
                    }
                }
                Alert.alert('Success', 'Post submitted for review');
                router.back();
            },
            onError: (err: any) => {
                Alert.alert('Error', err?.response?.data?.message || 'Failed to create post');
            }
        });
    };

    const isFormValid = formData.title.trim() && formData.body.trim();

    // Derived UI Colors
    const inputBg = card;
    const inputBorder = muted + '30';
    const placeholderColor = muted;

    return (
        <ThemedView style={[styles.container, { backgroundColor: bg }]}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: card }]}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="close" size={28} color={text} />
                </TouchableOpacity>
                <ThemedText style={[styles.headerTitle, { color: text }]}>Create Blog</ThemedText>
                <TouchableOpacity onPress={() => Alert.alert('Drafts', 'Drafts feature coming soon!')}>
                    <ThemedText style={[styles.draftsText, { color: primary }]}>Drafts</ThemedText>
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Cover Photo Area */}
                <TouchableOpacity
                    style={[styles.coverPhotoContainer, { borderColor: inputBorder, backgroundColor: card }]}
                    onPress={pickImage}
                >
                    {images.length > 0 ? (
                        <Image source={{ uri: images[0].uri }} style={styles.coverImage} resizeMode="cover" />
                    ) : (
                        <View style={styles.uploadPlaceholder}>
                            <View style={[styles.iconCircle, { backgroundColor: primary + '20' }]}>
                                <Ionicons name="camera" size={24} color={primary} />
                                <View style={[styles.plusBadge, { backgroundColor: primary, borderColor: card }]}>
                                    <Ionicons name="add" size={10} color="white" />
                                </View>
                            </View>
                            <ThemedText style={[styles.uploadTitle, { color: text }]}>Add Cover Photo</ThemedText>
                            <ThemedText style={[styles.uploadSubtitle, { color: muted }]}>Tap to upload your travel memory</ThemedText>
                        </View>
                    )}
                </TouchableOpacity>

                {/* Title Input */}
                <View style={styles.inputGroup}>
                    <ThemedText style={[styles.label, { color: text }]}>Title</ThemedText>
                    <TextInput
                        style={[styles.input, { backgroundColor: inputBg, borderColor: inputBorder, color: text }]}
                        placeholder="My Trip to Adama..."
                        placeholderTextColor={placeholderColor}
                        value={formData.title}
                        onChangeText={v => setFormData(p => ({ ...p, title: v }))}
                    />
                </View>

                {/* Category Selection */}
                <View style={styles.inputGroup}>
                    <ThemedText style={[styles.label, { color: text }]}>Category</ThemedText>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
                        {categories.map((cat) => {
                            const isSelected = formData.category === cat;
                            return (
                                <TouchableOpacity
                                    key={cat}
                                    style={[
                                        styles.categoryChip,
                                        isSelected
                                            ? { backgroundColor: primary, borderColor: primary }
                                            : { backgroundColor: inputBg, borderColor: inputBorder }
                                    ]}
                                    onPress={() => setFormData(p => ({ ...p, category: cat }))}
                                >
                                    <ThemedText style={[styles.categoryText, isSelected ? { fontWeight: 'bold', color: 'white' } : { color: text }]}>
                                        {cat}
                                    </ThemedText>
                                    {isSelected && <Ionicons name="checkmark" size={16} color="white" style={{ marginLeft: 4 }} />}
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>

                {/* Description Input */}
                <View style={styles.inputGroup}>
                    <ThemedText style={[styles.label, { color: text }]}>Description</ThemedText>
                    <TextInput
                        style={[styles.textArea, { backgroundColor: inputBg, borderColor: inputBorder, color: text }]}
                        placeholder="Share your experience here... What did you see? How was the food?"
                        placeholderTextColor={placeholderColor}
                        value={formData.body}
                        onChangeText={v => setFormData(p => ({ ...p, body: v }))}
                        multiline
                        textAlignVertical="top"
                    />
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                    style={[styles.submitButton, { backgroundColor: primary }, (!isFormValid || submitting) && { opacity: 0.7 }]}
                    onPress={handleSubmit}
                    disabled={!isFormValid || submitting}
                >
                    {submitting ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <>
                            <ThemedText style={[styles.submitText, { color: 'white' }]}>Submit</ThemedText>
                            <Ionicons name="paper-plane" size={20} color="white" style={{ marginLeft: 8 }} />
                        </>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
    },
    headerTitle: { fontSize: 20, fontWeight: 'bold' },
    draftsText: { fontSize: 16, fontWeight: '600' },
    scrollContent: { padding: 20, paddingBottom: 40 },

    // Cover Photo Styles
    coverPhotoContainer: {
        height: 200,
        borderWidth: 2,
        borderStyle: 'dashed',
        borderRadius: 20,
        marginBottom: 24,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
    },
    uploadPlaceholder: { alignItems: 'center' },
    iconCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
        position: 'relative',
    },
    plusBadge: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 16,
        height: 16,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
    },
    uploadTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
    uploadSubtitle: { fontSize: 12 },
    coverImage: { width: '100%', height: '100%' },

    // Input Group Styles
    inputGroup: { marginBottom: 24 },
    label: { fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
    input: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
    },
    categoryScroll: { flexDirection: 'row' },
    categoryChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 25,
        borderWidth: 1,
        marginRight: 10,
    },
    categoryText: { fontSize: 14 },
    textArea: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        height: 200, // Large text area
    },

    // Submit Button
    submitButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        borderRadius: 12,
        marginTop: 8, // Just a bit of space from inputs
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    submitText: { fontSize: 18, fontWeight: 'bold' },
});

import { ThemedText } from '@/src/components/themed/ThemedText';
import { ThemedView } from '@/src/components/themed/ThemedView';
import { useAuth } from '@/src/features/auth/contexts/AuthContext';
import { useBlogPost, useUpdateBlogPost } from '@/src/features/blog/hooks/useBlog';
import { useThemeColor } from '@/src/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useLocalSearchParams } from 'expo-router/build/hooks';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function EditBlogScreen() {
    const { t } = useTranslation();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { user } = useAuth();

    const { data: post, isLoading } = useBlogPost(id || '');
    const { mutate: updatePost, isPending: saving } = useUpdateBlogPost();

    const bg = useThemeColor({}, 'bg');
    const card = useThemeColor({}, 'card');
    const text = useThemeColor({}, 'text');
    const muted = useThemeColor({}, 'muted');
    const primary = useThemeColor({}, 'primary');
    const chip = useThemeColor({}, 'chip');

    const [formData, setFormData] = useState({ title: '', body: '', category: '', tags: [] as string[] });

    useEffect(() => {
        if (post) {
            setFormData({
                title: post.title,
                body: post.body,
                category: post.category || '',
                tags: post.tags || [],
            });
        }
    }, [post]);

    const handleSave = () => {
        if (!id) return;
        updatePost({ id, data: formData }, {
            onSuccess: () => {
                Alert.alert(t('common.success'), t('blog.updateSuccess'));
                router.back();
            },
            onError: (err: any) => {
                Alert.alert(t('common.error'), err?.response?.data?.message || t('common.error'));
            }
        });
    };

    if (isLoading) {
        return (
            <ThemedView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={primary} />
            </ThemedView>
        );
    }

    const isFormValid = formData.title.trim() && formData.body.trim();

    return (
        <ThemedView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={[styles.header, { backgroundColor: card }]}>
                    <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color={text} /></TouchableOpacity>
                    <ThemedText style={styles.title}>{t('blog.editStory')}</ThemedText>
                    <TouchableOpacity onPress={handleSave} disabled={!isFormValid || saving}>
                        {saving ? <ActivityIndicator size="small" color={primary} /> : <ThemedText style={{ color: primary, fontWeight: 'bold' }}>{t('common.save')}</ThemedText>}
                    </TouchableOpacity>
                </View>

                <View style={styles.content}>
                    <TextInput
                        style={[styles.titleInput, { color: text, borderBottomColor: muted + '30' }]}
                        value={formData.title}
                        onChangeText={v => setFormData(p => ({ ...p, title: v }))}
                        placeholder={t('blog.title')}
                        placeholderTextColor={muted}
                    />

                    <TextInput
                        style={[styles.bodyInput, { color: text }]}
                        value={formData.body}
                        onChangeText={v => setFormData(p => ({ ...p, body: v }))}
                        multiline
                        placeholder={t('common.content')}
                        placeholderTextColor={muted}
                    />
                </View>
            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20 },
    title: { fontSize: 20, fontWeight: 'bold' },
    content: { padding: 20, gap: 20 },
    titleInput: { fontSize: 24, fontWeight: 'bold', borderBottomWidth: 1, paddingVertical: 10 },
    bodyInput: { fontSize: 16, minHeight: 400, textAlignVertical: 'top' },
});

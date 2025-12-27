
import { ThemedText } from '@/src/components/themed/ThemedText';
import { ThemedView } from '@/src/components/themed/ThemedView';
import { useAuth } from '@/src/features/auth/contexts/AuthContext';
import { useChatMessages, useSendMessage } from '@/src/features/chat/hooks/useChat';
import { ChatMessage } from '@/src/features/chat/types';
import { useThemeColor } from '@/src/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ActivityIndicator,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SESSION_KEY = '@chat_session_id';

export default function ChatScreen() {
    const { t } = useTranslation();
    const [message, setMessage] = useState('');
    const [sessionId, setSessionId] = useState<string | undefined>();
    const { isGuest } = useAuth();
    const scrollViewRef = useRef<ScrollView>(null);
    const insets = useSafeAreaInsets();
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);

    const bg = useThemeColor({}, 'bg');
    const card = useThemeColor({}, 'card');
    const text = useThemeColor({}, 'text');
    const muted = useThemeColor({}, 'muted');
    const primary = useThemeColor({}, 'primary');

    useEffect(() => {
        const keyboardWillShowListener = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
            () => setKeyboardVisible(true)
        );
        const keyboardWillHideListener = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
            () => setKeyboardVisible(false)
        );

        return () => {
            keyboardWillShowListener.remove();
            keyboardWillHideListener.remove();
        };
    }, []);

    const { data: messagesData, isLoading } = useChatMessages(sessionId);
    const { mutate: sendMessage, isPending } = useSendMessage();

    const messages = useMemo(() => messagesData || [], [messagesData]);

    useEffect(() => {
        loadSession();
    }, []);

    useEffect(() => {
        // Scroll to bottom when messages change
        if (messages.length > 0) {
            setTimeout(() => {
                scrollViewRef.current?.scrollToEnd({ animated: true });
            }, 100);
        }
    }, [messages]);

    const loadSession = async () => {
        const savedSessionId = await AsyncStorage.getItem(SESSION_KEY);
        if (savedSessionId) {
            setSessionId(savedSessionId);
        }
    };

    const handleSend = () => {
        if (isGuest) {
            router.push({
                pathname: '/(modals)/guest-prompt',
                params: {
                    title: t('chat.signInRequired'),
                    message: t('chat.guestMsg'),
                    icon: 'chatbubbles-outline'
                }
            });
            return;
        }
        if (!message.trim() || isPending) return;

        const userMessage = message.trim();
        setMessage('');

        sendMessage(
            { sessionId, message: userMessage },
            {
                onSuccess: (data) => {
                    if (!sessionId && data.sessionId) {
                        setSessionId(data.sessionId);
                        AsyncStorage.setItem(SESSION_KEY, data.sessionId);
                    }
                },
            }
        );
    };

    return (
        <ThemedView style={styles.container}>
            {/* Header */}
            <View style={[
                styles.header,
                {
                    backgroundColor: card,
                    paddingTop: insets.top + 10,
                }
            ]}>
                <View style={styles.headerLeft}>
                    <View style={[styles.avatar, { backgroundColor: primary }]}>
                        <Ionicons name="sparkles" size={20} color="#fff" />
                    </View>
                    <View>
                        <ThemedText style={[styles.title, { color: text }]}>{t('chat.assistantTitle')}</ThemedText>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                            <View style={[styles.onlineDot, { backgroundColor: '#10B981' }]} />
                            <ThemedText style={[styles.status, { color: muted }]}>{t('chat.online')}</ThemedText>
                        </View>
                    </View>
                </View>
            </View>

            {/* Chat Area + Input */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
            >
                <ScrollView
                    ref={scrollViewRef}
                    contentContainerStyle={[styles.chatArea, { paddingBottom: 20 }]}
                    style={{ flex: 1, backgroundColor: bg }}
                    onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
                    keyboardShouldPersistTaps="handled"
                >
                    {isLoading && (
                        <View style={{ alignItems: 'center', paddingVertical: 20 }}>
                            <ActivityIndicator size="large" color={primary} />
                            <ThemedText style={{ color: muted, marginTop: 12 }}>{t('chat.loading')}</ThemedText>
                        </View>
                    )}

                    {!isLoading && messages.length === 0 && (
                        <View style={{ alignItems: 'center', paddingVertical: 30, paddingHorizontal: 20 }}>
                            <Ionicons name="chatbubbles-outline" size={48} color={muted} />
                            <ThemedText style={{ color: text, fontSize: 16, fontWeight: 'bold', marginTop: 12, textAlign: 'center' }}>
                                {t('chat.startConversation')}
                            </ThemedText>
                            <ThemedText style={{ color: muted, marginTop: 6, textAlign: 'center', fontSize: 13 }}>
                                {t('chat.askMeAnything')}
                            </ThemedText>
                        </View>
                    )}

                    {messages.map((msg: ChatMessage) => {
                        const isUser = msg.role === 'user' || msg.role === 'USER';

                        return (
                            <View
                                key={msg.id}
                                style={[
                                    styles.messageRow,
                                    isUser && styles.userRow,
                                ]}
                            >
                                {!isUser && (
                                    <View style={[styles.botAvatar, { backgroundColor: primary }]}>
                                        <Ionicons name="sparkles" size={14} color="#fff" />
                                    </View>
                                )}

                                <View
                                    style={[
                                        styles.bubble,
                                        isUser
                                            ? [styles.userBubble, { backgroundColor: primary }]
                                            : [styles.botBubble, { backgroundColor: card }]
                                    ]}
                                >
                                    <ThemedText
                                        style={isUser ? styles.userText : [styles.botText, { color: text }]}
                                    >
                                        {msg.content}
                                    </ThemedText>
                                </View>
                            </View>
                        );
                    })}

                    {isPending && (
                        <View style={[styles.messageRow]}>
                            <View style={[styles.botAvatar, { backgroundColor: primary }]}>
                                <Ionicons name="sparkles" size={14} color="#fff" />
                            </View>
                            <View style={[styles.bubble, styles.botBubble, { backgroundColor: card }]}>
                                <ActivityIndicator size="small" color={primary} />
                            </View>
                        </View>
                    )}
                </ScrollView>

                {/* Input */}
                <View style={[
                    styles.inputRow,
                    {
                        backgroundColor: card,
                        paddingBottom: isKeyboardVisible ? Math.max(insets.bottom, 10) : (insets.bottom + 80),
                        borderTopWidth: 1,
                        borderTopColor: 'rgba(0,0,0,0.05)',
                    }
                ]}>
                    <TextInput
                        value={message}
                        onChangeText={setMessage}
                        placeholder={t('chat.inputPlaceholder')}
                        placeholderTextColor={muted}
                        style={[styles.input, {
                            backgroundColor: bg,
                            color: text
                        }]}
                        multiline
                        maxLength={500}
                        onSubmitEditing={handleSend}
                        editable={!isPending}
                    />
                    <TouchableOpacity
                        style={[
                            styles.sendBtn,
                            { backgroundColor: message.trim() && !isPending ? primary : muted }
                        ]}
                        onPress={handleSend}
                        disabled={!message.trim() || isPending}
                    >
                        {isPending ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <Ionicons name="send" size={18} color="#fff" />
                        )}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>


        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        // paddingTop handled by insets
        paddingHorizontal: 20,
        paddingBottom: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
        zIndex: 10,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    avatar: {
        width: 42,
        height: 42,
        borderRadius: 21,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
    },
    status: {
        fontSize: 12,
    },
    onlineDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    chatArea: {
        padding: 12,
    },
    messageRow: {
        flexDirection: 'row',
        marginBottom: 16,
        alignItems: 'flex-end',
    },
    userRow: {
        justifyContent: 'flex-end',
    },
    botAvatar: {
        width: 26,
        height: 26,
        borderRadius: 13,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
    },
    bubble: {
        maxWidth: '80%',
        padding: 14,
        borderRadius: 18,
    },
    botBubble: {},
    userBubble: {},
    botText: {
        fontSize: 15,
        lineHeight: 22,
    },
    userText: {
        color: '#fff',
        fontSize: 15,
        lineHeight: 22,
    },
    inputRow: {
        flexDirection: 'row',
        padding: 16,
        // paddingBottom handled by insets
        gap: 10,
        alignItems: 'center', // Changed from flex-end to center for better alignment
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.05)',
    },
    input: {
        flex: 1,
        borderRadius: 24,
        paddingHorizontal: 16,
        paddingVertical: 10, // Slightly reduced
        fontSize: 16,
        maxHeight: 100,
    },
    sendBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

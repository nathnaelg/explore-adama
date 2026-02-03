import { Skeleton } from '@/src/components/common/Skeleton';
import { useThemeColor } from '@/src/hooks/use-theme-color';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function ChatSkeleton() {
    const bg = useThemeColor({}, 'bg');
    const card = useThemeColor({}, 'card');
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { backgroundColor: bg }]}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: card, paddingTop: insets.top + 10 }]}>
                <View style={styles.headerLeft}>
                    <Skeleton width={42} height={42} borderRadius={21} />
                    <View style={{ gap: 6 }}>
                        <Skeleton width={120} height={18} />
                        <Skeleton width={60} height={12} />
                    </View>
                </View>
            </View>

            {/* Messages Area */}
            <View style={styles.chatArea}>
                {/* Bot Message */}
                <View style={styles.messageRow}>
                    <Skeleton width={26} height={26} borderRadius={13} style={{ marginRight: 8 }} />
                    <Skeleton width="70%" height={60} borderRadius={18} />
                </View>

                {/* User Message */}
                <View style={[styles.messageRow, styles.userRow]}>
                    <Skeleton width="50%" height={40} borderRadius={18} />
                </View>

                {/* Bot Message */}
                <View style={styles.messageRow}>
                    <Skeleton width={26} height={26} borderRadius={13} style={{ marginRight: 8 }} />
                    <Skeleton width="60%" height={80} borderRadius={18} />
                </View>

                {/* User Message */}
                <View style={[styles.messageRow, styles.userRow]}>
                    <Skeleton width="80%" height={50} borderRadius={18} />
                </View>
            </View>

            {/* Input Area */}
            <View style={[styles.inputRow, { backgroundColor: card, paddingBottom: insets.bottom + 20 }]}>
                <Skeleton width="85%" height={44} borderRadius={22} />
                <Skeleton width={44} height={44} borderRadius={22} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    chatArea: {
        flex: 1,
        padding: 12,
        gap: 16,
    },
    messageRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    userRow: {
        justifyContent: 'flex-end',
    },
    inputRow: {
        flexDirection: 'row',
        padding: 16,
        gap: 10,
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.05)',
    },
});

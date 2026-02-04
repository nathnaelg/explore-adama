import { ThemedText } from '@/src/components/themed/ThemedText';
import { useThemeColor } from '@/src/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

interface PasswordRequirementsProps {
    password?: string; // Kept for interface compatibility but not strictly used for checklist anymore
    error?: string;
}

export function PasswordRequirements({ error }: PasswordRequirementsProps) {
    const muted = useThemeColor({}, 'muted');
    // const success = '#10B981'; // Green - valid
    const errorColor = '#EF4444'; // Red - invalid
    const infoColor = '#3B82F6'; // Blue - info

    // Default helper text
    const defaultText = "Your password must be more than 6 characters. The password may contain uppercase letters, lowercase letters, numbers";

    const isError = !!error;
    const message = isError ? error : defaultText;
    const iconName = isError ? 'alert-circle-outline' : 'information-circle-outline';
    const iconColor = isError ? errorColor : infoColor;
    const textColor = isError ? errorColor : infoColor; // Or keep default text color for info? Design seemed to use blueish text for info.

    return (
        <View style={styles.container}>
            <Ionicons
                name={iconName}
                size={16}
                color={iconColor}
                style={styles.icon}
            />
            <ThemedText
                type="default"
                style={[
                    styles.label,
                    { color: textColor, flex: 1 }
                ]}
            >
                {message}
            </ThemedText>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 8,
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'flex-start', // Align top for multi-line text
        paddingRight: 10,
    },
    icon: {
        marginRight: 8,
        marginTop: 2, // Minor adjustment to align with text line height
    },
    label: {
        fontSize: 12,
        lineHeight: 18,
    },
});

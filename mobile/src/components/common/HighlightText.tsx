import { ThemedText } from '@/src/components/themed/ThemedText';
import { useThemeColor } from '@/src/hooks/use-theme-color';
import React from 'react';
import { Text } from 'react-native';

interface HighlightTextProps {
    text: string;
    term: string;
    numberOfLines?: number;
    style?: any;
}

export const HighlightText: React.FC<HighlightTextProps> = ({ text, term, numberOfLines, style }) => {
    const primary = useThemeColor({}, 'primary');
    const defaultColor = useThemeColor({}, 'text');

    if (!term || term.trim() === '') {
        return (
            <ThemedText style={style} numberOfLines={numberOfLines}>
                {text}
            </ThemedText>
        );
    }

    // Escape special regex characters
    const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedTerm})`, 'gi');
    const parts = text.split(regex);

    return (
        <ThemedText style={style} numberOfLines={numberOfLines}>
            {parts.map((part, index) => (
                <Text
                    key={index}
                    style={
                        part.toLowerCase() === term.toLowerCase()
                            ? { fontWeight: '800', color: primary }
                            : { color: (style?.color || defaultColor) }
                    }
                >
                    {part}
                </Text>
            ))}
        </ThemedText>
    );
};

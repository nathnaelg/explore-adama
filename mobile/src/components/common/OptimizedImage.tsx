import { Image, ImageProps } from 'expo-image';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useThemeColor } from '../../hooks/use-theme-color';

interface OptimizedImageProps extends ImageProps {
    containerStyle?: ViewStyle;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
    style,
    containerStyle,
    contentFit = 'cover',
    transition = 300,
    ...props
}) => {
    const bg = useThemeColor({}, 'card');

    return (
        <View style={[styles.container, { backgroundColor: bg }, containerStyle]}>
            <Image
                style={[styles.image, style]}
                contentFit={contentFit}
                transition={transition}
                {...props}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
    },
});

import { ThemedText } from '@/src/components/themed/ThemedText';
import { useThemeColor } from '@/src/hooks/use-theme-color';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';

if (Platform.OS === 'web') {
  WebBrowser.maybeCompleteAuthSession();
}

interface SocialLoginButtonsProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const SocialLoginButtons: React.FC<SocialLoginButtonsProps> = ({
  onSuccess,
  onError,
}) => {
  const { socialLogin } = useAuth();
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
  const [isLoadingApple, setIsLoadingApple] = useState(false);

  const card = useThemeColor({}, 'card');
  const text = useThemeColor({}, 'text');
  const chip = useThemeColor({}, 'chip');

  // Google OAuth configuration
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  });

  const handleGoogleLogin = async () => {
    setIsLoadingGoogle(true);
    try {
      const result = await promptAsync();
      if (result.type !== 'success') {
        setIsLoadingGoogle(false);
      }
    } catch (error: any) {
      setIsLoadingGoogle(false);
      onError?.(error.message || 'Failed to start Google login');
    }
  };

  React.useEffect(() => {
    const handleGoogleResponse = async () => {
      if (response?.type === 'success') {
        try {
          const { authentication } = response;

          // Prefer idToken for backend verification
          const token = authentication?.idToken || authentication?.accessToken;

          // Get user info from Google for initial profile setup
          const userInfoResponse = await fetch(
            'https://www.googleapis.com/oauth2/v1/userinfo?alt=json',
            {
              headers: { Authorization: `Bearer ${authentication?.accessToken}` },
            }
          );

          const userInfo = await userInfoResponse.json();

          // Send to backend
          await socialLogin({
            provider: 'google',
            token: token!,
            email: userInfo.email,
            name: userInfo.name,
            image: userInfo.picture,
          });

          onSuccess?.();
        } catch (error: any) {
          onError?.(error.message || 'Google login failed');
        } finally {
          setIsLoadingGoogle(false);
        }
      } else if (response?.type === 'error') {
        setIsLoadingGoogle(false);
        onError?.(response.error?.message || 'Google login failed');
      }
    };

    if (response) {
      handleGoogleResponse();
    }
  }, [response]);

  const handleAppleLogin = async () => {
    if (!AppleAuthentication.isAvailableAsync()) {
      onError?.('Apple Sign-In is not available on this device');
      return;
    }

    setIsLoadingApple(true);
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (!credential.identityToken) {
        throw new Error('No identity token received');
      }

      await socialLogin({
        provider: 'apple',
        token: credential.identityToken,
        email: credential.email || undefined,
        name: credential.fullName
          ? `${credential.fullName.givenName || ''} ${credential.fullName.familyName || ''}`.trim()
          : undefined,
      });

      onSuccess?.();
    } catch (error: any) {
      if (error.code === 'ERR_CANCELED') {
        // User canceled - don't show error
      } else {
        onError?.(error.message || 'Apple login failed');
      }
    } finally {
      setIsLoadingApple(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.socialButton, { backgroundColor: card, borderColor: chip }]}
        onPress={handleGoogleLogin}
        disabled={isLoadingGoogle || isLoadingApple}
      >
        {isLoadingGoogle ? (
          <ActivityIndicator color={text} size="small" />
        ) : (
          <>
            <Image
              source={{ uri: 'https://cdn-icons-png.flaticon.com/512/300/300221.png' }}
              style={styles.socialIcon}
            />
            <ThemedText type="default" style={{ color: text, fontWeight: '600' }}>
              Google
            </ThemedText>
          </>
        )}
      </TouchableOpacity>

      {Platform.OS === 'ios' && (
        <TouchableOpacity
          style={[styles.socialButton, { backgroundColor: card, borderColor: chip }]}
          onPress={handleAppleLogin}
          disabled={isLoadingApple || isLoadingGoogle}
        >
          {isLoadingApple ? (
            <ActivityIndicator color={text} size="small" />
          ) : (
            <>
              <Image
                source={{ uri: 'https://cdn-icons-png.flaticon.com/512/0/747.png' }}
                style={styles.socialIcon}
              />
              <ThemedText type="default" style={{ color: text, fontWeight: '600' }}>
                Apple
              </ThemedText>
            </>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    width: '100%',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
    minWidth: 130,
    justifyContent: 'center',
  },
  socialIcon: {
    width: 20,
    height: 20,
  },
});
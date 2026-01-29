// /home/natye/smart-tourism/src/features/auth/screens/LoginScreen.tsx
import { ThemedText } from '@/src/components/themed/ThemedText';
import { ThemedView } from '@/src/components/themed/ThemedView';
import { useAuth } from '@/src/features/auth/contexts/AuthContext';
import { useThemeColor } from '@/src/hooks/use-theme-color';
import { router } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';


export default function LoginScreen() {
  const { t } = useTranslation();
  // Theme colors
  const bg = useThemeColor({}, 'bg');
  const card = useThemeColor({}, 'card');
  const text = useThemeColor({}, 'text');
  const muted = useThemeColor({}, 'muted');
  const primary = useThemeColor({}, 'primary');
  const accent = useThemeColor({}, 'accent');
  const chip = useThemeColor({}, 'chip');
  const tint = useThemeColor({}, 'tint');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, isLoading: authLoading } = useAuth();


  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert(t('common.error'), t('auth.fillAllFields'));
      return;
    }

    setIsLoading(true);
    try {
      await login({ email, password });
      router.replace('/(tabs)');
    } catch (error: any) {
      console.error('Login error:', error);
      const backendMessage = error.response?.data?.message;
      const errorMessage = Array.isArray(backendMessage)
        ? backendMessage.join('\n')
        : backendMessage;

      Alert.alert(
        t('auth.loginFailed'),
        errorMessage || error.message || t('auth.invalidCredentials')
      );
    } finally {
      setIsLoading(false);
    }
  };



  const isButtonDisabled = isLoading || !email || !password;

  return (
    <ThemedView style={[styles.container, { backgroundColor: bg }]}>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Image
              source={require('@/assets/images/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <ThemedText type="title" style={[styles.appTitle, { color: text }]}>
              {t('common.adamaCity')}
            </ThemedText>
            <ThemedText type="subtitle" style={[styles.welcomeText, { color: muted }]}>
              {t('auth.welcomeBack')}
            </ThemedText>
            <ThemedText type="default" style={[styles.description, { color: muted }]}>
              {t('auth.loginDescription')}
            </ThemedText>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <ThemedText type="default" style={[styles.label, { color: muted }]}>
                {t('auth.emailOrPhone')}
              </ThemedText>
              <TextInput
                style={[styles.input, {
                  backgroundColor: card,
                  borderColor: chip,
                  color: text
                }]}
                placeholder={t('auth.enterEmail')}
                placeholderTextColor={muted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isLoading}
              />
            </View>

            <View style={styles.inputContainer}>
              <ThemedText type="default" style={[styles.label, { color: muted }]}>
                {t('auth.password')}
              </ThemedText>
              <TextInput
                style={[styles.input, {
                  backgroundColor: card,
                  borderColor: chip,
                  color: text
                }]}
                placeholder={t('auth.enterPassword')}
                placeholderTextColor={muted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!isLoading}
              />
              <TouchableOpacity
                style={styles.forgotPassword}
                onPress={() => router.push('/(auth)/forgot-password')}
              >
                <ThemedText
                  type="link"
                  lightColor={primary}
                  darkColor={primary}
                >
                  {t('auth.forgotPassword')}
                </ThemedText>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[
                styles.loginButton,
                { backgroundColor: isButtonDisabled ? chip : primary }
              ]}
              onPress={handleLogin}
              disabled={isButtonDisabled}
            >
              {(isLoading || authLoading) ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <ThemedText type="default" style={[
                  styles.loginButtonText,
                  { color: isButtonDisabled ? muted : '#FFFFFF' }
                ]}>
                  {t('auth.login')} →
                </ThemedText>
              )}
            </TouchableOpacity>



            <TouchableOpacity
              style={styles.signupLink}
              onPress={() => router.push('/(auth)/register')}
              disabled={isLoading}
            >
              <ThemedText type="default" style={{ color: muted }}>
                {t('auth.noAccount')}{' '}
                <ThemedText
                  type="link"
                  lightColor={primary}
                  darkColor={primary}
                >
                  {t('auth.signup')}
                </ThemedText>
              </ThemedText>
            </TouchableOpacity>


          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  keyboard: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 18,
    marginBottom: 12,
  },
  description: {
    textAlign: 'center',
    lineHeight: 22,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  loginButton: {
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  loginButtonText: {
    fontWeight: '600',
    fontSize: 16,
  },

  signupLink: {
    alignItems: 'center',
    marginBottom: 32,
  },

});
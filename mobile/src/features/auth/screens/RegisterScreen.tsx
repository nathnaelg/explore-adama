import { ThemedText } from '@/src/components/themed/ThemedText';
import { ThemedView } from '@/src/components/themed/ThemedView';
import { useAuth } from '@/src/features/auth/hooks/index';
import { RegisterDto } from '@/src/features/auth/types';
import { useThemeColor } from '@/src/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SocialLoginButtons } from '../components/SocialLoginButtons';

export default function RegisterScreen() {
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

  const [user, setUser] = useState<RegisterDto & { acceptTerms: boolean }>({
    name: '',
    email: '',
    password: '',
    role: 'TOURIST',
    acceptTerms: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();

  const handleRegister = async () => {
    if (!user.name.trim() || !user.email.trim() || !user.password.trim()) {
      Alert.alert(t('common.error'), t('auth.fillRequired'));
      return;
    }

    if (!user.acceptTerms) {
      Alert.alert(t('common.error'), t('auth.acceptTermsError'));
      return;
    }

    if (user.password.length < 6) {
      Alert.alert(t('common.error'), t('auth.passwordShort'));
      return;
    }

    setIsLoading(true);
    try {
      const { acceptTerms, ...registerData } = user;
      await register(registerData);
      Alert.alert(
        t('auth.registrationSuccessful'),
        t('auth.welcomeAdama'),
        [{ text: t('common.ok'), onPress: () => router.replace('/(tabs)') }]
      );
    } catch (error: any) {
      const backendMessage = error.response?.data?.message;
      const errorMessage = Array.isArray(backendMessage)
        ? backendMessage.join('\n')
        : backendMessage;

      Alert.alert(
        t('auth.registrationFailed'),
        errorMessage || error.message || t('common.error')
      );
    } finally {
      setIsLoading(false);
    }
  };


  const isFormValid = user.name && user.email && user.password && user.acceptTerms;

  return (
    <ThemedView style={[styles.container, { backgroundColor: bg }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={muted} />
          </TouchableOpacity>
          <ThemedText type="title" style={[styles.title, { color: text }]}>
            {t('auth.registerTitle')}
          </ThemedText>
          <View style={{ width: 24 }} />
        </View>

        <ThemedText type="default" style={[styles.heroText, { color: muted }]}>
          {t('auth.registerHero')}
        </ThemedText>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <ThemedText type="default" style={[styles.inputLabel, { color: muted }]}>
              {t('auth.fullName')} *
            </ThemedText>
            <TextInput
              style={[styles.input, {
                backgroundColor: card,
                borderColor: chip,
                color: text
              }]}
              placeholder={t('auth.enterName')}
              placeholderTextColor={muted}
              value={user.name}
              onChangeText={(text) => setUser({ ...user, name: text })}
              editable={!isLoading}
            />
          </View>

          <View style={styles.inputContainer}>
            <ThemedText type="default" style={[styles.inputLabel, { color: muted }]}>
              {t('auth.email')} *
            </ThemedText>
            <TextInput
              style={[styles.input, {
                backgroundColor: card,
                borderColor: chip,
                color: text
              }]}
              placeholder="example@email.com"
              placeholderTextColor={muted}
              value={user.email}
              onChangeText={(text) => setUser({ ...user, email: text })}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!isLoading}
            />
          </View>

          <View style={styles.inputContainer}>
            <ThemedText type="default" style={[styles.inputLabel, { color: muted }]}>
              {t('auth.passwordMin')}
            </ThemedText>
            <TextInput
              style={[styles.input, {
                backgroundColor: card,
                borderColor: chip,
                color: text
              }]}
              placeholder={t('auth.enterPassword')}
              placeholderTextColor={muted}
              value={user.password}
              onChangeText={(text) => setUser({ ...user, password: text })}
              secureTextEntry
              editable={!isLoading}
            />
          </View>

          <View style={styles.termsContainer}>
            <Switch
              value={user.acceptTerms}
              onValueChange={(value) => setUser({ ...user, acceptTerms: value })}
              trackColor={{ false: chip, true: primary }}
              thumbColor={user.acceptTerms ? primary : '#f4f3f4'}
              disabled={isLoading}
            />
            <ThemedText type="default" style={[styles.termsText, { color: muted }]}>
              {t('auth.agreeTerms')}{' '}
              <ThemedText
                type="link"
                onPress={() => router.push('/(public)/legal/terms')}
                lightColor={primary}
                darkColor={primary}
              >
                {t('auth.termsAndConditions')}
              </ThemedText>{' '}
              {t('auth.and')}{' '}
              <ThemedText
                type="link"
                onPress={() => router.push('/(public)/legal/privacy-policy')}
                lightColor={primary}
                darkColor={primary}
              >
                {t('settings.privacyPolicy')}
              </ThemedText>
            </ThemedText>
          </View>

          <TouchableOpacity
            style={[
              styles.registerButton,
              { backgroundColor: isFormValid && !isLoading ? primary : chip },
            ]}
            onPress={handleRegister}
            disabled={!isFormValid || isLoading}
          >
            <ThemedText type="default" style={[
              styles.registerButtonText,
              { color: isFormValid && !isLoading ? '#FFFFFF' : muted }
            ]}>
              {isLoading ? t('auth.creatingAccount') : t('auth.registerNow')}
            </ThemedText>
          </TouchableOpacity>

          <View style={styles.socialSection}>
            <View style={styles.divider}>
              <View style={[styles.dividerLine, { backgroundColor: chip }]} />
              <ThemedText type="default" style={[styles.dividerText, { color: muted }]}>
                {t('auth.orRegister')}
              </ThemedText>
              <View style={[styles.dividerLine, { backgroundColor: chip }]} />
            </View>

            <View style={styles.socialButtons}>
              <SocialLoginButtons
                onSuccess={() => router.replace('/(tabs)')}
                onError={(err: string) => Alert.alert(t('auth.registrationFailed'), err)}
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.loginLink}
            onPress={() => router.push('/(auth)/login')}
            disabled={isLoading}
          >
            <ThemedText type="default" style={{ color: muted }}>
              {t('auth.alreadyHaveAccount')}{' '}
              <ThemedText
                type="link"
                lightColor={primary}
                darkColor={primary}
              >
                {t('auth.login')}
              </ThemedText>
            </ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  heroText: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  form: {
    paddingHorizontal: 20,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 12,
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  registerButton: {
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  socialSection: {
    marginBottom: 24,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  loginLink: {
    alignItems: 'center',
    paddingVertical: 20,
  },
});
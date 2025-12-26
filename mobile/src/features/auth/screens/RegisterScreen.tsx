import { ThemedText } from '@/src/components/themed/ThemedText';
import { ThemedView } from '@/src/components/themed/ThemedView';
import { useAuth } from '@/src/features/auth/hooks/index';
import { RegisterDto } from '@/src/features/auth/types';
import { useThemeColor } from '@/src/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
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
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (!user.acceptTerms) {
      Alert.alert('Error', 'You must accept the terms and conditions');
      return;
    }

    if (user.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    try {
      const { acceptTerms, ...registerData } = user;
      await register(registerData);
      Alert.alert(
        'Registration Successful',
        'Welcome to Adama Tourism!',
        [{ text: 'OK', onPress: () => router.replace('/(tabs)') }]
      );
    } catch (error: any) {
      const backendMessage = error.response?.data?.message;
      const errorMessage = Array.isArray(backendMessage)
        ? backendMessage.join('\n')
        : backendMessage;

      Alert.alert(
        'Registration Failed',
        errorMessage || error.message || 'An error occurred. Please try again.'
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
            Join Adama Tourism
          </ThemedText>
          <View style={{ width: 24 }} />
        </View>

        <ThemedText type="default" style={[styles.heroText, { color: muted }]}>
          Discover the best hotels, parks, and culture in the heart of Oromia.
        </ThemedText>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <ThemedText type="default" style={[styles.inputLabel, { color: muted }]}>
              Full Name *
            </ThemedText>
            <TextInput
              style={[styles.input, {
                backgroundColor: card,
                borderColor: chip,
                color: text
              }]}
              placeholder="Enter your name"
              placeholderTextColor={muted}
              value={user.name}
              onChangeText={(text) => setUser({ ...user, name: text })}
              editable={!isLoading}
            />
          </View>

          <View style={styles.inputContainer}>
            <ThemedText type="default" style={[styles.inputLabel, { color: muted }]}>
              Email *
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
              Password * (min. 6 characters)
            </ThemedText>
            <TextInput
              style={[styles.input, {
                backgroundColor: card,
                borderColor: chip,
                color: text
              }]}
              placeholder="Create a password"
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
              I agree to the{' '}
              <ThemedText
                type="link"
                onPress={() => router.push('/(public)/legal/terms')}
                lightColor={primary}
                darkColor={primary}
              >
                Terms & Conditions
              </ThemedText>{' '}
              and{' '}
              <ThemedText
                type="link"
                onPress={() => router.push('/(public)/legal/privacy-policy')}
                lightColor={primary}
                darkColor={primary}
              >
                Privacy Policy
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
              {isLoading ? 'Creating Account...' : 'Register Now'}
            </ThemedText>
          </TouchableOpacity>

          <View style={styles.socialSection}>
            <View style={styles.divider}>
              <View style={[styles.dividerLine, { backgroundColor: chip }]} />
              <ThemedText type="default" style={[styles.dividerText, { color: muted }]}>
                OR REGISTER WITH
              </ThemedText>
              <View style={[styles.dividerLine, { backgroundColor: chip }]} />
            </View>

            <View style={styles.socialButtons}>
              <SocialLoginButtons
                onSuccess={() => router.replace('/(tabs)')}
                onError={(err: string) => Alert.alert('Registration Failed', err)}
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.loginLink}
            onPress={() => router.push('/(auth)/login')}
            disabled={isLoading}
          >
            <ThemedText type="default" style={{ color: muted }}>
              Already have an account?{' '}
              <ThemedText
                type="link"
                lightColor={primary}
                darkColor={primary}
              >
                Login
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
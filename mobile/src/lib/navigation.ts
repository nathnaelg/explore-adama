import { router } from 'expo-router';

export const NavigationService = {

  // Initial Navigation
  goToOnboarding: () => router.replace('/onboarding'),

  // Auth Navigation
  goToLogin: () => router.replace('/(auth)/login'),
  goToRegister: () => router.push('/(auth)/register'),

  // Main Navigation
  goToHome: () => router.replace('/(tabs)'),
  goToExplore: () => router.push('/(tabs)/explore'),
  goToMap: () => router.push('/(tabs)/map'),
  goToChat: () => router.push('/(tabs)/chat'),
  goToBlog: () => router.push('/(tabs)/blog'),

  // Profile Navigation
  goToProfile: () => router.push('/profile'),
  goToEditProfile: () => router.push('/edit-profile' as any),
  goToSettings: () => router.push('/settings'),
  goToBookings: () => router.push('/bookings/history'),
  goToSaved: () => router.push('/saved/index' as any),

  // Search & Discovery
  goToSearch: () => router.push('/search'),
  goToPlaceDetails: (id: string | number) => router.push(`/place/${id}`),
  goToFilterSort: () => router.push('/(modals)/filter-sort'),

  // Booking & Payment
  goToEventBooking: (id: string | number) => router.push(`/booking/${id}` as any),
  goToPayment: () => router.push('/payment' as any),
  goToPaymentSuccess: () => router.push('/success/payment' as any),

  // Reviews
  goToReviews: () => router.push('/reviews'),
  goToAddReview: () => router.push('/add-review' as any),
  goToReviewSuccess: () => router.push('/success/review' as any),

  // Blog
  goToCreateBlog: () => router.push('/create-blog' as any),

  // Settings
  goToLanguage: () => router.push('/settings/language' as any),
  goToCurrency: () => router.push('/settings/currency' as any),
  goToAppVersion: () => router.push('/app-version' as any),
  goToNotifications: () => router.push('/notifications' as any),
  goToHelp: () => router.push('/help' as any),
  goToPrivacyPolicy: () => router.push('/legal/privacy-policy' as any),
  goToTerms: () => router.push('/legal/terms' as any),

  // Trip Planning
  goToNewTrip: () => router.push('/trips/new' as any),

  // AI & Features
  goToAITransparency: () => router.push('/legal/ai-transparency' as any),

  // Emergency
  goToEmergency: () => router.push('/emergency'),

  // Error Screens
  goToError: (type: 'generic' | 'no-internet' | 'payment-failed' = 'generic') =>
    router.push(`/errors/${type}` as any),

  // Empty States
  goToEmptyState: (type: 'no-search-results' | 'no-favorites' | 'no-bookings') =>
    router.push(`/empty-states/${type}` as any),

  // Permissions
  goToLocationPermission: () => router.push('/permissions/location' as any),
  goToNotificationPermission: () => router.push('/permissions/notifications' as any),

  // Logout
  goToLogoutConfirmation: () => router.push('/logout-confirmation' as any),

  // Back Navigation
  goBack: () => router.back(),

  // Replace Navigation (for auth flows)
  replaceHome: () => router.replace('/(tabs)'),
  replaceAuth: () => router.replace('/(auth)/login'),
};
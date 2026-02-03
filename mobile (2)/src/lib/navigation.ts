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
  goToEditProfile: () => router.push('/profile/edit'),
  goToSettings: () => router.push('/settings'),
  goToBookings: () => router.push('/bookings/history'),

  // Search & Discovery
  goToSearch: () => router.push('/search'),
  goToPlaceDetails: (id: string | number) => router.push(`/place/${id}`),
  goToFilterSort: () => router.push('/(modals)/filter-sort'),

  // Booking & Payment
  goToEventBooking: (id: string | number) => router.push(`/bookings/${id}`),
  goToPayment: () => router.push('/bookings/new/payment'),
  goToPaymentSuccess: () => router.push('/payment-success'),

  // Reviews
  goToReviews: () => router.push('/reviews'),
  goToAddReview: () => router.push('/reviews/add'),
  goToReviewSuccess: () => router.push('/reviews/success'),

  // Blog
  goToCreateBlog: () => router.push('/blog/new'),

  // Settings
  goToLanguage: () => router.push('/settings/language'),
  goToCurrency: () => router.push('/settings/currency'),
  goToAppVersion: () => router.push('/(public)/meta/app-version'),
  goToNotifications: () => router.push('/notifications'),
  goToHelp: () => router.push('/(public)/support/help'),
  goToPrivacyPolicy: () => router.push('/(public)/legal/privacy-policy'),
  goToTerms: () => router.push('/(public)/legal/terms'),



  // AI & Features
  goToAITransparency: () => router.push('/(public)/legal/ai-transparency'),

  // Emergency
  goToEmergency: () => router.push('/(public)/emergency'),



  // Permissions
  goToLocationPermission: () => router.push('/permissions/location'),
  goToNotificationPermission: () => router.push('/permissions/notifications'),

  // Logout
  goToLogoutConfirmation: () => router.push('/(auth)/logout-confirmation'),

  // Back Navigation
  goBack: () => router.back(),

  // Replace Navigation (for auth flows)
  replaceHome: () => router.replace('/(tabs)'),
  replaceAuth: () => router.replace('/(auth)/login'),
};
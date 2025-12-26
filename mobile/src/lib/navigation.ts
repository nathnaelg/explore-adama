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
  goToEditProfile: () => router.push('/edit-profile'),
  goToSettings: () => router.push('/settings'),
  goToBookings: () => router.push('/bookings/history'),
  goToSaved: () => router.push('/saved/index'),
  
  // Search & Discovery
  goToSearch: () => router.push('/search'),
  goToPlaceDetails: (id: string | number) => router.push(`/place/${id}`),
  goToFilterSort: () => router.push('/(modals)/filter-sort'),
  
  // Booking & Payment
  goToEventBooking: (id: string | number) => router.push(`/booking/${id}`),
  goToPayment: () => router.push('/payment'),
  goToPaymentSuccess: () => router.push('/success/payment'),
  
  // Reviews
  goToReviews: () => router.push('/reviews'),
  goToAddReview: () => router.push('/add-review'),
  goToReviewSuccess: () => router.push('/success/review'),
  
  // Blog
  goToCreateBlog: () => router.push('/create-blog'),
  
  // Settings
  goToLanguage: () => router.push('/settings/language'),
  goToCurrency: () => router.push('/settings/currency'),
  goToAppVersion: () => router.push('/app-version'),
  goToNotifications: () => router.push('/notifications'),
  goToHelp: () => router.push('/help'),
  goToPrivacyPolicy: () => router.push('/privacy-policy'),
  goToTerms: () => router.push('/terms'),
  
  // Trip Planning
  goToNewTrip: () => router.push('/trips/new'),
  
  // AI & Features
  goToAITransparency: () => router.push('/ai-transparency'),
  
  // Emergency
  goToEmergency: () => router.push('/emergency'),
  
  // Error Screens
  goToError: (type: 'generic' | 'no-internet' | 'payment-failed' = 'generic') => 
    router.push(`/errors/${type}`),
  
  // Empty States
  goToEmptyState: (type: 'no-search-results' | 'no-favorites' | 'no-bookings') => 
    router.push(`/empty-states/${type}`),
  
  // Permissions
  goToLocationPermission: () => router.push('/permissions/location'),
  goToNotificationPermission: () => router.push('/permissions/notifications'),
  
  // Logout
  goToLogoutConfirmation: () => router.push('/logout-confirmation'),
  
  // Back Navigation
  goBack: () => router.back(),
  
  // Replace Navigation (for auth flows)
  replaceHome: () => router.replace('/(tabs)'),
  replaceAuth: () => router.replace('/(auth)/login'),
};
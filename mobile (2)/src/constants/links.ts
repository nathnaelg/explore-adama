export const Links = {
  // Auth
  login: '/(auth)/login',
  register: '/(auth)/register',
  
  // Main Tabs
  home: '/(tabs)',
  explore: '/(tabs)/explore',
  map: '/(tabs)/map',
  chat: '/(tabs)/chat',
  blog: '/(tabs)/blog',
  
  // Profile
  profile: '/profile',
  editProfile: '/edit-profile',
  settings: '/settings',
  bookings: '/bookings/history',
  saved: '/saved/index',
  
  // Search
  search: '/search',
  filterSort: '/(modals)/filter-sort',
  
  // Booking
  booking: (id: string | number) => `/booking/${id}`,
  payment: '/payment',
  paymentSuccess: '/success/payment',
  
  // Places
  place: (id: string | number) => `/place/${id}`,
  
  // Reviews
  reviews: '/reviews',
  addReview: '/add-review',
  reviewSuccess: '/success/review',
  
  // Blog
  createBlog: '/create-blog',
  
  // Settings
  language: '/settings/language',
  currency: '/settings/currency',
  notifications: '/notifications',
  help: '/help',
  privacyPolicy: '/privacy-policy',
  terms: '/terms',
  appVersion: '/app-version',
  
  // Trip Planning
  newTrip: '/trips/new',
  
  // AI
  aiTransparency: '/ai-transparency',
  
  // Emergency
  emergency: '/emergency',
  
  // Permissions
  locationPermission: '/permissions/location',
  notificationPermission: '/permissions/notifications',
  
  // Logout
  logoutConfirmation: '/logout-confirmation',
  
  // Success
  success: (type: 'payment' | 'review' | 'feedback') => `/success/${type}`,
  
  // Errors
  error: (type: 'generic' | 'no-internet' | 'payment-failed') => `/errors/${type}`,
  
  // Empty States
  emptyState: (type: 'no-search-results' | 'no-favorites' | 'no-bookings') => 
    `/empty-states/${type}`,
};

// Query parameter helpers
export const QueryParams = {
  search: (query: string, category?: string) => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (category) params.set('category', category);
    return `/search?${params.toString()}`;
  },
  
  exploreCategory: (category: string) => `/(tabs)/explore?category=${category}`,
};
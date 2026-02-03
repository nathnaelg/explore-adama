/**
 * Legacy API Adapter
 * Aggregates the new modular service architecture into a single `api` object
 * to maintain backward compatibility with existing components.
 */

import { coreClient } from './api/clients/core.client';
import { AuthService } from './auth/auth.service';
import { authApi } from './auth/auth.api';
import { usersApi } from './users/users.api';
import { placesApi } from './places/places.api';
import { eventsApi } from './events/events.api';
import { bookingsApi } from './bookings/bookings.api';
import { ticketsApi } from './tickets/tickets.api';
import { categoriesApi } from './categories/categories.api';
import { blogApi } from './blog/blog.api';
import { MlApi } from './ml/ml.api';
import { analyticsApi } from './analytics/analytics.api';

// Export raw clients if needed
export { coreClient } from './api/clients/core.client';
export { mlClient } from './api/clients/ml.client';
export { AuthService } from './auth/auth.service';
export { MlApi } from './ml/ml.api';
// Export analyticsApi so it can be imported directly
export { analyticsApi } from './analytics/analytics.api';

export const api = {
  // Generic Request Wrappers (Maintains api.get, api.post signatures)
  get: async <T>(url: string, config = {}) => {
      const response = await coreClient.get<T>(url, config);
      return response.data;
  },
  post: async <T>(url: string, data: any, config = {}) => {
      const response = await coreClient.post<T>(url, data, config);
      return response.data;
  },
  put: async <T>(url: string, data: any, config = {}) => {
      const response = await coreClient.put<T>(url, data, config);
      return response.data;
  },
  patch: async <T>(url: string, data: any, config = {}) => {
      const response = await coreClient.patch<T>(url, data, config);
      return response.data;
  },
  delete: async <T>(url: string, config = {}) => {
      const response = await coreClient.delete<T>(url, config);
      return response.data;
  },

  // Auth & User Management Delegates
  login: authApi.login,
  logout: authApi.logout,
  refresh: authApi.refresh,
  revokeSessions: authApi.revokeSessions,
  requestPasswordReset: authApi.requestPasswordReset,
  resetPassword: authApi.resetPassword,
  
  setToken: (token: string) => AuthService.setToken(token),
  setRefreshToken: (token: string) => AuthService.setRefreshToken(token),
  setUser: (user: any) => AuthService.setUser(user),
  removeToken: () => AuthService.clearAuth(),
  isAuthenticated: () => AuthService.getToken(),
  getUser: () => AuthService.getUser(),
  onAuthError: (callback: () => void) => AuthService.onAuthError(callback),
  
  // Specific Module Delegates
  users: usersApi,
  places: placesApi,
  events: eventsApi,
  bookings: bookingsApi,
  tickets: ticketsApi,
  blog: blogApi,
  categories: categoriesApi,
  ml: MlApi,
  analytics: analyticsApi
};
import { apiClient } from '@/src/core/api/client';
import { UpdateProfileDto, UpdateUserDto, User } from '../types';

export const profileService = {
  // Get current user profile
  // Note: Swagger lacks GET /users/profile and GET /users/me. 
  // We rely on AuthContext to store the user object from Login.
  // If we must fetch, we need to pass an ID: GET /users/{id}
  async getCurrentUser(id?: string): Promise<User> {
    if (id) {
      const response = await apiClient.get(`/users/${id}`);
      return response.data;
    }
    // Fallback if no ID is provided
    throw new Error('Fetching current user without ID is not supported by backend.');
  },

  // Update profile
  async updateProfile(data: UpdateProfileDto): Promise<User> {
    const response = await apiClient.put('/users/profile', data);
    return response.data.user; // Extract user from { message, user }
  },

  // Upload avatar
  async uploadAvatar(formData: FormData): Promise<{ url: string; user: User }> {
    const response = await apiClient.post('/users/profile/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return {
      url: response.data.url,
      user: response.data.user,
    };
  },

  // Change password
  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    await apiClient.put('/users/change-password', { oldPassword, newPassword });
  },

  // Admin: List users
  async listUsers(page = 1, perPage = 25): Promise<{ data: User[], total: number }> {
    const response = await apiClient.get('/users', {
      params: { page, perPage }
    });
    return response.data;
  },

  // Admin: Get user by ID
  async getUserById(id: string): Promise<User> {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },

  // Admin: Update user
  async updateUser(id: string, data: UpdateUserDto): Promise<void> {
    await apiClient.put(`/users/${id}`, data);
  },

  // Admin: Delete user
  async deleteUser(id: string): Promise<void> {
    await apiClient.delete(`/users/${id}`);
  },

  // Get user statistics
  async getUserStats(): Promise<{ bookings: number, reviews: number, favorites: number }> {
    const response = await apiClient.get('/users/stats');
    return response.data;
  },
};
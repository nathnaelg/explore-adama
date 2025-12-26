export interface Profile {
  name: string;
  gender?: string;
  phone?: string;
  country?: string;
  avatar?: string;
  locale?: string;
}

export type Role = 'ADMIN' | 'TOURIST' | 'RESIDENT';

export interface User {
  id: string;
  email: string;
  role: Role;
  profile: Profile;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileDto {
  name?: string;
  gender?: string;
  phone?: string;
  country?: string;
  avatar?: string;
  locale?: string;
}

export interface UpdateUserDto {
  email?: string;
  role?: Role;
  banned?: boolean;
}

export interface ChangePasswordDto {
  oldPassword: string;
  newPassword: string;
}

export interface Favorite {
  id: string;
  itemId: string;
  itemType: 'PLACE' | 'EVENT';
}

export interface Review {
  id: string;
  rating: number;
  comment?: string;
  userId: string;
  status: string;
  createdAt: string;
}
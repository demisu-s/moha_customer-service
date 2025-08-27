// types/authentication.ts

// Data for registration
export interface RegisterData {
  firstName?: string;
  lastName?: string;
  userId: string;
  password: string;
  confirmPassword?: string;
}

// Data for login
export interface LoginData {
  userId: string;
  password: string;
}

// Local User (stored in localStorage)
export interface User {
  id: number;
  userId: string;
  firstName: string;
  lastName: string;
  password: string;
  imageUrl?: string | null;
}

// Profile information (used in UI)
export interface UserProfile {
  created_at: string;
  userId: string;
  firstName: string;
  lastName: string;
  id: number;
  imageUrl: string | null;
}

// Update user profile
export interface UpdateUserProfile {
  userId: string;
  firstName: string;
  lastName: string;
  imageUrl?: string | null;
  image?: File;
}

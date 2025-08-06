export interface RegisterData {
  firstName?: string;
  lastName?: string;
  userId: string;
  password: string;
  confirmPassword?: string;
  primaryPhoneNumber?: string;
}
export interface LoginData {
  userId: string;
  password: string;
}

export interface UserProfile {
  bio: string | null;
  created_at: string;
  userId: string;
  firstName: string | null;
  id: number;
  imageUrl: string | null;
  lastName: string | null;
  mainPhoneNumber: string | null;
  secondaryPhoneNumber: string | null;
}

export interface UpdateUserProfile {
  bio?: string | undefined;
  userId: string;
  firstName: string | null;
  imageUrl?: string | null;
  lastName: string | null;
  mainPhoneNumber: string | null;
  secondaryPhoneNumber?: string | undefined;
  image?: File;
}

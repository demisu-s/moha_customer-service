export interface RegisterData {
  firstName?: string;
  lastName?: string;
  userId: string;
  password: string;
  confirmPassword?: string;
}
export interface LoginData {
  userId: string;
  password: string;
}

export interface UserProfile {
  created_at: string;
  userId: string;
  firstName: string | null;
  lastName: string | null;
  id: number;
  imageUrl: string | null;
}

export interface UpdateUserProfile {
  userId: string;
  firstName: string | null;
  lastName: string | null;
  imageUrl?: string | null;
  image?: File;
}

// store/authentication.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  LoginData,
  RegisterData,
  User,
  UserProfile,
  UpdateUserProfile,
} from "../store/types/authentication";
import {
  clearLocalStorage,
  getUserId,
  setAccessToken,
  setUserId,
  removeUserId,
  removeAccessToken,
} from "../utils/localStorage";
import { CustomError } from "../utils/error/customError";
import { displayAlert } from "../utils/service";
import { To } from "react-router-dom";

interface AuthenticationState {
  authenticatedUser: User | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
  isLoggedOut: boolean;
  errorMessage: string | null;

  addUser: (registerData: RegisterData) => Promise<void>;
  login: (logInData: LoginData) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (
    userProfile: UpdateUserProfile,
    navigate: (path: To) => void
  ) => Promise<void>;
}

export const useAuthenticationStore = create<AuthenticationState>()(
  persist(
    (set) => ({
      authenticatedUser: null,
      userProfile: null,
      isLoading: false,
      isLoggedOut: true,
      errorMessage: null,

      // Register user
      addUser: async (registerData: RegisterData) => {
        try {
          set({ isLoading: true, errorMessage: null });

          // Load existing users
          const existingUsers: User[] = JSON.parse(localStorage.getItem("users") || "[]");
          const isTaken = existingUsers.some(
            (u: User) => u.userId === registerData.userId
          );
          if (isTaken) throw new CustomError("User ID already registered");

          const newUser: User = {
            id: Date.now(),
            userId: registerData.userId,
            firstName: registerData.firstName ?? "",
            lastName: registerData.lastName ?? "",
            password: registerData.password,
            imageUrl: null,
          };

          const users = [...existingUsers, newUser];
          localStorage.setItem("users", JSON.stringify(users));

          // Simulate login after register
          setUserId(newUser.id);
          setAccessToken("fake-jwt-token");

          const newProfile: UserProfile = {
            created_at: new Date().toISOString(),
            id: newUser.id,
            userId: newUser.userId,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            imageUrl: newUser.imageUrl ?? null,
          };

          set({
            authenticatedUser: newUser,
            userProfile: newProfile,
            isLoggedOut: false,
          });

          displayAlert("Registration successful!", "success");
        } catch (error: any) {
          const err = new CustomError(error);
          set({ errorMessage: err.message });
          displayAlert(err.message, "error");
        } finally {
          set({ isLoading: false });
        }
      },

      // Login
      login: async (logInData: LoginData) => {
        try {
          set({ isLoading: true, errorMessage: null });

          const users: User[] = JSON.parse(localStorage.getItem("users") || "[]");
          const user = users.find(
            (u) =>
              u.userId === logInData.userId && u.password === logInData.password
          );
          if (!user) throw new CustomError("Invalid credentials");

          setUserId(user.id);
          setAccessToken("fake-jwt-token");

          const profile: UserProfile = {
            created_at: new Date().toISOString(),
            id: user.id,
            userId: user.userId,
            firstName: user.firstName,
            lastName: user.lastName,
            imageUrl: user.imageUrl ?? null,
          };

          set({
            authenticatedUser: user,
            userProfile: profile,
            isLoggedOut: false,
          });

          displayAlert("Login successful!", "success");
        } catch (error: any) {
          const err = new CustomError(error);
          set({ errorMessage: err.message });
          displayAlert(err.message, "error");
        } finally {
          set({ isLoading: false });
        }
      },

      // Logout
      logout: async () => {
        try {
          set({ isLoading: true });
          clearLocalStorage();
          removeUserId();
          removeAccessToken();

          set({
            authenticatedUser: null,
            userProfile: null,
            isLoggedOut: true,
          });

          displayAlert("Logged out successfully", "success");
        } catch (error: any) {
          const err = new CustomError(error);
          displayAlert(err.message, "error");
        } finally {
          set({ isLoading: false });
        }
      },

      // Update profile
      updateUserProfile: async (
        userData: UpdateUserProfile,
        navigate: (path: To) => void
      ) => {
        try {
          set({ isLoading: true, errorMessage: null });
          const userId = getUserId();

          const users: User[] = JSON.parse(localStorage.getItem("users") || "[]");
          const updatedUsers = users.map((u) =>
            u.id === userId ? { ...u, ...userData } : u
          );

          localStorage.setItem("users", JSON.stringify(updatedUsers));

          const updatedUser = updatedUsers.find((u) => u.id === userId) ?? null;

          const updatedProfile: UserProfile | null = updatedUser
            ? {
                created_at: new Date().toISOString(),
                id: updatedUser.id,
                userId: updatedUser.userId,
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
                imageUrl: updatedUser.imageUrl ?? null,
              }
            : null;

          set({
            authenticatedUser: updatedUser,
            userProfile: updatedProfile,
          });

          displayAlert("Profile updated successfully!", "success");
          navigate("/profile");
        } catch (error: any) {
          const err = new CustomError(error);
          set({ errorMessage: err.message });
          displayAlert(err.message, "error");
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "authentication",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

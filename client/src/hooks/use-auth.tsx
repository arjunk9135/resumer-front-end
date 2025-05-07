import { createContext, useContext } from "react";
import {
  useQuery,
  useMutation,
} from "@tanstack/react-query";
import { insertUserSchema, User as SelectUser, InsertUser } from "@shared/schema";
import { getQueryFn, apiRequest, queryClient } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Auth context type
const AuthContext = createContext(null);

// Login credentials type
const loginSchema = insertUserSchema.pick({
  username: true,
  password: true,
});

// TEMPORARY: Mock user for testing
const mockUser = {
  id: 1,
  username: "testuser",
  fullName: "Test User",
  role: "HR Manager",
  email: "test@example.com",
  createdAt: new Date().toISOString()
};

export function AuthProvider({ children }) {
  const { toast } = useToast();
  
  // TEMPORARY: Always return mock user for testing instead of making API call
  const {
    data: user,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["/api/user"],
    queryFn: () => Promise.resolve(mockUser),
  });

  // Login mutation (bypassed for testing)
  const loginMutation = useMutation({
    mutationFn: async (credentials) => {
      // TEMPORARY: Just return mock user instead of API call
      return mockUser;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["/api/user"], user);
      toast({
        title: "Login successful",
        description: `Welcome back, ${user.fullName || user.username}!`,
      });
    },
    onError: (error) => {
      toast({
        title: "Login failed",
        description: error.message || "Invalid username or password",
        variant: "destructive",
      });
    },
  });

  // Register mutation (bypassed for testing)
  const registerMutation = useMutation({
    mutationFn: async (credentials) => {
      // TEMPORARY: Just return mock user instead of API call
      return mockUser;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["/api/user"], user);
      toast({
        title: "Registration successful",
        description: `Welcome to TalentInsight, ${user.fullName || user.username}!`,
      });
    },
    onError: (error) => {
      toast({
        title: "Registration failed",
        description: error.message || "Could not create account",
        variant: "destructive",
      });
    },
  });

  // Logout mutation (bypassed for testing)
  const logoutMutation = useMutation({
    mutationFn: async () => {
      // TEMPORARY: No API call for testing
      return null;
    },
    onSuccess: () => {
      // We won't actually remove the user for testing
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    },
    onError: (error) => {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user: user || mockUser, // Always provide mock user for testing
        isLoading: false, // Never show loading state for testing
        error: null,
        loginMutation,
        logoutMutation,
        registerMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

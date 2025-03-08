import React, { createContext, useState, useContext, ReactNode } from 'react';
import { login, signup, forgotPassword, AuthResponse, ApiResponse } from '../services/api';


// Define the shape of our auth context
interface AuthContextType {
    user: AuthResponse['user'] | null;
    token: string | null;
    isLoading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<boolean>;
    signup: (name: string, email: string, password: string) => Promise<boolean>;
    forgotPassword: (email: string) => Promise<boolean>;
    logout: () => void;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<AuthResponse['user'] | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Login function
    const handleLogin = async (email: string, password: string): Promise<boolean> => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await login(email, password);

            if (response.success && response.data) {
                setUser(response.data.user);
                setToken(response.data.token);
                return true;
            } else {
                setError(response.error || 'Login failed');
                return false;
            }
        } catch (err) {
            setError('An unexpected error occurred');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // Signup function
    const handleSignup = async (name: string, email: string, password: string): Promise<boolean> => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await signup(name, email, password);

            if (response.success && response.data) {
                setUser(response.data.user);
                setToken(response.data.token);
                return true;
            } else {
                setError(response.error || 'Signup failed');
                return false;
            }
        } catch (err) {
            setError('An unexpected error occurred');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // Forgot password function
    const handleForgotPassword = async (email: string): Promise<boolean> => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await forgotPassword(email);

            if (response.success) {
                return true;
            } else {
                setError(response.error || 'Password reset failed');
                return false;
            }
        } catch (err) {
            setError('An unexpected error occurred');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // Logout function
    const handleLogout = () => {
        setUser(null);
        setToken(null);
    };

    // Create the value object that will be provided to consumers
    const value = {
        user,
        token,
        isLoading,
        error,
        login: handleLogin,
        signup: handleSignup,
        forgotPassword: handleForgotPassword,
        logout: handleLogout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
}; 
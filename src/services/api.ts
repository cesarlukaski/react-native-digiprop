/**
 * API Service
 * 
 * This file provides a centralized API service for the application.
 * In a real application, these functions would make actual HTTP requests to a backend server.
 * For this demo, we're using mock data and simulating network latency.
 */

// Simulated delay to mimic network latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// API response types
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

export interface AuthResponse {
    user: {
        id: string;
        name: string;
        email: string;
    };
    token: string;
}

// Define proper interface for Inspection data
export interface Inspection {
    id: number;
    address: string;
    client: string;
    inspectionDate: string;
    inspectionTime: string;
    inventoryType: string;
    locationKey: string;
    bathroom: string;
    bedroom: string;
    additionalNotes: string;
    status: 'completed' | 'in progress' | 'pending';
    assignedTo?: string;
    createdAt: string;
    updatedAt?: string;
    roomInspectionData?: Record<string, RoomInspectionData>;
    selectedRooms?: string[];
    dateTimeData?: DateTimeData;
    submittedAt?: string;
}

// Define proper interface for Property data
export interface Property {
    id: number;
    address: string;
    bedrooms: string;
    bathrooms: string;
    propertyType: string;
    image?: string;
    createdAt: string;
    updatedAt?: string;
}

// Define interfaces for room inspection data
export interface RoomInspectionData {
    completed: boolean;
    timestamp: string;
    photos: Photo[];
    notes?: string;
    condition?: string;
}

export interface Photo {
    id: string;
    uri: string;
    url?: string;
    timestamp: string;
    roomName?: string;
    source?: 'camera' | 'gallery';
}

export interface DateTimeData {
    date: string;
    time: string;
    inspectionType: string;
    keyLocation: string;
}

// User and verification interfaces
interface User {
    id: string;
    name: string;
    email: string;
    password: string; // In a real app, we would never store passwords in plain text
}

interface VerificationCode {
    email: string;
    code: string;
    expiresAt: number; // Timestamp when the code expires
}

// Local storage for data persistence (in a real app, this would be AsyncStorage or similar)
class LocalStorage {
    private static inspections: Inspection[] = [];
    private static properties: Property[] = [];
    private static users: User[] = [
        {
            id: '1',
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123'
        },
        {
            id: '2',
            name: 'John Doe',
            email: 'john@example.com',
            password: 'password123'
        }
    ];
    private static verificationCodes: VerificationCode[] = [];
    private static nextInspectionId = 1;
    private static nextPropertyId = 1;
    private static nextUserId = 3;

    static getInspections(): Inspection[] {
        return this.inspections;
    }

    static getInspectionById(id: number): Inspection | undefined {
        return this.inspections.find(insp => insp.id === id);
    }

    static addInspection(inspection: Omit<Inspection, 'id' | 'createdAt' | 'status'>): Inspection {
        const newInspection: Inspection = {
            id: this.nextInspectionId++,
            ...inspection,
            createdAt: new Date().toISOString(),
            status: 'completed'
        };
        this.inspections.push(newInspection);
        return newInspection;
    }

    static updateInspection(id: number, updates: Partial<Inspection>): Inspection | null {
        const index = this.inspections.findIndex(insp => insp.id === id);
        if (index === -1) return null;

        this.inspections[index] = {
            ...this.inspections[index],
            ...updates,
            updatedAt: new Date().toISOString()
        };

        return this.inspections[index];
    }

    static deleteInspection(id: number): boolean {
        const initialLength = this.inspections.length;
        this.inspections = this.inspections.filter(insp => insp.id !== id);
        return this.inspections.length !== initialLength;
    }

    static getProperties(): Property[] {
        return this.properties;
    }

    static getPropertyById(id: number): Property | undefined {
        return this.properties.find(prop => prop.id === id);
    }

    static addProperty(property: Omit<Property, 'id' | 'createdAt'>): Property {
        const newProperty: Property = {
            id: this.nextPropertyId++,
            ...property,
            createdAt: new Date().toISOString()
        };
        this.properties.push(newProperty);
        return newProperty;
    }

    static updateProperty(id: number, updates: Partial<Property>): Property | null {
        const index = this.properties.findIndex(prop => prop.id === id);
        if (index === -1) return null;

        this.properties[index] = {
            ...this.properties[index],
            ...updates,
            updatedAt: new Date().toISOString()
        };

        return this.properties[index];
    }

    static deleteProperty(id: number): boolean {
        const initialLength = this.properties.length;
        this.properties = this.properties.filter(prop => prop.id !== id);
        return this.properties.length !== initialLength;
    }

    static getUserByEmail(email: string): User | undefined {
        return this.users.find(user => user.email === email);
    }

    static getUserById(id: string): User | undefined {
        return this.users.find(user => user.id === id);
    }

    static addUser(user: Omit<User, 'id'>): User {
        const newUser: User = {
            id: String(this.nextUserId++),
            ...user
        };
        this.users.push(newUser);
        return newUser;
    }

    static addVerificationCode(code: VerificationCode): void {
        // Remove existing codes for this email
        this.verificationCodes = this.verificationCodes.filter(c => c.email !== code.email);
        this.verificationCodes.push(code);
    }

    static getVerificationCode(email: string): VerificationCode | undefined {
        return this.verificationCodes.find(code => code.email === email);
    }

    static updateUserPassword(email: string, newPassword: string): boolean {
        const userIndex = this.users.findIndex(user => user.email === email);
        if (userIndex === -1) return false;

        this.users[userIndex].password = newPassword;
        return true;
    }
}

// Helper to generate verification codes
const generateVerificationCode = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Authentication APIs
export const login = async (email: string, password: string): Promise<ApiResponse<AuthResponse>> => {
    await delay(500); // Simulate network delay

    try {
        const user = LocalStorage.getUserByEmail(email);

        if (!user) {
            return {
                success: false,
                error: 'User not found'
            };
        }

        if (user.password !== password) {
            return {
                success: false,
                error: 'Invalid password'
            };
        }

        // In a real app, we would generate a JWT token here
        const token = `mock-jwt-token-${user.id}`;

        return {
            success: true,
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                },
                token
            }
        };
    } catch (error) {
        return {
            success: false,
            error: 'An error occurred during login'
        };
    }
};

export const signup = async (name: string, email: string, password: string): Promise<ApiResponse<AuthResponse>> => {
    await delay(800); // Simulate network delay

    try {
        const existingUser = LocalStorage.getUserByEmail(email);

        if (existingUser) {
            return {
                success: false,
                error: 'Email already in use'
            };
        }

        const newUser = LocalStorage.addUser({
            name,
            email,
            password
        });

        // In a real app, we would generate a JWT token here
        const token = `mock-jwt-token-${newUser.id}`;

        return {
            success: true,
            data: {
                user: {
                    id: newUser.id,
                    name: newUser.name,
                    email: newUser.email
                },
                token
            }
        };
    } catch (error) {
        return {
            success: false,
            error: 'An error occurred during signup'
        };
    }
};

export const forgotPassword = async (email: string): Promise<ApiResponse<{ message: string }>> => {
    await delay(800);

    try {
        const user = LocalStorage.getUserByEmail(email);

        if (!user) {
            return {
                success: false,
                error: 'No account found with this email'
            };
        }

        // Generate verification code with 15 minute expiry
        const code = generateVerificationCode();
        const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes from now

        LocalStorage.addVerificationCode({
            email,
            code,
            expiresAt
        });

        // In a real app, we would send an email with the code

        return {
            success: true,
            data: {
                message: 'Verification code sent to your email'
            }
        };
    } catch (error) {
        return {
            success: false,
            error: 'Failed to process password reset request'
        };
    }
};

export const verifyCode = async (email: string, code: string): Promise<ApiResponse<{ valid: boolean }>> => {
    await delay(500);

    try {
        const storedCode = LocalStorage.getVerificationCode(email);

        if (!storedCode) {
            return {
                success: false,
                error: 'No verification code found for this email'
            };
        }

        if (storedCode.expiresAt < Date.now()) {
            return {
                success: false,
                error: 'Verification code has expired'
            };
        }

        const isValid = storedCode.code === code;

        return {
            success: true,
            data: {
                valid: isValid
            }
        };
    } catch (error) {
        return {
            success: false,
            error: 'Failed to verify code'
        };
    }
};

export const resetPassword = async (email: string, newPassword: string): Promise<ApiResponse<{ success: boolean }>> => {
    await delay(800);

    try {
        const updated = LocalStorage.updateUserPassword(email, newPassword);

        if (!updated) {
            return {
                success: false,
                error: 'Failed to update password'
            };
        }

        return {
            success: true,
            data: {
                success: true
            }
        };
    } catch (error) {
        return {
            success: false,
            error: 'Failed to reset password'
        };
    }
};

// Inspection APIs
export const getInspections = async (): Promise<ApiResponse<Inspection[]>> => {
    await delay(500);

    try {
        const inspections = LocalStorage.getInspections();

        return {
            success: true,
            data: inspections
        };
    } catch (error) {
        return {
            success: false,
            error: 'Failed to fetch inspections'
        };
    }
};

export const getInspectionById = async (id: number): Promise<ApiResponse<Inspection>> => {
    await delay(300);

    try {
        const inspection = LocalStorage.getInspectionById(id);

        if (!inspection) {
            return {
                success: false,
                error: 'Inspection not found'
            };
        }

        return {
            success: true,
            data: inspection
        };
    } catch (error) {
        return {
            success: false,
            error: 'Failed to fetch inspection'
        };
    }
};

export const createInspection = async (inspection: Omit<Inspection, 'id' | 'createdAt' | 'status'>): Promise<ApiResponse<Inspection>> => {
    await delay(800);

    try {
        const newInspection = LocalStorage.addInspection(inspection);

        return {
            success: true,
            data: newInspection
        };
    } catch (error) {
        return {
            success: false,
            error: 'Failed to create inspection'
        };
    }
};

export const updateInspection = async (id: number, updates: Partial<Inspection>): Promise<ApiResponse<Inspection>> => {
    await delay(500);

    try {
        const updatedInspection = LocalStorage.updateInspection(id, updates);

        if (!updatedInspection) {
            return {
                success: false,
                error: 'Inspection not found'
            };
        }

        return {
            success: true,
            data: updatedInspection
        };
    } catch (error) {
        return {
            success: false,
            error: 'Failed to update inspection'
        };
    }
};

export const deleteInspection = async (id: number): Promise<ApiResponse<{ success: boolean }>> => {
    await delay(500);

    try {
        const deleted = LocalStorage.deleteInspection(id);

        return {
            success: true,
            data: { success: deleted }
        };
    } catch (error) {
        return {
            success: false,
            error: 'Failed to delete inspection'
        };
    }
};

// Property APIs
export const getProperties = async (): Promise<ApiResponse<Property[]>> => {
    await delay(500);

    try {
        const properties = LocalStorage.getProperties();

        return {
            success: true,
            data: properties
        };
    } catch (error) {
        return {
            success: false,
            error: 'Failed to fetch properties'
        };
    }
};

export const getPropertyById = async (id: number): Promise<ApiResponse<Property>> => {
    await delay(300);

    try {
        const property = LocalStorage.getPropertyById(id);

        if (!property) {
            return {
                success: false,
                error: 'Property not found'
            };
        }

        return {
            success: true,
            data: property
        };
    } catch (error) {
        return {
            success: false,
            error: 'Failed to fetch property'
        };
    }
};

export const createProperty = async (property: Omit<Property, 'id' | 'createdAt'>): Promise<ApiResponse<Property>> => {
    await delay(800);

    try {
        const newProperty = LocalStorage.addProperty(property);

        return {
            success: true,
            data: newProperty
        };
    } catch (error) {
        return {
            success: false,
            error: 'Failed to create property'
        };
    }
};

export const updateProperty = async (id: number, updates: Partial<Property>): Promise<ApiResponse<Property>> => {
    await delay(500);

    try {
        const updatedProperty = LocalStorage.updateProperty(id, updates);

        if (!updatedProperty) {
            return {
                success: false,
                error: 'Property not found'
            };
        }

        return {
            success: true,
            data: updatedProperty
        };
    } catch (error) {
        return {
            success: false,
            error: 'Failed to update property'
        };
    }
};

export const deleteProperty = async (id: number): Promise<ApiResponse<{ success: boolean }>> => {
    await delay(500);

    try {
        const deleted = LocalStorage.deleteProperty(id);

        return {
            success: true,
            data: { success: deleted }
        };
    } catch (error) {
        return {
            success: false,
            error: 'Failed to delete property'
        };
    }
};

// User APIs
export const getUserProfile = async (userId: string): Promise<ApiResponse<Omit<User, 'password'>>> => {
    await delay(500);

    try {
        const user = LocalStorage.getUserById(userId);

        if (!user) {
            return {
                success: false,
                error: 'User not found'
            };
        }

        // Never return the password in a real API
        const { password, ...userWithoutPassword } = user;

        return {
            success: true,
            data: userWithoutPassword
        };
    } catch (error) {
        return {
            success: false,
            error: 'Failed to fetch user profile'
        };
    }
};

// Media APIs
export const uploadImage = async (
    imageUri: string,
    metadata: { roomName?: string; timestamp: string; source?: 'camera' | 'gallery' }
): Promise<ApiResponse<{ id: string; url: string; metadata: any }>> => {
    await delay(1000); // Simulate network delay for image upload

    try {
        // In a real app, this would upload the image to a server or cloud storage
        // For this mock, we'll just return the same URI as the URL
        const imageId = `img_${Date.now()}`;

        return {
            success: true,
            data: {
                id: imageId,
                url: imageUri, // In a real app, this would be the URL from the server
                metadata
            }
        };
    } catch (error) {
        return {
            success: false,
            error: 'Failed to upload image'
        };
    }
};

// Export the API
const api = {
    // Auth
    login,
    signup,
    forgotPassword,
    verifyCode,
    resetPassword,

    // User
    getUserProfile,

    // Inspections
    getInspections,
    getInspectionById,
    createInspection,
    updateInspection,
    deleteInspection,

    // Properties
    getProperties,
    getPropertyById,
    createProperty,
    updateProperty,
    deleteProperty,

    // Media
    uploadImage
};

export default api; 
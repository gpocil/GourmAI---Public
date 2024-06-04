import React, { createContext, useContext, ReactNode } from 'react';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { Auth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuration Firebase
const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_URL,
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
});


// Type including Firebase & Firebase Storage
interface FirebaseContextType {
    app: FirebaseApp;
    storage: FirebaseStorage;
    auth: Auth;
}

// Type for children
interface FirebaseProviderProps {
    children: ReactNode;
}

// Init as undefined
const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

// Provider
export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({ children }) => {
    return (
        <FirebaseContext.Provider value={{ app, storage, auth }}>
            {children}
        </FirebaseContext.Provider>
    );
};

// Hook : returns Firebase app, storage, auth
export const useFirebase = (): FirebaseContextType => {
    const context = useContext(FirebaseContext);
    if (context === undefined) {
        throw new Error('useFirebase doit être utilisé au sein d\'un FirebaseProvider');
    }
    return context;
};

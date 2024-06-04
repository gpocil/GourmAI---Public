import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { useFirebase } from './FireBaseContext';

interface UserCustom extends FirebaseUser {
    id: string;
    displayName: string;
    email: string;
    photoURL: string | null; //  nullable to handle cases where it's not set
    favoriteAttributes: string[];
    recipeIds: string[];
    status: string;
}

interface UserContextType {
    currentUser: UserCustom | null;
    setUser: (user: UserCustom | null) => void;
    loading: boolean;
}

const UserContext = createContext<UserContextType>({
    currentUser: null,
    setUser: () => { },
    loading: true
});

export const useUser = () => useContext(UserContext);

const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { auth } = useFirebase();
    const [currentUser, setCurrentUser] = useState<UserCustom | null>(null);
    const [loading, setLoading] = useState(true);

    const setUser = (userData: UserCustom) => {
        setCurrentUser(userData);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                const customUser: UserCustom = {
                    ...user,
                    id: user.uid,
                    displayName: user.displayName || '',
                    email: user.email || '',
                    photoURL: user.photoURL || null,
                    favoriteAttributes: [],
                    recipeIds: [],
                    status: ''
                };
                setCurrentUser(customUser);
            } else {
                setCurrentUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [auth]);

    return (
        <UserContext.Provider value={{ currentUser, setUser, loading }}>
            {!loading && children}
        </UserContext.Provider>
    );
};

export default UserProvider;

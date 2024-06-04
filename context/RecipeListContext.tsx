import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUser } from './UserContext';
import apiClient from '../components/util/ApiClient';

interface Attribute {
    id: string;
    name: string;
}

interface RecipeData {
    id: string;
    title: string;
    ingredients: string;
    description: string;
    instructions: string;
    photoUrl: string;
    calories: string;
    prepTime: string;
    difficultyLevel: string;
    attributes: Attribute[];
    userScore: number;
    userId: string;
    creationDate: {
        _seconds: number;
        _nanoseconds: number;
    };
}

interface RecipeList {
    recipeList: RecipeData[];
    addRecipeToList: (newRecipe: RecipeData) => void;
    deleteRecipeFromList: (recipeId: string) => void;
    getRecipeListUser: (userId: string) => Promise<void>;
}

const RecipeListContext = createContext<RecipeList | undefined>(undefined);

export const RecipeListProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [recipeList, setRecipeList] = useState<RecipeData[]>([]);
    const { currentUser } = useUser();
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    const addRecipeToList = (newRecipe: RecipeData) => {
        setRecipeList((prevList) => {
            const updatedList = [...prevList, newRecipe];
            AsyncStorage.setItem('recipeList', JSON.stringify(updatedList));
            return updatedList;
        });
    };

    const deleteRecipeFromList = (recipeId: string) => {
        setRecipeList(prevList => prevList.filter(recipe => recipe.id !== recipeId));
        AsyncStorage.setItem('recipeList', JSON.stringify(recipeList.filter(recipe => recipe.id !== recipeId)))
            .then(() => console.log('Updated AsyncStorage after deleting a recipe'))
            .catch(error => console.error('Failed to update AsyncStorage:', error));
    };

    const getRecipeListUser = async (userId: string) => {
        // console.log(`Attempting to fetch recipes for user ID: ${userId} from AsyncStorage`);

        const storedRecipeList = await AsyncStorage.getItem('recipeList');
        if (storedRecipeList) {
            const parsedRecipeList = JSON.parse(storedRecipeList);



            setRecipeList(parsedRecipeList);
        } else {
            // console.log(`No recipes found in AsyncStorage. Fetching from API for user ID: ${userId}`);
            const url = `/recipe/user/${userId}`;

            try {
                const response = await apiClient.get(url);

                if (response.status === 404) {
                    // console.log('No recipes found for the user.');
                    setRecipeList([]);
                    return;
                }

                const userData = response.data;
                setRecipeList(userData);
                await AsyncStorage.setItem('recipeList', JSON.stringify(userData));
            } catch (error) {
                console.error('Failed to fetch or save recipes:', error);
            }
        }
    };

    const clearRecipeList = () => {
        setRecipeList([]);
        AsyncStorage.removeItem('recipeList');
    };

    useEffect(() => {
        if (currentUser && currentUser.id) {
            getRecipeListUser(currentUser.id);
            setIsInitialLoad(false);
        }
        else if (!isInitialLoad) {
            clearRecipeList();
        }
    }, [currentUser]);

    return (
        <RecipeListContext.Provider value={{ recipeList, addRecipeToList, deleteRecipeFromList, getRecipeListUser }}>
            {children}
        </RecipeListContext.Provider>
    );
};

export const useRecipeList = () => useContext(RecipeListContext);

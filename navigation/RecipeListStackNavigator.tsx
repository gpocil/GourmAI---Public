import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import RecipesUserList from '../components/RecipesUserList';
import Recipe from '../components/Recipe';
import 'react-native-gesture-handler';
const Stack = createStackNavigator();

const RecipeListStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="RecipeList"
                component={RecipesUserList}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Recipe"
                component={Recipe}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
}

export default RecipeListStack;

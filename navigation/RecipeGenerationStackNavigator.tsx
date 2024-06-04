import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import RecipeGeneration from '../components/RecipeGeneration';
import Recipe from '../components/Recipe';
import 'react-native-gesture-handler';

const Stack = createStackNavigator();

function RecipeGenerationStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="RecipeGenerationHome"
                component={RecipeGeneration}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="DetailScreen"
                component={Recipe}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
}

export default RecipeGenerationStack;

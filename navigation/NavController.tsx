import React, { useEffect, useState } from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { StyleSheet, TouchableOpacity, Platform, Dimensions } from 'react-native';
import RecipeGenerationStack from './RecipeGenerationStackNavigator';
import { useUser } from '../context/UserContext';
import { useProcessing } from '../context/ProcessingContext';
import Login from '../components/Login';
import RecipeListStack from './RecipeListStackNavigator';
import BlogStack from './BlogStackNavigator';
import 'react-native-gesture-handler';

const Tab = createMaterialBottomTabNavigator();

function AppNavigation() {
    const { currentUser } = useUser();
    const { isProcessing } = useProcessing();
    const [tabLabel, setTabLabel] = useState(currentUser ? 'Mon compte' : 'Se connecter');

    const screenHeight = Dimensions.get('window').height;
    const navBarHeight = screenHeight > 800 ? 90 : 70;

    useEffect(() => {
        setTabLabel(currentUser ? 'Mon compte' : 'Se connecter');
    }, [currentUser]);

    return (
        <Tab.Navigator
            initialRouteName="Feed"
            activeColor="#FFFFFF"
            inactiveColor="#CAB2AE"
            barStyle={{
                backgroundColor: '#94655D',
                borderRadius: Platform.OS === 'ios' ? 0 : 20,
                overflow: 'hidden',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 6,
                marginTop: Platform.OS === 'ios' ? 0 : 2,
                marginBottom: Platform.OS === 'ios' ? 0 : 8,
                marginLeft: Platform.OS === 'ios' ? 0 : 8,
                marginRight: Platform.OS === 'ios' ? 0 : 8,
                height: navBarHeight
            }}
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, focused }) => {
                    const icons = {
                        RecipeGeneration: 'creation',
                        Blog: 'bulletin-board',
                        Liste_Recettes: 'book-open-page-variant-outline',
                        Login: 'account',
                    };
                    return (
                        <MaterialCommunityIcons
                            name={icons[route.name]}
                            color={focused ? '#ff5500' : 'rgba(255, 255, 255, 0.5)'}
                            size={26}
                        />
                    );
                },
                tabBarLabelStyle: {
                    color: ({ focused }) => (focused ? '#ff5500' : '#CAB2AE'),
                    fontSize: 12,
                },
                tabBarButton: (props) => (
                    <TouchableOpacity {...props} disabled={isProcessing} style={[props.style, isProcessing ? styles.disabledTab : null]}>
                        {props.children}
                    </TouchableOpacity>
                ),
            })}
        >
            <Tab.Screen
                name="RecipeGeneration"
                component={RecipeGenerationStack}
                options={{ tabBarLabel: 'Création' }}
            />
            <Tab.Screen
                name="Liste_Recettes"
                component={RecipeListStack}
                options={{ tabBarLabel: 'Mes recettes' }}
            />
            <Tab.Screen
                name="Blog"
                component={BlogStack}
                options={{ tabBarLabel: 'Blog' }}
            />
            <Tab.Screen
                name="Login"
                component={Login}
                options={{ tabBarLabel: tabLabel }}
            />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    disabledTab: {
        opacity: 0.5
    },
});

export default AppNavigation;

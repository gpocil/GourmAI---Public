import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Blog from '../components/Blog';
import BlogPost from '../components/BlogPost';
import 'react-native-gesture-handler';

const Stack = createStackNavigator();

const BlogStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="BlogList"
                component={Blog}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="BlogPost"
                component={BlogPost}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
}

export default BlogStack;

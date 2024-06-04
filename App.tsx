import React, { useEffect, useMemo } from 'react';
import { Dimensions, View } from 'react-native';
import { FirebaseProvider } from './context/FireBaseContext';
import UserProvider from './context/UserContext';
import AppNavigation from "./navigation/NavController";
import { enableScreens } from 'react-native-screens';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RecipeListProvider } from './context/RecipeListContext';
import { ProcessingProvider } from './context/ProcessingContext';
import mobileAds from 'react-native-google-mobile-ads';

enableScreens();

export default function App() {
  useEffect(() => {
    mobileAds()
      .initialize()
      .then(adapterStatuses => {
        console.log(adapterStatuses);
      });
  }, []);

  const screenHeight = Dimensions.get('window').height;
  const marginTop = screenHeight > 800 ? 40 : 0;

  const appStyle = useMemo(() => ({
    flex: 1,
    marginTop: marginTop
  }), [marginTop]);

  return (
    <SafeAreaProvider>
      <View style={appStyle}>
        <FirebaseProvider>
          <UserProvider>
            <RecipeListProvider>
              <ProcessingProvider>
                <NavigationContainer>
                  <AppNavigation />
                </NavigationContainer>
              </ProcessingProvider>
            </RecipeListProvider>
          </UserProvider>
        </FirebaseProvider>
      </View>
    </SafeAreaProvider>
  );
}

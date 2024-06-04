import { Video } from 'expo-av';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Text, Platform } from 'react-native';
import { InterstitialAd, AdEventType, TestIds } from 'react-native-google-mobile-ads';

const adUnitId = __DEV__
    ? TestIds.INTERSTITIAL
    : Platform.OS === 'ios'
        ? process.env.EXPO_PUBLIC_IOS_INTERSTITIAL_ID
        : process.env.EXPO_PUBLIC_ANDROID_INTERSTITIAL_ID;

const AdLoading = ({ isProcessing }) => {
    const [interstitial, setInterstitial] = useState(null);
    const [loaded, setLoaded] = useState(false);



    useEffect(() => {

        if (!isProcessing) {
            try {
                const ad = InterstitialAd.createForAdRequest(adUnitId, {
                    keywords: ['cooking', 'food', 'recipe'],
                });

                const unsubscribeLoaded = ad.addAdEventListener(AdEventType.LOADED, () => {
                    setLoaded(true);
                });

                const unsubscribeError = ad.addAdEventListener(AdEventType.ERROR, (error) => {
                    console.error('Ad failed to load:', error);
                });

                ad.load();
                setInterstitial(ad);

                return () => {
                    unsubscribeLoaded();
                    unsubscribeError();
                    setLoaded(false);
                };
            } catch (error) {
                console.error('Error creating or loading interstitial ad:', error);
            }
        }
    }, [isProcessing]);

    useEffect(() => {
        if (isProcessing && loaded) {
            try {
                interstitial.show();
            } catch (error) {
                console.error('Error showing interstitial ad:', error);
            }
        }
    }, [isProcessing, loaded, interstitial]);

    if (!isProcessing) {
        return null;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.loadingText}>Préparation de votre recette... 🍲</Text>
            <Video
                source={require('../../../assets/cooking.mp4')}
                style={styles.centeredImage}
                resizeMode="contain"
                shouldPlay
                isLooping
            />
            <Text style={styles.loadingText}>... Ça arrive 😋</Text>

        </View>
    );
};

const { width: screenWidth } = Dimensions.get('window');
const margin = 5;
const videoWidth = screenWidth - margin * 2;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        margin: margin,
    },
    centeredImage: {
        width: videoWidth,
        height: videoWidth * (316 / 399),
        borderRadius: 20,
    },
    loadingText: {
        fontSize: 18,
        marginBottom: 10,
        textAlign: 'center',
    },
    progressBarContainer: {
        height: 20,
        width: '80%',
        backgroundColor: '#DDD',
        borderRadius: 10,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#E09D4A',
    },
});

export default AdLoading;

import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Text, Platform } from 'react-native';
import { InterstitialAd, AdEventType, TestIds } from 'react-native-google-mobile-ads';

const adUnitId = __DEV__
    ? TestIds.INTERSTITIAL
    : Platform.OS === 'ios'
        ? process.env.EXPO_PUBLIC_IOS_INTERSTITIAL_ID
        : process.env.EXPO_PUBLIC_ANDROID_INTERSTITIAL_ID;

const AdInterstitial = ({ showAd, onAdClose }) => {
    const [interstitial, setInterstitial] = useState(null);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const loadAd = async () => {
            if (showAd && !loaded) {
                try {
                    const ad = InterstitialAd.createForAdRequest(adUnitId, {
                        keywords: ['cooking', 'food', 'recipe'],
                    });

                    const unsubscribeLoaded = ad.addAdEventListener(AdEventType.LOADED, () => {
                        setLoaded(true);
                    });

                    const unsubscribeError = ad.addAdEventListener(AdEventType.ERROR, (error) => {
                        console.error('Error loading interstitial ad:', error);
                    });

                    ad.load();
                    setInterstitial(ad);

                    return () => {
                        unsubscribeLoaded();
                        unsubscribeError();
                    };
                } catch (error) {
                    console.error('Error creating interstitial ad:', error);
                }
            }
        };

        loadAd();
    }, [showAd, loaded]);

    useEffect(() => {
        const showInterstitialAd = async () => {
            if (showAd && loaded && interstitial) {
                try {
                    await interstitial.show();
                    setLoaded(false);
                    setInterstitial(null); // Cleanup the ad object
                    if (onAdClose) {
                        onAdClose();
                    }
                } catch (error) {
                    console.error('Error showing ad:', error);
                }
            }
        };

        showInterstitialAd();
    }, [showAd, loaded, interstitial, onAdClose]);

    if (!showAd) {
        return null;
    }

    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text>Loading Ad...</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default AdInterstitial;

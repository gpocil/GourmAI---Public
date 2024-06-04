import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Alert, Platform, Image, Modal, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useUser } from '../context/UserContext';
import apiClient from './util/ApiClient';
import Loader from './util/Loader';
import SignInModal from './util/modals/SignInModal';
import SignUpModal from './util/modals/SignUpModal';
import LoginButton from './util/LoginButton';
import * as AppleAuthentication from 'expo-apple-authentication';
import LoginSuccessfulModal from './util/modals/LoginSuccessfulModal';

GoogleSignin.configure({
    webClientId: '1022558827039-kfvn5d3gapa7spk5d7vi25hdhgq6mel1.apps.googleusercontent.com',
    iosClientId: Platform.OS === 'ios' ? '1022558827039-0mh0hfab2m2gbvgq8jmshs2eiooormbo.apps.googleusercontent.com' : undefined,
});

const Login = () => {
    const { currentUser, setUser } = useUser();
    const [loading, setLoading] = useState(false);
    const [showSignUpModal, setShowSignUpModal] = useState(false);
    const [showSignInModal, setShowSignInModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [AppleAuthentication, setAppleAuthentication] = useState(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    useEffect(() => {
        if (Platform.OS === 'ios') {
            try {
                const AppleAuth = require('expo-apple-authentication');
                setAppleAuthentication(AppleAuth);
            } catch (err) {
                console.log('Error loading Apple Authentication module', err);
            }
        }
    }, []);

    const signInWithGoogle = async () => {
        setLoading(true);
        try {
            const { idToken } = await GoogleSignin.signIn();
            const googleCredential = auth.GoogleAuthProvider.credential(idToken);
            const userCredential = await auth().signInWithCredential(googleCredential);

            let displayName = userCredential.user.displayName;
            let photoURL = userCredential.user.photoURL;

            if (userCredential.user.providerData && userCredential.user.providerData.length > 0) {
                const googleProviderData = userCredential.user.providerData.find(
                    (provider) => provider.providerId === 'google.com'
                );

                if (googleProviderData) {
                    displayName = googleProviderData.displayName || displayName;
                    photoURL = googleProviderData.photoURL || photoURL;
                }
            }

            const response = await apiClient.post('/user/signin', {
                email: userCredential.user.email,
                displayName,
            });

            const customUser = {
                ...response.data,
                photoURL: photoURL || response.data.photoURL,
            };

            await AsyncStorage.setItem('userData', JSON.stringify(customUser));

            setUser(customUser);
            setShowSuccessModal(true);
        } catch (error) {
            console.error('Erreur lors de la connexion:', error);
            Alert.alert('Erreur de connexion', error.message);
        }
        setLoading(false);
    };

    const signUpWithEmail = async (email, password, displayName) => {
        try {
            const userCredential = await auth().createUserWithEmailAndPassword(email, password);
            await userCredential.user.updateProfile({ displayName });
            await userCredential.user.sendEmailVerification();
            Alert.alert(
                '🎉 Inscription réussie 🎉',
                `Un email de vérification vous a été envoyé à l'adresse : ${email} 📧. Merci de cliquer sur le lien pour confirmer votre inscription !`
            );
        } catch (error) {
            console.error('Error during sign up:', error);
            Alert.alert('❌ Erreur à l\'inscription :(', 'Une erreur est survenue lors de l\'inscription. Veuillez réessayer.');
        } finally {
            console.log('Sign up process finished.');
        }
    };

    const signInWithEmail = async (email, password) => {
        try {
            const userCredential = await auth().signInWithEmailAndPassword(email, password);
            const user = userCredential.user;

            if (user.emailVerified) {

                const response = await apiClient.post('/user/signin', {
                    email,
                    displayName: user.displayName,
                });

                await AsyncStorage.setItem('userData', JSON.stringify(response.data));
                setUser(response.data);

                setShowSuccessModal(true);
            } else {
                Alert.alert('❗ Email de vérification', `Merci de cliquer sur le lien qui vous a été envoyé à l'adresse : ${email} 📧.`);
                await user.sendEmailVerification();
            }
        } catch (error) {
            console.error('Error during sign in:', error);
            Alert.alert('❌ Erreur de connexion', 'Une erreur est survenue lors de la connexion. Veuillez réessayer.');
        } finally {
            // console.log('Sign in process finished.');
        }
    };

    const signInWithApple = async () => {
        try {
            setLoading(true);
            console.log('Starting Apple sign-in process');

            const credential = await AppleAuthentication.signInAsync({
                requestedScopes: [
                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                    AppleAuthentication.AppleAuthenticationScope.EMAIL,
                ],
            });



            const appleCredential = auth.AppleAuthProvider.credential(credential.identityToken);
            const userCredential = await auth().signInWithCredential(appleCredential);
            const { email, displayName, photoURL } = userCredential.user;


            const response = await apiClient.post('/user/signin', {
                email,
                displayName,
            });

            console.log('API response data:', response.data);

            const customUser = {
                ...response.data,
                displayName: displayName || response.data.displayName,
                photoURL: photoURL || response.data.photoURL,
            };

            await AsyncStorage.setItem('userData', JSON.stringify(customUser));

            setUser(customUser);
            setShowSuccessModal(true);

            console.log('User signed in with Apple:', customUser);
        } catch (error) {
            console.error('Error during Apple sign-in:', error);
            Alert.alert('Connection Error', error.message);
        }
        setLoading(false);
    };

    const signOut = async () => {
        try {
            await GoogleSignin.signOut();
            await auth().signOut();
            await AsyncStorage.removeItem('userData');
            setUser(null);
            console.log('Déconnexion réussie');
        } catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
            Alert.alert('Déconnexion échouée', error.message);
        }
    };

    const deleteAccount = async () => {
        try {
            if (!currentUser || !currentUser.id) {
                Alert.alert('Erreur', 'Utilisateur non trouvé');
                return;
            }

            await apiClient.delete(`/user/delete/${currentUser.id}`);
            await signOut();
            Alert.alert('Compte supprimé', 'Votre compte a été supprimé avec succès.');
        } catch (error) {
            console.error('Erreur lors de la suppression du compte:', error);
            Alert.alert('Erreur de suppression', 'Une erreur est survenue lors de la suppression du compte. Veuillez réessayer.');
        }
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <View style={styles.container}>
            <Image source={require('../assets/icon.png')} style={styles.iconImage} />
            {currentUser ? (
                <>
                    <View style={styles.userContainer}>
                        {currentUser.photoURL && (
                            <Image source={{ uri: currentUser.photoURL }} style={styles.userImage} />
                        )}
                        <Text style={styles.userInfo}>
                            {currentUser.displayName ? `Connecté en tant que ${currentUser.displayName}` : 'Connecté'}
                        </Text>
                    </View>

                    <LoginButton
                        onPress={() => signOut()}
                        icon={<MaterialIcons name="logout" size={24} color="black" />}
                        title="Se déconnecter"
                    />
                    <LoginButton
                        onPress={() => setShowDeleteModal(true)}
                        icon={<MaterialIcons name="delete" size={24} color="black" />}
                        title="Supprimer mon compte"
                    />
                </>
            ) : (
                <View style={styles.buttonContainer}>
                    <LoginButton
                        onPress={() => signInWithGoogle()}
                        imageSource={require('../assets/google.png')}
                        title="Se connecter avec Google"
                    />
                    {Platform.OS === 'ios' && AppleAuthentication && (
                        <LoginButton
                            onPress={signInWithApple}
                            icon={<MaterialCommunityIcons name="apple" size={24} color="black" />}
                            title="Se connecter avec Apple"
                        />
                    )}
                    <LoginButton
                        onPress={() => setShowSignInModal(true)}
                        icon={<MaterialIcons name="email" size={24} color="black" />}
                        title="Se connecter par Email"
                    />
                    <LoginButton
                        onPress={() => setShowSignUpModal(true)}
                        icon={<MaterialCommunityIcons name="account-plus" size={24} color="#48444E" />}
                        title="Créer un compte"
                    />
                </View>
            )}

            <SignUpModal
                visible={showSignUpModal}
                onClose={() => setShowSignUpModal(false)}
                signUpWithEmail={signUpWithEmail}
            />

            <SignInModal
                visible={showSignInModal}
                onClose={() => setShowSignInModal(false)}
                signInWithEmail={signInWithEmail}
            />
            <LoginSuccessfulModal
                visible={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                displayName={currentUser ? currentUser.displayName : ''}
            />

            <Modal
                visible={showDeleteModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowDeleteModal(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>Voulez-vous vraiment supprimer votre compte ? Cette action est irréversible.</Text>
                        <View style={styles.modalButtonContainer}>
                            <TouchableOpacity
                                style={styles.modalButton}
                                onPress={() => {
                                    setShowDeleteModal(false);
                                    deleteAccount();
                                }}
                            >
                                <Text style={styles.modalButtonText}>Oui</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.modalButton}
                                onPress={() => setShowDeleteModal(false)}
                            >
                                <Text style={styles.modalButtonText}>Non</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FDF8F1',
    },
    buttonContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        padding: 15,
        marginBottom: 20,
        alignItems: 'center',
        elevation: 2,
        width: 250,
    },
    textStyle: {
        color: "#48444E",
        fontWeight: "bold",
        textAlign: "center",
        marginLeft: 10,
    },
    icon: {
        width: 24,
        height: 24,
    },
    userInfo: {
        marginBottom: 10,
        color: "#48444E",
        fontWeight: "bold",
    },
    iconImage: {
        width: 200,
        height: 200,
        borderRadius: 100,
        marginBottom: 20,
    },
    userContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    userImage: {
        width: 35,
        height: 35,
        borderRadius: 17.5,
        marginRight: 10,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: 300,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    modalText: {
        marginBottom: 20,
        textAlign: 'center',
        color: '#48444E',
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    modalButton: {
        flex: 1,
        alignItems: 'center',
        padding: 10,
        marginHorizontal: 5,
        backgroundColor: '#F8F8F8',
        borderRadius: 5,
    },
    modalButtonText: {
        color: '#48444E',
        fontWeight: 'bold',
    },
    errorContainer: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#fdecea',
        borderRadius: 10,
    },
    errorText: {
        color: '#d9534f',
    },
});

export default Login;

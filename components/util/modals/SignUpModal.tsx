import React, { useState } from 'react';
import { Modal, TextInput, View, StyleSheet, TouchableOpacity, Text } from 'react-native';

interface SignUpModalProps {
    visible: boolean;
    onClose: () => void;
    signUpWithEmail: (email: string, password: string, displayName: string) => void;
}

const SignUpModal: React.FC<SignUpModalProps> = ({ visible, onClose, signUpWithEmail }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setdisplayName] = useState('');

    const handleSignUp = () => {
        signUpWithEmail(email, password, displayName);
        onClose();
    };

    const handleOverlayClick = (event: any) => {
        // Prevent closing the modal when clicking inside the modal content
        if (event.target === event.currentTarget) {
            onClose();
        }
    };

    return (
        <Modal transparent={true} visible={visible} animationType="slide">
            <View style={styles.centeredView} onStartShouldSetResponder={() => true} onTouchEnd={handleOverlayClick}>
                <View style={styles.modalView}>
                    <TextInput
                        placeholder="Pseudo"
                        value={displayName}
                        onChangeText={setdisplayName}
                        keyboardType="default"
                        autoCapitalize="none"
                        style={styles.input}
                    />
                    <TextInput
                        placeholder="Adresse email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        style={styles.input}
                    />
                    <TextInput
                        placeholder="Mot de passe"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        autoCapitalize="none"
                        style={styles.input}
                    />
                    <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                        <Text style={styles.buttonText}>S'inscrire</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        elevation: 5,
        width: '80%',
    },
    input: {
        borderBottomWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
        width: '100%',
    },
    button: {
        backgroundColor: '#bf867c',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginTop: 20,
        elevation: 2,
    },
    buttonText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: 'bold',
    },
});

export default SignUpModal;

import React from 'react';
import { Modal, View, Text, StyleSheet, Button } from 'react-native';

interface LoginSuccessfulModalProps {
    visible: boolean;
    onClose: () => void;
    displayName: string;
}

const LoginSuccessfulModal: React.FC<LoginSuccessfulModalProps> = ({ visible, onClose, displayName }) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>

                    <Text style={styles.modalText}> Bienvenue {displayName} ! 🎉</Text>
                    <View style={styles.buttonContainer}>
                        <Button title="OK" onPress={onClose} color="#2196F3" />
                    </View>
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
        width: 300,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    successImage: {
        width: 80,
        height: 80,
        marginBottom: 15,
    },
    modalText: {
        marginBottom: 10,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
        color: '#48444E',
    },
    emojiText: {
        fontSize: 24,
        textAlign: 'center',
        marginBottom: 15,
    },
    closeButton: {
        backgroundColor: '#2196F3',
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonContainer: {
        width: '100%',
    },
});

export default LoginSuccessfulModal;

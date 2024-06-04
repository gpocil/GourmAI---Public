import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface Props {
    isVisible: boolean;
    onSelectMode: (mode: 'full' | 'gourmet') => void;
    onClose: () => void;
}

const GenerationModal: React.FC<Props> = ({ isVisible, onSelectMode, onClose }) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <TouchableOpacity
                style={styles.centeredView}
                activeOpacity={1}
                onPressOut={onClose}
            >
                <View style={styles.modalView}>
                    <Text style={styles.modeTitle}>👨‍🍳 Mode de préparation :</Text>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => onSelectMode('full')}
                    >
                        <Text style={styles.buttonText}>🎉 Mode Full - Utiliser TOUS les ingrédients</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => onSelectMode('gourmet')}
                    >
                        <Text style={styles.buttonText}>🍽 Mode Gourmet - Meilleure combinaison d'ingrédients</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
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
        margin: 10,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    modeTitle: {
        marginBottom: 20,
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    button: {
        backgroundColor: '#bf867c',
        borderRadius: 10,
        padding: 10,
        elevation: 2,
        marginVertical: 5,
        width: 260,
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 16
    }
});

export default GenerationModal;

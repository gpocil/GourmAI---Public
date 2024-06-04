import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';

interface IngredientListModalProps {
    isVisible: boolean;
    onClose: () => void;
    ingredients: string[];
    removeIngredient: (ingredient: string) => void;
}

const IngredientListModal: React.FC<IngredientListModalProps> = ({ isVisible, onClose, ingredients, removeIngredient }) => {
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
                    <Text style={styles.modalTitle}>Liste des ingrédients 🥦</Text>
                    <Text style={styles.subtitle}>(Swipez pour supprimer 👈)</Text>

                    <SwipeListView
                        data={ingredients.map((ingredient, index) => ({ key: `${index}`, value: ingredient }))}
                        renderItem={({ item }) => (
                            <View style={styles.rowFront}>
                                <Text style={styles.ingredientText}>{item.value}</Text>
                            </View>
                        )}
                        renderHiddenItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.deleteButton}
                                onPress={() => removeIngredient(item.value)}
                            >
                                <MaterialIcons name="delete" size={24} color="white" />
                            </TouchableOpacity>
                        )}
                        disableRightSwipe
                        rightOpenValue={-75}
                    />
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
        width: '90%',
        maxWidth: 600,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#bf867c',
        marginBottom: 10
    },
    rowFront: {
        backgroundColor: 'white',
        borderBottomColor: '#bf867c',
        borderBottomWidth: 1,
        height: 60,
        justifyContent: 'center',
        paddingHorizontal: 15,
        alignItems: 'center',
    },
    deleteButton: {
        backgroundColor: 'red',
        width: 75,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        right: 10,
    },
    ingredientText: {
        fontSize: 18,
        color: '#333',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 16,
        color: '#686868',
        fontWeight: '500',
        marginBottom: 8,
        textAlign: 'center',
        opacity: 0.8,
    },
});

export default IngredientListModal;


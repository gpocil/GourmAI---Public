import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableHighlight, TouchableOpacity, Image, Alert, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../context/UserContext';
import { useRecipeList } from '../context/RecipeListContext';
import { SwipeListView } from 'react-native-swipe-list-view';
import { MaterialIcons } from '@expo/vector-icons';
import { deleteRecipe } from './util/RecipeUtil';
import AdBanner from './util/ads/AdBanner';
import AdInterstitial from './util/ads/AdInterstitial';
const RecipesUserList = () => {
    const { currentUser } = useUser();
    const { recipeList, getRecipeListUser, deleteRecipeFromList } = useRecipeList();
    const navigation = useNavigation();
    const [topAttributes, setTopAttributes] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [recipeOpenCount, setRecipeOpenCount] = useState(0);
    const [showAd, setShowAd] = useState(false);



    useEffect(() => {
        if (currentUser?.id) {
            getRecipeListUser(currentUser.id).then(() => setLoading(false)).catch(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [currentUser?.id]);


    useEffect(() => {
        const calculateTopAttributes = () => {
            const attributeCounts = {};
            recipeList.forEach(recipe => {
                recipe.attributes.forEach(attribute => {
                    attributeCounts[attribute.name] = (attributeCounts[attribute.name] || 0) + 1;
                });
            });

            const sortedAttributes = Object.keys(attributeCounts).sort((a, b) => attributeCounts[b] - attributeCounts[a]);

            const topFourAttributes = sortedAttributes.slice(0, 4);
            setTopAttributes(topFourAttributes);
        };

        calculateTopAttributes();
    }, [recipeList]);


    const handleAdClose = () => {
        setShowAd(false);
    };

    const handleRecipePress = (recipeData) => {
        setRecipeOpenCount(prevCount => {
            const newCount = prevCount + 1;
            if (newCount % 3 === 0) {
                setShowAd(true);
            }
            return newCount;
        });
        navigation.navigate('Recipe', { recipeData });
    };

    useEffect(() => {
        if (showAd) {
            setRecipeOpenCount(0);
        }
    }, [showAd]);

    const renderListOrMessage = () => {
        if (!currentUser) {
            return <Text style={styles.infoText}>🔑 Connectez-vous pour enregistrer vos recettes !</Text>;
        }

        if (recipeList.length === 0) {
            return <Text style={styles.infoText}>🌟 Commencez à générer des recettes, elles s'ajouteront ici !</Text>;
        }

        return (
            <SwipeListView
                data={filteredRecipes}
                renderItem={renderItem}
                renderHiddenItem={renderHiddenItem}
                leftOpenValue={75}
                rightOpenValue={-75}
                keyExtractor={item => item.id}
                disableRightSwipe
            />

        );
    };

    const handleDeleteRecipe = (recipeId) => {
        Alert.alert(
            'Suppression de recette',
            'Êtes-vous sûr de vouloir supprimer cette recette ?',
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Supprimer',
                    onPress: async () => {
                        try {
                            deleteRecipeFromList(recipeId);
                            await deleteRecipe(recipeId);
                        } catch (error) {
                            console.error('Failed to delete the recipe:', error);
                            Alert.alert('Erreur', 'Échec de la suppression de la recette.');
                        }
                    },
                    style: 'destructive'
                }
            ]
        );
    };

    const renderAttributeButtons = () => {
        return (
            <View style={styles.attributeContainer}>
                <View style={styles.buttonRow}>
                    {topAttributes.map((attribute, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[styles.attributeButton, selectedCategory === attribute && styles.selectedButton]}
                            onPress={() => setSelectedCategory(attribute === selectedCategory ? null : attribute)}
                        >
                            <Text style={[styles.attributeButtonText, selectedCategory === attribute && styles.selectedButtonText]}>{attribute}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        );
    };

    const filteredRecipes = selectedCategory ? recipeList.filter(recipe => recipe.attributes.some(attr => attr.name === selectedCategory)) : recipeList;

    const renderItem = ({ item, index }) => {
        const shouldShowAd = (Platform.OS === 'ios' && (index + 1) % 3 === 0) || (Platform.OS === 'android' && index === 2);

        if ((index + 1) % 3 === 0) {
            return (
                <>
                    <TouchableHighlight
                        onPress={() => handleRecipePress(item)}
                        underlayColor="#DDD"
                        style={styles.itemContainer}
                    >
                        <>
                            <Image source={{ uri: item.photoUrl }} style={styles.image} />
                            <View style={styles.textContainer}>
                                <Text style={styles.title}>{item.title}</Text>
                                <Text style={styles.description}>{item.description}</Text>
                            </View>
                        </>
                    </TouchableHighlight>
                    {shouldShowAd && <AdBanner />}
                </>
            );
        } else {
            return (
                <TouchableHighlight
                    onPress={() => handleRecipePress(item)}
                    underlayColor="#DDD"
                    style={styles.itemContainer}
                >
                    <>
                        <Image source={{ uri: item.photoUrl }} style={styles.image} />
                        <View style={styles.textContainer}>
                            <Text style={styles.title}>{item.title}</Text>
                            <Text style={styles.description}>{item.description}</Text>
                        </View>
                    </>
                </TouchableHighlight>
            );
        }
    };


    const renderHiddenItem = (data, rowMap) => (
        <View style={styles.rowBack}>
            <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => handleDeleteRecipe(data.item.id)}
            >
                <MaterialIcons name="delete" size={24} color="white" />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <AdInterstitial showAd={showAd} onAdClose={handleAdClose} />

            {currentUser && (
                <>
                    <Text style={styles.titleText}>🍽️ Vos recettes</Text>
                    <Text style={styles.subtitle}>(Swipez pour supprimer 👈)</Text>
                </>
            )}


            {renderListOrMessage()}
            {recipeList.length > 0 && renderAttributeButtons()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 20,
        backgroundColor: '#FDF8F1',
        justifyContent: 'center'
    },
    itemContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#94655D',
        overflow: 'hidden',
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginRight: 10,
        marginLeft: 5,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    description: {
        fontSize: 14,
        color: '#666',
    },
    categoryTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        marginLeft: 5,
        textAlign: 'center',

    },
    attributeContainer: {
        alignContent: 'center',
        justifyContent: 'center',
        borderTopColor: '#94655D',
        borderTopWidth: 2,
    },
    buttonRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginLeft: 5,
        marginTop: 5,
        alignContent: 'center',
        justifyContent: 'center',
    },
    attributeButton: {
        backgroundColor: '#E09D4A',
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginRight: 5,
        marginBottom: 5,
        borderRadius: 5,
    },
    selectedButton: {
        backgroundColor: '#ff5500',
    },
    attributeButtonText: {
        color: '#fff',
        fontSize: 14,
    },
    selectedButtonText: {
        fontWeight: 'bold',
    },
    rowBack: {
        alignItems: 'center',
        backgroundColor: '#DDD',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingLeft: 15,
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        width: 75,
    },
    deleteBtn: {
        backgroundColor: 'red',
        width: 75,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        right: 0,
    },
    infoText: {
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        fontSize: 16,
        marginTop: 50,
    },
    titleText: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 10,
        color: '#444'
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

export default RecipesUserList;

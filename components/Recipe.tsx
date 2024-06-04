import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { generateRecipe } from './util/RecipeUtil';
import { useProcessing } from '../context/ProcessingContext';
import { useRecipeList } from '../context/RecipeListContext';
import AdBanner from './util/ads/AdBanner';


const Recipe = ({ route, navigation }: { route: any, navigation: any }) => {
    const [recipeData, setRecipeData] = useState(route.params.recipeData);
    const { retry, listIngredients, instructions, mode, userId } = route.params;
    const scrollViewRef = useRef(null);
    const [shouldScrollToTop, setShouldScrollToTop] = useState(route.params.shouldScrollToTop || true);
    const { isProcessing, setProcessing } = useProcessing();
    const { addRecipeToList } = useRecipeList();

    useEffect(() => {
        setRecipeData(route.params.recipeData);
    }, [route.params.recipeData]);



    useEffect(() => {
        if (shouldScrollToTop && scrollViewRef.current) {
            scrollViewRef.current.scrollTo({ y: 0, animated: true });
            setShouldScrollToTop(false);

        }
    }, [shouldScrollToTop]);

    useEffect(() => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo({ y: 0, animated: true });
        }
    }, [recipeData]);

    const retryRecipe = async () => {
        setProcessing(true);
        const result = await generateRecipe(listIngredients, " qui soit différent de :  " + recipeData.title, mode, userId);
        setRecipeData(result);
        navigation.navigate('DetailScreen', {
            recipeData: result,
            retry: true,
            listIngredients: listIngredients,
            instructions: instructions,
            mode: mode,
            userId: userId,
            shouldScrollToTop: true
        });
        addRecipeToList(result);
        setProcessing(false);

    };
    useEffect(() => {
        if (recipeData) {
            // console.log("recipeData:", recipeData);
        }
    }, [recipeData]);


    if (!recipeData) {
        return (
            <>
                <Text style={styles.ingredientItem}>🔄 Oups, un souci avec la génération. Regénérez ci-dessous ! 😊</Text>
                <TouchableOpacity
                    disabled={isProcessing}
                    onPress={retryRecipe}
                    style={{
                        backgroundColor: isProcessing ? '#ccc' : '#bf867c',
                        borderRadius: 20,
                        paddingVertical: 18,
                        paddingHorizontal: 30,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: isProcessing ? 0.5 : 0.8,
                        shadowRadius: 6,
                        elevation: isProcessing ? 3 : 6,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: 10,
                        opacity: isProcessing ? 0.5 : 1
                    }}>
                    <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold' }}>Regénérer 🥘</Text>
                </TouchableOpacity>
            </>
        );
    }

    const ingredientList = recipeData.ingredients.split(',');
    const renderInstructions = () => {
        if (typeof recipeData.instructions === 'string') {
            // Remove .n
            const cleanedInstructions = recipeData.instructions.replace(/\.\s*n/g, '. ');

            // Match digits followed by a . and a space
            const instructionsList = cleanedInstructions.split(/(\d+\.\s)/).filter(Boolean);

            // Combine step number with its instruction
            const formattedInstructions = [];
            for (let i = 0; i < instructionsList.length; i += 2) {
                if (instructionsList[i + 1]) {
                    formattedInstructions.push(instructionsList[i] + instructionsList[i + 1]);
                }
            }

            if (formattedInstructions.length) {
                return formattedInstructions.map((step, index) => (
                    <Text key={index} style={styles.ingredientItem}>{step.trim()}</Text>
                ));
            }
            return <Text style={styles.ingredientItem}>No instructions found</Text>;
        } else if (typeof recipeData.instructions === 'object') {
            return Object.keys(recipeData.instructions).map((key) => (
                <Text key={key} style={styles.ingredientItem}>{key}. {recipeData.instructions[key]}</Text>
            ));
        } else {
            return (
                <>
                    <Text style={styles.ingredientItem}>🔄 Oups, un souci avec la génération. Regénérez ci-dessous ! 😊</Text>
                    <TouchableOpacity
                        disabled={isProcessing}
                        onPress={retryRecipe}
                        style={{
                            backgroundColor: isProcessing ? '#ccc' : '#bf867c',
                            borderRadius: 20,
                            paddingVertical: 18,
                            paddingHorizontal: 30,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: isProcessing ? 0.5 : 0.8,
                            shadowRadius: 6,
                            elevation: isProcessing ? 3 : 6,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: 10,
                            opacity: isProcessing ? 0.5 : 1
                        }}>
                        <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold' }}>Regénérer 🥘</Text>
                    </TouchableOpacity>
                </>
            );
        }
    };


    return (
        <ScrollView ref={scrollViewRef} style={styles.container}>
            <Image style={styles.image} source={{ uri: recipeData.photoUrl }} />

            <View style={styles.section}>
                <Text style={styles.title}>📝 {recipeData.title}</Text>
                <View style={styles.attributesContainer}>
                    {recipeData.attributes.slice(0, 3).map((attribute, index) => (
                        <Text key={index} style={styles.attributeItem}>{attribute.name}</Text>
                    ))}
                </View>
                <Text style={styles.description}>{recipeData.description}</Text>
            </View>

            <AdBanner></AdBanner>


            <View style={styles.section}>
                <Text style={styles.subtitle}>🔥 Calories</Text>
                <Text>{recipeData.calories}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.subtitle}>⏱ Temps de préparation</Text>
                <Text>{recipeData.prepTime}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.subtitle}>👨‍🍳 Difficulté</Text>
                <Text>{recipeData.difficultyLevel}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.subtitle}>🥘 Ingrédients</Text>
                {ingredientList.map((ingredient: any, index: any) => (
                    <Text key={index} style={styles.ingredientItem}>- {ingredient.trim()}</Text>
                ))}
            </View>

            <View style={styles.section}>
                <Text style={styles.subtitle}>📋 Instructions</Text>
                {renderInstructions()}
            </View>
            {Platform.OS === 'ios' && <AdBanner />}

            {retry && (
                <View style={styles.retryButtonContainer}>
                    <Text style={styles.pointingEmoji}>Vous n'avez pas trouvé votre bonheur ? Relancez la génération ! 👇</Text>
                    <TouchableOpacity
                        disabled={isProcessing}

                        onPress={retryRecipe}
                        style={{
                            backgroundColor: isProcessing ? '#ccc' : '#bf867c',
                            borderRadius: 20,
                            paddingVertical: 18,
                            paddingHorizontal: 30,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: isProcessing ? 0.5 : 0.8,
                            shadowRadius: 6,
                            elevation: isProcessing ? 3 : 6,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: 10,
                            opacity: isProcessing ? 0.5 : 1


                        }}>
                        <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold' }}>Regénérer 🥘</Text>
                    </TouchableOpacity>
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#FDF8F1',
        marginTop: 40
    },
    fallbackText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 18,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 12,
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginBottom: 10,
    },
    section: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 20,
        marginBottom: 5,
    },
    subtitle: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 4,
    },
    description: {
        fontSize: 16,
        marginBottom: 4,
    },
    ingredientItem: {
        fontSize: 16,
        marginBottom: 2,
    },
    retryButtonContainer: {
        marginTop: 20,
        marginBottom: 20,
        alignItems: 'center'
    },
    pointingEmoji: {
        fontSize: 16,
        color: '#686868',
        fontWeight: '500',
        marginBottom: 10,
        textAlign: 'center',
        opacity: 0.8,
    },
    attributesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 4,
    },
    attributeItem: {
        fontWeight: '500',
        fontSize: 14,
        marginRight: 10,
        color: '#686868',
    },


});

export default Recipe;

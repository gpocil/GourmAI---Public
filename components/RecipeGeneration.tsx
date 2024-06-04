import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, Animated, Image, Text, TouchableOpacity, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { ref, getDownloadURL } from "firebase/storage";
import DragAndDropImage from './util/DragAndDropImage';
import { useFirebase } from '../context/FireBaseContext';
import { ImageList } from './util/ImageList';
import { RecipeGenerationStyles } from './styles/RecipeGenerationStyle';
import { generateRecipe } from './util/RecipeUtil';
import { Audio, Video } from 'expo-av';
import { useUser } from '../context/UserContext';
import GenerationModal from './util/modals/GenerationModal';
import IngredientListModal from './util/modals/IngredientListModal';
import { useRecipeList } from '../context/RecipeListContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useProcessing } from '../context/ProcessingContext';
import AdLoading from './util/ads/AdLoading';
import Greetings from './util/Greetings';
import MaterialIcons from '@expo/vector-icons/build/MaterialIcons';

interface ImageItem {
    name: string;
    url: string;
    pan: Animated.ValueXY;
    isVisible: boolean;
}

const RecipeGeneration = ({ navigation }: { navigation: any }) => {
    const { storage } = useFirebase();
    const [listIngredients, setListIngredients] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [imageItems, setImageItems] = useState<ImageItem[]>([]);
    const [draggedItem, setDraggedItem] = useState({ name: '', x: 0, y: 0 });
    const [imageLayout, setImageLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });
    const [isModalVisible, setModalVisible] = useState(false);
    const [isIngredientModalVisible, setIngredientModalVisible] = useState(false);
    const { recipeList, addRecipeToList } = useRecipeList();
    const { isProcessing, setProcessing } = useProcessing();
    const { currentUser, setUser } = useUser();
    const [bannerMessage, setBannerMessage] = useState('');
    const [showBanner, setShowBanner] = useState(false);
    const inputRef = useRef(null);

    const videoContainerRef = useRef(null);

    const dismissKeyboard = () => {
        Keyboard.dismiss();
        inputRef.current?.blur();
    };

    useEffect(() => {
        const fetchUserFromStorage = async () => {
            try {
                const userData = await AsyncStorage.getItem('userData');
                if (userData) {
                    setUser(JSON.parse(userData));
                }
            } catch (error) {
                console.error('Error fetching user data from storage:', error);
            }
        };

        fetchUserFromStorage();
    }, []);

    const removeIngredient = (ingredientToRemove: string) => {
        setListIngredients(prevIngredients => prevIngredients.filter(ingredient => ingredient !== ingredientToRemove));
    };

    const clearInput = () => {
        if (!isProcessing) {
            setSearchQuery('');
            setImageItems([]);
        }
    };


    useEffect(() => {
        if (searchQuery.trim().length > 0) {

            const fetchImageUrls = async () => {
                const normalizedSearchQuery = searchQuery.trim().toLowerCase();

                const urls = await Promise.all(
                    ImageList
                        .filter(name => name.toLowerCase().includes(normalizedSearchQuery))
                        .slice(0, 4) // limite à 4
                        .map(async name => {
                            try {
                                const url = await getDownloadURL(ref(storage, `${process.env.EXPO_PUBLIC_FIREBASE_STORAGE_URL}/${name}.png`));
                                const pan = new Animated.ValueXY();
                                return { name, url, pan, isVisible: true };
                            } catch (error) {
                                console.error("Error fetching URL for", name, error);
                                return null;
                            }
                        })
                );

                const validUrls = urls.filter(urlObj => urlObj !== null);
                setImageItems(validUrls.length > 0 ? validUrls : [{ name: normalizedSearchQuery, url: '', pan: new Animated.ValueXY(), isVisible: true }]);
            };

            fetchImageUrls();
        } else {
            setImageItems([]);
        }
    }, [searchQuery]);


    const updateDraggedItemPosition = (item: { name: string, x: number, y: number }) => {
        setDraggedItem(item);
        checkIfDroppedOnKitchen(item);
    };

    const handleDrop = (droppedItemName: string) => {
        playSound();
        setImageItems(currentItems =>
            currentItems.map(item =>
                item.name === droppedItemName
                    ? { ...item, isVisible: false }
                    : item
            )
        );

        setListIngredients(prevIngredients => [...prevIngredients, droppedItemName]);
        setBannerMessage(`${droppedItemName} ajouté à la liste ! 😊`);
        setShowBanner(true);
        setSearchQuery('');
        setTimeout(() => setShowBanner(false), 800);

    };


    const checkIfDroppedOnKitchen = (item) => {
        const { x, y, width, height } = imageLayout;

        // console.log(`Kitchen Layout - X: ${x}, Y: ${y}, Width: ${width}, Height: ${height}`);
        // console.log(`Dropped Item - Name: ${item.name}, X: ${item.x}, Y: ${item.y}`);

        if (item.x >= x && item.x <= x + width &&
            item.y >= y && item.y <= y + height) {
            handleDrop(item.name);
            // console.log(`${item.name} was dropped on the kitchen`);
        } else {
            // console.log(`${item.name} was not dropped on the kitchen`);
        }
    };

    const handleGenerateAndNavigate = () => {
        setModalVisible(true);
    };

    const saveRecipeListToStorage = async (list) => {
        try {
            // console.log("Saving to storage:", JSON.stringify(list, null, 2));
            await AsyncStorage.setItem('recipeList', JSON.stringify(list));
        } catch (error) {
            console.error('Failed to save recipe list to AsyncStorage:', error);
        }
    };

    const handleModeSelect = async (mode: 'full' | 'gourmet') => {
        setModalVisible(false);
        setProcessing(true);
        try {
            const recipeDetails = {
                listIngredients,
                mode,
                userId: currentUser?.id
            };

            // Remove undefined properties (like userId if it's undefined)
            Object.keys(recipeDetails).forEach(key => recipeDetails[key] === undefined && delete recipeDetails[key]);

            const result = await generateRecipe(recipeDetails.listIngredients, " ", recipeDetails.mode, recipeDetails.userId);

            addRecipeToList(result);
            saveRecipeListToStorage([...recipeList, result]);

            navigation.navigate('DetailScreen', {
                recipeData: result,
                retry: true,
                listIngredients: listIngredients,
                instructions: " ",
                mode: mode,
                userId: recipeDetails.userId
            });
            setProcessing(false);
            setListIngredients([]);
            setSearchQuery('');
        } catch (error) {
            console.error("Failed to generate recipe", error);
            setProcessing(false);
        }
    };

    const playSound = async () => {
        try {
            const sound = new Audio.Sound();
            await sound.loadAsync(require('../assets/pop.mp3'));
            await sound.playAsync();
        } catch (error) {
            console.error('Failed to play the sound:', error);
        }
    };

    const handleCloseModal = () => {
        setModalVisible(false);
    };

    useEffect(() => {
        if (videoContainerRef.current) {
            videoContainerRef.current.measure((fx, fy, width, height, px, py) => {
                // console.log(`Measured layout - X: ${px}, Y: ${py}, Width: ${width}, Height: ${height}`);
                setImageLayout({ x: px, y: py, width, height });

            });
        }
    }, []);



    return (
        <TouchableWithoutFeedback onPress={dismissKeyboard}>

            <View style={RecipeGenerationStyles.container}>
                <Greetings />
                <AdLoading isProcessing={isProcessing} />
                {!isProcessing && (
                    <View style={RecipeGenerationStyles.imageShadowWrapper}>
                        <Image
                            source={require('../assets/illustration.png')}
                            style={RecipeGenerationStyles.imageCooking}
                            resizeMode="contain"
                        />
                    </View>
                )}
                {!isProcessing && (
                    <View style={[RecipeGenerationStyles.searchBarContainer, { marginTop: -40 }]}>
                        <View style={RecipeGenerationStyles.searchRow}>
                            <TextInput
                                style={RecipeGenerationStyles.searchBar}
                                placeholder="🔍 Recherchez vos ingrédients !"
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                            />
                            {searchQuery && (
                                <TouchableOpacity onPress={clearInput} style={RecipeGenerationStyles.clearButton}>
                                    <MaterialIcons name="close" size={24} color="#999" />
                                </TouchableOpacity>
                            )}
                        </View>
                        {showBanner && (
                            <View style={RecipeGenerationStyles.banner}>
                                <Text style={RecipeGenerationStyles.bannerText}>{bannerMessage}</Text>
                            </View>
                        )}


                        <View style={RecipeGenerationStyles.imagesScrollView}>
                            {imageItems.map((image) => (
                                image.isVisible && (
                                    <View key={image.name}>
                                        {image.url ? (
                                            <DragAndDropImage
                                                imageUrl={image.url}
                                                updateDraggedItemPosition={updateDraggedItemPosition}
                                                name={image.name}
                                            />
                                        ) : (
                                            <TouchableOpacity
                                                onPress={() => handleDrop(image.name)}
                                                style={RecipeGenerationStyles.fallbackItem}
                                            >
                                                <Text style={RecipeGenerationStyles.fallbackText}>{image.name}</Text>
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                )
                            ))}
                        </View>


                        <Text style={[RecipeGenerationStyles.title, { marginTop: -30 }]}>👇 Glissez-les ici :</Text>
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'column' }}>
                            <View
                                ref={videoContainerRef}
                                style={RecipeGenerationStyles.dropContainer}
                                onLayout={() => {
                                    if (videoContainerRef.current) {
                                        videoContainerRef.current.measure((fx, fy, width, height, px, py) => {
                                            // console.log(`Measured layout - X: ${px}, Y: ${py}, Width: ${width}, Height: ${height}`);
                                            if (width > 0 && height > 0) {
                                                setImageLayout({ x: px, y: py, width, height });
                                            } else {
                                                console.error('Invalid layout dimensions:', { x: px, y: py, width, height });
                                            }
                                        });
                                    }
                                }}
                            >
                                <View style={RecipeGenerationStyles.videoContainer}>
                                    <Video
                                        source={require('../assets/idle.mp4')}
                                        style={RecipeGenerationStyles.centeredImage}
                                        resizeMode="contain"
                                        shouldPlay
                                        isLooping
                                    />
                                </View>

                            </View>


                            {listIngredients.length >= 1 && (
                                <TouchableOpacity
                                    onPress={() => setIngredientModalVisible(true)}
                                    style={RecipeGenerationStyles.ingredientsButton}
                                >
                                    <Text style={RecipeGenerationStyles.ingredientsButtonText}>
                                        ({listIngredients.length}) 🥦
                                    </Text>
                                </TouchableOpacity>
                            )}
                            <View style={RecipeGenerationStyles.buttonWrapper}>
                                <View style={RecipeGenerationStyles.innerButtonWrapper}>
                                    <Text style={[RecipeGenerationStyles.title, { marginBottom: 0, marginTop: 14 }]}>🌟 Et découvrez votre recette !</Text>

                                    <TouchableOpacity
                                        onPress={handleGenerateAndNavigate}
                                        style={[
                                            RecipeGenerationStyles.generateButton,
                                            isProcessing && RecipeGenerationStyles.buttonDisabled
                                        ]}
                                    >
                                        <Text style={RecipeGenerationStyles.generateButtonText}>Générer 🪄</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                )
                }
                <GenerationModal
                    isVisible={isModalVisible}
                    onSelectMode={handleModeSelect}
                    onClose={handleCloseModal}
                />
                <IngredientListModal
                    isVisible={isIngredientModalVisible}
                    onClose={() => setIngredientModalVisible(false)}
                    ingredients={listIngredients}
                    removeIngredient={removeIngredient}
                />
            </View >
        </TouchableWithoutFeedback>
    );
};

export default RecipeGeneration;

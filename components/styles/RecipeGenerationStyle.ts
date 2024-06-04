import { Platform, StyleSheet, Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const screen = Dimensions.get('window');
const aspectRatio = 316 / 399;
const containerWidth = screenWidth * 0.8; // 80% de la largeur de l'écran
const containerHeight = containerWidth * aspectRatio;

export const RecipeGenerationStyles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 30,
        paddingHorizontal: 20,
        alignItems: 'center', // Centre les éléments horizontalement
        backgroundColor: '#FDF8F1' // Couleur de fond beige
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    searchBarContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        width: '80%', // Définit la largeur du conteneur de la searchBar à 80% de son conteneur parent
        zIndex: 100,
    },
    searchRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    searchBar: {
        flex: 1,
        paddingLeft: 10,
        paddingRight: 45, // Space for the clear icon
        height: 40, // Fixed height for the search bar
        borderWidth: 1, // Add a border
        borderColor: '#ccc', // Border color
        borderRadius: 10, // Less rounded corners (adjust value to make it square)
        backgroundColor: '#fff', // White background for the search bar
        marginBottom: 5,
        elevation: 8, // Increase elevation for more noticeable shadow on Android
        shadowColor: '#000', // Shadow color
        shadowOffset: { width: 0, height: 4 }, // Increase shadow offset for larger shadow
        shadowOpacity: 0.3, // Increase opacity for darker shadow
        shadowRadius: 5, // Increase blur radius for more pronounced shadow
        zIndex: 100, // Ensure it is visible above other elements
    },
    clearButton: {
        position: 'absolute',
        right: 10,
        top: 10,
        zIndex: 110,
    },
    videoContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: containerWidth, // Define as needed or use a fixed value
        height: containerHeight, // Calculate based on aspect ratio or use a fixed value
        borderRadius: 20, // Adjust the border radius as needed
        overflow: 'hidden', // Important to hide the parts of the video outside the border radius
    },
    contentContainer: {
        justifyContent: 'center',
    },
    imageContainer: {
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center',
    },
    image: {
        width: 50,
        height: 50,
        marginRight: 10,
    },
    imagesScrollView: {
        flexDirection: 'row',
        height: 100,
        zIndex: 1000,
    },
    imagesContainer: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        marginTop: 10,
    },
    dropZone: {
        marginTop: 300,
        height: 100,
        backgroundColor: '#DDD',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#bf867c',
        borderRadius: 10,
        alignItems: 'center',
    },
    // Ajoutez des styles explicites pour dropContainer
    dropContainer: {
        width: containerWidth,
        height: containerHeight,
        alignItems: 'center',
        justifyContent: 'center',
    },

    centeredImage: {
        width: containerWidth,
        height: containerHeight,
        position: 'absolute',
        zIndex: 5,
        top: -48, // Ajustez cette valeur pour remonter l'image
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
        paddingVertical: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.7,
        shadowRadius: 6,
        elevation: 6,
    },
    title: {
        fontSize: 16,
        color: '#686868',
        fontWeight: '500',
        marginTop: 10,
        marginBottom: 8,
        textAlign: 'center',
        opacity: 0.8,
    },
    subtitleAboveImage: {
        bottom: '18%',
        fontSize: 16,
        color: '#686868',
        fontWeight: '500',
        marginTop: 20,
        marginBottom: 10,
        textAlign: 'center',
        opacity: 0.8,
    },
    modeText: {
        fontSize: 16,
        color: '#333',
        paddingVertical: 8,
    },
    buttonTextSelected: {
        color: '#fff',
        textAlign: 'center',
    },
    modeContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modeTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#bf867c',
        marginBottom: 20,
        textAlign: 'center',
    },
    buttonContainer2: {
        width: '80%',
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#bf867c',
        borderRadius: 5, // Less rounded corners (adjust value to make it square)
        paddingVertical: 12,
        paddingHorizontal: 30,
        marginVertical: 10,
        elevation: 2,
    },
    buttonSelected: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    imageShadowWrapper: {
        width: '80%',
        height: '31%',
        shadowColor: '#000', // Shadow color for iOS
        shadowOffset: { width: 0, height: 4 }, // Shadow offset for iOS
        shadowOpacity: 0.3, // Shadow opacity for iOS
        shadowRadius: 5, // Shadow blur radius for iOS
        elevation: 10, // Elevation for Android shadow
    },
    imageCooking: {
        width: '100%', // Full width of the wrapper
        height: '100%', // Full height of the wrapper
    },
    banner: {
        position: 'absolute',
        top: 70, // Ajustez selon votre layout
        width: '100%',
        padding: 10,
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 100000, // Assurez-vous que le bandeau est au-dessus des autres éléments
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
    },
    bannerText: {
        color: '#fff',
        fontSize: 16,
    },

    ingredientsButton: {
        backgroundColor: '#E09D4A',
        top: 100,
        right: 10,
        borderRadius: 20,
        paddingVertical: 6,
        paddingHorizontal: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.8,
        shadowRadius: 6,
        elevation: 6,
        zIndex: 50,
        position: 'absolute'
    },
    fallbackItem: {
        padding: 10,
        backgroundColor: '#E0E0E0',
        marginHorizontal: 5,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },

    fallbackText: {
        color: '#333',
        fontSize: 14,
    },

    ingredientsButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonWrapper: {
        position: 'absolute',
        left: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'center',
        top: screen.height * 0.2, // Position à 30% de la hauteur de l'écran
    },
    innerButtonWrapper: {
        alignItems: 'center', // Centre horizontalement les enfants
        justifyContent: 'center', // Centre verticalement les enfants
        position: 'absolute',
        top: '0%', // Positionne à 50% de la hauteur
    },
    generateButton: {
        backgroundColor: '#E09D4A', // Couleur normale
        borderRadius: 10, // Coins moins arrondis (ajuster la valeur pour rendre plus carré)
        paddingVertical: 10,
        paddingHorizontal: 30,
        shadowColor: '#000',
        shadowOffset: Platform.OS === 'ios' ? { width: 0, height: 2 } : { width: 0, height: 4 }, // Moins d'ombre en hauteur sur iOS
        shadowOpacity: Platform.OS === 'ios' ? 0.5 : 0.8, // Moins d'opacité de l'ombre sur iOS
        shadowRadius: Platform.OS === 'ios' ? 4 : 6, // Rayon de l'ombre réduit sur iOS
        elevation: Platform.OS === 'ios' ? 5 : 8, // Moins d'élévation sur iOS
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10, // Espace entre le texte et le bouton
        opacity: 1 // Opacité normale
    },

    buttonDisabled: {
        backgroundColor: '#ccc', // Gray when disabled
        shadowOpacity: 0.5, // Lower shadow opacity when disabled
        elevation: 5, // Lower elevation when disabled
        opacity: 0.5 // Semi-transparent when disabled
    },
    generateButtonText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        marginLeft: 8,
    },

});

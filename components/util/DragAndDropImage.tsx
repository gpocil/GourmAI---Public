import React, { useRef, useState } from 'react';
import { Image, Animated, PanResponder, Text, StyleSheet, View } from 'react-native';

interface DragAndDropImageProps {
    imageUrl: string;
    updateDraggedItemPosition: (item: { name: string, x: number, y: number }) => void;
    name: string;
}

const DragAndDropImage: React.FC<DragAndDropImageProps> = ({ imageUrl, updateDraggedItemPosition, name }) => {
    const [dragging, setDragging] = useState<boolean>(false);
    const position = useRef(new Animated.ValueXY()).current;

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                setDragging(true);
            },
            onPanResponderMove: (_, gestureState) => {
                position.setValue({ x: gestureState.dx, y: gestureState.dy });
            },
            onPanResponderRelease: (e, gestureState) => {
                setDragging(false);
                updateDraggedItemPosition({ name: name, x: gestureState.moveX, y: gestureState.moveY });
                Animated.spring(position, {
                    toValue: { x: 0, y: 0 },
                    friction: 5,
                    useNativeDriver: true,
                }).start();
            },
        })
    ).current;

    return (
        <View>
            <Animated.View
                style={[
                    styles.imageContainer,
                    {
                        transform: position.getTranslateTransform(),
                    },
                ]}
                {...panResponder.panHandlers}
            >
                <Image style={styles.image} source={{ uri: imageUrl }} />
                {dragging && (
                    <Text style={styles.textOverlay}>{name}</Text>
                )}
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    imageContainer: {
        width: 70,
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        marginHorizontal: 10
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 8,
        zIndex: 1000

    },
    textOverlay: {
        position: 'absolute',
        bottom: '100%',
        marginTop: -10,
        color: 'white',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 5,
        borderRadius: 5,
        fontSize: 12,
        zIndex: 1000,
        textAlign: 'center',
        minWidth: '120%',
        maxWidth: '200%',
    }



});

export default DragAndDropImage;

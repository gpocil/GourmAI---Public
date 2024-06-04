import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Image, View } from 'react-native';

const LoginButton = ({ onPress, icon = null, imageSource = null, title, style = {}, textStyle = {}, iconStyle = {} }) => {
    return (
        <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
            {icon ? (
                <View style={[styles.iconWrapper, iconStyle]}>{icon}</View>
            ) : (
                imageSource && <Image source={imageSource} style={[styles.icon, iconStyle]} />
            )}
            <Text style={[styles.textStyle, textStyle]}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        elevation: 2,
        width: 280,
    },
    textStyle: {
        color: '#48444E',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    icon: {
        position: 'absolute',
        left: 15,
        width: 24,
        height: 24,
    },
    iconWrapper: {
        position: 'absolute',
        left: 15,
    },
});

export default LoginButton;

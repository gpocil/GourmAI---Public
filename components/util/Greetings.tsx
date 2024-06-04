import { Image, StyleSheet, Text, View } from 'react-native';
import { useUser } from '../../context/UserContext';

const Greetings = () => {
    const user = useUser().currentUser;
    const displayName = user?.displayName || '';

    return (
        <View style={styles.container}>
            {user && user.photoURL && (
                <Image
                    source={{ uri: user.photoURL }}
                    style={styles.image}
                />
            )}
            <Text style={[styles.header, user && user.photoURL ? styles.withImageMargin : null]}>
                {user && user.photoURL ? `Hello ${displayName}` : `👋 Hello ${displayName}`}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        marginLeft: 0,
    },
    image: {
        width: 35,
        height: 35,
        borderRadius: 20,
        marginRight: 5,
    },
    header: {
        fontSize: 20,
        fontWeight: 'normal',
    },
    withImageMargin: {
        marginLeft: 5,
    },
});

export default Greetings;

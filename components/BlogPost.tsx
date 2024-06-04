import React from 'react';
import { View, Text, ScrollView, Image, StyleSheet, Platform } from 'react-native';
import AdBanner from './util/ads/AdBanner';

const BlogPost = ({ route }) => {
    const { blogData } = route.params;

    if (!blogData) {
        return <Text style={styles.fallbackText}>Chargement du contenu...</Text>;
    }

    // Extraire les sections + trier basé sur les clés (section1, section2, ...)
    const sectionsArray = Object.keys(blogData.content)
        .sort((a, b) => {
            const numA = parseInt(a.replace('section', ''), 10);
            const numB = parseInt(b.replace('section', ''), 10);
            return numA - numB;
        })
        .map(key => ({
            title: blogData.content[key].title,
            content: blogData.content[key].content
        }));

    return (
        <ScrollView style={styles.container}>
            <Image style={styles.image} source={{ uri: blogData.imageUrl }} />

            <Text style={styles.title}>{blogData.title}</Text>
            <Text style={styles.description}>{blogData.summary}</Text>
            <AdBanner></AdBanner>

            {sectionsArray.map((section, index) => (
                <View key={index} style={styles.section}>
                    <Text style={styles.subtitle}>{section.title}</Text>
                    <Text style={styles.text}>{section.content}</Text>
                </View>
            ))}
            {Platform.OS === 'ios' && <AdBanner />}


        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 15,
        flex: 1,
        padding: 10,
        backgroundColor: '#FDF8F1',
    },
    fallbackText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 18,
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginBottom: 10,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 5,
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 10,
    },
    section: {
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    subtitle: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 4,
    },
    text: {
        fontSize: 16,
    },
});

export default BlogPost;

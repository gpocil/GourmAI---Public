import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import AdBanner from './util/ads/AdBanner';
import Loader from './util/Loader';
import Greetings from './util/Greetings';
import AdInterstitial from './util/ads/AdInterstitial';
import apiClient from './util/ApiClient';

type BlogPost = {
    id: string;
    title: string;
    summary: string;
    publishDate: string;
    imageUrl: string;
    content: string;
};

const Blog = ({ navigation }) => {
    const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
    const [visibleCount, setVisibleCount] = useState(5);
    const [loading, setLoading] = useState(true);
    const [showAd, setShowAd] = useState(false);

    const handlePressPost = (post) => {
        setShowAd(true);
        navigation.navigate('BlogPost', { blogData: post });
    };

    const handleAdClose = () => {
        // console.log("Ad was closed");
        setShowAd(false);
    };

    useEffect(() => {
        const fetchBlogPosts = async () => {
            setLoading(true);
            try {
                const response = await apiClient.get('/blog/readAll');
                const sortedData = response.data.sort((a, b) => {
                    const dateA = new Date(a.publishDate.split('-').reverse().join('-')).getTime();
                    const dateB = new Date(b.publishDate.split('-').reverse().join('-')).getTime();
                    return dateB - dateA;
                });
                setBlogPosts(sortedData);
            } catch (error) {
                console.error('Erreur lors de la récupération des articles de blog:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogPosts();
    }, []);

    if (loading) {
        return <Loader />;
    }

    const loadMorePosts = () => {
        setVisibleCount(prevCount => prevCount + 5);
    };

    return (
        <View style={styles.container}>
            <Greetings />
            {showAd && <AdInterstitial showAd={showAd} onAdClose={handleAdClose} />}
            <ScrollView style={styles.scrollView}>
                {blogPosts.slice(0, visibleCount).map((post, index) => (
                    <React.Fragment key={post.id}>
                        <TouchableOpacity
                            style={styles.card}
                            onPress={() => handlePressPost(post)}
                        >
                            <Image source={{ uri: post.imageUrl }} style={styles.image} />
                            <View style={styles.textContent}>
                                <Text style={styles.postTitle}>{post.title}</Text>
                                <Text style={styles.postSummary}>{post.summary}</Text>
                                <Text style={styles.postInfo}>{`Le ${post.publishDate}`}</Text>
                            </View>
                        </TouchableOpacity>
                        {Platform.OS === 'ios' && ((index + 1) % 2 === 0) && <AdBanner />}
                        {Platform.OS === 'android' && index === 1 && <AdBanner />}
                    </React.Fragment>
                ))}
                {visibleCount < blogPosts.length && (
                    <TouchableOpacity
                        onPress={loadMorePosts}
                        style={styles.loadMoreButton}>
                        <Text style={styles.loadMoreText}>Charger plus de posts 📜</Text>
                    </TouchableOpacity>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 30,
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: '#FDF8F1',
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    scrollView: {
        marginTop: 20,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        marginBottom: 20,
    },
    image: {
        width: '100%',
        height: 200,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    },
    textContent: {
        padding: 15,
    },
    postTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    postSummary: {
        fontSize: 14,
        marginBottom: 5,
    },
    postInfo: {
        fontSize: 12,
        color: 'gray',
    },
    loadMoreButton: {
        backgroundColor: '#E09D4A',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.8,
        shadowRadius: 6,
        elevation: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10,
        opacity: 1
    },
    loadMoreText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold'
    },
});

export default Blog;

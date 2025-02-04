import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Modal, Animated, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useVideoPlayer, VideoView } from 'expo-video'; 
import { supabase } from '../../Services/supabaseClient';
import { useGlobalContext } from '../../Context/Contexto';
import { LinearGradient } from 'expo-linear-gradient';
import { HeartColurfull } from '../Icones';
import { Heartline } from '../Icones';

const CardPublicacao = ({ item, themeStyles, isVisible }) => {
    const { user, setFeed, feed, updateCurtidas, updateSeguidor } = useGlobalContext();
    const [isPlaying, setIsPlaying] = useState(false);
    const [liked, setLiked] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [heightAnim] = useState(new Animated.Value(60));
    const [modalVisible, setModalVisible] = useState(false);
    const [authorInfo, setAuthorInfo] = useState({ name: '', imageUrl: '' });
    const [isLoading, setIsLoading] = useState(false);  // Estado de carregamento

    
     // Atualiza o feed toda vez que o usuário volta à tela
     useFocusEffect(
        React.useCallback(() => {
            const fetchFeed = async () => {
                setIsLoading(true);
                const { data, error } = await supabase.from('feed').select('*').order('created_at', { ascending: false });

                if (error) {
                    console.error('Erro ao carregar o feed:', error);
                } else {
                    setFeed(data);
                }

                setIsLoading(false);
            };

            fetchFeed();

            return () => {
                setIsLoading(false);  // Limpa o estado de carregamento quando a tela for desfocada
            };
        }, [setFeed])
    );



    useEffect(() => {
        updateCurtidas();
        updateSeguidor();
    }, []);

    useEffect(() => {
        const fetchCurtidas = async () => {
            const { data, error } = await supabase
                .from('feed')
                .select('curtidos')
                .eq('id', item.id);

            if (error) {
                console.error('Erro ao recuperar curtidas:', error);
            } else {
                setLiked(data[0]?.curtidos.includes(user.id));
            }
        };

        fetchCurtidas();
    }, [item.id, user.id]);

    useEffect(() => {
        if (!item.id_user || !validateUUID(item.id_user)) {
            console.error("ID de usuário inválido:", item.id_user);
            return;
        }

        const checkFollowingStatus = async () => {
            const { data, error } = await supabase
                .from('user_profiles')
                .select('seguidores')
                .eq('id', item.id_user)
                .single();

            if (error) {
                console.error('Erro ao buscar seguidores do autor:', error);
                return;
            }

            setIsFollowing(data.seguidores.includes(user.id));
        };

        checkFollowingStatus();
    }, [item.id_user, user.id]);

    const toggleDescription = () => {
        setIsExpanded(!isExpanded);
        Animated.timing(heightAnim, {
            toValue: isExpanded ? 60 : 150,
            duration: 300,
            useNativeDriver: false,
        }).start();
    };

    const fetchAuthorInfo = async () => {
        if (item.id_user) {
            const { data, error } = await supabase
                .from('user_profiles')
                .select('name, imageUrl')
                .eq('id', item.id_user)
                .single();

            if (error) {
                console.error('Erro ao buscar dados do autor:', error);
                return;
            }

            setAuthorInfo({ name: data.name, imageUrl: data.imageUrl });
        }
    };

    useEffect(() => {
        fetchAuthorInfo();
    }, [item.id_user]);

    const player = useVideoPlayer(item.linkvideo, (player) => {
        player.loop = true;
    });

    useFocusEffect(
        React.useCallback(() => {
            if (isVisible && player && !isPlaying) {
                player.play();
                setIsPlaying(true);
            }

            return () => {
                if (player && isPlaying) {
                    player.pause();
                    setIsPlaying(false);
                }
            };
        }, [player, isPlaying, isVisible])
    );

    const handleLike = async () => {
        const tipo = liked ? 'decrement' : 'increment';
        const updatedCurtidas = liked ? item.curtidas - 1 : item.curtidas + 1;
        let updatedCurtidosList = [...item.curtidos];

        if (liked) {
            updatedCurtidosList = updatedCurtidosList.filter(id => id !== user.id);
        } else {
            updatedCurtidosList.push(user.id);
        }

        await updateCurtidas(item.id, updatedCurtidas, updatedCurtidosList);

        const updatedFeed = feed.map((publicacao) =>
            publicacao.id === item.id
                ? { ...publicacao, curtidas: updatedCurtidas, curtidos: updatedCurtidosList }
                : publicacao
        );
        setFeed(updatedFeed);
        setLiked(!liked);
    };

    const handleFollow = async () => {
        if (!item.id_user || !validateUUID(item.id_user)) {
            console.error("ID de usuário inválido ou ausente:", item.id_user);
            return;
        }

        let seguidores;

        const { data: userData, error: userError } = await supabase
            .from('user_profiles')
            .select('seguidores')
            .eq('id', item.id_user)
            .single();

        if (userError) {
            console.error("Erro ao buscar seguidores do autor:", userError);
            return;
        }

        seguidores = userData.seguidores || [];

        if (seguidores.includes(user.id)) {
            seguidores = seguidores.filter(id => id !== user.id);
        } else {
            seguidores.push(user.id);
        }

        const { error } = await supabase
            .from('user_profiles')
            .update({ seguidores })
            .eq('id', item.id_user);

        if (error) {
            console.error("Erro ao atualizar seguidores:", error);
            return;
        }

        const updatedFeed = feed.map((publicacao) =>
            publicacao.id === item.id
                ? { ...publicacao, seguidores }
                : publicacao
        );
        setFeed(updatedFeed);

        setIsFollowing(!isFollowing);
    };

    const validateUUID = (uuid) => {
        const regex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
        return regex.test(uuid);
    };

    // Atualiza o feed e mostra a tela de carregamento
    useEffect(() => {
        const fetchFeed = async () => {
            setIsLoading(true);
            const { data, error } = await supabase.from('feed').select('*').order('created_at', { ascending: false });

            if (error) {
                console.error('Erro ao carregar o feed:', error);
            } else {
                setFeed(data);
            }

            setIsLoading(false);
        };

        fetchFeed();
    }, [setFeed]);

    return (
        <View style={styles.card}>
            {isLoading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color="#fff" />
                    <Text style={styles.loadingText}>Atualizando feed...</Text>
                </View>
            )}

            <View style={styles.mediaContainer}>
                {item.linkvideo ? (
                    <VideoView style={styles.media} player={player} useNativeControls={false} allowsFullscreen allowsPictureInPicture resizeMode="contain" />
                ) : item.linkimagem ? (
                    <Image source={{ uri: item.linkimagem }} style={styles.media} />
                ) : null}
            </View>

            <LinearGradient
                colors={['transparent', 'rgba(0, 0, 0, 0.4)', 'rgba(0, 0, 0, 0.8)']}
                style={styles.overlay}
            >
                <View style={{ position: 'relative', zIndex: 999, height: 'auto', width: '100%', gap: 2 }}>
                    <View style={styles.lineview}>
                        <TouchableOpacity onPress={() => setModalVisible(true)}>
                            <Image source={item.autorimg} style={{ width: 42, height: 42, borderRadius: 22 }} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleFollow} style={styles.btnsearsh}>
                            <Text style={{ color: '#fff' }}>
                                {isFollowing ? 'Deixar de Seguir' : 'Seguir'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.author}>{item.autor}</Text>
                    <TouchableOpacity onPress={toggleDescription}>
                        <View style={styles.lineviewcolum}>
                            <Text style={styles.title}>{item.titulo}</Text>
                        </View>
                        <Animated.View style={[styles.description, { height: heightAnim }]}>
                            <Text style={styles.likes}>{item.description}</Text>
                        </Animated.View>
                    </TouchableOpacity>
                </View>

                <View style={{ position: 'absolute', zIndex: 1000, height: 42, width: 'auto', bottom: 100, right: 16 }}>
                    {!liked ? (
                        <TouchableOpacity onPress={handleLike}>
                            <Heartline size={28} />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity onPress={handleLike}>
                            <HeartColurfull size={28} color="red" />
                        </TouchableOpacity>
                    )}
                    <Text style={styles.likes}>{item.curtidas}</Text>
                </View>
            </LinearGradient>

            {/* Modal */}
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modal}>
                    <View style={styles.modalContent}>
                        <Image source={{ uri: authorInfo.imageUrl }} style={styles.modalImage} />
                        <Text style={styles.modalAuthorName}>{authorInfo.name}</Text>
                        <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeModalButton}>
                            <Text style={{ color: '#fff' }}>Fechar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    loadingText: {
        color: '#fff',
        marginTop: 10,
        fontSize: 18,
    },
    card: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        backgroundColor:'#000'
    },
    mediaContainer: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:'red'
    },
    media: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        borderRadius: 10,
        resizeMode:'cover',
        backgroundColor:'#000'
    },
    overlay: {
        position: 'absolute',
        width: '100%',
        height: '50%',
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
        paddingBottom: 30,
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#fff',
    },
    author: {
        fontSize: 16,
        marginBottom: 10,
        color: '#fff',
    },
    likes: {
        fontSize: 14,
        color: '#fff',
    },
    lineview: {
        flex: 1,
        flexDirection: 'row',
        width: '100%',
        height: 'auto',
        alignItems: 'center',
        padding: 2,
        gap: 16,
    },
    lineviewcolum: {
        flex: 1,
        width: '100%',
        height: 'auto',
        padding: 2,
    },
    btnsearsh: {
        width: 'auto',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderColor: "#fff",
        borderWidth: 1,
        borderRadius: 6,
    },
    modal: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
    },
    modalImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    modalAuthorName: {
        fontSize: 24,
        color: '#fff',
        marginTop: 10,
    },
    closeModalButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#888',
        borderRadius: 5,
    }
});

export default CardPublicacao;

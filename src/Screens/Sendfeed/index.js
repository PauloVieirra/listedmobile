import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../../Services/supabaseClient';
import { VideoView, useVideoPlayer } from 'expo-video';
import { useGlobalContext } from '../../Context/Contexto';

export default function Sendfeed() {
    const [videoUri, setVideoUri] = useState(null);
    const [videoUrl, setVideoUrl] = useState(null); 
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadStatus, setUploadStatus] = useState('');
    const [titulo, setTitulo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [showSucess, setShoeSucess] = useState(false);
    const [isUploading, setIsUploading] = useState(false); // Novo estado para controle de upload
    const { user } = useGlobalContext();

    useEffect(() => {
        (async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                alert('Desculpe, precisamos de permissões para acessar sua galeria!');
            }
        })();
    }, []);

    const selectMedia = async () => {
        let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            alert("Permissão para acessar a galeria foi negada!");
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['video'],
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            const uri = result.assets[0].uri;
            setVideoUri(uri); 
        }
    };

    const uploadVideo = async (fileUri) => {
      try {
          const response = await fetch(fileUri);
          const file = await response.blob();
  
          const fileName = `feed_${new Date().getTime()}.mp4`; 
          const videoFile = new File([file], fileName, { type: 'video/mp4' });
  
          const videoBucket = 'publicacoes';
          const videoFolder = 'videosfeed'; 
          const filePath = `${videoBucket}/${videoFolder}/${fileName}`;
  
          const { data, error } = await supabase.storage
              .from(videoBucket)
              .upload(filePath, videoFile, {
                  contentType: 'video/mp4',
                  upsert: false,
                  progressCallback: (progress) => {
                      const progressPercentage = (progress.loaded / progress.total) * 100;
                      setUploadProgress(progressPercentage);
                  },
              });
  
          if (error) {
              console.error('Erro ao fazer upload do vídeo:', error);
              setUploadStatus('Erro no envio!');
              return null;
          }
  
          const publicUrl = `https://lnhbxpzkkutgylxdzuas.supabase.co/storage/v1/object/public/publicacoes/${filePath}`;
          return publicUrl;
  
      } catch (error) {
          console.error('Erro no upload:', error);
          setUploadStatus('Erro no envio!');
          return null;
      }
    };

    const handleSubmit = async () => {
        if (!videoUri) {
            alert('Por favor, selecione um vídeo antes de enviar!');
            return;
        }

        setIsUploading(true); // Inicia o carregamento
        setUploadStatus('Enviando...');

        const videoURL = await uploadVideo(videoUri);

        if (videoURL) {
            setVideoUrl(videoURL); 
            saveFeedPost(videoURL); 
        } else {
            alert('Erro ao fazer upload do vídeo. Tente novamente!');
            setIsUploading(false); // Finaliza o carregamento
        }
    };

    const saveFeedPost = async (videoURL) => {
        try {
            const { error } = await supabase
                .from('feed')
                .insert([{
                    id_user: user.id, 
                    autor: user.name, 
                    linkvideo: videoURL, 
                    autorimg: user.imageUrl, 
                    description: descricao, 
                    titulo: titulo, 
                }]);

            if (error) {
                console.error('Erro ao gravar no feed:', error);
                alert('Erro ao salvar no feed!');
            } else {
                console.log('Post no feed salvo com sucesso!');
                setShoeSucess(true); // Exibe a mensagem de sucesso
            }
        } catch (error) {
            console.error('Erro ao gravar no feed:', error);
            alert('Erro ao salvar no feed!');
        }
        setIsUploading(false); // Finaliza o carregamento
    };

    const player = useVideoPlayer(videoUrl || videoUri);

    return (
        <View style={styles.container}>

            {(videoUrl || videoUri) && player && (
                <VideoView
                    style={styles.mediaPreview}
                    player={player} 
                    useNativeControls
                    allowsFullscreen={false}
                    allowsPictureInPicture
                />
            )}

            {isUploading && (
                <View style={styles.overlay}>
                    <ActivityIndicator size="large" color="#fff" />
                    <Text style={styles.overlayText}>{uploadStatus}</Text>
                </View>
            )}

            <View style={styles.containercontw}>
                <View style={styles.viewbtn}>
                    {titulo === '' && descricao === '' ? (
                        <TouchableOpacity onPress={selectMedia} style={styles.submitButton}>
                            <Text style={styles.buttonText}>Publicar um vídeo</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity 
                            onPress={handleSubmit} 
                            disabled={titulo === '' || descricao === ''}  
                            style={[styles.submitButton, 
                                    (titulo === '' || descricao === '') && { backgroundColor: '#ccc' }
                            ]}
                        >
                            <Text style={styles.buttonText}>Publicar</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {videoUri && (
                    <View style={styles.viewinput}>
                        <TextInput
                            placeholder="Título da publicação"
                            value={titulo}
                            onChangeText={setTitulo}
                            style={styles.inputpubli}
                            maxLength={30}
                        />
                        <TextInput
                            placeholder="Descrição da publicação"
                            value={descricao}
                            onChangeText={setDescricao}
                            style={[styles.inputpubli, styles.descriptionInput]}
                            multiline
                            maxLength={250}
                        />
                    </View>
                )}
            </View>

            {showSucess && (
                <View style={styles.successContainer}>
                    <Text style={styles.successMessage}>Publicação realizada com sucesso!</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
        backgroundColor: '#000',
    },
    overlay: {
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
    overlayText: {
        color: '#fff',
        fontSize: 18,
        marginTop: 10,
    },
    viewinput: {
        flex: 1,
        width: '94%',
        height: 'auto',
        borderRadius: 12,
        backgroundColor: '#dedede',
        position: 'absolute',
        zIndex: 100,
        bottom: 160,
        gap: 16,
        padding: 16,
    },
    inputpubli: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        paddingLeft: 10,
        marginBottom: 10,
        borderRadius: 5,
        width: '100%',
    },
    descriptionInput: {
        height: 100,
        textAlignVertical: 'top',
    },
    viewbtn: {
        flexDirection: 'column',
        width: '100%',
        height: 'auto',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        gap: 16,
    },
    containercontw:{
        width:'100%',
        alignItems:'center'
    },
    submitButton: {
        backgroundColor: '#28A745',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    successContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    successMessage: {
        color: 'white',
        fontSize: 20,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    mediaPreview: {
        width: '100%',
        height: '100%',
        marginBottom: 20,
    }
});

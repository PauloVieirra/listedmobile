import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Button, Image, Platform, TouchableOpacity, ScrollView } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { useGlobalContext } from "../../Context/Contexto";
import { supabase } from "../../Services/supabaseClient";
import Ionicons from '@expo/vector-icons/Ionicons';
import { SlUserFollow, SlPower } from "react-icons/sl";
import { BsPersonCircle } from "react-icons/bs";
import { ThemeColors } from "react-navigation";

export default function Complemento() {
  const { setLoading, saveUserProfile, user, themeStyles, iconTextColor } = useGlobalContext();
  const [name, setName] = useState('');
  const [ano, setAno] = useState('');
  const [funcao, setFuncao] = useState('');
  const [estatura, setEstatura] = useState('');
  const [genero, setGenero] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [imageUrl, setImageUrl] = useState('');

  // Função para selecionar a imagem
  const selectImage = async () => {
    try {
      let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissionResult.granted === false) {
        alert("Permissão para acessar as fotos foi negada!");
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        console.log('Imagem selecionada:', result.assets[0]);
        setImageUri(uri); // Salva a URI da imagem
      } else {
        console.error('Nenhuma imagem foi selecionada');
        alert('Nenhuma imagem selecionada!');
      }
    } catch (error) {
      console.error('Erro ao selecionar imagem:', error);
      alert('Ocorreu um erro ao selecionar a imagem.');
    }
  };

  // Função para gerar o nome do arquivo
  const generateFileName = () => {
    return `${user.id}_${new Date().getTime()}.${imageUri.split('.').pop()}`;
  };

  // Função para determinar o tipo MIME com base na extensão do arquivo
  const getMimeTypeFromExtension = (extension) => {
    switch (extension) {
      case 'jpeg':
      case 'jpg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      case 'gif':
        return 'image/gif';
      case 'bmp':
        return 'image/bmp';
      case 'webp':
        return 'image/webp';
      // Adicione outros tipos conforme necessário
      default:
        return null;  // Retorna null se o tipo não for reconhecido
    }
  };

  // Função para extrair o tipo MIME de uma string base64
  const getMimeTypeFromBase64 = (base64String) => {
    const mimeMatch = base64String.match(/^data:(image\/[a-zA-Z]*);base64,/);
    return mimeMatch ? mimeMatch[1] : null;
  };

  // Função para converter base64 para Blob
  const convertBase64ToBlob = async (base64Image) => {
    const response = await fetch(base64Image);
    return await response.blob();
  };

  // Função para criar um arquivo com o nome, tipo MIME e URI fornecidos
  const createFile = (uri, mimeType, fileName) => ({
    uri,
    type: mimeType,
    name: fileName,
  });

  // Função para validar e processar a imagem
  const processImageUri = async () => {
    if (!user || !user.id) {
      alert('Você precisa estar logado para enviar uma imagem!');
      return null;
    }

    if (!imageUri) {
      alert('Por favor, selecione uma imagem antes de enviar!');
      return null;
    }

    const fileName = `${user.id}_${new Date().getTime()}`;
    let mimeType = null;

    if (imageUri.startsWith('data:image')) {
      // Para base64, extraímos o tipo MIME da string
      mimeType = getMimeTypeFromBase64(imageUri);

      if (!mimeType) {
        console.log("Tipo MIME não encontrado na string base64.");
        alert('Formato de imagem não suportado');
        return null;
      }

      const fileExtension = mimeType.split('/')[1]; // Extrai a extensão do tipo MIME (jpeg, png, gif, etc.)

      console.log("Extensão da base64:", fileExtension); // Log para depuração

      // Gerar nome do arquivo com UID + timestamp
      const file = await convertBase64ToBlob(imageUri);
      return createFile(file, mimeType, `${fileName}.${fileExtension}`);

    } else {
      // Caso a imagem não seja base64, tentamos processar como um arquivo normal
      const fileExtension = imageUri.split('.').pop().toLowerCase();
      mimeType = getMimeTypeFromExtension(fileExtension);

      if (!mimeType) {
        console.log("Tipo MIME não encontrado para extensão:", fileExtension); // Log para depuração
        alert('Formato de imagem não suportado');
        return null;
      }

      return createFile(imageUri, mimeType, fileName);
    }
  };


  // Função para upload da imagem
  const uploadImageWeb = async () => {
    const file = await processImageUri();
    if (!file) return null;

    try {
      const { data, error } = await supabase.storage
        .from('imagens')
        .upload(`profiles/${file.name}`, file.uri, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        console.error('Erro ao enviar a imagem para o Supabase:', error.message);
        alert('Erro ao enviar a imagem. Tente novamente.');
        return null;
      }

      if (data?.path) {
        // Criar a URL pública a partir do caminho retornado
        const publicUrl = `https://lnhbxpzkkutgylxdzuas.supabase.co/storage/v1/object/public/imagens/${data.path}`;
        setImageUrl(publicUrl);  // Definindo a URL correta
        console.log("URL da imagem:", publicUrl);  // Log para depuração
        return publicUrl;
      } else {
        console.error('Caminho não encontrado na resposta do Supabase.');
        alert('Erro ao obter a URL pública da imagem.');
        return null;
      }
    } catch (error) {
      console.error('Erro ao enviar a imagem:', error);
      alert('Erro ao enviar a imagem. Tente novamente.');
      return null;
    }
  };



  // Função para envio de imagem no ambiente Mobile
  const uploadImageMobile = async () => {
    if (!user || !user.id) {
      alert('Você precisa estar logado para enviar uma imagem!');
      return null;
    }

    if (!imageUri) {
      alert('Por favor, selecione uma imagem antes de enviar!');
      return null;
    }

    let file;
    if (imageUri.startsWith("data:image")) {
      try {
        const fileName = generateFileName(); // Gerar nome do arquivo com base no user_id
        const fileExtension = imageUri.split(';')[0].split('/')[1].toLowerCase();

        let mimeType = '';
        if (fileExtension === 'jpeg' || fileExtension === 'jpg') {
          mimeType = 'image/jpeg';
        } else if (fileExtension === 'png') {
          mimeType = 'image/png';
        } else if (fileExtension === 'gif') {
          mimeType = 'image/gif';
        } else {
          alert('Formato de imagem não suportado');
          return null;
        }

        // Converte a imagem base64 para um arquivo binário usando Buffer
        const base64Data = imageUri.split(',')[1];
        const buffer = Buffer.from(base64Data, 'base64');
        file = {
          uri: buffer,
          type: mimeType,
          name: fileName,
        };

        console.log("Imagem convertida:", file);
      } catch (error) {
        console.error("Erro ao processar a imagem:", error);
        alert("Erro ao processar a imagem. Tente novamente.");
        return null;
      }
    } else {
      const fileName = generateFileName();
      const fileExtension = imageUri.split('.').pop().toLowerCase();

      let mimeType = '';
      if (fileExtension === 'jpeg' || fileExtension === 'jpg') {
        mimeType = 'image/jpeg';
      } else if (fileExtension === 'png') {
        mimeType = 'image/png';
      } else if (fileExtension === 'gif') {
        mimeType = 'image/gif';
      } else {
        alert('Formato de imagem não suportado');
        return null;
      }

      file = {
        uri: imageUri,
        type: mimeType,
        name: fileName,
      };
    }

    try {
      const { data, error } = await supabase.storage
        .from('imagens')
        .upload(`profiles/${file.name}`, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        console.error('Erro ao enviar a imagem para o Supabase:', error.message);
        alert('Erro ao enviar a imagem. Tente novamente.');
        return null;
      }

      if (data?.path) {
        const publicUrl = `https://lnhbxpzkkutgylxdzuas.supabase.co/storage/v1/object/public/imagens/${data.path}`;
        setImageUrl(publicUrl);
        return publicUrl;
      } else {
        console.error("Caminho não encontrado na resposta do Supabase.");
        alert('Erro ao obter a URL pública da imagem.');
        return null;
      }
    } catch (error) {
      console.error('Erro ao enviar a imagem:', error);
      alert('Erro ao enviar a imagem. Tente novamente.');
      return null;
    }
  };

  const handleSave = async () => {
    if (!name || !ano || !funcao || !estatura || !genero) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true, 'Salvando seu perfil...');
    const uploadedImageUrl = Platform.OS === 'web' ? await uploadImageWeb() : await uploadImageMobile();

    if (uploadedImageUrl) {
      try {
        await saveUserProfile(name, ano, funcao, estatura, genero, uploadedImageUrl);
        alert('Perfil salvo com sucesso!');
      } catch (error) {
        console.error('Erro ao salvar perfil:', error);
        alert('Ocorreu um erro ao salvar o perfil. Tente novamente.');
      }
    } else {
      alert("Erro ao enviar a imagem, tente novamente.");
    }
  };

  return (
    <View style={themeStyles.container}>
      <View style={styles.complemento}>
        <ScrollView showsVerticalScrollIndicator style={{ width: '100%', height: 'auto', padding: 10 }}>
          <View style={styles.contimg}>

            <TouchableOpacity style={styles.btnimage} onPress={selectImage}>
              {imageUrl ? (
                <Image source={{ uri: imageUrl }} style={styles.imageperson} />
              ) : imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.imageperson} />
              ) : (

                <BsPersonCircle color="black" size={100} />

              )}
            </TouchableOpacity>

          </View>

          <View style={styles.formContainer}>
            <Text style={styles.title}>Completar seu Perfil 5</Text>
            <View>
              <TextInput
                style={[styles.input]}
                placeholder="Nome"
                placeholderTextColor={iconTextColor}
                value={name}
                onChangeText={setName}
                maxLength={20}
              />
            </View>
            <View>
              <TextInput
                style={styles.input}
                placeholder="Ano"
                placeholderTextColor={iconTextColor}
                value={ano}
                onChangeText={setAno}
              />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Função"
              placeholderTextColor={iconTextColor}
              value={funcao}
              onChangeText={setFuncao}
            />
            <TextInput
              style={styles.input}
              placeholder="Estatura"
              placeholderTextColor={iconTextColor}
              value={estatura}
              onChangeText={setEstatura}
            />



            <TouchableOpacity style={themeStyles.btnprimario} onPress={handleSave} >
              <Text style={themeStyles.textbtnsprimario}>
                Salvar
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  complemento: {
    width: '100%',
    height: '100%',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    width: '100%',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
    borderRadius: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  contimg: {
    width: '100%',
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnimage: {
    width: 160,
    height: 160,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 160,
  },
  imageperson: {
    width: 160,
    height: 160,
    borderRadius: 160,
  },
});

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Switch, Image, Modal, StyleSheet, Animated, Platform } from 'react-native';
import Complemento from '../Complite';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; // Ícones para as tabs
import { SlMenu } from "react-icons/sl";
import { BsXCircle } from "react-icons/bs";
import { Sun, MoonSolid } from '../Icones';
import { useGlobalContext } from '../../Context/Contexto'; // Contexto do tema e usuário

export default function Header() {
  const { logout, user, toggleTheme, themeStyles, themeName, fetchUserProfile, isLoggedIn, setIsLoggedIn } = useGlobalContext();
  const [isEnabled, setIsEnabled] = useState(themeName === 'dark'); // Estado para o Switch de tema
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisibleComplite, setIsModalVisibleComplite] = useState(false);
  const [animation] = useState(new Animated.Value(400)); // Valor inicial da animação (fora da tela, à direita)
  const [isConfirmModalVisible, setConfirmModalVisible] = useState(false);
  const navigation = useNavigation();

  const imageUri = user?.imageUrl || "https://i0.wp.com/www.bishoprook.com/wp-content/uploads/2021/05/placeholder-image-gray-16x9-1.png?ssl=1"; // URL da imagem do usuário

  useEffect(() => {
    // Só executa se o usuário estiver logado
    if (!isLoggedIn) return;

    if (user) {
      const fetchProfile = async () => {
        try {
          // Chama a função fetchUserProfile para buscar os dados do perfil
          await fetchUserProfile(user.id);
          //console.log('Usuário encontrado', user);
        } catch (error) {
          console.error('Erro ao buscar o perfil:', error.message);
        }
      };

      fetchProfile();
    }
  }, [user, fetchUserProfile, isLoggedIn]);


  // Função para alternar o tema
  const handleChangeTheme = () => {
    toggleTheme();
    setIsEnabled((previousState) => !previousState); // Alterna o estado do switch
  };

  const toggleModal = () => {
    setIsModalVisibleComplite(!isModalVisibleComplite);
  };

  // Função para abrir o Modal
  const openModal = () => {
    setIsModalVisible(true);
    // Animação de deslizar da direita para a esquerda
    Animated.timing(animation, {
      toValue: 0, // Move o modal para dentro da tela
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // Função para fechar o Modal
  const closeModal = () => {
    // Animação de deslizar para fora
    Animated.timing(animation, {
      toValue: 400, // Move o modal para fora da tela (à direita)
      duration: 300,
      useNativeDriver: true,
    }).start(() => setIsModalVisible(false)); // Após a animação, define o modal como invisível
  };

  const handleConfirmsair = () => {
    logout();
  };

  const handleLogout = () => {
    setConfirmModalVisible(true);
  };

  const handleCancelLogout = () => {
    setConfirmModalVisible(false);
  };

  const handleEditePerfil = () => {
    closeModal();
    navigation.navigate('Editeprofille');
  };
  const handleGoProfilepro = () => {
    console.log('clicou');
    navigation.navigate('Perfil');
  };

  return (
    <View style={themeStyles.containerHeader}>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        {user && isLoggedIn ? (
          <>
            <TouchableOpacity style={{ width: 'auto', height: 'auto', flexDirection: 'row', gap: 12 }} onPress={handleGoProfilepro} >
              <Image
                source={{ uri: imageUri }}
                style={{ width: 40, height: 40, borderRadius: 100 }}
              />

              <View style={{ width: 'auto', height: 'auto', flexDirection: 'column', justifyContent: 'center' }}>
                {user?.complite && <Text style={themeStyles.textWellcome}>Oi,</Text>}
                <Text style={themeStyles.nomeheader}>{user?.name} </Text>
              </View>
            </TouchableOpacity>
          </>
        ) : (
          <Text style={themeStyles.textLogo}>Listed</Text>
        )}
      </View>

      {user && isLoggedIn ? (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={openModal}>
            {Platform.OS === 'web' ? (
              <SlMenu size={28} color={themeName === 'dark' ? '#fff' : '#000'} />
            ) : (
              <Ionicons name="menu" size={32} color={themeName === 'dark' ? '#fff' : '#000'} />
            )
            }

          </TouchableOpacity>
        </View>
      ) : (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: isEnabled ? '#81b0ff' : '#B0B0B0', width: 'auto', height: 30, borderRadius: 100, paddingLeft: 4, paddingRight: 4 }}>
          {isEnabled ? <MoonSolid /> : null}
          <Switch
            value={isEnabled}
            onValueChange={handleChangeTheme}
            thumbColor={isEnabled ? 'rgb(255, 255, 255)' : 'rgb(235, 221, 68)'}
            trackColor={{ false: '#B0B0B0', true: '#81b0ff' }}
            style={{ transform: [{ scaleX: 1 }, { scaleY: 1 }] }}
          />
          {!isEnabled ? <Sun /> : null}
        </View>
      )}

      {/* Modal */}
      <Modal
        animationType="none"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <Animated.View
            style={[
              themeStyles.modalContent,
              {
                transform: [{ translateX: animation }] // Aplica a animação de deslizar da direita para a esquerda
              },
            ]}
          >
            <View style={{ width: '100%' }}>
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                {Platform.OS === 'web' ? (
                  <BsXCircle size={28} color={themeName === 'dark' ? '#fff' : '#000'} />
                ) : (
                  <Ionicons name="close-circle" size={32} color={isEnabled ? "rgba(241, 241, 241, 0.54)" : "rgba(40, 40, 40, 0.54)"} />
                )
                }

              </TouchableOpacity>
              <View>
                <Text style={themeStyles.titulopages}>Perfil</Text>
              </View>



              <View style={styles.profileContainer}>

                <View style={styles.contimage}>



                  {user && user.imageUrl ? (


                    <Image
                      source={{ uri: imageUri }}
                      style={styles.profileImage}
                    />
                  ) : (
                    <>
                      <TouchableOpacity onPress={handleEditePerfil} >
                        <Image
                          source={{ uri: imageUri }}
                          style={styles.profileImage}
                        />
                        <View>
                          <Text>Configurar perfil!</Text>
                        </View>
                      </TouchableOpacity>
                    </>


                  )}




                </View>

                {user?.name ? (
                  <Text style={themeStyles.nomeprofille}>{user?.name}</Text>
                ) : (
                  null
                )}

                <Text style={themeStyles.subtitleprofille}>{user?.email || 'Email não disponível'}</Text>

              </View>




              <View style={themeStyles.btnprofilemenu}>
                {isEnabled ? (
                  <Text style={themeStyles.text}>
                    Ativar modo claro
                  </Text>
                ) : (
                  <Text style={themeStyles.text}>
                    Ativar modo escuro
                  </Text>
                )}

                <View style={{ width: 76 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: isEnabled ? '#81b0ff' : '#B0B0B0', width: 'auto', height: 30, borderRadius: 100, paddingLeft: 4, paddingRight: 4 }}>
                    {isEnabled &&
                      <MoonSolid />
                    }
                    <Switch
                      value={isEnabled}
                      onValueChange={handleChangeTheme}
                      thumbColor={isEnabled ? '#fff' : '#f4f3f4'}
                      trackColor={{ false: '#B0B0B0', true: '#81b0ff' }}
                      style={{ transform: [{ scaleX: 1 }, { scaleY: 1 }] }}
                    />


                    {!isEnabled &&
                      <Sun />
                    }

                  </View>
                </View>
              </View>

              {user?.complite &&
                <TouchableOpacity onPress={handleEditePerfil} >
                  <View style={themeStyles.btnprofilemenu}>
                    <Text style={themeStyles.text}>Editar perfil</Text>
                  </View>
                </TouchableOpacity>
              }


            </View>


            <View style={{ width: '100%', gap: 16, justifyContent: 'flex-end' }}>
              {!isConfirmModalVisible &&
                <View style={{ width: '100%', height: 'auto', alignItems: 'center', justifyContent: 'center' }}>
                  <TouchableOpacity style={styles.buttomSair} onPress={handleLogout}>
                    <>
                      <Text>Icons sair</Text>
                    </>
                    <Text>Sair </Text>
                  </TouchableOpacity>
                </View>
              }
            </View>


          </Animated.View>


          {isConfirmModalVisible &&
            <View style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(52, 52, 52, 0.92)', }}>
              <View style={themeStyles.cardsair}>
                <Text style={themeStyles.text}>você será desconectado</Text>
                <TouchableOpacity style={styles.buttomSair} onPress={handleConfirmsair} >

                  <Text>Confirmar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleCancelLogout} style={{ width: '100%', height: 42, borderRadius: 8, backgroundColor: 'rgb(160, 208, 255)', alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontSize: 16 }}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          }


        </View>
        {isModalVisibleComplite &&
          <View style={{ width: '100%', height: '100%', backgroundColor: 'rgb(252, 252, 252)', }}>
            <View style={{ width: '100%', height: 80, backgroundColor: 'rgba(255, 255, 255, 0)', position: 'absolute', zIndex: 1000, alignItems: 'flex-end', justifyContent: 'flex-end', paddingRight: 30 }}>
              <TouchableOpacity onPress={toggleModal} style={{ width: 24, height: 24, backgroundColor: 'rgba(52, 52, 52, 0)', }}>
                <BsXCircle size={24} color="black" />
              </TouchableOpacity>
            </View>

            <Complemento />
          </View>
        }
      </Modal>



    </View>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Fundo escuro
  },
  closeButton: {
    position: 'absolute',
    zIndex: 101,
    top: 0,
    right: 0,
  },
  profileContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 120,
  },
  profileText: {
    fontSize: 20,
    fontWeight: 600,
    marginVertical: 5,
  },
  profileEmail: {
    fontSize: 16,
    fontWeight: 600,
    marginVertical: 5,
    color: 'rgb(70, 70, 70)',
  },
  contimage: {
    width: '100%',
    height: 'auto',
    paddingTop: 16,
    paddingBottom: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttomSair: {
    width: '100%',
    height: 42,
    padding: 8,
    gap: 8,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'rgb(221, 109, 109)',
    borderRadius: 8,
  }

});

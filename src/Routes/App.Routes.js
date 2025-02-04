// src/Routes/app.routes.js
import React, { useState } from 'react';
import { Platform, TouchableOpacity, View } from 'react-native';
import { useGlobalContext } from '../Context/Contexto';
import { createStackNavigator } from '@react-navigation/stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import Home from '../Screens/Home';
import Mapa from '../Screens/Mapa'; // Tela do Mapa (crie este arquivo)
import Profile from '../Screens/Profille';
import Racha from '../Screens/Racha';
import Feed from '../Screens/Menu';
import Sendfeed from '../Screens/Sendfeed';
import EventList from '../Componentes/Eventscards';
import EventDetails from '../Screens/Eventodetalhes';
import Editeprofille from '../Screens/Editeprofile';
import Prohome from '../Screens/Prohome';
import { Ionicons } from '@expo/vector-icons'; // Ícones para as tabs
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AntDesign from '@expo/vector-icons/AntDesign';
import { SlHome, SlRocket, SlSocialDribbble, SlFeed, SlPlus } from "react-icons/sl";
import { BsArrowLeft, BsArrowLeftShort } from "react-icons/bs";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Navegação de Tabs (Home e Mapa)
const TabRoutes = () => {

  const { user, themeName, themeStyles } = useGlobalContext();



  return (

    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: themeName === 'dark' ? '#1D1E1E' : '#f9f9f9',
          height: 60,
          borderTopWidth: 0,
        },
      }}

    >

      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ color, size }) => (
            Platform.OS === 'web' ? (
              <SlHome size={size} color={color} />
            ) : (
              <Ionicons name="home" size={size} color={color} />
            )
          ),
        }}
      />

      <Tab.Screen
        name="Eventos"
        component={Mapa}
        options={{
          tabBarIcon: ({ color, size }) => (
            Platform.OS === 'web' ? (
              <SlRocket size={size} color={color} />
            ) : (
              <Ionicons name="map" size={size} color={color} />
            )
          ),
        }}
      />

      {user?.rule === 'ADM' &&
        <Tab.Screen
          name="Publicar"
          component={Sendfeed}
          options={{
            tabBarIcon: ({ color, size }) => (
              Platform.OS === 'web' ? (
                <SlPlus size={size} color={color} />
              ) : (
                <AntDesign name="pluscircle" size={size} color={color} />
              )
            ),
          }}
        />
      }

      <Tab.Screen
        name="Racha"
        component={Racha}
        options={{
          tabBarIcon: ({ color, size }) => (
            Platform.OS === 'web' ? (
              <SlSocialDribbble size={size} color={color} />
            ) : (
              <Ionicons name="basketball" size={size} color={color} />
            )
          ),
        }}
      />

      <Tab.Screen
        name="Feed"
        component={Feed}
        options={{
          tabBarIcon: ({ color, size }) => (
            Platform.OS === 'web' ? (
              <SlFeed size={size} color={color} />
            ) : (
              <FontAwesome name="feed" size={size} color={color} />
            )
          ),
        }}
      />


    </Tab.Navigator>

  );
};

// Navegação de Pilha (Profile)
const AppRoutes = () => {

  const { user, themeName, themeStyles } = useGlobalContext();
  const iconColor = themeName === 'light' ? themeStyles.container : 'white';

  const navigation = useNavigation();

  return (

    <Stack.Navigator>

      <Stack.Screen
        name="Tabs"
        component={TabRoutes} // Usando as Tabs dentro da navegação de pilha
        options={{
          headerShown: false, // Mostrar header na tela Profile
        }}
      />


      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{
          headerShown: true, // Mostrar cabeçalho na tela Profile
          title: 'Voltar',
          headerStyle: {
            ...themeStyles.bgcheader, // Aplicar o estilo de fundo do cabeçalho
            shadowColor: 'transparent', // Remove a sombra no iOS
            elevation: 0, // Remove a sombra no Android
            borderBottomWidth: 0, // Remove qualquer borda inferior

          },

          headerTintColor: iconColor, // Cor do ícone e do título

          headerLeft: () => (
            <TouchableOpacity
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                paddingLeft: 16,
                paddingRight: 16,
              }}
              onPress={() => navigation.goBack()}
            >
              {Platform.OS === 'web' ? (
                <BsArrowLeft size={22} color={[themeName === 'light' ? themeStyles.container : 'white']} />
              ) : (
                <AntDesign name="arrowleft" size={24} color={[themeName === 'light' ? themeStyles.container : 'white']} />
              )}
            </TouchableOpacity>
          ),
        }}
      />



      <Stack.Screen
        name='EventList'
        component={EventList}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name='Perfil'
        component={Prohome}
        options={{
          headerShown: true,
        }}
      />

      <Stack.Screen
        name='EventDetails'
        component={EventDetails}
        options={{
          headerShown: true,
          title: 'Evento',
          headerLeft: () => (
            <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', paddingLeft: 16, paddingRight: 16 }} onPress={() => navigation.goBack()}>
              {Platform.OS === 'web' ? (
                <BsArrowLeft size={22} color="black" />
              ) : (
                <AntDesign name="arrowleft" size={24} color="black" />
              )}
            </TouchableOpacity>
          ),
        }}
      />

      <Stack.Screen
        name='Editeprofille'
        component={Editeprofille}
        options={{
          headerShown: true,
          title: 'Editar Perfil',
          headerLeft: () => (
            <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', paddingLeft: 16, paddingRight: 16 }} onPress={() => navigation.goBack()}>
              {Platform.OS === 'web' ? (
                <BsArrowLeft size={22} color="black" />
              ) : (
                <AntDesign name="arrowleft" size={24} color="black" />
              )}
            </TouchableOpacity>
          ),
        }}
      />
    </Stack.Navigator>

  );
};

export default AppRoutes;

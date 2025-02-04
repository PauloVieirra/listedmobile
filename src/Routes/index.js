import React, { useEffect, useState } from 'react';
import { View, Text, StatusBar, SafeAreaView, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useGlobalContext } from '../Context/Contexto';
import Complemento from '../Componentes/Complite';
import AppRoutes from './App.Routes';
import AuthRoutes from './Auth.Routes';

const Routes = () => {
  const { user, isLoading, isLoggedIn } = useGlobalContext();

  return (
    <>
      <StatusBar
        barStyle="dark-content" // Pode ser "light-content" ou "dark-content"
        backgroundColor="#ffffff" // Cor do fundo da StatusBar
        translucent={false} // Define se a StatusBar será translúcida ou não
      />
      <SafeAreaView style={{ flex: 1 }}>
        <NavigationContainer>
        {user && isLoggedIn ? <AppRoutes /> : <AuthRoutes />}
        </NavigationContainer>
        
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.loadingText}>Carregando...</Text>
          </View>
        )}
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.78)', // Fundo semitransparente para dar destaque ao loader
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999, // Certifique-se de que o loader fique acima de outros elementos
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: '#fff', // Cor do texto que aparece junto com o carregando
  },
});

export default Routes;

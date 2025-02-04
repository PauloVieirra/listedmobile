import React from 'react';
import { View,Text } from 'react-native';
import styles from './style';
import Cards from '../../Componentes/Cards';
import Header from '../../Componentes/Header';
import { useGlobalContext } from '../../Context/Contexto';
import Complemento from '../../Componentes/Complite';

export default function Home() {
  const { user } = useGlobalContext();

 return (
   <View style={styles.container}>
    <Header/>
    <Cards/>
   </View>
  );
}
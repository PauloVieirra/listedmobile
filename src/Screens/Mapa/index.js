import React,{useState} from "react";
import { View, Platform } from "react-native";
import styles from "./style";
import EventList from "../../Componentes/Eventscards";
import Header from '../../Componentes/Header';
import { useGlobalContext } from "../../Context/Contexto";

export default function Mapa() {

    const {themeStyles} = useGlobalContext();
  
   return(
    <View style={themeStyles.container}>
        <Header/>
        <EventList/>
    </View>
   
   );
  
}




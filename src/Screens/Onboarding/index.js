import React,{useState} from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useGlobalContext } from "../../Context/Contexto";
import style from "./styles";
import { ButtonOne, ButtonTwo } from "../../Componentes/Botoes";


export default function Onboard () {
    const {themeStyles} = useGlobalContext();
    const navigation = useNavigation();

    return(
     <View style={themeStyles.container}>
     <View style={style.contsup}>
        <Text style={style.text}></Text>
     </View>
     <View style={style.contsub}>
        <View style={style.line}>
          <Text style={themeStyles.title}>
          Os melhores atletas de Brasília em um só lugar.
          </Text>
        </View>
        <View style={style.line}>
          <Text style={themeStyles.subtitle}>
          Aqui, você tem a chance de provar suas habilidades. Participe dos eventos e domine a lista!
          </Text>
        </View>
     <View style={style.contbtn}> 
     <TouchableOpacity  style={themeStyles.btnprimario} onPress={() => navigation.navigate('Signin')}>
      <Text style={themeStyles.textbtnsprimario}>Entrar</Text>
     </TouchableOpacity>
     <TouchableOpacity style={themeStyles.btnsecundario} onPress={() => navigation.navigate('Signup')}>
      <Text style={themeStyles.textbtnssecundario}>Cadastrar</Text>
     </TouchableOpacity>
     </View>
     </View>
     </View>
    );
}
import React, { useState } from 'react';
import { View, Text, TextInput, SafeAreaView, Alert, TouchableOpacity } from 'react-native';
import { useGlobalContext } from '../../Context/Contexto';
import { useNavigation } from '@react-navigation/native';
import Header from '../../Componentes/Header';
import { BaselineAlternateEmail, Password } from '../../Componentes/Icones';
import style from './styles';



export default function Signin() {
  const { login, fetchUserProfile, handleLoading, themeStyles } = useGlobalContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigation = useNavigation();

  const [isFocusedEmail, setIsFocusedEmail] = useState(false);
  const [isFocusedPassword, setIsFocusedPassword] = useState(false);


 

  const handleLog = async () => {
    setError(""); // Limpar erros anteriores
    handleLoading(true); // Ativa o loading imediatamente ao clicar no botão de login

    try {
      const { user } = await login(email, password);

      // Após o login, buscar o perfil do usuário
      const profile = await fetchUserProfile();

    } catch (err) {
      setError(err.message);
      Alert.alert("Erro", err.message); // Exibir erro se houver
    } finally {
      handleLoading(false); // Desativa o loading após o login
    }
  };

 
  return (

    <SafeAreaView style={themeStyles.container}>
      
      <View style={style.contsupheader}>
         <Header/>
      </View>
      <View style={style.container}>

    
        <View style={style.contsupsignin}>
        
        </View>
      
  

      <View style={style.contsubsignin}> 


        <View style={themeStyles.containerinter}>

        <View
      style={[
        themeStyles.inputContainer,
        isFocusedEmail && themeStyles.inputContainerFocused,
      ]} onFocus={() => setIsFocusedEmail(true)} 
      onBlur={() => setIsFocusedEmail(false)} 
      >
      <BaselineAlternateEmail />

      <TextInput
        style={themeStyles.input}
        placeholder="Informar seu Email"
        placeholderTextColor="rgb(137, 137, 137)"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        textContentType="emailAddress"
        underlineColorAndroid="transparent"
        selectionColor="transparent" 
        
      />
    </View>

    <View
      style={[
        themeStyles.inputContainer,
        isFocusedPassword && themeStyles.inputContainerFocused,
      ]} onFocus={() => setIsFocusedPassword(true)} 
      onBlur={() => setIsFocusedPassword(false)} 
      >
        <Password/>

      <TextInput
        style={themeStyles.input}
        placeholder="Informar sua Senha" 
        placeholderTextColor='rgb(137, 137, 137)'
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        textContentType="password"
        underlineColorAndroid="transparent" // Remove borda no Android
        selectionColor="transparent" 
        
      /> 
      </View>

      <View style={style.lineRecovery}>
         <TouchableOpacity style={style.btnRecovery}>
           <Text style={themeStyles.text}>Recuperar senha</Text>
         </TouchableOpacity>
      </View>
      <View style={{gap:16}}> 
      {error ? <Text style={themeStyles.error}>{error}</Text> : null}

       <TouchableOpacity style={themeStyles.btnprimario}  onPress={handleLog}>
        <Text style={themeStyles.textbtnsprimario}>Entrar</Text>
       </TouchableOpacity>

       <TouchableOpacity style={themeStyles.btnsecundario} onPress={() => navigation.navigate('Signup')}>
        <Text style={themeStyles.textbtnssecundario}>Criar conta</Text>
       </TouchableOpacity>
       </View>
       </View>
       </View>
    </View>
 
    </SafeAreaView>
  );
}

import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Alert, Modal, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useGlobalContext } from '../../Context/Contexto';
import style from './styles';
import { Password, BaselineAlternateEmail } from '../../Componentes/Icones';

export default function Signup() {
  const navigation = useNavigation();
  const { signUp, handleLoading, themeStyles, login } = useGlobalContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isFocusedSenha, setIsFocusedSenha] = useState(false);
  const [isFocusedConfirm, setIsFocusedConfirm] = useState(false);
  

  // Modal for Terms of Service
  const [modalVisible, setModalVisible] = useState(false);
  const [slideAnim] = useState(new Animated.Value(300)); // Initial position of the modal (out of the screen)

  const handleSignup = async () => {
    setError(""); // Limpar erros anteriores
    
    // Verificar se as senhas coincidem
    if (password !== confirmPassword) {
        setError("As senhas não coincidem.");
        Alert.alert("Erro", "As senhas não coincidem.");
        return;
    }

    // Verificar se o usuário aceitou os termos de uso
    if (!isChecked) {
        Alert.alert("Atenção", "Leia e aceite os termos de uso antes de criar sua conta");
        return;
    }

    try {
        // Cadastro do usuário (signUp retorna o usuário e confirmação de e-mail, se aplicável)
        const { user } = await signUp(email, password);

        // Fazer login automático após o cadastro bem-sucedido
        handleLoading(true, 'Redirecionando...');

        // Login automático (supondo que exista uma função login())
        await login(email, password);  // Se necessário

        // Após o login, carregar os dados do usuário
        //const userData = await saveUserProfile(user.uid); // Exemplo de função para carregar dados do usuário
        
        // Atualizar estado com os dados do usuário, por exemplo, perfil
        //saveUserProfile(userData);

        // Finalizar carregamento
        handleLoading(false);

        // Redirecionar para a tela principal ou dashboard
        //navigateToMainPage();  // Substitua pela função de navegação adequada
    } catch (err) {
        setError(err.message);
        Alert.alert("Erro", err.message); // Exibir erro se houver
        handleLoading(false);  // Finaliza o carregamento mesmo em caso de erro
    }
  };

  const handleCheckBoxChange = () => {
    setIsChecked(!isChecked);
  };

  const openModal = () => {
    setModalVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,  // Final position when modal is fully shown
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: 300, // Move the modal back out of the screen
      duration: 300,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  return (
    
    <View style={themeStyles.container}>
      <View style={style.container}>
      <View style={themeStyles.containerinter}> 

          <View
              style={[
                themeStyles.inputContainer,
                isFocused && themeStyles.inputContainerFocused,
              ]} onFocus={() => setIsFocused(true)} 
              onBlur={() => setIsFocused(false)} 
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
                isFocusedSenha && themeStyles.inputContainerFocused,
              ]} onFocus={() => setIsFocusedSenha(true)} 
              onBlur={() => setIsFocusedSenha(false)} 
              >
                
                <Password/>
        <TextInput
          style={themeStyles.input}
          placeholder="Criar uma senha"
          placeholderTextColor="rgb(137, 137, 137)"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          textContentType="password"
        />
          </View>



          <View
              style={[
                themeStyles.inputContainer,
                isFocusedConfirm && themeStyles.inputContainerFocused,
              ]} onFocus={() => setIsFocusedConfirm(true)} 
              onBlur={() => setIsFocusedConfirm(false)} 
              >
                
                <Password/>


        <TextInput
          style={themeStyles.input}
          placeholder="Repitir a senha"
          placeholderTextColor="rgb(137, 137, 137)"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          textContentType="password"
        />
        </View>
      
        
        
        {error ? <Text style={style.errorText}>{error}</Text> : null}

        <View style={style.lineRecovery}>
          <TouchableOpacity style={style.btnRecovery} onPress={handleCheckBoxChange}>
          
          {isChecked ? (
             <View style={{width:25, height:25, borderColor:"#000", borderWidth:1, backgroundColor:'#000'}} />
            ):(
              <View style={{width:25, height:25, borderColor:"#000", borderWidth:1, backgroundColor:'#FFF'}} />
          )}

          </TouchableOpacity>

          <TouchableOpacity onPress={openModal}>
           {isChecked ? (
           <Text style={themeStyles.text}>Termos de uso aceito!</Text>
           ) : (
         <Text style={themeStyles.text}>Leia os Termos de Uso</Text>
           )}
        </TouchableOpacity>

        </View>
          <View style={{gap:16}}>
        <TouchableOpacity onPress={handleSignup} style={themeStyles.btnprimario}>
          <Text style={themeStyles.textbtnsprimario}>Cadastrar</Text>
        </TouchableOpacity>
        <TouchableOpacity text="Já tem uma conta? Entre aqui" onPress={() => navigation.navigate('Signin')} style={themeStyles.btnterciario}>
          <Text style={themeStyles.textbtnssecundario}>Já tem uma conta? entre aqui!</Text>
        </TouchableOpacity>
        </View>
       
        <Modal
          animationType="none"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <Animated.View style={[themeStyles.container, { transform: [{ translateY: slideAnim }] }]}>
            <ScrollView style={style.modalContent}>
              <Text style={themeStyles.modalHeader}>
                Termos de uso, compartilhamento e privacidade
                </Text>
              <Text style={themeStyles.text}>
              
Última atualização: 03/01/2026

Antes de utilizar o nosso aplicativo, é importante que você leia e compreenda os Termos de Uso descritos abaixo. Ao criar uma conta e utilizar nossos serviços, você concorda com todos os termos aqui estabelecidos.
{"\n"}
{"\n"}1. Aceitação dos Termos de Uso
Ao acessar ou usar o aplicativo Listed, você concorda em se comprometer com os Termos de Uso aqui descritos, bem como com nossa Política de Privacidade. Caso não concorde com alguma parte dos termos, não use nossos serviços.
{"\n"}
{"\n"}2. Coleta de Dados Pessoais
Para utilizar o Listed, você nos fornecerá dados pessoais, incluindo, mas não se limitando a: nome completo, email, ano de nascimento, estatura, imagem e outros dados relacionados ao seu desempenho ou participação em jogos ou disputas esportivas. Esses dados são necessários para o registro de sua conta e para garantir o uso adequado dos recursos oferecidos pelo Aplicativo.
{"\n"}
{"\n"}3. Autorização para Uso de Imagem e Dados
Ao criar uma conta no Listed, você nos concede permissão explícita para utilizar sua imagem, nome, ano de nascimento, estatura e outros dados fornecidos, em materiais relacionados ao Aplicativo, como promoção, divulgação de eventos, rankings e outras finalidades que envolvem o uso esportivo. Essa autorização é dada de forma irrestrita e sem limite territorial, respeitando as diretrizes da Lei Geral de Proteção de Dados (LGPD).
{"\n"}
{"\n"}4. Proteção e Privacidade dos Dados
Em conformidade com a Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/18), a proteção dos seus dados pessoais é uma prioridade para nós. Garantimos que os dados fornecidos serão tratados com a máxima confidencialidade e segurança, e utilizaremos medidas técnicas e administrativas para protegê-los contra acessos não autorizados, alterações ou destruições.
{"\n"}
{"\n"}5. Não Compartilhamento de Dados Pessoais
O Listed não venderá, compartilhará ou repassará suas informações pessoais para terceiros sem o seu consentimento expresso, exceto quando necessário para cumprir obrigações legais ou regulatórias, ou para proteger os direitos, propriedades ou segurança do Listed, seus usuários ou terceiros.
{"\n"}
{"\n"}6. Direitos do Usuário sobre seus Dados
De acordo com a LGPD, você tem o direito de acessar, corrigir, excluir ou solicitar a portabilidade dos seus dados pessoais. Caso deseje exercer qualquer um desses direitos, basta entrar em contato conosco através dos canais informados em nossa Política de Privacidade.
{"\n"}
{"\n"}7. Uso Responsável do Aplicativo
Você concorda em utilizar o Listed de forma ética e responsável, respeitando as leis e regulamentos aplicáveis, além de não realizar atividades que possam prejudicar o funcionamento do Aplicativo ou a experiência de outros usuários.
{"\n"}
{"\n"}8. Alterações dos Termos de Uso
Reservamo-nos o direito de modificar estes Termos de Uso a qualquer momento, com ou sem aviso prévio. Ao continuar a utilizar o Aplicativo após quaisquer alterações, você concorda em estar vinculado aos novos Termos de Uso.
{"\n"}
{"\n"}9. Contato
Se você tiver dúvidas sobre esses Termos de Uso ou sobre o tratamento de seus dados pessoais, entre em contato conosco através dos seguintes canais:
{"\n"}
{"\n"}Email: [email@email.com]
Telefone: [número de telefone]
Endereço: [endereço físico]
10. Disposições Finais
Esses Termos de Uso são regidos pelas leis brasileiras. Qualquer disputa ou reclamação decorrente da utilização do Aplicativo será resolvida pelos tribunais competentes da cidade de [cidade], Estado de [estado], Brasil.
              </Text>
              {/* Add all terms content here */}
              <View style={style.lineRecovery}>
         
          <TouchableOpacity style={style.btnRecovery} onPress={handleCheckBoxChange}>


          {isChecked ? (
             <View style={{width:25, height:25, borderColor:"#000", borderWidth:1, backgroundColor:'#000'}} />
            ):(
              <View style={{width:25, height:25, borderColor:"#000", borderWidth:1, backgroundColor:'#FFF'}} />
          )}

          </TouchableOpacity>
          
             <Text style={themeStyles.text}>Concordo com os termos de uso</Text>
          </View>
         
        

              <TouchableOpacity onPress={closeModal} style={themeStyles.btnprimario}>
                <Text style={style.modalCloseText}>Fechar</Text>
              </TouchableOpacity>
              <View style={{height:60}}/>
            </ScrollView>
          </Animated.View>
        </Modal>
      </View>
      </View>
    </View>
  );
}

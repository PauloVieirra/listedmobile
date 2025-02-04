import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Text, ScrollView, Button, TouchableOpacity } from 'react-native';
import { useGlobalContext } from '../../Context/Contexto';
import Complemento from '../../Componentes/Complite';

const EventDetails = ({ route, navigation }) => {
  const { user, cadastrarAtletaBasquete, setLoading, fetchUserProfile, themeStyles } = useGlobalContext(); 
  
  const [inscricaoFeita, setInscricaoFeita] = useState(false);
  const [isLoading, setIsLoading] = useState(false); 
  const { event } = route.params;

   
   
  if (!event) {
    console.log('Erro: Nenhum evento foi passado como parâmetro.');
    return null;
  }

  useEffect(() => {
    if (user) {
      fetchUserProfile(user.id);
    }
  }, [user]); 
  


  // Função que lida com o clique no botão "Inscrição"
  const handleInscricao = async () => {
   
   
    if (user.complite === false) {
      // Exibe o componente Complemento se complite for false
      return setInscricaoFeita(true);
    } else {
      // Se complite for true, exibe o resumo de confirmação
      setInscricaoFeita(true);
    }
  };

  // Função para confirmar a inscrição
  const handleConfirmarInscricao = async () => {
    try {
      setIsLoading(true);
      setLoading(true, 'Cadastrando atleta...'); // Setando o estado de loading com um texto personalizado
      
      // Criar o objeto do atleta com base nos dados do usuário e evento
      const atleta = {
        user_id: user.id,
        nome: user.name,
        genero: user.genero,
        estatura: user.estatura,
        funcao: user.funcao,
        imagem: user.imageUrl,
      };

      // Chama a função para cadastrar o atleta
      await cadastrarAtletaBasquete(atleta);
      
      // Após a inscrição ser realizada, resetar os estados
      setIsLoading(false);
      setLoading(false);
      alert('Inscrição confirmada com sucesso!');
      navigation.goBack(); // Navega para a tela anterior após a inscrição
    } catch (error) {
      setIsLoading(false);
      setLoading(false);
      alert('Erro ao confirmar inscrição: ' + error.message);
    }
  };

  // Função que exibe o resumo de confirmação
  const renderResumoConfirmacao = () => (
    <View style={styles.confirmacaoContainer}>
      <Text style={styles.confirmacaoTitle}>Resumo da Inscrição</Text>
      <Text style={styles.confirmacaoText}>Nome: {user.name}</Text>
      <Text style={styles.confirmacaoText}>Evento: {event.titulo}</Text>
      <Text style={styles.confirmacaoText}>Data: {event.data}</Text>

      <TouchableOpacity 
        style={styles.confirmacaoButton} 
        onPress={handleConfirmarInscricao}
      >
        <Text style={styles.confirmacaoButtonText}>Confirmar Inscrição</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.confirmacaoButton} 
        onPress={() => setInscricaoFeita(false)} // Cancelar
      >
        <Text style={styles.confirmacaoButtonText}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image source={{ uri: event.imagem }} style={styles.image} />
        <Text style={styles.title}>{event.titulo}</Text>
        <Text style={styles.subtitle}>{event.subtitulo}</Text>
       
        <Text style={styles.description}>{event.longadescricao}</Text>

        <Text style={styles.price}>
           {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(event.valor)}
        </Text>
       

        {/* Botão de inscrição */}
        <TouchableOpacity onPress={handleInscricao} style={themeStyles.btnprimario}>
          <Text style={themeStyles.textbtnsprimario}>Inscrição</Text>
        </TouchableOpacity>

        {/* Exibe o componente Complemento ou o resumo de confirmação */}
        {inscricaoFeita && user.complite === false && <Complemento />}
        {inscricaoFeita && user.complite === true && renderResumoConfirmacao()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 8,
  },
  scrollContainer: {
    flex: 1,
    paddingBottom: 20,
    height: '100%',
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#555',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#333',
    marginVertical: 15,
  },
  link: {
    fontSize: 14,
    color: 'blue',
  },
  confirmacaoContainer: {
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: '100%',
    padding: 20,
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmacaoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  confirmacaoText: {
    fontSize: 16,
    marginVertical: 5,
  },
  confirmacaoButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  confirmacaoButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  price:{
    fontSize:24,
    fontWeight:'600',
    color:'#000',
    marginBottom:50
  }
});

export default EventDetails;

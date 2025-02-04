import React from 'react';
import { View, FlatList, StyleSheet, Image, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useGlobalContext } from '../../Context/Contexto';
import { useNavigation } from '@react-navigation/native';

// Função para formatar a data para o formato DD-MM-AA
const formatDateToBR = (date) => {
  if (!date) return ''; // Verifica se a data existe
  const [year, month, day] = date.split('-');
  return `${day}-${month}-${year}`;
};

// Função para formatar o valor como dinheiro
const formatCurrency = (value) => {
  if (isNaN(value)) return ''; // Verifica se é um número válido
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  }).format(value);
};




const EventCard = ({ title, subtitle, link, image, onPress, data, valor, }) => (

  <TouchableOpacity style={styles.card} onPress={onPress}>
    {!image ? (
      <ActivityIndicator />
    ) : (
      <Image source={{ uri: image }} style={styles.image} />
    )}



    <View style={styles.textContainer}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      <Text style={styles.date}>{formatDateToBR(data)}</Text>
      <Text style={styles.link}>{formatCurrency(valor)}</Text>
    </View>
  </TouchableOpacity>
);

export default function EventList() {

  const { eventos, themeStyles } = useGlobalContext();
  const navigation = useNavigation();

  const background = { themeStyles };

  const openEventDetails = (event) => {
    navigation.navigate('EventDetails', { event }); // Passando o evento como parâmetro
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={eventos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <EventCard
            title={item.titulo}
            subtitle={item.subtitulo}
            data={item.data}
            link={item.link}
            image={item.imagem}
            valor={item.valor}
            onPress={() => openEventDetails(item)}
          />
        )}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0)',
  },
  listContainer: {
    paddingBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0)',
  },
  card: {
    backgroundColor: 'rgb(224, 224, 224)',
    margin: 4,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 4,
    padding: 10,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 8,
  },
  textContainer: {
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    marginVertical: 5,
  },
  link: {
    fontSize: 12,
    color: 'blue',
  },
  date: {
    fontSize: 12,
    color: '#333',
    marginTop: 5,
  },
});

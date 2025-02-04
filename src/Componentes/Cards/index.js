import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, ScrollView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useGlobalContext } from '../../Context/Contexto';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SlShuffle, SlSymbolMale, SlSymbleFemale   } from "react-icons/sl";

const Cards = () => {
  const navigation = useNavigation();
  const { updateAtleta, selectedGender, updateGender, selectedAtleta, user, themeStyles } = useGlobalContext();
  const [sortBy, setSortBy] = useState(null); // Estado para o atributo de ordenação
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedHability, setSelectedHability] = useState('pontos');
  

  const handlePress = (gender) => {
    setSelectedFilter(gender); // Atualiza o filtro selecionado
    updateGender(gender); // Chama a função de filtro
  };

  const labels = {
    rebotes_defensivos: 'Rebotes Defensivos',
    rebotes_ofensivos: 'Rebotes Ofensivos',
    pontos: 'Pontos',
    assistencias: 'Assistências',
    roubos: 'Roubos',
    tocos: 'Tocos',
    roubos: 'Roubos',

  };

  // Função para ordenar os atletas
  const sortAtletas = (atletas, attribute) => {
    return [...atletas].sort((a, b) => b[attribute] - a[attribute]);
  };

  // Filtrar e ordenar os atletas
  const filteredAtletas = selectedAtleta
    .filter(atleta => selectedGender === "all" || atleta.genero === selectedGender);
  
  const sortedAtletas = sortBy ? sortAtletas(filteredAtletas, sortBy) : filteredAtletas;

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={themeStyles.card}
      onPress={() => {
        if (user) { 
          updateAtleta(item);
          navigation.navigate('Profile');
        }
      }}
    >
      <View>
        <Image source={{ uri: item.imagem }} style={themeStyles.imagem} />
      </View>

      <View style={styles.cardContainer}>
        <Text style={themeStyles.nome}>{item.nome}</Text>
       
        <View style={styles.data}>
          <View style={styles.datarow}>
            <Text style={themeStyles.textData}>Pts: {item.pontos}</Text>
            <Text style={themeStyles.textData}>Ast: {item.assistencias}</Text>
            <Text style={themeStyles.textData}>Tcs: {item.tocos}</Text>
            <Text style={themeStyles.textData}>Rdef: {item.rebotes_defensivos}</Text>
          </View>
          <View>
          </View>
        </View>
       
      </View>
      <View style={styles.result}>
          {/* Destaque do valor relacionado ao filtro */}
          {sortBy && (
          <View style={styles.badget}>
          <Text style={themeStyles.resultText}> {item[sortBy]}</Text>
          </View>
         )}
        </View>
    </TouchableOpacity>
  );

  const handleSortby= (value) => {
    setSortBy(value);
    setSelectedHability(value);
  }

  return (
    <View style={themeStyles.containerList}>
       {user && 
      <View style={themeStyles.containerFilterTop}>
      <ScrollView horizontal style={themeStyles.sortContainer} showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} >
        
        
       <TouchableOpacity style={[
              themeStyles.sortButton,
              selectedHability === 'pontos' && themeStyles.selectedButton // Altera a cor do botão quando ele for selecionado
            ]} onPress={() => handleSortby('pontos')}>
          <Text style={themeStyles.sortText}>Pontos</Text>
        </TouchableOpacity>


        <TouchableOpacity style={[
              themeStyles.sortButton,
              selectedHability === 'tocos' && themeStyles.selectedButton // Altera a cor do botão quando ele for selecionado
            ]} onPress={() => handleSortby('tocos')}>
          <Text style={themeStyles.sortText}>Tocos</Text>
        </TouchableOpacity>
   
        <TouchableOpacity style={[
              themeStyles.sortButton,
              selectedHability === 'roubos' && themeStyles.selectedButton // Altera a cor do botão quando ele for selecionado
            ]} onPress={() => handleSortby('roubos')}>
          <Text style={themeStyles.sortText}>Roubos</Text>
        </TouchableOpacity>
    
      
        <TouchableOpacity style={[
              themeStyles.sortButton,
              selectedHability === 'assistencias' && themeStyles.selectedButton // Altera a cor do botão quando ele for selecionado
            ]} onPress={() => handleSortby('assistencias')}>
          <Text style={themeStyles.sortText}>Assistências</Text>
        </TouchableOpacity>
  
    
        <TouchableOpacity style={[
              themeStyles.sortButton,
              selectedHability === 'rebotes_defensivos' && themeStyles.selectedButton // Altera a cor do botão quando ele for selecionado
            ]} onPress={() => handleSortby('rebotes_defensivos')}>
          <Text style={themeStyles.sortText}>Rebotes defencivos</Text>
        </TouchableOpacity>
    
        <TouchableOpacity style={[
              themeStyles.sortButton,
              selectedHability === 'rebotes_ofensivos' && themeStyles.selectedButton // Altera a cor do botão quando ele for selecionado
            ]} onPress={() => handleSortby('rebotes_ofensivos')}>
          <Text style={themeStyles.sortText}>Rebotes ofencivos</Text>
        </TouchableOpacity>
     
        
     
        <TouchableOpacity style={[
              themeStyles.sortButton,
              selectedHability === null && themeStyles.selectedButton // Altera a cor do botão quando ele for selecionado
            ]} onPress={() => handleSortby(null)}>
          <Text style={themeStyles.sortText}>Limpar Filtro</Text>
        </TouchableOpacity>
     
      </ScrollView>
      </View>
      }
      {/* Lista de atletas */}
      <FlatList
        data={sortedAtletas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        style={{paddingTop:10, paddingLeft:10, paddingRight:10}}
      />

      {user && 
      <View style={themeStyles.filterContainer}>
        <TouchableOpacity onPress={() => handlePress("all")} style={themeStyles.filterButton}>
         
          {Platform.OS === 'web' ? (
           <SlShuffle size={38} color={selectedFilter === "all" ? 'rgb(215, 164, 102)' : 'rgba(145, 145, 145, 0.61)'} />
          ):(
            <Ionicons name="male-female" size={42}   color={selectedFilter === "all" ? 'rgb(215, 164, 102)' : 'rgba(145, 145, 145, 0.61)'} />
          )}
         
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handlePress("Masculino")} style={themeStyles.filterButton}>
        {Platform.OS === 'web' ? (
           <SlSymbolMale  size={38} color={selectedFilter === "all" ? 'rgb(215, 164, 102)' : 'rgba(145, 145, 145, 0.61)'} />
          ):(
            <Ionicons name="male" size={42} color={selectedFilter === "Masculino" ? 'rgb(215, 164, 102)' : 'rgba(145, 145, 145, 0.61)'} />
          )}
          
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handlePress("Feminino")} style={themeStyles.filterButton}>
        {Platform.OS === 'web' ? (
           <SlSymbleFemale   size={38} color={selectedFilter === "all" ? 'rgb(215, 164, 102)' : 'rgba(145, 145, 145, 0.61)'} />
          ):(
            <Ionicons name="female-sharp" size={42} color={selectedFilter === "Feminino" ? 'rgb(215, 164, 102)' : 'rgba(145, 145, 145, 0.61)'} />
          )}
        
        </TouchableOpacity>
      </View>
      }
    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  card: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#f9f9f9',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
  cardContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  data: {},
  datarow: {
    width: '50%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    gap:12
  },
  nome: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  imagem: {
    width: 74,
    height: 74,
    borderRadius: 100,
  },
  text: {
    fontSize: 12,
  },
  filterContainer: {
    marginBottom: 10,
    justifyContent: 'space-evenly',
    position: 'absolute',
    zIndex: 99,
    right: 0,
    bottom: 100,
  },
  filterButton: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
  },
  sortContainer: {
    height:'auto',
    flexDirection: 'row',
    marginBottom: 10,
    paddingHorizontal: 10,

  },
  sortButton: {
    backgroundColor: '#ddd',
    padding: 10,
    marginRight: 5,
    borderRadius: 5,
  },
  sortText: {
    fontSize: 14,
    fontWeight: 'bold',
  },

  box: {
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  result:{
    alignItems:'flex-end',
    justifyContent:'flex-start',
    borderRadius:100,
    position:'absolute',
    zIndex:99,
    width:'auto',
    height:40,
    right:0,
    top:-10
    
  },
  badget:{
    width:60,
    height:60,
    borderRadius:60,
    justifyContent:'center',
    alignItems:'center',
  }
 
});

export default Cards;

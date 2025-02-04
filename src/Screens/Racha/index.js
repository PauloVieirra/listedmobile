import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, TouchableOpacity, ScrollView, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGlobalContext } from '../../Context/Contexto';
import { supabase } from '../../Services/supabaseClient';

export default function DetailTables() {
  const { selectedAtleta, user } = useGlobalContext();
  const [search, setSearch] = useState('');
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [teamA, setTeamA] = useState([]);
  const [teamB, setTeamB] = useState([]);
  const [modalVisible, setModalVisible] = useState(false); // Estado para controlar o modal
  const [modalVisiblePlay, setModalVisiblePlay] = useState(false); // Estado para controlar o modal
  const [selectedPlayer, setSelectedPlayer] = useState(null); // Jogador selecionado para exibir no modal
  const [confirmClearVisible, setConfirmClearVisible] = useState(false); // Modal de confirmação
  const [securityCode, setSecurityCode] = useState(''); // Estado para armazenar o código de segurança
  const [isCodeCorrect, setIsCodeCorrect] = useState(false); // Estado para verificar se o código está correto



useEffect(() => {
  // Monitorando sempre que a lista de espera for atualizada
  const waitlist = calculateWaitlist();
  console.log('Lista de Espera Atual:', waitlist);  // Mostrar a lista de espera real
}, [teamA, teamB, selectedAtleta]); // A dependência agora está em `teamA`, `teamB` e `selectedAtleta`






  useEffect(() => {
    // Carregar dados persistidos quando a tela for carregada
    const loadPersistedData = async () => {
      try {
        const selectedPlayersData = await AsyncStorage.getItem('selectedPlayers');
        const teamAData = await AsyncStorage.getItem('teamA');
        const teamBData = await AsyncStorage.getItem('teamB');

        if (selectedPlayersData) {
          setSelectedPlayers(JSON.parse(selectedPlayersData));
        }
        if (teamAData) {
          setTeamA(JSON.parse(teamAData));
        }
        if (teamBData) {
          setTeamB(JSON.parse(teamBData));
        }
      } catch (error) {
        console.error('Erro ao carregar dados persistidos:', error);
      }
    };

    loadPersistedData();
  }, []);

  const calculateWaitlist = () => {
    // Lista de espera: jogadores restantes após a remoção dos jogadores em jogo
    const waitlist = selectedAtleta.filter(player =>
      !teamA.some(teamPlayer => teamPlayer.id === player.id) && // Jogadores não estão no Time A
      !teamB.some(teamPlayer => teamPlayer.id === player.id) && // Jogadores não estão no Time B
      !player.removido // Jogadores não foram removidos da partida
    );
  
    return waitlist;
  };
  
  
  


  const handleClearMatch = () => {
    setConfirmClearVisible(true); // Mostrar o modal de confirmação
  };
  
  const clearMatchData = async () => {
    try {
      // Limpar os times
      setTeamA([]);
      setTeamB([]);
      setSelectedPlayers([]);
  
      // Limpar dados persistidos
      await AsyncStorage.removeItem('teamA');
      await AsyncStorage.removeItem('teamB');
      await AsyncStorage.removeItem('selectedPlayers');
  
      alert('Memória da partida limpa! Todos os jogadores foram devolvidos à lista de espera.');
      setConfirmClearVisible(false); // Fechar o modal
      setSecurityCode(''); // Limpar o código de segurança
      setIsCodeCorrect(false); // Resetar o estado de código correto
    } catch (error) {
      console.error('Erro ao limpar a partida:', error);
      alert('Erro ao limpar a partida.');
    }
  };
  
  

  useEffect(() => {
    // Salvar dados persistidos sempre que os times ou jogadores selecionados forem alterados
    const saveData = async () => {
      try {
        await AsyncStorage.setItem('selectedPlayers', JSON.stringify(selectedPlayers));
        await AsyncStorage.setItem('teamA', JSON.stringify(teamA));
        await AsyncStorage.setItem('teamB', JSON.stringify(teamB));
      } catch (error) {
        console.error('Erro ao salvar dados:', error);
      }
    };

    saveData();
  }, [selectedPlayers, teamA, teamB]);

  const handleSearch = (text) => {
    setSearch(text);
  };

  const handleAddPlayer = (player) => {
    const totalPlayersInGame = teamA.length + teamB.length; // Soma dos jogadores em ambos os times
  
    if (totalPlayersInGame < 10) {
      const updatedSelectedPlayers = [...selectedPlayers, player];
  
      // Remover o jogador da lista de espera (selectedAtleta)
      const updatedSelectedAtleta = selectedAtleta.filter((item) => item.id !== player.id);
  
      if (teamA.length < 5) {
        // Se a equipe A tem menos de 5 jogadores, adicione à equipe A
        setTeamA([...teamA, player]);
      } else if (teamB.length < 5) {
        // Se a equipe A está cheia, adicione à equipe B se ela tiver menos de 5 jogadores
        setTeamB([...teamB, player]);
      }
  
      setSelectedPlayers(updatedSelectedPlayers); // Atualize a lista de jogadores selecionados
  
     
    } else {
      alert('Limite de jogadores atingido. Não é possível adicionar mais jogadores.');
    }
  };
  
  
  
  
  

  const handleSaveMatch = async () => {
    try {
      for (let player of selectedPlayers) {
        const { data, error } = await supabase
          .from('atletas_basquete')
          .upsert({
            user_id: player.id,
            nome: player.nome,
            pontos: player.stats?.pontos || 0,
            rebotes_ofensivos: player.stats?.rebotes_ofencivos || 0,
            rebotes_defensivos: player.stats?.rebotes_defencivos || 0,
            bolas_de_3: player.stats?.bolas_de_3 || 0,
            assistencias: player.stats?.assistencias || 0,
            tocos: player.stats?.tocos || 0,
            roubos: player.stats?.roubos || 0,
          });
        if (error) throw error;
      }
      alert('Partida salva!');
    } catch (error) {
      console.error('Erro ao salvar partida:', error);
      alert('Erro ao salvar partida.');
    }
  };

  // Filtrar os jogadores para garantir que não apareçam os que já estão nos times
  const filterPlayers = selectedAtleta.filter((player) => {
    const isInTeamA = teamA.some(teamPlayer => teamPlayer.id === player.id);
    const isInTeamB = teamB.some(teamPlayer => teamPlayer.id === player.id);
    const isRemoved = player.removido;
  
    // A lista de espera deve incluir jogadores que:
    // 1. Não estão no time A ou B
    // 2. Foram removidos da partida, mas não estão na lista de selecionados
    return (
      !isInTeamA && 
      !isInTeamB && 
      (!isRemoved || selectedPlayers.some(selectedPlayer => selectedPlayer.id === player.id))
    );
  });
  

  const sortedPlayers = filterPlayers.sort((a, b) => {
    // Adiciona os jogadores removidos ao final
    if (a.removido && !b.removido) return 1;
    if (!a.removido && b.removido) return -1;
    return 0; // Não altera a ordem para os jogadores não removidos
  });
  
  
  
  
  
  
  

  const renderItem = ({ item, index }) => {
    const isFirst = index === 0;  // Verifica se é o primeiro item da lista
    
    return (
      <TouchableOpacity
        onPress={isFirst ? () => handleAddPlayer(item) : null}  // Só permite ação no primeiro item
        disabled={!isFirst}  // Desativa o clique para itens que não são o primeiro
      >
        <View style={[styles.card, !isFirst && styles.disabledCard]}>
          <Text>{item.nome}</Text>
        </View>
      </TouchableOpacity>
    );
  };
  

  // Função para abrir o modal e mostrar detalhes do jogador
  const openModal = (player) => {
    setSelectedPlayer(player); // Definir o jogador selecionado
    setModalVisible(true); // Abrir o modal
  };

  const handleRemoverff = async () => {
    if (!selectedPlayer) {
      alert('Nenhum jogador selecionado para remoção.');
      return;
    }
  
    // Marcar o jogador como removido
    const playerToRemove = { ...selectedPlayer, removido: true };
  
    // Identificar de qual time o jogador pertence
    let updatedTeamA = [...teamA];
    let updatedTeamB = [...teamB];
  
    // Remover o jogador do time correspondente
    if (teamA.includes(selectedPlayer)) {
      updatedTeamA = updatedTeamA.filter(player => player.id !== selectedPlayer.id);
    } else if (teamB.includes(selectedPlayer)) {
      updatedTeamB = updatedTeamB.filter(player => player.id !== selectedPlayer.id);
    }
  
    // Atualizar a lista de jogadores removidos (adicionando ao final da lista)
    setSelectedPlayers(prevSelectedPlayers => {
      const updatedPlayers = prevSelectedPlayers.filter(player => player.id !== playerToRemove.id);
      return [...updatedPlayers, playerToRemove]; // Coloca o jogador removido no final da lista
    });
  
    // Recalcular a lista de espera
    const waitlist = calculateWaitlist();
  
    // Atualizar os times no estado
    setTeamA(updatedTeamA);
    setTeamB(updatedTeamB);
  
    // Persistir as alterações no AsyncStorage
    await AsyncStorage.setItem('teamA', JSON.stringify(updatedTeamA));
    await AsyncStorage.setItem('teamB', JSON.stringify(updatedTeamB));
    await AsyncStorage.setItem('selectedPlayers', JSON.stringify(waitlist));
  
    // Fechar o modal
    setModalVisible(false);
  };

  const handleRemover = async () => {
    if (!selectedPlayer) {
      alert('Nenhum jogador selecionado para remoção.');
      return;
    }
  
    // Marcar o jogador como removido
    const playerToRemove = { ...selectedPlayer, removido: true };
  
    // Identificar de qual time o jogador pertence
    let updatedTeamA = [...teamA];
    let updatedTeamB = [...teamB];
  
    // Remover o jogador do time correspondente
    if (teamA.includes(selectedPlayer)) {
      updatedTeamA = updatedTeamA.filter(player => player.id !== selectedPlayer.id);
    } else if (teamB.includes(selectedPlayer)) {
      updatedTeamB = updatedTeamB.filter(player => player.id !== selectedPlayer.id);
    }
  
    // Atualizar a lista de jogadores removidos (adicionando ao final da lista de espera)
    setSelectedPlayers(prevSelectedPlayers => {
      const updatedPlayers = prevSelectedPlayers.filter(player => player.id !== playerToRemove.id);
      return [...updatedPlayers, playerToRemove];  // Coloca o jogador removido ao final
    });
  
    // Recalcular a lista de espera (se necessário)
    const waitlist = calculateWaitlist();
  
    // Atualizar os times no estado
    setTeamA(updatedTeamA);
    setTeamB(updatedTeamB);
  
    // Persistir as alterações no AsyncStorage
    await AsyncStorage.setItem('teamA', JSON.stringify(updatedTeamA));
    await AsyncStorage.setItem('teamB', JSON.stringify(updatedTeamB));
    await AsyncStorage.setItem('selectedPlayers', JSON.stringify(waitlist));
  
    // Fechar o modal
    setModalVisible(false);
  };
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  

   // Função para atualizar a lista de espera manualmente
   const handleUpdateWaitlist = () => {
    // Calcular a lista de espera com base nos times
    const waitlist = calculateWaitlist();
  
    // Atualiza o estado de selectedPlayers com a lista real de espera
    // Em vez de substituir, você vai adicionar ou remover elementos conforme necessário.
    setSelectedPlayers(prevSelectedPlayers => {
      // Adicionar ou remover jogadores, mas sem apagar todos os jogadores
      return [...new Set([...prevSelectedPlayers, ...waitlist])]; // Garantir que não haja duplicatas
    });
  
    alert('Lista de espera atualizada!');
  };
  
  
  
  
  

  return (
    <View style={styles.container}>
      {user && user.rule === 'ADM' ? (
        <>
          <View style={styles.contsupracha}>
          <Text>Jogadores em partida</Text>
            <View style={{ width: '100%', height: 200, backgroundColor: '#dedede', flexDirection: 'row' }}>
              <View style={{ width: '50%', height: '100%', backgroundColor: '#fff', alignItems: 'center' }}>
                <Text> Time A </Text>
                {teamA.map((player, index) => (
                  <TouchableOpacity key={index} onPress={() => openModal(player)}>
                    <Text> {player.nome} </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={{ width: '50%', height: '100%', backgroundColor: '#fff', alignItems: 'center' }}>
                <Text> Time B </Text>
                {teamB.map((player, index) => (
                  <TouchableOpacity key={index} onPress={() => openModal(player)}>
                    <Text> {player.nome} </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
          <View style={styles.contsubracha}>
            <View>
              <TextInput
                placeholder="Buscar jogador"
                onChangeText={handleSearch}
                style={styles.searchInput}
              />
            </View>
            <View>
              <ScrollView style={styles.scrollContainer}>
              <Text>Lista de espera, o jogador removido da partida deve ser adicionado ao final dessa lista</Text>
                <FlatList
                   data={sortedPlayers}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={renderItem}
                />
              </ScrollView>
            </View>
          </View>

          <Button title="Atualizar Lista de Espera" onPress={handleUpdateWaitlist} />
          <Button title="Limpar Memória" onPress={handleClearMatch} />

          <Button title="Salvar Partida" onPress={handleSaveMatch} />
        </>
      ) : (
        <View style={{ flex: 1, width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
          <Text>Página em construção</Text>
        </View>
      )}

      {/* Modal para exibir detalhes do jogador */}
      <Modal
  animationType="slide"
  transparent={true}
  visible={confirmClearVisible}
  onRequestClose={() => setConfirmClearVisible(false)}
>
  <View style={styles.modalView}>
    <Text style={styles.modalTitle}>Atenção!</Text>
    <Text>Todos os jogadores serão removidos da partida. Você tem certeza?</Text>
    <TextInput
      placeholder="Digite o código de segurança"
      value={securityCode}
      onChangeText={setSecurityCode}
      style={styles.searchInput}
      keyboardType="numeric"
    />
    <View style={{ flexDirection: 'row', marginTop: 10 }}>
      <Button title="Cancelar" onPress={() => setConfirmClearVisible(false)} />
      <Button
        title="Confirmar"
        onPress={() => {
          if (securityCode === '123456') {
            // Código correto
            setIsCodeCorrect(true);
            clearMatchData();
          } else {
            alert('Código de segurança incorreto!');
          }
        }}
      />
    </View>
  </View>
</Modal>
{/* Modal para exibir os detalhes do jogador */}
<Modal
  animationType="slide"
  transparent={true}
  visible={modalVisible}
  onRequestClose={() => setModalVisible(false)}
>
  <View style={styles.modalView}>
    {selectedPlayer && (
      <>
        <Text style={styles.modalTitle}>Detalhes do Jogador</Text>
        <Text>Nome: {selectedPlayer.nome}</Text>
        <Text>Pontos: {selectedPlayer.stats?.pontos || 0}</Text>
        <Text>Assistências: {selectedPlayer.stats?.assistencias || 0}</Text>
        <Text>Rebotes: {selectedPlayer.stats?.rebotes_ofencivos || 0} (Ofensivos), {selectedPlayer.stats?.rebotes_defencivos || 0} (Defensivos)</Text>
        <Text>Tocos: {selectedPlayer.stats?.tocos || 0}</Text>
       
        <Button  title="Remover da partida" onPress={handleRemover}/> 
        <Button title="Fechar" onPress={() => setModalVisible(false)} />
      </>
    )}
  </View>
</Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-start',
  },
  contsupracha: {
    flex: 1,
    backgroundColor: '#000',
    width: '100%',
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contsubracha: {
    flex: 1,
    backgroundColor: '#dedede',
    width: '100%',
  },
  searchInput: {
    width: '80%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 16,
    paddingLeft: 8,
  },
  card: {
    width: '80%',
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    alignItems: 'center',
  },
  scrollContainer: {
    maxHeight: 300,  // Ajuste conforme necessário
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  }
});

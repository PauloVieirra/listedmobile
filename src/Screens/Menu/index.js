import React, { useState, useCallback, useRef } from 'react';
import { View, FlatList, StyleSheet, Text, Dimensions } from 'react-native';
import { useGlobalContext } from '../../Context/Contexto';
import CardPublicacao from '../../Componentes/CardPuplic';


export default function Feed() {
  const { logout, user, toggleTheme, themeStyles, themeName, feed, setFeed } = useGlobalContext();
  const [isEnabled, setIsEnabled] = useState(themeName === 'dark'); // Define o estado inicial do Switch
  const [visibleItemIndex, setVisibleItemIndex] = useState(null);  // Para controlar o vídeo visível

  const windowHeight = Dimensions.get('window').height;

  const flatListRef = useRef(null);

  const handleLogout = () => {
    logout();
  };

  // Função para alternar tema e atualizar o estado do Switch
  const handleChangeTheme = () => {
    toggleTheme();
    setIsEnabled((previousState) => !previousState); // Inverte o estado do switch
  };

  // Função para controlar o que está visível
  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setVisibleItemIndex(viewableItems[0].index); // Salva o índice do item visível
    }
  }, []);

  const renderFeedItem = ({ item, index }) => {
    const isVisible = index === visibleItemIndex; // Verifica se o item está visível
    return <CardPublicacao item={item} themeStyles={themeStyles} isVisible={isVisible} />;
  };

  const handleScrollEnd = (e) => {
    const contentOffsetY = e.nativeEvent.contentOffset.y; // Posição da rolagem
    const contentHeight = e.nativeEvent.contentSize.height; // Altura total do conteúdo
    const layoutHeight = e.nativeEvent.layoutMeasurement.height; // Altura da tela visível
    const maxY = contentHeight - layoutHeight;
    
    // Garantir que a rolagem vai até o próximo item
    let targetIndex = Math.floor(contentOffsetY / windowHeight);
    targetIndex = Math.min(Math.max(0, targetIndex), feed.length - 1); // Limita o índice ao tamanho do feed

    // Ajusta a rolagem para o índice alvo
    flatListRef.current.scrollToIndex({ animated: true, index: targetIndex });
  };

  



  return (
    <View style={styles.container}>
      <FlatList
  ref={flatListRef}
  data={feed}
  renderItem={renderFeedItem}
  keyExtractor={(item) => item.id.toString()}
  style={styles.feedList}
  onViewableItemsChanged={onViewableItemsChanged}
  viewabilityConfig={{
    itemVisiblePercentThreshold: 50,
  }}
  pagingEnabled
  snapToInterval={windowHeight}
  decelerationRate="fast"
  onMomentumScrollEnd={handleScrollEnd}
  getItemLayout={(data, index) => ({
    length: windowHeight,
    offset: windowHeight * index,
    index,
  })}
  removeClippedSubviews={true} // Essa linha pode ajudar a melhorar o desempenho e corrigir o problema.
  initialNumToRender={5} // Para evitar o carregamento excessivo de itens
/>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  feedList: {
    width: '100%',
    height: '100%',
    backgroundColor:'#000'
  },
});

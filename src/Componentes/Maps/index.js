import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Platform, Text, ActivityIndicator } from 'react-native';
import { useGlobalContext } from '../../Context/Contexto';

let MapView, Marker;

// Importação condicional apenas para Android
if (Platform.OS === 'android') {
  MapView = require('react-native-maps').default;
  Marker = require('react-native-maps').Marker;
}

// Componente principal que verifica a plataforma
export default function Maps() {
  const { locais, isLoading, themeStyles } = useGlobalContext();
  const [mapStyle, setMapStyle] = useState([]);
 

  // Estilos do mapa para tema claro
  const lightMapStyle = [
    {
      featureType: 'poi',
      stylers: [{ visibility: 'off' }],
    },
    {
      featureType: 'transit',
      stylers: [{ visibility: 'on' }],
    },
    {
      featureType: 'road',
      elementType: 'labels.icon',
      stylers: [{ visibility: 'on' }],
    },
    {
      featureType: 'administrative',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }],
    },
    {
      elementType: 'geometry',
      stylers: [{ color: '#eaeef2' }], // Fundo claro
    },
    {
      elementType: 'labels.text.fill',
      stylers: [{ color: '#333333' }], // Texto escuro
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{ color: '#a2daf2' }], // Água clara
    },
    {
      featureType: 'landscape.man_made',
      elementType: 'geometry',
      stylers: [{ color: '#000' }], // Construções claras
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [{ color: '#ffffff' }], // Estradas claras
    },
    {
      featureType: 'road',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#8a8a8a' }], // Texto das estradas
    },
  ];

  // Estilos do mapa para tema escuro
  const darkMapStyle = [
    {
      featureType: 'poi',
      stylers: [{ visibility: 'off' }],
    },
    {
      featureType: 'transit',
      stylers: [{ visibility: 'on' }],
    },
    {
      featureType: 'road',
      elementType: 'labels.icon',
      stylers: [{ visibility: 'on' }],
    },
    {
      featureType: 'administrative',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }],
    },
    {
      elementType: 'geometry',
      stylers: [{ color: '#2f2f2f' }], // Fundo escuro
    },
    {
      elementType: 'labels.text.fill',
      stylers: [{ color: '#ffffff' }], // Texto claro
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{ color: '#2c2c2c' }], // Água escura
    },
    {
      featureType: 'landscape.man_made',
      elementType: 'geometry',
      stylers: [{ color: '#fff' }], // Construções escuras
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [{ color: '#4d4d4d' }], // Estradas escuras
    },
    {
      featureType: 'road',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#cccccc' }], // Texto das estradas
    },
  ];

  // Atualiza o estilo do mapa com base no tema
  useEffect(() => {
    const selectedStyle = themeStyles === 'dark' ? darkMapStyle : lightMapStyle;
    setMapStyle(selectedStyle);
  }, [themeStyles]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return Platform.select({
    android: () => (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: locais[0]?.latitude || -23.55052, // Fallback para São Paulo
            longitude: locais[0]?.longitude || -46.633308,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          customMapStyle={mapStyle}
        >
          {locais.map((local) => (
            <Marker
              key={local.id}
              coordinate={{ latitude: local.latitude, longitude: local.longitude }}
              title={local.titulo}
              description={`Avaliação: ${local.avaliacao} | Regras: ${local.regras}`}
            />
          ))}
        </MapView>
      </View>
    ),
    default: () => (
      <View style={styles.container}>
        <Text style={styles.message}>
          O mapa está disponível apenas para dispositivos Android.
        </Text>
      </View>
    ),
  })();
}

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  message: {
    fontSize: 18,
    textAlign: 'center',
    paddingHorizontal: 20,
    color: '#333',
  },
});

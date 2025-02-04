import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';





// Componente para o primeiro botão
const ButtonOne = ({ onPress, text, style }) => (
  <TouchableOpacity style={style} onPress={onPress}>
      <Text style={styles.buttonText}>{text}</Text>
  </TouchableOpacity>
);

// Componente para o segundo botão
const ButtonTwo = ({ onPress, text, style }) => (
  <TouchableOpacity style={style} onPress={onPress}>
    <Text style={styles.buttonText}>{text}</Text>
  </TouchableOpacity>
);

// Componente para o terceiro botão
const ButtonThree = ({ onPress, text, style,textStyle }) => (
  <TouchableOpacity style={style} onPress={onPress}>
    <Text style={textStyle}>{text}</Text>
  </TouchableOpacity>
);

// Componente para o terceiro botão
const ButtonProfille = ({ onPress, text, style,textStyle }) => (
  <TouchableOpacity style={style} onPress={onPress}>
    <Text style={textStyle}>{text}</Text>
  </TouchableOpacity>
);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 10,
    margin: 10,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});




export {ButtonOne, ButtonTwo, ButtonThree, ButtonProfille};

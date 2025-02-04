import { StyleSheet } from "react-native";

const styles = StyleSheet.create({

    container: {
        flex: 1,
        flexDirection:'column',
        backgroundColor: '#f0f0f0',  // Cor de fundo do container
      },
      title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
      },
      button: {
        padding: 10,
        backgroundColor: '#007BFF',
        borderRadius: 5,
        marginTop: 20,
      },
      buttonText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
      },

});

export default styles;
// components/ExampleComponent/styles.js
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent:'flex-end',
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  errorText: {
    color: 'red',
    marginBottom: 12,
    textAlign: 'center',
  },
  link: {
    color: 'blue',
    textAlign: 'center',
  },
  lineRecovery:{
    flexDirection:'row',
    width:"100%",
    height:'auto',
    alignItems:'flex-start',
    gap:8,
    alignItems:'center',
    marginBottom:16,
    marginTop:8
  },
  check:{
    backgroundColor:"#000"
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fundo transparente com opacidade
  },
  modalContent: {
    width: '100%',
    padding: 20,
    backgroundColor: 'rgba(253, 253, 253, 0)', // Fundo transparente com opacidade
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 20,
  },
  modalCloseButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  modalCloseText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default styles;

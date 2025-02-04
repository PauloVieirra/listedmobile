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
  btnsecundario:{
    width: '100%',
    height: 44,
    justifyContent: 'center',  // Alinha o conteúdo no eixo vertical
    alignItems: 'center',      // Alinha o conteúdo no eixo horizontal
    backgroundColor: '#dedede',
    marginTop:20
  },
  textbtn:{
    width:"100%",
    fontSize:16,
    textAlign:'center',
  },
  lineRecovery:{
    width:"100%",
    height:'auto',
    alignItems:'flex-end',
  },
  btnRecovery:{
    width:'auto',
    paddingLeft:20,
    paddingRight:20,
    padding:8,
  },
  contsupheader:{
    width:"100%",
    height:'auto',
  },
  contsupsignin:{
    width: '100%',
    height: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top:0,
    zIndex:0
  },
  contsubsignin:{
    height:'auto',
  }
});

export default styles;

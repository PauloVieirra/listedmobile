import { StyleSheet } from 'react-native';

const lightMode = {
  background: '#F5F5F5',             // Fundo claro
  textGeral: '#000000',
  textCheck: '#000000',
  titleColor:'rgb(33, 33, 33)',
  textDados: '#000000',
  textSigleColor:'#000',
  textboasvindas:'rgba(50, 50, 50, 0.91)',
  textlogomarca:'rgba(52, 52, 52, 0.91)',
  textbtnprimario:'rgb(243, 243, 243)',
  textbtnsecundario:'rgb(61, 61, 61)',
  subtitleSize: 16,
  subtitleColor:'rgb(43, 43, 43)',
  sortColor: '#000',            // Texto preto
  buttonBackground: '#007BFF',       // Fundo do botão primário
  buttonText: '#FFFFFF',             // Texto do botão primário
  inputBackground: '#FFFFFF',        // Fundo do campo de input
  inputText: 'rgba(54, 54, 54, 0.93)',              // Texto do input
  borderColor: '#CCCCCC',            // Cor da borda
  butonprimarioColor:  'rgba(52, 52, 67, 1)',    // Cor do botão primário adicional
  butonsecundarioColor: 'rgb(215, 164, 102)', // Cor do botão secundário
  buttonTerciarioColor: 'rgba(255, 255, 255, 0)', // Cor do botão secundário
  buttonTerciarioBorder: 'rgba(50, 50, 50, 0.91)', // Cor do botão secundário
  btnTitleColor:'rgba(50, 50, 50, 0.91)', 
  errorColor: '#FF0000',             // Cor do texto de erro
  cardBackground: '#FFFFFF',         // Fundo dos cards
  shadowColor: '#000000',            // Sombras escuras
  containerInterBackground:  'rgb(44, 44, 44)',  
  backgroundContInter:'rgba(234, 234, 234, 0.98)',
  imageBackground:'rgba(78, 78, 133, 0.1)',
  nomeColor:'rgb(65, 65, 65)',
  nomeColorHeader:'rgb(52, 52, 52)',
  backgroundFilterGender: 'rgb(235, 235, 235)',
  tabbarColor:'rgb(36, 36, 36)',
  mapsBackground:'rgb(219, 229, 255)',
  menuColor:'rgba(78, 78, 133, 0.1)',
  sortButtonBackground:'rgba(73, 73, 73, 0.14)',
  sortButtonBackgroundSelected:'rgba(237, 165, 97, 0.95)',
  profilebackgorund: 'rgb(246, 246, 246)',
  btnprofilemenuBackground:'rgb(246, 246, 246)',
  line:'rgb(69, 69, 69)',
  cardsairBackground:'rgb(255, 255, 255)',
  headerColor:'rgb(255, 255, 255)',
  graphcsColor:'rgb(54, 54, 54)',
  gradiente:'linear-gradient(to right, #4c669f, #3b5998, #192f5d)',
};

const darkMode = {
  gradiente:'linear-gradient(to right,rgb(15, 15, 15),rgb(221, 197, 20)))',
  background: '#181829',           // Fundo escuro
  textGeral: 'rgba(243, 243, 243, 0.93)',
  textCheck: 'rgb(213, 213, 213)',
  titleColor:'rgb(255, 255, 255)',
  textDados:  'rgb(190, 190, 190)',
  textSigleColor:'rgb(190, 190, 190)',
  textboasvindas:'rgba(218, 218, 218, 0.91)',
  textlogomarca:'rgba(218, 218, 218, 0.91)',
  textbtnsprimario:'rgba(243, 243, 243, 0.91)',
  textbtnsecundario:'rgba(245, 245, 245, 0.91)',
  subtitleSize: 16,
  subtitleColor:'rgb(190, 190, 190)',
  sortColor: '#fff',                 // Texto branco
  buttonBackground: '#1E90FF',       // Fundo do botão primário
  buttonText: '#000',             // Texto do botão primário
  inputBackground: 'rgba(6, 7, 18, 0.46)',        // Fundo do campo de input
  inputText: 'rgb(240, 240, 240)',             // Texto do input
  borderColor: 'rgba(231, 231, 231, 0.06)',           // Cor da borda
  butonprimarioColor:  'rgba(215, 164, 102, 1)',     // Cor do botão primário adicional
  butonsecundarioColor:  'rgb(70, 70, 95)',  // Cor do botão secundário
  buttonTerciarioColor: 'rgba(255, 255, 255, 0)', // Cor do botão secundário
  buttonTerciarioBorder: 'rgba(240, 240, 240, 0.91)', // Cor do botão secundário
  btnTitleColor:'rgba(50, 50, 50, 0.91)', 
  errorColor: '#FF6347',             // Cor do texto de erro (tom avermelhado)
  cardBackground: 'rgb(44, 44, 44)',        // Fundo dos cards
  shadowColor: '#FFFFFF',            // Sombras claras
  containerInterBackground:  'rgb(44, 44, 44)',   // Fundo semi-transparente
  backgroundContInter: 'rgb(53, 59, 80)',
  imageBackground:'rgb(235, 235, 235)',
  nomeColor:'rgb(210, 210, 210)',
  nomeColorHeader:'rgb(210, 210, 210)',
  backgroundFilterGender: 'rgb(70, 70, 70)',
  tabbarColor:'rgb(17, 17, 224)',
  mapsBackground:'rgb(236, 15, 15)',
  menuColor:'rgb(238, 238, 238)',
  sortButtonBackground:'rgba(240, 240, 240, 0.14)',
  sortButtonBackgroundSelected:'rgba(251, 162, 80, 0.95)',
  profilebackgorund: 'rgb(48, 48, 48)',
  btnprofilemenuBackground:'rgba(57, 57, 57, 0.67)',
  line:'rgb(235, 235, 235)',
  cardsairBackground:'rgb(57, 57, 57)',
  headerColor:'rgb(15, 17, 41)',
  graphcsColor:'rgb(245, 245, 245)', 
};


// Função para criar estilos dinamicamente com base no tema
const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },

    containerList: {
      flex: 1,
      backgroundColor: theme.background,
    },
    containerHeader:{
      flexDirection:'row',
      width:'100%',
      height:60,
      alignItems:'center',
      justifyContent:'space-between',
      paddingStart:16,
      paddingEnd:16,
      backgroundColor: theme.background,  // Cor de fundo do container
    },
    modalContent: {
      width: '80%',  // O modal ocupa 80% da largura da tela
      height: '100%',  // O modal ocupa toda a altura
      justifyContent:'space-between',
      padding: 16,
      backgroundColor: theme.profilebackgorund,
      alignItems: 'center',
    },
    check:{
      color: theme.textCheck,
      fontSize: 28,
    },
    text: {
      color: theme.textGeral,
      fontSize: 16,
    },
    textWellcome:{
      color: theme.textboasvindas,
      fontSize: 14,
      fontWeight:'400'
    },
    nomeheader: {
      fontSize: 20,
      fontWeight: '600',
      color:theme.nomeColorHeader,
    },
    nome: {
      fontSize: 19,
      fontWeight: '500',
      color:theme.nomeColor,
    },
    textData: {
      color: theme.textDados,
      fontSize: 16,
    },
    modalHeader:{
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
      color:theme.textGeral
    },
    single:{
      color: theme.textSigleColor,
      fontSize: 16,
    },
    title:{
      color: theme.titleColor,
      fontSize: 32,
      fontWeight:'600'
    },
    subtitle:{
      color: theme.subtitleColor,
      fontSize:20,
  },
   
    nomeprofille: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 5,
      color:theme.nomeColor,
    },
    subtitleprofille:{
      color: theme.subtitleColor,
      fontSize:16,
  },
  cardsair:{
      width:'80%',
      height:'auto',
      borderRadius:8,
      padding:16,
      gap:16,
      backgroundColor: theme.cardsairBackground,
  },
    titulopages: {
      fontSize: 24,
      fontWeight: 'bold',
      color:theme.nomeColor,
    },
    btnprimario:{
        height:44,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.butonprimarioColor,
    },
    textbtnsprimario:{
        color:theme.textbtnprimario,
        fontSize: 18,
        fontWeight: '500',
        textAlign: 'center',
    },
    textbtnssecundario:{
      color:theme.textbtnsecundario,
      fontSize: 18,
      fontWeight: '500',
      textAlign: 'center',
  },
    btnsecundario:{
        backgroundColor: theme.butonsecundarioColor,
        height:44,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnterciario: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.buttonTerciarioColor,
      borderWidth:1,
      borderColor:theme.buttonTerciarioBorder,
      height:44,
      paddingLeft:8,
      paddingRight:8,
      borderRadius: 8,
    },
    btnprofilemenu:{
      width:'100%',
      height:40,
      paddingLeft:4,
      paddingRight:4,
      flexDirection:'row',
      alignItems:'center',
      justifyContent:'space-between',
      backgroundColor:theme.btnprofilemenuBackground,
      borderBottomColor:theme.line,
      borderBottomWidth:1,
    },
    buttonText: {
      color: theme.buttonText,
      fontSize: 16,
      fontWeight: 'bold',
    },

    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      backgroundColor: theme.inputBackground,
      color: '#333',
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 8,
      marginBottom: 16,
      paddingLeft: 8,
      height: 64,
    },
    inputContainerFocused: {
      borderColor: theme.butonprimarioColor, // Cor ao focar
    },
    input: {
      flex: 1, // Ocupa o espaço restante
      color: theme.inputText,
      borderWidth: 0,
      height: 64,
      borderColor:'transparent',
      outlineStyle: 'none', // Remove o contorno de foco
      outline: 'none', // Fallback para navegadores mais antigos
      borderWidth: 0, // Garante que não haverá bordas
      backgroundColor:'rgba(255, 255, 255, 0)',
    },
    card: {
      flex: 1,
      flexDirection: 'row',
      width: '100%',
      backgroundColor: theme.cardBackground,
      padding: 15,
      marginBottom: 10,
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.5,
      elevation: 5,
      gap:10
    },
    cardevent: {
      backgroundColor: theme.cardBackground,
      marginBottom: 15,
      borderRadius: 8,
      overflow: 'hidden',
      elevation: 4,
      padding: 10,
      borderColor:'#000',
      borderWidth:1
    },
    imagem: {
      width: 48,
      height: 48,
      borderRadius: 100,
      backgroundColor:theme.imageBackground
    },
    error:{
        color: theme.errorColor,
    },
    containerinter:{
        padding:16,
        paddingBottom:30,
        height:'auto',
        borderTopLeftRadius:16,
        borderTopRightRadius:16,
        backgroundColor:theme.backgroundContInter,
    },
   
    containerFilterTop:{
      width:'100%',
      height:32,
      backgroundColor:'rgba(255, 255, 255, 0.01)',
    },
    sortContainer: {
      height:'auto',
      flexDirection: 'row',
      paddingHorizontal: 10,
  
    },
    sortButton: {
      width:'auto',
      height:'100%',
      justifyContent:'center',
      alignItems:'center',
      backgroundColor: theme.sortButtonBackground,
      marginRight: 5,
      borderRadius: 5,
      paddingLeft:8,
      paddingRight:8,
    },
    selectedButton:{
      width:'auto',
      height:'100%',
      justifyContent:'center',
      alignItems:'center',
      backgroundColor: theme.sortButtonBackgroundSelected,
      marginRight: 5,
      borderRadius: 5,
      paddingLeft:8,
      paddingRight:8,
    },
    sortText:{
      color: theme.sortColor
    },
    filterContainer: {
      marginBottom: 10,
      justifyContent: 'space-evenly',
      position: 'absolute',
      zIndex: 99,
      right: 0,
      bottom: 100,
      backgroundColor:  theme.backgroundFilterGender,
      borderTopLeftRadius:12,
      borderBottomLeftRadius:12
    },
    filterButton: {
      backgroundColor:  'rgba(70, 70, 70, 0)',
      padding: 10,
      borderRadius: 5,
    },
    tabColor:{
      backgroundColor:theme.tabbarColor
    },
    mapa:{
      backgroundColor: theme.mapsBackground
    },
    menu:{
      color: theme.menuColor
    },
    cardProfile:{
      width:120,
      height:120,
      borderRadius: 12,
      margin:8,
      backgroundColor:'#fff'
    },
    textProfile:{
      fontSize:36,
      color:theme.titleColor,
      fontWeight:'700'
    },
    header:{
      backgroundColor: theme.background,
    },
    headerTitle:{
      fontSize:20,
      color:theme.titleColor
    },
    textLogo: {
      fontSize: 22, // Tamanho do texto
      fontWeight: 'bold', // Deixe o texto em negrito para destacar
      color: theme.textlogomarca, // Cor do texto conforme o tema
      letterSpacing: 1.5, // Espaçamento entre as letras para melhorar a legibilidade
      textAlign: 'center', // Centraliza o texto
      textTransform: 'uppercase', // Deixa o texto em maiúsculas
      fontFamily: 'Roboto', // Ou outra fonte que você preferir
      paddingVertical: 10, // Adiciona um pouco de espaçamento acima e abaixo
    },
    linegraficos:{
      stroke:theme.graphcsColor,
      fill: 'rgba(232, 232, 232, 0.06)',
      strokeWidth:2
    },
    linegraficosintern:{
      stroke:theme.graphcsColor,
      fill: 'rgb(52, 104, 160)',
      strokeWidth:0.5
    },
    textgrafico:{
      fill:theme.graphcsColor,
      fontSize: 12,
      color:'fff'
    },
    resultText:{
      color:theme.graphcsColor,
      fontSize:24,
    },
    bgcheader:{
      height:42,
      backgroundColor: theme.background
    },
    lineargradiente:{
      backgroundColor:theme.gradiente
    }
  });

// Exporta os estilos para Light Mode e Dark Mode
export const styles = {
  light: createStyles(lightMode),
  dark: createStyles(darkMode),
};

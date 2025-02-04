import React,{useRef} from 'react';
import { View, Text, StyleSheet, Image, Dimensions, ImageBackground, ScrollView, Platform, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useGlobalContext } from '../../Context/Contexto';
import { Svg, Polygon, Text as SvgText, Line } from 'react-native-svg';
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';

const Profile = () => {

  const { selectedAtletaProfile, themeStyles, themeName } = useGlobalContext();
  const polygonStyle = themeStyles.linegraficos;
  const polygonStyleinter = themeStyles.linegraficosintern;
  const polygonText = themeStyles.textgrafico;
  const profileRef = useRef();

  const shareImage = async () => {
    console.log('compartilhar card')
  };

  if (!selectedAtletaProfile) {
    return <Text>Nenhum atleta selecionado.</Text>;
  }

  const { nome, imagem, imageplayer,estatura, funcao, assistencias, rebotes_defensivos, tocos, roubos, pontos, rebotes_ofensivos, bolas_de_3, apresentacao } = selectedAtletaProfile;


  const scaleToValue = (value) => (value / 100) * 100;

  const skills = [
    { name: 'Pts', value: pontos },
    { name: 'Ast', value: assistencias },
    { name: 'Reb D', value: rebotes_defensivos },
    { name: 'Reb O', value: rebotes_ofensivos },
    { name: 'Bls 3', value: bolas_de_3 },
    { name: 'Tocos', value: tocos },
    { name: 'Roub', value: roubos },
    { name: 'Reb', value: rebotes_defensivos },  // Duplicando para completar 8 habilidades
  ];

   // Definindo os marcos e as imagens
   const badges = [
    { id: 1, name: '10 Pts', value: 10, badgeImage: require('../../../assets/badgets/get10.png'), badgeImageOff: require('../../../assets/badgets/noget10.png') },
    { id: 2, name: '50 Pts', value: 50, badgeImage: require('../../../assets/badgets/get50.png'), badgeImageOff: require('../../../assets/badgets/noget50.png') },
    { id: 3, name: '100 Pts', value: 100, badgeImage: require('../../../assets/badgets/get100.png'), badgeImageOff: require('../../../assets/badgets/noget100.png') },
    { id: 4, name: '200 Pts', value: 200, badgeImage: require('../../../assets/badgets/get200.png'), badgeImageOff: require('../../../assets/badgets/noget200.png') },
    { id: 5, name: '300 Pts', value: 300, badgeImage: require('../../../assets/badgets/get300.png'), badgeImageOff: require('../../../assets/badgets/noget300.png') },
    { id: 6, name: '400 Pts', value: 400, badgeImage: require('../../../assets/badgets/get400.png'), badgeImageOff: require('../../../assets/badgets/noget400.png') },
    // Adicione outros badges conforme necessário
  ];

  const angles = [
    0, 45, 90, 135, 180, 225, 270, 315 // Ângulos para as 8 habilidades (octógono)
  ];

  // Função para gerar os pontos do gráfico
  const generatePoints = () => {
    return angles.map((angle, index) => {
      const percentage = scaleToValue(skills[index]?.value || 0); // Converte o valor da habilidade para a escala de 0 a 100
      const radius = Math.min((percentage / 100) * 120, 120); // O raio não deve ultrapassar 120
  
      const x = 150 + radius * Math.cos((Math.PI / 180) * angle); // Calcula a posição X
      const y = 150 + radius * Math.sin((Math.PI / 180) * angle); // Calcula a posição Y
  
      return `${x},${y}`;
    }).join(' ');
  };

  // Função para gerar as posições dos nomes das habilidades
  const generateLabelPositions = () => {
    return angles.map((angle) => {
      const radius = 130; // Distância dos rótulos, ajustada para fora do gráfico

      const x = 150 + radius * Math.cos((Math.PI / 180) * angle);
      const y = 150 + radius * Math.sin((Math.PI / 180) * angle);

      return { x, y };
    });
  };

  const labelPositions = generateLabelPositions();

  // Função para gerar o octógono fixo (valores de 0 a 100)
  const generateOctagon = () => {
    return angles.map((angle) => {
      const radius = 120; // Raio fixo do octógono
  
      const x = 150 + radius * Math.cos((Math.PI / 180) * angle);
      const y = 150 + radius * Math.sin((Math.PI / 180) * angle);
  
      return `${x},${y}`;
    }).join(' ');
  };
  

  const sortedSkills = skills.sort((a, b) => b.value - a.value);

  const { width } = Dimensions.get('window');  // Pega a largura da tela
  const maxBarWidth = width * 0.9;  // Define a largura máxima como 90% da largura da tela

   // Função para verificar se o marco foi alcançado
   const checkBadgeStatus = (badgeValue, skillValue) => {
    return skillValue >= badgeValue;
  };



  return (


 <View ref={profileRef} style={themeStyles.container}>
  <ScrollView scrollEnabled contentContainerStyle={styles.contentContainer}>
    <>

    <LinearGradient
        // Background Linear Gradient
        colors={[themeStyles.container, themeStyles.lineargradiente]}
     >

      <View style={styles.redes}>

        <AntDesign name="hearto" size={24} color="black" />
        <TouchableOpacity onPress={shareImage}> 
        <Entypo name="share" size={24} color="black" />
        </TouchableOpacity>
      </View>

    <ImageBackground source={{ uri: imageplayer }} style={styles.backgroundImage}>

    {imageplayer ? (
       <View style={{height:300}}>
        
       <View style={{flex:1,width:'100%', height:200, justifyContent:'flex-end', alignItems:'flex-start'}}> 
          <View style={styles.contimagem}>
             {<Image source={{ uri: imagem }} style={styles.imagem}/>}
          </View>
          <LinearGradient
                colors={themeName === 'light' ? ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.54)','rgb(244, 244, 244)'] : ['rgba(13, 14, 29, 0)', 'rgba(16, 18, 44, 0.45)', 'rgb(12, 12, 32)']}
                style={{ width:'100%', height:'auto', justifyContent:'flex-end'}}
              >
          <View style={styles.contbase}>

           <View style={{maxWidth:'100%'}}> 
            <Text style={themeStyles.textProfile}>{nome}</Text>
          </View>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Text style={themeStyles.text}>{estatura}cm</Text>
              <Text style={themeStyles.text}>{funcao}</Text>
            </View>
          </View>
          </LinearGradient>
        </View>
       </View>
    ):(
      <View style={[imageplayer ? styles.header : {height:'auto'}]}>
     <View 
        style={imageplayer ? null : {
          flex: 1,
          width: '100%',
          height: 200,
          justifyContent: 'flex-end',
          alignItems: 'center',
          elevation: 4,  // Sombra no Android
          shadowColor: '#000',  // Cor da sombra
          shadowOffset: { width: 0, height: 2 },  // Deslocamento da sombra (2px para baixo)
          shadowOpacity: 0.25,  // Opacidade da sombra
          shadowRadius: 3.5,  // Raio da sombra
          boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.25)',  // Sombra para Web
        }}
      >
          {!imageplayer && imagem ? ( <Image source={{ uri: imagem }} style={styles.imagem}/> ): <Text>Sem imagem</Text>  }
         <View style={themeStyles.lineargradiente}>

          <View style={!imageplayer ? {maxWidth:'100%'} : {maxWidth:'50%'}}> 
           <Text style={themeStyles.textProfile}>{nome}</Text>
         </View>
           <View style={{ flexDirection: 'row', gap: 10 }}>
             <Text style={themeStyles.text}>{estatura}cm</Text>
             <Text style={themeStyles.text}>{funcao}</Text>
           </View>
         </View>
       </View>
      </View>
    )}  
       </ImageBackground>
  </LinearGradient>
  <View style={{width:'100%', paddingHorizontal:12, paddingVertical:20}}>
      {apresentacao ? <Text style={themeStyles.text}> {apresentacao} </Text> : null}
  </View>

       <View style={styles.gridContainerbadget}>
          {badges.map((badge) => {
            const isAchieved = checkBadgeStatus(badge.value, skills.find(skill => skill.name === badge.name.split(' ')[1])?.value);
            return (
              <View key={badge.id} style={styles.cardGridbadg}>
                <Image
                  source={isAchieved ? badge.badgeImage : badge.badgeImageOff}
                  style={[styles.badgets, { resizeMode: 'contain' }]}
                />
              </View>
            );
          })}
        </View>

  <View style={styles.barsContainer}>
            {sortedSkills.map((skill, index) => (
              <View key={index} style={styles.barContainer}>
                <View style={styles.contbarr}> 
                <View style={{width:'16%',backgroundColor: 'rgba(0, 123, 255, 0.7)' }}> 
                <Text style={styles.barLabel}>{skill.name}</Text>
                </View>
                <View style={[ 
                  styles.bar, 
                  {
                    width: `${Math.min(skill.value, 82)}%`,  // A barra vai até 100%, mas o máximo é 90% da largura da tela
                    maxWidth: maxBarWidth,  // Limita a largura da barra a 90% da tela
                    backgroundColor: 'rgba(0, 123, 255, 0.7)',
                  }
                ]}>
                  <Text style={styles.barValue}>
                    {skill.value > 100 ? `${skill.value}` : skill.value} {/* O valor pode ser maior que 100 */}
                  </Text>
                </View>
                </View>
               </View>
           ))}
 </View>
          <View style={styles.chartContainer}>
      <Text style={themeStyles.text}>Radar de habilidades</Text>
        <Svg width="100%" height="300" viewBox="0 0 300 300">
          {/* Octógono fixo (máximo de 120, ajustado para caber na tela) */}
          <Polygon
            points={generateOctagon()} // Desenhando o octógono fixo
            style={polygonStyle}
          />
          {/* Gráfico de Radar com valores proporcionais */}
          <Polygon
            points={generatePoints()} // Passando os pontos para o gráfico
            style={polygonStyleinter}
          />
          {/* Linhas do gráfico */}
          {angles.map((angle, index) => {
            const percentage = scaleToValue(skills[index]?.value || 0); // Converte o valor da habilidade para a escala de 0 a 100
            const radius = Math.min((percentage / 100) * 120, 120); // Limita o valor radial a 120

            const x1 = 150;
            const y1 = 150;
            const x2 = 150 + radius * Math.cos((Math.PI / 180) * angle);
            const y2 = 150 + radius * Math.sin((Math.PI / 180) * angle);

            return <Line key={index} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(0, 123, 255, 1)" strokeWidth="2" />;
          })}

          {/* Nomes das habilidades */}
          {labelPositions.map((position, index) => (
            <SvgText
              key={index}
              x={position.x}
              y={position.y}
              fontSize="12"
              textAnchor="middle"
              alignmentBaseline="middle"
              style={polygonText}
            >
              {skills[index].name}
            </SvgText>
          ))}

          {/* Linhas Guia Radiais (Pizza Cortada) */}
          {angles.map((angle, index) => (
            <Line
              key={`guide-${index}`}
              x1="150"
              y1="150"
              x2={150 + 120 * Math.cos((Math.PI / 180) * angle)}
              y2={150 + 120 * Math.sin((Math.PI / 180) * angle)}
              stroke="gray"
              strokeWidth="1"
              strokeDasharray="5,5" // Linha tracejada
            />
          ))}
        </Svg>
       
      </View>
   </>
  </ScrollView>
 </View>
 
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex:1,
    height:'100vh',
    overflow: 'auto',
  },
  imagem: {
    width: 80,
    height: 80,
    borderRadius: 50,
    marginBottom: 20,
  },
  contimagem: {
    width: 80,
    height: 80,
    borderRadius: 50,
    marginBottom: 20,
    marginLeft:16,
    elevation: 4,  // Sombra no Android
    shadowColor: '#000',  // Cor da sombra
    shadowOffset: { width: 0, height: 2 },  // Direção da sombra
    shadowOpacity: 0.25,  // Opacidade da sombra
    shadowRadius: 3.5,  // Raio da sombra
    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.25)',  // Sombra para Web
  },
  
  nome: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  detail: {
    fontSize: 18,
    marginBottom: 5,
  },
  header: {
    width: '100%',
    height: 300,
    justifyContent:'flex-end'
  },
  chartContainer: {
    width: '100%',
    height: 300,
    alignItems: 'center',
    marginBottom: 20,
  },
  chartLabel: {
    fontSize: 18,
    marginTop: 10,
  },
  gridContainer: {

    flexDirection: 'row',
    flexWrap: 'wrap', // Permite quebrar os itens em várias linhas
    justifyContent: 'space-between', // Distribui os itens com espaçamento entre eles
  },
  cardGrid: {
    width: '23%', // Para 4 itens por linha, você pode definir a largura de cada item como 23% (com um pequeno espaçamento)
    marginBottom: 12, // Espaço entre as linhas
    backgroundColor: '#f0f0f0', // Exemplo de fundo, pode ser alterado
    padding: 10, // Padding interno
    borderRadius: 5, // Bordas arredondadas
    alignItems: 'center', // Centraliza o conteúdo no item
    justifyContent: 'center',
  },
  detail: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  barsContainer: {
    width: '100%',
    paddingVertical:16,
  },
  barContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    paddingHorizontal:16,
  },
  barLabel: {
    width: '100%',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
  bar: {
    height: 'auto',
    width:'100%',
    borderRadius: 10,
    borderTopLeftRadius:0,
    borderBottomLeftRadius:0,
    justifyContent: 'center',
    paddingLeft: 10,
    position: 'relative',
  },
  barValue: {
    position: 'absolute',
    right: 10,
    color: 'white',
    fontWeight: 'bold',
  },
  contentContainer: {
    flexGrow:1
  },
  contbarr:{
    flexDirection:'row',
    width: '100%',
    height:'auto',
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  imgplayer:{
    width:'100%',
    height:'auto'
  },
  badgets:{
    width:42,
    height:42,
    resizeMode: 'contain',
  },
  gridContainerbadget: {
    flexDirection: 'row',
    flexWrap: 'wrap', 
    gap:6,
    paddingHorizontal:12
  },
  cardGridbadg: {
    alignItems: 'center',
    borderRadius: 100,
    justifyContent: 'center',
    width: 'auto',
    height: 'auto',
    borderColor: "rgba(12, 165, 7, 0)",
    borderWidth: 1,
    elevation: 4,  // Para sombra no Android
    shadowColor: '#000', // Cor da sombra
    shadowOffset: { width: 0, height: 2 },  // Direção da sombra
    shadowOpacity: 0.25, // Opacidade da sombra
    shadowRadius: 3.5,  // Raio da sombra
    // Sombra adicional para web
    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.25)',  // Para Web
  },
  badgeLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  contbase:{
    width:'100%',
    height: 'auto', 
    paddingLeft: 12,
    paddingVertical:16,
    justifyContent:'flex-end'
  },
  redes:{
    flexDirection:'row',
    width:'auto',
    height:38,
    paddingHorizontal:16,
    justifyContent:'center',
    alignItems:'center',
    gap:16,
    position:'absolute',
    zIndex:100,
    right:0,
    bottom:16,
  }
});

export default Profile;

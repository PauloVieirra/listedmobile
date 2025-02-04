import { StyleSheet } from "react-native";

const style = StyleSheet.create({

    container:{
        flex:1,
        backgroundColor:'#dedede'
    },
    contsup:{
        flex:1
    },
    contsub:{
        flex:'50%',
        padding:16,
        justifyContent:'flex-end',
        gap:16
    },
    contbtn:{
        gap:16,
        justifyContent:'center',
        height:'50%',
    },
    title:{
        fontWeight:'600',
        fontSize:40,
        color:'#fff'
    },
    subtitle:{
        fontSize:20,
        color:'#c4c4c6'
    }
  

})

export default style;
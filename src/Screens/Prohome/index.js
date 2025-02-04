import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Prohome()  {
    return(
        <View style={styles.container}>
            <Text>
                PerfilPro
            </Text>
        </View>
    );

}


const styles = StyleSheet.create({

    container:{
        flex:1,
        width:'100%',
        height:'100%',
        alignItems:'center',
        justifyContent:'center'
    }

});
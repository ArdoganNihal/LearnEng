import React, { Component } from 'react'
import {View, Text, SafeAreaView, StyleSheet } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'

export default class Profile extends Component {
    render() {
        return (
        <View style={{backgroundColor:'white', height:575}}>
         
            <View style={styles.backStage}>
                <View style={styles.profileIcon}>
                    <FontAwesome name="user-circle" size={70} color="black"  />
                </View>
                <View style={styles.info_background}><Text style={styles.info}>Ad</Text></View>
                <View style={styles.info_background}><Text style={styles.info}>Soyad</Text></View>
                <View style={styles.info_background}><Text style={styles.info}>E-mail</Text></View>
                <View style={styles.rectangle}></View>
            </View>
           
        </View>
        )
    }
   
}
const styles = StyleSheet.create({
    profileIcon:{
        justifyContent:'center', 
        alignItems:'center', 
        //paddingTop:50,
        marginTop:135
    },
    backStage:{
        backgroundColor:'#E1E1E1',
        borderBottomLeftRadius:450,
        borderBottomRightRadius:450,
        height:200,
    
    },
    backStage_sub:{
        //marginTop:150,
        backgroundColor:'black',
        borderTopLeftRadius:150,
    },
    info:{
        //paddingTop:50,
        //marginTop:50,
        justifyContent:'center',
        alignItems:'center',
        fontSize:15,
    },
    info_background:{
        marginTop:30,
        //paddingTop:10,
        marginLeft:125,
        justifyContent:'center', 
        alignItems:'center',
        backgroundColor:'#BEBFBF', 
        //borderRadius:10, 
        height:20, 
        width:100
    },
    rectangle: {
        height: 300,
        width: 150,
        borderWidth:2,
        borderColor:'grey',
        //backgroundColor: 'grey',
        position: 'absolute', 
        zIndex: 99,
        marginLeft:99,
        //marginRight:70,
        top: '50%',
        // left: '27%',
        // right:'27%'
      }
})

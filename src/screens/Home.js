import React, { Component } from 'react'
import {View,TouchableOpacity,Text, FlatList, SafeAreaView} from 'react-native'
import { MaterialIcons,EvilIcons} from '@expo/vector-icons';
import {inject} from 'mobx-react'
import {API_URL} from '../config/config'
import axios from 'axios'
import Slider from './Slider'
import CategoryItem from '../components/Category/CategoryItem'
import NavigationService from '../config/NavigationService'

@inject("AuthenticateStore")


export default class Home extends Component {
    constructor(props){
        super(props);
        this.state={
            categeories:[],
            data:[],
            token:'',
        }
    }
    
    static navigationOptions = ({navigation})=>{
        return {
            title:<Text style={{color:'Black', justifyContent:'center', alignItems:'center', fontFamily:'Open Sans', fontSize:26, marginLeft:50}}>LearnEng</Text>,
            headerLeft:<TouchableOpacity onPress={()=>navigation.navigate('Profile')}style={{marginRight:15,padding:5}}><EvilIcons name="user" size={30} color="black" /></TouchableOpacity>,
            headerRight: 
                 <TouchableOpacity onPress={navigation.getParam("logout")
                   } style={{marginRight:15,padding:5}}>
                   <MaterialIcons name="logout" size={24} color="black" />
                 </TouchableOpacity>
        }
    }
    componentDidMount = () =>{
        this.props.navigation.setParams({logout:()=>this.props.AuthenticateStore.removeToken()})
        const token=this.props.AuthenticateStore.token;
        this.setState({token:token})
        axios.get(`${API_URL}/Questions`,{
            headers: {"Authorization" : `Bearer ${token}`} 
        }).then(res=>{
            this.setState({data:res.data})
            const categeories=[];
            res.data.map((a)=>{
                if(!categeories.includes(a.level)){
                    categeories.push(a.level)
                }
            });
            this.setState({categeories})
        console.log(this.state.categeories);

            
        }).catch((err)=>{
            console.log(err);
        })
    
        console.log(token);
           
    
    }
        ;

   
       

    render() {
        return (
          <React.Fragment>
            <Slider data={this.state.data} style={{flex:1}}></Slider>
          </React.Fragment>
                
            
        )
    }
}
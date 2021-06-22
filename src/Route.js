import React from 'react';
import {createAppContainer,createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack'
import Login from './screens/Login';
import Register from './screens/Register';
import Home from './screens/Home'
import AuthRedirect from './screens/AuthRedirect'
import CategoryDetail from './components/Category/CategoryDetail';
import ChapterDetail from './components/Chapter/ChapterDetail';
import Slider from './screens/Slider'
import Profile from './screens/Profile'

const AppStack=createStackNavigator({
  Home:{
    screen:Home,
    
  },
  CategoryDetail:{
    screen:CategoryDetail
  },
  ChapterDetail:{
    screen:ChapterDetail,
  },
  Slider:{
    screen:Slider
  },
  Profile
})
const AuthenticateStack=createStackNavigator({
    Login:{
      screen:Login,
      navigationOptions:{ header:null}},
    Register:{
        screen:Register,
        navigationOptions:{header:null}}})
const SwitchNavigator=createSwitchNavigator({
    App:AppStack,
    Auth:AuthenticateStack,
    AuthRedirect
  },{initialRouteName:'AuthRedirect'})
export default createAppContainer(SwitchNavigator)
import { inject, observer } from 'mobx-react'
import React,{useState,useEffect} from 'react'
import {SafeAreaView,View,Text,Animated,FlatList,StyleSheet, Image,TouchableOpacity,Dimensions} from 'react-native'
import {API_URL} from '../config/config'
import axios from 'axios'
import { LinearGradient } from 'expo-linear-gradient';
import Svg,{Rect} from 'react-native-svg'
import NavigationService from '../config/NavigationService'
import {BarIndicator} from 'react-native-indicators'

const {width,height}=Dimensions.get('window');
const SPACING=10;
const ITEM_SIZE=width * 0.72;
const SPACER_ITEM_SIZE=(width-ITEM_SIZE) / 2;
const BACKDROP_HEIGHT=height*0.6;

const Loading=()=>(
    <View style={style.loading_container}>
      <BarIndicator animationDuration={2000} color={'black'}/>
    </View>
  )

const BackDrop = ({category, scrollX}) => {
    return <View style={{ height: BACKDROP_HEIGHT, width, position: 'absolute',flex:1 }}>
          <FlatList
            data={category.reverse()}
            removeClippedSubviews={false}
            contentContainerStyle={{width, height: BACKDROP_HEIGHT}}
            renderItem={({ item, index }) => {
              if (!item.url) {
                return null;
              }
              const translateX = scrollX.interpolate({
                inputRange: [(index - 2) * ITEM_SIZE, (index - 1) * ITEM_SIZE],
                outputRange: [0, width],
                // extrapolate:'clamp'
              });
              return (
                <Animated.View
                  removeClippedSubviews={false}
                  style={{position: 'absolute', width: translateX, height, overflow: 'hidden'}}
                >
                <Image
                  source={{ uri: item.url }}
                  style={{
                    width,
                    height: BACKDROP_HEIGHT,
                    position: 'absolute'
                  }}
                />
                </Animated.View>
              );
            }}
          />
          <LinearGradient
            colors={['rgba(0, 0, 0, 0)', 'white']}
            style={{
              height: BACKDROP_HEIGHT,
              width,
              position: 'absolute',
              bottom: 0,
            }}
          />
        </View>
  }
  //buradaki item.backdrop apiden geldi


const Slider = inject("AuthenticateStore")(observer((props)=>{
    const [question,setQuestion]=useState([]);
    const [category,setCategory]=useState([])
    const scrollX=React.useRef(new Animated.Value(0)).current;
    const categories=[]
    
    


    useEffect(()=>{
        const token=props.AuthenticateStore.token;

        if(question.length===0){
        axios.get(`${API_URL}/Questions`,{
            headers: {"Authorization" : `Bearer ${token}`} 
        }).then(res=>{
          //res.data.map((e)=>category.push([{name:e.level,ur:e.level_image}]))
            res.data.map((item,index)=>{
               categories.push({name:item.level,url:item.level_image})
             
            })
            
        })

          setTimeout(()=>{
            function removeDuplicates(originalArray, prop) {
              var newArray = [];
              var lookupObject  = {};
         
              for(var i in originalArray) {
                 lookupObject[originalArray[i][prop]] = originalArray[i];
              }
         
              for(i in lookupObject) {
                  newArray.push(lookupObject[i]);
              }
               return newArray;
          }
         
         var uniqueArray = removeDuplicates(categories, "name");
         console.log(uniqueArray);
         setCategory([{key:'left-spacer'},...uniqueArray,{key:'right-spacer'}]);
         console.log("uniqueArray is: " + JSON.stringify(uniqueArray));

              
         

            
          },2000)
          
           // setCategory([{key:'left-spacer'},...res.data.level,{key:'right-spacer'}]);
         
      }
       

      },[question])

      if(category.length===0){
          return <Loading/>
      }

    return (
        <View style={style.container}>
            
            <BackDrop category={category} scrollX={scrollX} />
            <Animated.FlatList
            showsHorizontalScrollIndicator={false}
            data={category}
            horizontal
            contentContainerStyle={{alignItems:'center'}}
            snapToInterval={ITEM_SIZE}
            decelerationRate={0}
            bounces={false}
            onScroll={Animated.event(
                [{nativeEvent:{contentOffset:{x:scrollX}}}],
                {useNativeDriver:true}
              )}
            scrollEventThrottle={16}
            renderItem={({item,index})=>{
                if(!item.url){
                    return <View style={{width:SPACER_ITEM_SIZE}}></View>
                }
               
                  const inputRange=[
                    (index-2)*ITEM_SIZE,
                    (index-1)*ITEM_SIZE,
                    index * ITEM_SIZE,
                  ];
                  const translateY=scrollX.interpolate({
                    inputRange,
                    outputRange:[100,50,100]
                  })
        
                  //ortada bulunan itemin yukarı doğru çıkmasını sağladık
                  return(
                      <TouchableOpacity onPress={()=>{
                        NavigationService.navigate('CategoryDetail',{
                          data:props.data,
                          category_name:item
                        })
                      }}>
                           <View style={{width:ITEM_SIZE}}>
                                <Animated.View
                                    style={{
                                    marginHorizontal:SPACING,
                                    padding:SPACING*2,
                                    alignItems:'center',
                                    backgroundColor:'white',
                                    //borderRadius:34,
                                    transform:[{translateY}]
                                    }}
                                >
                                    <Image 
                                    source={{uri:item.url}}
                                    style={style.poster_image}
                                    />
                                    <Text style={{fontSize:24}} numberOfLines={1}>
                                    {item.name}
                                    </Text>
                                    

                                </Animated.View>
                                </View>
                      </TouchableOpacity>
                  )
            }}    

            
            
            >


            </Animated.FlatList>


        </View>
    )

})) 


const style = StyleSheet.create({
    loading_container:{
      flex:1,
      alignItems:'center',
      justifyContent:'center'
    },
    container:{
      flex:1
    },
    paragraph:{
      margin:24,
      fontSize:18,
      fontWeight:'bold',
      textAlign:'center'
    },
    poster_image:{
      width:'100%',
      height:ITEM_SIZE*1.2,
      resizeMode:'cover',
      //borderRadius:44,
      margin:0,
      marginBottom:10
    }
  });

    


export default Slider

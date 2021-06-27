import React, { Component,useState,useEffect} from 'react'
import { inject, observer } from 'mobx-react'
import {SafeAreaView,View,Text,StyleSheet,TouchableOpacity,Animated,Image,Dimensions} from 'react-native'
import NavigationService from '../config/NavigationService';
const alphabet=["A","B","C","Ç","D","E","F","G","Ğ","H","I","İ","J","K","L","M","N","O","Ö","P","R","S","Ş","T","U","Ü","V","Y","Z"]
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import jwt_decode from "jwt-decode";
import axios from 'axios';
import {API_URL} from '../config/config'

const {width,height} = Dimensions.get('window');

const Game = inject("AuthenticateStore")(observer((props)=> {
    const [index,setIndex] =useState(0);
    const [question,setQuestion]=useState("");
    const [answer,setAnswer]=useState("");
    const [shuffleAnswer,setShuffleAnswer]=useState([]);
    const [keywords,setKeywords]=useState([]);
    //keywords karışık olarak verilen harflerden oluşan shuffleAnswerden bizim
    //seçmiş olduğumuz harfleri içerir.
    const [confirm,setConfirm]=useState(false);
    //keywordslerden oluşan yanıtımız ile gerçek cevabın
    //eşleşmesi durumununu barındırır.
    const [wrong,setWrong]=useState(false);
    //yanlış cevap için kontrol sağlar
    const [clue,setClue]=useState('')
    //ipucu bilgisini tutar
    const [rightAnswer,setRightAnswer]=useState(false);
    
    const [sayac,setSayac]=useState(1)

    const value = new Animated.Value(0);
    const  showClue   = () => {  
        
            Animated.timing(value, {  
                toValue: 1,  
                duration: 2000,  
                useNativeDriver: false,  
              }).start();  

              setTimeout(() => {
                  Animated.timing(value,{
                      toValue:0,
                      duration:2000,
                      useNativeDriver:false
                  }).start();
              }, 3000);
             
              
              
        
       
      }; 

    const shuffle = (array) => {
        return array.sort(()=>Math.random()-0.5);
        //alfabeden rastgele harfler ekledikten sonra
        //stringToArray'in içindeki haraflerin sıralamasını karıştırır.
    }

    const setKeyword = (keyword)=>{
        //karışık halde verilen cevap harflerinden birine tıklandığında tetiklenir.
        
        if(keywords.length<answer.length){
        keywords.push(keyword);
        setKeywords([...keywords])
        //cevap olarak vereceğimiz keyword sayısının cevabının uzunluğu kadar
        //olmasını sağladık
        }

        if(keywords.length===answer.length){
            if(answer== keywords.join("")){
                setIndex(index + 1);
                setTimeout(() => {
                    setConfirm(true);
                setKeywords([]);
                }, 2000);
                setRightAnswer(true);
                //eğer cevap doğruysa index artılır ve diğer 
                //soruya geçilir.ve confirm true olarak ayarlanır.
                //bir sonraki soruya geçildiği için keywords alanını temizledik
            }
            else{
                setWrong(true);
            }
        //eğer cevabın uzunluğu kadar keyword'e tıklanmışsa 
        //keywordsleri birleştirip cevapla karşılaştırır.    
        }
        
    }
    
    const removeKeyword =(index) =>{
        //cevap olarak verdiğimiz keywordleri geri almak için
        //kullandığımız metot
        keywords.splice(index,1);
        setKeywords([...keywords]);
        //gelen indexi keywords içerisinden siler ve setKeywords diyerek
        //keywordsler güncellenir.
        setWrong(false);
    }

      useEffect(()=>{
            console.log(props)
            setConfirm(false);
            setWrong(false);
            setAnswer("");
            setRightAnswer(false)

            if(typeof props.questions[index] !== 'undefined'){
            //eğer soru yoksa tekrar çalıştırma     
                const answer=props.questions[index].answer.toUpperCase();
                setQuestion(props.questions[index].question);
                setAnswer(answer);
                setClue(props.questions[index].clue);
                const stringToArray=answer.split("");
                //cevabı boşluklarla ayırarak bir diziye dönüştürdük.
            
            
                stringToArray.push(alphabet[Math.floor(Math.random()*alphabet.length)]);
                stringToArray.push(alphabet[Math.floor(Math.random()*alphabet.length)]);
                stringToArray.push(alphabet[Math.floor(Math.random()*alphabet.length)]);

                setShuffleAnswer(shuffle(stringToArray));

            }
        
            
      },[confirm])

      //burada confirm true olursa yani sorunun cevabı doğru 
      //ise useEffect tekrar başlar yani bir sonraki soruya geçilmiş olur
        if(answer==='' && index !==0 && sayac===1){
            console.log('bölüm tamamlandı kardeş');
            setSayac(2);
            const token=props.AuthenticateStore.token;
            const userid=parseInt(jwt_decode(token).nameid);
            const levelid=props.questions[0].levelid;
            axios.post(`${API_URL}/Progress`,{
                levelId:levelid,
                userId:userid,
                isComplete:true
            })
                
            
        
            
        }
      
      

     
    return (
        <View style={[style.app,{backgroundColor:rightAnswer?'#e1f4e5':'#f2f2f2'}]}>
        {answer !== "" &&
       <React.Fragment>
           <View>
                {
                    rightAnswer && 
                        <View>
                            <Image source={{uri:'https://cdn.dribbble.com/users/1283437/screenshots/4486866/checkbox-dribbble-looped-landing.gif',width:100,height:100}}></Image>
                        </View>  
                }
           </View>
           {!rightAnswer && 
           <React.Fragment>

              <View style={{height:30,width:30,backgroundColor:'white',margin:10}} >
                    <TouchableOpacity onPress={()=>showClue()} >
                            <MaterialCommunityIcons name="lightbulb-on" size={24} color="yellow" />
                    </TouchableOpacity>
                 
                </View>
              
                <Animated.Text style={{opacity:value,fontSize:15,fontWeight:'700',color:'#66bb6a'}}>
                    {clue}
                </Animated.Text>
                <View style={style.show_area}> 
           <View style={style.question_area}>
               <Text style={style.question_text} numberOfLines={1}>{question}</Text>
           </View>
        
           <View style={style.progress_area}>
               <Text style={style.progress_text}>
                   {(index+1)+"/"+props.questions.length}
               </Text>
           </View>
           </View>  
           <View style={style.rectangle}>
               {keywords.map((item,index)=>(
                   <TouchableOpacity onPress={()=>removeKeyword(index)} style={[style.keywords,{backgroundColor:(wrong)?'red':'yellow'}]} key={index}>
                       <Text style={style.keywords_text}>
                           {item}
                       </Text>
                   </TouchableOpacity>
               ))}
           </View>
           <View style={style.random_letter_area}>
               {shuffleAnswer.map((item,index)=>(
                   <TouchableOpacity style={style.letter} key={index} onPress={()=>{setKeyword(item)}}>
                       <Text style={style.letter_text}>
                           {item}
                       </Text>
                       
                   </TouchableOpacity>
               ))}
           </View>
           </React.Fragment>
}
       </React.Fragment>
       }
       {answer === "" && 
       <View>
           
                <Text>
                    Bölüm Tamamlandı
                 </Text>
           
            
        </View>
           
       }    
       
    </View>
    )
}))

export default Game

const style=StyleSheet.create({
    app:{
        textAlign:'center',
        justifyContent:'center',
        alignItems:'center',
        flex:1,
    },
    show_area:{
        backgroundColor:'#c0c0c0',
        width:width*.7,
        justifyContent:'center',
        textAlign:'center',
        alignItems:'center',
        //borderBottomLeftRadius:25,
        //borderBottomRightRadius:25,

    },
    question_area:{
        height:50,
        flexDirection:'row',
        //marginBottom:10
    },
    question_text:{
        fontSize:20,
        fontWeight:'700',
        textAlign:'center',
        paddingTop:10,
        justifyContent:'center'

    },
    progress_area:{

    },
    progress_text:{
        fontWeight:'700'
    },
    random_letter_area:{
        flexDirection:'row',
        flexWrap:'wrap',
        padding:20,
        justifyContent:'space-around',
        width:160,
        backgroundColor:'#c0c0c0',
        height:160,
        marginTop:100,
        borderRadius:160/2,
        
        //borderBottomLeftRadius:50,
        //borderBottomRightRadius:150
        
    },
    letter:{
        margin:1,
        width:30,
        height:30,
        backgroundColor:'#ffe4b5',
        //borderRadius:30,
        justifyContent:'center',
        

    },
    letter_text:{
        justifyContent:'center',
        textAlign:'center',
        fontSize:20,
        fontWeight:'700'
    },
    keywords_area:{
        flexDirection:'row',
        flexWrap:'wrap',
        //padding:20,
        height:95,
        width:width*.9,
        justifyContent:'center',
        marginTop:10,
        backgroundColor:'#D2B99D',
        //borderRadius:20
        
    },
    keywords:{
        margin:1,
        width:25,
        height:25,
        backgroundColor:'yellow',
        //borderRadius:30,
        justifyContent:'center',
    },
    keywords_text:{
        justifyContent:'center',
        textAlign:'center',
        fontWeight:'700'
    }, 
    rectangle:{
        flexDirection:'row',
        //flexWrap:'wrap',
        //padding:10,
        height:55,
        width:width*.7,
        borderWidth:2,
        borderColor:'#dda0dd',
        justifyContent:'center',
        position: 'absolute', 
       
    }



})



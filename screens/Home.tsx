import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import {View, Text, ActivityIndicator, ScrollView, StyleSheet, Image, SafeAreaView, requireNativeComponent} from 'react-native';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import {host} from '../config/settings';
import Navigation from '../navigation';
import * as SQLite from "expo-sqlite";
import Carousel from 'react-native-snap-carousel';


const db = SQLite.openDatabase("appvenda.db");

const Stack = createStackNavigator();



export default function Home(){

    return(
        <Stack.Navigator>
            <Stack.Screen name="Listar Produtos" component={ListarProdutos} options={{headerShown:false}}/>
            <Stack.Screen name="Detalhes Produtos" component={DetalhesProdutos} />
        </Stack.Navigator>
    );
    
}

function ListarProdutos({navigation}){

    const [carregando,setCarregando] = React.useState(true);
    const [dados,setDados] = React.useState([]);

    React.useEffect(()=>{
        fetch(`${host}/loja/service/produto/listartelainicial.php`)
        .then((response)=>response.json())
        .then((produto)=>{setDados(produto.saida)})
        .catch((error)=>console.error(`Erro ao carregar a API ${error}`))
        .finally(()=>setCarregando(false))
    },[]);

    return(

        <ScrollView style={styles.scrollview} horizontal={false}>

            {carregando ? (
                <ActivityIndicator/>
            ):(
                <FlatList
                data={dados}
                renderItem={({item})=>(
                    <View style={styles.caixa}>
                        <Text style={styles.nome}>Nome Produto: {item.nomeproduto}</Text>
                        <Text style={styles.preco}>Preço: R$ {item.preco}</Text>

                        <TouchableOpacity onPress={()=>{
                            navigation.navigate("Detalhes Produtos",{
                                idproduto:`${item.idproduto}`
                            })
                        }} style={styles.btnProdutos}>
                            
                            <Text style={styles.txtBtnDetalhes}> Comprar agora </Text>
                            
                            </TouchableOpacity> 

                    </View>
                )}
                keyExtractor={({idproduto, index})=>idproduto}
                />
            )
            
            }

        </ScrollView>

    );
}


const _renderItem = ({item,index})=>{
    return (
      <View style={{
          backgroundColor:'white',
          borderRadius: 5,
          height: 250,
          padding: 50,
          marginLeft: 25,
          marginRight: 25, }}>
        <Image source={{uri:`${host}/loja/img/${item}`}} style={{resizeMode:'contain',flex:1, height:250}} />
      </View>

    )
      }

function DetalhesProdutos({route}){

    const {idproduto} = route.params;
    const [fotos, setFotos] = React.useState([]);
    const [carregando,setCarregando] = React.useState(true);
    const [dados,setDados] = React.useState([]);
    const [activeIndex,setActiveIndex] = React.useState(0);

    React.useEffect(()=>{
        fetch(`${host}/loja/service/produto/detalheproduto.php?idproduto=${idproduto}`)
        .then((response)=>response.json())
        .then((produto)=>{
            setDados(produto.saida)
            var ft = [produto.saida[0].foto1,produto.saida[0].foto2,produto.saida[0].foto3];
            setFotos(ft);
            console.log("-----------------------");
            console.log(fotos);
        })
        .catch((error)=>console.error(`Erro ao carregar a API ${error}`))
        .finally(()=>setCarregando(false))
    },[]);

    return(

        <ScrollView style={styles.scrollview} horizontal={false}>

            

            {carregando ? (
                <ActivityIndicator/>
            ):(

               
         

                <FlatList style={{flex:1}}
                data={dados}
                renderItem={({item})=>(
                    <View>
                       

                        {/* 
                        
                        ----------------------------------------------------------
                        Carosel
                        */}
            <SafeAreaView style={{flex: 1, paddingTop: 50, }}>
            <View style={{ flex: 1, flexDirection:'row', justifyContent: 'center', }}>
                <Carousel
                  layout={"default"}
                  data={fotos}
                  sliderWidth={300}
                  itemWidth={300}
                  renderItem={_renderItem}
                  onSnapToItem = { index => setActiveIndex(index) } />
            </View>
          </SafeAreaView>

                        {/* <Image source={{uri:`${host}/loja/img/${item.foto1}`}} style={styles.foto} />
                        <Image source={{uri:`${host}/loja/img/${item.foto2}`}} style={styles.foto} />
                        <Image source={{uri:`${host}/loja/img/${item.foto3}`}} style={styles.foto} /> */}

                        <Text style={styles.nomePr}>Nome Produto: {item.nomeproduto}</Text>
                        <Text style={styles.desc}>Descrição: {item.descricao}</Text>
                        <Text style={styles.precoPr}>Preço: R$ {item.preco}</Text>

                        <TouchableOpacity onPress={()=>{
                            db.transaction((tx)=>{
                                tx.executeSql("create table if not exists carrinho(id integer primary key, idproduto int, nomeproduto text, preco text, foto text);");
                            });

                            db.transaction((ts)=>{
                                ts.executeSql("insert into carrinho(idproduto,nomeproduto,preco,foto)values(?,?,?,?)",[item.idproduto,item.nomeproduto,item.preco,item.foto1]);
                            });

                            db.transaction((sl)=>{
                                sl.executeSql("select * from carrinho",[],(_,{rows})=>{
                                    console.log(JSON.stringify(rows));
                                });
                            });


                        }} style={styles.btnDetalhes}>

                            <Text style={styles.txtCarrinho}>Adicionar ao carrinho</Text>

                        </TouchableOpacity>

                    </View>
                )}
                keyExtractor={({idproduto, index})=>idproduto}
                />
              
            )
            
            }

        </ScrollView>

    );
}

//----------------CSS da tela

const styles = StyleSheet.create({
    scrollview:{
        width:'100%',
        backgroundColor:'#28A326'
    },

    btnDetalhes:{
        backgroundColor:'#4E614E',
        padding:10,
        margin:5,
        borderRadius:20,
        marginTop:10,
        width:383
    },

    btnProdutos:{
        backgroundColor:'#4E614E',
        padding:10,
        margin:5,
        borderRadius:20,
        marginTop:10,
        width:320
    },
    txtBtnDetalhes:{
        fontSize:15,
        textAlign:'center',     
        color:'white'
    },

    foto:{
        flex:1,
        resizeMode:'cover',
        width:200,
        height:200,
        margin:10,

    },
    
    caixa:{
        margin:10,
        backgroundColor:'white',
        shadowColor:'silver',
        shadowOpacity:10,
        padding:10,
        paddingBottom:30,
        paddingTop:30,
        borderColor:'silver',
        borderWidth:1,
        width:350,
        marginLeft:'auto',
        marginRight:'auto',
        borderRadius:10
    },

    nome:{
        textAlign:'center'
    },
    
    preco:{
        textAlign:'center',
        marginBottom:10
    },

    nomePr:{
        textAlign:'center',
        color:'white',
        marginTop:50
    },

    desc:{
        textAlign:'center',
        color:'white'
    },

    precoPr:{
        textAlign:'center',
        color:'white',
        marginBottom:25
    },

    txtCarrinho:{
        textAlign:'center',
        color:'white'
    }
})
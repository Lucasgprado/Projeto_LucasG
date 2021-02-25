import * as React from "react";
import { Text, View } from "../components/Themed";

import * as SQLite from "expo-sqlite";
import { Image, RefreshControl, StyleSheet, SafeAreaView } from "react-native";
import { TextInput } from "react-native";
import { TouchableOpacity, ScrollView } from "react-native-gesture-handler";
import { createStackNavigator } from "@react-navigation/stack";
import ItensPedidos from "./ItensPedidos";
import Pagamento from './Pagamento'

const db = SQLite.openDatabase("appvenda.db");
const Stack = createStackNavigator();

//--constante para nos ajudar a pausar a tela em quanto o indicator


// realiza a animação de girar enquanto o refreshControl atualiza a tela

const wait = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};

export default function Carrinho() {
    return(
    <Stack.Navigator>
        <Stack.Screen name="ItensCarrinho" component={ItensCarrinho}/>
        <Stack.Screen name="Pagamento" component={Pagamento}/>
    </Stack.Navigator>
    )
}
function ItensCarrinho({ navigation }){
  const [dados, setDados] = React.useState([]);
  const [quantidade, setQuantidade] = React.useState("1");

  //---vamos criar uma constante para realizar o refresh(atualização)

  const [refreshing, setRefreshing] = React.useState(false);

  //condificação de atualização dos controles de tela

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    db.transaction((tx) => {
      tx.executeSql("select * from carrinho", [], (_, { rows: { _array } }) => {
        console.log("----- itens no carrinho onRefresh --------");
        console.log(_array);
        setDados(_array);
      });
    });
    wait(2000).then(() => setRefreshing(false));
  }, []);

  React.useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql("select * from carrinho", [], (_, { rows: { _array } }) => {
        console.log("----- itens no carrinho useEffect --------");
        console.log(_array);
        setDados(_array);
      });
    });
  }, []);

  return (
    
    <View style={tela.area}>

     <Text style={tela.titulo}>Carrinho</Text>
     <Text style={tela.titulo2}>Toque na tela e arraste para baixo para atualizar o carrinho</Text>

<View  style={tela.conteiner}>
    <ScrollView  style={{flex:1}}
      contentContainerStyle={{}}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
 
    
      
        {dados.map(({ id, idproduto, nomeproduto, preco, foto }) => (
      
      
      <View style={tela.produtocompleto} key={id}>
              <View style={tela.descricao}>
                <Text style={tela.produto}>{nomeproduto}</Text>
                <Image
              source={{ uri: `http://10.26.45.40/lucasgomes/loja/img/${foto}` }}
            style={{width:"100%", height:72,}}
            resizeMode={"contain"}
            />
                <Text style={tela.valor}>R$: {preco}</Text>

                <View style={tela.alinhamentotextoquantidade}>
                <View>
                <Text style={tela.quantidade}>Quantidade:</Text>
                </View>
                <View>
                <TextInput
                  placeholder="1"
                  style={tela.input_quantidade}
                  value={quantidade}
                  onChangeText={(value) => setQuantidade(value)}
                />
                </View>
                </View>

              <TouchableOpacity
                style={tela.excluir_carrinho1}
                onPress={() => {
                  db.transaction((tx) => {
                    tx.executeSql("delete from carrinho where id=?", [id]);
                    alert("Toque na tela e arraste para baixo para atualizar o carrinho")   
                    onRefresh();
                  });
                  
                }}
              >
                <Text style={tela.excluir_carrinho2}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
        </ScrollView>
        </View>
       
        <TouchableOpacity
          style={tela.realizar_pagamento1}
          onPress={() => {
            navigation.navigate("Pagamento");
          }}
        >
          <Text style={tela.realizar_pagamento2}>Realizar  pagamento</Text>
        </TouchableOpacity>
      
    </View>
  );
}
const tela = StyleSheet.create({

  area: {
    backgroundColor: "#28A326",
    flex: 1,
    borderColor: "white",
    zIndex:10000
    //borderWidth: 1,
    //borderRadius: 20,
    
  },

  titulo: {
    textAlign: "center",
    borderBottomColor: "silver",
  color:"white",
    fontSize: 20,
    fontWeight: "bold",
    marginTop:20,
    marginBottom:5,
  
  },


  titulo2: {
    textAlign: "center",
    borderBottomColor: "silver",
  color:"white",
    fontSize: 10,
    fontWeight: "bold",
    marginTop:0,
    marginBottom:10,
  
  },

  alinhamentotextoquantidade:{
    flexDirection: "row",
    flexWrap: "wrap",
  },

  conteiner: {
    //alinhar os itens um do lado do outro com flexDirection, flexWrap
    flex:1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent:"space-around",
    backgroundColor: "#28A326"
    
  },

  produtocompleto:{
    borderColor: "silver",
    borderWidth: 2,
    
    marginVertical: 4,
 
    margin:10,
    width: "80%",
    //padding: 5,
    //backgroundColor: "red",
    marginBottom: 10,
    paddingTop: 10,
    paddingBottom:10,
    borderRadius:20,
   
    //excluir para alterar forma de centralização
   marginStart:38,
   

  }
  ,

  descricao: {
    fontWeight: "bold",
    justifyContent: "center",
    alignItems: "center",
    //backgroundColor:"red",
    margin:3,
    borderWidth:1,
    
    borderColor:"white",
  },

  produto: {
    fontWeight: "bold",
    fontSize: 15,
    
  },
  

  valor: {
    fontWeight: "bold",
    
    fontSize: 13,
    
  },

  quantidade: {
    margin: 10,
    fontWeight: "bold",
    
  },

  input_quantidade: {
    color: "black",
    textAlign: "center",
    padding: -2,

    width: "250%",
    margin: 0,
    marginTop:5,
  
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "silver",

    shadowColor: "gray",
    shadowOpacity: 1,
    
  },

  realizar_pagamento1: {
    margin: 10,
    paddingVertical: 5,
    paddingHorizontal: 52,
    alignItems: "center",
    
  },

  realizar_pagamento2: {
    backgroundColor: "#4E614E",
    fontSize: 15,
    fontWeight: "bold",
    paddingVertical: 10,
    paddingHorizontal: 35,
    borderRadius: 20,
    margin: 1,
    color: "#ffffff",
    
  },

  excluir_carrinho1: {
    paddingVertical: 2,
    paddingHorizontal: 22,
    alignItems: "center",
    
  },

  excluir_carrinho2: {
    backgroundColor: "#4E614E",
    fontSize: 15,
    fontWeight: "bold",
    paddingVertical: 8,
    paddingHorizontal: 25,
    borderRadius: 20,
    margin: 1,
    color: "#ffffff",
    
    
  },

 
});

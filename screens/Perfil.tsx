import * as React from 'react';
import {View, Text,TouchableOpacity} from 'react-native';

import * as SQLite from "expo-sqlite";
const db = SQLite.openDatabase("appvendadb.banco");

export default function Perfil(){


        React.useEffect(() => {
            db.transaction((tx) => {
              tx.executeSql("drop table carrinho")
               
            });
          }, []);


    return(

        <View>

            <Text> Tela Perfil Sendo Apresentada</Text>
            <TouchableOpacity
                
                onPress={() => {
                  db.transaction((tx) => {
                    tx.executeSql("drop table carrinho");
                  });
                  alert("Toque na tela e arraste para baixo para atualizar o carrinho")
                }}
              >
                <Text style={{fontSize:30}}>Excluir</Text>
              </TouchableOpacity>

        </View>
    );
    
}
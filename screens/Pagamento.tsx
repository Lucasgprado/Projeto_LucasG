import * as React from "react";
import { Text, View } from "../components/Themed";
import { Picker,StyleSheet } from "react-native";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";

import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("appvenda.db");

let idc = 0;
let tp = "";
let ds = "";
let vl = "";
let qp = 0;
let vp = "";
let total = "";

export default function Pagamento({ navigation }) {
  const [tipo, setTipo] = React.useState("");
  const [parcelas, setParcelas] = React.useState(1);
  const [idcliente, setIdCliente] = React.useState(0);
  const [produtos, setProdutos] = React.useState([]);
  // constantes de passagem de dados

  const [descricao, setDescricao] = React.useState("");
  const [valor, setValor] = React.useState("");
  const [vParcela, setVParcelas] = React.useState("");

  React.useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        "select idcliente from perfil",
        [],
        (_, { rows: { _array } }) => {
          setIdCliente(_array[0].idcliente.toString());
          console.log(_array);
        }
      );

      tx.executeSql("select * from itens", [], (_, { rows: { _array } }) => {
        setProdutos(_array);
        console.log(_array);
      });

      //Vamos fazer uma nova consulta para calcular o valor total dos produtos no carrinho
      tx.executeSql(
        "select sum(preco) as total from itens",
        [],
        (_, { rows: { _array } }) => {
          setValor(_array[0].total.toString());
          console.log(_array[0].total.toString());
        }
      );
    });
  }, []);

  return (
    <View style={styles.telaPagamento}>
      <Text style={styles.pagamento}>Pagamento do Produto </Text>
      <Picker selectedValue={tipo} mode="dropdown" onValueChange={setTipo}>
        <Picker.Item label="Boleto" value="Boleto" />
        <Picker.Item label="Crédito" value="Crédito" />
        <Picker.Item label="Débito" value="Débito" />
      </Picker>

      <TextInput
        placeholder="Descrição do pagamento"
        value={descricao}
        onChangeText={(value) => setDescricao(value)}
      />
      <Text style={styles.valor}>Valor da Compra:</Text>
      <TextInput
        keyboardType="decimal-pad"
        placeholder="R$ 00"
        value={valor}
        onChangeText={(value) => setValor(value)}
      />
      <Text style={styles.parcelas}>Selecione as parcelas</Text>
      <Picker
        selectedValue={parcelas}
        mode="dropdown"
        onValueChange={(parcelas) => {
          setParcelas(parcelas);
          setVParcelas((parseFloat(valor) / parcelas).toString());
        }}
      >
        <Picker.Item label="1" value="1" />
        <Picker.Item label="2" value="2" />
        <Picker.Item label="3" value="3" />
        <Picker.Item label="4" value="4" />
        <Picker.Item label="5" value="5" />
        <Picker.Item label="6" value="6" />
        <Picker.Item label="7" value="7" />
        <Picker.Item label="8" value="8" />
        <Picker.Item label="9" value="9" />
        <Picker.Item label="10" value="10" />
      </Picker>
      <Text style={styles.parcelas}>Valor da Parcela</Text>
      <TextInput
        keyboardType="decimal-pad"
        placeholder="R$ 00"
        value={vParcela}
        onChangeText={(value) => setVParcelas(value)}
      />

      <TouchableOpacity
        onPress={() => {
          // passagens de dados do formulário para as variáveis e depois cadastro do pgamento
          idc = idcliente;
          tp = tipo;
          ds = descricao;
          vl = valor;
          qp = parcelas;
          vp = vParcela;
          efetuarPagamento();

          alert ("Pagamento efetuado")
        }}
      >
        <TouchableOpacity
          style={styles.pagar1}
          onPress={() => {
            navigation.navigate("Pagamento");
          }}
        >
          <Text style={styles.pagar2}>Pagar</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );
}
function efetuarPagamento() {
  fetch("http://10.26.45.40/service/pagamento/cadastro.php", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      idcliente: idc,
      tipo: tp,
      descricao: ds,
      valor: vl,
      parcelas: qp,
      valorparcela: vp,
    }),
  })
    .then((response) => response.json())
    .then((resposta) => {
      console.log(resposta);
      alert("Seu pagamento foi efetuado");
    })
    .catch((error) => console.error(error));

  limparCarrinho();
}

function limparCarrinho() {
  db.transaction((tx) => {
    tx.executeSql("delete from itens");
  });
}

const styles = StyleSheet.create({
telaPagamento:{
},
pagamento:{
  fontSize:16
},
valor:{
  fontSize:16
},
parcelas:{
  fontSize:16
},
pagar1: {
  margin: 10,
  paddingVertical: 5,
  paddingHorizontal: 52,
  alignItems: "center"
},
pagar2: {
  backgroundColor: "black",
  fontSize: 15,
  fontWeight: "bold",
  paddingVertical: 10,
  paddingHorizontal: 35,
  borderRadius: 20,
  margin: 1,
  color: "#ffffff"
},
})
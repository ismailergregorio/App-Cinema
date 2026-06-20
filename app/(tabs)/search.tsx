import Cartaz from "@/src/components/cartaz";
import Header from "@/src/components/header";
import api from "@/src/services/api";
import apiFilmes from "@/src/services/apiFilmes";
import { Filme } from "@/src/types/types";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, TextInput, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Search() {
  const [repostaPesquisa, setRespostaPesquisa] = useState<Filme[]>([]);
  async function buscarFilme(p?: string) {
    try {
      const response = await apiFilmes.get(`/filmes/search/${p}`);
      setRespostaPesquisa(response.data);
    } catch (erro) {
      console.log(erro);
    }
  }
  const [lancamentos, setLancamentos] = useState<Filme[]>([]);
  async function lancamentosFilmes() {
    try {
      const resposta = await apiFilmes.get("/filmes/maisVistos");

      setLancamentos(resposta.data);
    } catch (error: any) {
      Alert.alert(
        "Erro",
        `Ocorreu um erro na Buscas dos dados.${error.message}`,
      );
    }
  }
  useEffect(() => {
    buscarFilme();
    lancamentosFilmes();
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: "#030d16" }]}>
      <LinearGradient
        colors={["#173046", "#08131d", "#030d16"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <Header />
        <View style={styles.inputContainer}>
          <Ionicons name="search" size={24} color="#fff" />

          <TextInput
            placeholder="Pesquisar..."
            placeholderTextColor="#aaa"
            style={styles.input}
            onChangeText={(e) => buscarFilme(e)}
          />
        </View>
        <ScrollView contentContainerStyle={styles.resultadoPesquisa}>
          {repostaPesquisa && repostaPesquisa.length > 0
            ? repostaPesquisa.map((filme, index) => (
                <Cartaz key={index} filme={filme} />
              ))
            : lancamentos.map((filme, index) => (
                <Cartaz key={index} filme={filme} />
              ))}
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",

    backgroundColor: "#1b2631",

    margin: 10,

    borderRadius: 15,

    paddingHorizontal: 15,

    height: 55,
  },

  input: {
    flex: 1,

    color: "#fff",

    marginLeft: 10,

    fontSize: 16,
  },

  resultadoPesquisa: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 2,
    paddingHorizontal: 8,
  },
});

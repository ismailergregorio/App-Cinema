import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import api from "../services/api";
import { Filme } from "../types/types";
import Cartaz from "./cartaz";
import apiFilmes from "../services/apiFilmes";

export default function SectionTema({
  categoria,
  nome,
}: {
  categoria?: number;
  nome: string;
}) {
  const [filmes, setFilmes] = useState<Filme[]>([]);

  async function buscarFilmes() {
    try {
      const response = await apiFilmes.get(`/filmes/categoria/${categoria}`, {
        params: {
          language: "pt-BR",
        },
      });
      console.log(response.data);
      setFilmes(response.data);
    } catch (erro) {
      console.log(erro);
    }
  }

  useEffect(() => {
    buscarFilmes();
  }, []);

  return (
    <View style={styles.tema}>
      <Text style={styles.textLabel}>{nome}</Text>

      <ScrollView
        horizontal
        pagingEnabled={false}
        contentContainerStyle={styles.cartazes}
      >
        {filmes &&
          filmes.map((filme, index) => <Cartaz key={index} filme={filme} />)}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  tema: {
    marginTop: 20,
    marginHorizontal: 10,
  },

  cartazes: {
    // paddingHorizontal: 10,
    alignItems: "center",
    gap: 5,
  },

  textLabel: {
    fontSize: 18,
    color: "#fff",
    marginBottom: 10,
    fontWeight: "bold",
  },
});

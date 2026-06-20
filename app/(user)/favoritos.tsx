import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { router, Stack } from "expo-router";

import React, { useContext, useEffect, useState } from "react";

import { useHeaderHeight } from "@react-navigation/elements";

import api from "@/src/services/api";

import { Filme } from "@/src/types/types";

import Cartaz from "@/src/components/cartaz";
import { AuthContext } from "@/src/contexts/userContexts";
import apiFilmes from "@/src/services/apiFilmes";
import { Ionicons } from "@expo/vector-icons";

type Categoria = {
  id: number;
  name: string;
};

type Favoritos = {
  id: string;
  filmeId: string;
  usuarioId: string;
  dataCriacao: string;
  dataAtualizacao: string;
};

export default function CategoriaPage() {
  const { usuario, setUsuario } = useContext(AuthContext);

  useEffect(() => {
    if (!usuario) {
      router.replace("/");
    }
  }, [usuario]);

  const headerHeight = useHeaderHeight();

  const [filmes, setFilmes] = useState<Filme[]>([]);

  const [categoria, setCategoria] = useState<Categoria | null>(null);

  const [loading, setLoading] = useState(true);

  async function BuscarListaFavoritos() {
    try {
      const resposta = await apiFilmes.get<Favoritos[]>(
        `/favoritos/listFavoritosUsuario/${usuario?.id}`,
      );

      console.log(resposta.data);

      if (resposta.data.length > 0) {
        const listaFilmes = resposta.data.map((favorito) =>
          BuscarFilme(favorito.filmeId),
        );

        const filmesData = await Promise.all(listaFilmes);

        setFilmes(filmesData.filter(Boolean));
      }
    } catch (error) {
      console.error("Erro ao buscar favoritos:", error);
    }
  }

  async function BuscarFilme(id: string) {
    try {
      const reposta = await apiFilmes.get(`/filmes/${id}`);
      return reposta.data;
    } catch (error) {
      return;
    }
  }

  useEffect(() => {
    BuscarListaFavoritos().then(() => setLoading(false));
  }, []);

  // Loading
  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTransparent: true,
          headerTintColor: "#fff",
          title: "Favoritos",

          headerLeft: () => (
            <TouchableOpacity
              style={{ marginLeft: 10 }}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={23} color="#fff" />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: headerHeight,
          },
        ]}
      >
        {/* Título */}
        <Text style={styles.title}>{categoria?.name}</Text>

        {/* Lista de Filmes */}
        <View style={styles.listaFilmes}>
          {filmes.map((filme) => (
            <Cartaz key={filme.id} filme={filme} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#030d16",
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: "#030d16",
    justifyContent: "center",
    alignItems: "center",
  },

  container: {
    flex: 1,
  },

  content: {
    // paddingHorizontal: 20,
    // paddingBottom: 40,
  },

  title: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 25,
  },

  listaFilmes: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 2,
    paddingHorizontal: 8,
  },
});

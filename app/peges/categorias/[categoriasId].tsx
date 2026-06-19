import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { router, Stack, useLocalSearchParams } from "expo-router";

import React, { useEffect, useState } from "react";

import { useHeaderHeight } from "@react-navigation/elements";

import api from "@/src/services/api";

import { Filme } from "@/src/types/types";

import Cartaz from "@/src/components/cartaz";
import { Ionicons } from "@expo/vector-icons";
import apiFilmes from "@/src/services/apiFilmes";

type Categoria = {
  id: number;
  name: string;
};

export default function CategoriaPage() {
  const { categoriasId } = useLocalSearchParams();

  const headerHeight = useHeaderHeight();

  const [filmes, setFilmes] = useState<Filme[]>([]);

  const [categoria, setCategoria] = useState<Categoria | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarDados() {
      try {
        // Buscar categorias
        const respostaCategorias = await apiFilmes.get("/categorias", {
          params: {
            language: "pt-BR",
          },
        });

        // Encontrar categoria atual
        const categoriaEncontrada = respostaCategorias.data.find(
          (item: Categoria) => item.id === Number(categoriasId),
        );

        setCategoria(categoriaEncontrada);

        // Buscar filmes da categoria
        const respostaFilmes = await apiFilmes.get(`/filmes/categoria/${categoriasId}`, {
          params: {
            language: "pt-BR",
          },
        });

        setFilmes(respostaFilmes.data);
      } catch (error: any) {
        Alert.alert("Erro", error?.message || "Erro ao carregar dados.");
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, [categoriasId]);

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
          title: "Categoria",

          headerLeft: () => (
            // <Link href={"/catalogo"} style={{marginRight:5}}>
            // {" "}
            <TouchableOpacity
              style={{ marginLeft: 10 }}
              onPress={() => router.push("/catalogo")}
            >
              <Ionicons name="arrow-back" size={23} color="#fff" />
            </TouchableOpacity>
            // </Link>
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

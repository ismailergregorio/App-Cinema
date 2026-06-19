import Header from "@/src/components/header";
import { LinearGradient } from "expo-linear-gradient";
import { Alert, StyleSheet, Text, TouchableOpacity } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

import api from "@/src/services/api";
import { Categorias } from "@/src/types/types";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import apiFilmes from "@/src/services/apiFilmes";

export default function Catalogo() {
  const [categorias, setCategorias] = useState<Categorias[]>([]);

  async function categoriasFilmes() {
    try {
      const resposta = await apiFilmes.get("/categorias", {
        params: {
          language: "pt-BR",
        },
      });

      setCategorias(resposta.data);
    } catch (error: any) {
      Alert.alert(
        "Erro",
        `Ocorreu um erro na Buscas dos dados.${error.message}`,
      );
    }
  }
  useEffect(() => {
    categoriasFilmes();
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
        <Text style={styles.categoria}>Categorias</Text>
        <ScrollView showsHorizontalScrollIndicator={false}>
          {categorias?.map((categoria, index) => (
            // <Link key={index} href={`/peges/categorias/${categoria.id}`} asChild>
            <TouchableOpacity
              key={index}
              onPress={() => router.push(`/peges/categorias/${categoria.id}`)}
              style={{
                backgroundColor: "rgba(255,255,255,0.08)",
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderRadius: 20,
                margin: 2,
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: "600",
                  textAlign: "center",
                }}
              >
                {categoria.name}
              </Text>
            </TouchableOpacity>
            // </Link>
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

  content: {
    paddingTop: 10,
    paddingBottom: 30,
  },

  categoria: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#ffff",
    marginBottom: 5,
  },
});

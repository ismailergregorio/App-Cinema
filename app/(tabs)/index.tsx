import AnimarCard from "@/src/components/animarCard";
import Buton from "@/src/components/Buton";
import DataCarousel from "@/src/components/dataCarousel";
import Header from "@/src/components/header";
import SectionTema from "@/src/components/sectionTemas";
import api from "@/src/services/api";
import apiFilmes from "@/src/services/apiFilmes";
import { Categorias, Filme } from "@/src/types/types";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { Alert, Dimensions, ScrollView, StyleSheet, View } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { SafeAreaView } from "react-native-safe-area-context";

const width = Dimensions.get("window").width;

// Lista de categoris e seu id:
// | Categoria         | ID    |
// | ----------------- | ----- |
// | Ação              | 28    |
// | Aventura          | 12    |
// | Animação          | 16    |
// | Comédia           | 35    |
// | Crime             | 80    |
// | Documentário      | 99    |
// | Drama             | 18    |
// | Família           | 10751 |
// | Fantasia          | 14    |
// | História          | 36    |
// | Terror            | 27    |
// | Música            | 10402 |
// | Mistério          | 9648  |
// | Romance           | 10749 |
// | Ficção Científica | 878   |
// | Thriller          | 53    |

export default function HomePage() {
  const [categorias, setCategorias] = useState<Categorias[]>([]);
  const [categorias2, setCategorias2] = useState<Categorias[]>([]);
  const [lancamentos, setLancamentos] = useState<Filme[]>([]);

  const listaCategorias = [28, 16, 35];
  const listaCategorias2 = [53, 10749, 10402];

  async function lancamentosFilmes() {
    try {
      const resposta = await apiFilmes.get("/filmes/maisvistosuser");

      setLancamentos(resposta.data);
    } catch (error: any) {
      Alert.alert(
        "Erro",
        `Ocorreu um erro na Buscas dos dados.${error.message}`,
      );
    }
  }

  async function categoriasFilmes() {
    try {
      const resposta = await apiFilmes.get("/categorias", {
        params: {
          language: "pt-BR",
        },
      });

      const categoriasFinais = resposta.data.filter((c: any) =>
        listaCategorias.some((cc) => cc === c.id),
      );

      const categoriasFinais2 = resposta.data.filter((c: any) =>
        listaCategorias2.some((cc) => cc === c.id),
      );

      setCategorias(categoriasFinais);
      setCategorias2(categoriasFinais2);
    } catch (error: any) {
      Alert.alert(
        "Erro",
        `Ocorreu um erro na Buscas dos dados.${error.message}`,
      );
    }
  }

  useEffect(() => {
    lancamentosFilmes();
    categoriasFilmes();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#030d16" }}>
      <LinearGradient
        colors={["#173046", "#08131d", "#030d16"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <Header />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categorias}
          >
            {categorias?.map((categoria, index) => (
              <Buton
                key={index}
                text={categoria.name}
                color="rgba(255,255,255,0.08)"
              />
            ))}
          </ScrollView>

          <View style={styles.carouselContainer}>
            <Carousel
              loop
              width={width}
              height={250}
              autoPlay={true}
              autoPlayInterval={5000}
              scrollAnimationDuration={1000}
              data={lancamentos}
              renderItem={({ item }) => <DataCarousel filme={item} />}
            />
          </View>
          {categorias &&
            categorias.map((element, index) => (
              <SectionTema
                key={index}
                categoria={element.id}
                nome={element.name}
              />
            ))}
          <AnimarCard />
          {categorias2 &&
            categorias2.map((element, index) => (
              <SectionTema
                key={index}
                categoria={element.id}
                nome={element.name}
              />
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

  categorias: {
    paddingHorizontal: 5,
    gap: 5,
    marginBottom: 10,
  },

  carouselContainer: {
    alignItems: "center",
  },
});

import React, { useContext, useEffect, useState } from "react";

import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { router } from "expo-router";
import Carousel from "react-native-reanimated-carousel";

import api from "../services/api";
import { Filme } from "../types/types";
import apiFilmes from "../services/apiFilmes";
import { AuthContext } from "../contexts/userContexts";

const { width } = Dimensions.get("window");

export default function AnimarCard() {
  const [filmes, setFilmes] = useState<Filme[]>([]);
  const { usuario, setUsuario } = useContext(AuthContext);

  async function buscaLancamentos() {
    try {
      const resposta = await apiFilmes.get(`/filmes/recomendados/${usuario?.id}`, {
        params: {
          language: "pt-BR",
          // sort_by: "primary_release_date.desc",
          // "primary_release_date.gte": primeiroDia,
          // "primary_release_date.lte": ultimoDiaMes,
          // page: 1,
        },
      });
      console.log("Resposta da API de filmes recomendados:", resposta.data);

      setFilmes(resposta.data);
    } catch (error) {
      console.log("Erro ao buscar lançamentos:", error);
    }
  }

  useEffect(() => {
    buscaLancamentos();
  }, []);

  function abrirDetalhes(filme: Filme) {
    router.push({
      pathname: `./peges/conteudo/${filme.id}`,
      params: {
        id: filme.id,
      },
    });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Recomendados para Você por seus Favoritos</Text>

      <Carousel
        loop
        width={width}
        height={420}
        data={filmes}
        style={{
          width,
          height: 400,
        }}
        pagingEnabled
        snapEnabled
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.85,
          parallaxScrollingOffset: width * 0.4,
        }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image
              source={{
                uri: item.backdropPath
                  ? `https://image.tmdb.org/t/p/original${item.backdropPath}`
                  : `https://image.tmdb.org/t/p/w780${item.posterPath}`,
              }}
              style={styles.image}
              resizeMode="cover"
            />

            <View style={styles.overlay}>
              <Text numberOfLines={2} style={styles.movieTitle}>
                {item.title}
              </Text>

              <TouchableOpacity
                style={styles.button}
                onPress={() => abrirDetalhes(item)}
              >
                <Text style={styles.buttonText}>Ver Detalhes</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    marginBottom: 20,
  },

  sectionTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginLeft: 15,

    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: {
      width: 1,
      height: 1,
    },
    textShadowRadius: 5,
  },

  card: {
    flex: 1,
    borderRadius: 20,
    overflow: "hidden",
    marginHorizontal: 10,
  },

  image: {
    width: "100%",
    height: "100%",
  },

  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,

    padding: 20,

    backgroundColor: "rgba(0,0,0,0.65)",

    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },

  movieTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",

    textShadowColor: "#000",
    textShadowOffset: {
      width: 1,
      height: 1,
    },
    textShadowRadius: 8,
  },

  button: {
    marginTop: 12,
    alignSelf: "flex-start",

    backgroundColor: "#173046",

    paddingHorizontal: 20,
    paddingVertical: 10,

    borderRadius: 12,
  },

  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});

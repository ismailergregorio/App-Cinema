import React, { useState } from "react";

import {
  ActivityIndicator,
  Dimensions,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { router } from "expo-router";

import post_Filme from "../services/api_post_filem";
import { Filme } from "../types/types";

export default function Cartaz({ filme }: { filme: Filme }) {
  const [loadingImage, setLoadingImage] = useState(true);

  if (!filme) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <TouchableOpacity
      onPress={() => router.push(`/peges/conteudo/${filme.id}`)}
    >
      <View style={styles.container}>
        {loadingImage && (
          <View style={styles.imageLoading}>
            <ActivityIndicator size="small" color="#fff" />
          </View>
        )}

        <ImageBackground
          source={{
            uri: post_Filme(filme.posterPath),
          }}
          style={[
            styles.image,
            {
              opacity: loadingImage ? 0 : 1,
            },
          ]}
          resizeMode="cover"
          onLoadStart={() => setLoadingImage(true)}
          onLoadEnd={() => setLoadingImage(false)}
          onError={() => setLoadingImage(false)}
        >
          <Text style={styles.title}>{filme.original_title}</Text>
        </ImageBackground>
      </View>
    </TouchableOpacity>
  );
}

const larguraTela = Dimensions.get("window").width;
const tamanhoCard = (larguraTela - 30) / 3;

const styles = StyleSheet.create({
  container: {
    width: tamanhoCard,
    position: "relative",
  },

  image: {
    height: 200,
    justifyContent: "flex-end",
    padding: 10,
  },

  imageLoading: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,

    justifyContent: "center",
    alignItems: "center",

    zIndex: 10,
  },

  title: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",

    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: {
      width: 1,
      height: 1,
    },
    textShadowRadius: 4,
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: "#030d16",
    justifyContent: "center",
    alignItems: "center",
  },
});

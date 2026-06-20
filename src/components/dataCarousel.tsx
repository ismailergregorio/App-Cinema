import React, { useRef, useState } from "react";
import {
  Animated,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import post_Filme from "../services/api_post_filem";
import { Filme } from "../types/types";

type Props = {
  filme: Filme;
};

export default function DataCarousel({ filme }: Props) {
  const slideAnim = useRef(new Animated.Value(300)).current;
  const [status, setStatus] = useState(false);

  function abrirContainer() {
    setStatus(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }

  function fecharContainer() {
    setStatus(false);
    Animated.timing(slideAnim, {
      toValue: 300,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }

  return (
    <View style={styles.container}>
      {/* Banner */}
      <ImageBackground
        source={{ uri: post_Filme(filme.backdropPath) }}
        style={styles.image}
        imageStyle={styles.imageBorder}
      >
        <View style={styles.overlay}>
          <Text style={styles.title}>{filme.title}</Text>

          <TouchableOpacity style={styles.btn} onPress={abrirContainer}>
            <Text style={styles.btnText}>Ver</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>

      {/* Container animado */}
      {status && (
        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          <ImageBackground
            source={{ uri: post_Filme(filme.backdropPath) }}
            style={styles.modalBanner}
            imageStyle={styles.modalBannerImage}
          >
            <View style={styles.modalOverlay}>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={fecharContainer}
              >
                <Text style={styles.closeText}>Fechar</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>{filme.title}</Text>
              <Text style={styles.modalDescription}>{filme.overview}</Text>
            </View>
          </ImageBackground>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },

  image: {
    width: "100%",
    height: 250,
    justifyContent: "flex-end",
  },

  imageBorder: {
    borderRadius: 12,
  },

  overlay: {
    padding: 15,
    backgroundColor: "rgba(0,0,0,0.4)",
  },

  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },

  btn: {
    backgroundColor: "#173046",
    marginTop: 15,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    width: 40,
    height: 14,
    alignContent: "center",
    justifyContent: "center",
  },

  btnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 10,
  },

  /* Painel */
  modalContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "100%",
    overflow: "hidden",
    // borderTopLeftRadius: 25,
    // borderTopRightRadius: 25,
  },

  modalBanner: {
    flex: 1,
  },

  modalBannerImage: {
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.75)",
    padding: 10,
    justifyContent: "center",
  },

  modalTitle: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 5,
  },

  modalDescription: {
    color: "#fff",
    fontSize: 14,
    maxHeight: 100,
    overflow: "scroll",
  },

  closeBtn: {
    position: "absolute",
    top: 15,
    right: 15,
    backgroundColor: "#173046",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },

  closeText: {
    color: "#fff",
  },
});

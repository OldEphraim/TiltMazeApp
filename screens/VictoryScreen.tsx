import React, { useEffect, useRef } from "react";
import {
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Share,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { RootStackParamList } from "../types/navigation"; 

type Props = NativeStackScreenProps<RootStackParamList, "Victory">;

export default function VictoryScreen({ route, navigation }: Props) {
  const difficulty = route.params?.difficulty || 5;
  const level = Math.floor((difficulty - 3) / 2);

  const secondsElapsed = route.params?.time ?? 5 * level + 2;

  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 60,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleNextLevel = () => {
    navigation.replace("Maze", { difficulty: difficulty + 2 });
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `I just beat Level ${level} in ${secondsElapsed}s in Alan Garber's Tilt Maze! You should hire him to be an iOS Developer!`,
      });
    } catch (error) {
      console.error("Share failed:", error);
    }
  };

  return (
    <LinearGradient
      colors={["#0f0c29", "#302b63", "#24243e"]}
      style={styles.container}
    >
      <Animated.View style={[styles.messageBox, { transform: [{ scale: scaleAnim }] }]}>
        <Text style={styles.title}>🎉 Victory!</Text>
        <Text style={styles.subtitle}>
          You completed Level {level} in {secondsElapsed} seconds!
        </Text>

        <Pressable style={styles.button} onPress={handleNextLevel}>
          <Text style={styles.buttonText}>Play Next Level</Text>
        </Pressable>

        <Pressable style={[styles.button, styles.secondaryButton]} onPress={handleShare}>
          <Text style={styles.buttonText}>Share Win</Text>
        </Pressable>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  messageBox: {
    alignItems: "center",
    padding: 30,
    marginHorizontal: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 20,
    shadowColor: "#0ff",
    shadowOpacity: 0.6,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
  },
    title: {
    fontSize: 48,
    color: "#00ffcc",
    fontWeight: "bold",
    textShadowColor: "#0ff",
    textShadowRadius: 12,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    color: "#fff",
    textAlign: "center",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#00f0ff",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 12,
    marginTop: 10,
    shadowColor: "#0ff",
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  secondaryButton: {
    backgroundColor: "#ff00cc",
  },
  buttonText: {
    color: "#000",
    fontWeight: "700",
    fontSize: 16,
  },
});

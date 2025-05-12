import React, { useEffect, useState, useRef } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  Vibration,
  Animated,
} from "react-native";
import { Accelerometer } from "expo-sensors";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { generateMaze } from "../utils/generateMaze";
import { LinearGradient } from "expo-linear-gradient";
import { RootStackParamList } from "../types/navigation";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

type MazeRouteProp = RouteProp<RootStackParamList, "Maze">;
type MazeNavigationProp = NativeStackNavigationProp<RootStackParamList, "Maze">;

export default function MazeScreen() {
  const navigation = useNavigation<MazeNavigationProp>();
  const route = useRoute<MazeRouteProp>();
  const difficulty = route.params?.difficulty || 5;

  const level = Math.floor((difficulty - 3) / 2);
  
  const [maze, setMaze] = useState<number[][]>([]);
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 0 });
  const [countdown, setCountdown] = useState(3);
  const [showOverlay, setShowOverlay] = useState(true);
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const animatedX = useRef(new Animated.Value(0)).current;
  const animatedY = useRef(new Animated.Value(0)).current;
  const lastMove = useRef(Date.now());

  const AVAILABLE_HEIGHT = SCREEN_HEIGHT - 150;
  const AVAILABLE_WIDTH = SCREEN_WIDTH - 20;
  const cellSize = Math.floor(
    Math.min(AVAILABLE_WIDTH, AVAILABLE_HEIGHT) / difficulty
  );

  useEffect(() => {
    const newMaze = generateMaze(difficulty, difficulty);
    setMaze(newMaze);
    setPlayerPos({ x: 0, y: 0 });
    animatedX.setValue(0);
    animatedY.setValue(0);
    setSecondsElapsed(0);
  }, [difficulty]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    } else if (countdown === 0) {
      Vibration.vibrate(100);
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }).start(() => {
        setShowOverlay(false);
      });
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  useEffect(() => {
    if (countdown > 0) return;
    const interval = setInterval(() => {
      setSecondsElapsed((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [countdown]);

  useEffect(() => {
    Accelerometer.setUpdateInterval(100);
    const sub = Accelerometer.addListener(({ x, y }) => {
      if (countdown > 0) return;
  
      const now = Date.now();
      if (now - lastMove.current < 150) return;
  
      let dx = 0;
      let dy = 0;
  
      // 🔥 Max sensitivity with diagonal filtering
      const absX = Math.abs(x);
      const absY = Math.abs(y);
      const threshold = 0.01;
  
      if (absX > threshold || absY > threshold) {
        if (absX > absY) {
          dx = x > 0 ? 1 : -1;
        } else {
          dy = y < 0 ? 1 : -1; // forward tilt = down
        }
        tryMove(dx, dy);
        lastMove.current = now;
      }
    });
  
    return () => sub.remove();
  }, [playerPos, maze, countdown]);
  
  const tryMove = (dx: number, dy: number) => {
    const newX = playerPos.x + dx;
    const newY = playerPos.y + dy;

    if (
      newX >= 0 &&
      newX < difficulty &&
      newY >= 0 &&
      newY < difficulty &&
      maze[newY][newX] === 0
    ) {
      setPlayerPos({ x: newX, y: newY });

      Animated.timing(animatedX, {
        toValue: newX * cellSize,
        duration: 100,
        useNativeDriver: false,
      }).start();
      Animated.timing(animatedY, {
        toValue: newY * cellSize,
        duration: 100,
        useNativeDriver: false,
      }).start();

      if (newX === difficulty - 1 && newY === difficulty - 1) {
        setTimeout(() => {
          navigation.replace("Victory", { difficulty, time: secondsElapsed });
        }, 300);
      }
    }
  };

  return (
    <LinearGradient
      colors={["#0f0c29", "#302b63", "#24243e"]}
      style={styles.container}
    >
      <View style={styles.topBar}>
        <Text style={styles.levelText}>Level {level}</Text>
        <Text style={styles.timerText}>Time: {secondsElapsed}s</Text>
      </View>

      <View style={styles.mazeWrapper}>
        {/* Draw Maze Grid */}
        {maze.map((row, rowIndex) => (
          <View key={rowIndex} style={{ flexDirection: "row" }}>
            {row.map((cell, colIndex) => {
              const isGoal =
                colIndex === difficulty - 1 && rowIndex === difficulty - 1;
              return (
                <View
                  key={`${rowIndex}-${colIndex}`}
                  style={[
                    {
                      width: cellSize,
                      height: cellSize,
                      backgroundColor: cell === 1 ? "#111" : "#eee",
                      borderWidth: 1,
                      borderColor: "#444",
                    },
                    isGoal && styles.goal,
                  ]}
                />
              );
            })}
          </View>
        ))}

        {/* Animated Player */}
        <Animated.View
          style={[
            styles.player,
            {
              position: "absolute",
              top: animatedY,
              left: animatedX,
              width: cellSize,
              height: cellSize,
            },
          ]}
        />
      </View>

      {showOverlay && (
        <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
          <Text style={styles.countdownText}>
            {countdown === 0 ? "Go!" : countdown}
          </Text>
        </Animated.View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  mazeWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  topBar: {
    width: "100%",
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  levelText: {
    fontSize: 20,
    color: "#00ffcc",
    fontWeight: "600",
  },
  timerText: {
    fontSize: 20,
    color: "#ffcc00",
    fontWeight: "600",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  countdownText: {
    fontSize: 72,
    color: "#00ffcc",
    fontWeight: "bold",
    textShadowColor: "#0ff",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  player: {
    backgroundColor: "#00f",
    shadowColor: "#00f",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 10,
  },
  goal: {
    backgroundColor: "#0f0",
    shadowColor: "#0f0",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 10,
  },
});

import { Text, StyleSheet, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { RootStackParamList } from "../types/navigation";

type Props = NativeStackScreenProps<RootStackParamList, 'Intro'>;

export default function IntroScreen({ navigation }: Props) {
  const handleStart = () => {
    navigation.navigate("Maze", { difficulty: 5 });
  };

  return (
    <LinearGradient
      colors={['#0f0c29', '#302b63', '#24243e']}
      style={styles.container}
    >
      <Text style={styles.title}>Tilt Maze</Text>

      <Pressable style={({ pressed }) => [
        styles.button,
        pressed && { transform: [{ scale: 0.97 }] }
      ]} onPress={handleStart}>
        <Text style={styles.buttonText}>Start Game</Text>
      </Pressable>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 48,
    color: '#00ffcc',
    fontWeight: 'bold',
    marginBottom: 40,
    textShadowColor: '#0ff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  button: {
    backgroundColor: '#00f0ff',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 12,
    elevation: 5,
    shadowColor: '#0ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
  },
  buttonText: {
    color: '#000',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 1,
  },
});
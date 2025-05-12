import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import IntroScreen from "./screens/IntroScreen";
import MazeScreen from "./screens/MazeScreen";
import VictoryScreen from "./screens/VictoryScreen";
import { RootStackParamList } from "./types/navigation";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Intro"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Intro" component={IntroScreen} />
        <Stack.Screen name="Maze" component={MazeScreen} />
        <Stack.Screen name="Victory" component={VictoryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

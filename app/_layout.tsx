import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "../components/AuthProvider";
import { useTheme } from "../lib/theme";

function RootStack() {
  const t = useTheme();
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: t.card },
        headerTintColor: t.text,
        headerTitleStyle: { fontWeight: "700" },
        contentStyle: { backgroundColor: t.bg },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Ankylosing Spondylitis" }} />
      <Stack.Screen name="welcome" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ title: "Sign in" }} />
      <Stack.Screen name="learn" options={{ title: "Learn" }} />
      <Stack.Screen name="basdai" options={{ title: "BASDAI" }} />
      <Stack.Screen name="basfi" options={{ title: "BASFI" }} />
      <Stack.Screen name="history" options={{ title: "History" }} />
    </Stack>
  );
}

export default function RootLayout() {
  const t = useTheme();
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <RootStack />
        <StatusBar style={t.dark ? "light" : "dark"} />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

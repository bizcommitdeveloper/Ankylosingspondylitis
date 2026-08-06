import { useEffect, useState } from "react";
import { ScrollView, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../components/AuthProvider";
import { Button, Card } from "../components/ui";
import { useTheme } from "../lib/theme";

WebBrowser.maybeCompleteAuthSession();

function readableAuthError(err: unknown): string {
  const code = typeof err === "object" && err && "code" in err ? String((err as { code: unknown }).code) : "";
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Incorrect email or password.";
    case "auth/email-already-in-use":
      return "An account already exists for that email. Try signing in.";
    case "auth/weak-password":
      return "Please choose a password of at least 6 characters.";
    case "auth/invalid-email":
      return "That doesn't look like a valid email address.";
    default:
      return err instanceof Error ? err.message : "Something went wrong. Please try again.";
  }
}

export default function LoginScreen() {
  const t = useTheme();
  const router = useRouter();
  const { user, loading, configured, googleConfigured, signInWithEmail, registerWithEmail, signInWithGoogleIdToken } = useAuth();

  const [mode, setMode] = useState<"signin" | "register">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
  });

  useEffect(() => {
    if (!loading && user) router.replace("/");
  }, [loading, user, router]);

  useEffect(() => {
    if (response?.type === "success" && response.params?.id_token) {
      setBusy(true);
      setError(null);
      signInWithGoogleIdToken(response.params.id_token).catch((err) => {
        setError(readableAuthError(err));
        setBusy(false);
      });
    }
  }, [response, signInWithGoogleIdToken]);

  async function handleEmail() {
    setBusy(true);
    setError(null);
    try {
      if (mode === "register") await registerWithEmail(email, password);
      else await signInWithEmail(email, password);
    } catch (err) {
      setError(readableAuthError(err));
      setBusy(false);
    }
  }

  const inputStyle = {
    borderColor: t.border,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 11,
    color: t.text,
    backgroundColor: t.card,
    fontSize: 15,
  } as const;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: t.bg }} contentContainerStyle={{ padding: 20, gap: 12 }} keyboardShouldPersistTaps="handled">
      <View style={{ alignItems: "center", marginBottom: 8 }}>
        <View style={{ width: 52, height: 52, borderRadius: 14, backgroundColor: t.brand, alignItems: "center", justifyContent: "center" }}>
          <Ionicons name="body" size={26} color={t.onBrand} />
        </View>
        <Text style={{ color: t.text, fontSize: 22, fontWeight: "800", marginTop: 10 }}>Ankylosing Spondylitis</Text>
        <Text style={{ color: t.subtext, fontSize: 13, marginTop: 2, textAlign: "center" }}>
          Sign in to track your BASDAI and BASFI scores over time.
        </Text>
      </View>

      {!configured ? (
        <Card style={{ backgroundColor: t.tones.moderate.bg }}>
          <Text style={{ color: t.tones.moderate.fg, fontSize: 13, lineHeight: 19 }}>
            Firebase isn&apos;t configured yet. Set the EXPO_PUBLIC_FIREBASE_* variables (see .env.example) to enable sign-in.
          </Text>
        </Card>
      ) : (
        <>
          {googleConfigured ? (
            <Button
              title="Continue with Google"
              variant="secondary"
              disabled={!request || busy}
              onPress={() => promptAsync()}
            />
          ) : null}

          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            placeholderTextColor={t.muted}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            style={inputStyle}
          />
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            placeholderTextColor={t.muted}
            secureTextEntry
            autoComplete="password"
            style={inputStyle}
          />

          <Button title={mode === "register" ? "Create account" : "Sign in"} onPress={handleEmail} loading={busy} />

          <Text
            onPress={() => {
              setMode(mode === "register" ? "signin" : "register");
              setError(null);
            }}
            style={{ color: t.brand, fontWeight: "600", fontSize: 14, textAlign: "center", marginTop: 4 }}
          >
            {mode === "register" ? "Already have an account? Sign in" : "New here? Create an account"}
          </Text>
        </>
      )}

      {error ? (
        <View style={{ backgroundColor: t.tones.high.bg, borderRadius: 10, padding: 12 }}>
          <Text style={{ color: t.tones.high.fg, fontSize: 13 }}>{error}</Text>
        </View>
      ) : null}

      <Text onPress={() => router.push("/learn")} style={{ color: t.muted, fontSize: 13, textAlign: "center", marginTop: 8 }}>
        New here? See what these scores mean →
      </Text>
    </ScrollView>
  );
}

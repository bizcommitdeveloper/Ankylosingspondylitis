import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
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
    case "auth/account-exists-with-different-credential":
      return "An account already exists with that email using a different sign-in method.";
    case "auth/network-request-failed":
      return "Network error. Check your connection and try again.";
    default:
      return err instanceof Error ? err.message : "Sign-in failed. Please try again.";
  }
}

export default function LoginScreen() {
  const t = useTheme();
  const router = useRouter();
  const { user, loading, configured, googleConfigured, signInWithGoogleIdToken } = useAuth();

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
    } else if (response?.type === "error") {
      setError("Google sign-in was cancelled or failed.");
      setBusy(false);
    }
  }, [response, signInWithGoogleIdToken]);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: t.bg }} contentContainerStyle={{ padding: 20, gap: 14 }} keyboardShouldPersistTaps="handled">
      <View style={{ alignItems: "center", marginBottom: 8 }}>
        <View style={{ width: 52, height: 52, borderRadius: 14, backgroundColor: t.brand, alignItems: "center", justifyContent: "center" }}>
          <Ionicons name="body" size={26} color={t.onBrand} />
        </View>
        <Text style={{ color: t.text, fontSize: 22, fontWeight: "800", marginTop: 10 }}>Ankylosing Spondylitis</Text>
        <Text style={{ color: t.subtext, fontSize: 13, marginTop: 2, textAlign: "center" }}>
          Sign in with Google to track your BASDAI and BASFI scores over time.
        </Text>
      </View>

      {!configured ? (
        <Card style={{ backgroundColor: t.tones.moderate.bg }}>
          <Text style={{ color: t.tones.moderate.fg, fontSize: 13, lineHeight: 19 }}>
            Firebase isn&apos;t configured yet. Set the EXPO_PUBLIC_FIREBASE_* variables (see .env.example) to enable sign-in.
          </Text>
        </Card>
      ) : !googleConfigured ? (
        <Card style={{ backgroundColor: t.tones.moderate.bg }}>
          <Text style={{ color: t.tones.moderate.fg, fontSize: 13, lineHeight: 19 }}>
            Google sign-in isn&apos;t configured yet. Set EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID (and the iOS/Android client
            IDs) — see .env.example.
          </Text>
        </Card>
      ) : (
        <Button
          title={busy ? "Signing in…" : "Continue with Google"}
          onPress={() => {
            setError(null);
            promptAsync();
          }}
          loading={busy}
          disabled={!request}
        />
      )}

      {error ? (
        <View style={{ backgroundColor: t.tones.high.bg, borderRadius: 10, padding: 12 }}>
          <Text style={{ color: t.tones.high.fg, fontSize: 13 }}>{error}</Text>
        </View>
      ) : null}

      <Text onPress={() => router.push("/learn")} style={{ color: t.muted, fontSize: 13, textAlign: "center", marginTop: 8 }}>
        New here? See what these scores mean →
      </Text>

      <Text style={{ color: t.muted, fontSize: 11, textAlign: "center", lineHeight: 16, marginTop: 4 }}>
        We only use your Google account to sign you in. Your entries are private to you.
      </Text>
    </ScrollView>
  );
}

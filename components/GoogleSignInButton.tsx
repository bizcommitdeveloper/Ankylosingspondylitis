import { useEffect, useState } from "react";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { Button } from "./ui";
import { useAuth } from "./AuthProvider";

WebBrowser.maybeCompleteAuthSession();

/**
 * Rendered only when Google sign-in is configured. Keeping the
 * `useIdTokenAuthRequest` hook inside this child means it never runs when the
 * Google client ID is absent — on web that hook throws without a webClientId,
 * so mounting it unconditionally would break the login screen.
 */
export function GoogleSignInButton({ onError }: { onError: (message: string) => void }) {
  const { signInWithGoogleIdToken } = useAuth();
  const [busy, setBusy] = useState(false);

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
  });

  useEffect(() => {
    if (response?.type === "success" && response.params?.id_token) {
      setBusy(true);
      signInWithGoogleIdToken(response.params.id_token).catch((err) => {
        onError(err instanceof Error ? err.message : "Google sign-in failed.");
        setBusy(false);
      });
    }
  }, [response, signInWithGoogleIdToken, onError]);

  return (
    <Button
      title="Continue with Google"
      variant="secondary"
      disabled={!request || busy}
      onPress={() => { onError(""); promptAsync(); }}
    />
  );
}

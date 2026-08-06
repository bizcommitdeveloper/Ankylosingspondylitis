import { ActivityIndicator, Pressable, StyleSheet, Text, View, type ViewStyle } from "react-native";
import { useTheme } from "../lib/theme";
import type { Tone } from "../lib/scoring";

export function Card({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  const t = useTheme();
  return (
    <View
      style={[
        {
          backgroundColor: t.card,
          borderColor: t.border,
          borderWidth: StyleSheet.hairlineWidth,
          borderRadius: 16,
          padding: 18,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary";
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}

export function Button({ title, onPress, variant = "primary", disabled, loading, style }: ButtonProps) {
  const t = useTheme();
  const primary = variant === "primary";
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        {
          backgroundColor: primary ? t.brand : "transparent",
          borderColor: primary ? t.brand : t.border,
          borderWidth: StyleSheet.hairlineWidth,
          borderRadius: 12,
          paddingVertical: 13,
          paddingHorizontal: 18,
          alignItems: "center",
          justifyContent: "center",
          opacity: disabled ? 0.5 : pressed ? 0.85 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={primary ? t.onBrand : t.brand} />
      ) : (
        <Text style={{ color: primary ? t.onBrand : t.text, fontWeight: "700", fontSize: 15 }}>{title}</Text>
      )}
    </Pressable>
  );
}

export function Badge({ tone, label }: { tone: Tone; label: string }) {
  const t = useTheme();
  const c = t.tones[tone];
  return (
    <View style={{ alignSelf: "flex-start", backgroundColor: c.bg, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3 }}>
      <Text style={{ color: c.fg, fontWeight: "700", fontSize: 12 }}>{label}</Text>
    </View>
  );
}

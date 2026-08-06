import { useEffect } from "react";
import { Linking, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../components/AuthProvider";
import { Button, Card } from "../components/ui";
import { useTheme } from "../lib/theme";
import { AS_OVERVIEW, INSTRUMENT_INFO, NOT_ADVICE, SOURCES, TRACKING_BENEFITS } from "../lib/content";

const OVERVIEW_ICONS = ["sunny-outline", "pulse-outline", "walk-outline", "trending-up-outline"] as const;
const BENEFIT_ICONS = ["trending-up-outline", "medkit-outline", "bulb-outline", "lock-closed-outline"] as const;

export default function WelcomeScreen() {
  const t = useTheme();
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) router.replace("/");
  }, [loading, user, router]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }} edges={["top"]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Hero */}
        <View style={{ backgroundColor: t.brandDark, padding: 24, paddingTop: 32, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}>
          <Text style={{ color: "#ffffff", fontSize: 28, fontWeight: "800", lineHeight: 34 }}>
            Track your AS. See the trend. Own your care.
          </Text>
          <Text style={{ color: "#e6fffb", fontSize: 15, marginTop: 12, lineHeight: 22 }}>
            Record the two standard measures — BASDAI and BASFI — in under two minutes. They&apos;re scored automatically
            and charted over time, so you and your clinician can see how you&apos;re really doing.
          </Text>
          <Button title="Get started — it's free" onPress={() => router.push("/login")} variant="secondary" style={{ backgroundColor: "#ffffff", borderColor: "#ffffff", marginTop: 18 }} />
          <Text style={{ color: "#c7fff5", fontSize: 12, marginTop: 12, textAlign: "center" }}>Private by design — your entries are visible only to you.</Text>
        </View>

        <View style={{ padding: 16, gap: 20 }}>
          {/* What is AS */}
          <View>
            <Text style={{ color: t.text, fontSize: 20, fontWeight: "800" }}>{AS_OVERVIEW.title}</Text>
            <Text style={{ color: t.subtext, fontSize: 14, marginTop: 6, lineHeight: 21 }}>{AS_OVERVIEW.summary}</Text>
            <View style={{ gap: 10, marginTop: 12 }}>
              {AS_OVERVIEW.highlights.map((item, i) => (
                <Card key={item.title} style={{ padding: 14 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <Ionicons name={OVERVIEW_ICONS[i % OVERVIEW_ICONS.length]} size={20} color={t.brand} />
                    <Text style={{ color: t.text, fontWeight: "700", fontSize: 15 }}>{item.title}</Text>
                  </View>
                  <Text style={{ color: t.subtext, fontSize: 13, marginTop: 6, lineHeight: 19 }}>{item.body}</Text>
                </Card>
              ))}
            </View>
          </View>

          {/* Two instruments */}
          <View>
            <Text style={{ color: t.text, fontSize: 20, fontWeight: "800" }}>Two trusted measures</Text>
            <Text style={{ color: t.subtext, fontSize: 14, marginTop: 6, lineHeight: 21 }}>
              The same patient-reported scores used in AS clinics worldwide — here on friendly 0–10 sliders.
            </Text>
            <View style={{ gap: 12, marginTop: 12 }}>
              {(["basdai", "basfi"] as const).map((type) => {
                const info = INSTRUMENT_INFO[type];
                return (
                  <Card key={type} style={{ backgroundColor: t.cardAlt }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                      <Ionicons name={type === "basdai" ? "speedometer-outline" : "body-outline"} size={22} color={t.brand} />
                      <View>
                        <Text style={{ color: t.text, fontSize: 17, fontWeight: "800" }}>{info.name}</Text>
                        <Text style={{ color: t.muted, fontSize: 12 }}>{info.tagline}</Text>
                      </View>
                    </View>
                    <Text style={{ color: t.subtext, fontSize: 13, marginTop: 8, lineHeight: 19 }}>{info.measures}</Text>
                    <Text style={{ color: t.muted, fontSize: 12, marginTop: 8 }}>{info.scale}</Text>
                  </Card>
                );
              })}
            </View>
          </View>

          {/* Why track */}
          <View>
            <Text style={{ color: t.text, fontSize: 20, fontWeight: "800" }}>Why tracking helps</Text>
            <View style={{ gap: 12, marginTop: 12 }}>
              {TRACKING_BENEFITS.map((item, i) => (
                <View key={item.title} style={{ flexDirection: "row", gap: 12 }}>
                  <Ionicons name={BENEFIT_ICONS[i % BENEFIT_ICONS.length]} size={20} color={t.brand} style={{ marginTop: 2 }} />
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: t.text, fontWeight: "700", fontSize: 15 }}>{item.title}</Text>
                    <Text style={{ color: t.subtext, fontSize: 13, marginTop: 2, lineHeight: 19 }}>{item.body}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* CTA */}
          <Card style={{ backgroundColor: t.brandDark, alignItems: "center" }}>
            <Text style={{ color: "#ffffff", fontSize: 18, fontWeight: "800" }}>Start tracking in two minutes</Text>
            <Text style={{ color: "#e6fffb", fontSize: 13, textAlign: "center", marginTop: 4, lineHeight: 19 }}>
              Create a free account and record your first BASDAI and BASFI.
            </Text>
            <Button title="Get started" onPress={() => router.push("/login")} variant="secondary" style={{ backgroundColor: "#ffffff", borderColor: "#ffffff", marginTop: 14, alignSelf: "stretch" }} />
          </Card>

          {/* Disclaimer + sources */}
          <View style={{ borderTopColor: t.border, borderTopWidth: 1, paddingTop: 14 }}>
            <Text style={{ color: t.muted, fontSize: 11, lineHeight: 16 }}>{NOT_ADVICE}</Text>
            <Text style={{ color: t.muted, fontSize: 11, fontWeight: "700", marginTop: 10 }}>Sources</Text>
            {SOURCES.map((source) => (
              <Text key={source.url} onPress={() => Linking.openURL(source.url)} style={{ color: t.brand, fontSize: 12, marginTop: 4 }}>
                {source.label}
              </Text>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

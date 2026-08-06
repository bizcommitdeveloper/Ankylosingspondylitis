import { useEffect } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../components/AuthProvider";
import { useEntries } from "../components/useEntries";
import { TrendChart } from "../components/TrendChart";
import { Badge, Button, Card } from "../components/ui";
import { useTheme } from "../lib/theme";
import { INSTRUMENT_INFO } from "../lib/content";
import { severity } from "../lib/scoring";
import type { Entry, InstrumentType } from "../lib/types";

function latestOf(entries: Entry[], type: InstrumentType): Entry | undefined {
  return [...entries].reverse().find((entry) => entry.type === type);
}

function ScoreCard({ type, entry, onNew }: { type: InstrumentType; entry?: Entry; onNew: () => void }) {
  const t = useTheme();
  const info = INSTRUMENT_INFO[type];
  const band = entry ? severity(type, entry.score) : null;
  return (
    <Card style={{ flex: 1 }}>
      <Text style={{ color: t.muted, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5, fontWeight: "700" }}>{info.tagline}</Text>
      <Text style={{ color: t.subtext, fontSize: 13, fontWeight: "600", marginTop: 2 }}>Latest {info.name}</Text>
      {entry ? (
        <>
          <View style={{ flexDirection: "row", alignItems: "baseline", gap: 4, marginTop: 4 }}>
            <Text style={{ color: t.text, fontSize: 28, fontWeight: "800" }}>{entry.score.toFixed(1)}</Text>
            <Text style={{ color: t.muted, fontSize: 13 }}>/ 10</Text>
          </View>
          {band ? (
            <View style={{ marginTop: 4 }}>
              <Badge tone={band.tone} label={band.label} />
            </View>
          ) : null}
          <Text style={{ color: t.muted, fontSize: 11, marginTop: 4 }}>{entry.referenceDate}</Text>
        </>
      ) : (
        <Text style={{ color: t.muted, fontSize: 13, marginTop: 6 }}>No entries yet</Text>
      )}
      <Button title={`New ${info.name}`} onPress={onNew} style={{ marginTop: 12, paddingVertical: 9 }} />
    </Card>
  );
}

function Dashboard() {
  const t = useTheme();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { entries, loading } = useEntries();
  const firstName = user?.displayName?.split(" ")[0] ?? user?.email?.split("@")[0] ?? "there";
  const hasEntries = entries.length > 0;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: t.bg }} contentContainerStyle={{ padding: 16, gap: 14 }}>
      <View>
        <Text style={{ color: t.text, fontSize: 22, fontWeight: "800" }}>Hello, {firstName}</Text>
        <Text style={{ color: t.subtext, fontSize: 13, marginTop: 2 }}>
          Log how you&apos;re doing today, and watch the trend build over time.{" "}
          <Text style={{ color: t.brand, fontWeight: "600" }} onPress={() => router.push("/learn")}>
            New to these scores?
          </Text>
        </Text>
      </View>

      <View style={{ flexDirection: "row", gap: 12 }}>
        <ScoreCard type="basdai" entry={latestOf(entries, "basdai")} onNew={() => router.push("/basdai")} />
        <ScoreCard type="basfi" entry={latestOf(entries, "basfi")} onNew={() => router.push("/basfi")} />
      </View>

      <Card>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <Text style={{ color: t.text, fontSize: 16, fontWeight: "700" }}>Your trend</Text>
          {hasEntries ? (
            <Text style={{ color: t.brand, fontWeight: "600", fontSize: 13 }} onPress={() => router.push("/history")}>
              View history →
            </Text>
          ) : null}
        </View>
        {loading ? (
          <ActivityIndicator color={t.brand} style={{ marginVertical: 30 }} />
        ) : hasEntries ? (
          <TrendChart entries={entries} />
        ) : (
          <View style={{ alignItems: "center", paddingVertical: 24 }}>
            <Text style={{ color: t.text, fontWeight: "600", fontSize: 14 }}>Your chart starts with entry one.</Text>
            <Text style={{ color: t.subtext, fontSize: 13, textAlign: "center", marginTop: 4 }}>
              Fill in a BASDAI and a BASFI to set your baseline, then come back regularly.
            </Text>
          </View>
        )}
      </Card>

      <Pressable onPress={() => logout()} style={{ paddingVertical: 8, alignItems: "center" }}>
        <Text style={{ color: t.muted, fontWeight: "600", fontSize: 13 }}>Sign out</Text>
      </Pressable>
    </ScrollView>
  );
}

export default function HomeScreen() {
  const t = useTheme();
  const router = useRouter();
  const { user, loading, configured } = useAuth();

  useEffect(() => {
    if (!loading && !user) router.replace(configured ? "/welcome" : "/login");
  }, [loading, user, configured, router]);

  if (loading || !user) {
    return (
      <View style={{ flex: 1, backgroundColor: t.bg, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator color={t.brand} />
      </View>
    );
  }
  return <Dashboard />;
}

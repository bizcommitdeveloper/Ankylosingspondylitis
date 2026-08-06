import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { TrendChart } from "../components/TrendChart";
import { useEntries } from "../components/useEntries";
import { Badge, Card } from "../components/ui";
import { useTheme } from "../lib/theme";
import { getInstrument } from "../lib/questions";
import { severity } from "../lib/scoring";
import type { Entry } from "../lib/types";

function EntryRow({ entry, last }: { entry: Entry; last: boolean }) {
  const t = useTheme();
  const instrument = getInstrument(entry.type);
  const band = severity(entry.type, entry.score);
  return (
    <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: 12, borderBottomColor: t.border, borderBottomWidth: last ? 0 : 1 }}>
      <View style={{ width: 90 }}>
        <Text style={{ color: t.text, fontWeight: "700", fontSize: 14 }}>{instrument.title}</Text>
        <Text style={{ color: t.muted, fontSize: 12 }}>{entry.referenceDate}</Text>
      </View>
      <View style={{ width: 56, alignItems: "center" }}>
        <Text style={{ color: t.text, fontWeight: "800", fontSize: 18 }}>{entry.score.toFixed(1)}</Text>
      </View>
      <View style={{ flex: 1, alignItems: "flex-start" }}>
        <Badge tone={band.tone} label={band.label} />
        {entry.note ? <Text numberOfLines={1} style={{ color: t.muted, fontSize: 12, marginTop: 3 }}>{entry.note}</Text> : null}
      </View>
    </View>
  );
}

export default function HistoryScreen() {
  const t = useTheme();
  const { entries, loading, error } = useEntries();
  const newestFirst = [...entries].reverse();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: t.bg }} contentContainerStyle={{ padding: 16, gap: 14 }}>
      <Card>
        <Text style={{ color: t.text, fontSize: 16, fontWeight: "700", marginBottom: 10 }}>Trend</Text>
        {loading ? <ActivityIndicator color={t.brand} style={{ marginVertical: 30 }} /> : <TrendChart entries={entries} />}
      </Card>

      <Card>
        <Text style={{ color: t.text, fontSize: 16, fontWeight: "700", marginBottom: 4 }}>All entries</Text>
        {error ? (
          <View style={{ backgroundColor: t.tones.high.bg, borderRadius: 10, padding: 12 }}>
            <Text style={{ color: t.tones.high.fg, fontSize: 13 }}>{error}</Text>
          </View>
        ) : loading ? (
          <ActivityIndicator color={t.brand} style={{ marginVertical: 20 }} />
        ) : newestFirst.length === 0 ? (
          <Text style={{ color: t.muted, fontSize: 13, paddingVertical: 20, textAlign: "center" }}>
            No entries yet. Complete a BASDAI or BASFI to see it here.
          </Text>
        ) : (
          newestFirst.map((entry, i) => <EntryRow key={entry.id ?? i} entry={entry} last={i === newestFirst.length - 1} />)
        )}
      </Card>
    </ScrollView>
  );
}

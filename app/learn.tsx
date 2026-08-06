import { Linking, ScrollView, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Button, Card } from "../components/ui";
import { useTheme } from "../lib/theme";
import { AS_OVERVIEW, INSTRUMENT_INFO, NOT_ADVICE, SOURCES } from "../lib/content";
import { getInstrument } from "../lib/questions";
import type { InstrumentType } from "../lib/types";

function InstrumentSection({ type }: { type: InstrumentType }) {
  const t = useTheme();
  const router = useRouter();
  const info = INSTRUMENT_INFO[type];
  const instrument = getInstrument(type);
  return (
    <Card style={{ gap: 12 }}>
      <Text style={{ color: t.text, fontSize: 18, fontWeight: "800" }}>
        {info.name} <Text style={{ color: t.muted, fontSize: 13, fontWeight: "500" }}>— {info.full}</Text>
      </Text>
      <View>
        <Text style={{ color: t.text, fontWeight: "700", fontSize: 14 }}>What it measures</Text>
        <Text style={{ color: t.subtext, fontSize: 13, marginTop: 2, lineHeight: 19 }}>{info.measures}</Text>
      </View>
      <View>
        <Text style={{ color: t.text, fontWeight: "700", fontSize: 14 }}>How it&apos;s scored</Text>
        <Text style={{ color: t.subtext, fontSize: 13, marginTop: 2, lineHeight: 19 }}>{info.scale} {info.formula}</Text>
      </View>
      <View>
        <Text style={{ color: t.text, fontWeight: "700", fontSize: 14 }}>Reading the result</Text>
        <Text style={{ color: t.subtext, fontSize: 13, marginTop: 2, lineHeight: 19 }}>{info.interpretation}</Text>
      </View>
      <View>
        <Text style={{ color: t.text, fontWeight: "700", fontSize: 14, marginBottom: 4 }}>The questions</Text>
        {instrument.questions.map((q, i) => (
          <Text key={i} style={{ color: t.subtext, fontSize: 13, lineHeight: 19, marginBottom: 3 }}>
            {i + 1}. {q.text}
          </Text>
        ))}
      </View>
      <Button title={`Fill in ${info.name}`} onPress={() => router.push(`/${type}`)} style={{ paddingVertical: 10 }} />
    </Card>
  );
}

export default function LearnScreen() {
  const t = useTheme();
  return (
    <ScrollView style={{ flex: 1, backgroundColor: t.bg }} contentContainerStyle={{ padding: 16, gap: 14 }}>
      <Text style={{ color: t.subtext, fontSize: 14, lineHeight: 21 }}>
        A quick, plain-language guide to Ankylosing Spondylitis and the two scores this app tracks.
      </Text>

      <Card style={{ gap: 10 }}>
        <Text style={{ color: t.text, fontSize: 18, fontWeight: "800" }}>{AS_OVERVIEW.title}</Text>
        <Text style={{ color: t.subtext, fontSize: 13, lineHeight: 19 }}>{AS_OVERVIEW.summary}</Text>
        {AS_OVERVIEW.highlights.map((item) => (
          <View key={item.title}>
            <Text style={{ color: t.text, fontWeight: "700", fontSize: 14 }}>{item.title}</Text>
            <Text style={{ color: t.subtext, fontSize: 13, marginTop: 2, lineHeight: 19 }}>{item.body}</Text>
          </View>
        ))}
        <View style={{ backgroundColor: t.tones.moderate.bg, borderRadius: 10, padding: 12, marginTop: 4 }}>
          <Text style={{ color: t.tones.moderate.fg, fontSize: 13, lineHeight: 19 }}>
            <Text style={{ fontWeight: "800" }}>When to see a doctor. </Text>
            {AS_OVERVIEW.seeDoctor}
          </Text>
        </View>
      </Card>

      <InstrumentSection type="basdai" />
      <InstrumentSection type="basfi" />

      <View style={{ borderTopColor: t.border, borderTopWidth: 1, paddingTop: 14 }}>
        <Text style={{ color: t.muted, fontSize: 11, lineHeight: 16 }}>{NOT_ADVICE}</Text>
        <Text style={{ color: t.muted, fontSize: 11, fontWeight: "700", marginTop: 10 }}>Sources</Text>
        {SOURCES.map((source) => (
          <Text key={source.url} onPress={() => Linking.openURL(source.url)} style={{ color: t.brand, fontSize: 12, marginTop: 4 }}>
            {source.label}
          </Text>
        ))}
      </View>
    </ScrollView>
  );
}

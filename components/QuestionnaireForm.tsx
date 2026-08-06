import { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "./AuthProvider";
import { ScaleSlider } from "./ScaleSlider";
import { Badge, Button, Card } from "./ui";
import { useTheme } from "../lib/theme";
import { computeScore, severity } from "../lib/scoring";
import { INSTRUMENT_INFO } from "../lib/content";
import { saveEntry } from "../lib/firestore";
import type { Instrument } from "../lib/questions";

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function QuestionnaireForm({ instrument }: { instrument: Instrument }) {
  const t = useTheme();
  const router = useRouter();
  const { user } = useAuth();
  const info = INSTRUMENT_INFO[instrument.type];

  const [answers, setAnswers] = useState<number[]>(() => instrument.questions.map((q) => q.min));
  const [note, setNote] = useState("");
  const [showInfo, setShowInfo] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const score = useMemo(() => computeScore(instrument.type, answers), [instrument.type, answers]);
  const band = severity(instrument.type, score);

  function setAnswer(index: number, value: number) {
    setAnswers((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }

  async function handleSave() {
    if (!user) return;
    setSaving(true);
    setError(null);
    try {
      await saveEntry(user.uid, {
        type: instrument.type,
        answers,
        score,
        note: note.trim(),
        referenceDate: todayIso(),
      });
      router.replace("/history");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save this entry.");
      setSaving(false);
    }
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: t.bg }} contentContainerStyle={{ padding: 16, gap: 12 }}>
      <View>
        <Text style={{ color: t.text, fontSize: 24, fontWeight: "800" }}>{instrument.title}</Text>
        <Text style={{ color: t.subtext, fontSize: 13 }}>{instrument.subtitle}</Text>
      </View>

      <View style={{ backgroundColor: t.tones.calm.bg, borderRadius: 12, padding: 12 }}>
        <Text style={{ color: t.tones.calm.fg, fontSize: 13, lineHeight: 19 }}>{instrument.instruction}</Text>
      </View>

      <Card style={{ padding: 14 }}>
        <Text onPress={() => setShowInfo((s) => !s)} style={{ color: t.text, fontWeight: "700", fontSize: 14 }}>
          <Ionicons name="information-circle-outline" size={15} color={t.brand} /> About this questionnaire{"  "}
          <Text style={{ color: t.muted, fontWeight: "500" }}>{showInfo ? "Hide" : "Show"}</Text>
        </Text>
        {showInfo ? (
          <View style={{ marginTop: 8, gap: 8 }}>
            <Text style={{ color: t.subtext, fontSize: 13, lineHeight: 19 }}>
              <Text style={{ fontWeight: "700", color: t.text }}>What it measures. </Text>
              {info.measures}
            </Text>
            <Text style={{ color: t.subtext, fontSize: 13, lineHeight: 19 }}>
              <Text style={{ fontWeight: "700", color: t.text }}>How it's scored. </Text>
              {info.formula}
            </Text>
            <Text style={{ color: t.subtext, fontSize: 13, lineHeight: 19 }}>
              <Text style={{ fontWeight: "700", color: t.text }}>Reading the result. </Text>
              {info.interpretation}
            </Text>
          </View>
        ) : null}
      </Card>

      {instrument.questions.map((question, index) => (
        <ScaleSlider key={index} index={index} question={question} value={answers[index]} onChange={(v) => setAnswer(index, v)} />
      ))}

      <View>
        <Text style={{ color: t.subtext, fontWeight: "600", fontSize: 13, marginBottom: 6 }}>Notes (optional)</Text>
        <TextInput
          value={note}
          onChangeText={setNote}
          multiline
          placeholder="A flare, a medication change, poor sleep…"
          placeholderTextColor={t.muted}
          style={{
            minHeight: 72,
            borderColor: t.border,
            borderWidth: StyleSheet.hairlineWidth,
            borderRadius: 12,
            padding: 12,
            color: t.text,
            backgroundColor: t.card,
            textAlignVertical: "top",
          }}
        />
      </View>

      <Card>
        <Text style={{ color: t.muted, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5, fontWeight: "700" }}>
          {instrument.title} score
        </Text>
        <View style={{ flexDirection: "row", alignItems: "baseline", gap: 6, marginTop: 2 }}>
          <Text style={{ color: t.text, fontSize: 30, fontWeight: "800" }}>{score.toFixed(1)}</Text>
          <Text style={{ color: t.muted, fontSize: 14 }}>/ 10</Text>
        </View>
        <View style={{ marginTop: 6 }}>
          <Badge tone={band.tone} label={band.label} />
        </View>
        <Text style={{ color: t.subtext, fontSize: 12, marginTop: 6, lineHeight: 17 }}>{band.description}</Text>
      </Card>

      {error ? (
        <View style={{ backgroundColor: t.tones.high.bg, borderRadius: 10, padding: 12 }}>
          <Text style={{ color: t.tones.high.fg, fontSize: 13 }}>{error}</Text>
        </View>
      ) : null}

      <Button title={saving ? "Saving…" : "Save entry"} onPress={handleSave} loading={saving} />

      <Text style={{ color: t.muted, fontSize: 11, textAlign: "center", lineHeight: 16, marginTop: 4 }}>
        This tool records and visualises your own entries. It is not a diagnostic tool and does not provide medical advice.
      </Text>
    </ScrollView>
  );
}

import Slider from "@react-native-community/slider";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../lib/theme";
import type { Question } from "../lib/questions";

interface ScaleSliderProps {
  index: number;
  question: Question;
  value: number;
  onChange: (value: number) => void;
}

export function ScaleSlider({ index, question, value, onChange }: ScaleSliderProps) {
  const t = useTheme();
  const readout = question.formatValue ? question.formatValue(value) : value.toFixed(question.step < 1 ? 1 : 0);

  return (
    <View
      style={{
        backgroundColor: t.card,
        borderColor: t.border,
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 14,
        padding: 16,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 10 }}>
        <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: t.tones.calm.bg, alignItems: "center", justifyContent: "center" }}>
          <Text style={{ color: t.tones.calm.fg, fontWeight: "700", fontSize: 12 }}>{index + 1}</Text>
        </View>
        <Text style={{ flex: 1, color: t.text, fontSize: 15, lineHeight: 21 }}>{question.text}</Text>
        <Text style={{ color: t.brand, fontWeight: "800", fontSize: 16, minWidth: 44, textAlign: "right" }}>{readout}</Text>
      </View>

      <Slider
        style={{ marginTop: 8, height: 40 }}
        minimumValue={question.min}
        maximumValue={question.max}
        step={question.step}
        value={value}
        onValueChange={onChange}
        minimumTrackTintColor={t.brand}
        maximumTrackTintColor={t.border}
        thumbTintColor={t.brand}
      />

      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={{ color: t.muted, fontSize: 12 }}>{question.minLabel}</Text>
        <Text style={{ color: t.muted, fontSize: 12 }}>{question.maxLabel}</Text>
      </View>
    </View>
  );
}

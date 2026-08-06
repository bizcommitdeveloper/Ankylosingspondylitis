import { Fragment, useState } from "react";
import { Text, View } from "react-native";
import Svg, { Circle, Line, Polyline, Text as SvgText } from "react-native-svg";
import { useTheme } from "../lib/theme";
import type { Entry, InstrumentType } from "../lib/types";

interface TrendPoint {
  date: string;
  basdai?: number;
  basfi?: number;
}

const SERIES_COLOR: Record<InstrumentType, string> = { basdai: "#ef4444", basfi: "#0d9488" };

function toTrend(entries: Entry[]): TrendPoint[] {
  const byDate = new Map<string, TrendPoint>();
  for (const entry of entries) {
    const date = entry.referenceDate || new Date(entry.createdAt).toISOString().slice(0, 10);
    const point = byDate.get(date) ?? { date };
    point[entry.type] = entry.score;
    byDate.set(date, point);
  }
  return Array.from(byDate.values()).sort((a, b) => a.date.localeCompare(b.date));
}

function LegendDot({ color, label }: { color: string; label: string }) {
  const t = useTheme();
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
      <View style={{ width: 14, height: 4, borderRadius: 2, backgroundColor: color }} />
      <Text style={{ color: t.subtext, fontSize: 12 }}>{label}</Text>
    </View>
  );
}

export function TrendChart({ entries }: { entries: Entry[] }) {
  const t = useTheme();
  const [width, setWidth] = useState(0);
  const data = toTrend(entries);
  const height = 200;
  const padL = 24;
  const padR = 8;
  const padT = 10;
  const padB = 22;

  const innerW = Math.max(width - padL - padR, 1);
  const innerH = height - padT - padB;

  const xAt = (i: number) => padL + (data.length <= 1 ? innerW / 2 : (innerW * i) / (data.length - 1));
  const yAt = (v: number) => padT + innerH * (1 - v / 10);

  function polyPoints(key: InstrumentType): string {
    return data
      .map((d, i) => (d[key] === undefined ? null : `${xAt(i)},${yAt(d[key] as number)}`))
      .filter(Boolean)
      .join(" ");
  }

  return (
    <View>
      <View onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
        {width > 0 ? (
          <Svg width={width} height={height}>
            {[0, 5, 10].map((g) => (
              <Fragment key={g}>
                <Line x1={padL} y1={yAt(g)} x2={width - padR} y2={yAt(g)} stroke={t.border} strokeWidth={1} />
                <SvgText x={0} y={yAt(g) + 4} fontSize={10} fill={t.muted}>
                  {g}
                </SvgText>
              </Fragment>
            ))}
            {(["basdai", "basfi"] as InstrumentType[]).map((key) => (
              <Polyline key={key} points={polyPoints(key)} fill="none" stroke={SERIES_COLOR[key]} strokeWidth={2} />
            ))}
            {data.map((d, i) => (
              <Fragment key={d.date}>
                {d.basdai !== undefined ? <Circle cx={xAt(i)} cy={yAt(d.basdai)} r={3} fill={SERIES_COLOR.basdai} /> : null}
                {d.basfi !== undefined ? <Circle cx={xAt(i)} cy={yAt(d.basfi)} r={3} fill={SERIES_COLOR.basfi} /> : null}
              </Fragment>
            ))}
          </Svg>
        ) : (
          <View style={{ height }} />
        )}
      </View>
      <View style={{ flexDirection: "row", justifyContent: "center", gap: 20, marginTop: 6 }}>
        <LegendDot color={SERIES_COLOR.basdai} label="BASDAI" />
        <LegendDot color={SERIES_COLOR.basfi} label="BASFI" />
      </View>
    </View>
  );
}


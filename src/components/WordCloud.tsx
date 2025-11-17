import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, LayoutChangeEvent } from 'react-native';
import Svg, { Text as SvgText } from 'react-native-svg';
import { colors, spacing } from '../theme';
import { MoodType } from '../store/types';

export interface CloudDatum {
  text: string;
  value: number;
  mood?: MoodType;
}

interface WordCloudProps {
  title: string;
  data: CloudDatum[];
}

const MIN_FONT = 12;
const MAX_FONT = 32;
const PADDING = 12;
const GAP = 6;

// Color palettes based on mood
const POSITIVE_COLORS = ['#22c55e', '#16a34a', '#15803d', '#166534', '#14532d', '#10b981', '#059669', '#047857'];
const NEGATIVE_COLORS = ['#ef4444', '#dc2626', '#b91c1c', '#991b1b', '#f97316', '#ea580c', '#c2410c', '#9a3412'];
const NEUTRAL_COLORS = ['#6b7280', '#4b5563', '#374151', '#1f2937', '#9ca3af', '#6b7280', '#4b5563', '#374151'];

const getMoodColor = (mood: MoodType | undefined, index: number): string => {
  if (!mood) return colors.accent;
  
  const palette = mood === 'positive' ? POSITIVE_COLORS : mood === 'negative' ? NEGATIVE_COLORS : NEUTRAL_COLORS;
  return palette[index % palette.length];
};

const WordCloud = ({ title, data }: WordCloudProps) => {
  const [containerWidth, setContainerWidth] = useState(0);
  const maxValue = data.reduce((max, item) => Math.max(max, item.value), 0) || 1;
  const width = containerWidth || 320;

  const placedWords = useMemo(() => {
    if (!data.length) return { nodes: [], height: 60 };

    let cursorX = PADDING;
    let cursorY = PADDING;
    let rowHeight = 0;
    const nodes: Array<{
      x: number;
      y: number;
      rotate: number;
      fontSize: number;
      text: string;
      mood?: MoodType;
    }> = [];

    data
      .slice()
      .sort((a, b) => b.value - a.value)
      .forEach((item, index) => {
        const weight = item.value / maxValue;
        const fontSize = MIN_FONT + weight * (MAX_FONT - MIN_FONT);
        const isVertical = index % 4 === 0;
        const textLength = Math.max(item.text.length, 2);
        const approxWidth = isVertical ? fontSize * 0.9 : fontSize * textLength * 0.55;
        const approxHeight = isVertical ? fontSize * textLength * 0.6 : fontSize * 1.1;

        if (cursorX + approxWidth > width - PADDING) {
          cursorX = PADDING;
          cursorY += rowHeight + GAP;
          rowHeight = 0;
        }

        const xCenter = cursorX + approxWidth / 2;
        const yBaseline = cursorY + approxHeight / 2;

        nodes.push({
          x: xCenter,
          y: yBaseline,
          rotate: isVertical ? -90 : 0,
          fontSize,
          text: item.text,
          mood: item.mood,
        });

        cursorX += approxWidth + GAP;
        rowHeight = Math.max(rowHeight, approxHeight);
      });

    const height = cursorY + rowHeight + PADDING;
    return { nodes, height };
  }, [data, maxValue, width]);

  const handleLayout = (event: LayoutChangeEvent) => {
    const newWidth = event.nativeEvent.layout.width;
    if (Math.abs(newWidth - containerWidth) > 5) {
      setContainerWidth(newWidth);
    }
  };

  return (
    <View style={styles.card} onLayout={handleLayout}>
      <Text style={styles.title}>{title}</Text>
      {data.length === 0 ? (
        <Text style={styles.empty}>No data yet.</Text>
      ) : (
        <Svg height={placedWords.height} width={width}>
          {placedWords.nodes.map((node, idx) => (
            <SvgText
              key={`${node.text}-${idx}`}
              x={node.x}
              y={node.y}
              fontSize={node.fontSize}
              fill={getMoodColor(node.mood, idx)}
              textAnchor="middle"
              alignmentBaseline="middle"
              transform={node.rotate ? `rotate(${node.rotate} ${node.x} ${node.y})` : undefined}
            >
              {node.text}
            </SvgText>
          ))}
        </Svg>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: 20,
    marginBottom: spacing.md,
  },
  title: {
    fontWeight: '700',
    marginBottom: spacing.sm,
    color: colors.text,
  },
  empty: {
    color: colors.muted,
  },
});

export default WordCloud;


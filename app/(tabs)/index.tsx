// SENSOR
import { useEffect, useRef, useState } from 'react';
import { View, Text, Platform, StyleSheet } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import * as Haptics from 'expo-haptics';
import { Card, Row, s } from '@/components/ui';
import { Colors } from '@/constants/theme';

const SIZE = 240;
const BUBBLE = 44;
const toDeg = (g: number) => (Math.asin(Math.max(-1, Math.min(1, g))) * 180) / Math.PI;
const SIGN = Platform.OS === 'ios' ? -1 : 1;

export default function LevelScreen() {
  const [available, setAvailable] = useState<boolean | null>(null);
  const [data, setData] = useState({ x: 0, y: 0 });
  const wasLevel = useRef(false);

  useEffect(() => {
    let sub: { remove: () => void } | undefined;
    (async () => {
      const ok = await Accelerometer.isAvailableAsync();
      setAvailable(ok);
      if (!ok) return;
      Accelerometer.setUpdateInterval(80);
      sub = Accelerometer.addListener(({ x, y }) => setData({ x: x * SIGN, y: -y * SIGN }));
    })();
    return () => sub?.remove();
  }, []);

  const tiltX = toDeg(data.x);
  const tiltY = toDeg(data.y);
  const isLevel = Math.abs(tiltX) < 1.5 && Math.abs(tiltY) < 1.5;

  useEffect(() => {
    if (isLevel && !wasLevel.current) {
      if (Platform.OS === 'ios') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      else Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    wasLevel.current = isLevel;
  }, [isLevel]);

  const max = (SIZE - BUBBLE) / 2;
  const clamp = (v: number) => Math.max(-max, Math.min(max, v * max * 2));

  if (available === false) {
    return (
      <View style={s.screen}>
        <Card>
          <Text style={s.title}>Sensor no disponible</Text>
          <Text style={s.subtitle}>Este dispositivo no tiene acelerómetro.</Text>
        </Card>
      </View>
    );
  }

  return (
    <View style={s.screen}>
      <Text style={s.title}>Medidor de angulo</Text>
      <Text style={s.subtitle}>Apoya el teléfono sobre una superficie plana.</Text>
      <Card style={{ alignItems: 'center' }}>
        <View style={[st.dial, isLevel && { borderColor: Colors.accent }]}>
          <View style={st.hLine} />
          <View style={st.vLine} />
          <View
            style={[st.bubble, {
              backgroundColor: isLevel ? Colors.accent : Colors.primary,
              transform: [{ translateX: clamp(data.x) }, { translateY: clamp(data.y) }],
            }]}
          />
        </View>
        <Text style={[st.status, { color: isLevel ? Colors.accent : Colors.muted }]}>
          {isLevel ? '¡Nivelado!' : 'Inclinado'}
        </Text>
      </Card>
      <Card>
        <Row label="Inclinación X" value={`${tiltX.toFixed(1)}°`} />
        <Row label="Inclinación Y" value={`${tiltY.toFixed(1)}°`} />
        <Row label="Plataforma" value={Platform.OS === 'ios' ? 'iOS' : 'Android'} />
      </Card>
    </View>
  );
}

const st = StyleSheet.create({
  dial: { width: SIZE, height: SIZE, borderRadius: SIZE / 2, borderWidth: 4, borderColor: '#D1D5DB', alignItems: 'center', justifyContent: 'center' },
  hLine: { position: 'absolute', width: '100%', height: 1, backgroundColor: '#E5E7EB' },
  vLine: { position: 'absolute', height: '100%', width: 1, backgroundColor: '#E5E7EB' },
  bubble: { width: BUBBLE, height: BUBBLE, borderRadius: BUBBLE / 2, opacity: 0.9 },
  status: { marginTop: 12, fontSize: 18, fontWeight: '700' },
});

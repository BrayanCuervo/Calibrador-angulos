import React from 'react';
import { View, Text, Pressable, StyleSheet, Platform, ViewStyle } from 'react-native';
import { Colors } from '@/constants/theme';

export function Card({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return <View style={[s.card, style]}>{children}</View>;
}

type BtnProps = { title: string; onPress: () => void; disabled?: boolean; variant?: 'primary' | 'outline' | 'danger' };

export function Button({ title, onPress, disabled, variant = 'primary' }: BtnProps) {
  const bg = variant === 'danger' ? Colors.danger : Colors.primary;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      android_ripple={{ color: '#ffffff55' }}
      style={({ pressed }) => [
        s.btn,
        { backgroundColor: variant === 'outline' ? 'transparent' : bg },
        variant === 'outline' && { borderWidth: 1.5, borderColor: Colors.primary },
        pressed && Platform.OS === 'ios' && { opacity: 0.7 },
        disabled && { opacity: 0.5 },
      ]}
    >
      <Text style={[s.btnText, variant === 'outline' && { color: Colors.primary }]}>{title}</Text>
    </Pressable>
  );
}

export function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={s.row}>
      <Text style={s.rowLabel}>{label}</Text>
      <Text style={s.rowValue}>{value}</Text>
    </View>
  );
}

export const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.bg, padding: 16 },
  title: { fontSize: 20, fontWeight: '700', color: Colors.text, marginBottom: 4 },
  subtitle: { fontSize: 14, color: Colors.muted, marginBottom: 12 },
  card: {
    backgroundColor: Colors.card, borderRadius: 16, padding: 16, marginBottom: 16,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
      android: { elevation: 3 },
    }),
  },
  btn: { paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#E5E7EB' },
  rowLabel: { color: Colors.muted, fontSize: 14 },
  rowValue: { color: Colors.text, fontSize: 14, fontWeight: '600', flexShrink: 1, textAlign: 'right', marginLeft: 12 },
});

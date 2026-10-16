// FUNCIONALIDAD NATIVA 1: grabación de audio (expo-audio)
import { useState } from 'react';
import { View, Text, Alert, Linking, FlatList, Platform } from 'react-native';
import {
  useAudioRecorder, useAudioRecorderState, useAudioPlayer,
  RecordingPresets, requestRecordingPermissionsAsync, setAudioModeAsync,
} from 'expo-audio';
import { Card, Button, s } from '@/components/ui';
import { Colors } from '@/constants/theme';

const fmt = (ms: number) => {
  const t = Math.floor(ms / 1000);
  return `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`;
};

export default function AudioScreen() {
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const state = useAudioRecorderState(recorder);
  const player = useAudioPlayer(null);
  const [recordings, setRecordings] = useState<string[]>([]);

  const start = async () => {
    const { granted, canAskAgain } = await requestRecordingPermissionsAsync();
    if (!granted) {
      Alert.alert('Permiso requerido', 'Activa el permiso de micrófono en los ajustes.',
        canAskAgain ? [{ text: 'OK' }] : [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Abrir ajustes', onPress: () => Linking.openSettings() },
        ]);
      return;
    }
    // iOS necesita habilitar explícitamente la grabación y el sonido en modo silencio
    await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: Platform.OS === 'ios' });
    await recorder.prepareToRecordAsync();
    recorder.record();
  };

  const stop = async () => {
    await recorder.stop();
    if (recorder.uri) setRecordings((r) => [recorder.uri as string, ...r]);
  };

  const play = (uri: string) => {
    player.replace({ uri });
    player.play();
  };

  return (
    <View style={s.screen}>
      <Text style={s.title}>Grabadora de audio</Text>
      <Text style={s.subtitle}>Graba notas de voz y reprodúcelas al instante.</Text>
      <Card style={{ alignItems: 'center' }}>
        <Text style={{ fontSize: 44, fontWeight: '700', color: state.isRecording ? Colors.danger : Colors.text }}>
          {fmt(state.durationMillis)}
        </Text>
        <Text style={{ color: Colors.muted, marginBottom: 8 }}>{state.isRecording ? '● Grabando…' : 'Listo para grabar'}</Text>
        <View style={{ alignSelf: 'stretch' }}>
          {state.isRecording
            ? <Button title="⏹  Detener" variant="danger" onPress={stop} />
            : <Button title="🎙  Grabar" onPress={start} />}
        </View>
      </Card>
      <Text style={[s.title, { fontSize: 16 }]}>Grabaciones ({recordings.length})</Text>
      <FlatList
        data={recordings}
        keyExtractor={(u) => u}
        ListEmptyComponent={<Text style={{ color: Colors.muted }}>Aún no hay grabaciones</Text>}
        renderItem={({ item, index }) => (
          <Card style={{ marginBottom: 10, paddingVertical: 8 }}>
            <Button title={`▶  Nota ${recordings.length - index}`} variant="outline" onPress={() => play(item)} />
          </Card>
        )}
      />
    </View>
  );
}

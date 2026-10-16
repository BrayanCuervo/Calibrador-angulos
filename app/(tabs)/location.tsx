// FUNCIONALIDAD NATIVA 2: geolocalización (expo-location)
import { useState } from 'react';
import { View, Text, ActivityIndicator, Linking, Platform } from 'react-native';
import * as Location from 'expo-location';
import { Card, Button, Row, s } from '@/components/ui';
import { Colors } from '@/constants/theme';

export default function LocationScreen() {
  const [loc, setLoc] = useState<Location.LocationObjectCoords | null>(null);
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const locate = async () => {
    setLoading(true);
    setError('');
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') throw new Error('Permiso de ubicación denegado.');
      if (!(await Location.hasServicesEnabledAsync())) throw new Error('Activa el GPS del dispositivo.');
      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      setLoc(pos.coords);
      const [a] = await Location.reverseGeocodeAsync(pos.coords);
      setAddress(a ? [a.street, a.city, a.country].filter(Boolean).join(', ') : 'Sin dirección');
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Diferencia por SO: esquema de URL para abrir el mapa nativo
  const openMap = () => {
    if (!loc) return;
    const { latitude: lat, longitude: lon } = loc;
    Linking.openURL(
      Platform.select({
        ios: `maps:0,0?q=${lat},${lon}`,
        default: `geo:${lat},${lon}?q=${lat},${lon}`,
      })
    );
  };

  return (
    <View style={s.screen}>
      <Text style={s.title}>Mi ubicación</Text>
      <Text style={s.subtitle}>Consulta tus coordenadas y ábrelas en el mapa.</Text>
      <Card>
        <Button title="📍  Obtener ubicación" onPress={locate} disabled={loading} />
        {loading && <ActivityIndicator style={{ marginTop: 12 }} color={Colors.primary} />}
        {!!error && <Text style={{ color: Colors.danger, marginTop: 12 }}>{error}</Text>}
      </Card>
      {loc && (
        <Card>
          <Row label="Dirección" value={address} />
          <Row label="Latitud" value={loc.latitude.toFixed(5)} />
          <Row label="Longitud" value={loc.longitude.toFixed(5)} />
          <Row label="Precisión" value={`${Math.round(loc.accuracy ?? 0)} m`} />
          <Button title="Abrir en mapas" variant="outline" onPress={openMap} />
        </Card>
      )}
    </View>
  );
}

import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';

export default function App() {

  const [origen, setOrigen] = useState({
    latitude: 37.3708533,
    longitude: -5.9601285,
  });

  const [destino, setDestino] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
  });

  useEffect(() => {
    getLocationPermissions();
  }, []);

  async function getLocationPermissions() {
    const { status } = await Location.requestPermissionsAsync();
    if (status === 'granted') {
      const { cordenadas } = await Location.getCurrentPositionAsync();
      setOrigen({ latitude: cordenadas.latitude, longitude: cordenadas.longitude });
    } else {
      console.log('Permisos no concedidos');
    }
  }

  function calcularDistancia(origen, destino) {
    const lat1 = origen.latitude;
    const lon1 = origen.longitude;
    const lat2 = destino.latitude;
    const lon2 = destino.longitude;

    const R = 6371; // Radio de la Tierra en kilómetros
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const lat1Rad = lat1 * Math.PI / 180;
    const lat2Rad = lat2 * Math.PI / 180;

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1Rad) * Math.cos(lat2Rad);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distancia = R * c;

    return distancia;
  }

  // async function getDireccion(coordenadas) {
  //   const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coordenadas.latitude},${coordenadas.longitude}&key=TU_API_KEY`;
  //   const response = await fetch(url);
  //   const data = await response.json();

  //   return data.results[0].formatted_address;
  // }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <MapView
        style={{ width: '100%', height: '100%' }}
        initialRegion={{
          latitude: origen.latitude,
          longitude: origen.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421
        }}
      >
        <Marker draggable coordinate={origen} title="Origen" />
        <Marker draggable coordinate={destino} title="Destino" />
        <Polyline coordinates={[origen, destino]}
          strokeColor="#444"
          strokeWidth={1}
        />
      </MapView>
      <Text style={styles.distancia}>
        Distancia: {calcularDistancia(origen, destino)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  distancia: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: '#fff',
    margin: 10,
  }
});

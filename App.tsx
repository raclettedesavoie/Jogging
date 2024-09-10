import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, SafeAreaView, Platform, PermissionsAndroid } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Geolocation from '@react-native-community/geolocation';
import { LineChart } from 'react-native-chart-kit';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';

type RootStackParamList = {
  Home: undefined;
  Stats: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

async function requestLocationPermission() {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'App needs access to your location.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  } else if (Platform.OS === 'ios') {
    const result = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    return result === RESULTS.GRANTED;
  }
  return false;
}

function HomeScreen({ navigation }: { navigation: any }) {
  const [loading, setLoading] = useState(false);

  const startRunning = async () => {
    const hasPermission = await requestLocationPermission();
    if (hasPermission) {
      setLoading(true);
      // Start tracking here
      setLoading(false);
      navigation.navigate('Stats');
    } else {
      alert('Location permission not granted');
    }
  };

  const stopRunning = async () => {
    setLoading(true);
    // Stop tracking here
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Running App</Text>
      </View>
      <View style={styles.buttons}>
        <Button title="Start Running" onPress={startRunning} />
        <Button title="Stop Running" onPress={stopRunning} />
      </View>
    </SafeAreaView>
  );
}

function StatsScreen() {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [coordinates, setCoordinates] = useState<{ latitude: number; longitude: number }[]>([]);
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    Geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
        setCoordinates((prev) => [...prev, { latitude, longitude }]);
        // Update distance and duration here
      },
      (error) => console.log(error),
      { enableHighAccuracy: true, distanceFilter: 1 }
    );

    return () => {
      Geolocation.clearWatch();
    };
  }, []);

  const chartData = {
    labels: coordinates.map((_, index) => index.toString()),
    datasets: [
      {
        data: coordinates.map(coord => coord.latitude)
      }
    ]
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.stats}>
        <Text style={styles.stat}>Distance: {distance} km</Text>
        <Text style={styles.stat}>Duration: {duration} min</Text>
      </View>
      <View style={styles.chartContainer}>
        {coordinates.length > 0 ? (
          <LineChart
            data={chartData}
            width={320}
            height={220}
            yAxisLabel=""
            chartConfig={{
              backgroundColor: "#e26a00",
              backgroundGradientFrom: "#fb8c00",
              backgroundGradientTo: "#ffa726",
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16
              },
              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: "#ffa726"
              }
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16
            }}
          />
        ) : (
          <ActivityIndicator size="large" color="#0000ff" />
        )}
      </View>
    </SafeAreaView>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Stats" component={StatsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  buttons: {
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stats: {
    marginBottom: 20,
  },
  stat: {
    fontSize: 18,
    marginBottom: 10,
  },
  chartContainer: {
    alignItems: 'center',
  },
});

export default App;

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DistanceTracker = ({ running }) => {
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    let interval;
    if (running) {
      interval = setInterval(() => {
        setDistance(prevDistance => prevDistance + 0.01); // Increment distance by 0.01 km per second
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [running]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Distance:</Text>
      <Text style={styles.distance}>{distance.toFixed(2)} km</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  distance: {
    fontSize: 48,
  },
});

export default DistanceTracker;

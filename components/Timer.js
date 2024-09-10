import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Timer = ({ running }) => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    let timer;
    if (running) {
      timer = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [running]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Time:</Text>
      <Text style={styles.time}>{Math.floor(time / 60)}:{('0' + (time % 60)).slice(-2)}</Text>
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
  time: {
    fontSize: 48,
  },
});

export default Timer;

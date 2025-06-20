// Loading.js
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, Text, Animated } from 'react-native';
import LottieView from 'lottie-react-native';

const Loading = ({ 
  text = 'Đang tải nội dung',
  showLogo = true,
  backgroundColor = '#fff',
  textColor = '#333',
  lottieSize = 200,
  speed = 3 
}) => {
  const [dots, setDots] = useState('');
  const opacity = new Animated.Value(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + '.' : ''));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.6,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {showLogo && (
        <Image source={require('../../assets/logo/logo-app.png')} style={styles.logo} />
      )}

      <LottieView
        source={require('../../assets/animate/loading.json')}
        autoPlay
        loop
        style={[styles.lottie, { width: lottieSize, height: lottieSize }]}
        speed={speed}
      />

      <Animated.Text style={[styles.text, { opacity, color: textColor }]}>
        {text}{dots}
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  logo: {
    marginBottom: 20,
  },
  lottie: {
    alignSelf: 'center'
  },
  text: {
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default Loading;

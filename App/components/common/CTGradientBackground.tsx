import colors from '@App/constants/colors';
import React from 'react';
import {StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

export default function CTGradientBackground() {
  return (
    <LinearGradient
      style={styles.container}
      colors={[colors.primary, colors.background]}
      start={{x: 0, y: 4}}
      end={{x: 1, y: 0}}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: -1000,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
});

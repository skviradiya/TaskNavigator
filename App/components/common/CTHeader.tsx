import {backArrowIcon} from '@App/assets/icons';
import colors from '@App/constants/colors';
import React from 'react';
import {
  GestureResponderEvent,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import CTIcon from './CTIcon';

type CTHeaderProps = {
  title?: string;
  onBackPress?: (event: GestureResponderEvent) => void;
  containerStyle?: ViewStyle;
  titleStyle?: TextStyle;
};

const CTHeader: React.FC<CTHeaderProps> = ({
  title,
  onBackPress,
  containerStyle = {},
  titleStyle = {},
}) => {
  return (
    <>
      <SafeAreaView style={{backgroundColor: colors.background, zIndex: 100}} />
      <StatusBar
        barStyle={'light-content'}
        backgroundColor={colors.background}
      />
      <View style={[styles.container, containerStyle]}>
        {onBackPress ? (
          <CTIcon
            source={backArrowIcon}
            onPress={onBackPress}
            tintColor={colors.textPrimary}
          />
        ) : null}
        {title ? <Text style={[styles.title, titleStyle]}>{title}</Text> : null}
        {onBackPress ? <View style={styles.iconPlaceholder} /> : null}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.background,
    elevation: 100,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
  },

  title: {
    fontSize: 18,
    color: colors.primary,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  iconPlaceholder: {
    width: 24,
  },
});

export default CTHeader;

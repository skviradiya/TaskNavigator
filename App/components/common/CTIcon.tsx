import React from 'react';
import {
  ColorValue,
  GestureResponderEvent,
  Image,
  ImageSourcePropType,
  ImageStyle,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from 'react-native';

interface CTIconProps extends TouchableOpacityProps {
  source: ImageSourcePropType;
  iconSize?: number;
  iconHeight?: number;
  onPress?: (event: GestureResponderEvent) => void;
  activeOpacity?: number;
  iconStyle?: ImageStyle;
  style?: ViewStyle;
  tintColor?: ColorValue | undefined;
}

const CTIcon: React.FC<CTIconProps> = ({
  source,

  iconSize = 24,
  onPress,
  activeOpacity = 1,
  style,
  iconStyle,
  tintColor,
  ...props
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={activeOpacity}
      style={style}
      {...props}>
      <Image
        source={source}
        style={[
          styles.icon,
          {width: iconSize, height: iconSize, tintColor: tintColor},
          iconStyle,
        ]}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  icon: {
    resizeMode: 'contain',
  },
});

export default CTIcon;

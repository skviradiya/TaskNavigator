/* eslint-disable react-native/no-inline-styles */
import colors from '@App/constants/colors';
import {ITEM_BORDER_RADIUS} from '@App/constants/constants';

import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';

interface CTTextInputProps extends TextInputProps {
  label: string;
  errorMessage?: string;
  containerStyle?: ViewStyle;
}
function CTTextInput({
  label,

  value,

  containerStyle,
  errorMessage,
  onBlur,
  ...props
}: CTTextInputProps) {
  const [isFocused, setIsFocused] = useState(value ? true : false);

  const handleFocus = () => {
    setIsFocused(true);
  };
  const handleBlur = () => {
    setIsFocused(value ? true : false);
  };
  return (
    <>
      <View style={[styles.container, containerStyle]}>
        <View
          style={{
            top: isFocused ? 5 : 20,
            position: 'absolute',
            left: 10,
          }}>
          <Text
            style={{
              color: colors.placeholder,
              fontWeight: 'bold',
              fontSize: isFocused ? 12 : 16,
            }}>
            {label}
          </Text>
        </View>
        <TextInput
          onFocus={handleFocus}
          onBlur={e => {
            handleBlur();
            onBlur?.(e);
          }}
          value={value}
          multiline={false}
          cursorColor={colors.textPrimary}
          {...props}
          style={[styles.input, props.style, {top: isFocused ? 10 : 0}]}
        />
      </View>
      {errorMessage ? (
        <Text style={styles.errorMessage}>{errorMessage}</Text>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.halfTransparent,
    borderRadius: ITEM_BORDER_RADIUS,

    paddingVertical: 10,
    flexDirection: 'row',
  },
  input: {
    padding: 10,
    color: colors.textPrimary,
    fontSize: 16,
    textAlignVertical: 'top',
    flex: 1,
  },
  errorMessage: {
    color: colors.error,

    fontSize: 11,
    marginLeft: 10,
  },
});
export default CTTextInput;

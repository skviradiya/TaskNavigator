import React from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  StyleSheet,
} from 'react-native';

interface CTKeyboardAvoidScrollViewProps {
  children: React.ReactNode;
  style?: object;
}

const CTKeyboardAvoidScrollView: React.FC<CTKeyboardAvoidScrollViewProps> = ({
  children,
  style,
}) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'android' ? 10 : undefined}
      style={[styles.container, style]}>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        keyboardShouldPersistTaps="handled">
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    paddingVertical: 20,
  },
});

export default CTKeyboardAvoidScrollView;

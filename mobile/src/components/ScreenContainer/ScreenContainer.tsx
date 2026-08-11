import { PropsWithChildren } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { styles } from './ScreenContainer.styles';

type Props = PropsWithChildren<{
  /** False lets the screen host its own scrollable (e.g. a FlatList) instead of wrapping children in a ScrollView. */
  scrollable?: boolean;
}>;

export function ScreenContainer({ children, scrollable = true }: Props) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {scrollable ? (
          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
          >
            {children}
          </ScrollView>
        ) : (
          <View style={styles.flex}>{children}</View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

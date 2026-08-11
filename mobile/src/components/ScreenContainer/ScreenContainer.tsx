import { PropsWithChildren, ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { styles } from './ScreenContainer.styles';

type Props = PropsWithChildren<{
  /** False lets the screen host its own scrollable (e.g. a FlatList) instead of wrapping children in a ScrollView. */
  scrollable?: boolean;
  /** Which safe-area edges to inset. Defaults to top+bottom; a tab screen should omit 'bottom' since the tab bar already insets it, or double-padding results. */
  edges?: readonly Edge[];
  /** Rendered above the scrollable content and stays fixed in place while it scrolls, e.g. a back row. */
  header?: ReactNode;
}>;

export function ScreenContainer({ children, scrollable = true, edges = ['top', 'bottom'], header }: Props) {
  return (
    <SafeAreaView style={styles.safeArea} edges={edges}>
      <StatusBar style="dark" />
      {header ? <View style={styles.header}>{header}</View> : null}
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

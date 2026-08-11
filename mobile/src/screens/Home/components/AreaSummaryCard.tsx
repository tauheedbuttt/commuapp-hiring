import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { colors } from '../../../theme/colors';
import { styles } from './AreaSummaryCard.styles';

type Props = {
  loading: boolean;
  error: boolean;
  summary: string | null;
};

export function AreaSummaryCard({ loading, error, summary }: Props) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <View style={styles.card}>
      <Pressable style={styles.header} onPress={() => setCollapsed((prev) => !prev)}>
        <Text style={styles.title}>Area summary</Text>
        <Ionicons name={collapsed ? 'chevron-down' : 'chevron-up'} size={18} color={colors.text} />
      </Pressable>

      {collapsed ? null : (
        <View style={styles.body}>
          {loading ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator size="small" color={colors.primaryGreen} />
              <Text style={styles.loadingText}>Generating summary...</Text>
            </View>
          ) : error ? (
            <Text style={styles.errorText}>Couldn't load the area summary.</Text>
          ) : (
            <Text style={styles.summaryText}>{summary}</Text>
          )}
        </View>
      )}
    </View>
  );
}

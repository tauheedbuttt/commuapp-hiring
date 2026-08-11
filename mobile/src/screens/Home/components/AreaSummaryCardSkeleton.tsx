import { View } from 'react-native';
import { Pulse } from './Pulse';
import { styles } from './Skeleton.styles';

export function AreaSummaryCardSkeleton() {
  return (
    <Pulse style={styles.summaryCard}>
      <View style={[styles.lineBlock, { width: '50%' }]} />
      <View style={[styles.lineBlock, { width: '100%' }]} />
      <View style={[styles.lineBlock, { width: '90%' }]} />
    </Pulse>
  );
}

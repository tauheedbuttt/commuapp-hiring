import { View } from 'react-native';
import { Pulse } from '../../../components/Pulse/Pulse';
import { styles } from '../Skeleton.styles';

export function NoticeCardSkeleton() {
  return (
    <Pulse style={styles.card}>
      <View style={styles.photoBlock} />
      <View style={styles.body}>
        <View style={styles.tagRow}>
          <View style={styles.tagBlock} />
          <View style={styles.tagBlock} />
        </View>
        <View style={[styles.lineBlock, { width: '40%' }]} />
        <View style={styles.ownerRow}>
          <View style={styles.avatarBlock} />
          <View style={[styles.lineBlock, { width: '50%' }]} />
        </View>
        <View style={[styles.lineBlock, { width: '100%' }]} />
        <View style={[styles.lineBlock, { width: '80%' }]} />
      </View>
    </Pulse>
  );
}

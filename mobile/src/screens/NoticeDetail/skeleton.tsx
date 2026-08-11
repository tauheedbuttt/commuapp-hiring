import { View } from 'react-native';
import { Pulse } from '../../components/Pulse/Pulse';
import { styles } from './skeleton.styles';

export function NoticeDetailSkeleton() {
  return (
    <Pulse style={styles.container}>
      <View style={[styles.lineBlock, { width: '70%', height: 32 }]} />
      <View style={styles.imageBlock} />
      <View style={styles.tagRow}>
        <View style={styles.tagBlock} />
        <View style={styles.tagBlock} />
      </View>
      <View style={styles.ownerRow}>
        <View style={styles.avatarBlock} />
        <View style={[styles.lineBlock, { width: '40%' }]} />
      </View>
      <View style={[styles.lineBlock, { width: '100%' }]} />
      <View style={[styles.lineBlock, { width: '90%' }]} />
      <View style={[styles.lineBlock, { width: '80%' }]} />
    </Pulse>
  );
}

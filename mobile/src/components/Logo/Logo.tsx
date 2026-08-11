import { Image, Text, View } from 'react-native';
import { styles } from './Logo.styles';

export function Logo() {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/logo.png')}
        style={styles.mark}
        resizeMode="contain"
      />
      <Text style={styles.wordmark}>commu</Text>
    </View>
  );
}

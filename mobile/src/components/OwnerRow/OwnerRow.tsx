import { useEffect, useState } from 'react';
import { Image, StyleProp, Text, TextStyle, View, ViewStyle } from 'react-native';
import { styles } from './OwnerRow.styles';

const AVATAR_PLACEHOLDER_IMAGE = require('../../../assets/avatar-placeholder.png');

type Owner = {
  name: string;
  avatar_url?: string | null;
} | null;

type Company = {
  name: string;
  logo_url?: string | null;
} | null;

type Props = {
  owner: Owner | undefined;
  company: Company | undefined;
  avatarSize: number;
  /** Draws a colored ring around the avatar, matching the detail-screen pixel reference. */
  ring?: boolean;
  nameStyle?: StyleProp<TextStyle>;
  style?: StyleProp<ViewStyle>;
};

/**
 * Owner-row rendering shared by the list card and the detail screen: an
 * avatar + name, falling back to the posting company's logo/name when a
 * post has no individual owner, and to a generic placeholder otherwise.
 */
export function OwnerRow({ owner, company, avatarSize, ring, nameStyle, style }: Props) {
  const imageUrl = owner?.avatar_url ?? company?.logo_url ?? null;
  const displayName = owner?.name ?? company?.name ?? 'Someone';

  const [imageLoadFailed, setImageLoadFailed] = useState(false);

  useEffect(() => {
    setImageLoadFailed(false);
  }, [imageUrl]);

  return (
    <View style={[styles.row, style]}>
      <Image
        source={imageUrl && !imageLoadFailed ? { uri: imageUrl } : AVATAR_PLACEHOLDER_IMAGE}
        onError={() => setImageLoadFailed(true)}
        style={[
          styles.avatar,
          { width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2 },
          ring && styles.avatarRing,
        ]}
      />
      <Text style={[styles.name, nameStyle]} numberOfLines={1}>
        {displayName}
      </Text>
    </View>
  );
}

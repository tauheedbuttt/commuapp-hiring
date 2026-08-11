import type { NoticeType } from '../api/generated/graphql';
import { colors } from '../theme/colors';

type TagStyle = {
  label: string;
  background: string;
  text: string;
};

const NOTICE_TYPE_TAGS: Record<NoticeType, TagStyle> = {
  GIVE_FREE: { label: 'Giving free', background: colors.tagGiveBackground, text: colors.tagGiveText },
  GIVE_SELL: { label: 'Selling', background: colors.tagGiveBackground, text: colors.tagGiveText },
  GIVE_TRADE: { label: 'Give trade', background: colors.tagGiveBackground, text: colors.tagGiveText },
  GIVE_GENERIC: { label: 'Offer help', background: colors.tagGiveBackground, text: colors.tagGiveText },
  NEED_FREE: { label: 'Want free', background: colors.tagNeedBackground, text: colors.tagNeedText },
  NEED_BUY: { label: 'Buying', background: colors.tagNeedBackground, text: colors.tagNeedText },
  NEED_TRADE: { label: 'Need trade', background: colors.tagNeedBackground, text: colors.tagNeedText },
  NEED_GENERIC: { label: 'Need help', background: colors.tagNeedBackground, text: colors.tagNeedText },
  COLLECTOR: { label: 'Collector', background: colors.tagNeutralBackground, text: colors.tagNeutralText },
};

export function noticeTypeTag(type: NoticeType): TagStyle {
  return NOTICE_TYPE_TAGS[type];
}

export function titleCase(key: string): string {
  return key.replace(/[_-]+/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

export function formatDistanceAway(distanceMeters: number): string {
  const km = distanceMeters / 1000;
  const rounded = km < 10 ? Math.round(km * 10) / 10 : Math.round(km);
  return `${rounded} km away`;
}

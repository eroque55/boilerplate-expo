import { ViewStyle } from 'react-native';

import * as IconAssets from '@/assets/icons/index';
import { colors } from '@/theme/colors';

export type TIcon = keyof typeof IconAssets;

export type IconProps = {
  name: TIcon;
  size?: number;
  style?: ViewStyle;
  color?: string;
  strokeWidth?: number;
  rotate?: number;
  fill?: string;
};

/**
 * Defaults:
 * ```
 * size: 24
 * color: colors.primary
 * strokeWidth: 2
 * ```
 */
const Icon = ({
  name,
  size = 24,
  color = colors.primary,
  strokeWidth = 2,
  style,
  rotate = 0,
  fill = 'none',
}: IconProps) => {
  const IconAsset = IconAssets[name];

  if (!IconAsset) {
    return null;
  }

  return (
    <IconAsset
      color={color}
      fill={fill}
      height={size}
      strokeWidth={strokeWidth}
      style={style}
      transform={[{ rotate: `${rotate}deg` }]}
      width={size}
    />
  );
};

export default Icon;

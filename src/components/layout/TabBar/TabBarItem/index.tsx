import { Href, usePathname, useRouter } from 'expo-router';
import { Text } from 'react-native';

import Icon, { TIcon } from '@/components/ui/Icon';
import Pressable from '@/components/ui/Pressable';
import { useTheme } from '@/hooks/common';
import { colors } from '@/theme/colors';

type Props = {
  icon: TIcon;
  label: string;
  href?: Href;
};

const TabBarItem = ({ icon, label, href }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const { isDark } = useTheme();

  const isSelected = href ? String(href).includes(pathname) : false;

  const handlePress = () => {
    if (!href) {
      return;
    }
    router.replace(href);
  };

  const getColor = () => {
    if (isSelected) {
      return colors.primary;
    }

    return isDark ? colors.neutral[400] : colors.neutral[500];
  };

  return (
    <Pressable
      withoutFeedback
      className="flex-1 items-center gap-1.5"
      disabled={isSelected || !href}
      hitSlop={4}
      onPress={handlePress}
    >
      <Icon color={getColor()} name={icon} size={18} strokeWidth={1.7} />

      <Text className="text-xs" style={{ color: getColor() }}>
        {label}
      </Text>
    </Pressable>
  );
};

export default TabBarItem;

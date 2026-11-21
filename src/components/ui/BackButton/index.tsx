import { useRouter } from 'expo-router';
import { GestureResponderEvent } from 'react-native';

import Icon from '../Icon';
import Pressable, { PressableProps } from '../Pressable';

const BackButton = ({ onPress, ...props }: PressableProps) => {
  const router = useRouter();

  const handlePress = (e: GestureResponderEvent) => {
    if (onPress) {
      onPress(e);
      return;
    }

    if (router.canGoBack()) {
      router.back();
    }
  };

  return (
    <Pressable
      className="size-9 items-center justify-center overflow-hidden rounded-full"
      onPress={handlePress}
      {...props}
    >
      <Icon name="ChevronIcon" rotate={90} size={20} />
    </Pressable>
  );
};

export default BackButton;

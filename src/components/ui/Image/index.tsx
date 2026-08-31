// eslint-disable-next-line no-restricted-imports
import { Image as ExpoImage, ImageProps } from 'expo-image';
import { PropsWithChildren, useState } from 'react';
import { View, ViewProps } from 'react-native';
import Animated, { AnimatedProps } from 'react-native-reanimated';

import Shimmer from '../Shimmer';

type Props = {
  showShimmer?: boolean;
  containerProps?: AnimatedProps<ViewProps>;
} & ImageProps;

const Image = ({
  children,
  style,
  showShimmer = false,
  containerProps,
  className,
  onLoadEnd,
  ...props
}: PropsWithChildren<Props>) => {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadEnd = () => {
    setIsLoading(false);
    onLoadEnd?.();
  };

  return (
    <Animated.View
      className={`overflow-hidden ${className ?? ''}`}
      style={style}
      {...containerProps}
    >
      <ExpoImage style={{ flex: 1 }} {...props} onLoadEnd={handleLoadEnd} />

      {isLoading && showShimmer && (
        <View className="absolute inset-0">
          <Shimmer />
        </View>
      )}

      {children}
    </Animated.View>
  );
};

export default Image;

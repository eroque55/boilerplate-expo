import { useState } from 'react';
import {
  FieldValues,
  useController,
  UseControllerProps,
} from 'react-hook-form';
import {
  StyleProp,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewProps,
} from 'react-native';
import MaskInput, { Mask } from 'react-native-mask-input';
import Animated, {
  AnimatedProps,
  LinearTransition,
} from 'react-native-reanimated';

import { useTheme } from '@/hooks/common';
import { colors } from '@/theme/colors';

import ErrorText from '../ErrorText';
import Icon, { IconProps } from '../Icon';
import Pressable from '../Pressable';

type Props<TFieldValues extends FieldValues> = {
  label?: string;
  isPassword?: boolean;
  leftIcon?: IconProps;
  rightIcon?: IconProps;
  mask?: Mask;
  containerProps?: AnimatedProps<ViewProps>;
  useLayoutAnimation?: boolean;
} & TextInputProps &
  UseControllerProps<TFieldValues>;

const Input = <TFieldValues extends FieldValues>({
  label,
  isPassword,
  leftIcon,
  rightIcon,
  mask,
  containerProps,
  control,
  name,
  autoCapitalize = 'none',
  multiline,
  maxLength,
  useLayoutAnimation = true,
  ...props
}: Props<TFieldValues>) => {
  const { isDark } = useTheme();
  const [passwordHidden, setPasswordHidden] = useState(isPassword);

  const {
    field,
    fieldState: { error },
  } = useController({
    control,
    name,
  });

  const handlePaddingRight = () => {
    if (isPassword) {
      return 48;
    }

    if (rightIcon) {
      return 38;
    }
  };

  const inputStyle: StyleProp<TextStyle> = {
    flexGrow: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    lineHeight: 24,
    color: isDark ? colors.neutral[400] : colors.neutral[500],
    paddingRight: handlePaddingRight(),
    paddingLeft: leftIcon ? 38 : undefined,
  };

  const commonProps: TextInputProps = {
    autoCapitalize,
    maxLength,
    multiline,
    placeholderTextColor: isDark ? colors.neutral[600] : colors.neutral[400],
    secureTextEntry: passwordHidden,
    style: inputStyle,
    textAlignVertical: multiline ? 'top' : 'center',
    value: field.value,
    onChangeText: field.onChange,
    ...props,
  };

  return (
    <Animated.View
      className="gap-1"
      layout={useLayoutAnimation ? LinearTransition : undefined}
      {...containerProps}
    >
      {label && (
        <Text className="text-sm text-neutral-600 dark:text-neutral-300">
          {label}
        </Text>
      )}

      <View className="w-full flex-row items-center overflow-hidden rounded-full bg-white dark:bg-neutral-800">
        {mask ? (
          <MaskInput ref={field.ref} mask={mask} {...commonProps} />
        ) : (
          <TextInput ref={field.ref} {...commonProps} />
        )}

        {leftIcon && (
          <Icon
            key={leftIcon.name}
            style={{ position: 'absolute', left: 12, alignSelf: 'center' }}
            {...leftIcon}
          />
        )}

        {rightIcon && (
          <Icon
            key={rightIcon.name}
            style={{ position: 'absolute', right: 12, alignSelf: 'center' }}
            {...rightIcon}
          />
        )}

        {isPassword && (
          <Pressable
            className="absolute right-3 items-center justify-center overflow-hidden rounded-full p-1"
            testID="input-password-toggle"
            onPress={() => {
              setPasswordHidden(!passwordHidden);
            }}
          >
            <Icon
              key={passwordHidden ? 'EyeOffIcon' : 'EyeIcon'}
              color={passwordHidden ? colors.neutral[400] : colors.primary}
              name={passwordHidden ? 'EyeOffIcon' : 'EyeIcon'}
              size={25}
            />
          </Pressable>
        )}
      </View>

      <ErrorText text={error?.message} />
    </Animated.View>
  );
};

export default Input;

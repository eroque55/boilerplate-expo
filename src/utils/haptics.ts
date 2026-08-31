import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export type HapticIntent =
  | 'press'
  | 'selection'
  | 'toggleOn'
  | 'toggleOff'
  | 'longPress'
  | 'success'
  | 'warning'
  | 'error';

const iosHaptics: Record<HapticIntent, () => Promise<void>> = {
  press: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
  selection: () => Haptics.selectionAsync(),
  toggleOn: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid),
  toggleOff: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft),
  longPress: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
  success: () =>
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
  warning: () =>
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning),
  error: () =>
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error),
};

const androidHaptics: Record<HapticIntent, Haptics.AndroidHaptics> = {
  press: Haptics.AndroidHaptics.Virtual_Key,
  selection: Haptics.AndroidHaptics.Segment_Tick,
  toggleOn: Haptics.AndroidHaptics.Toggle_On,
  toggleOff: Haptics.AndroidHaptics.Toggle_Off,
  longPress: Haptics.AndroidHaptics.Long_Press,
  success: Haptics.AndroidHaptics.Confirm,
  warning: Haptics.AndroidHaptics.Reject,
  error: Haptics.AndroidHaptics.Reject,
};

export const triggerHaptic = (intent: HapticIntent = 'press') => {
  if (Platform.OS === 'web') {
    return;
  }

  const result =
    Platform.OS === 'android'
      ? Haptics.performAndroidHapticsAsync(androidHaptics[intent])
      : iosHaptics[intent]();

  result.catch(() => {});
};

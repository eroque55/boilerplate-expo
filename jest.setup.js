jest.mock('react-native-keyboard-controller', () =>
  require('react-native-keyboard-controller/jest'),
);

jest.mock('react-native-worklets', () =>
  require('react-native-worklets/src/mock'),
);

jest.mock('react-native-mmkv', () => {
  const storageMap = new Map();

  const mmkvMock = {
    set: jest.fn((key, value) => storageMap.set(key, value)),
    getString: jest.fn(key => storageMap.get(key)),
    getBoolean: jest.fn(key => storageMap.get(key)),
    getNumber: jest.fn(key => storageMap.get(key)),
    delete: jest.fn(key => storageMap.delete(key)),
    contains: jest.fn(key => storageMap.has(key)),
    clearAll: jest.fn(() => storageMap.clear()),
    getAllKeys: jest.fn(() => Array.from(storageMap.keys())),
  };

  return {
    MMKV: jest.fn(() => mmkvMock),
    createMMKV: jest.fn(() => mmkvMock),
  };
});

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(() => Promise.resolve()),
  notificationAsync: jest.fn(() => Promise.resolve()),
  selectionAsync: jest.fn(() => Promise.resolve()),
  performAndroidHapticsAsync: jest.fn(() => Promise.resolve()),
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy',
    Soft: 'soft',
    Rigid: 'rigid',
  },
  NotificationFeedbackType: {
    Success: 'success',
    Warning: 'warning',
    Error: 'error',
  },
  AndroidHaptics: {
    Confirm: 'confirm',
    Reject: 'reject',
    Gesture_Start: 'gesture-start',
    Gesture_End: 'gesture-end',
    Toggle_On: 'toggle-on',
    Toggle_Off: 'toggle-off',
    Clock_Tick: 'clock-tick',
    Context_Click: 'context-click',
    Drag_Start: 'drag-start',
    Keyboard_Tap: 'keyboard-tap',
    Keyboard_Press: 'keyboard-press',
    Keyboard_Release: 'keyboard-release',
    Long_Press: 'long-press',
    Virtual_Key: 'virtual-key',
    Virtual_Key_Release: 'virtual-key-release',
    No_Haptics: 'no-haptics',
    Segment_Tick: 'segment-tick',
    Segment_Frequent_Tick: 'segment-frequent-tick',
    Text_Handle_Move: 'text-handle-move',
  },
}));

jest.mock('expo-secure-store', () => {
  const store = new Map();

  return {
    getItem: jest.fn(key => store.get(key) ?? null),
    setItem: jest.fn((key, value) => {
      store.set(key, value);
    }),
    getItemAsync: jest.fn(key => Promise.resolve(store.get(key) ?? null)),
    setItemAsync: jest.fn((key, value) => {
      store.set(key, value);
      return Promise.resolve();
    }),
    deleteItemAsync: jest.fn(key => {
      store.delete(key);
      return Promise.resolve();
    }),
    isAvailableAsync: jest.fn(() => Promise.resolve(true)),
    WHEN_UNLOCKED_THIS_DEVICE_ONLY: 'whenUnlockedThisDeviceOnly',
  };
});

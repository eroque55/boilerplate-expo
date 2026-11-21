/**
 * Merges React Native's lazy root exports with `react-native-css/components`.
 *
 * `react-native-css@3.0.x` hardcodes a React Native 0.81 export list in
 * `react-native-css/components`, omitting exports added in React Native 0.88
 * (such as `NativeComponentRegistry`, called at import time by Expo Router 58's
 * `ActivityContents`). Copying property descriptors preserves lazy getters
 * without triggering deprecated or removed module getters on startup.
 */
const rnDescriptors = Object.getOwnPropertyDescriptors(require('react-native'));
const cssDescriptors = Object.getOwnPropertyDescriptors(
  require('react-native-css/components'),
);

const mergedDescriptors = { ...rnDescriptors };

for (const [key, descriptor] of Object.entries(cssDescriptors)) {
  if (!(key in rnDescriptors) || rnDescriptors[key].enumerable) {
    mergedDescriptors[key] = descriptor;
  }
}

module.exports = Object.defineProperties({}, mergedDescriptors);

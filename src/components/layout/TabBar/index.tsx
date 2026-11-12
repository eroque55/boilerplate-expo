import { View } from 'react-native';

import TabBarItem from './TabBarItem';

const TabBar = () => {
  return (
    <View
      className="w-full flex-row items-end justify-between gap-3 border-t border-neutral-200 bg-white px-6 py-3
        dark:border-neutral-600 dark:bg-neutral-800"
    >
      <TabBarItem href="/(main)/home" icon="PadlockIcon" label="Início" />
    </View>
  );
};

export default TabBar;

import { View, ViewProps } from 'react-native';

/**
 * react-native-svg-transformer does not run in the Jest pipeline, so `.svg`
 * imports would arrive as objects and break any component rendering an Icon.
 * Mapped in jest.config.js.
 */
const SvgMock = (props: ViewProps) => <View {...props} />;

export default SvgMock;

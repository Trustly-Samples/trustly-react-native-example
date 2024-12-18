/**
 * @format
 * @flow strict
 */

// $FlowFixMe[nonstrict-import]
import { StyleSheet } from 'react-native';
// $FlowFixMe[nonstrict-import]
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

type StylesProp = { [key: string]: ViewStyleProp };

const Styles: StylesProp = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#fff',
    gap: 16,
    justifyContent: 'center',
    paddingBlock: 64,
    paddingInline: 16,
  },
  view: {
    borderWidth: 1,
    borderColor: 'black',
    height: '50%',
    width: '100%',
  },
});

export default Styles;

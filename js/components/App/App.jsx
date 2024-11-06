/**
 * @format
 * @flow strict
 */
/* eslint-disable import/no-unresolved */

import React, { StrictMode } from 'react';
// $FlowFixMe[nonstrict-import]
import { ScrollView, View } from 'react-native';
// $FlowFixMe[cannot-resolve-module]
import { TrustlyLightbox, TrustlyWidget } from 'trustly-react-native-sdk';

import type { Node } from 'react';

import EstablishData from '../../constants/EstablishData';

import Styles from './App.styles';

export default function App(): Node {
  return (
    <StrictMode>
      <ScrollView contentContainerStyle={Styles.container}>
        <View style={Styles.view}>
          <TrustlyWidget establishData={EstablishData} />
        </View>
        <View style={Styles.view}>
          <TrustlyLightbox establishData={EstablishData} />
        </View>
      </ScrollView>
    </StrictMode>
  );
}

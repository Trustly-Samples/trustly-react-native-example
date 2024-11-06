/**
 * @format
 * @flow strict
 */
/* eslint-disable import/no-unresolved */

// $FlowFixMe[untyped-import]
import { render } from '@testing-library/react-native';
import React from 'react';
// $FlowFixMe[cannot-resolve-module]
import { TrustlyWidget } from 'trustly-react-native-sdk';

import App from './App';

import EstablishData from '../../constants/EstablishData';

jest.mock(
  'trustly-react-native-sdk',
  () => {
    return {
      TrustlyLightbox: jest.fn(() => null),
      TrustlyWidget: jest.fn(() => null),
    };
  },
  { virtual: true },
);

describe('render widget properly', () => {
  it('should render successfully', () => {
    render(<App />);
    expect(TrustlyWidget).toHaveBeenCalled();
  });

  it('should render with correct props', () => {
    render(<App />);
    expect(TrustlyWidget).toHaveBeenCalledWith(
      expect.objectContaining({ establishData: EstablishData }),
      {},
    );
  });
});

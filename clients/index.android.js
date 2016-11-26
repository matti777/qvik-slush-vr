/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
} from 'react-native';

import MainView from './view';

class VRFun extends Component {
  render() {
    return (
      <MainView />
    );
  }
}

AppRegistry.registerComponent('VRFun', () => VRFun);

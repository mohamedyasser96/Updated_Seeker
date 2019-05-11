import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator, NavigationActions } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import LinksScreen from '../screens/LinksScreen';
import SettingsScreen from '../screens/SettingsScreen';
import Payment from '../app/components/Pay'

const HomeStack = createStackNavigator({
  Home: HomeScreen,
  
  Pay: Payment
});

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  headerLeft: null,
  headerVisible: false,
  header: null,
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-information-circle${focused ? '' : '-outline'}`
          : 'md-information-circle'
      }
    />
  ),
};

const LinksStack = createStackNavigator({
  Links: LinksScreen,
  //headerLeft: null
});

LinksStack.navigationOptions = {
  tabBarLabel: 'Requests',
  headerLeft: null,
  headerVisible: false,
  header: null,
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-link' : 'md-link'}
    />
  ),
};

const SettingsStack = createStackNavigator({
  Settings: SettingsScreen,
  //headerLeft: null
});

SettingsStack.navigationOptions = {
  tabBarLabel: 'Settings',
  headerLeft: null,
  header: null,
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'}
    />
  ),
};

export default createBottomTabNavigator({
  HomeStack,
  LinksStack,
  SettingsStack,
});

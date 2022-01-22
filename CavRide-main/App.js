import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Button, ProgressViewIOSComponent, TextInput } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import homescreen from './components/homescreen'
import findride from './components/findride'
import makeride from './components/makeride'
import profile from './components/profile'
import login from './components/login'
import rideDetails from './components/rideDetails'
import mytrips from './components/mytrips';
import AppTab from './AppTab';


const RootStack = createStackNavigator()

const MyTheme = {
  dark: false,
  colors: {
    primary: 'rgb(229, 114, 0)',
    background: 'rgb(242, 242, 242)',
    card: 'rgb(35, 45, 75)',
    text: 'rgb(229, 114, 0)',
    border: 'rgb(199, 199, 204)',
    notification: 'rgb(255, 69, 58)',
  },
};

export default function App() {
  return (
      <NavigationContainer theme={MyTheme}>
        <RootStack.Navigator initialRouteName="Log In" screenOptions={{headerShown: false}}>
          <RootStack.Screen name="Log In" component={login}/>
          <RootStack.Screen name="AppTab" component={AppTab}/>
        </RootStack.Navigator>
      </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

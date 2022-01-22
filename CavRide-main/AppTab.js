import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Button, ProgressViewIOSComponent, TextInput } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import homescreen from './components/homescreen'
import findride from './components/findride'
import makeride from './components/makeride'
import profile from './components/profile'
import login from './components/login'
import rideDetails from './components/rideDetails'
import mytrips from './components/mytrips';
import Icon from 'react-native-vector-icons/Feather';
import { createStackNavigator } from '@react-navigation/stack';

const RootStack = createBottomTabNavigator()
const ProfileStack = createStackNavigator()

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

function MyRides(props){
  return (
    <ProfileStack.Navigator initialRouteName="profile" screenOptions={{headerShown: false}}>
      <ProfileStack.Screen name="profile" component={profile} initialParams={{useruid:props.route.params.useruid}}/>
      <ProfileStack.Screen name="Details" component={rideDetails}/>
    </ProfileStack.Navigator>

  )
}

export default function AppTab(props) {
  return (
        <RootStack.Navigator 
          screenOptions={({route})=>({
            tabBarIcon: ({focused, color, size})=>{
              let iconName
              let col = color
              if(route.name === 'Find Ride'){
                iconName = "search"
                col = "#E57200"
              }else if(route.name === 'Profile'){
                iconName = "user"
                col = "#E57200"
              }else{
                iconName = "navigation"
                col = "#E57200"
              }
              return <Icon name={iconName} size={size} color={col}/>
            },
            "tabBarActiveTintColor": "#E57200",
            "tabBarInactiveTintColor": "gray",
            "tabBarStyle": [
              {
                "display": "flex"
              },
              null
              ]  
          })}
          initialRouteName="Find Ride">
          <RootStack.Screen name="Profile" component={MyRides} initialParams={{useruid:props.route.params.useruid}}/>
          <RootStack.Screen name="Find Ride" component={homescreen} initialParams={{useruid:props.route.params.useruid}}/>
          <RootStack.Screen name="Make Ride" component={makeride} initialParams={{useruid:props.route.params.useruid}}/>
        </RootStack.Navigator>
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
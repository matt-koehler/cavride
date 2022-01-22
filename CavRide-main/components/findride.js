import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import RideList from './ride'
import * as firebase from 'firebase'
import {updateDoc, arrayUnion} from 'firebase/firestore'

export default function findride(props) {

  var uid = props.route.params.useruid;

  const [rides, setRides] = useState([]);

  let checkRide = id => {
    setRides(
        rides.map(ride => {
            if (ride.key === id)ride.checked = !ride.checked;
            return ride;
        })
    );
  };

  let showInterest = id => {
      setRides(
          rides.map(ride => {
              if (ride.key === id)
                  if (ride.interested.includes(uid)){
                      ride.interested.splice(ride.interested.indexOf(uid),1)
                  }
                  else{
                      ride.interested.push(uid)
                  }
              return ride;
          })
      );
  };

  return (
    <View style={styles.container}>
      <View>
      <ScrollView>
        {rides.map(item => (
            <RideList 
                //move this scrollview to another screen, and make the onPress above go there.
                //text={item.text}
                key={item.key}
                checked={item.checked}
                home={item.home}
                dest={item.dest}
                from={item.from}
                to={item.to}
                open={item.open}
                current={item.current}
                interested={item.interested}
                driver = {item.driver}
                setChecked={() => checkRide(item.key)}
                //deleteRide={() => deleteRide(item.key)}
                setInterested={() => showInterest(item.key)}
            />
          ))}
      </ScrollView>
      </View>
      <StatusBar style="auto"/>
    </View>
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

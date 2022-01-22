import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import * as firebase from 'firebase';

export default function mytrips(props) {

  var uid = props.route.params.useruid;
  const db = firebase.firestore();

  let [rides, setRides] = useState([]);
  const ridesRef = db.collection("rides");

  useEffect(()=>{
    var rideObj = [];
    let mounted = true;
    // Create a query against the collection.
    ridesRef.where("driver", "==", uid)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          //console.log(doc.data());
            rideObj.push(doc.data());
        });
        if(mounted){
          setRides(rideObj);
        }
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
      return () => mounted = false;
  },[])

  return (
    <View style={styles.container}>
      <Text style={{color:"green", fontSize: 30}}>Home Screen</Text>
      <View>
        <Text>My Trips</Text>
        {rides.map(ride=><RideView item={ride}/>)}
      </View>
      <StatusBar style="auto"/>
    </View>
  );
}

class RideView extends React.Component{
  render(){
      var ride = this.props.item;
      return (<Text>{ride.destination}</Text>);
  }
}

const styles = StyleSheet.create({
 container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
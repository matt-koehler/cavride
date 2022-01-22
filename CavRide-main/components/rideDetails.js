import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, Button, Pressable, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import * as firebase from 'firebase'

var ridGlobal
var ori
var dest
var depart
var spots
const db = firebase.firestore();

var uidGlobal

export default function rideDetails(props){


  var uid = props.route.params.useruid;
  uidGlobal = uid
  var rid = props.route.params.rideInfo.rideid;
  ori = props.route.params.rideInfo.origin;
  dest = props.route.params.rideInfo.destination;
  depart = props.route.params.rideInfo.departure;
  spots = props.route.params.rideInfo.spotsOpen;

  ridGlobal = rid

  //console.log("Ride id -> " + rid)

  let [ride, setRide] = useState([]);
  let [re, setRe] = useState(false);
  const rideRef = db.collection("rides").doc(rid);

  useEffect(()=>{
    var rideObj = [];
    let mounted = true;
    // Create a query against the collection.
    rideRef
      .get()
      .then((querySnapshot) => {   
        rideObj.push(querySnapshot.data());
        //console.log(rideObj[0]["interestedRiders"])

        if(mounted)
          setRide(rideObj[0]["interestedRiders"]);
          //console.log(ride)
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
      return () => mounted = false;
  },[re])

  //console.log(ride)
 

  /*
  useEffect(()=>{
    var r = []
    rideRef.get()
      .then((querySnapshot) => {
        r = querySnapshot.data()
        console.log("Ride -> " + r)
        setRide(r)  
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  },[])
  */
  


  if(ride)
  {
    var riders = ride

    return (
      <View style={styles.container}>
        <View style={styles.mid_sec}>
          <View style={styles.title}>
            <Text style={styles.name2}> Interested Riders </Text>
          </View>

          <ScrollView style={styles.scrollView}>
            {riders.map(rider=><RideView item={rider} key={rider.uid} navigate={props.navigation.navigate} callRe={setRe} r={re}/>)}
          </ScrollView>
        </View>
      </View>
  )
  }
  else
  {
    return (
      <View style={styles.container}>
        <View style={styles.mid_sec}>
          <View style={styles.title}>
            <Text style={styles.name2}> No Interested Riders </Text>
          </View>
        </View>
      </View>
  )
  
  }
  ;}


  class RideView extends React.Component{
    render(){
      var rider = this.props.item;
      return (
      <View style={{
        borderWidth: 1,
        borderColor: "black",
        alignSelf: "stretch",
        textAlign: "center",
        }}>
        <Image style={styles.avatar} source={{uri: rider.picture}}/>
        <Text style={styles.entry}>
          {"First name: "+rider.fname}
        </Text>
        <Text style={styles.entry}>
          {"Last name: "+rider.lname}
        </Text>
        <Text style={styles.entry}>
          {"Email: "+rider.email}
        </Text>

        <View style={{ flexDirection:"row", justifyContent: "center", }}>
            <View style={styles.buttonStyle}>
              <Pressable style={styles.button2} onPress={()=> {
                  const userRef = db.collection('users').doc(rider.uid)
                  var rideInfo = {rid: ridGlobal, origin: ori, destination: dest, departure: depart}
                  userRef.update({ridesJoined: firebase.firestore.FieldValue.arrayUnion(rideInfo)})

                  //Remove rider from interested riders list
                  const rideRef = db.collection('rides').doc(ridGlobal)
                  rideRef.update({
                  "interestedRiders": firebase.firestore.FieldValue.arrayRemove(rider),  
                  });
                  rideRef.set({
                  "spotsOpen": firebase.firestore.FieldValue.increment(-1)},
                  {merge: true}
                  )
                  this.props.callRe(!this.props.r)
              }
            }>
                <Text  style={{color: "white", fontWeight: 'bold'}}>Accept</Text>
             </Pressable>
            </View>

            <View style={styles.buttonStyle}>
              <Pressable style={styles.button1} onPress={()=> {
                //Remove rider from interested riders list
                const rideRef = db.collection('rides').doc(ridGlobal)
                rideRef.update({
                "interestedRiders": firebase.firestore.FieldValue.arrayRemove(rider)
                });
                this.props.callRe(!this.props.r)
              }
            }>
                <Text  style={{color: "white", fontWeight: 'bold'}}>Decline</Text>
              </Pressable>
            </View>
        </View>
      </View>);
    }
  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: "100%",
    height: "100%",
    backgroundColor: "white"

  },
  header:{
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: 'flex-start',
    alignItems: "center",
    width: "100%",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 70,
    borderWidth: 4,
    borderColor: 'rgb(229, 114, 0)',
    marginTop:10,
    marginBottom:10,
    alignSelf:'center',
  },
  info_container: {
    backgroundColor: 'white',
    justifyContent: "center",
    height: 100,
    width: "80%",
    marginLeft: 20 
  },
  name:{
    fontSize:15,
    color:'black',
    fontWeight:'500',
  },
  name2:{
    fontSize:20,
    color:'black',
    fontWeight:'800',
  },
  entry:{
    fontSize:14,
    color:"black",
    fontWeight:'500',
  },
  mid_sec:{
    marginTop:20,
    backgroundColor: "white",
    width: "90%",
    height: "80%"
  },
  title:{
    backgroundColor: "white",
    width: "80%",
    height: 50,
    marginTop:10,
    marginBottom: 10,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  bodyContent: {
    flex: 1,
    alignItems: 'center',
    padding:0
  },
  info:{
    fontSize:16,
    color: "#232d4b",
    marginTop:0
  },
  button1: {
    alignItems: 'center',
    backgroundColor: 'red',
    justifyContent: 'center',
    paddingVertical: 10,
    marginTop: 15,
    marginBottom: 10,
    paddingHorizontal: 24,
    borderRadius: 4,
  },
  button2: {
    alignItems: 'center',
    backgroundColor: 'green',
    justifyContent: 'center',
    paddingVertical: 10,
    marginTop: 15,
    marginRight: 20,
    marginBottom: 10,
    paddingHorizontal: 24,
    borderRadius: 4,
  },
});
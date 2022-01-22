import React, { useEffect, useState, useCallback } from 'react';
import {useFocusEffect} from '@react-navigation/native'
import { StyleSheet, Text, View, Image, Button, Pressable, TextInput, ScrollView, TouchableOpacity,Dimensions } from 'react-native';
import * as firebase from 'firebase'
import Icon from 'react-native-vector-icons/Feather';

var uidGlobal
var width = Dimensions.get('window').width

export default function profile(props){

  var uid = props.route.params.useruid;
  uidGlobal = uid
  const db = firebase.firestore();

  let [info, setInfo] = useState([]);
  const [reload, setReload] = useState(false);
  let [rides2, setRides2] = useState([]);
  const usersRef = db.collection("users").doc(uid);

  useFocusEffect(
    useCallback(()=>{
    var user
    usersRef.get()
      .then((querySnapshot) => {
        user = querySnapshot.data()
      
        if(user.phone == null)
          user.phone = "(xxx) xxx - xxxx"
        setInfo(user)
        setRides2(user["ridesJoined"])
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
    },[reload, props.route.params.newRel])
  );


  let [rides, setRides] = useState([]);
  const ridesRef = db.collection("rides");

  // useEffect(()=>{
  //   var rideObj = [];
  //   let mounted = true;
  //   // Create a query against the collection.
  //   ridesRef.where("driver", "==", uid)
  //     .get()
  //     .then((querySnapshot) => {
  //       querySnapshot.forEach((doc) => {
  //         //console.log(doc.data());
  //           rideObj.push(doc.data());
  //           //console.log(rideObj)
  //       });
  //       if(mounted){
  //         setRides(rideObj);
  //       }
  //     })
  //     .catch((error) => {
  //       console.log("Error getting documents: ", error);
  //     });
  //     return () => mounted = false;
  // },[])

  useFocusEffect(
    useCallback(()=>{
    var rideObj = [];
    let mounted = true;
    // Create a query against the collection.
    ridesRef.where("driver", "==", uid)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          //console.log(doc.data());
            rideObj.push(doc.data());
            //console.log(rideObj)
        });
        if(mounted){
          setRides(rideObj);
        }
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
      return () => {
        mounted = false;
      }
    },[reload, props.route.params.newRel])
  );

  return (
      <View style={styles.container}>
          <View style={styles.header}>
            <Image style={styles.avatar} source={{uri: info.picture}}/>
            <View style={styles.info_container}>
              <Text style={styles.name}>{info.firstName} {info.lastName}</Text>
              <Text style={styles.name}>{info.email} </Text>
              <Text> {info.phone}</Text>
            </View>
          </View>

        <View style={styles.mid_sec}>
          <View style={styles.title}>
            <Text style={styles.name2}> Rides Offered </Text>
          </View>

          <ScrollView style={styles.scrollView}>
            {rides.map(ride=><RideView item={ride} key={ride.key} navigate={props.navigation.navigate} rel={setReload} r={reload}/>)}
          </ScrollView>
          </View>

          <View style={styles.mid_sec}>
          <View style={styles.title}>
            <Text style={styles.name2}> Rides Joined </Text>
          </View>

          <ScrollView style={styles.scrollView}>
            {rides2.map(ride2=><RideView2 item={ride2} key={ride2.rid} navigate={props.navigation.navigate}/>)}
          </ScrollView>
       
        </View>

      </View>
  );}
  
  
  
  class RideView extends React.Component{
    render(){
        var ride = this.props.item;
        return (
        <View style={{
          borderWidth: 2,
          borderColor:"#232D4B",
          textAlign: "center",
          width:"100%",
          marginBottom:5,
          backgroundColor:"white"
          }}>
        <View style={{   
         // flex: 1,
          alignSelf:'center',
          top:10,
          }}>
        <Text style={{color:"#232D4B"}}>
          {ride.origin}
        </Text></View>
        <View style={{   
        //  flex: 1,
          alignSelf:'center',
          marginTop:0,
          top:15
          }}>
        <Icon name="arrow-down" size={25} color="#E57200"/></View>
        <View style={{   
        //  flex: 1,
          alignSelf:'center',
          top:15
          }}>
        <Text style={{color:"#232D4B"}}>
          {ride.destination}
        </Text></View>
        <View style={{ flexDirection: 'row', alignSelf:'center',marginTop:10,top:15}}>
          <Icon name="clock" size={20} color="#E57200" />
          <Text style={{
            color:'#232D4B'}}>
            {ride.departure}
         </Text>
         </View>
         <View style={{   
          alignSelf:'flex-end',
          bottom:50,
          right:10
          }}>
        <Text style={{color:"#232D4B"}}>
          {"Seats Left: "+ride.spotsOpen}
        </Text></View>
        <View style={{   
          alignSelf:'flex-end',
          bottom:30,
          right:10
          }}></View>

        <View style={{ flexDirection:"row", justifyContent: "center", }}>
            <View style={styles.buttonStyle}>
              <Pressable style={styles.button2} onPress={()=> {
              this.props.navigate("Details", {useruid: uidGlobal, rideInfo: {rideid: ride.key.toString(), origin: ride.origin, destination: ride.destination, departure: ride.departure, spots: ride.spotsOpen}})
             } 
             }>
                <Text  style={{color: "white", fontWeight: 'bold'}}>Details</Text>
             </Pressable>
            </View>

            <View style={styles.buttonStyle}>
              <Pressable style={styles.button1} onPress={()=> {
                firebase.firestore().collection("rides").doc(ride.key.toString()).delete()
                //this.props.navigation.navigate("Profile", {useruid: uid})
                this.props.rel(!this.props.r)
              }
              }>
                <Text  style={{color: "white", fontWeight: 'bold'}}>Delete</Text>
              </Pressable>
            </View>
        </View>
        </View>);
    }
  }

  class RideView2 extends React.Component{
    render(){
        var ride = this.props.item;
        
        return (
          <View style={{
            borderWidth: 2,
            borderColor:"#232D4B",
            textAlign: "center",
            width:"100%",
            height: 120,
            marginBottom:5,
            backgroundColor:"white"
            }}>
          <View style={{   
           // flex: 1,
            alignSelf:'center',
            top:10,
            }}>
          <Text style={{color:"#232D4B"}}>
            {ride.origin}
          </Text></View>
          <View style={{   
          //  flex: 1,
            alignSelf:'center',
            marginTop:0,
            top:15
            }}>
          <Icon name="arrow-down" size={25} color="#E57200"/></View>
          <View style={{   
          //  flex: 1,
            alignSelf:'center',
            top:15
            }}>
          <Text style={{color:"#232D4B"}}>
            {ride.destination}
          </Text></View>
          <View style={{ flexDirection: 'row', alignSelf:'center',marginTop:10,top:15}}>
            <Icon name="clock" size={20} color="#E57200" />
            <Text style={{
              color:'#232D4B'}}>
              {ride.departure}
           </Text>
           </View>
          <View style={{   
            alignSelf:'flex-end',
            bottom:30,
            right:10
            }}></View>

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
    color:"#232D4B",
    fontWeight:'800',
  },
  entry:{
    fontSize:14,
    color:"black",
    fontWeight:'500',
  },
  mid_sec:{
    marginTop:10,
    backgroundColor: "white",
    width: "90%",
    height: "40%"
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
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {useFocusEffect} from '@react-navigation/native'
import { useEffect, useState, useCallback } from 'react';
import { StyleSheet, Text, View, Button, TextInput, Pressable, TouchableOpacity,Image, ScrollView, Dimensions, TouchableWithoutFeedback,Keyboard} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import * as firebase from 'firebase';

var width = Dimensions.get('window').width
var uidGlobal
var user
var arr

const DismissKeybaord = ({ children }) =>(
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      {children}
  </TouchableWithoutFeedback>
);


export default function homescreen(props) {
  var uid = props.route.params.useruid;
  uidGlobal = uid
  const db = firebase.firestore();

  let [rides, setRides] = useState([]);
  const ridesRef = db.collection("rides");

  //let [clicked, setClick] = useState(false);
  let [startPlace, setStart] = useState("");
  let [endPlace, setEnd] = useState("");

  let [originFilter, setOrigin] = useState("");
  let [destFilter, setDest] = useState("");
  /*
  useEffect(()=>{
    var rideObj = [];
    let mounted = true;
    // Create a query against the collection.
    ridesRef.where("driver", "!=", uid).where("origin", "==", originFilter)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          //.where("departure", ">=", filterStart).where("departure", "<=", filterEnd).where("departure", ">=", startTime).where("departure", "<=", endTime)
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
  },[originFilter])
  */
  useEffect(()=>{
    var rideObj = [];
    let mounted = true;
    // Create a query against the collection.
    
    if(originFilter!="" && destFilter!=""){
      ridesRef.where("driver", "!=", uid)//.where("destination", "==", destFilter).where("origin", "==", originFilter)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            //.where("departure", ">=", filterStart).where("departure", "<=", filterEnd).where("departure", ">=", startTime).where("departure", "<=", endTime)
            d = doc.data()
            //console.log("d = ", d)
            if(d["origin"].trim().toLowerCase()==originFilter.trim().toLowerCase() && d["destination"].trim().toLowerCase()==destFilter.trim().toLowerCase()){
              rideObj.push(d);
            }
          });
          if(mounted){
            setRides(rideObj);
          }
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
        });
        return () => mounted = false;
    }
    else if(originFilter!=""){
      ridesRef.where("driver", "!=", uid)//.where("origin", "==", originFilter)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            //.where("departure", ">=", filterStart).where("departure", "<=", filterEnd).where("departure", ">=", startTime).where("departure", "<=", endTime)
            d = doc.data()
            //console.log("d = ", d)
            if(d["origin"].trim().toLowerCase()==originFilter.trim().toLowerCase()){
              rideObj.push(d);
            }
          });
          if(mounted){
            setRides(rideObj);
          }
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
        });
        return () => mounted = false;
    }
    else if(destFilter!=""){
      ridesRef.where("driver", "!=", uid)//.where("destination", "==", destFilter)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            //.where("departure", ">=", filterStart).where("departure", "<=", filterEnd).where("departure", ">=", startTime).where("departure", "<=", endTime)
            d = doc.data()
            //console.log("d = ", d)
            if(d["destination"].trim().toLowerCase()==destFilter.trim().toLowerCase()){
              rideObj.push(d);
            }
          });
          if(mounted){
            setRides(rideObj);
          }
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
        });
        return () => mounted = false;
    }
    else{
      ridesRef.where("driver", "!=", uid)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            //.where("departure", ">=", filterStart).where("departure", "<=", filterEnd).where("departure", ">=", startTime).where("departure", "<=", endTime)
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
    }
  },[destFilter, originFilter])

  useFocusEffect(
    useCallback(()=>{
        var rideObj = [];
        let mounted = true;
        // Create a query against the collection.
        ridesRef.where("driver", "!=", uid)
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
  );
  // useEffect(()=>{
  //   var rideObj = [];
  //   let mounted = true;
  //   // Create a query against the collection.
  //   ridesRef.where("driver", "!=", uid)
  //     .get()
  //     .then((querySnapshot) => {
  //       querySnapshot.forEach((doc) => {
  //         //console.log(doc.data());
  //           rideObj.push(doc.data());
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
  //},[ridesRef])


  let [info, setInfo] = useState([]);
  const usersRef = firebase.firestore().collection("users").doc(uidGlobal)

  useEffect(()=>{
    usersRef.get()
      .then((querySnapshot) => {
        user = querySnapshot.data()
      
        if(user.phone == null)
          user.phone = "(xxx) xxx - xxxx"

        setInfo(user)

      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  },[])

  arr = info["ridesJoined"]

  function addFilter(origin, destination){
    setOrigin(origin)
    setDest(destination)
    /*
    if(origin!="" && destination!=""){
      console.log("Where Origin is ", origin, ", and Destination is ", destination)
      setTotal(origin, destination)
    }
    else if(origin!=""){
      console.log("Where Origin is ", origin)
      setOrigin(origin)
    }
    else if(destination!=""){
      console.log("Where Destination is ", destination)
      setDest(destination)
    }
    else{
      console.log("Nothing to add")
    }
    */
  }

  return (
    <View style={styles.container}>
          <View style={styles.inputContainer}>
                <TextInput
                    style={styles.textInput}
                    placeholder="Search By Origin"
                    placeholderTextColor="#abbabb"
                    startPlace={startPlace}
                    onChangeText={startPlace => setStart(startPlace)}
                />
          </View>
          <View style={styles.inputContainer}>
                <TextInput
                    style={styles.textInput}
                    placeholder="Search By Destination"
                    placeholderTextColor="#abbabb"
                    endPlace={endPlace}
                    onChangeText={endPlace => setEnd(endPlace)}
                />
          </View>
          
          <Pressable style={styles.button} onPress={() => {addFilter(startPlace,endPlace)}}>
                <Text  style={{color: 'white', fontWeight: 'bold'}}>Find</Text>
          </Pressable>

      <ScrollView style={styles.scrollView}>
        {rides.map(ride=>
          <RideView item={ride} key={ride.key} navigate={props.navigation.navigate}
        />)}
      </ScrollView>
      {/* <View style = {styles.bottom0}>
      <TouchableOpacity>
                    <Icon name="user" size={50} color="#232D4B"/>
        </TouchableOpacity>
      <View style = {styles.bottom1}>
        <TouchableOpacity onPress={() => props.navigation.navigate("Profile", {useruid: uid})}>
                    <Icon name="user" size={50} color="#E57200"/>
        </TouchableOpacity>
      </View>
        <View style = {styles.bottom2}>
        <TouchableOpacity onPress={() => props.navigation.navigate("Make Ride", {useruid: uid})}>
                    <Icon name="navigation" size={50} color="#E57200"/>
        </TouchableOpacity>
        </View>
        </View> */}
      <StatusBar style="auto"/> 
    </View>
  );
}

class RideView extends React.Component{

  render(){
      var ride = this.props.item;
      var joined = false

      for(var i in arr)
      {
        //console.log(arr[i] + "===" + ride.key)
        if(arr[i].rid == ride.key)
        {
          //console.log("Equal!")
          joined = true
        }
      }

      //console.log(joined)

      return (
      <View style={{
        flexDirection:'column',
        backgroundColor: 'white',
        width: width,
        marginBottom:10,
        }}>
        <View style={{   
         // flex: 1,
          position: 'absolute',
          bottom: 20,
          left:0,
          marginBottom:20}}>
        <Image style={styles.avatar} source={{uri: ride.driverProfilePic}}/></View>
        <View style={{   
         // flex: 1,
          position: 'absolute',
          bottom: 0,
          left:0,
          margin:0}}>
        <Text style={styles.name}>{ride.driverFirstName} {ride.driverLastName}</Text></View>
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
          {"Seats: "+ride.spotsOpen}
        </Text></View>
        <View style={{   
          alignSelf:'flex-end',
          bottom:30,
          right:10
          }}>

          <Button title="JOIN" color='#E57200' disabled = {(((ride.spotsOpen > 0) ? false : true) || joined)} onPress={()=> {
          //console.log(uidGlobal)
          //const usersRef = db.collection('users').doc(uid)
          //usersRef.update({
              //ridesJoined: firebase.firestore.FieldValue.arrayUnion(docRef.id)
          //})

          //console.log(user)

          var intRider = {uid: uidGlobal, fname: user.firstName, lname: user.lastName, picture: user.picture, email: user.email}

          const ridesRef = firebase.firestore().collection("rides").doc(ride.key.toString())
          ridesRef.update({
              interestedRiders: firebase.firestore.FieldValue.arrayUnion(intRider)
          })
          //this.props.navigate("Home", {useruid: uidGlobal})
        }
          }/> 
          </View>
      </View>);
  }
}

const styles = StyleSheet.create({
 container: {
  flex: 1,
  justifyContent: 'flex-end',
  alignItems: 'center',
  
  },
  top: {
    flex: 1,
    justifyContent: 'flex-end',
    position: 'absolute',
    top: 25,
  },
  bottom0:{
    backgroundColor:'#232D4B',
    flex: 1,
    justifyContent: 'flex-end',
    position : 'absolute',
    bottom: 0,
    left:0,
    width:'100%'
  },
  bottom1:{
    backgroundColor:'#232D4B',
    flex: 1,
    justifyContent: 'flex-end',
    position : 'absolute',
    bottom: 0,
    left:50,
  },
  bottom2:{
    backgroundColor:'#232D4B',
    flex: 1,
    justifyContent: 'flex-end',
    position: 'absolute',
    bottom: 0,
    right:50,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 55,
    borderWidth: 1,
    borderColor: "white",
    marginBottom:0,
    marginTop:0
  },
  name:{
    fontSize:22,
    color:"#232D4B",
    fontWeight:'600',
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
  inputContainer: {
    borderBottomColor: '#F5FCFF',
    backgroundColor: '#FFFFFF',
    borderRadius:30,
    borderBottomWidth: 1,
    width:300,
    height:45,
    marginBottom:20,
    flexDirection: 'row',
    alignItems:'center',
    shadowColor: "#808080",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  textInput: {
		flex: 1,
		height: 20,
		fontSize: 18,
		fontWeight: 'bold',
		color: 'black',
		paddingLeft: 10,
		minHeight: '3%',
	},
  button: {
    alignItems: 'center',
    backgroundColor: 'blue',
    justifyContent: 'center',
    paddingVertical: 10,
    marginTop: 0,
    marginBottom: 10,
    paddingHorizontal: 24,
    borderRadius: 4,
  },
  

});

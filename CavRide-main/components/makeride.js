import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Pressable, TouchableOpacity, TouchableWithoutFeedback,Keyboard } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Feather';
import * as firebase from 'firebase'


const DismissKeybaord = ({ children }) =>(
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        {children}
    </TouchableWithoutFeedback>
);


export default function makeride(props) {

    var earliest = new Date()
    var uid = props.route.params.useruid;


    const [endPlace, setEnd] = useState('');
    const [startPlace, setStart] = useState('');
    const [startTime, setArrive] = useState(new Date());
    const [startDate, setLeave] = useState(new Date());
    const [max, setMax] = useState(0);
    const [rel, setRel] = useState(false);
    //const [variable, setVariables] = useState('');
	//const [rides, setRides] = useState([]);

    function addData(){
        setRel(!rel)
        const db = firebase.firestore();
        var ridesRef = db.collection('rides')
        if (startPlace.length > 0 && endPlace.length > 0  && max.length >= 0) {
            var month = (startDate.getMonth()+1)
           // month = month.toString()
            var day = startDate.getDate()
           // day = day.toString()
            var year = startDate.getFullYear()
           // year = year.toString()
            var hours = startTime.getHours()
          //  hours = hours.toString()
            var minutes = startTime.getMinutes()
           // minutes = minutes.toString()
            //var final = date + " " + time
            var dateString = year +'-'+month+'-'+day
            var timeString = hours+':'+minutes+':00'
            var combined = new Date(dateString + 'T'+ timeString)
            var docRef = db.collection("users").doc(uid);
            docRef.get().then((doc) => {
                ridesRef.add({
                    key: "",
                    driver: uid,
                    driverFirstName: doc.data().firstName,
                    driverLastName: doc.data().lastName,
                    driverProfilePic: doc.data().picture,
                    origin: startPlace,
                    destination: endPlace,
                    departure: month+"/"+day+"/"+year + " " + hours+":"+minutes,
                    //departureTS: combined,
                    spotsOpen: Number(max),
                    currentRiders: [],
                    interestedRiders: []
                }).then((docRef)=>{

                    const usersRef = db.collection('users').doc(uid)
                    usersRef.update({
                        ridesOffered: firebase.firestore.FieldValue.arrayUnion(docRef.id)
                    })
                    const ridesRef = db.collection('rides').doc(docRef.id)
                    ridesRef.update({
                        key: firebase.firestore.FieldValue.arrayUnion(docRef.id)
                    })
                }).then(()=>{
                    props.navigation.navigate("Profile", {screen: 'profile', params: {useruid: uid, newRel: rel}})
                }) 
            }).catch((error) => {
                    console.log("Error getting document:", error);
                });
        }
        else{
            //console.log("no ride to make")
        }
}

	//let addRide = () => {
    //    if (startPlace.length > 0 && endPlace.length > 0  && max.length > 0) {
            //setRides([...rides, { home: startPlace, dest: endPlace, from: startDate, to: startTime, open:max, interested: [], current: [], key: createUUID(), checked: false, driver: uid }]);
    //        setVariables('');
    //    }
    //};
    return (
        <DismissKeybaord>
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.textInput}
                    placeholder="Origin"
                    placeholderTextColor="#abbabb"
                    startPlace={startPlace}
                    onChangeText={startPlace => setStart(startPlace)}
                />
            </View>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.textInput}
                    placeholder="Destination"
                    placeholderTextColor="#abbabb"
                    endPlace={endPlace}
                    onChangeText={endPlace => setEnd(endPlace)}
                />
            </View>

            <View style={styles.inputContainer}>
                <TextInput 
                    style={styles.textInput}
                    placeholder="Number of free seats"
                    placeholderTextColor="#abbabb"
                    keyboardType = 'number-pad'
                    max={max}
                    onChangeText={max => setMax(max)}
                />
            </View>

            <View>
                <Text style={styles.text}>Departure Date</Text>
                <DateTimePicker
                    style = {{width:100}}
                    testID = ""
                    minimumDate = {earliest}
                    minimumDate = {new Date()}
                    value={startDate}
                    onChange={(event, startDate)  => setLeave(startDate)}
                />
            </View>

             <View>
                <Text style={styles.text}>Departure Time</Text>
                <DateTimePicker
                    mode = "time"
                    style = {{width:100}}
                    value={startTime}
                    onChange={(event, startTime) => setArrive(startTime)}
                />
            </View>

            <Pressable style={styles.button} onPress={() => {addData();}}>
                <Text  style={{color: 'white', fontWeight: 'bold'}}>Make Ride!</Text>
            </Pressable>

        </View>
        </DismissKeybaord>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
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
    text: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#abbabb',
        marginBottom: 10,
        marginTop: 10,
    },
    button: {
        alignItems: 'center',
        backgroundColor: 'blue',
        justifyContent: 'center',
        paddingVertical: 14,
        marginTop: 24,
        paddingHorizontal: 24,
        borderRadius: 4,
        elevation: 3,
      },
      
});

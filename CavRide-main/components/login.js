import * as React from 'react';
import * as Google from 'expo-auth-session/providers/google';
import * as firebase from 'firebase'
import { View, Button, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';


  var config = {
    apiKey: "AIzaSyCF9TfHWQEJ5K5MykULCtQX9qJCJqZ6iOA",
    authDomain: "cavride-b3ee0.firebaseapp.com",
    projectId: "cavride-b3ee0",
    storageBucket: "cavride-b3ee0.appspot.com",
    messagingSenderId: "474727031419",
    appId: "1:474727031419:web:048df53af2eaa92b9bb8de",
    measurementId: "G-L78KK2TCYJ"
  };

if(firebase.apps.length == 0) {
  firebase.initializeApp(config);
}

export default function login(props) {


  // Do we need this ?
  /*
  [data, setData] = React.useState("loading")

  React.useEffect(()=>{
    queryData()
  },[])

  function queryData(){
    const db = firebase.firestore();
    let characterRef = db.collection('users').doc('mNTJuW2H5fINDpdMZNmq');
    let users = characterRef.get()
      .then(doc => {
        if (!doc.exists) {
          console.log('No such document!');
        } else {
          setData(doc.data());
        }
      })
      .catch(err => {
        console.log('Error getting document', err);
      })
  }
  */
  

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
      clientId: '474727031419-kkdftlilmg5bf7avsog1g4fvq2q556kt.apps.googleusercontent.com', 
      },
  );

  React.useEffect(() => {
    if (response?.type === 'success') {

      const { id_token } = response.params;
      const auth = firebase.auth()
      const provider = new firebase.auth.GoogleAuthProvider();
      const credential = provider.credential(id_token);
      auth.signInWithCredential(credential).then((userCredential)=>{
      
      const first_name = userCredential.additionalUserInfo.profile.given_name
      const last_name = userCredential.additionalUserInfo.profile.family_name
      const email = userCredential.additionalUserInfo.profile.email
      const picture = userCredential.additionalUserInfo.profile.picture
      const phone = userCredential.user.phoneNumber
      const uid = userCredential.user.uid

        const db = firebase.firestore();
        const usersRef = db.collection('users').doc(uid)
        usersRef.get()
        .then((docSnapshot) => {
          if (!docSnapshot.exists) {
            usersRef.set({
              firstName: first_name,
              lastName: last_name,
              email: email,
              phone: phone,
              picture: picture,
              ridesOffered: [],
              ridesJoined: []
            });
          }
          props.navigation.navigate('AppTab', {useruid: uid});
        });
      })
    }
  }, [response]);


  return (
    <View style={styles.container}>
 
      <Image style={styles.image} source={require("../assets/Logo.png")} />

      <FontAwesome5.Button style={styles.googleButton} name="google" onPress={() => {promptAsync();}}>
        <Text>Log In With Google</Text>
      </FontAwesome5.Button>
    </View>
  );
}

      
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000080",
    alignItems: "center",
    justifyContent: "center",
  },
 
  image: {
    marginTop: 0,
    marginBottom: 90,
    height: 200,
    width: 200,
    resizeMode: 'contain'
  },

  TextInput: {
    height: 50,
    color: 'white',
    flex: 1,
    padding: 13,
  },

  loginBtn: {
    width: "60%",
    borderRadius: 10,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 0,
    backgroundColor: "dodgerblue",
  },
});



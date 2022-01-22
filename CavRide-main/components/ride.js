import React from 'react';
import { StyleSheet, Text, View, Button, ProgressViewIOSComponent, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

export default function Ride(props) {

	var uid = props.route.params.useruid;

	return (
		<View style={styles.listContainer} multiline={true}>
			<Icon //
				//name={props.checked ? 'check' : 'square'}
				//size={30}
				//color="black"
				//style={{ marginLeft: 15 }}
				//onPress={props.setChecked}
			/>
			<Icon
				name={(props.interested.includes(uid)) ? 'check' : 'square'}
				size={30}
				color="black"
				style={{ marginLeft: 15 }}
				onPress={props.setInterested}
			/>
			<Text style={styles.listItem}>{props.home}{'->'}{props.dest}</Text>
			<Text style={styles.listItem}>{props.current.length}/{props.open}</Text>
			<Text style={styles.listItem}>{props.interested.toString()}{"are interested"}</Text>
			<Icon
				name="trash-2"
				size={30}
				color="red"
				style={{ marginLeft: 'auto' }}
				onPress={props.deleteRide}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	listContainer: {
		marginTop: '5%',
		flexDirection: 'row',
		borderColor: '#aaaaaa',
		borderBottomWidth: 1.5,
		width: '100%',
		alignItems: 'stretch',
		minHeight: 40
	},
	listItem: {
		paddingBottom: 20,
		paddingLeft: 10,
		marginTop: 6,
		borderColor: 'green',
		borderBottomWidth: 1,
		fontSize: 17,
		fontWeight: 'bold',
		color: 'black'
	}
});
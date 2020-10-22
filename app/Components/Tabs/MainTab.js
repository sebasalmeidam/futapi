import React, {Component} from 'react';
import { 
  AppRegistry, View, Text, StyleSheet, TextInput, TouchableHighlight, 
  AsyncStorage, Alert, ListView } from 'react-native';

class MainTab extends Component {

	redirect(routeName){
    this.props.navigator.push({
      name: routeName,
    });
  }

  render () {
  	return (
  		<View style={styles.container}>
  				<TouchableHighlight style={styles.button}>
	  				<Text style={styles.buttonText} onPress={this.redirect.bind(this, 'players')}>Ver Jugadores</Text>	
	  			</TouchableHighlight>
	  			<TouchableHighlight style={styles.button}>
	  				<Text style={styles.buttonText} onPress={this.redirect.bind(this, 'home')}>Ir a mi Perfil</Text>	
	  			</TouchableHighlight>
  		</View>  		
  		)
  }
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		marginTop: 0,
		height: 40,
		flex: 1
	},
	button: {
		flex: 1,
		borderColor: 'black',
		borderWidth: 1,
		alignSelf: 'stretch',
		justifyContent: 'center',
		borderRadius: 2
	},
	buttonText: {
		alignSelf: 'center'
	},
})

export default MainTab
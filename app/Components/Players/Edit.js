import React, {Component} from 'react';
import { AppRegistry, View, Text, StyleSheet, TextInput, TouchableHighlight, AsyncStorage} from 'react-native';
import EditTab from '../Tabs/EditTab';
import {TextInputMask} from 'react-native-masked-text';

const ACCESS_TOKEN = 'access_token';
const ACCESS_USER = 'access_user';

class Edit extends Component{
	constructor(props){
		super(props);
		this.state = {
			accessToken: this.props.accessToken,
			userId: this.props.userId,
			playerId: this.props.playerId,
      playerName: this.props.playerName,
      playerBuy: this.props.playerBuy.toString(),
      playerSell: this.props.playerSell.toString(),
      playerImg: this.props.playerImg,
      playerTp: this.props.playerTp,
      errors: []
    }
	}

	redirect(routeName, flash){
    this.props.navigator.push({
      name: routeName,
      passProps: {
        flash: flash,
        accessToken: this.state.accessToken,
        userId: this.state.userId,
        playerId: this.state.playerId,
        playerName: this.state.playerName,
        playerImg: this.state.playerImg,
        playerTp: this.state.playerTp,
      }
	  });
  }

	async onUpdatePressed() {
  	let access_token = this.state.accessToken;
  	let access_user = this.state.userId;
  	let access_player = this.state.playerId;
  	
  	try {
			let response = await fetch('http://url/api/players/'+ access_player,  {
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Token token=' + access_token
        },
        body: JSON.stringify({
          'player': this.state.playerName,
          'buy': parseInt(this.state.playerBuy.replace(",","")),
          'sell': parseInt(this.state.playerSell.replace(",","")),
        })
      });
			let res = await response.text();
			if (response.status >= 200 && response.status < 300) {
				console.log("paso primera fase" + res);
				let flash = JSON.stringify(JSON.parse(res).flash);
				this.redirect('show', flash)
			} else {
				let error = res;
        console.log(access_player +" "+ res)

        throw error
			}
  } catch(errors) {
  	let formErrors = JSON.parse(errors).errors;
			
			let errorsArray = [];
			for(let key in formErrors) {
				if (formErrors[key].lenght > 1) {
					formErrors[key].map(error => errorsArray.push(`${key} ${error}`));
				} else {
					errorsArray.push(`${key} ${formErrors[key]}`);
				}
			}
			this.setState({errors: errorsArray});

		}
	}

	render() {

		return(

 			<View style={styles.container}>
        <EditTab
          navigator={this.props.navigator} />
        <View style={styles.bodyContainer} >
          <Text style={styles.heading}>
            Actualizar detalles de Jugador
          </Text>
          <Text>Nombre:</Text>
          <TextInput
            onChangeText={ (text)=> this.setState({playerName: text}) }
            style={styles.input} value={this.state.playerName}>
          </TextInput>

          <Text>Precio de Compra:</Text>
          <TextInputMask
            onChangeText={ (val)=> this.setState({playerBuy: val}) }
            style={styles.input} type={'money'} options={{delimiter: ',', precision: 0, unit: ''}} value={this.state.playerBuy}>
          </TextInputMask>

          <Text>Precio de Venta:</Text>
          <TextInputMask
            onChangeText={ (otro)=> this.setState({playerSell: otro}) }
            style={styles.input} type={'money'} options={{delimiter: ',', precision: 0, unit: ''}} value={this.state.playerSell}>
          </TextInputMask>

           <TouchableHighlight onPress={this.onUpdatePressed.bind(this)} style={styles.button}>
            <Text style={styles.buttonText}>
              Actualizar
            </Text>
          </TouchableHighlight>
         
          <Errors errors={this.state.errors}/>
        </View>
      </View>
		);
	}
}

const Errors = (props) => {
	return (
		<View>
			{props.errors.map((error, i) => <Text key={i} style={styles.error}> {error} </Text> )}
		</View>
	);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  bodyContainer: {
    flex: 9,
    backgroundColor: '#F5FCFF',
    paddingLeft: 20,
    paddingRight: 20,
  //  paddingTop: 15,
  },
  input: {
    height: 50,
    alignSelf: 'stretch',
    marginTop: 10,
    padding: 4,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#48bbec'
  },
  button: {
    height: 50,
    backgroundColor: '#48BBEC',
    alignSelf: 'stretch',
    marginTop: 10,
    justifyContent: 'center'
  },
  buttonText: {
    fontSize: 22,
    color: '#FFF',
    alignSelf: 'center'
  },
  heading: {
    fontSize: 30,
  },
  error: {
    color: 'red',
    paddingTop: 10
  },
  loader: {
    marginTop: 20
  }
});



export default Edit
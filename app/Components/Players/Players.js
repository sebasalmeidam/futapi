import React, {Component} from 'react';
import { 
  AppRegistry, View, Text, StyleSheet, TextInput, TouchableHighlight, 
  AsyncStorage, Alert, ListView, Image } from 'react-native';
import MainTab from '../Tabs/MainTab';
import {TextMask} from 'react-native-masked-text';

const ACCESS_TOKEN = 'access_token';
const ACCESS_USER = 'access_user';

class Players extends Component {

	constructor(props) {
	  super(props);
	
	  this.state = {
	  	accessToken: "",
      userId: "",
      playerId: "",
      dataSource: new ListView.DataSource({
          rowHasChanged: (row1, row2) => row1 !== row2
        }),
        loaded: false
    }
	}

  componentWillMount() {
    this.getToken();
  }

  async getToken() {
    try {
      let accessToken = await AsyncStorage.getItem(ACCESS_TOKEN);
      let userId = await AsyncStorage.getItem(ACCESS_USER);
      if(!accessToken) {
        console.log("Token not set redirecting login")
        this.redirect('signin')
      } else if (!userId) {
        console.log("user not set redirecting login")
        this.redirect('signin')
      } else {
        this.setState({accessToken: accessToken});
        this.setState({userId: userId});
        this.fetchPlayers(accessToken, userId)
      }

    } catch(error) {
      console.log("Something went wrong in getToken " + error )
    }
  }

  async fetchPlayers(token, user) {
    let accessToken = token;
    let userId = user

    try {
      let response = await fetch('http://url/api/players/',  {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Token token=' + accessToken
        }
      })
      let res = await response.text();
      if (response.status >= 200 && response.status < 300) {
        //Verified token means user is logged in so we redirect him to home.
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(JSON.parse(res).players),
          loaded: true
        })
      } else {
          //Handle error
          let error = res;
          throw error;
      }
    } catch(error) {
        console.log("error response: " + error);
    }
  }

  renderLoadingView(){
    return(
      <View style={styles.container}>
        <Text>Actualizando precios de la base de datos...</Text>
      </View>)
  }

   
  redirect(routeName, playerId, playerName, playerCurrent, playerBuy, playerSell, playerBuyed, playerMail, playerImg, playerTp){
    this.props.navigator.push({
      name: routeName,
      passProps: {
        accessToken: this.state.accessToken,
        userId: this.state.userId,
        playerId: playerId,
        playerName: playerName,
        playerCurrent: playerCurrent,
        playerBuy: playerBuy,
        playerSell: playerSell,
        playerBuyed: playerBuyed,
        playerMail: playerMail,
        playerImg: playerImg,
        playerTp: playerTp,
      }
    });

  }  

  
  renderPlayer(player){
    if(player.mail){
      var email = 'Si'
    } else {
      var email = 'No'
    }
    if(player.buyed){
      var buyed = 'Si'
    } else {
      var buyed = 'No'
    };

    let playerImg = player.img;
    let playerId = player.id;
    let playerName = player.player;
    let playerCurrent = player.current;
    let playerBuy = player.buy;
    let playerSell = player.sell;
    let playerBuyed = buyed;
    let playerMail = email;
    let playerTp = player.tp;

    return(
      <TouchableHighlight onPress={this.redirect.bind(this, 'show', playerId, playerName, playerCurrent, playerBuy, playerSell, playerBuyed, playerMail, playerImg, playerTp)}>
        <View style={styles.playersContainer}>
          <View style={styles.imageContainer}>
            <Image source={{uri: playerImg}} style={{height: 70, width: 70}}  />
          </View>
          <View style={styles.descContainer}>
            <Text style={{color: 'blue'}} >{player.player}</Text>
            <Text>Tipo: {player.tp}</Text>
            <Text>Precio Actual: <TextMask value={player.current} type={'money'} options={{delimiter: ',', precision: 0, unit: ''}} /></Text>
            <Text>Precio Compra: <TextMask value={player.buy} type={'money'} options={{delimiter: ',', precision: 0, unit: ''}} /></Text>
            <Text>Precio Venta: <TextMask value={player.sell} type={'money'} options={{delimiter: ',', precision: 0, unit: ''}} /></Text>
            <Text>Notificación Mail: {email}</Text>
            <Text>Comprado: {buyed}</Text>
          </View>
        </View>
      </TouchableHighlight>
      ) 
  }  

	render() {
    if(!this.state.loaded){
      return this.renderLoadingView();
    } else {

      return (
        <View style={styles.container}>
          <MainTab
            navigator={this.props.navigator} />
          <View style ={styles.bodyContainer}>
            <Text style={styles.title}>Lista de Jugadores</Text>
            <ListView
              style={styles.listview}
              dataSource={this.state.dataSource}
              renderRow={this.renderPlayer.bind(this)}
            />
          </View>
        </View>
        
      );
    }
  }
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
  title: {
    fontSize: 25,
    marginBottom: 10,
    alignSelf: 'center'
  },
  playersContainer: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    flex: 1,
    marginBottom: 8,
  },
  imageContainer: {
    justifyContent:  'center',
    alignItems: 'center',
    flex: 1
  },
  descContainer: {
    flex: 2
  },
  text: {
    marginBottom: 30
  },
  button: {
    height: 50,
    backgroundColor: 'red',
    alignSelf: 'stretch',
    marginTop: 10,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  buttonBlue: {
    height: 50,
    backgroundColor: 'blue',
    alignSelf: 'stretch',
    marginTop: 10,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 22,
    color: '#FFF',
    alignSelf: 'center'
  },
  flash: {
    height: 40,
    backgroundColor: '#00ff00',
    padding: 10,
    alignSelf: 'center',
  },
  loader: {
    marginTop: 20
  }
});

export default Players

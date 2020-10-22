import React, {Component} from 'react';
import { 
  AppRegistry, View, Text, StyleSheet, TextInput, TouchableHighlight, 
  AsyncStorage, Image, ScrollView } from 'react-native';
import MainTab from '../Tabs/MainTab';
import {TextMask} from 'react-native-masked-text';

const ACCESS_TOKEN = 'access_token';
const ACCESS_USER = 'access_user';

class Show extends Component {

	constructor(props) {
	  super(props);
	  this.state = {
	  	accessToken: this.props.accessToken,
      userId: this.props.userId,
      playerId: this.props.playerId,
      playerName: this.props.playerName,
      img: this.props.playerImg,
      tp: this.props.playerTp,
      current: "",
      buy: "",
      sell: "",
      mail: "",
      buyed: "",
      loaded: false,
    }
  }

  componentWillMount() {
  	let accessToken = this.state.accessToken;
    let userId = this.state.userId;
    let playerId = this.state.playerId
    this.fetchPlayer(accessToken, userId, playerId)
  }

  async fetchPlayer(token, user, player) {
    let accessToken = token;
    let userId = user;
    let playerId = player

    try {
      let response = await fetch('http://url/api/players/' + playerId,  {
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
        let playerShow = JSON.parse(res).player
        console.log("player show: "+ playerShow.id)
        this.setState({
          current: playerShow.current,
          buy: playerShow.buy,
          sell: playerShow.sell,
          buyed: playerShow.buyed,
          mail: playerShow.mail,
          tp: playerShow.tp,
          loaded: true
        })
      } else {
          //Handle error
          let error = res;
          throw error;
      }
    } catch(error) {
        console.log("error in show fetch: " + error);
    }
  }

  redirect(routeName, flash2, flash3){
    this.props.navigator.push({
      name: routeName,
      passProps: {
        accessToken: this.state.accessToken,
        userId: this.state.userId,
        playerId: this.state.playerId,
        playerName: this.state.playerName,
        playerBuy: this.state.buy,
        playerSell: this.state.sell,
        playerImg: this.state.img,
        playerTp: this.state.playerTp,
        flash2: flash2,
        flash3: flash3
      }
    });
  }

  renderLoadingView(){
    return(
      <View style={styles.container}>
        <MainTab
          navigator={this.props.navigator} />
        <View style={styles.bodyContainer}>
          <Image source={{uri: this.state.img}} style={styles.images} />
          <Text style={styles.title}>{this.state.playerName}</Text>
          <Text>ACTUALIZANDO INFORMACIÓN...</Text>
        </View>
      </View>
    )
  }

  // Edit User receive mail
  async editMail() {
    let accessToken = this.state.accessToken;
    let userId = this.state.userId;
    let playerId = this.state.playerId;
    
    try {
      let response = await fetch('http://url/api/players/' + playerId + '/api_edit_mail',  {
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
        let flash2 = JSON.stringify(JSON.parse(res).flash)
        let flash3 = false
        console.log("edit mail response: " + flash2)
        this.redirect('show', flash2, flash3)
      } else {
          //Handle error
          let error = res;
          throw error;
      }
    } catch(error) {
        console.log("error in edit mail: " + error);
    }
  } 
  // termina edit_mail

  // Edit player buyed
  async editBuyed() {
    let accessToken = this.state.accessToken;
    let userId = this.state.userId;
    let playerId = this.state.playerId;
    
    try {
      let response = await fetch('http://url/api/players/' + playerId + '/api_edit_buyed',  {
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
        let flash3 = JSON.stringify(JSON.parse(res).flash)
        let flash2 = false
        console.log("edit buyed response: " + flash3)
        this.redirect('show', flash2, flash3)
      } else {
          //Handle error
          let error = res;
          throw error;
      }
    } catch(error) {
        console.log("error in edit mail: " + error);
    }
  } 
  // termina edit_buyed

  render() {
    let flashMessage;
    let flashMessage2;
    let flashMessage3;

    if (this.props.flash) {
        flashMessage = <Text style={styles.flash}>{this.props.flash}</Text>
    } else if (this.props.flash2) {
        console.log("else flash2: "+ this.props.flash2)
        flashMessage2 = <Text style={styles.flash}>{this.props.flash2}</Text>
        flashMessage3 = null
        flashMessage = null
    } else if (this.props.flash3) {
        flashMessage3 = <Text style={styles.flash}>{this.props.flash3}</Text>
        flashMessage2 = null
        flashMessage = null
    } else {
       flashMessage = null
       flashMessage2 = null
       flashMessage3 = null
    }
    let cond1 = this.state.mail;
    let cond2 = this.state.buyed;

    if(cond1){
      var email = 'Si'
    } else {
      var email = 'No'
    }
    if(cond2){
      var buyed = 'Si'
    } else {
      var buyed = 'No'
    };

    if(!this.state.loaded){
      return this.renderLoadingView();
    } else {

      return (
        <View style={styles.container}>
          <MainTab
              navigator={this.props.navigator} />
          <View style={styles.bodyContainer}>
            <View style={styles.textContainer}>
              <Image source={{uri: this.state.img}} style={styles.images} />
              <Text style={styles.title}>{this.state.playerName}</Text>
              {flashMessage}
            	<Text style={styles.text}>Tipo: {this.state.tp}</Text>
              <Text style={styles.text}>Precio actual: <TextMask value={this.state.current} type={'money'} options={{delimiter: ',', precision: 0, unit: ''}}/> </Text>
            	<Text style={styles.text}>Precio de compra: <TextMask value={this.state.buy} type={'money'} options={{delimiter: ',', precision: 0, unit: ''}}/></Text>
            	<Text style={styles.text}>Precio de venta: <TextMask value={this.state.sell} type={'money'} options={{delimiter: ',', precision: 0, unit: ''}}/></Text>
              {flashMessage2}
            	<Text style={styles.text}>Enviar mails: {email}</Text>
              {flashMessage3}
            	<Text style={styles.text}>Jugador Comprado: {buyed}</Text>
            </View>

            <View style={styles.buttonsC}>
              <TouchableHighlight onPress={this.redirect.bind(this, 'edit')} style={styles.buttonBlue} >
              	<Text style={styles.buttonText}> Editar Jugador</Text>
              </TouchableHighlight>
              <View style={styles.buttonContainer}>
                <TouchableHighlight onPress={() => this.editMail()} style={styles.button1} >
                	<Text style={styles.buttonText}> Editar mails</Text>
                </TouchableHighlight>
                <TouchableHighlight onPress={()=> this.editBuyed()} style={styles.button2} >
                	<Text style={styles.buttonText}> Editar Compra</Text>
                </TouchableHighlight>
              </View>
              <TouchableHighlight onPress={()=> console.log("player :" + this.state.userId)} style={styles.buttonBlue} >
                <Text style={styles.buttonText}> Estadísticas</Text>
              </TouchableHighlight>
            </View>
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
  bcontainer: {
    flex: 1
  },

  bodyContainer: {
    flex: 9,
    backgroundColor: '#F5FCFF',
    paddingLeft: 20,
    paddingRight: 20,
  },
  textContainer: {
    flex: 5,
    alignItems: "flex-start",
    paddingTop: 5,
  },
  images: {
    height: 90,
    width: 90,
    alignSelf: 'center'
  },
  title: {
    fontSize: 23,
    marginTop: 5,
    marginBottom: 5,
    alignSelf: 'center',
  },
  flash: {
    fontSize: 12,
  },
  text: {
    fontSize: 16,
    marginBottom: 8
  },
  buttonsC: {
    flex: 3,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    
  },
  buttonContainer: {
    flexDirection: 'row',
    alignSelf: 'stretch'
  },
  button1: {
    flex: 1,
    height: 50,
    backgroundColor: 'green',
    borderRadius: 8,
    marginTop: 10,
    justifyContent: 'center',
    marginRight: 10
  },
  button2: {
    flex: 1,
    height: 50,
    backgroundColor: 'green',
    borderRadius: 8,
    marginTop: 10,
    justifyContent: 'center',
  },
  buttonBlue: {
    height: 50,
    backgroundColor: 'blue',
    alignSelf: 'stretch',
    marginTop: 10,
    alignItems: 'flex-end',
    justifyContent: 'center',
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 22,
    color: '#FFF',
    alignSelf: 'center'
  },
  loader: {
    marginTop: 20
  }
});


export default Show

import React, {Component} from 'react';
import { AppRegistry, View, Text, StyleSheet, Navigator, TouchableHighlight, AsyncStorage} from 'react-native';

const ACCESS_TOKEN = 'access_token';
const ACCESS_USER = 'access_user';

class Root extends Component {

  componentWillMount() {
    this.getToken();
  }

  async getToken() {
    try {
      let accessToken = await AsyncStorage.getItem(ACCESS_TOKEN);
      let userId = await AsyncStorage.getItem(ACCESS_USER);
      if(!accessToken) {
        console.log("Token not set")
      } else if (!userId) {
        console.log("user not set")
      } else {
        this.verifyToken(accessToken, userId)
      }

    } catch(error) {
      console.log("Something went wrong in getToken")
    }
  }

  navigate(routeName) {
    this.props.navigator.push({
      name: routeName
    })
  }

  async verifyToken(token, user) {
    let accessToken = token;
    let userId = user

    try {
      let response = await fetch('http://url/api/users/' + userId,  {
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
        this.navigate('home');
        console.log("correcto" + res);
      } else {
          //Handle error
          let error = res;
          throw error;
      }
    } catch(error) {
        console.log("error response: " + error);
    }
  }

  

	render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}> Precios Fut App </Text>
        
        <TouchableHighlight onPress={this.navigate.bind(this, 'register')} style={styles.button}>
          <Text style={styles.buttonText}> Nuevo Usuario </Text>
        </TouchableHighlight>

        <TouchableHighlight onPress={this.navigate.bind(this, 'signin')} style={styles.button}>
          <Text style={styles.buttonText}> Iniciar Sesión </Text>
        </TouchableHighlight>


      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    padding: 10,
    paddingTop: 180
  },
  button: {
    height: 50,
    backgroundColor: '#48BBEC',
    alignSelf: 'stretch',
    alignItems: 'center',
    marginTop: 10,
    justifyContent: 'center'
  },
  buttonText: {
    fontSize: 22,
    color: '#FFF',
    alignSelf: 'center'
  },
  title: {
    fontSize: 25,
    marginBottom: 15
  }
});


export default Root

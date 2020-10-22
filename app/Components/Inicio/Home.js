import React, {Component} from 'react';
import { AppRegistry, View, Text, StyleSheet, TextInput, TouchableHighlight, AsyncStorage, Alert} from 'react-native';


const ACCESS_TOKEN = 'access_token';
const ACCESS_USER = 'access_user';

class Home extends Component {

	constructor(props) {
	  super(props);
	
	  this.state = {
	  	accessToken: "",
      userId: "",
      email: "",
      playersNum: "",
	  };
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
        this.fetchUser(accessToken, userId)
      }

    } catch(error) {
      console.log("Something went wrong in getToken " + error )
    }
  }

  async fetchUser(token, user) {
    let accessToken = token;
    let userId = user;
    console.log(userId)
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
        
        let email = JSON.parse(res).user.email;
        let name  = JSON.parse(res).user.name;
        let playersNum = JSON.parse(res).players;


        this.setState({
                  email: email,
                  name: name,
                  playersNum: playersNum
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

  onLogout(){
    Alert.alert(
      'Cerrar Sesión',
      'Seguro que deseas cerrar sesión?',
      [
        {text: 'Cancelar'},
        {text: 'Cerrar Sesión', onPress: () => this.deleteToken(),  style: 'cancel'},
        
      ],
    )
    
  }

  async deleteToken() {
    try {
        await AsyncStorage.removeItem(ACCESS_TOKEN)
        this.redirect('root');
    } catch(error) {
        console.log("Something went wrong deleteToken");
    }
  }
  
  redirect(routeName){
    this.props.navigator.push({
      name: routeName,
      passProps: {
        accessToken: this.state.accessToken,
        userId: this.state.userId
      }
    });

  }  

	render() {
    let flashMessage;
    if (this.props.flash) {
       flashMessage = <Text style={styles.flash}>{this.props.flash}</Text>
    } else {
       flashMessage = null
    }
    return (
      <View style={styles.container}>
      {flashMessage}
        <Text style={styles.title}> Bienvenido </Text>
        {/* <Text style={styles.text}> Tu nuevo token es: {this.state.accessToken} </Text>
        <Text style={styles.text}> Tu usuario es: {this.state.userId} </Text> */}

        <TouchableHighlight onPress={this.redirect.bind(this, 'players')} style={styles.buttonBlue}>
          <Text style={styles.buttonText}>
            Ver Jugadores
          </Text>
        </TouchableHighlight>

        <View style={styles.buttonContainer}>
          <TouchableHighlight onPress={this.redirect.bind(this, 'update')} style={styles.button2}>
            <Text style={styles.buttonText2}>
              Actualizar Cuenta
            </Text>
          </TouchableHighlight>

          <TouchableHighlight onPress={this.onLogout.bind(this)} style={styles.button1}>
            <Text style={styles.buttonText2}>
              Cerrar Sesión
            </Text>
          </TouchableHighlight>
        </View>

        <View style={styles.profileContainer} >
          <View style={styles.profileTitle}>
            <Text style={styles.profileTitleText}>Perfil de Usuario:</Text>
          </View>
          <View style={styles.profileList}>
            <Text style={styles.profileListText}>Nombre: {this.state.name}</Text>
            <Text style={styles.profileListText}>Email: {this.state.email}</Text>
            <Text style={styles.profileListText}>Número de Jugadores: {this.state.playersNum}</Text>
          </View>
        </View>
        
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    padding: 10,
  },
  profileContainer: {
    flex: 1,
    flexDirection: 'column',
    alignSelf: 'stretch',
  },
  profileTitle: {
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  profileTitleText: {
    alignSelf: 'flex-start',
    fontSize: 22,
    fontWeight: 'bold'
  },
  profileList: {
  
  },
  profileListText: {
    fontSize: 15,
    marginBottom: 8
  },
  buttonContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    //justifyContent: 'space-between'
  },
  title: {
    fontSize: 25,
    marginTop: 15,
    marginBottom: 15
  },
  text: {
    marginBottom: 30
  },
  button1: {
    flex: 1,
    height: 50,
    width: 10,
    backgroundColor: 'red',
    //alignSelf: 'stretch',
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10
  },
  button2: {
    flex: 1,
    height: 50,
    backgroundColor: 'green',
    marginRight: 10,
    //alignSelf: 'stretch',
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10
  },
  buttonBlue: {
    height: 50,
    backgroundColor: 'blue',
    alignSelf: 'stretch',
    marginTop: 10,
    alignItems: 'flex-end',
    justifyContent: 'center',
    borderRadius: 10
  },
  buttonText: {
    fontSize: 22,
    color: '#FFF',
    alignSelf: 'center'
  },
  buttonText2: {
    fontSize: 18,
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

export default Home

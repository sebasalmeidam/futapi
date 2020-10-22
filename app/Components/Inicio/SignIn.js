import React, {Component} from 'react';
import { AppRegistry, View, Text, StyleSheet, TextInput, TouchableHighlight, AsyncStorage} from 'react-native';

const ACCESS_TOKEN = 'access_token';
const ACCESS_USER = 'access_user';

export default class SignIn extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      error: ""
    };
  }

  redirect(routeName, token, user) {
    this.props.navigator.push({
      name: routeName,
      passProps: {
        accessToken: token,
        userId: user
      }
    })
  }

  async storeToken(accessToken){
    try {
      await AsyncStorage.setItem(ACCESS_TOKEN, accessToken);
      this.getToken();
    } catch(error) {
      console.log("something went wrong")
    }
  }

  async getToken(){
    try {
      let token = await AsyncStorage.getItem(ACCESS_TOKEN);
      console.log("token is: " + token);
    } catch(error) {
      console.log("something went wrong")
    }
  }

  async storeUser(userId){
    try {
      await AsyncStorage.setItem(ACCESS_USER, userId);
      
      this.getUser();
      
    } catch(error) {
      console.log("something went wrong user storage" + error)
    }
  }

  async getUser(){
    try {
      let user = await AsyncStorage.getItem(ACCESS_USER);
      console.log("User is: " + user);
    } catch(error) {
      console.log("something went wrong with async getUser")
    }
  }

  async removeToken(){
    try {
      await AsyncStorage.removeItem(ACCESS_TOKEN);
      this.getToken();
      console.log("token is: " + token);
    } catch(error) {
      console.log("something went wrong")
    }
  }

  async onLoginPressed(){
    try {
      let response = await fetch('http://url/api/sessions',  {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          'email': this.state.email,
          'password': this.state.password,
        })
      });
      let res = await response.text();
      
      if(response.status >= 200 && response.status < 300) {
        
        this.setState({error: ""});
        let accessToken = JSON.parse(res).user.auth_token;
        let userId = JSON.stringify(JSON.parse(res).user.id);
        this.storeToken(accessToken);
        this.storeUser(userId);
        console.log("res token: " + accessToken);
        console.log("res user: " + userId);
        this.redirect('home', accessToken, userId);
        
      } else {
        
        let error = res;
        throw error;

      }
      
    } catch(error) {
        if (JSON.parse(error).status >= 500 ) {
          this.setState({error: "Invalid email or password"});
          console.log("error " + error);
        } else {
          this.removeToken();
          let formErrors = JSON.parse(error).errors;
          this.setState({error: formErrors});
          console.log("error " + error);
        }

    }
  };

  render() {

    return(

        <View style={styles.container}>
          <Text style={styles.heading}>
            Inicia Sesión!
          </Text>
          <TextInput
            onChangeText={(val) => this.setState({email: val})}
            style={styles.input} placeholder="Email"
          />
          <TextInput
            onChangeText={ (val)=> this.setState({password: val}) }
            style={styles.input}
            placeholder="Password"
            secureTextEntry={true}>
          </TextInput>
               
          <TouchableHighlight
            onPress={this.onLoginPressed.bind(this)}
            style={styles.button}
            underlayColor='green'>
            <Text style={styles.buttonText}>
              Iniciar Sesión
            </Text>           
          </TouchableHighlight>
          <Text>
          {this.state.error}
          </Text>
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
    paddingTop: 80
  },
  input: {
    height: 50,
    marginTop: 10,
    padding: 4,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#48bbec',
    width: 100 + "%"
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

AppRegistry.registerComponent('SignIn', () => SignIn);

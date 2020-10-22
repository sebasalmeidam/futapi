import React, {Component} from 'react';
import { AppRegistry, View, Text, StyleSheet, TextInput, TouchableHighlight, AsyncStorage} from 'react-native';

const ACCESS_TOKEN = 'access_token';
const ACCESS_USER = 'access_user';

export default class Register extends Component{
	constructor(){
		super();
		this.state = {
			email: "",
			password: "",
			password_confirmation: "",
			errors: [],

		}
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
      console.log("Token was stored successfull ");
    } catch(error) {
      console.log("something went wrong")
    }
  }

  async storeUser(userId){
    try {
      await AsyncStorage.setItem(ACCESS_USER, userId);
      console.log("user was stored successfull ");
    } catch(error) {
      console.log("something went wrong user storage")
    }
  }

	async onRegisterPressed(){
		try {
			let response = await fetch('http://url/api/users',  {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          'email': this.state.email,
          'password': this.state.password,
          'password_confirmation': this.state.password_confirmation
        })
      });
			let res = await response.text();
			
			if(response.status >= 200 && response.status < 300) {
				console.log("res success is: " + JSON.parse(res).user.auth_token);
				let accessToken = JSON.parse(res).user.auth_token;
				let userId = JSON.stringify(JSON.parse(res).user.id);
				this.redirect('home', accessToken, userId);

			} else {
				
				let error = res;
				throw error;

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
	};

	render() {

		return(

				<View style={styles.container}>
					<Text style={styles.heading}>
					  Registrate!
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
        <TextInput
	          onChangeText={ (val)=> this.setState({password_confirmation: val}) }
	          style={styles.input}
	          placeholder="Confirm Password"
	          secureTextEntry={true}>
	        </TextInput>
       
					<TouchableHighlight
					  onPress={this.onRegisterPressed.bind(this)}
					  style={styles.button}
					  underlayColor='green'>
					  <Text style={styles.buttonText}>
					    Registrarme
					  </Text>					  
					</TouchableHighlight>

					<Errors errors={this.state.errors} />
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

AppRegistry.registerComponent('Register', () => Register);
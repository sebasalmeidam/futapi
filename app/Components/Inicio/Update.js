import React, {Component} from 'react';
import { AppRegistry, View, Text, StyleSheet, TextInput, TouchableHighlight, AsyncStorage} from 'react-native';

const ACCESS_TOKEN = 'access_token';
const ACCESS_USER = 'access_user';

class Update extends Component{
	constructor(props){
		super(props);
		this.state = {
			email: "",
			name: "",
			password: "",
			password_confirmation: "",
			errors: [],
			accessToken: this.props.accessToken,
			userId: this.props.userId

		}
	}

	componentWillMount() {
		this.fetchUserData();
	}

	redirect(routeName, flash){
    this.props.navigator.push({
      name: routeName,
      passProps: {
        flash: flash,
      }
    });
  }

  async fetchUserData() {
  	let access_token = this.state.accessToken;
  	let access_user = this.state.userId;
  	
  	try {
  		 let response = await fetch('http://url/api/users/' + access_user,  {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Token token=' + access_token
        }
      });
      let res = await response.text();
      if (response.status >= 200 && response.status < 300) {
        
        let userEmail = JSON.parse(res).user.email;
         
         	this.setState({email: userEmail});
      } else {
      	let error = res;
      	throw error;
      }
    } catch(error) {
    	console.log("Error fetchUserData: " + error);
    	this.redirect('login');
    }  
  }

  async onUpdatePressed() {
  	let access_token = this.state.accessToken;
  	let access_user = this.state.userId;
  	try {
			let response = await fetch('http://url/api/users/'+ access_user,  {
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Token token=' + access_token
        },
        body: JSON.stringify({
          'email': this.state.email,
          'password': this.state.password,
          'password_confirmation': this.state.password_confirmation
        })
      });
			let res = await response.text();
			if (response.status >= 200 && response.status < 300) {
				let flash = JSON.stringify(JSON.parse(res).flash)
				this.redirect('home', flash)
			} else {
				let error = res;
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
        <Text style={styles.heading}>
          Actualizar detalles de la cuenta
        </Text>
        <TextInput
          onChangeText={ (text)=> this.setState({email: text}) }
          style={styles.input} value={this.state.email}>
        </TextInput>
        <TextInput
          onChangeText={ (text)=> this.setState({password: text}) }
          style={styles.input}
          placeholder="Password"
          secureTextEntry={true}>
        </TextInput>
        <TextInput
          onChangeText={ (text)=> this.setState({password_confirmation: text}) }
          style={styles.input}
          placeholder="Confirm Password"
          secureTextEntry={true}>
        </TextInput>

         <TouchableHighlight onPress={this.onUpdatePressed.bind(this)} style={styles.button}>
          <Text style={styles.buttonText}>
            Actualizar
          </Text>
        </TouchableHighlight>
        

        <Errors errors={this.state.errors}/>

        
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


export default Update
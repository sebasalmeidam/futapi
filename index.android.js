import React, {Component} from 'react';
import { AppRegistry, View, Text, StyleSheet, TextInput, TouchableHighlight, Navigator, ScrollView} from 'react-native';

import Register from './app/Components/Inicio/Register'
import SignIn from './app/Components/Inicio/SignIn'
import Home from './app/Components/Inicio/Home'
import Root from './app/Components/Inicio/Root'
import Update from './app/Components/Inicio/Update'
import Players from './app/Components/Players/Players'
import Show from './app/Components/Players/Show'
import Edit from './app/Components/Players/Edit'
import MainTab from './app/Components/Tabs/MainTab'



export default class FutApi extends Component {


  renderScene(route, navigator) {
    if(route.name == "root") {
      return <Root navigator={navigator} />
    }
    if(route.name == "register") {
      return <Register navigator={navigator} />
    }
    if(route.name == "signin") {
      return <SignIn navigator={navigator} />
    }
    if(route.name == "home") {
      return <Home navigator={navigator} {...route.passProps} />
    }
    if(route.name == "update") {
      return <Update navigator={navigator} {...route.passProps} />
    }
    if(route.name == "players") {
      return <Players navigator={navigator} {...route.passProps} />
    }
    if(route.name == 'show') {
      return <Show navigator={navigator} {...route.passProps} />
    }
    if(route.name == 'edit') {
      return <Edit navigator={navigator} {...route.passProps} />
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Navigator
          initialRoute={{name: 'root'}}
          renderScene={this.renderScene.bind(this)}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
});


AppRegistry.registerComponent('FutApi', () => FutApi);

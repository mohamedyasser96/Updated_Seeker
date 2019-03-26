import React from 'react';
import axios from 'axios';
import { Alert, StyleSheet, Text, View, TextInput, TouchableOpacity, Image, AppRegistry} from 'react-native';
import { Button } from 'native-base';

//var React = require('react-native');
var FileUpload = require('NativeModules').FileUpload;


export default class RegForm extends React.Component {
    static navigationOptions ={
      header:null
       // title: 'Registration Screen',
    };
    showAlert (message) 
    {
      Alert.alert(
        'It seems something went wrong',
        message,
        [
          
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ],
        {cancelable: false},
      );
    }
    checkStatus (token, message){
      if(token == 406){
        console.log("HHEEYYYY")
        this.showAlert(message)
      }

      else{
        this.props.navigation.navigate("Second")
        
      }
    }

  constructor(props){
    super(props);
    this.state = { username: '',
                    password: '',
                    email: '',
                    phone: '',
                  };

   this.register = this.register.bind(this);
  }
  
  register(){
    let data = {data: this.state}
    console.log("SJDJKASHFDKAHF");
    console.log(this.state);
    axios.post(
      'http://127.0.0.1:8080/register/seeker',
      data 
   ).then(response => {
      console.log("SUCCESS")
      console.log(response.status)
      this.checkStatus(response.status)
    }).catch(error => {
      console.log('a7a')
      console.log(JSON.stringify(this.state));
      console.log(error);
    })
  }
  
  async register2(){
   try { 
    let result = await fetch('http://127.0.0.1:8080/register/seeker', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(this.state),
    
    
  });
  console.log(result);
  this.checkStatus(result.status, result._bodyInit)
} catch (error) {
    console.log(error);
    console.log('aywaaa')
  };
}
  
  render() {
    const {navigate} = this.props.navigation;
    return (
        
      <View style={styles.regform}>
      <View>
            <Image
          style={{width: 100, height: 70}}
          source={require('./11.png')}
        />
        </View>
        
          <Text style={styles.header}>Registration</Text>
        
          
          <TextInput style={styles.textinput} placeholder="Name" placeholderTextColor='#fff'
            onChangeText={(username) => this.setState({username})}
            value={this.state.username}
          />
          <TextInput style={styles.textinput} placeholder="Email" placeholderTextColor='#fff'
            onChangeText={(email) => this.setState({email})}
            value={this.state.email}
          />
          <TextInput style={styles.textinput} placeholder="Password" secureTextEntry={true} placeholderTextColor='#fff'
            onChangeText={(password) => this.setState({password})}
            value={this.state.password}
          />
          <TextInput style={styles.textinput} placeholder="Confirm Password" secureTextEntry={true} placeholderTextColor='#fff'
            //onChangeText={(password) => this.setState({password})}
            //value={this.state.password}
          />
          <TextInput style={styles.textinput} placeholder="Phone Number" placeholderTextColor='#fff'
            onChangeText={(phone) => this.setState({phone})}
            value={this.state.phone}
          />
          <Button style={styles.button} onPress={() => {this.register2()}} >
                <Text style={styles.btntext}>Register</Text>
          </Button> 
          {/* <Button style={styles.button} onPress={()=> navigate('Second')}>
                <Text style={styles.btntext}>Navigate</Text>
          </Button>  */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  regform: {
    alignSelf: 'stretch',
    flex: 1,
     backgroundColor: '#50031c',
     //backgroundGradient: 'vertical',
     paddingLeft:60,
     paddingRight:60,
     alignItems: 'center',
     justifyContent: 'center',

  },
  header:{
      fontSize: 24,
      color: '#fff',
      paddingBottom: 10,
      marginBottom: 20,
      borderBottomColor: '#fff',
      borderBottomWidth: 5,

  },
  textinput:{
      alignSelf: 'stretch',
      height: 40,
      marginBottom: 30,
      color: '#fff',
      borderBottomColor: '#f8f8f8',
      borderBottomWidth: 1,

  },
  button:{
    alignSelf: 'stretch',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#d8d6d7',
    marginTop: 30,
  },
  btntext:{
      alignItems: 'center',
      fontSize: 17,
      justifyContent: 'center',

  }
});

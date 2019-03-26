import React from 'react';
import axios from 'axios';

import { Alert,StyleSheet, Text, View, TextInput, AsyncStorage} from 'react-native';
import { Button } from 'native-base';


  

export default class RegForm extends React.Component {
    static navigationOptions ={
      header:null
       // title: 'Login Screen',
    };

    constructor(props){
      super(props);
      this.state = { email: '',
                      password: '',
                    };
     this.register2 = this.register2.bind(this);
    }
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
    checkStatus (token, message)
    {
      if(token == null){
        console.log("HHEEYYYY")
        this.showAlert(message)
      }

      else{
        this._storeData(token)

        
      }
    }

    _storeData = async(token) => { 
      try{
      //console.log("Ana fl try")
      await AsyncStorage.setItem('token', token)
      this.props.navigation.navigate("Third")
      
    }
    catch(error){
      console.log("Problem saving token")
    }
    }
    async register2()
    {
      try { 
       let result = await fetch('http://127.0.0.1:8080/login/seeker', {
       method: 'POST',
       headers: {
         Accept: 'application/json',
         'Content-Type': 'application/json',
       },
       body: JSON.stringify(this.state),
     });
     
     body = JSON.parse(result._bodyInit)
     console.log(body.Status)
     
     token = body.Token
     this.checkStatus(token, body.Status);
   } catch (error) {
       console.log(error);
       console.log('aywaa')
     };
   }

   
  render() {
    const {navigate} = this.props.navigation;
    return (
      <View style={styles.main}>
        <View style={styles.container}>
      <View style={styles.regform}>
          <Text style={styles.header}>Sign In</Text>
          <TextInput style={styles.textinput} placeholder="Email" placeholderTextColor='#fff'
            onChangeText={(email) => this.setState({email})}
            value={this.state.email}
          />
          <TextInput style={styles.textinput} placeholder="Password" secureTextEntry={true} placeholderTextColor='#fff'
            onChangeText={(password) => this.setState({password})}
            value={this.state.password}
          />
          <Button block large style={styles.button} onPress={() => {this.register2()}}>
            <Text>
                Login
            </Text>
          </Button>
          {/* <Button block large onPress={()=> navigate('Third')}>
            <Text> Go to Main </Text>
          </Button> */}
      </View>

      </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  regform: {
    alignSelf: 'stretch',
    flex: 1,
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
      marginBottom: 40,
      borderBottomColor: '#fff',
      borderBottomWidth: 5,

  },
  main:{
    flex:1
  },
  container:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor: '#2a569e',

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

  }
});

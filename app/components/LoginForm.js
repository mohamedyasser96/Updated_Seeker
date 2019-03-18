import React from 'react';

import { StyleSheet, Text, View, TextInput, TouchableOpacity} from 'react-native';

export default class RegForm extends React.Component {
    static navigationOptions ={
        title: 'Login Screen',
    };
  render() {
    return (
      <View style={styles.regform}>
          <Text style={styles.header}>Sign In</Text>
          <TextInput style={styles.textinput} placeholder="Email" placeholderTextColor='#fff'/>
          <TextInput style={styles.textinput} placeholder="Password" secureTextEntry={true} placeholderTextColor='#fff'/>
          <TouchableOpacity style={styles.button}>
                <Text style={styles.btntext}>Log In</Text>
          </TouchableOpacity> 
      </View>
    );
  }
}

const styles = StyleSheet.create({
  regform: {
    alignSelf: 'stretch',
    flex: 1,
     backgroundColor: '#2a569e',
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

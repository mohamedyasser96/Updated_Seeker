import React from 'react';

import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image} from 'react-native';

export default class RegForm extends React.Component {
  render() {
    return (
        
      <View style={styles.regform}>
      <View>
            <Image
          style={{width: 100, height: 70}}
          source={require('./11.png')}
        />
        </View>
        
          <Text style={styles.header}>Registration</Text>

          
          <TextInput style={styles.textinput} placeholder="Name" placeholderTextColor='#fff'/>
          <TextInput style={styles.textinput} placeholder="Email" placeholderTextColor='#fff'/>
          <TextInput style={styles.textinput} placeholder="Password" secureTextEntry={true} placeholderTextColor='#fff'/>
          <TextInput style={styles.textinput} placeholder="Phone Number" placeholderTextColor='#fff'/>
          <TouchableOpacity style={styles.button}>
                <Text style={styles.btntext}>Register</Text>
          </TouchableOpacity> 
      </View>
    );
  }
}

const styles = StyleSheet.create({
  regform: {
    alignSelf: 'stretch',

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

  }
});

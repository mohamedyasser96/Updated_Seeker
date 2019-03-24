import React, { Component } from 'react';

import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, DatePickerIOS} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

import { Dropdown } from 'react-native-material-dropdown';

export default class AddPaymentForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {chosenDate: new Date()};
    
        this.setDate = this.setDate.bind(this);
      }
    
      setDate(newDate) {
        this.setState({chosenDate: newDate});
      }
  render() {
    let data = [{
        value: 'Egypt',
      }, {
        value: 'United Kingdom',
      }, {
        value: 'United States',
      }];

      
    return (
        
      <View style={styles.regform}>
        <Image
            style={{width: 120, height: 70, marginBottom: 20}}
            source={require('./mclogo.png')}
            />
          <Text style={styles.header}>Card Details</Text>

          
          <TextInput style={styles.textinput} placeholder="Card Number" placeholderTextColor='#fff'/>
          <Dropdown 
                dropdownOffset={top = 60}
                label='Country'
                baseColor='#fff'
                placeholderTextColor='#fff'
                data={data}
           />

          <TextInput style={styles.textinput} placeholder="CVC" secureTextEntry={true} placeholderTextColor='#fff'/>
          <Text style={styles.dd}>Expiration Date</Text>
          <DatePickerIOS
            mode = 'date'
            date={this.state.chosenDate}
            onDateChange={this.setDate}
            />
          <TouchableOpacity style={styles.button}>
                <Text style={styles.btntext}>Add Card</Text>
          </TouchableOpacity> 
      </View>
    );
  }
}

const styles = StyleSheet.create({
  regform: {
        alignSelf: 'stretch',

  },
  dd:{
      fontSize: 18,
      color: '#fff',
      paddingBottom: 5,
      marginBottom: 5,
      borderBottomColor: '#fff',
      borderBottomWidth: 2,
  },
  header:{
      fontSize: 24,
      color: '#fff',
      paddingBottom: 10,
      marginBottom: 20,
      borderBottomColor: '#fff',
      borderBottomWidth: 2,

  },
  textinput:{
      alignSelf: 'stretch',
      height: 40,
      marginBottom: 30,
      color: '#fff',
      borderBottomColor: '#f8f8f8',
      borderBottomWidth: 0.4,

  },
  button:{
    alignSelf: 'stretch',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#d8d6d7',
    marginTop: 30,
  },
  linearGradient: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'Gill Sans',
    textAlign: 'center',
    margin: 10,
    color: '#ffffff',
    backgroundColor: 'transparent',
  },
});

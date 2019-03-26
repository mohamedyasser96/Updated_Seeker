import React, { Component } from 'react';

import { NetworkInfo } from 'react-native-network-info';

import { StyleSheet, Text, View, TextInput, Image, DatePickerIOS} from 'react-native';

import { Button } from 'native-base';

import { ScrollView } from 'react-native-gesture-handler';


export default class NewPay extends React.Component {
    static navigationOptions ={
      header:null
       // title: 'Registration Screen',
    };
  constructor(props){
    super(props);
    this.state = { 
        card:{
            name: 'Visa',
            number: '',
            cvv: '',
            expiryMonth: '',
            expiryYear: ''
          },
          customer:{
            firstName: '',
            lastName: '',
            address: '',
            city: '',
            state: '',
            zip: '',
            country: '',
            phoneNumber: '',
            ip: '10.40.46.26'
          },
          amount: '100.0',
          currency: 'EGP'

                  };

    this.postPay = this.postPay.bind(this);
}

async postPay()
    {
      try { 
       let result = await fetch('http://127.0.0.1:8080/purchase', {
       method: 'POST',
       headers: {
         Accept: 'application/json',
         'Content-Type': 'application/json',
       },
       body: JSON.stringify(this.state),
     });

     console.log(result);
    //  body = JSON.parse(result._bodyInit)
    //  console.log(body.Status)
     
    //  token = body.Token
    //  this.checkStatus(token, body.Status);
   } catch (error) {
       console.log(error);
       console.log('aywaa error')
     };
   }
  
  
  
  render() {
    //const {navigate} = this.props.navigation;
    return (
        
      <View style={styles.regform}>
      <View>
            <Image
          style={{width: 100, height: 70}}
          source={require('./mclogo.png')}
        />
        </View>
        
          <Text style={styles.header}>Card Info</Text>
        
          
          <TextInput style={styles.textinput} placeholder="Card Number" placeholderTextColor='#fff'
           onChangeText={(number) => this.setState({card:number})}
           value={this.state.card.number}
          />
          <TextInput style={styles.textinput} placeholder="CVC" secureTextEntry={true} placeholderTextColor='#fff'
            onChangeText={(cvv) => this.setState({card:cvv})}
            value={this.state.card.cvv}
          />

          <Text style={styles.dd}>Expiration Date</Text>
          <TextInput style={styles.textinput} placeholder="Month" placeholderTextColor='#fff'
            onChangeText={(expiryMonth) => this.setState({expiryMonth})}
            value={this.state.card.expiryMonth}
          />
          <TextInput style={styles.textinput} placeholder="Year" placeholderTextColor='#fff'
            onChangeText={(expiryYear) => this.setState({expiryYear})}
            value={this.state.card.expiryYear}
          
          />
          <Text style={styles.header}>Billing Info</Text>
          <TextInput style={styles.textinput} placeholder="First Name" placeholderTextColor='#fff'
            onChangeText={(firstName) => this.setState({firstName})}
            value={this.state.customer.firstName}
          />
          <TextInput style={styles.textinput} placeholder="Last Name" placeholderTextColor='#fff'
             onChangeText={(lastName) => this.setState({lastName})}
             value={this.state.customer.lastName}
          />
          <TextInput style={styles.textinput} placeholder="Address" placeholderTextColor='#fff'
            onChangeText={(address) => this.setState({address})}
            value={this.state.customer.address}          
          />
          <TextInput style={styles.textinput} placeholder="City" placeholderTextColor='#fff'
            onChangeText={(city) => this.setState({city})}
            value={this.state.customer.city}

          />
          <TextInput style={styles.textinput} placeholder="State" placeholderTextColor='#fff'
            onChangeText={(state) => this.setState({state})}
            value={this.state.customer.state}
       
          />
          <TextInput style={styles.textinput} placeholder="Zip Code" placeholderTextColor='#fff'
            onChangeText={(zip) => this.setState({zip})}
            value={this.state.customer.zip}

          />
          <TextInput style={styles.textinput} placeholder="Phone Number" placeholderTextColor='#fff'
            onChangeText={(phoneNumber) => this.setState({phoneNumber})}
            value={this.state.customer.phoneNumber}
          
          />


          <Button full danger style={styles.button} onPress={() => {this.postPay()}} >
                <Text style={styles.btntext}> Purchase </Text>
          </Button> 
          
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

import React, { Component } from 'react';

import { NetworkInfo } from 'react-native-network-info';

import { Alert, StyleSheet, Text, View, TextInput, Image, AsyncStorage} from 'react-native';

import { Button } from 'native-base';

import LinearGradient from 'react-native-linear-gradient';

import { Dropdown } from 'react-native-material-dropdown';
import { ScrollView } from 'react-native-gesture-handler';



export default class AddPaymentForm extends React.Component {

  static navigationOptions ={
    header:null
     // title: 'Registration Screen',
  };

  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('token');
      if (value !== null) {
        // We have data!!
        this.tok = value
        // console.log("hwodhqoweohfoqhwidhqohwdoq", this.tok)
        return value
      }
    } catch (error) {
      // Error retrieving data
    }
  };
  showAlert (message) 
  {
    Alert.alert(
      'Payment is: ',
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
    checkStatus (mes)
    {
      if(mes === "true"){
        console.log("HHEEYYYY")
        message = "Successful"
        this.showAlert(message)
      }

      else{
        console.log("This is mes: ", mes)
        message = "Unsuccessful, please try again!"
        this.showAlert(message)

        
      }
    }
  setData (){
    DataObject = {
      card:{
        name: 'Visa',
          number: this.state.number,
          cvv: this.state.cvv,
          expiryMonth: this.state.expiryMonth,
          expiryYear: this.state.expiryYear
      },
      customer:{
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        address: this.state.address,
        city: this.state.city,
        state: this.state.state,
        zip: this.state.zip,
        country: this.state.country,
        phoneNumber: this.state.phoneNumber,
        ip: '10.40.46.26',

      },
      amount: '100.0',
      currency: 'EGP',
    }

    return DataObject
  }

  constructor(props){
    super(props);
    this.state = {
        // card:{
          name: 'Visa',
          number: '',
          cvv: '',
          expiryMonth: '',
          expiryYear: '',
        // },
        // customer:{
          firstName: '',
          lastName: '',
          address: '',
          city: '',
          state: '',
          zip: '',
          country: '',
          phoneNumber: '',
          ip: '10.40.46.26',
        // },
        amount: '100.0',
        currency: 'EGP',
        token: null

        
    };
    this.DataObject = {

    }
    // this.state.token = this._retrieveData()
    // console.log('TOKKKKKKWNNNNNNNNNNNNN', this.state.token)
    
    this.postPay = this.postPay.bind(this);
    this.DataObject = this.setData()
    let tok
    // const {card} = {...this.state};
    // const temp_card = card
    // const temp_customer = customer
    //this.state.token = this._retrieveData()        
    //this.getUserLocation = this.getUserLocation.bind(this);
}


  // getip(){
  //   NetworkInfo.getIPV4Address(ipv4 => {
  //     console.log(ipv4);
  //   });
  // }
  async postPay()
    {
      try {
       //this.setData() 
      //  this.state.token = this._retrieveData() 
      let token = await AsyncStorage.getItem('token')
       this.DataObject = this.setData()
      //  console.log("THIS IS MY TOKEN", this._retrieveData())
       let result = await fetch('http://127.0.0.1:8080/purchase', {
       method: 'POST',
       headers: {
         Accept: 'application/json',
         'Content-Type': 'application/json',
         'Authorization': 'Bearer ' + token
       },
       body: JSON.stringify(this.DataObject),
     });

     //console.log(result.ok);

     body = JSON.parse(result._bodyInit)
     console.log(body.success)
     //console.log(body.ok)
     
     //token = body.Token
     this.checkStatus(body.success.toString());

    //  console.log(result);
    //  console.log(this.DataObject)
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
    let data = [{
        value: '2019',
      }, {
        value: '2020',
      }, {
        value: '2021',
      }];

    // const temp_card = card;
    return (
      <ScrollView>
      <View style={styles.regform}>
        <Image
            style={{width: 120, height: 70, marginBottom: 20}}
            source={require('./mclogo.png')}
            />
          <Text style={styles.header}>Card Details</Text>

          
          <TextInput style={styles.textinput} placeholder="Card Number" placeholderTextColor='#fff'
           onChangeText={(number) => this.setState({number})}
           value={this.state.number}
          />
          {/* <Dropdown 
                dropdownOffset={top = 60}
                label='Country'
                baseColor='#fff'
                placeholderTextColor='#fff'
                data={data}
           /> */}

          <TextInput style={styles.textinput} placeholder="CVC" secureTextEntry={true} placeholderTextColor='#fff'
            onChangeText={(cvv) => this.setState({cvv})}
            value={this.state.cvv}
          />

          <Text style={styles.dd}>Expiration Date</Text>
          <TextInput style={styles.textinput} placeholder="Month" placeholderTextColor='#fff'
            onChangeText={(expiryMonth) => this.setState({expiryMonth})}
            value={this.state.expiryMonth}
          />
          <TextInput style={styles.textinput} placeholder="Year" placeholderTextColor='#fff'
            onChangeText={(expiryYear) => this.setState({expiryYear})}
            value={this.state.expiryYear}
          />
          
          {/* <DatePickerIOS
            mode = 'date'
            date={this.state.chosenDate}
            onDateChange={this.setDate}
            /> */}
          <Text style={styles.header}>Billing Info</Text>
          <TextInput style={styles.textinput} placeholder="First Name" placeholderTextColor='#fff'
            onChangeText={(firstName) => this.setState({firstName})}
            value={this.state.firstName}
          />
          <TextInput style={styles.textinput} placeholder="Last Name" placeholderTextColor='#fff'
             onChangeText={(lastName) => this.setState({lastName})}
             value={this.state.lastName}
          />
          <TextInput style={styles.textinput} placeholder="Address" placeholderTextColor='#fff'
            onChangeText={(address) => this.setState({address})}
            value={this.state.address}          
          />
          <TextInput style={styles.textinput} placeholder="City" placeholderTextColor='#fff'
            onChangeText={(city) => this.setState({city})}
            value={this.state.city}

          />
          <TextInput style={styles.textinput} placeholder="State" placeholderTextColor='#fff'
            onChangeText={(state) => this.setState({state})}
            value={this.state.state}
       
          />
          <TextInput style={styles.textinput} placeholder="Zip Code" placeholderTextColor='#fff'
            onChangeText={(zip) => this.setState({zip})}
            value={this.state.zip}

          />
          <TextInput style={styles.textinput} placeholder="Country" placeholderTextColor='#fff'
            onChangeText={(country) => this.setState({country})}
            value={this.state.country}

          />
          <TextInput style={styles.textinput} placeholder="Phone Number" placeholderTextColor='#fff'
            onChangeText={(phoneNumber) => this.setState({phoneNumber})}
            value={this.state.phoneNumber}
          
          />


          <Button full danger style={styles.button} onPress={() => {this.postPay()}} >
                <Text style={styles.btntext}> Purchase </Text>
          </Button> 
      </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  regform: {
        alignSelf: 'stretch',
        flex: 1,
      backgroundColor: '#51c192',
      //backgroundGradient: 'vertical',
      paddingLeft:60,
      paddingRight:60,
      paddingTop: 50,
      alignItems: 'center',
      justifyContent: 'center',

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
    marginTop: 30,
    paddingBottom: 20
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

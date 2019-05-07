import React, { Component } from 'react';

import { NetworkInfo } from 'react-native-network-info';

import { Alert, StyleSheet, Text, View, TextInput, Image, AsyncStorage, Switch} from 'react-native';
import { CreditCardInput, LiteCreditCardInput } from "react-native-credit-card-input";
 

import { Button } from 'native-base';
import { Dropdown } from 'react-native-material-dropdown';
import { ScrollView } from 'react-native-gesture-handler';



export default class AddPaymentForm extends React.Component {

  static navigationOptions ={
    header:null
     // title: 'Registration Screen',
  };
  _onChange = (formData) => (console.log(JSON.stringify(formData, null, " ")), dd = formData);

  dd = {
    values: {
        number: '',
        expiry: '',
        cvc: '',
        name: '',
        postalCode: '',
        
       },
       valid: true,
       status: {
        
       }
  }
  _onFocus = (field) => console.log("focusing", field);
  _setUseLiteCreditCardInput = (useLiteCreditCardInput) => this.setState({ useLiteCreditCardInput });
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
    setC (){
        this.state.number = dd.values.number,
        this.state.cvv = dd.values.cvc.toString(),
        console.log(this.state)

    }
  setData (){
    DataObject = {
      card:{
        name: 'Visa',
          number: this.state.number,
          cvv: this.state.cvc,
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
          expiryMonth: '07',
          expiryYear: '2019',
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
        token: null,
        useLiteCreditCardInput: false

        
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
      console.log('This is token', token)
       this.setC()
       this.DataObject = this.setData()
      //  console.log("THIS IS MY TOKEN", this._retrieveData())
       let result = await fetch('http://10.40.59.113:5000/purchase', {
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
        <View style={{backgroundColor: "#F5F5F5",marginTop: 0,}}>
                <Switch
                style={{alignSelf: "center",
                marginTop: 20,
                marginBottom: 20}}
                onValueChange={this._setUseLiteCreditCardInput}
                value={this.state.useLiteCreditCardInput} />

                { this.state.useLiteCreditCardInput ?
                (
                    <LiteCreditCardInput
                    autoFocus
                    inputStyle={{fontSize: 16,
                        color: "black",}}

                    validColor={"black"}
                    invalidColor={"red"}
                    placeholderColor={"darkgray"}

                    onFocus={this._onFocus}
                    onChange={this._onChange} />
                ) : (
                    <CreditCardInput
                    autoFocus

                    requiresName
                    requiresCVC
                    requiresPostalCode

                    labelStyle={{color: "black",
                    fontSize: 12,}}
                    inputStyle={{fontSize: 16,
                        color: "black",}}
                    validColor={"black"}
                    invalidColor={"red"}
                    placeholderColor={"darkgray"}

                    onFocus={this._onFocus}
                    onChange={this._onChange} />
                )
                }
      </View>
      <View style={styles.regform}>
          {/* <Text style={styles.header}>Billing Address</Text>

          
          <TextInput style={styles.textinput} placeholder="Card Number" placeholderTextColor='#000000'
           onChangeText={(number) => this.setState({number})}
           value={this.state.number}
          /> */}
          {/* <Dropdown 
                dropdownOffset={top = 60}
                label='Country'
                baseColor='#fff'
                placeholderTextColor='#fff'
                data={data}
           /> */}

          {/* <TextInput style={styles.textinput} placeholder="CVC" secureTextEntry={true} placeholderTextColor='#000000'
            onChangeText={(cvv) => this.setState({cvv})}
            value={this.state.cvv}
          />

          <Text style={styles.dd}>Expiration Date</Text>
          <TextInput style={styles.textinput} placeholder="Month" placeholderTextColor='#000000'
            onChangeText={(expiryMonth) => this.setState({expiryMonth})}
            value={this.state.expiryMonth}
          />
          <TextInput style={styles.textinput} placeholder="Year" placeholderTextColor='#000000'
            onChangeText={(expiryYear) => this.setState({expiryYear})}
            value={this.state.expiryYear}
          /> */}
          
          {/* <DatePickerIOS
            mode = 'date'
            date={this.state.chosenDate}
            onDateChange={this.setDate}
            /> */}
          <Text style={styles.header}>Billing Info</Text>
          <TextInput style={styles.textinput} placeholder="First Name" placeholderTextColor='#000000'
            onChangeText={(firstName) => this.setState({firstName})}
            value={this.state.firstName}
          />
          <TextInput style={styles.textinput} placeholder="Last Name" placeholderTextColor='#000000'
             onChangeText={(lastName) => this.setState({lastName})}
             value={this.state.lastName}
          />
          <TextInput style={styles.textinput} placeholder="Address" placeholderTextColor='#000000'
            onChangeText={(address) => this.setState({address})}
            value={this.state.address}          
          />
          <TextInput style={styles.textinput} placeholder="City" placeholderTextColor='#000000'
            onChangeText={(city) => this.setState({city})}
            value={this.state.city}

          />
          <TextInput style={styles.textinput} placeholder="State" placeholderTextColor='#000000'
            onChangeText={(state) => this.setState({state})}
            value={this.state.state}
       
          />
          <TextInput style={styles.textinput} placeholder="Zip Code" placeholderTextColor='#000000'
            onChangeText={(zip) => this.setState({zip})}
            value={this.state.zip}

          />
          <TextInput style={styles.textinput} placeholder="Country" placeholderTextColor='#000000'
            onChangeText={(country) => this.setState({country})}
            value={this.state.country}

          />
          <TextInput style={styles.textinput} placeholder="Phone Number" placeholderTextColor='#000000'
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
      backgroundColor: '#F5F5F5',
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
      color: '#000000',
      paddingBottom: 10,
      marginBottom: 20,
      borderBottomColor: '#fff',
      borderBottomWidth: 2,

  },
  textinput:{
      alignSelf: 'stretch',
      height: 40,
      marginBottom: 30,
      color: 'black',
      borderBottomColor: '#000000',
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
    color: 'black',
    backgroundColor: 'transparent',
  },
});

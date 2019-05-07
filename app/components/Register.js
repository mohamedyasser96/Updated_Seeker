import React, { Component } from 'react';
import { Center } from "@builderx/utils";
import { Alert, View, StyleSheet, Text, Image, AppRegistry, KeyboardAvoidingView, TouchableOpacity } from "react-native";
import { Camera, Permissions } from 'expo';
import { TextInput } from 'react-native-gesture-handler';

import { Button } from 'native-base';

export default class App extends Component {
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
          this.props.navigation.navigate("First")
          
        }
      }
  
    constructor(props){
      super(props);
      this.state = { username: '',
                      password: '',
                      email: '',
                      mobileNumber: '',
                      FaceRegScreen: false,
                      hasCameraPermission: null,
                      type: Camera.Constants.Type.back,
                    };

      this.registerFace = this.registerFace.bind(this);
      this.loginFacial = this.loginFacial.bind(this);
  
     //this.register2 = this.register2.bind(this);
    }

    toggleFaceRecog = () => 
        this.setState({ FaceRegScreen: !this.state.FaceRegScreen})
    
    async componentDidMount() {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      this.setState({ hasCameraPermission: status === 'granted' });
    }


    async register2(){
     try { 
      let result = await fetch('http://10.40.59.113:5000/register/seeker', {
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
  async registerFace() 
  {
      console.log("In reg faceeeeee")
      if (this.camera) {

          console.log("Inside this.camera ")

          const options = {
              base64: true,
              quality: 1.0
          };

          let data = await this.camera.takePictureAsync(options)

          console.log("In reg face: ", data)

        fetch('http://10.40.59.113:5000/saveImage', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              Image: data.base64,
              email: this.state.email //here put the email el byregister beih
            })
         })
         .then((response) => response.json())
         .then((responseJson) => {
            console.log(responseJson);
         })
         .catch((error) => {
            console.error(error);
         });
    }
    this.toggleFaceRecog();
  }

  async loginFacial() 
  {

      if (this.camera) {

          const options = {
              base64: true,
              quality: 1.0
          };

          let data = await this.camera.takePictureAsync(options)

        fetch('http://10.40.59.113:5000/loginFacial', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              Image: data.base64              
            })
         })
         .then((response) => response.json())
         .then((responseJson) => {
            console.log(responseJson);
            // Navigate to homescreen after law successfully logged in weih take the token 
         })
         .catch((error) => {
            console.error(error);
         }); 

    }
  }



  render() {
    const {navigate} = this.props.navigation;
    const { hasCameraPermission } = this.state;

    if(this.state.FaceRegScreen){
      return(
        <View style={{ flex: 1 }}>
          <Camera style={{ flex: 1 }} type={this.state.type} ref={ref => { this.camera = ref; }}>
            <View
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                style={{
                  alignSelf: 'flex-end',
                  alignItems: 'center',
                  marginLeft:20
                }}
                onPress={() => {
                  this.setState({
                    type: this.state.type === Camera.Constants.Type.back
                      ? Camera.Constants.Type.front
                      : Camera.Constants.Type.back,
                  });
                }}>
                <Text
                  style={{ fontSize: 20 , marginBottom: 50, color: 'white' }}>
                Flip
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  alignSelf: 'flex-end',
                  alignItems: 'center',
                  marginLeft:60
                }}
                onPress={() => {this.registerFace()}}>
                <Text
                  style={{ fontSize: 20 , marginBottom: 50, color: 'white' }}>
                Register
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  alignSelf: 'flex-end',
                  alignItems: 'center',
                  marginLeft:90
                }}
                onPress={() => {this.toggleFaceRecog()}}>
                <Text
                  style={{ fontSize: 20 , marginBottom: 50, color: 'white' }}>
                Back
                </Text>
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
      );
    }





    else 
      return (
        <KeyboardAvoidingView style={styles.root} behavior="padding" enabled>
          <View style={styles.rect} />
          <Text style={styles.text}>Register</Text>
            <TextInput style={styles.textinput} placeholder="Username" placeholderTextColor='#fff' onChangeText={(username) => this.setState({username})}
              value={this.state.username}>
            </TextInput>
            <TextInput style={styles.textinput} placeholder="Email" placeholderTextColor='#fff' onChangeText={(email) => this.setState({email})}
              value={this.state.email}>
            </TextInput>
            <TextInput style={styles.textinput} placeholder="Password" secureTextEntry={true} placeholderTextColor='#fff' onChangeText={(password) => this.setState({password})}
              value={this.state.password}>
            </TextInput>
            <TextInput style={styles.textinput} placeholder="Phone Number" placeholderTextColor='#fff' onChangeText={(mobileNumber) => this.setState({mobileNumber})}
              value={this.state.mobileNumber}>
            </TextInput>
            {/* <Center horizontal>
            <Button9 style={styles.button7} />
            </Center>  */}
            
            <Center horizontal>
              <Button style={styles.button7} onPress={() => {this.register2()}}>
                  <Text style={styles.bcont2}>Register</Text>
              </Button>
              <Button style={styles.button8} onPress={() => {this.toggleFaceRecog()}}>
                  <Text style={styles.bcont2}>Register Face</Text>
              </Button>

          </Center>

        </KeyboardAvoidingView>
      );
  }
}
const styles = StyleSheet.create({
  root: {
    backgroundColor: "white",
    flex: 1,
    alignSelf: 'stretch',
     paddingLeft:60,
     paddingRight:60,
     alignItems: 'center',
     justifyContent: 'center',
  },
  bcont2: {
    fontSize: 15,
    fontWeight: "500",
    fontFamily: "Roboto",
    color: "#fff"
  },
  rect: {
    height: '80%',
    width: '200%',
    top: 0,
    left: 0,
    position: "absolute",
    backgroundColor: "rgba(2, 84, 3,1)",
    opacity: 1
  },
  button8: {
    top: '89%',
    position: "absolute",
    height: 44,
    width: 130,
    left: "32.8%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(164,41,34,1)",
    paddingRight: 16,
    paddingLeft: 16,
    borderRadius: 5,
    opacity: 0.91
  },
  text: {
    position: "absolute",
    backgroundColor: "transparent",
    left: "10.13%",
    top: "15.64%",
    color: "rgba(243,240,240,1)",
    fontSize: 23,
    fontFamily: "AGaramondPro-Regular"
  },
  image: {
    height: 300,
    width: 300,
    position: "absolute",
    top: "17.49%"
  },
  textinput:{
    alignSelf: 'stretch',
    height: 40,
    marginBottom: 30,
    color: '#fff',
    borderBottomColor: '#f8f8f8',
    borderBottomWidth: 1,
  },
  input: {
    //position: "absolute",
    top: "65.49%",
    borderBottomColor: '#f8f8f8',
    borderBottomWidth: 1,
    alignSelf: 'stretch',
    justifyContent:'center',
    alignItems:'center',
    marginLeft: 40,
    marginRight:60
  },
  input2: {
    //position: "absolute",
    top: "68.49%",
    borderBottomColor: '#f8f8f8',
    borderBottomWidth: 1,
    alignSelf: 'stretch',
    justifyContent:'center',
    alignItems:'center',
    marginLeft: 40,
    marginRight:60
  },
  button7: {
    top: '82.5%',
    position: "absolute",
    height: 44,
    width: 130,
    left: "32.8%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(164,41,34,1)",
    paddingRight: 16,
    paddingLeft: 16,
    //paddingBottom: 10,
    borderRadius: 5,
    opacity: 0.91
  },
  button9: {
    top: '90%',
    position: "absolute",
    height: 44,
    left: "32.8%"
  },
  text2: {
    top: '88%',
    position: "absolute",
    backgroundColor: "transparent",
    left: "32.8%"
  }
});
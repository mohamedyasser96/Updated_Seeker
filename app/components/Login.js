import React, { Component } from 'react';
import { Center } from "@builderx/utils";
import Button7 from "../symbols/button7";
import Button9 from "../symbols/button9";
import { Camera, Permissions } from 'expo';
import { Alert, View, StyleSheet, Text, Image, AppRegistry, AsyncStorage, KeyboardAvoidingView, TouchableOpacity} from "react-native";
import { Button } from 'native-base';
import { TextInput } from 'react-native-gesture-handler';


export default class App extends Component {
    static navigationOptions ={
        header:null
         // title: 'Login Screen',
      };
  
      constructor(props){
        super(props);
        this.state = { email: '',
                        password: '',
                        FaceRegScreen: false,
                        hasCameraPermission: null,
                        type: Camera.Constants.Type.back,
                      };

        this.loginFacial = this.loginFacial.bind(this);
       this.register2 = this.register2.bind(this);
      }


      toggleFaceRecog = () => 
      this.setState({ FaceRegScreen: !this.state.FaceRegScreen})
  
      async componentDidMount() {
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        this.setState({ hasCameraPermission: status === 'granted' });
      }

  async loginFacial() 
  {

      if (this.camera) {

          const options = {
              base64: true,
              quality: 1.0
          };

          let data = await this.camera.takePictureAsync(options)

        fetch('http://10.40.48.248:5000/loginFacial', {
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
            token = responseJson.Token
            if(token != null)
            {
              console.log("Successfull Face login")
              this._storeData(token)
              
            }
            // Navigate to homescreen after law successfully logged in weih take the token 
         })
         .catch((error) => {
            console.error(error);
         }); 

    }}

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
        await AsyncStorage.setItem('email', this.state.email)
        this.props.navigation.navigate("Main")
        
      }
      catch(error){
        console.log("Problem saving token")
      }
      }
      async register2()
      {
        try { 
         let result = await fetch('http://10.40.48.248:5000/login/seeker', {
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
    static navigationOptions ={
        header:null
         // title: 'Registration Screen',
      };
  render() {
    const {navigate} = this.props.navigation;
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
                onPress={() => {this.toggleFaceRecog()}}>
                <Text
                  style={{ fontSize: 20 , marginBottom: 50, color: 'white' }}>
                Back
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  alignSelf: 'flex-end',
                  alignItems: 'center',
                  marginLeft:90
                }}
                onPress={() => {this.loginFacial()}}>
                <Text
                  style={{ fontSize: 20 , marginBottom: 50, color: 'white' }}>
                Login
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
            {/* <Text style={styles.text}>CocoaBeans' Seeker</Text> */}
            <Center horizontal>
              <Image source={require("./2.png")} style={styles.image} />
            </Center>
            {/* <Center horizontal> */}
              <TextInput style={styles.input} placeholder="Email" placeholderTextColor='black' onChangeText={(email) => this.setState({email})}
                value={this.state.email}>
              </TextInput>
              <TextInput style={styles.input2} placeholder="Password" secureTextEntry={true} placeholderTextColor='black' onChangeText={(password) => this.setState({password})}
                value={this.state.password}>
              </TextInput>
            {/* </Center> */}
            <Center horizontal>
              <Button style={styles.button7} onPress={() => {this.register2()}}>
                <Text style={styles.bcont2}>Login</Text>
              </Button>
              <Button style={styles.button8} onPress={() => {this.toggleFaceRecog()}}>
                <Text style={styles.bcont2}>Face ID</Text>
              </Button>
            </Center>
            <Button style={styles.button9} onPress={() => {navigate('Second')}}>
                <Text style={styles.buttonContent}>Click Here</Text>
            </Button> 
            <Text style={styles.text2}> Not a User? </Text>
          </KeyboardAvoidingView>
        );
  }
}

// const styles = StyleSheet.create({
//   root: {
//     backgroundColor: "white",
//     flex: 1,
//     alignSelf: 'stretch',
//      paddingLeft:60,
//      paddingRight:60,
//      alignItems: 'center',
//      justifyContent: 'center',
//   },
//   bcont2: {
//     fontSize: 15,
//     fontWeight: "500",
//     fontFamily: "Roboto",
//     color: "#fff"
//   },
//   rect: {
//     height: '80%',
//     width: '200%',
//     top: 0,
//     left: 0,
//     position: "absolute",
//     backgroundColor: "white",
//     opacity: 1
//   },
//   button8: {
//     top: '89%',
//     position: "absolute",
//     height: 44,
//     width: 130,
//     left: "32.8%",
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "rgba(164,41,34,1)",
//     paddingRight: 16,
//     paddingLeft: 16,
//     borderRadius: 5,
//     opacity: 0.91
//   },
//   text: {
//     position: "absolute",
//     backgroundColor: "transparent",
//     left: "10.13%",
//     top: "15.64%",
//     color: "rgba(243,240,240,1)",
//     fontSize: 23,
//     fontFamily: "AGaramondPro-Regular"
//   },
//   image: {
//     height: 300,
//     width: 300,
//     position: "absolute",
//     top: "17.49%"
//   },
//   textinput:{
//     alignSelf: 'stretch',
//     height: 40,
//     marginBottom: 30,
//     color: 'black',
//     borderBottomColor: 'black',
//     borderBottomWidth: 1,
//   },
//   input: {
//     //position: "absolute",
//     top: "65.49%",
//     borderBottomColor: '#f8f8f8',
//     borderBottomWidth: 1,
//     alignSelf: 'stretch',
//     justifyContent:'center',
//     alignItems:'center',
//     marginLeft: 40,
//     marginRight:60
//   },
//   input2: {
//     //position: "absolute",
//     top: "68.49%",
//     borderBottomColor: '#f8f8f8',
//     borderBottomWidth: 1,
//     alignSelf: 'stretch',
//     justifyContent:'center',
//     alignItems:'center',
//     marginLeft: 40,
//     marginRight:60
//   },
//   button7: {
//     top: '82.5%',
//     position: "absolute",
//     height: 44,
//     width: 130,
//     left: "32.8%",
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "rgba(164,41,34,1)",
//     paddingRight: 16,
//     paddingLeft: 16,
//     //paddingBottom: 10,
//     borderRadius: 5,
//     opacity: 0.91
//   },
//   button9: {
//     top: '90%',
//     position: "absolute",
//     height: 44,
//     left: "32.8%"
//   },
//   text2: {
//     top: '88%',
//     position: "absolute",
//     backgroundColor: "transparent",
//     left: "32.8%"
//   }
// });

const styles = StyleSheet.create({
  root: {
    backgroundColor: "white",
    flex: 1
  },
  rect: {
    height: '80%',
    width: '100%',
    top: 0,
    left: 0,
    position: "absolute",
    backgroundColor: "white",
    opacity: 1
  },
  Broot: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    borderRadius: 5
  },
  buttonContent: {
    fontSize: 13,
    fontWeight: "500",
    fontFamily: "Roboto",
    color: "#000"
  },
  bcont2: {
    fontSize: 17,
    fontWeight: "500",
    fontFamily: "Roboto",
    color: "#fff"
  },
  text: {
    position: "absolute",
    backgroundColor: "transparent",
    left: "10.13%",
    top: "15.64%",
    color: "black",
    fontSize: 16,
    fontFamily: "AGaramondPro-Regular"
  },
  image: {
    height: 300,
    width: 300,
    position: "absolute",
    top: "17.49%"
  },
  input: {
    //position: "absolute",
    top: "65.49%",
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    alignSelf: 'stretch',
    justifyContent:'center',
    alignItems:'center',
    marginLeft: 40,
    marginRight:60,
    color: '#42b3f4'
  },
  input2: {
    //position: "absolute",
    top: "68.49%",
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    alignSelf: 'stretch',
    justifyContent:'center',
    alignItems:'center',
    marginLeft: 40,
    marginRight:60,
    color: '#42b3f4'
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
    backgroundColor: "#42b3f4",
    paddingRight: 16,
    paddingLeft: 16,
    borderRadius: 5,
    opacity: 0.91
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
    backgroundColor: "#42b3f4",
    paddingRight: 16,
    paddingLeft: 16,
    borderRadius: 5,
    opacity: 0.91
  },
  button9: {
    top: '90%',
    position: "absolute",
    height: 44,
    left: "9.8%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    borderRadius: 5
  },
  text2: {
    top: '89%',
    position: "absolute",
    backgroundColor: "transparent",
    left: "8.8%"
  }
});
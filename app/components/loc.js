import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from "react-native-maps";
//import Button4 from "../symbols/button4";

import {createStackNavigator, createAppContainer} from 'react-navigation';



import FetchLocation from "./FetchLocation"
import { Button } from 'native-base';



export default class loc extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            latitude: 0,
            longitude: 0,
            error: null
        };
        //this.getUserLocation = this.getUserLocation.bind(this);
    }
     componentDidMount() {
         navigator.geolocation.getCurrentPosition(position => {
             this.setState({
                 latitude: position.coords.latitude,
                 longitude: position.coords.longitude,
                 error: null
             }), console.log("A7a");
         }, error => this.setState({ error: error.message}),
         { enableHighAccuracy: true, timeout: 20000, maximumAge: 2000}
         );
     }

    static navigationOptions ={
        header:null
         // title: 'Registration Screen',
      };
   getUserLocation = () => {
     console.log('Pressed the button')
     navigator.geolocation.getCurrentPosition(position => {
       //this.state.latitude=position["coords"]["latitude"];
        console.log(position["coords"]["latitude"]);
        console.log(position["coords"]["longitude"]);
       //this.state.longitude = position["coords"]["longitude"];
     }, err => console.log(err));

   }
   render() {
    const {navigate} = this.props.navigation;
     return (
       <View style={styles.container}>
       <MapView
              style={styles.map}
              region={{
                latitude: this.state.latitude,
                longitude: this.state.longitude,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
              }}>
              <Marker coordinate={this.state} />
        </MapView>
        <FetchLocation onGetLocation={this.getUserLocation} />
        
          <Button large block style={styles.button} ><Text>REQUEST</Text></Button>
       </View>
     );
   }
}

 const styles = StyleSheet.create({
   container: {
     flex: 1,
     backgroundColor: '#ffffff',
     //backgroundGradient: 'vertical',
     paddingLeft:60,
     paddingRight:60,
     alignItems: 'center',
     justifyContent: 'center',
   },
   map: {
    ...StyleSheet.absoluteFillObject,
    height: 630,
  },
  button:{
    alignSelf: 'stretch',
    alignItems: 'center',
    padding: 10,
    paddingBottom: 10,
    backgroundColor: '#1990e5',
    marginTop: 30,
    top: "95%",
    //left: 148.53
  },
  btntext:{
      alignItems: 'center',
      fontSize: 17,
      justifyContent: 'center',
      left: 148.53,
      //colo

  },
  button4: {
    position: "absolute",
    height: 43,
    top: "58.98%",
    left: 148.53
  }
});


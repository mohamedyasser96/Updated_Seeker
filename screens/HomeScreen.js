import React from 'react';
import { StyleSheet, Text, View, AsyncStorage } from 'react-native';
import MapView, { Marker } from "react-native-maps";
import Modal from "react-native-modal"

import EventSource from 'react-native-event-source';
import Dialog, { DialogContent } from 'react-native-popup-dialog';

import { Button } from 'native-base';



export default class loc extends React.Component {
 
    constructor(props){
        super(props);
        this.state = {
            latitude: 0,
            longitude: 0,
            isModalVisible: false,
            error: null,
            // token: null,
            map:{
              lat: 0,
              lon: 0,
              numberofproviders: 1
            },
            providername: '',
            amount: '100 EGP'
        };
        

        
        // this.state.token = this._retrieveData()        
        //this.getUserLocation = this.getUserLocation.bind(this);
    }
    _toggleModal = () => 
        this.setState({ isModalVisible: !this.state.isModalVisible})
     componentDidMount() {
         navigator.geolocation.getCurrentPosition(position => {
             this.setState({
                 latitude: position.coords.latitude,
                 longitude: position.coords.longitude,
                 error: null
             }), console.log("Hey");
         }, error => this.setState({ error: error.message}),
         { enableHighAccuracy: true, timeout: 20000, maximumAge: 2000}
         );
         


          this.eventSource = new EventSource('http://localhost:8080/notification', {headers: {
           Accept: 'application/json',
           'Content-Type': 'application/json',
           'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhc3NlckBlbWFpbC5jb20iLCJhdWQiOiIyIiwiaWF0IjoxNTU0OTIyMjg3LCJleHAiOjE1NTQ5MjU4ODd9.iiRKwNmdoEUDhwhsT9B-3kqgEHEFLsY9G1J4KcbyEeo'
          }})
          this.eventSource.addEventListener('message', (data) => {
            console.log(data.type); // message
            console.log(data.data)
            this.setState({
              dataz:data.data
            })
            
            this.togglePopup(true)
          });
     }

     togglePopup(pop) {
      console.log('before', this.state.popup)
      this.setState({
        popup: pop
      });
      console.log('after', this.state.popup)
    }

    static navigationOptions ={
        header:null
         // title: 'Registration Screen',
      };
   
  
   render() {
    //const {navigate} = this.props.navigation;
    if(!this.state.popup) {
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
              <Marker coordinate={this.provs} pinColor='#417df4'/>
        </MapView>
        <Modal isVisible={this.state.isModalVisible}>
          <View style={{ flex: 1 }}>

            <Text style={styles.text}>{this.state.providername}</Text>
            <Text style={styles.text}>Price is : {this.state.amount}</Text>
            <Button full success style={styles.button} onPress={() => {this._toggleModal()}} >
              <Text>PAY</Text>
            </Button>
            <Button full danger style={styles.button} onPress={() => {this._toggleModal()}} >
              <Text>Cancel </Text>
            </Button>
          </View>
        </Modal>
        {/* <FetchLocation onGetLocation={this.getUserLocation} /> */}
        
          {/* <Button full success style={styles.button} onPress={this._toggleModal} ><Text style={{color:'#ffffff'}}>REQUEST</Text></Button> */}
       </View>
     );
            }
            else {
              console.log(this.state.popup)
              return (
                <View style={styles.container}>
                  <Dialog visible={this.state.popup}
                    onTouchOutside={() => {
                        this.setState({popup:false})
                      }}>
                    <DialogContent>
                      <Text> REQUEST AVAILABLE </Text>
                      <Button title="Close"
                        onPress = {() => {
                          this.setState({popup:false})
                        }}/>
                    </DialogContent>
                  </Dialog>         
                </View>
              );
            }
          
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
  text:{
    top: "30%",
    fontWeight: "bold",
    color: "#ffffff"
  },

  button:{
    alignSelf: 'stretch',
    alignItems: 'center',
    padding: 10,
    paddingBottom: 10,
    //backgroundColor: '#1990e5',
    marginTop: 30,
    top: "95%",
    //left: 148.53
  },
  btntext:{
      alignItems: 'center',
      fontSize: 17,
      justifyContent: 'center',
      left: 148.53,
      backgroundColor: '#ffffff',
      //colo

  },
  button4: {
    position: "absolute",
    height: 43,
    top: "58.98%",
    left: 148.53
  }
});


import React from 'react';
import { StyleSheet, Text, View, AsyncStorage, Alert, Picker, ScrollView, TextInput } from 'react-native';
import MapView, { Marker } from "react-native-maps";
import Modal from "react-native-modal"
import EventSource from "react-native-event-source";
import { FlatGrid } from 'react-native-super-grid';
import { Dropdown } from 'react-native-material-dropdown';
import SockJS from 'sockjs-client';
import Stomp from "stompjs";

//import Button4 from "../symbols/button4";

import {createStackNavigator, createAppContainer} from 'react-navigation';



import FetchLocation from "../app/components/FetchLocation"
import { Button , Icon} from 'native-base';

var stompClient = null;
var img = null;
var sesid = null;
var items = [];
var topic = null;

export default class loc extends React.Component {
  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('token');
      if (value !== null) {
        // We have data!!
        console.log("okoko", value);
        return value
      }
    } catch (error) {
      // Error retrieving data
    }
  };
    constructor(props){
        super(props);
        this.state = {
            latitude: 30.1,
            longitude: 31.0,
            isModalVisible: false,
            error: null,
            expertLevel: '',
            // token: null,
            map:{
              lat: 0,
              lon: 0,
              numberofproviders: 2
            },
            providername: '',
            amount: '100 EGP',
            tot_provs: ['henna', 'asser', 'hamada'],
            itemcolor: 'blue',
            email: '',
            screenFlag: false, 
            item : [],
            mess: '', 
            OnReuqest: false,


            
        };

        this.change = this.change.bind(this);
        this.on_connect = this.on_connect.bind(this);
        
        setInterval(() => (
          this.setState({item:items})), 1000);
        
        

        
        // this.state.token = this._retrieveData()        
        //this.getUserLocation = this.getUserLocation.bind(this);
    }

    async on_connect(emails){

      var socket = new SockJS('http://localhost:8080/chat');
      stompClient = Stomp.over(socket);  

      let email =  await AsyncStorage.getItem('email');
      topic = email + "_" + emails;
        
      stompClient.connect({}, function(frame) {
      
        var urlarray = socket._transport.url.split('/');
        var index = urlarray.length - 2;
  
        sesid = urlarray[index];
        
        stompClient.subscribe('/user/topic/messages', function(messageOutput) {
          console.log('Message Received')
  
          var obj = JSON.parse(messageOutput.body)
          items.splice(0, 0, obj.from +": "+obj.message);
        });
  
        stompClient.subscribe('/user/topic/images', function(messageOutput) {
          console.log('Image Received:');
        });

        stompClient.subscribe('/user/topic/location', function(messageOutput) {
          console.log('Location Received:');
        });

  
        var Obj = { "topic": topic ,"id": sesid};
        var jsonObj = JSON.stringify(Obj);
        stompClient.send("/app/register", {}, jsonObj);
  
      });
  
      }
  

    sendMessage = () =>{
      var from = this.state.email
      var text = this.state.mess
  
      stompClient.send("/app/chat/text/"+topic, {}, JSON.stringify({'from':from, 'text':text}));
    }

    on_disconnect = () => {
    
      var Obj = { "topic": topic,"id": sesid};
      var jsonObj = JSON.stringify(Obj);
      stompClient.send("/app/disconnect", {}, jsonObj);
  
      if(stompClient != null) {
        stompClient.disconnect();
      }
  
    }

    async triggerAlert(providers) {
      console.log("TRIGEER", providers);
     this.state.tot_provs = providers
      console.log(this.state.tot_provs),
      this._toggleModal()
      console.log(this.state)

    }

    change = () => 
        this.setState({ screenFlag: !this.state.screenFlag})

    
    toggleRequestPage = () => 
        this.setState({ OnReuqest: !this.state.OnReuqest})


    _toggleModal = () => 
        this.setState({ isModalVisible: !this.state.isModalVisible})

     async componentDidMount() {
      //  this.acceptProvider = this.acceptProvider.bind(this);
      this.state.email = await AsyncStorage.getItem('email')
       console.log("Inside here")
       this.global_ind = -1;
      this.eventSource = new EventSource("http://10.7.126.186:8080/notifySeeker", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        }
      });

      this.eventSource.addEventListener("message", data => {
        console.log(data.type); // message
        var res_str = data.data.slice(1); 
        var res_json = JSON.parse(res_str);
  
        this.triggerAlert(res_json);
      });


      


         navigator.geolocation.getCurrentPosition(position => {
             this.setState({
                 latitude: position.coords.latitude,
                 longitude: position.coords.longitude,
                 error: null
             }), console.log("Hey");
         }, error => this.setState({ error: error.message}),
         { enableHighAccuracy: true, timeout: 20000, maximumAge: 2000}
         );
     }

    static navigationOptions ={
        header:null
         // title: 'Registration Screen',
      };



    async acceptProvider(emails) {
      // var emails = "asser1@email.com"
      console.log("emaail", emails);
      
      this.on_connect(emails);

      // console.log("ind", this.global_ind);
      let token = await AsyncStorage.getItem("token");
      fetch("http://10.7.126.186:8080/acceptProviders", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        },
        body: JSON.stringify({
          providerEmail: emails
        })
      })
        .then(response => response.text())
        .then(responseJson => {
          console.log(responseJson);
          this.toggleRequestPage();
          // Alert.alert(
          //   'Success',
          //   'Provider Henna@email.com on the way',
          //   [
          //     {text: 'OK', onPress: () => console.log('OK Pressed')},
          //   ],
          //   {cancelable: false},
          // );
        })
        .catch(error => {
          console.error(error);
        });


        this.eventSource = new EventSource("http://10.7.126.186:8080/requestCancelled", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        }
      });

      this.eventSource.addEventListener("message", data => {
        console.log("KHSDAHDJA ", data.data); // message
        // var res_str = data.data.slice(1); 
        // var res_json = JSON.parse(res_str);

        Alert.alert(
          'Cancelled',
          data.data,
          [
            {text: 'OK', onPress: () => console.log('OK Pressed')},
          ],
          {cancelable: false},
        );

      });


        this.eventSource = new EventSource("http://10.7.126.186:8080/endRequest", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        }
      });

      this.eventSource.addEventListener("message", data => {
        console.log(data.type); // message
        // var res_str = data.data.slice(1); 
        // var res_json = JSON.parse(res_str);
        this.on_disconnect()
        
        Alert.alert(
          'Provider Ended',
          data.data,
          [
            {text: 'OK', onPress: () => {this.props.navigation.navigate('Pay'), this._toggleModal()}},
          ],
          {cancelable: false},
        );

      });
    }
  
  async postloc(){
        try { 
        // console.log('BHEGDIWDUIOHWOJWD', this._retrieveData()._55)
        navigator.geolocation.getCurrentPosition(position => {
           console.log(position["coords"]["latitude"]);
           console.log(position["coords"]["longitude"]);
           this.state.latitude = position["coords"]["latitude"];
           this.state.longitude = position["coords"]["longitude"];
           this.state.map.lat = position["coords"]["latitude"];
           this.state.map.lon = position["coords"]["longitude"];
        }, err => console.log(err));
        let token = await AsyncStorage.getItem('token')
        fetch("http://10.7.126.186:8080/findProviders", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + token
          },
          body: JSON.stringify({
            lat: this.state.latitude,
            lon: this.state.longitude,
            num_providers: 1,
            expertLevel: this.state.expertLevel
          })
        })
          .then(response => response.text())
          .then(responseJson => {
            console.log(responseJson);
          })
          .catch(error => {
            console.error(error);
        });
      //   console.log(body);
      //   // console.log('HEADERS: ', headers)
      //  console.log('RESULTTTTTT', result);
      //  this.state.providername = result._bodyInit;
      //  var temp = result._bodyInit;
      //  var ind = temp.indexOf("=")
      //  var first_half = temp.slice(ind+1, ind + temp.length)
      //  console.log(first_half)
      //  var ind_equal = first_half.indexOf("=")
      //  var ind_fs = temp.indexOf("[")
      //  var ind_sc = temp.indexOf("@")
      //  var ProviderName = temp.slice(ind_fs+1, ind_sc)
      //  console.log(ProviderName)
      //  this.state.providername = "The Nearest Provider is : " + ProviderName
      //  var lati = first_half.slice(0, ind_equal)
      //  var longi = first_half.slice(ind_equal+1, first_half.length-1)
      //  console.log("JDSHDK", lati, longi)
  
      //  this.provs = {
      //    latitude: parseFloat(lati),
      //    longitude : parseFloat(longi)
      //  }
      //  console.log(this.provs)
       
       //this.checkStatus(result.status, result._bodyInit)
     } catch (error) {
         console.log(error);
         console.log('aywaaa')
       };
     }
  //  getUserLocation = () => {
  //    console.log('Pressed the button')
  //    navigator.geolocation.getCurrentPosition(position => {
  //      //this.state.latitude=position["coords"]["latitude"];
  //       console.log(position["coords"]["latitude"]);
  //       console.log(position["coords"]["longitude"]);
  //       // this.state.map.lat = position["coords"]["latitude"];
  //       // this.state.map.lon = position["coords"]["longitude"];
  //       this.state.map.lat = 30.1;
  //       this.state.map.lon = 31.0;
  //       this.postloc()
  //      //this.state.longitude = position["coords"]["longitude"];
  //    }, err => console.log(err));

  //  }
   render() {
    let data = [{
      value: '1',
    }, {
      value: '2',
    }, {
      value: '3',
    }];
    let colors = ['#2ecc71', '#2980b9', '#f1c40f', '#95a5a6', '#c0392b'];
    const {navigate} = this.props.navigation;
    const items = [
      'TURQUOISE', 'EMERALD',
       'PETER RIVER', 'AMETHYST',
     'WET ASPHALT'
    ];
    if(!this.state.screenFlag && !this.state.OnReuqest)
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
            <FlatGrid
                itemDimension={140}
                items={this.state.tot_provs}
                style={styles.gridView}
                renderItem={({ item, index }) => (
                  <View style={[styles.itemContainer, { backgroundColor: '#2980b9'}]}>
                  <Text style={styles.itemName}>{'Email: ' + item.email}</Text>
                    <Text style={styles.itemName}>{'Dist: ' + item.distance}</Text>
                    <Text style={styles.itemName}>{'ETA: ' + item.eta}</Text>
                    <Text style={styles.itemName}>{'UN: ' + item.username}</Text>
                    <Text style={styles.itemName}>{'MN: ' + item.mobileNumber}</Text>
                    <Text style={styles.itemName}>{'Rating:' + item.rating}</Text>

                    <Button transparent success onPress = {() => {this.acceptProvider(item.email)}}><Text>Select </Text></Button>
                    {/* <Button onPress = {() => {this.change()}}><Text>Chat </Text></Button> */}
                    {/* <Text style={styles.itemCode}>{item.code}</Text> */}
                  </View>
                  
              )}
              
              />
            <Button iconLeft transparent style={{paddingLeft:10, paddingTop:10}} onPress={() => {this._toggleModal()}}>
                <Icon name='close' />
                <Text style={{paddingLeft:10}}>Cancel</Text>
           </Button>  
            <Button full danger style={styles.button} onPress={() => {this._toggleModal()}} >
              <Text>Cancel </Text>
            </Button>
          </View>
        </Modal>
           <Text style={{fontSize: 20, color: 'black', top: 70}}>Expert Level</Text>
           <Picker
              selectedValue={this.state.expertLevel}
              style={{height: 50, width: 100, paddingTop: 5, top: 75}}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({expertLevel: itemValue})
              }>
              <Picker.Item label="Low" value = "1" />
              <Picker.Item label="Medium" value = "2" />
              <Picker.Item label="High" value = "3" />
            </Picker>
          <Button full success style={styles.button} onPress={() => {this.postloc()}} ><Text style={{color:'#ffffff'}}>REQUEST</Text></Button>
          {/* <Button full success style={styles.button} onPress={() => {this.toggleRequestPage()}} ><Text style={{color:'#ffffff'}}>REQUEST</Text></Button> */}
       </View>
     );
     else if(this.state.OnReuqest && !this.state.screenFlag)
          return(

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
                  {/* <Text style={{fontSize: 20, color: 'black', top: '50%'}}>On Request</Text> */}
                <Button full success style={styles.button} onPress={() => {this.change()}} ><Text style={{color:'#ffffff'}}>CHAT</Text></Button>
                <Button full success style={styles.button} onPress={() => {this._toggleModal()}} ><Text style={{color:'#ffffff'}}>CANCEL</Text></Button>

            </View>

     );
     else{
      return (
        <View style={styles.container2}>
  
          <TextInput
            style={[styles.default, {height: Math.max(35, this.state.height)}]}
            placeholder="Message"
            value={this.state.mess}
            onChangeText={(text) => this.setState({mess:text})}
                  />
  
          <Button full success style={styles.button} onPress={() => {this.sendMessage()}} ><Text style={{color:'#ffffff'}}>Send Message</Text></Button>
          <Button full success style={styles.button} onPress = {() => {this.change()}}><Text>Chat </Text></Button>

  
          <ScrollView>
            { 
              this.state.item.map((item,key) =>
              (
                  <View key = {key} style = {styles.item}>
                    <Text style = {styles.text2}> {item} </Text>
                  </View>
              ))
            }
          </ScrollView>
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
  gridView: {
    marginTop: 20,
    flex: 1,
  },
  itemContainer: {
    justifyContent: 'flex-end',
    borderRadius: 30,
    padding: 10,
    height: 180,
  },
  itemName: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
  itemCode: {
    fontWeight: '600',
    fontSize: 12,
    color: '#fff',
  },
  dd:{
    alignSelf: 'stretch',
    alignItems: 'center',
    padding: 10,
    paddingBottom: 10,
    //backgroundColor: '#1990e5',
    //marginTop: 30,
    top: "80%",
    //left: 148.53
  },
  button:{
    alignSelf: 'stretch',
    alignItems: 'center',
    padding: 10,
    paddingBottom: 10,
    //backgroundColor: '#1990e5',
    marginTop: 30,
    top: "70%",
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
  },
  text2: {
    borderColor: 'black',
    borderWidth : 1,
    fontSize: 15,
    color: "black",
    padding :15
},
container2: {
  paddingTop : 20
},
button2:{
  color : "blue",
  top: "25%"

}
});
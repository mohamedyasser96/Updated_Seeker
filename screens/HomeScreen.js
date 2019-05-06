import React from 'react';
import {StyleSheet, Text, View, AsyncStorage, Alert, Picker, ScrollView, ConsolePanel, TextInput } from 'react-native';
import MapView, { Marker } from "react-native-maps";
import Modal from "react-native-modal"
import EventSource from "react-native-event-source";
import { FlatGrid } from 'react-native-super-grid';
import SockJS from 'sockjs-client';
import Stomp from "stompjs";
import StarRating from 'react-native-star-rating';

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
            requestID: '',
            RatingScreen: false,
            starCount: 2.5,
            comment : "" ,
            provEmail: "",
            base64Image: ''



            
        };

        this.change = this.change.bind(this);
        this.on_connect = this.on_connect.bind(this);
        
        setInterval(() => (
          this.setState({item:items})), 1000);
        
        

        
        // this.state.token = this._retrieveData()        
        //this.getUserLocation = this.getUserLocation.bind(this);
    }

    // Rating Functions

    onStarRatingPress(rating) {
      this.setState({
        starCount: rating
      });
    }

    handlePress= ()=> {
      console.log("Key Pressed " + this.state.comment + " "+ this.state.starCount) 
      fetch("http://172.20.10.2:5000/rate", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        },
        body: JSON.stringify({
          email: this.state.provEmail,
          rating: this.state.starCount,
          comments: this.state.comment
        })
      })
        .then(response => response.text())
        .then(responseJson => {
          console.log(responseJson);
          //this.toggleRequestPage();
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
    }


    //Messaging Functions
    pickImage = async () => {
      const options = {
          base64: true,
          quality: 1.0,
          aspect :[4,3]
      };
  
      let result = await ImagePicker.launchImageLibraryAsync(options);
  
      if (!result.cancelled) {
        this.setState({ base64Image: result.base64 });
      }
    };

    async on_connect(emails){

      var socket = new SockJS('http://172.20.10.2:5000/chat');
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

          var dict = {"from": obj.from, "imageFlag": false, "message":obj.message}
          items.splice(0, 0, obj.from +": "+obj.message);
        });
  
        stompClient.subscribe('/user/topic/images', function(messageOutput) {
          console.log('Image Received:');

          var obj = JSON.parse(messageOutput.body)

          var dict = {"from": obj.from, "imageFlag": true, "message":obj.message}
  
          items.splice(0,0,dict);
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

    sendImage = () =>{
      var from = this.state.name
      var text = this.state.base64Image
      var topic = this.state.topic
  
      stompClient.send("/app/chat/images/"+topic, {}, JSON.stringify({'from':from, 'text':text}));
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
      //console.log(this.state)

    }

    // Toggling Screens

    toggleRating = () => 
        this.setState({ RatingScreen: !this.state.RatingScreen})

    change = () => 
        this.setState({ screenFlag: !this.state.screenFlag})

    
    toggleRequestPage = () => 
        this.setState({ OnReuqest: !this.state.OnReuqest})


    _toggleModal = () => 
        this.setState({ isModalVisible: !this.state.isModalVisible})

      // Checking for stuff
     async componentDidMount() {
      //  this.acceptProvider = this.acceptProvider.bind(this);
      this.interval = setInterval(() => this.sendLocation(), 10000);

      this.state.email = await AsyncStorage.getItem('email')
      console.log("Inside here")
      this.global_ind = -1;
      this.eventSource = new EventSource("http://172.20.10.2:5000/notifySeeker", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        }
      });

      this.eventSource.addEventListener("message", data => {
        console.log(data.type); // message
        //if(data.type)
        var res_str = data.data.slice(1); 
        var res_json = JSON.parse(res_str);
        console.log("This is the new output: ", res_json)
        //this.state.requestID = res_json.requestID;
        //console.log("THIS IS REQ ID: ", res_json.requestID)
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

     //Send loc every once in a while
     sendLocation = () =>{

      if(stompClient != null){

          var lat = this.state.latitude;
          var long = this.state.longitude;
          var from = this.state.email

          stompClient.send("/app/chat/location/"+topic, {}, JSON.stringify({'from':from, 'long':long, 'lat':lat}));   
      }
    }

    static navigationOptions ={
        header:null
         // title: 'Registration Screen',
      };

    postM(message){
      Alert.alert(
        'Sorry',
        message,
        [
          
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ],
        {cancelable: false},
      );
       }

    async acceptProvider(emails) {
      // var emails = "asser1@email.com"
      console.log("emaail", emails);
      this.state.provEmail = emails;
      
      this.on_connect(emails);

      // console.log("ind", this.global_ind);
      let token = await AsyncStorage.getItem("token");
      fetch("http://172.20.10.2:5000/acceptProviders", {
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
          console.log("I am here bit",responseJson);
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


        this.eventSource = new EventSource("http://172.20.10.2:5000/requestCancelled", {
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


        this.eventSource = new EventSource("http://172.20.10.2:5000/endRequest", {
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
            {text: 'OK', onPress: () => {this.toggleRating()}},
          ],
          {cancelable: false},
        );

      });
    }
  
    async postloc(){
      var flag = false;
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
          fetch("http://172.20.10.2:5000/findProviders", {
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
            }),
            
          })
            .then(response => response.text())
            .then(responseJson => {
              console.log("ghfhfh ", responseJson);
              if(responseJson.charAt(0) === 'U')
                {
                  console.log('Tamaaaam')
                  this.postM(responseJson)
                }
              else{
              var JSONres = JSON.parse(responseJson)
              this.state.requestID = JSONres.requestID;
              console.log("THIS IS REQ ID: ", JSONres.requestID)

              }
              
              

              //var strResp = JSON.stringify(responseJson);
              
              
            }
            )
            
            .catch(error => {
              console.error(error);
          });

      } catch (error) {
          console.log(error);
          console.log('aywaaa')
        };
      }

   render() {
    let colors = ['#2ecc71', '#2980b9', '#f1c40f', '#95a5a6', '#c0392b'];
    const {navigate} = this.props.navigation;
    if(!this.state.screenFlag && !this.state.OnReuqest && !this.state.RatingScreen)
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
                    {/* <Text style={styles.itemName}>{'UN: ' + item.username}</Text> */}
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
     //Rating Screen
     else if(this.state.RatingScreen && !this.state.screenFlag && this.state.OnReuqest)
     {
       return(
      <View style = {{marginTop:100}}>
          <Text style = {{textAlign: 'center', fontWeight: 'bold', fontSize: 18,}}>   Rate our service    </Text>
                <StarRating
                  disabled={false}
                  emptyStar={'ios-star-outline'}
                  fullStar={'ios-star'}
                  halfStar={'ios-star-half'}
                  iconSet={'Ionicons'}
                  maxStars={5}
                  containerStyle = {{marginTop:50}}
                  halfStarEnabled
                  rating={this.state.starCount}
                  selectedStar={(rating) => this.onStarRatingPress(rating)}
                  fullStarColor={'blue'}
                />
              
              <Text style = {{marginTop: 50,marginBottom: 50, textAlign: 'center', fontWeight: 'bold', fontSize: 18,}}>   Give us Feedbacks    </Text>

              <TextInput style={{marginTop: 25, marginBottom: 50, height: 100, borderColor: 'gray', borderWidth: 0.5}} onChangeText={(text) => this.setState({comment:text})} value={this.state.comment} />

              <Button
              large
              full
                  onPress = {this.handlePress}
                  title = "Rate"
                  color = "Red"
              />
              
              {/* <Button
                  onPress = {this.props.navigation.navigate('Pay')}
                  title = "Pay for Service"
                  color = "Blue"
              /> */}

      </View>
       );
     }
     //On request Screen
     else if(this.state.OnReuqest && !this.state.screenFlag  && !this.state.RatingScreen)
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
     //Messaging Screen
     else{
      return (
        <View style={styles.container2}>
          
          <TextInput
            style={[styles.default, {height: Math.max(35, this.state.height)}]}
            placeholder="Message"
            value={this.state.mess}
            onChangeText={(text) => this.setState({mess:text})}
                  />
  
          
          

  
          <ScrollView>
            { 
              this.state.item.map((item,key) =>
              (
                <View key = {key} style = {styles.item}>
                { 
                    item.imageFlag ? (
                     <Image source={{ uri: `data:image/jpg;base64,${item.message}` }} style={{ width: 200, height: 200 }} />
                ) : (
                    <Text style = {styles.text}> {item.message} </Text>
                    )}
                </View>
              ))
            }
          </ScrollView>
          <View style={styles.bottom}>
            < Button full success style={styles.buttonC} onPress={() => {this.sendMessage()}} ><Text style={{color:'#ffffff'}}>Send Message</Text></Button>
            <Button
              onPress={this.sendImage}
              title="Send Image"
              color="blue"
              accessibilityLabel="Learn more about this purple button"
              />

            <Button
              onPress={this.pickImage}
              title="Pick Image"
              style = {{marginTop:50}}
              color="blue"
              accessibilityLabel="Learn more about this purple button"
            />

          </View>

          <Button full success style={styles.buttonD} onPress = {() => {this.change()}}><Text>Back </Text></Button>
        </View>
      );
     }
   }
}

 const styles = StyleSheet.create({
   item:{
    backgroundColor: 'rgba(2,84,3,1)',
   },
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
  buttonC:{
    //alignSelf: 'stretch',
    alignItems: 'center',
    padding: 10,
    paddingBottom: 10,
    //backgroundColor: '#1990e5',
    marginTop: 5,
    //top: "90%",
    position: 'absolute', //Here is the trick
    bottom: 0,
    //left: 148.53
  },
  buttonD:{
    //alignSelf: 'stretch',
    alignItems: 'center',
    padding: 10,
    paddingBottom: 10,
    //backgroundColor: '#1990e5',
    marginTop: 5,
    top: "100%",
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
text3: {
  borderColor: 'black',
  borderWidth : 1,
  fontSize: 15,
  color: "white",
  padding :15
},
container2: {
  paddingTop : 20,
  //flex: 1,
},
container3: {
  
  flex: 1,
},
button2:{
  color : "blue",
  top: "25%"

},
bottom:{
  flex: 1,
    justifyContent: 'flex-end',
    //marginBottom: 36
  
}

});
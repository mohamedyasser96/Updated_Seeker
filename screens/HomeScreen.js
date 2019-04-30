import React from 'react';
import { StyleSheet, Text, View, AsyncStorage, Alert, Picker } from 'react-native';
import MapView, { Marker } from "react-native-maps";
import Modal from "react-native-modal"
import EventSource from "react-native-event-source";
import { FlatGrid } from 'react-native-super-grid';
import { Dropdown } from 'react-native-material-dropdown';

//import Button4 from "../symbols/button4";

import {createStackNavigator, createAppContainer} from 'react-navigation';



import FetchLocation from "../app/components/FetchLocation"
import { Button } from 'native-base';



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
            itemcolor: 'blue'
        };
        

        
        // this.state.token = this._retrieveData()        
        //this.getUserLocation = this.getUserLocation.bind(this);
    }

    async triggerAlert(providers) {

      var my_provs = []
      var sex = providers
      console.log("TRIGEER", providers);
      for (let i = 0; i < providers.length; i++) {
        console.log(i);
        console.log(sex[i])
         var obj = await { 
          text: providers[i],
          onPress: () => this.acceptProvider(sex[i])
        };
        my_provs.push(obj);
     }
     this.state.tot_provs = providers
    //  my_provs.push({text: "Cancel",
    //                 onPress: () => console.log("Cancel")
    //               });
      // Alert.alert(
      //   'Providers available',
      //   "Please pick a provider",
      //   my_provs,
      //   {cancelable: false},
      // );
      console.log(this.state.tot_provs),
      this._toggleModal()
      console.log(this.state)

    }


    _toggleModal = () => 
        this.setState({ isModalVisible: !this.state.isModalVisible})

     componentDidMount() {
      //  this.acceptProvider = this.acceptProvider.bind(this);
       console.log("Inside here")
       this.global_ind = -1;
      this.eventSource = new EventSource("http://10.7.126.227:8080/notifySeeker", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        }
      });
      this.eventSource.addEventListener("close", data => {
        console.log(data.type); // message
        console.log("DATAAA", data);
      });

      this.eventSource.addEventListener("message", data => {
        console.log(data.type); // message
        var res_str = data.data.slice(1); 
        var res_json = JSON.parse(res_str);
        console.log("This IS RES JSON", res_json)
        var provs = res_json["providers"];
        console.log("type j", typeof(res_json));
        console.log("type pr", typeof(provs));
  
        this.triggerAlert(provs);
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
      // console.log("ind", this.global_ind);
      let token = await AsyncStorage.getItem("token");
      fetch("http://10.7.126.227:8080/acceptProviders", {
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
          Alert.alert(
            'Success',
            'Provider Henna@email.com on the way',
            [
              {text: 'OK', onPress: () => console.log('OK Pressed')},
            ],
            {cancelable: false},
          );
        })
        .catch(error => {
          console.error(error);
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
        fetch("http://10.7.126.227:8080/findProviders", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + token
          },
          body: JSON.stringify({
            lat: this.state.latitude,
            lon: this.state.longitude,
            num_providers: 2,
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
    const {navigate} = this.props.navigation;
    const items = [
      'TURQUOISE', 'EMERALD',
       'PETER RIVER', 'AMETHYST',
     'WET ASPHALT'
    ];
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
              itemDimension={130}
              items={this.state.tot_provs}
              style={styles.gridView}
              // staticDimension={300}
              // fixed
              // spacing={20}
              renderItem={({ item, index }) => (
                <View style={[styles.itemContainer, { backgroundColor: '#3498db' }]}>
                  <Text style={styles.itemName}>{item}</Text>
                  <Button onPress = {() => {this.acceptProvider(item)}}><Text>Select </Text></Button>
                  {/* <Text style={styles.itemCode}>{item.code}</Text> */}
                </View>
            )}
        />

            <Text style={styles.text}>{this.state.providername}</Text>
            <Text style={styles.text}>Price is : {this.state.amount}</Text>
            <Button full success style={styles.button} onPress={() => {this._toggleModal(), navigate('Pay')}} >
              <Text>PAY</Text>
            </Button>
            <Button full danger style={styles.button} onPress={() => {this._toggleModal()}} >
              <Text>Cancel </Text>
            </Button>
          </View>
        </Modal>
        {/* <FetchLocation onGetLocation={this.getUserLocation} /> */}
        {/* <Dropdown 
                //dropdownOffset={top = 60}
                style={styles.dd}
                label='Expert Level'
                baseColor='black'
                placeholderTextColor='black'
                data={data}
           /> */}
           <Text style={{fontSize: 20, color: 'black', top: 70}}>Expert Level</Text>
           <Picker
              selectedValue={this.state.expertLevel}
              style={{height: 50, width: 100, paddingTop: 5, top: 75}}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({expertLevel: itemValue})
              }>
              <Picker.Item label="1" value = "1" />
              <Picker.Item label="2" value = "2" />
              <Picker.Item label="3" value = "3" />
            </Picker>
          <Button full success style={styles.button} onPress={() => {this.postloc()}} ><Text style={{color:'#ffffff'}}>REQUEST</Text></Button>
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
    borderRadius: 5,
    padding: 10,
    height: 150,
  },
  itemName: {
    fontSize: 16,
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
  }
});
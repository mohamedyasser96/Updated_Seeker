import React from 'react';
import { Image, View, CameraRoll, StyleSheet, Text, AsyncStorage } from 'react-native';
import { FlatGrid } from 'react-native-super-grid';
import { ImagePicker } from 'expo';
import {Button} from 'native-base'

export default class ImagePickerExample extends React.Component {
  constructor(props){
    super(props);
    this.state = {
        
        tot_provs: ['henna', 'asser', 'hamada'],
        screenFlag: false,
        


        
    };
  }
  change = () => 
        this.setState({ screenFlag: !this.state.screenFlag})
  async acceptProvider() {
    // var emails = "asser1@email.com"
    
    
    
    console.log('Here!')
    // console.log("ind", this.global_ind);
    let token = await AsyncStorage.getItem("token");

    console.log(token)
    fetch("http://10.40.59.113:5000/seekerHistory", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        this.state.tot_provs = responseJson
        this.change()
      })
      .catch(error => {
        console.error(error);
      });
    }

  render() 
  {
    if(!this.state.screenFlag)
    return( 
      <View>
        <Button onPress = {() => {this.acceptProvider()}}><Text>Get History</Text></Button>
      </View>
    );
    else
    return(
    <View style={{ flex: 1 }}>
            <FlatGrid
                itemDimension={180}
                items={this.state.tot_provs}
                style={styles.gridView}
                renderItem={({ item, index }) => (
                  <View style={[styles.itemContainer, { backgroundColor: '#2980b9'}]}>
                  <Text style={styles.itemName}>{'Fees: ' + item.fees}</Text>
                    <Text style={styles.itemName}>{'Date: ' + item.dateRequested}</Text>
                    <Text style={styles.itemName}>{'From: ' + item.from}</Text>
                    {/* <Text style={styles.itemName}>{'UN: ' + item.username}</Text> */}
                    <Text style={styles.itemName}>{'To: ' + item.to}</Text>
                    <Text style={styles.itemName}>{'Provider:' + item.providerEmail}</Text>

                    {/* <Button transparent success onPress = {() => {this.acceptProvider(item.email)}}><Text>Select </Text></Button> */}
                    {/* <Button onPress = {() => {this.acceptProvider()}}><Text>Chat </Text></Button> */}
                    {/* <Text style={styles.itemCode}>{item.code}</Text> */}
                  </View>
                  
              )}
              
              />
          </View>
          );
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
   height: 200,
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
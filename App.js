import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import {createStackNavigator, createAppContainer} from 'react-navigation';
import Regform from "./app/components/RegForm"
import Logform from "./app/components/LoginForm"
import AddPform from "./app/components/AddPaymentForm"

import FirstScreen from "./app/components/RegForm"
import SecondScreen from "./app/components/LoginForm"
import Main from "./app/components/First"
import locScreen from "./app/components/loc"

import FetchLocation from "./app/components/FetchLocation"


  const MainNavigator = createStackNavigator({
    Main:{screen: Main},
    First: {screen:  FirstScreen},
    Second: {screen: SecondScreen},
    Third: {screen: locScreen}
  });

  const App = createAppContainer(MainNavigator);

  export default App;



// export default class App extends React.Component {
//    getUserLocation = () => {
//      console.log('Pressed the button')
//      navigator.geolocation.getCurrentPosition(position => {
//        console.log(position);
//      }, err => console.log(err));

//    }
//    render() {
//      return (
//        <View style={styles.container}>
//          <AddPform></AddPform>
//          {/* <FetchLocation onGetLocation={this.getUserLocation} /> */}
//        </View>
//      );
//    }
// }

//  const styles = StyleSheet.create({
//    container: {
//      flex: 1,
//      backgroundColor: '#51c192',
//      //backgroundGradient: 'vertical',
//      paddingLeft:60,
//      paddingRight:60,
//      alignItems: 'center',
//      justifyContent: 'center',
//    },
// });


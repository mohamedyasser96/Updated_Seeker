import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import {createStackNavigator, createAppContainer} from 'react-navigation';
import Regform from "./app/components/RegForm"
import Logform from "./app/components/LoginForm"
import AddPform from "./app/components/AddPaymentForm"

import FirstScreen from "./app/components/RegForm"
import SecondScreen from "./app/components/LoginForm"




const MainNavigator = createStackNavigator({
  First: {screen:  FirstScreen},
  Second: {screen: SecondScreen}
});

const App = createAppContainer(MainNavigator);

export default App;


// export default class App extends React.Component {
//   render() {
//     return (
//       <View style={styles.container}>
//         <AddPform></AddPform>
//       </View>
//     );
//   }
//}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#2a569e',
//     //backgroundGradient: 'vertical',
//     paddingLeft:60,
//     paddingRight:60,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });

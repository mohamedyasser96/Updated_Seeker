import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import Regform from "./app/components/RegForm"
import Logform from "./app/components/LoginForm"
import AddPform from "./app/components/AddPaymentForm"

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        {/* <Regform></Regform> */}
        {/* <Logform/> */}
        <AddPform></AddPform>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2a569e',
    //backgroundGradient: 'vertical',
    paddingLeft:60,
    paddingRight:60,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

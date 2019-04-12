import React, { Component } from "react";
import { View, TouchableOpacity, Text, StyleSheet} from "react-native";
import { Button } from 'native-base';

export default class button9 extends Component {
  // Only for displaying symbol in BuilderX.
  static containerStyle = {
    height: 44,
    width: 100,
    defaultHeight: "fixed",
    defaultWidth: "auto"
  };
  render() {
    return (
      <Button style={[styles.root, this.props.style]}>
        <Text style={styles.buttonContent}>Click Here</Text>
      </Button>
    );
  }
}
const styles = StyleSheet.create({
  root: {
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
  }
});

import React from 'react';
import { StyleSheet, Text, View, Button,ConsolePanel, ScrollView, TextInput } from 'react-native';
import SockJS from 'sockjs-client';
import Stomp from "stompjs";

var stompClient = null;
var img = null;
var sesid = null;
var items = [];

export default class Main extends React.Component {

  constructor(props) {
    super(props);
    this.state = { name: '' , topic: '' , mess:'', item :[]};

    setInterval(() => (
      this.setState({item:items})), 1000);
  }
   
  
  on_connect = () => {

    var socket = new SockJS('http://localhost:8080/chat');
    stompClient = Stomp.over(socket);  
    var topicSelected = this.state.topic;

    stompClient.connect({}, function(frame) {
    
      var urlarray = socket._transport.url.split('/');
      var index = urlarray.length - 2;

      sesid = urlarray[index];
      
      stompClient.subscribe('/user/topic/messages', function(messageOutput) {
        console.log('Message Received')

        var obj = JSON.parse(messageOutput.body)
        items.push(obj.from +":"+obj.message);
      });

      stompClient.subscribe('/user/topic/images', function(messageOutput) {
        console.log('Image Received:');
      });

      var Obj = { "topic": topicSelected ,"id": sesid};
      var jsonObj = JSON.stringify(Obj);
      stompClient.send("/app/register", {}, jsonObj);

    });

  }

  on_disconnect = () => {
    
    var topic = this.state.topic;
    var Obj = { "topic": topic,"id": sesid};
    var jsonObj = JSON.stringify(Obj);
    stompClient.send("/app/disconnect", {}, jsonObj);

    if(stompClient != null) {
      stompClient.disconnect();
    }

  }

  sendMessage = () =>{
    var from = this.state.name
    var text = this.state.mess
    var topic = this.state.topic

    stompClient.send("/app/chat/text/"+topic, {}, JSON.stringify({'from':from, 'text':text}));
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
        style={[styles.default, {height: Math.max(35, this.state.height)}]}
        placeholder="Name"
          value={this.state.name}
          onChangeText={(text) => this.setState({name:text})}
        />

        <TextInput
          style={[styles.default, {height: Math.max(35, this.state.height)}]}
          placeholder="Topic"
          value={this.state.topic}
          onChangeText={(text) => this.setState({topic:text})}
                />

        <Button
          onPress={this.on_connect}
          title="Connect"
          color="blue"
          accessibilityLabel="Learn more about this purple button"
          />

        <Button
          onPress={this.on_disconnect}
          title="Disconnect"
          color="blue"
          accessibilityLabel="Learn more about this purple button"
          />

        <TextInput
          style={[styles.default, {height: Math.max(35, this.state.height)}]}
          placeholder="Message"
          value={this.state.mess}
          onChangeText={(text) => this.setState({mess:text})}
                />

        <Button
          onPress={this.sendMessage}
          title="Send Message"
          color="blue"
          accessibilityLabel="Learn more about this purple button"
          />

        <ScrollView>
          { 
            this.state.item.map((item,key) =>
            (
                <View key = {key} style = {styles.item}>
                  <Text style = {styles.text}> {item} </Text>
                </View>
            ))
          }
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop : 20
  },
  text: {
      borderColor: 'black',
      borderWidth : 1,
      fontSize: 15,
      color: "black",
      padding :15
  }
});
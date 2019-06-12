import React, { Component } from "react";
import { View, StyleSheet } from "react-native";

import Form from "./src/components/Form";
import Logo from "./src/components/Logo";
export default class App extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Logo />
        <Form />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#455a64",
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});

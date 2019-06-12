import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Image
} from "react-native";
import {
  LoginManager,
  AccessToken,
  GraphRequest,
  GraphRequestManager
} from "react-native-fbsdk";
import { GoogleSignin, statusCodes } from "react-native-google-signin";

export default class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: ""
    };
  }

  async componentDidMount() {
    this._configureGoogleSignIn();
  }

  _configureGoogleSignIn() {
    GoogleSignin.configure({
      webClientId:
        "573434320763-ljqmdtkdv1cdg3neser62u8o5k0gr0e9.apps.googleusercontent.com",
      offlineAccess: false
    });
  }
// Handling facebook login   
  handleFacebookLogin() {
    LoginManager.logInWithReadPermissions([
      "public_profile",
      "email",
      "user_friends"
    ]).then(
      function(result) {
        if (result.isCancelled) {
          console.log("Login cancelled");
        } else {
          console.log("Login Access Token");
          AccessToken.getCurrentAccessToken().then(data => {
            let accessToken = data.accessToken;
            const responseInfoCallback = (error, result) => {
              setTimeout(() => {
                if (error) {
                  Alert.alert("Error" + error.toString());
                } else {
                  if (result.email == undefined) {
                    Alert.alert("Error", "Email address is required.");
                  } else {
                    Alert.alert("Login Successfully");
                  }
                }
              }, 200);
            };
            const infoRequest = new GraphRequest(
              "/me",
              {
                accessToken: accessToken,
                parameters: {
                  fields: {
                    string: "email,name,first_name,middle_name,last_name"
                  }
                }
              },
              responseInfoCallback
            );
            new GraphRequestManager().addRequest(infoRequest).start();
          });
        }
      },
      function(error) {
        console.log("Login fail with error: " + error);
      }
    );
  }
// Handling google login
  signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      await GoogleSignin.revokeAccess();
      console.log("Success:", userInfo);
      Alert.alert("User Successfully Login with Id:", userInfo.user.email);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // sign in was cancelled
        Alert.alert("cancelled");
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation in progress already
        Alert.alert("in progress");
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert("play services not available or outdated");
      } else {
        console.log("Something went wrong:", error.toString());
        Alert.alert("Something went wrong", error.toString());
        this.setState({
          error
        });
      }
    }
  };
  //Handling simple login message
  success = () => {
    const { username, password } = this.state;
    if (username == "" && password == "") {
      Alert.alert("Please enter Email And Password!!");
    } else {
      Alert.alert("Successfully login");
    }
  };
  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.inputBox}
          onChangeText={username => this.setState({ username })}
          placeholder="Email"
          placeholderTextColor="#ffffff"
          keyboardType="email-address"
          onSubmitEditing={() => this.password.focus()}
        />
        <TextInput
          style={styles.inputBox}
          underlineColorAndroid="rgba(0,0,0,0)"
          placeholder="Password"
          secureTextEntry={true}
          onChangeText={password => this.setState({ password })}
          placeholderTextColor="#ffffff"
        />
        <TouchableOpacity style={styles.button} onPress={() => this.success()}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.fgButton} onPress={this.signIn}>
          <Image
            style={styles.imageButton}
            source={require("../Image/google.jpg")}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.fgButton}
          onPress={this.handleFacebookLogin.bind(this)}
        >
          <Image
            style={styles.imageButton}
            source={require("../Image/facebook.jpg")}
          />
        </TouchableOpacity>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center"
  },

  inputBox: {
    width: 300,
    backgroundColor: "rgba(255, 255,255,0.2)",
    borderRadius: 25,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#ffffff",
    marginVertical: 10
  },
  button: {
    width: 300,
    backgroundColor: "#1c313a",
    borderRadius: 25,
    marginVertical: 10,
    paddingVertical: 13
  },
  fgButton: {
    width: 300,
    borderRadius: 25,
    paddingVertical: 13
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#ffffff",
    textAlign: "center"
  },
  imageButton: {
    width: 300,
    height: 40,
    borderRadius: 25
  }
});

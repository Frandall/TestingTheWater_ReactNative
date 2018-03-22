import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { GoogleSignin } from 'react-native-google-signin';
import firebase from 'react-native-firebase';
import { loginUser } from '../actions/';
import { Spinner } from './commons';

class LoginPage extends Component {
  componentWillMount() {
    GoogleSignin.configure({})
    .then(() => {
      GoogleSignin.currentUserAsync().then((user) => {
        if (user) {
          this.props.loginUser();
        }
      }).done();
    });
    this.authSubscription = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        if (this.props.user){
          Actions.main();
        }
      }
    });
  }

  componentWillUnmount() {
    this.authSubscription();
  }

  onLoginPress() {
    this.props.loginUser();
  }

  renderButton() {
    if (this.props.loading) {
      return <Spinner size="small" />;
    }

    return (
      <Button 
        styles={styles.buttonStyle} 
        title="Sign in with Google" 
        onPress={this.onLoginPress.bind(this)}
      />
    );
  }

  render() {
    return (
      <View style={styles.containerStyle}>
        <Text style={styles.textBahaso}>bahaso</Text>
        <Text style={styles.textAbsen}>ABSEN</Text>
        <View style={{ minWidth: 250 }}>
          {this.renderButton()}
        </View>
      </View>
    );
  }
}

const styles = {
  containerStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  textBahaso: { 
    textAlign: 'center', 
    fontSize: 25, 
    fontWeight: '700',
    color: '#4aa3f2',
    fontFamily: 'Open Sans,sans-serif' 
  },
  textAbsen: {
    textAlign: 'center', 
    marginBottom: 20,
    fontSize: 50,
    fontWeight: '300',
    color: '#4f4f4f',
    lineHeight: 50,
    fontFamily: 'Open Sans,sans-serif' 
  },
  buttonStyle: {
    padding: 10,
    borderRadius: 3,
    color: '#fff',
    backgroundColor: '#4285f4',
    fontSize: 16,
    boxShadow: '0 2 2 rgba(0,0,0,.25)'
  }
};

const mapStateToProps = (state) => {
  const { user, loading } = state.auth;
  return { user, loading };
};

export default connect(mapStateToProps, { loginUser })(LoginPage);

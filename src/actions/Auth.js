import firebase from 'react-native-firebase';
import { Actions } from 'react-native-router-flux';
import { Alert } from 'react-native';
import { GoogleSignin } from 'react-native-google-signin';
import moment from 'moment';
import { LOGIN, LOGIN_SUCCESS, GET_USER, LOGIN_FAILED } from './types';

export const loginUser = () => {
  return (dispatch) => {
    dispatch({ type: LOGIN });

    GoogleSignin.signIn()
      .then((data) => {
        const credential = 
            firebase.auth.GoogleAuthProvider.credential(data.idToken, data.accessToken);
        return firebase.auth().signInWithCredential(credential);
      }).then((user) => {
        // If you need to do anything with the user, do it here
        // The user will be logged in automatically by the
        // `onAuthStateChanged` listener we set up in App.js earlier
        loginUserSuccess(dispatch, user);
      }).catch((error) => {
        const { code, message } = error;
        // For details of error codes, see the docs
        // The message contains the default Firebase string
        // representation of the error
        dispatch({ type: LOGIN_FAILED });
        Alert.alert(
          `Error Sign in ${code}`,
          message,
          [
            { text: 'Ask me later', onPress: () => console.log('Ask me later pressed') },
            { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
            { text: 'OK', onPress: () => console.log('OK Pressed') },
          ],
          { cancelable: true }
        );
      });
  };
};

const loginUserSuccess = (dispatch, user) => {
  firebase.database().ref(`/users/${user.uid}`)
    .set({
      email: user.email,
      lastOnline: moment().format('ddd, MMM d YYYY HH:mm:ss z'),
      name: user.displayName
    }).then(() => {
      dispatch({ type: LOGIN_SUCCESS, payload: user });
      Actions.pop();
      Actions.main();
      // Actions.popAndPush('main');
    });
};

export const getUser = () => {
  return {
    type: GET_USER
  };
};

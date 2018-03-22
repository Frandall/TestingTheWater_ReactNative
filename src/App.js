import React, { Component } from 'react';
import firebase from 'firebase';
import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import { Provider } from 'react-redux';
import Router from './Router';
import reducers from './reducers';

class App extends Component {
  componentWillMount() {
    const config = {
      apiKey: 'AIzaSyCanCVOxrniZ_n3LybLsxxNwVU95g2T0pg',
      authDomain: 'bahaso-absen.firebaseapp.com',
      databaseURL: 'https://bahaso-absen.firebaseio.com',
      projectId: 'bahaso-absen',
      storageBucket: 'bahaso-absen.appspot.com',
      messagingSenderId: '456426625754'
    };
    firebase.initializeApp(config);
  }

  render() {
    const store = createStore(reducers, {}, applyMiddleware(ReduxThunk));

    return (
      <Provider store={store}>
        <Router />
      </Provider>
    );
  }
}

export default App;

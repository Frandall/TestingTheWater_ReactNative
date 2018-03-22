import React, { Component } from 'react';
import { 
  View, Text, TouchableWithoutFeedback, ScrollView, PermissionsAndroid, TextInput, Alert
} from 'react-native';
import firebase from 'react-native-firebase';
import { connect } from 'react-redux';
import moment from 'moment';
import { GoogleSignin } from 'react-native-google-signin';
import { Actions } from 'react-native-router-flux';
import geolib from 'geolib';
import { getUser } from '../actions';
import Clock from './Clock';
import { Button } from './commons/';
import AbsenList from './AbsenList';

class AbsenPage extends Component {
  state = { 
    absen: 2, 
    clockIn: '-', 
    clockOut: '-',
    late: 0,
    locationPermission: true,
    latitude: null,
    longitude: null,
    distance: null,
    duration: 0,
    displayDuration: '',
    textIzin: ''
  };

  componentWillMount() {
    const { user } = this.props;
    const bahasoCoor = { latitude: -6.170016, longitude: 106.817745 };
    console.log('locationPermission', this.state.locationPermission);
    console.log('coor', this.state.longitude);
    if (this.state.latitude === null) {
      if (this.state.locationPermission) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.setState({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              error: null,
            });
            const distance = geolib.getDistance(
              { latitude: position.coords.latitude, longitude: position.coords.longitude },
              bahasoCoor
            );
            console.log('distance componentWillMount getCurrentPosition', distance);
            this.setState({ distance });

            firebase.database().ref(`/absen/${moment().format('YYYYMMDD')}/${user.uid}/`)
            .once('value', snapshot => {
              if (snapshot.exists() === false) {
                if (distance >= 1000) {
                  this.setState({ absen: 2 });
                } else {
                  this.setState({ absen: 0 });
                }
              } else {
                if (distance >= 1000 || this.state.duration <= 6) {
                  this.setState({ absen: 2 });
                } else {
                  this.setState({ absen: 1 });
                }
                this.setState(snapshot.val());
              }
            });
          },
          (error) => this.setState({ error: error.message }),
          { enableHighAccuracy: true, timeout: 5000, maximumAge: 1000 },
        );
      } else {
        this.requestLocationPermission();
      }
    } else {
      const distance = geolib.getDistance(
        { latitude: this.state.latitude, longitude: this.state.longitude },
        bahasoCoor
      );
      console.log('distance componentWillMount getCurrentPosition', distance);
      this.setState({ distance });

      firebase.database().ref(`/absen/${moment().format('YYYYMMDD')}/${user.uid}/`)
      .once('value', snapshot => {
        if (snapshot.exists() === false) {
          if (distance >= 1000) {
            this.setState({ absen: 2 });
          } else {
            this.setState({ absen: 0 });
          }
        } else {
          if (distance >= 1000 || this.state.duration <= 6) {
            this.setState({ absen: 2 });
          } else {
            this.setState({ absen: 1 });
          }
          this.setState(snapshot.val());
        }
      });
    }
  }

  componentDidMount() {
    const bahasoCoor = { latitude: -6.170016, longitude: 106.817745 };
    const { user } = this.props;

    firebase.database().ref(`/absen/${moment().format('YYYYMMDD')}/${user.uid}/`)
      .once('value', snapshot => {
        if (snapshot.exists()) {
          this.setState(snapshot.val());
        }
      });

    if (this.state.locationPermission) {
      this.watchId = navigator.geolocation.watchPosition(
        (position) => {
          this.setState({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            error: null,
          });
          const distance = geolib.getDistance(
            { latitude: position.coords.latitude, longitude: position.coords.longitude },
            bahasoCoor
          );

          this.setState({ distance });
          
          console.log('distance componentDidMount watchPosition', distance);

          firebase.database().ref(`/absen/${moment().format('YYYYMMDD')}/${user.uid}/`)
          .once('value', snapshot => {
            if (snapshot.exists() === false) {
              if (distance >= 1000) {
                this.setState({ absen: 2 });
              } else {
                this.setState({ absen: 0 });
              }
            } else {
              if (distance >= 1000 || this.state.duration <= 6) {
                this.setState({ absen: 2 });
              } else {
                this.setState({ absen: 1 });
              }
              this.setState(snapshot.val());
            }
          });
        },
        (error) => this.setState({ error: error.message }),
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 1000, distanceFilter: 10 },
      );
    }
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchId);
  }

  onButtonPress() {
    const { user } = this.props;
    const timeStamp = moment().format('YYYYMMDD');
    if (this.state.absen === 0) {
      //clock in
      //simpan distance di database
      firebase.database().ref(`/absen/${timeStamp}/${user.uid}/clockIn/`)
        .set(moment().format('HH:mm'))
        .then(() => {
          this.setState({ clockIn: moment().format('HH:mm'), absen: 1 });
        });
      firebase.database().ref(`/absen/${timeStamp}/${user.uid}/clockInDistance/`)
        .set(this.state.distance);
      firebase.database().ref(`/users_absen/${user.uid}/${timeStamp}/clockIn/`)
        .set(moment().format('HH:mm'));
      firebase.database().ref(`/users_absen/${user.uid}/${timeStamp}/clockInDistance/`)
        .set(this.state.distance);
    } else if (this.state.absen === 1) {
      //clock Out
      firebase.database().ref(`/absen/${timeStamp}/${user.uid}/clockOut/`)
        .set(moment().format('HH:mm'))
        .then(() => {
          this.setState({ clockOut: moment().format('HH:mm') });
        });
      
      firebase.database().ref(`/absen/${timeStamp}/${user.uid}/clockOutDistance/`)
        .set(this.state.distance);
      firebase.database().ref(`/users_absen/${user.uid}/${timeStamp}/clockOut`)
        .set(moment().format('HH:mm'));

      firebase.database().ref(`/users_absen/${user.uid}/${timeStamp}/clockOutDistance/`)
        .set(this.state.distance);

      firebase.database().ref(`/absen/${timeStamp}/${user.uid}/`)
        .once('value', snapshot => {
            const clockInTime = snapshot.child('clockIn').val();
            const clockOutTime = snapshot.child('clockOut').val();
            this.calculateDuration(clockInTime, clockOutTime);
          }
        );
    } else if (this.state.absen === 2) {
      //izin
      if (this.state.clockIn == '-') {
        //clockin izin
        if (this.state.textIzin === '') {
          Alert.alert(
            'Izin',
            'Alasan Izin harus diisi!',
            [
              { text: 'OK', onPress: () => console.log('OK Pressed') },
            ]
          );
          return;
        }
        firebase.database().ref(`/absen/${timeStamp}/${user.uid}/clockIn/`)
        .set(moment().format('HH:mm'))
        .then(() => {
          this.setState({ clockIn: moment().format('HH:mm') });
          firebase.database().ref(`/absen/${timeStamp}/${user.uid}/clockInNote/`)
            .set(this.state.textIzin);
        });

        firebase.database().ref(`/absen/${timeStamp}/${user.uid}/clockInDistance/`)
          .set(this.state.distance);
        firebase.database().ref(`/users_absen/${user.uid}/${timeStamp}/clockIn/`)
          .set(moment().format('HH:mm'))
          .then(() => {
            firebase.database().ref(`/users_absen/${user.uid}/${timeStamp}/clockInNote/`)
            .set(this.state.textIzin);
          });
        firebase.database().ref(`/users_absen/${user.uid}/${timeStamp}/clockInDistance/`)
          .set(this.state.distance);
      } else {
        //clockout izin
        if (this.state.textIzin === '') {
          Alert.alert(
            'Izin',
            'Alasan Izin harus diisi!',
            [
              { text: 'OK', onPress: () => console.log('OK Pressed') },
            ]
          );
          return;
        }
        firebase.database().ref(`/absen/${timeStamp}/${user.uid}/clockOut/`)
        .set(moment().format('HH:mm'))
        .then(() => {
          this.setState({ clockOut: moment().format('HH:mm') });
          firebase.database().ref(`/absen/${timeStamp}/${user.uid}/clockOutNote/`)
            .set(this.state.textIzin);
        });

        firebase.database().ref(`/absen/${timeStamp}/${user.uid}/clockOutDistance/`)
          .set(this.state.distance);
        firebase.database().ref(`/users_absen/${user.uid}/${timeStamp}/clockOut/`)
          .set(moment().format('HH:mm'))
          .then(() => {
            firebase.database().ref(`/users_absen/${user.uid}/${timeStamp}/clockOutNote/`)
            .set(this.state.textIzin);
          });
        firebase.database().ref(`/users_absen/${user.uid}/${timeStamp}/clockOutDistance/`)
          .set(this.state.distance);
      }
    }
  }

  onLogoutPress() {
    GoogleSignin.signOut()
    .then(() => {
      Actions.pop();
    })
    .catch((err) => {
      console.log(err);
    });
  }

  async requestLocationPermission() {
    try {
      const bahasoCoor = { latitude: -6.170016, longitude: 106.817745 };
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Absen Location Permission',
          message: 'Absen Bahaso needs access to your location'
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        this.setState({ locationPermission: true });
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.setState({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              error: null,
            });
            const distance = geolib.getDistance(
              { latitude: position.coords.latitude, longitude: position.coords.longitude },
              bahasoCoor
            );
            console.log('distance requestLocationPermission getCurrentPosition', distance);
            this.setState({ distance });
          },
          (error) => this.setState({ error: error.message }),
          { enableHighAccuracy: true, timeout: 5000, maximumAge: 1000 },
        );
      } else {
        this.setState({ locationPermission: false });
      }
    } catch (err) {
      console.warn(err);
    }
  }

  renderIzin() {
    if (this.state.absen === 2) {
      return (
        <View 
        style={{ 
          alignSelf: 'stretch', 
          paddingBottom: 50,
          paddingTop: 15,
          paddingLeft: 5,
          paddingRight: 5
        }}
        >
          <View style={{ height: 100, borderWidth: 1 }}>
            <TextInput 
              editable
              multiline
              autoGrow
              numberOfLines={4}
              onChangeText={(textIzin) => this.setState({ textIzin })}
              value={this.state.textIzin}
              placeholder={'Masukkan Izin'}
              style={{ fontSize: 16, flex: 1 }}
              underlineColorAndroid={'transparent'}
            />
          </View>
        </View>
      );
    }
    
    return (
      <View style={{ height: 100 }} />
    );
  }

  render() {
    const clock = ['CLOCK IN', 'CLOCK OUT', 'IZIN'];

    return (
      <ScrollView>
        <View>
          <View>
            <View style={styles.containerAbsen}>
              <Clock clockIn={this.state.clockIn} />
              <View style={styles.clockInOut}>
                <View style={styles.clockIn}>
                  <Text style={{ fontSize: 14, fontWeight: '700' }}>Clock In</Text>
                  <Text style={{ fontSize: 14, fontWeight: '700' }}>{this.state.clockIn}</Text>
                </View>
                <View style={styles.clockOut}>
                  <Text style={{ fontSize: 14, fontWeight: '700' }}>Clock Out</Text>
                  <Text style={{ fontSize: 14, fontWeight: '700' }}>{this.state.clockOut}</Text>
                </View>
              </View>
              {this.renderIzin()}
            </View>
            <View style={styles.buttonContainer}>
              <Button onPress={this.onButtonPress.bind(this)}>{ clock[this.state.absen] }</Button>
            </View>
          </View>
          <View>
            <View>
              <AbsenList />
            </View>
            <View>
              <TouchableWithoutFeedback onPress={this.onLogoutPress.bind(this)}>
                <View style={styles.logoutStyle}>
                  <Text style={styles.textLogout}>LOGOUT</Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = {
  containerAbsen: {
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 30,
    shadowColor: 'hsla(0,0%,76%,.5)',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 3,
  },
  clockInOut: {
    justifyContent: 'center',
    marginTop: 25,
    flexDirection: 'row'
  },
  clockIn: {
    borderRightWidth: 1,
    borderRightColor: '#000',
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 30,
    paddingLeft: 30,
    alignItems: 'center'
  },
  clockOut: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 30,
    paddingLeft: 30,
    alignItems: 'center'
  },
  buttonContainer: {
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    transform: [
      { translateY: -40 }
    ],
    elevation: 4
  },
  logoutStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    marginBottom: 30
  },
  textLogout: {
    color: '#e54848',
    fontWeight: '700',
    fontSize: 18
  }
};

const mapStateToProps = (state) => {
  const { user } = state.auth;
  
  return { user };
};

export default connect(mapStateToProps, { getUser })(AbsenPage);

/* navigator.geolocation.getCurrentPosition(
      //   (position) => {
      //     this.setState({
      //       latitude: position.coords.latitude,
      //       longitude: position.coords.longitude,
      //       error: null,
      //     });
      //     const distance = geolib.getDistance(
      //       { latitude: position.coords.latitude, longitude: position.coords.longitude },
      //       bahasoCoor
      //     );
      //     console.log('distance current', distance);
      //     if (distance >= 1000 || this.state.duration <= 6) {
      //       this.setState({ absen: 2 });
      //     } else {
      //       firebase.database().ref(`/absen/${moment().format('YYYYMMDD')}/${user.uid}/`)
      //       .once('value', snapshot => {
      //         if (snapshot.exists() === false) {
      //           this.setState({ absen: 0 });
      //         } else {
      //           this.setState({ absen: 1 });
      //           this.setState(snapshot.val());
      //         }
      //       });
      //     }
      //   },
      //   (error) => {
      //     this.setState({ error: error.message });
      //     console.log(error);
      //   },
      //   { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
      // );
      */

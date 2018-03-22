import React, { Component } from 'react';
import { Text, TouchableWithoutFeedback, View } from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';
import firebase from 'react-native-firebase';
import * as actions from '../actions';
import { CardSection } from './commons/CardSection';

class ListItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      time: moment().format('HH:mm'),
      second: moment().format('ss'),
    };

    this.mappingName(this.props.absenUserId);
  }

  componentDidMount() {
    this.timerID = setInterval(() => {
      this.setState({
        time: moment().format('HH:mm'),
        second: moment().format('ss'),
      });

      this.calculateDuration(this.props.clockIn, this.state.time);
    }, 900);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  calculateDuration(clockInTime) {
    if (!clockInTime) {
      return;
    }

    const clockInHour = clockInTime.split(':')[0];
    const clockInMinute = clockInTime.split(':')[1];
    const clockOutHour = this.state.time.split(':')[0];
    const clockOutMinute = this.state.time.split(':')[1];
    let hourSubtract = 0;

    if (clockOutMinute < clockInMinute) {
      hourSubtract = 1;
    }
    const hourDuration = clockOutHour - (+clockInHour + +hourSubtract);
    const minuteDuration = Math.abs(clockOutMinute - clockInMinute);
    const displayDuration = `${hourDuration}h ${minuteDuration}m`;

    return displayDuration;
  }

  mappingName(absenUserId) {
    firebase.database().ref(`/users/${absenUserId}/email`)
      .once('value', snapshot => {
        const name = snapshot.val().toString().split('@')[0];

        if (name) {
          this.setState({ name: name.charAt(0).toUpperCase() + name.slice(1) }); 
        }
      });
  }

  renderAbsenDetail(clockInNote) {
    const { absen, expanded } = this.props;
    if (expanded) {
      if (clockInNote) {
        return (
          <View style={{ backgroundColor: '#fff09e' }}>
            <Text style={{ fontSize: 14, fontWeight: '700', flex: 1, paddingRight: 5, paddingLeft: 5 }}>{absen.clockIn}</Text>
            <Text style={{ fontSize: 14, flex: 1, paddingRight: 5, paddingLeft: 5 }}>{absen.clockInNote}</Text>
          </View>
        );
      }
    }
  }

  render() {
    const { clockIn, clockInNote, clockOut } = this.props.absen;
    const { absenUserId } = this.props;
    return (
      <TouchableWithoutFeedback onPress={() => this.props.selectAbsen(absenUserId)}>
        <View>
          <CardSection izin={clockInNote}>
            <Text style={{ fontSize: 14, flex: 3, paddingRight: 5, paddingLeft: 5 }}>{this.state.name}</Text>
            <Text style={{ fontSize: 14, flex: 2, paddingRight: 5, paddingLeft: 5 }}>{clockIn}</Text>
            <Text style={{ fontSize: 14, flex: 2, paddingRight: 5, paddingLeft: 5 }}>{clockOut}</Text>
            <Text style={{ fontSize: 14, flex: 2, paddingRight: 5, paddingLeft: 5 }}>{this.calculateDuration(clockIn)}</Text>
          </CardSection>
          {this.renderAbsenDetail(clockInNote)}
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const expanded = state.selectedAbsenUser === ownProps.absenUserId;
  return { expanded };
};

export default connect(mapStateToProps, actions)(ListItem);

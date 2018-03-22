import React, { Component } from 'react';
import { View, Text } from 'react-native';
import moment from 'moment';

class Clock extends Component {
  constructor(props) {
    super(props);

    this.state = {
      time: moment().format('HH:mm'),
      second: moment().format('ss'),
      day: moment().format('dddd'),
      date: moment().format('DD MMMM YYYY'),
      displayDuration: ''
    };
  }

  componentDidMount() {
    this.timerID = setInterval(() => {
      this.setState({
        time: moment().format('HH:mm'),
        second: moment().format('ss'),
        day: moment().format('dddd'),
        date: moment().format('DD MMMM YYYY'),
        displayDuration: ''
      });

      this.calculateDuration(this.props.clockIn, this.state.time);
    }, 900);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  calculateDuration(clockInTime, clockOutTime) {
    if (clockInTime === '-') {
      return;
    }

    const clockInHour = clockInTime.split(':')[0];
    const clockInMinute = clockInTime.split(':')[1];
    const clockOutHour = clockOutTime.split(':')[0];
    const clockOutMinute = clockOutTime.split(':')[1];
    let hourSubtract = 0;
    const duration = 
      (+clockOutHour + +(clockOutMinute / 60)) - (+clockInHour + +(clockInMinute / 60));
    
    if (clockOutMinute < clockInMinute) {
      hourSubtract = 1;
    }
    const hourDuration = clockOutHour - (+clockInHour + +hourSubtract);
    const minuteDuration = Math.abs(clockOutMinute - clockInMinute);
    const displayDuration = `${hourDuration}h ${minuteDuration}m`;
    this.setState({ displayDuration });
  }

  render() {
    return (
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Text style={styles.dateStyle}>{this.state.day}</Text>
        <Text style={styles.dateStyle}>{this.state.date}</Text>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ justifyContent: 'flex-end' }}>
            <Text style={styles.timeStyle}>{this.state.time}</Text>
          </View>
          <View 
            style={{
              alignItems: 'flex-end', 
              justifyContent: 'flex-end', 
              paddingBottom: 7,
              paddingLeft: 4
            }}
          >
            <Text style={styles.timeSecondStyle}>{this.state.second}</Text>
          </View>
        </View>
        <Text style={{ fontWeight: '700' }}>
          ( {this.state.displayDuration} )
        </Text>
    </View>
    );
  }
}

const styles = {
  dateStyle: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700'
  },
  timeStyle: {
    marginTop: 20,
    color: '#4aa3f2',
    fontSize: 56,
    fontWeight: '300',
    textShadowColor: 'rgba(0,0,0,.25)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4
  },
  timeSecondStyle: {
    marginTop: 20,
    color: '#4aa3f2',
    fontSize: 21,
    fontWeight: '300',
    textShadowColor: 'rgba(0,0,0,.25)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  }
};

export default Clock;

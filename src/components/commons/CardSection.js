import React from 'react';
import { View } from 'react-native';

const CardSection = (props) => {
  if (props.izin) {
    return (
      <View style={styles.containerStyle1}>
      {props.children}
      </View>
    );
  } else {
    return (
      <View style={styles.containerStyle2}>
      {props.children}
      </View>
    );
  }
};

const styles = {
  containerStyle1: {
    borderBottomWidth: 1,
    padding: 5,
    backgroundColor: '#ffe03b',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    borderColor: '#ddd',
    position: 'relative'
  },
  containerStyle2: {
    borderBottomWidth: 1,
    padding: 5,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    borderColor: '#ddd',
    position: 'relative'
  }

};

export { CardSection };

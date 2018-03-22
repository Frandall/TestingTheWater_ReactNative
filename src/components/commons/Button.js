import React from 'react';
import { Text, TouchableWithoutFeedback, View } from 'react-native';

const Button = ({ onPress, children }) => {
  return (
    <TouchableWithoutFeedback 
      title="test" 
      onPress={onPress}
    >
      <View style={styles.buttonStyle}>
        <Text
          style={{ color: '#fff', fontWeight: '300', fontSize: 32, alignSelf: 'center', }}
        >
          {children}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = {
  buttonStyle: {
    justifyContent: 'center',
    width: '100%',
    maxWidth: 300,
    backgroundColor: '#4aa3f2',
    borderRadius: 5,
    shadowColor: 'rgba(74,74,74,.25)',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    paddingTop: 20,
    paddingBottom: 20
  }
};

export { Button };

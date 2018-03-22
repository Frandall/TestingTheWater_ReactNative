import firebase from 'react-native-firebase';
import moment from 'moment';

export const selectAbsen = (userId) => {
  return {
    type: 'select_absen',
    payload: userId
  };
};

export const absenFetch = () => {
  const timeStamp = moment().format('YYYYMMDD');
  return (dispatch) => {
    firebase.database().ref(`/absen/${timeStamp}/`)
      .on('value', snapshot => {
        dispatch({ type: 'absen_fetch', payload: snapshot.val() });
      });
  };
};

import { combineReducers } from 'redux';
import AuthReducers from './Auth';
import AbsenSelect from './Absen';
import AbsenReducer from './AbsenReducer';

export default combineReducers({
  auth: AuthReducers,
  selectedAbsenUser: AbsenSelect,
  absenList: AbsenReducer
});

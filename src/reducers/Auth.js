import { LOGIN_SUCCESS, LOGIN, LOGIN_FAILED, GET_USER } from '../actions/types';

const INITIAL_STATE = {
  logged_in: false,
  user: null,
  error: '',
  loading: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOGIN:
      return { ...state, loading: true };
    case LOGIN_SUCCESS:
      return { ...state, ...INITIAL_STATE, logged_in: true, user: action.payload };
    case LOGIN_FAILED:
      return { ...state, error: 'Authentication Failed', loading: false };
    case GET_USER:
      return { ...state, logged_in: true };
    default:
      return state;
  }
};

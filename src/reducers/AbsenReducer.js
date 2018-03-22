const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'absen_fetch':
      return action.payload;
    default:
      return state;
  }
};

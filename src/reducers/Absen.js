export default (state = null, action) => {
  switch (action.type) {
    case 'select_absen':
      return action.payload;
    default:
      return state;
  }
};

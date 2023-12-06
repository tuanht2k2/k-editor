const initialState = {};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN":
      return action.payload;
    case "LOGOUT":
      return {};
    default:
      return state;
  }
};

export default userReducer;

import { Type } from './action.type';


export const InitialState = {
  user:null
};

export const Reducer = (state, action) => {
  switch (action.type) {
    case Type.SET_USER:
      return {
        ...state,
        user: action.user
      }
    default:
      return state;
  }
};

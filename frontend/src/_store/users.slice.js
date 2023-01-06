import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { fetchWrapper } from '_helpers';

// create slice

const name = 'users';
const initialState = createInitialState();
const extraActions = createExtraActions();
const extraReducers = createExtraReducers();
const slice = createSlice({ name, initialState, extraReducers });

// exports

export const userActions = { ...slice.actions, ...extraActions };
export const usersReducer = slice.reducer;

// implementation

function createInitialState() {
  return {
    accounts: {},
  };
}

function createExtraActions() {
  const baseUrl = `${process.env.REACT_APP_API_URL}/user`;

  return {
    getListAccount: getListAccount(),
  };

  function getListAccount() {
    return createAsyncThunk(
      `${name}/getListAccount`,
      async () => await fetchWrapper.get(`${baseUrl}/getListAccount`)
    );
  }
}

function createExtraReducers() {
  return {
    ...getListAccount(),
  };

  function getListAccount() {
    var { pending, fulfilled, rejected } = extraActions.getListAccount;
    return {
      [pending]: (state) => {
        state.accounts = { loading: true };
      },
      [fulfilled]: (state, action) => {
        state.accounts = action.payload;
      },
      [rejected]: (state, action) => {
        state.accounts = { error: action.error };
      },
    };
  }
}

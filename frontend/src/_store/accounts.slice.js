import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchWrapper } from '_helpers';

const name = 'accounts';
const initialState = createInitialState();
const extraActions = createExtraActions();
const extraReducers = createExtraReducers();
const slice = createSlice({ name, initialState, extraReducers });

export const accountActions = { ...slice.actions, ...extraActions };
export const accountsReducer = slice.reducer;

function createInitialState() {
  return {};
}

function createExtraActions() {
  const baseUrl = `${process.env.REACT_APP_API_URL}/account`;

  return {
    createTransaction: createTransaction(),
    getOtp: getOtp(),
  };

  function createTransaction() {
    return createAsyncThunk(
      `${name}/createTransaction`,
      async ({ accountNumber, cash, otp }) =>
        await fetchWrapper.post(`${baseUrl}/createTransaction`, { accountNumber, cash, otp })
    );
  }

  function getOtp() {
    return createAsyncThunk(
      `${name}/getOtp`,
      async () => await fetchWrapper.get(`${baseUrl}/getOtp`)
    );
  }
}

function createExtraReducers() {
  return {};
}

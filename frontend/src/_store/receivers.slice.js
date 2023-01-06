import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchWrapper } from '_helpers';

const name = 'receivers';
const initialState = createInitialState();
const extraActions = createExtraActions();
const extraReducers = createExtraReducers();
const slice = createSlice({ name, initialState, extraReducers });

export const receiverActions = { ...slice.actions, ...extraActions };
export const receiversReducer = slice.reducer;

function createInitialState() {
  return {
    accounts: {},
  };
}

function createExtraActions() {
  const baseUrl = `${process.env.REACT_APP_API_URL}/receiver`;

  return {
    getListRecipient: getListRecipient(),
    saveRecipient: saveRecipient(),
    updateRecipient: updateRecipient(),
    deleteRecipient: deleteRecipient(),
  };

  function getListRecipient() {
    return createAsyncThunk(
      `${name}/getListRecipient`,
      async () => await fetchWrapper.get(`${baseUrl}/getListRecipient`)
    );
  }

  function saveRecipient() {
    return createAsyncThunk(
      `${name}/saveRecipient`,
      async ({ accountNumber }) =>
        await fetchWrapper.post(`${baseUrl}/saveRecipient`, { accountNumber })
    );
  }

  function updateRecipient() {
    return createAsyncThunk(
      `${name}/updateRecipient`,
      async ({ accountNumber, reminiscentName }) =>
        await fetchWrapper.post(`${baseUrl}/updateRecipient`, { accountNumber, reminiscentName })
    );
  }

  function deleteRecipient() {
    return createAsyncThunk(
      `${name}/saveRecipient`,
      async ({ accountNumber }) =>
        await fetchWrapper.delete(`${baseUrl}/deleteRecipient`, { accountNumber })
    );
  }
}

function createExtraReducers() {
  return {
    ...getListRecipient(),
  };

  function getListRecipient() {
    var { pending, fulfilled, rejected } = extraActions.getListRecipient;
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

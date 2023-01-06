import { configureStore } from '@reduxjs/toolkit';
import { accountsReducer } from './accounts.slice';

import { authReducer } from './auth.slice';
import { receiversReducer } from './receivers.slice';
import { usersReducer } from './users.slice';

export * from './auth.slice';
export * from './users.slice';
export * from './receivers.slice';
export * from './accounts.slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    receivers: receiversReducer,
    accounts: accountsReducer,
  },
});

// Import necessary functions and modules from Redux Toolkit and Redux Persist
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import snackbarReducer from "./snackbarSlice";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist"; // Importing Redux Persist functionalities
import storage from "redux-persist/lib/storage"; // Importing default storage engine for Redux Persist

// Configuration object for persistence
const persistConfig = {
  key: "root", // Key for the persisted state
  version: 1, // Version of the persisted state
  storage, // Storage engine to use
};

// Combining user and snackbar reducers into a root reducer
const rootReducer = combineReducers({ user: userReducer, snackbar: snackbarReducer });

// Creating a persisted reducer using the configuration and root reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configuring the Redux store with the persisted reducer and middleware
export const store = configureStore({
  reducer: persistedReducer, // Setting the persisted reducer as the main reducer
  middleware: (getDefaultMiddleware) => // Configuring middleware
    getDefaultMiddleware({
      serializableCheck: { // Customizing middleware options
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER], // Ignoring specific actions for serializability checks
      },
    }),
});

// Creating a persistor for the store to manage persistence
export const persistor = persistStore(store);
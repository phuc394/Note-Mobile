import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import notesReducer from "./notesSlice";
import sharedReducer from "./sharedSlice";
import deletedReducer from "./deletedSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    notes: notesReducer,
    shared: sharedReducer,
    deleted: deletedReducer,
  },
});

export default store;

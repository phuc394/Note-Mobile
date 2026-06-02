import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../config/axios";

const getErrorMessage = (error) =>
  error.response?.data?.message || error.message || "Something went wrong";

export const fetchSharedNotes = createAsyncThunk(
  "shared/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/shared");
      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

const sharedSlice = createSlice({
  name: "shared",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSharedNotes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSharedNotes.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchSharedNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default sharedSlice.reducer;

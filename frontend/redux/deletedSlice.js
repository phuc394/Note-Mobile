import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../config/axios";

const getErrorMessage = (error) =>
  error.response?.data?.message || error.message || "Something went wrong";

export const fetchDeletedNotes = createAsyncThunk(
  "deleted/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/deleted");
      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const restoreDeletedNote = createAsyncThunk(
  "deleted/restore",
  async (id, { rejectWithValue }) => {
    try {
      await api.put(`/deleted/restore/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const deleteDeletedNote = createAsyncThunk(
  "deleted/deleteOne",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/deleted/delete/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const deleteAllDeletedNotes = createAsyncThunk(
  "deleted/deleteAll",
  async (_, { rejectWithValue }) => {
    try {
      await api.delete("/deleted/delete-all");
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

const deletedSlice = createSlice({
  name: "deleted",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDeletedNotes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDeletedNotes.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchDeletedNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(restoreDeletedNote.fulfilled, (state, action) => {
        state.items = state.items.filter((note) => String(note.id) !== String(action.payload));
      })
      .addCase(deleteDeletedNote.fulfilled, (state, action) => {
        state.items = state.items.filter((note) => String(note.id) !== String(action.payload));
      })
      .addCase(deleteAllDeletedNotes.fulfilled, (state) => {
        state.items = [];
      });
  },
});

export default deletedSlice.reducer;

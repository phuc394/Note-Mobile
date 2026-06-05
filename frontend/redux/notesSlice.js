import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../config/axios";

const getErrorMessage = (error) =>
  error.response?.data?.message || error.message || "Something went wrong";

export const fetchNotes = createAsyncThunk("notes/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get("/notes/all");
    return data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const fetchNote = createAsyncThunk("notes/fetchOne", async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/notes/get/${id}`);
    return data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const searchNotes = createAsyncThunk("notes/search", async (keyword, { rejectWithValue }) => {
  try {
    const { data } = await api.get("/notes/search", { params: { keyword } });
    return data.data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const createNote = createAsyncThunk(
  "notes/create",
  async ({ title, content }, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/notes/create", { title, content });
      return data.note;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const deleteNote = createAsyncThunk("notes/delete", async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/notes/delete/${id}`);
    return id;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const updateNote = createAsyncThunk(
  "notes/update",
  async ({ id, title, content }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/notes/edit/${id}`, { title, content });
      return data.note ?? { id, title, content };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const togglePinNote = createAsyncThunk(
  "notes/togglePin",
  async ({ id, is_pinned }, { rejectWithValue }) => {
    try {
      await api.patch(`/notes/pin/${id}`, { is_pinned });
      return { id, is_pinned };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const togglePublicNote = createAsyncThunk(
  "notes/togglePublic",
  async ({ id, is_public }, { rejectWithValue }) => {
    try {
      await api.patch(`/notes/public/${id}`, { is_public });
      return { id, is_public };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const inviteUserToNote = createAsyncThunk(
  "notes/invite",
  async ({ id, email, can_edit }, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/notes/${id}/invite`, { email, can_edit });
      return data.invite;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchNoteInvites = createAsyncThunk(
  "notes/fetchInvites",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/notes/${id}/invite`);
      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const removeNoteInvite = createAsyncThunk(
  "notes/removeInvite",
  async ({ id, email }, { rejectWithValue }) => {
    try {
      await api.delete(`/notes/${id}/invite/${encodeURIComponent(email)}`);
      return email;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

const notesSlice = createSlice({
  name: "notes",
  initialState: {
    items: [],
    selectedNote: null,
    invites: [],
    invitesLoading: false,
    loading: false,
    error: null,
  },
  reducers: {
    clearNotesError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotes.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNote.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedNote = action.payload;
      })
      .addCase(fetchNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(searchNotes.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(createNote.pending, (state) => {
        state.error = null;
      })
      .addCase(createNote.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(createNote.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteNote.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteNote.fulfilled, (state, action) => {
        state.items = state.items.filter((note) => String(note.id) !== String(action.payload));
      })
      .addCase(updateNote.pending, (state) => {
        state.error = null;
      })
      .addCase(updateNote.fulfilled, (state, action) => {
        const note = state.items.find((item) => String(item.id) === String(action.payload.id));
        if (note) {
          note.title = action.payload.title;
          note.content = action.payload.content;
        }
        if (String(state.selectedNote?.id) === String(action.payload.id)) {
          state.selectedNote = {
            ...state.selectedNote,
            title: action.payload.title,
            content: action.payload.content,
          };
        }
      })
      .addCase(updateNote.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(togglePinNote.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(togglePinNote.fulfilled, (state, action) => {
        const note = state.items.find((item) => String(item.id) === String(action.payload.id));
        if (note) note.is_pinned = action.payload.is_pinned ? 1 : 0;
      })
      .addCase(togglePublicNote.pending, (state) => {
        state.error = null;
      })
      .addCase(togglePublicNote.fulfilled, (state, action) => {
        const note = state.items.find((item) => String(item.id) === String(action.payload.id));
        if (note) note.is_public = action.payload.is_public ? 1 : 0;
        if (String(state.selectedNote?.id) === String(action.payload.id)) {
          state.selectedNote.is_public = action.payload.is_public ? 1 : 0;
        }
        if (!action.payload.is_public) {
          state.invites = [];
        }
      })
      .addCase(togglePublicNote.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(inviteUserToNote.pending, (state) => {
        state.error = null;
      })
      .addCase(inviteUserToNote.fulfilled, (state, action) => {
        const nextInvite = action.payload;
        state.invites = [
          nextInvite,
          ...state.invites.filter(
            (invite) =>
              String(invite.invited_gmail).toLowerCase() !==
              String(nextInvite.invited_gmail).toLowerCase()
          ),
        ];
      })
      .addCase(inviteUserToNote.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(fetchNoteInvites.pending, (state) => {
        state.invitesLoading = true;
        state.error = null;
      })
      .addCase(fetchNoteInvites.fulfilled, (state, action) => {
        state.invitesLoading = false;
        state.invites = action.payload;
      })
      .addCase(fetchNoteInvites.rejected, (state, action) => {
        state.invitesLoading = false;
        state.error = action.payload;
      })
      .addCase(removeNoteInvite.pending, (state) => {
        state.error = null;
      })
      .addCase(removeNoteInvite.fulfilled, (state, action) => {
        state.invites = state.invites.filter(
          (invite) =>
            String(invite.invited_gmail).toLowerCase() !==
            String(action.payload).toLowerCase()
        );
      })
      .addCase(removeNoteInvite.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearNotesError } = notesSlice.actions;
export default notesSlice.reducer;

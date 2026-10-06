import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import type { Assignment, FilterStatus, LoadingStatus, AssignmentFormData } from "./types";
import { fetchAssignmentsApi } from "./mockApi";

interface AssignmentsState {
  items: Assignment[];
  filter: FilterStatus;
  status: LoadingStatus;
  error: string | null;
}

const initialState: AssignmentsState = {
  items: [],
  filter: "all",
  status: "idle",
  error: null,
};

export const fetchAssignments = createAsyncThunk(
  "assignments/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchAssignmentsApi();
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : "Lỗi không xác định"
      );
    }
  }
);

const assignmentsSlice = createSlice({
  name: "assignments",
  initialState,
  reducers: {
    addAssignment: (state, action: PayloadAction<AssignmentFormData>) => {
      const newItem: Assignment = {
        ...action.payload,
        id: Date.now().toString(),
        completed: false,
      };
      state.items.unshift(newItem);
    },

    toggleComplete: (state, action: PayloadAction<string>) => {
      const item = state.items.find((a) => a.id === action.payload);
      if (item) {
        item.completed = !item.completed;
      }
    },

    deleteAssignment: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((a) => a.id !== action.payload);
    },

    setFilter: (state, action: PayloadAction<FilterStatus>) => {
      state.filter = action.payload;
    },

    setAssignments: (state, action: PayloadAction<Assignment[]>) => {
      state.items = action.payload;
      state.status = "succeeded";
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchAssignments.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAssignments.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchAssignments.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const {
  addAssignment,
  toggleComplete,
  deleteAssignment,
  setFilter,
  setAssignments,
} = assignmentsSlice.actions;

export default assignmentsSlice.reducer;

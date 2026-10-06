import { configureStore } from "@reduxjs/toolkit";
import { createLogger } from "redux-logger";
import assignmentsReducer from "../features/assignments/assignmentsSlice";

// redux-logger chỉ bật ở môi trường development.
// Với danh sách lớn (stress test) thì rút gọn state để console không bị treo.
const logger = createLogger({
  collapsed: true,
  stateTransformer: (state: { assignments: { items: unknown[] } }) =>
    state.assignments.items.length > 100
      ? {
          ...state,
          assignments: {
            ...state.assignments,
            items: `[${state.assignments.items.length} items]`,
          },
        }
      : state,
});

export const store = configureStore({
  reducer: {
    assignments: assignmentsReducer,
  },
  middleware: (getDefault) =>
    getDefault().concat(import.meta.env.DEV ? [logger] : []),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

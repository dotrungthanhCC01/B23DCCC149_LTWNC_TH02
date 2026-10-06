import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { ThemeProvider } from "./context/ThemeContext";
import "./index.css";
import App from "./App.tsx";
import { setAssignments } from "./features/assignments/assignmentsSlice";
import { generateSampleAssignments } from "./features/assignments/sampleData";

// Hỗ trợ đo hiệu năng: mở /?seed=10000 để nạp sẵn dữ liệu mẫu (Lighthouse không bấm nút được).
const seed = Number(new URLSearchParams(window.location.search).get("seed"));
if (seed > 0) store.dispatch(setAssignments(generateSampleAssignments(seed)));

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </Provider>
  </StrictMode>
);

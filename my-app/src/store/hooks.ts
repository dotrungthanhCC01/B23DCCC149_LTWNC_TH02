
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";

/** Hook dispatch có type đầy đủ cho TypeScript */
export const useAppDispatch = () => useDispatch<AppDispatch>();

/** Hook selector có type đầy đủ cho TypeScript */
export const useAppSelector = <T>(selector: (state: RootState) => T): T =>
  useSelector(selector);

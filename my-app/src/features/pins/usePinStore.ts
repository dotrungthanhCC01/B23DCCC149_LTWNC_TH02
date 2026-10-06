import { create } from "zustand";

interface PinState {
  pinnedIds: string[];
  togglePin: (id: string) => void;
  isPinned: (id: string) => boolean;
}

/** State giao diện đơn giản (ghim bài tập) -> Zustand, không đưa vào Redux. */
export const usePinStore = create<PinState>((set, get) => ({
  pinnedIds: [],
  togglePin: (id) =>
    set((s) => ({
      pinnedIds: s.pinnedIds.includes(id)
        ? s.pinnedIds.filter((x) => x !== id)
        : [...s.pinnedIds, id],
    })),
  isPinned: (id) => get().pinnedIds.includes(id),
}));

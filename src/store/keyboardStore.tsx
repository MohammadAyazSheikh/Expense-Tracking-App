import { create } from "zustand";

interface FocusedInputLayout {
  pageY: number;
  height: number;
}

interface KeyboardStore {
  focusedInput: FocusedInputLayout | null;
  setFocusedInput: (layout: FocusedInputLayout | null) => void;
}

export const useKeyboardStore = create<KeyboardStore>((set) => ({
  focusedInput: null,
  setFocusedInput: (layout) => set({ focusedInput: layout }),
}));

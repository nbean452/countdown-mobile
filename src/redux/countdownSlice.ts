import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { CountdownPayload, CountdownProps } from "../utils/types";

interface CountdownState {
  countdowns: CountdownProps[];
  currentCountdown: CountdownProps | {};
}

const initialState: CountdownState = {
  countdowns: [],
  currentCountdown: {},
};

export const countdownSlice = createSlice({
  initialState,
  name: "countdown",
  reducers: {
    clearCountdown: () => initialState,
    setCountdowns: (state, action: PayloadAction<CountdownProps[]>) => ({
      ...state,
      countdowns: [...action.payload],
    }),
    setCurrentCountdown: (state, action: PayloadAction<CountdownPayload>) => ({
      ...state,
      currentCountdown: { ...state.currentCountdown, ...action.payload },
    }),
  },
});

// Action creators are generated for each case reducer function
export const { clearCountdown, setCountdowns, setCurrentCountdown } =
  countdownSlice.actions;

export default countdownSlice.reducer;

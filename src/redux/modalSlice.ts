import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// import { CountdownProps } from "../utils/types";

interface ModalState {
  add: boolean;
  delete: boolean;
  edit: boolean;
}

interface ModalPayload {
  add?: boolean;
  delete?: boolean;
  edit?: boolean;
}

const initialState: ModalState = {
  add: false,
  delete: false,
  edit: false,
};

export const modalSlice = createSlice({
  initialState,
  name: "modal",
  reducers: {
    clearModal: () => initialState,
    setModal: (state, action: PayloadAction<ModalPayload>) => ({
      ...state,
      ...action.payload,
    }),
  },
});

// Action creators are generated for each case reducer function
export const { clearModal, setModal } = modalSlice.actions;

export default modalSlice.reducer;

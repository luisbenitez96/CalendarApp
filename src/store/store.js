import { configureStore } from "@reduxjs/toolkit";
import { uiSlice } from "./ui/uiSlice";

export const store = configureStore({
  reducer: {
    ui: uiSlice.reducer,
    // el reducer es el que se encarga de manejar el estado de la aplicación
  },
});

import { createSlice } from "@reduxjs/toolkit";
import { addHours } from "date-fns";

// const tempEvent = {
//   _id: new Date().getTime(),
//   title: "Cumpleaños del jefe",
//   notes: "Comprar el pastel",
//   start: new Date(),
//   end: addHours(new Date(), 2),
//   bgColor: "#fafafa",
//   user: {
//     _id: "123",
//     name: "Fernando",
//   },
// };

export const calendarSlice = createSlice({
  name: "calendar",
  initialState: {
    isLoadingEvents: true,
    events: [], //[tempEvent],
    activeEvent: null,
  },
  reducers: {
    onSetActiveEvent: (state, { payload }) => {
      state.activeEvent = payload;
    },
    onAddNewEvent: (state, { payload }) => {
      state.events.push(payload);
      state.activeEvent = null;
    },
    onUpdateEvent: (state, { payload }) => {
      state.events = state.events.map((event) => {
        if (event.id === payload.id) {
          return payload;
        }
        return event;
      });
    },
    onDeleteEvent: (state) => {
      if (state.activeEvent) {
        state.events = state.events.filter(
          (event) => event.id !== state.activeEvent.id
        );
        state.activeEvent = null;
      }
    },
    onLoadEvents: (state, { payload = [] }) => {
      state.isLoadingEvents = false;
      // state.events = payload;
      payload.forEach((event) => {
        const exists = state.events.some((dbEvent) => dbEvent.id === event.id);

        // comprueba que el evento no exista en el store, con la funcion some, que esta sirve
        //  para comprobar si al menos un elemento del array cumple la condicion, si existe el
        //  evento ella devuelve true, si no existe devuelve false.

        if (!exists) {
          state.events.push(event);

          // Despues si el evento no existe lo agregamos al store con la funcion push y le
          //  enviamos el evento
        }
      });
    },
    onLogoutCalendar: (state) => {
      state.isLoadingEvents = true;
      state.events = [];
      state.activeEvent = null;
    },
  },
});

// Exporta las acciones y el reducer
export const {
  onAddNewEvent,
  onDeleteEvent,
  onLoadEvents,
  onLogoutCalendar,
  onSetActiveEvent,
  onUpdateEvent,
} = calendarSlice.actions;

import { useDispatch, useSelector } from "react-redux";
import {
  onAddNewEvent,
  onSetActiveEvent,
  onUpdateEvent,
  onDeleteEvent,
  onLoadEvents,
} from "../store";
import calendarApi from "../api/calendarApi";
import { convertEventToDateEvents } from "../helpers";
import Swal from "sweetalert2";
import { ca } from "date-fns/locale";

export const useCalendarStore = () => {
  const dispatch = useDispatch();

  const { events, activeEvent } = useSelector((state) => state.calendar);
  const { user } = useSelector((state) => state.auth);

  const setActiveEvent = (calendarEvent) => {
    dispatch(onSetActiveEvent(calendarEvent));
  };

  const startSavingEvent = async (calendarEvent) => {
    // calendarEvent es el evento que se va a guardar, puede ser un evento nuevo o un evento existente, el evento viene desde el formulario

    try {
      if (calendarEvent.id) {
        // actualizando

        const { data } = await calendarApi.put(
          `/events/${calendarEvent.id}`,
          calendarEvent
        );

        // se hace la peticion al servidor para actualizar el evento, el evento viene desde el
        //  formulario, y se le pasa al servidor para que lo guarde en la base de datos
        // se le pasa el id del evento que se va a actualizar, y el evento que se va a
        //  actualizar

        dispatch(onUpdateEvent({ ...calendarEvent, user }));
        return;
      } else {
        // creando
        const { data } = await calendarApi.post("/events", calendarEvent);

        // se hace la peticion al servidor para crear el evento, el evento viene desde el
        //  formulario, y se le pasa al servidor para que lo guarde en la base de datos

        dispatch(onAddNewEvent({ ...calendarEvent, id: data.event.id, user }));

        // se agrega el evento al store, el evento viene desde el formulario, y se le pasa al
        //  servidor para que lo guarde en la base de datos, se manda como payload el evento
        //  que se acaba de crear, y se le agrega el id que viene desde el servidor, y el
        //  usuario que es el que creo el evento, esto es para que en la vista del calendario
        //  se vea quien creo el evento, y se le pasa al reducer para que lo guarde en el store
      }
    } catch (error) {
      console.log(error);
      Swal.fire("Error al guardar el evento", error.response.data.msg, "error");
    }
  };

  const startDeletingEvent = async () => {
    try {
      await calendarApi.delete(`/events/${activeEvent.id}`);

      dispatch(onDeleteEvent());
    } catch (error) {
      console.log(error);
      Swal.fire(
        "Error al eliminar el evento",
        error.response.data.msg,
        "error"
      );
    }
  };

  const startLoadingEvents = async () => {
    try {
      const { data } = await calendarApi.get("/events");

      // se hace la peticion al servidor para obtener los eventos, el evento viene desde el
      // formulario, y se le pasa al servidor para que lo guarde en la base de datos

      const events = convertEventToDateEvents(data.events);
      dispatch(onLoadEvents(events));
      console.log({ events });
    } catch (error) {
      console.log("Error loading events");
      console.log(error);
    }
  };

  return {
    //* Properties
    activeEvent,
    events,
    hasEventSelected: !!activeEvent,

    //* Methods
    setActiveEvent,
    startDeletingEvent,
    startLoadingEvents,
    startSavingEvent,
  };
};

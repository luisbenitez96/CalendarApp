import { useState } from "react";
import { Calendar } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

import {
  CalendarEvent,
  CalendarModal,
  FabAddNew,
  FabDelete,
  Navbar,
} from "../";
import { localizer, getMessageEs } from "../../helpers";
import { useUiStore, useCalendarStore } from "../../hooks";

export const CalendarPage = () => {
  const { openDateModal, closeDateModal } = useUiStore();
  const { events, setActiveEvent } = useCalendarStore();

  const [lastView, setLastView] = useState(
    localStorage.getItem("lastView") || "week"
  ); // Estado para la última vista

  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState(); // Estado para la vista actual

  const eventStyleGetter = (event, start, end, isSelected) => {
    const style = {
      backgroundColor: "#367CF7",
      borderRadius: "0px",
      opacity: 0.8,
      color: "white",
    };
    return { style };
  };

  const onNavigate = (date) => {
    setCurrentDate(date); // Actualiza la fecha actual al navegar
  };

  const onViewChange = (view) => {
    localStorage.setItem("lastView", view); // Guarda la última vista en localStorage
    setCurrentView(view); // Actualiza la vista actual
  };

  const onDoubleClick = () => {
    // console.log({ doubleClick: event });
    openDateModal(); // Abre el modal al hacer doble clic en un evento
  };
  const onSelect = (event) => {
    setActiveEvent(event); // Establece el evento activo al seleccionar
  };

  return (
    <>
      <Navbar />

      <Calendar
        culture="es-ES"
        localizer={localizer}
        events={events}
        defaultView={lastView}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "calc(100vh - 80px)" }}
        messages={getMessageEs()}
        eventPropGetter={eventStyleGetter}
        date={currentDate} // Fecha actual controlada
        onNavigate={onNavigate} // Maneja la navegación
        view={currentView} // Vista actual controlada
        onView={onViewChange} // Maneja el cambio de vista
        views={["month", "week", "day", "agenda"]} // Habilita las vistas disponibles
        components={{
          event: CalendarEvent,
        }}
        onDoubleClickEvent={onDoubleClick}
        onSelectEvent={onSelect}
      />
      <CalendarModal />
      <FabAddNew />
      <FabDelete />
    </>
  );
};

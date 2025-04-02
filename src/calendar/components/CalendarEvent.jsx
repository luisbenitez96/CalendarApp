import React from "react";

export const CalendarEvent = ({ event }) => {
  const { title, user, start, end } = event;

  return (
    <>
      <strong>{title}</strong>
      <span> - {user.name}</span>
    </>
  );
};

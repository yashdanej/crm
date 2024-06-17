import React from 'react'
import Fullcalender from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

const Appoinment = () => {
  return (
    <div>
      <Fullcalender
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={"timeGridDay"}
        headerToolbar={{
          start: "today prev next",
          center: "title",
          end: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
      />
    </div>
  )
}

export default Appoinment

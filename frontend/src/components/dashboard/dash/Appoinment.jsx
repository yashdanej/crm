import React, { useEffect, useRef, useState } from 'react';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useDispatch, useSelector } from 'react-redux';
import { fetchAppointments, getAppoinmentById } from '../../../store/slices/AppointmentSlices';
import AddEvent from './AddEvent';

const Appointment = () => {
  const calendarRef = useRef(null);
  const [events, setEvents] = useState([]);
  const apmntData = useSelector(state => state.appointment.appointment);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAppointments());
  }, []);

  useEffect(() => {
    const mappedEvents = apmntData?.data?.map(element => ({
      id: element.id,
      title: element.subject,
      date: element.appoinment_date,
      // Add other event properties as needed
    }));
    setEvents(mappedEvents);
  }, [apmntData]);

  const [emp_client, setEmp_Client] = useState({
    employee: 'true',
    client: 'true'
  });
  const [appointment, setAppointment] = useState({
      employee_id: null,
      client_id: null,
      subject: '',
      client_or_other_name: '',
      phone: '',
      email: '',
      appointment_date: null,
      remark: ''
  });
  const resetState = () => {
      setAppointment({
          employee_id: null,
          client_id: null,
          subject: '',
          client_or_other_name: '',
          phone: '',
          email: '',
          appointment_date: null,
          remark: ''
      })
  }
  
  // const handleSubjectChange = (eventId, newSubject) => {
    // updateEventSubject(eventId, newSubject);
    // let calendarApi = calendarRef.current.getApi();
    // let eventToUpdate = calendarApi.getEventById(eventId);
    // eventToUpdate.setProp('title', newSubject);
  // };
  const toggleModal = () => {
    const modal = document.getElementById('crud-modal');
    modal.classList.toggle('hidden');
  };
  const handleEditEvent = (eventId) => {
    dispatch(getAppoinmentById(eventId));
    toggleModal();
  }
  return (
    <div className=''>
      <AddEvent apmntData={apmntData} setAppointment={setAppointment} appointment={appointment} resetState={resetState} emp_client={emp_client} setEmp_Client={setEmp_Client} toggleModal={toggleModal} />
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={"timeGridDay"}
        headerToolbar={{
          start: "today prev next",
          center: "title",
          end: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        events={events}
        eventClick={(info) => {
          console.log("info", info);
            handleEditEvent(info.event.id);
        }}
      />
    </div>
  );
}
  
export default Appointment;

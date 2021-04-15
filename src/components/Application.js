import React, { useState, useEffect } from "react";

import axios from "axios";
import "components/Application.scss";
import DayList from "components/DayList";
import "components/Appointment";
import Appointment from "components/Appointment";
import {getAppointmentsForDay} from 'helpers/selectors'



export default function Application(props) {
  const [state, setState] = useState({
    day: 'Monday',
    days: [],
    appointments: {}
  });

  const setDay = day => setState({ ...state, day });

  const setDays = days => setState(prev => ({ ...prev, days }));

  

  useEffect(() => {
    Promise.all([
    axios.get('/api/days'),
    axios.get('/api/appointments'),
    axios.get('/api/interviewers')
  ])
    .then(all=> {
      const [daysList, appointmentsList, interviewersList] = all
      console.log('test', daysList.data, appointmentsList.data, interviewersList.data)
      setState(prev =>({...prev, days: daysList.data, appointments: appointmentsList.data, interviewers: interviewersList.data }))
    })

  }, [])
  

  const dailyAppointments = getAppointmentsForDay(state, state.day);
  console.log('dailyAppointments:',dailyAppointments, dailyAppointments.length)
 
  const appointmentList = dailyAppointments.map((appointment) => {
    return <Appointment key={appointment.id} {...appointment} />;
  });
  
  console.log('appointmentList:', appointmentList, appointmentList.length);
  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList days={state.days} day={state.day} setDay={setDay} />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {appointmentList}
        <Appointment key="last" time="5pm" />
        <nav></nav>
      </section>
    </main>
  );
}

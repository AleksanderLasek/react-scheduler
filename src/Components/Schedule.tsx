import { useState } from "react";
import Paper from "@mui/material/Paper";
import {
  EditingState,
  ViewState,
  IntegratedEditing,
  ChangeSet,
} from "@devexpress/dx-react-scheduler";
import {
  Scheduler,
  DayView,
  WeekView,
  MonthView,
  Appointments as DxAppointments,
  Toolbar,
  ViewSwitcher,
  AppointmentForm,
  AppointmentTooltip,
  ConfirmationDialog,
  AllDayPanel,
} from "@devexpress/dx-react-scheduler-material-ui";

import { Appointment } from "../assets/Appointments";
import initialAppointments from "../assets/Appointments";

const currentDate = "2018-11-01";

function Schedule() {
  const [appointments, setAppointments] = useState(initialAppointments);

  const commitChanges = ({ added, changed, deleted }: ChangeSet) => {
    let updatedAppointments = appointments;

    if (added) {
      const startingAddedId =
        appointments.length > 0
          ? appointments[appointments.length - 1].id + 1
          : 0;

      const isAllDay = added.allDay || false;

      const newAppointment: Appointment = {
        id: startingAddedId,
        startDate: isAllDay
          ? new Date(added.startDate).setHours(0, 0, 0, 0)
          : added.startDate || "",
        endDate: isAllDay
          ? new Date(added.startDate).setHours(23, 59, 59, 999)
          : added.endDate || "",
        title: added.title || "No title",
        allDay: isAllDay,
      };

      updatedAppointments = [...appointments, newAppointment];

      console.log("Nowe wydarzenie dodane:", newAppointment);
    }

    if (changed) {
      updatedAppointments = updatedAppointments.map((appointment) =>
        changed[appointment.id]
          ? { ...appointment, ...changed[appointment.id] }
          : appointment
      );
    }

    if (deleted !== undefined) {
      updatedAppointments = updatedAppointments.filter(
        (appointment) => appointment.id !== deleted
      );
    }

    setAppointments(updatedAppointments);
  };

  return (
    <Paper>
      <Scheduler data={appointments} locale={"pl-PL"}>
        <ViewState currentDate={currentDate} />
        <EditingState onCommitChanges={commitChanges} />
        <IntegratedEditing />
        <DayView startDayHour={8} endDayHour={16} />
        <WeekView startDayHour={8} endDayHour={16} />
        <MonthView />
        <ConfirmationDialog />
        <Toolbar />
        <ViewSwitcher />
        <DxAppointments />
        <AppointmentTooltip />
        <AppointmentForm />
        <AllDayPanel />
      </Scheduler>
    </Paper>
  );
}

export default Schedule;

import Paper from "@mui/material/Paper";
import { ViewState } from "@devexpress/dx-react-scheduler";
import {
  Scheduler,
  DayView,
  WeekView,
  MonthView,
  Appointments,
  Toolbar,
  ViewSwitcher,
} from "@devexpress/dx-react-scheduler-material-ui";

const currentDate = "2018-11-01";
const schedulerData = [
  {
    startDate: "2018-11-01T09:45",
    endDate: "2018-11-01T11:00",
    title: "Meeting",
  },
  {
    startDate: "2018-11-01T12:00",
    endDate: "2018-11-01T13:30",
    title: "Go to a gym",
  },
];

function Schedule() {
  return (
    <Paper>
      <Scheduler data={schedulerData} locale={"PL"}>
        <ViewState currentDate={currentDate} />
        <DayView startDayHour={8} endDayHour={16} />
        <WeekView startDayHour={8} endDayHour={16} />
        <MonthView />
        <Toolbar />
        <ViewSwitcher />
        <Appointments />
      </Scheduler>
    </Paper>
  );
}

export default Schedule;

export interface Appointment {
  id: number;
  startDate: string | Date;
  endDate: string | Date;
  title: string;
  allDay?: boolean;
  location?: string;
  notes?: string;
  recurrenceRule?: string;
  recurrenceException?: string;
  rRule?: string;
  exDate?: string;
}

const Appointments: Appointment[] = [
  {
    id: 0,
    startDate: "2018-11-01T09:45",
    endDate: "2018-11-01T11:00",
    title: "Meeting",
    allDay: false, // Przykładowa wartość
  },
  {
    id: 1,
    startDate: "2018-11-01T12:00",
    endDate: "2018-11-01T13:30",
    title: "Go to a gym",
    allDay: false, // Przykładowa wartość
  },
];

export default Appointments;

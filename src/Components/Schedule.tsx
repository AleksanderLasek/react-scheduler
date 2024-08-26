import { useEffect, useState } from "react";
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
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Appointment } from "../assets/Appointments"; // Import interfejsu Appointment

// Funkcja do formatowania daty na format ISO
const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

function Schedule() {
  // Stan do przechowywania listy spotkań
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    // Hook useEffect do pobierania spotkań z bazy danych po załadowaniu komponentu
    const fetchAppointments = async () => {
      const querySnapshot = await getDocs(collection(db, "appointments")); // Pobierz dokumenty z kolekcji "appointments"
      const fetchedAppointments = querySnapshot.docs.map((doc) => {
        const data = doc.data(); // Pobierz dane z dokumentu

        // Przypisz wartości z Firestore do Appointment, konwertując daty na stringi w formacie ISO
        const appointment: Appointment = {
          id: data.id,
          startDate: data.startDate,
          endDate: data.endDate,
          title: data.title,
          allDay: data.allDay || false,
          location: data.location || "",
          notes: data.notes || "",
          recurrenceRule: data.recurrenceRule || "",
          recurrenceException: data.recurrenceException || "",
          rRule: data.rRule || "",
          exDate: data.exDate || "",
        };

        return appointment;
      });

      setAppointments(fetchedAppointments); // Zaktualizuj stan aplikacji z pobranymi spotkaniami
    };

    fetchAppointments(); // Wywołaj funkcję pobierającą spotkania
  }, []); // Efekt uruchomi się tylko raz, po zamontowaniu komponentu

  const commitChanges = async ({ added, changed, deleted }: ChangeSet) => {
    let updatedAppointments = appointments; // Kopia obecnego stanu spotkań

    if (added) {
      // Sprawdź, czy są dodane nowe spotkania
      const startingAddedId =
        appointments.length > 0
          ? Math.max(...appointments.map((appointment) => appointment.id)) + 1
          : 0; // Generuj nowe ID dla dodawanego spotkania

      // Utwórz nowe spotkanie, konwertując daty na format ISO
      const newAppointment: Appointment = {
        id: startingAddedId,
        startDate: added.startDate ? formatDate(new Date(added.startDate)) : "",
        endDate: added.endDate ? formatDate(new Date(added.endDate)) : "",
        title: added.title || "No title",
        allDay: added.allDay || false,
        location: added.location || "",
        notes: added.notes || "",
        recurrenceRule: added.recurrenceRule || "",
        recurrenceException: added.recurrenceException || "",
        rRule: added.rRule || "",
        exDate: added.exDate || "",
      };

      await addDoc(collection(db, "appointments"), newAppointment); // Dodaj nowe spotkanie do bazy danych
      updatedAppointments = [...appointments, newAppointment]; // Zaktualizuj lokalny stan z nowym spotkaniem
    }

    if (changed) {
      // Sprawdź, czy są zmienione spotkania
      updatedAppointments = await Promise.all(
        updatedAppointments.map(async (appointment) => {
          if (changed[appointment.id]) {
            const updatedAppointment = {
              ...appointment,
              ...changed[appointment.id],
            };

            // Przekonwertuj daty na format ISO przed aktualizacją w Firestore
            if (updatedAppointment.startDate) {
              updatedAppointment.startDate = formatDate(
                new Date(updatedAppointment.startDate)
              );
            }
            if (updatedAppointment.endDate) {
              updatedAppointment.endDate = formatDate(
                new Date(updatedAppointment.endDate)
              );
            }

            // Użyj zapytania do znalezienia dokumentu przez id
            const q = query(
              collection(db, "appointments"),
              where("id", "==", appointment.id)
            );

            const querySnapshot = await getDocs(q);
            const docRef = querySnapshot.docs[0]?.id; // Pobierz ID dokumentu

            if (docRef) {
              const appointmentDocRef = doc(db, "appointments", docRef);
              await updateDoc(appointmentDocRef, updatedAppointment); // Zaktualizuj dokument w bazie danych
            } else {
              console.error("Document with id:", appointment.id, "not found"); // Loguj błąd, jeśli dokument nie został znaleziony
            }

            return updatedAppointment; // Zwróć zaktualizowane spotkanie
          }

          return appointment; // Jeśli nie ma zmian, zwróć oryginalne spotkanie
        })
      );
    }

    if (deleted !== undefined) {
      // Sprawdź, czy są usunięte spotkania
      const q = query(
        collection(db, "appointments"),
        where("id", "==", deleted) // Użyj ID do wyszukiwania dokumentu
      );

      const querySnapshot = await getDocs(q);
      const docRef = querySnapshot.docs[0]?.id; // Pobierz ID dokumentu

      if (docRef) {
        const appointmentDocRef = doc(db, "appointments", docRef);
        await deleteDoc(appointmentDocRef); // Usuń dokument z bazy danych
        updatedAppointments = updatedAppointments.filter(
          (appointment) => appointment.id !== deleted // Zaktualizuj lokalny stan, filtrując usunięte spotkania
        );
      } else {
        console.error("Document with id:", deleted, "not found"); // Loguj błąd, jeśli dokument nie został znaleziony
      }
    }

    setAppointments(updatedAppointments); // Zaktualizuj stan aplikacji z nowymi spotkaniami
  };

  return (
    <Paper>
      <Scheduler data={appointments} locale={"pl-PL"}>
        <ViewState /> {/* Stan widoku kalendarza */}
        <EditingState onCommitChanges={commitChanges} />{" "}
        {/* Stan edytowania spotkań */}
        <IntegratedEditing /> {/* Integracja edytowania z widokiem */}
        <DayView startDayHour={8} endDayHour={16} />{" "}
        {/* Widok dzienny kalendarza */}
        <WeekView startDayHour={8} endDayHour={16} />{" "}
        {/* Widok tygodniowy kalendarza */}
        <MonthView /> {/* Widok miesięczny kalendarza */}
        <ConfirmationDialog /> {/* Dialog potwierdzenia operacji */}
        <Toolbar /> {/* Pasek narzędzi */}
        <ViewSwitcher /> {/* Przełącznik widoków kalendarza */}
        <DxAppointments /> {/* Wyświetlanie spotkań */}
        <AppointmentTooltip /> {/* Tooltip z informacjami o spotkaniu */}
        <AppointmentForm /> {/* Formularz do edytowania spotkań */}
        <AllDayPanel /> {/* Panel z opcją całodziennego wydarzenia */}
      </Scheduler>
    </Paper>
  );
}

export default Schedule;

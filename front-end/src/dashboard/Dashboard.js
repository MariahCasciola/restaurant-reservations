import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ListReservationsOneDate from "../reservations/ListReservationsOneDate";
import { next, previous } from "../utils/date-time";
import { useHistory } from "react-router";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */

// default to today
function Dashboard({ date }) {
  const history = useHistory();
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  const getPreviousDate = async () => {
    //set current date on page to be curr date - 1
    // YYYY-MM-DD format
    const prevDate = previous(date);
    //history.push it to the right format
    history.push(`dashboard?date=${prevDate}`);
  };

  const getTodayDate = async () => {
    history.push("/dashboard");
  };

  const getNextDate = async () => {
    //set current date on page to be curr date + 1
    // YYYY-MM-DD format
    const nextDate = next(date);
    history.push(`dashboard?date=${nextDate}`);
  };

  return (
    <main>
      <h1>Dashboard</h1>
      <button onClick={getPreviousDate}>Previous</button>
      <button onClick={getTodayDate}>Today</button>
      <button onClick={getNextDate}>Next</button>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {date}</h4>
      </div>
      <ErrorAlert error={reservationsError} />
      <ListReservationsOneDate reservations={reservations} />
      {/* {JSON.stringify(reservations)} */}
    </main>
  );
}

export default Dashboard;

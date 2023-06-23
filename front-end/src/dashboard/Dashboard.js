import React, { useEffect, useState } from "react";
import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ListReservationsOneDate from "../reservations/ListReservationsOneDate";
import { next, previous } from "../utils/date-time";
import { useHistory } from "react-router";
import ListTables from "../tables/ListTables";
import { trackPromise } from "react-promise-tracker";
import { usePromiseTracker } from "react-promise-tracker";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */

// default to today
function Dashboard({ date }) {
  const history = useHistory();
  const { promiseInProgress } = usePromiseTracker();
  // reservations
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  // tables
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);

  useEffect(loadReservations, [date]);
  useEffect(loadTables, []);

  async function loadDashboard() {
    loadReservations();
    loadTables();
  }

  function loadReservations() {
    // console.log("Now loading reservations")
    const abortController = new AbortController();
    setReservationsError(null);
    // list reservations
    trackPromise(listReservations({ date }, abortController.signal))
    trackPromise(listReservations({ date }, abortController.signal))
      .then((response) =>
        response.filter(
          (reservation) =>
            reservation.status !== "cancelled" &&
            reservation.status !== "finished"
        )
      )
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  function loadTables() {
    const abortController = new AbortController();
    setTablesError(null);
    trackPromise(listTables(abortController.signal))
      .then(setTables)
      .catch(setTablesError);
    trackPromise(listTables(abortController.signal))
      .then(setTables)
      .catch(setTablesError);
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
    <div className="container text-center">
      <main>
        <div className="m-3">
          <h1 className="m-0 fs-1">Dashboard</h1>
        </div>
        <div className="m-3">
          <button onClick={getPreviousDate} className="btn btn-outline-info">
            Previous
          </button>
          <button onClick={getTodayDate} className="btn btn-outline-info">
            Today
          </button>
          <button onClick={getNextDate} className="btn btn-outline-info">
            Next
          </button>
        </div>
        <div className="m-3">
          <h2 className="fs-3">Reservations for {date}</h2>
        </div>
        <ErrorAlert error={reservationsError} />
        <ErrorAlert error={tablesError} />
        {promiseInProgress === true ? (
          <div class="spinner-border text-info" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        ) : (
          <>
            <ListReservationsOneDate
              reservations={reservations}
              loadDashboard={loadDashboard}
            />
            <ListTables tables={tables} loadDashboard={loadDashboard} />
          </>
        )}
      </main>
    </div>
  );
}

export default Dashboard;

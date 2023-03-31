import React from "react";

import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import ReservationsForm from "../reservations/ReservationsForm";
import useQuery from "../utils/useQuery";
import { today } from "../utils/date-time";
import TablesForm from "../tables/TablesForm";
import SeatReservationsAtTables from "../tables/SeatReservationsAtTables";
import SearchBar from "../search/SearchBar";
import EditReservation from "../reservations/EditReservation";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  const query = useQuery();
  let date = query.get("date");
  if (!date) {
    date = today();
  }

  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/dashboard">
        <Dashboard date={date} />
      </Route>
      <Route path="/search">
        <SearchBar />
      </Route>
      <Route path="/reservations/new">
        <ReservationsForm
          initialFormState={{
            first_name: "",
            last_name: "",
            mobile_number: "",
            reservation_date: "",
            reservation_time: "",
            people: "",
          }}
        />
      </Route>
      <Route path="/tables/new">
        <TablesForm />
      </Route>
      <Route path="/reservations/:reservation_id/seat">
        <SeatReservationsAtTables />
      </Route>
      <Route path="/reservations/:reservation_id/edit">
        <EditReservation />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;

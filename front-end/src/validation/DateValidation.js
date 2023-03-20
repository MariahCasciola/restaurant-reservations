import React from "react";

function DateValidation({ errors }) {
  if (errors) {
    // checking for tuesday
    if (errors.message === "Restaurant is closed on Tuesdays.") {
      return (
        <div className="alert alert-danger">
          Restaurant is closed on Tuesdays.
        </div>
      );
    }
    // checking for days
    else if (errors.message === "Reservation must be made in the future.") {
      return (
        <div className="alert alert-danger">
          Reservation must be made in the future.
        </div>
      );
    }
  }
  return null;
}

export default DateValidation;

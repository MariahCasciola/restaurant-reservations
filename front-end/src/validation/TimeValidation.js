import React from "react";

function TimeValidation({ errors }) {
  if (errors) {
    // checking for opening
    if (errors.message === "Reservation time must be at 10:30 am, or later.") {
      return (
        <div className="alert alert-danger">
          Time of reservation must be made between 10:30 am and 9:30 pm.
        </div>
      );
    }
    // checking for closing
    else if (
      errors.message ===
      "Reservation time must be at 9:30 pm, or earlier, the restaurant will be closed at 10:30 pm."
    ) {
      return (
        <div className="alert alert-danger">
          Time of reservation must be made between 10:30 am and 9:30 pm, the
          restaurant closes at 10:30 pm.
        </div>
      );
    }
  }
  return null;
}

export default TimeValidation;

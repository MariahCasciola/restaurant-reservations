# Restaurant Reservations App

## Front-end deployment on [Render](https://restaurant-res-frotn-end.onrender.com)

## Backend deployment on [Render](https://restaurant-reservation-v9k1.onrender.com)

    Technology: JavaScript, HTML, CSS, ReactJS, Bootstrap, ElephantSQL, Express, Knex, Puppeter, Git, and Node.js.


# Usage

+ Created for a mock restaurant, Periodic Tables.

+ Application that can be used to create reservations and tables for guests.

+ Hours 10 am to 10 pm.

+ Contains a search bar that can find all reservations by phone number.

# Installation

Run `cd ./back-end`

Update the `./back-end/.env` file with the connection URL's to the database instance you have chosen.

`npx knex`

`npm install`
# Run the app
Run `npm run start:dev` to run front-end and back-end concurrently
# Run tests

`npm test` runs all tests

`npm run test:backend` runs all backend tests

`npm run test:frontend` runs all frontend tests

`npm run test:1` runs test one for backend and frontend concurrently

`npm run test:3:backend` runs only backend for test 3

`npm run test:3:frontend` runs only frontend for test 3

# RESTful API

Paths for Restaurant API:

    GET /reservations

    GET /reservations/reservationId

    POST /reservations

    PUT /reservations/:reservationId

    PUT /reservations/:reservationsId/status

    GET /tables

    POST /tables/table_id

    PUT /tables/table_id/seat

# User Interface

Paths for UI:

`/dashboard` shows reservations of today's date

`/dashboard?date=2023-06-04` shows reservations of the date YYYY-MM-DD 

`/search` Search a reservation by number

`/reservations/new` Form for creating new reservations

`/tables/new` Form for creating new tables

`/reservations/:reservation_id/edit` Edit a reservation

`/reservations/:reservation_id/seat` Seat a reservation at a table

# Mobile View

Dashboard

Search

Reservation Form

Tables Form

Edit a reservation

Select a table for a reservation

# Desktop View

Dashboard

Search

Reservation Form

Tables Form

Edit a reservation

Select a table for a reservation
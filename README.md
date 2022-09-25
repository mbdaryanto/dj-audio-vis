# Monitor Dashboard for anomaly using sound

## Requirements

This project requires Python 3, PostgreSQL server
To build the client app, npm and yarn is requires

## Build Client app

install dependencies and compile the client code to the static dir

    yarn && yarn build

## Configure Connection

install python dependencies (using virtualenv recommended)

    pip install -r requirements.txt

setting up database Connection, you will be prompted to enter host, port, user, password and database name

    python make_env.python

run migration to build database

    python manage.py migrate

run the server

    python manage.py runserver

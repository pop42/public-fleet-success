##### Development
1. Clone it.
1. run `npm install`
1. run `npm run dc:up` in a separate terminal for databases
1. run `npm run start:dev` to run the application
1. use http-tests directory for api testing

APIs run at http://localhost:3000

Eventstore runs at http://localhost:2113

Kibana (elasticsearch) runs at https://localhost:5601


##### Tips

When using webstorm, go into preferences, turn disable eslint.   Enable prettier on save and code reformat.

### Current Features

Companies

* add new companies
* retrieve company information

Users

* add new users to a company
* retrieve specific user
* search with pagination for users within a company

Vehicles

* add vehicles
* search with pagination for vehicles within a company
* vehicle vin decoded, year/make/model extracted

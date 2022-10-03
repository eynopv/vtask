# Backend Developer Assignment

## How to run

### Docker

The project can be dockerized with

`$ docker build --tag eynopv-solution .`

And then started with

`$ docker run --rm --name eynopv-solution -p 3000:3000 eynopv-solution`

There is conviniet script which does both, just run

`$ ./start.sh`

### Build and Run

1. Install packages

`$ npm install`

2. Build project

`$ npm run build`

3. Initialize database

`$ npm run db:init`

4. Start the server

`$ npm run start`

The server will be running on port 3000

## Database

* Create tables

`$ npm run db:init`

* Populate database with task example data

`$ npm run db:populate`

* Drop tables and create again

`$ npm run db:reset`

* Delete tables

`$ npm run db:delete`

## API

### Company

```
Company {
  id: number,
  name: string,
  parentCompany: company[id]
}
```

`POST /company` - create Company

`GET /company/:id` - retrieve Company

`PUT /company/:id` - update Company

`DELETE /company/:id` - delete Company

`GET /company` - list all Companies

### StationType

```
StationType {
  id: number,
  name: string,
  maxPower: number
}
```

`POST /station_type` - create StationType

`GET /station_type/:id` - retrieve StationType

`PUT /station_type/:id` - update StationType

`DELETE /station_type/:id` - delete StationType

`GET /station_type` - list all StationTypes

### Station

```
Station {
  id: number,
  name: string,
  typeId: StationType[id],
  companyId: Company[id]
}
```

`POST /station` - create Station

`GET /station/:id` - retrieve Station

`PUT /station/:id` - update Station

`DELETE /station/:id` - delete Station

`GET /station` - list all Stations

`GET  /station/company/:companyId` - retrieve company related stations including child companies


### Workflow

`POST /workflow` - run script commands

Example of request body:

```
Begin
Start station 1
Wait 5
Start station 2
Wait 10
Start station all
Wait 10
Stop station 2
Wait 10
Stop station 3
Wait 5
Stop station all
End
```

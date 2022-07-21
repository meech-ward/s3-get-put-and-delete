# Express Backend 

All the backend code is in the express directory, run all backend commands from inside that directory.

## Setup

### .env

Create a new file in the express directory called `.env` and add the following lines:

```env
DATABASE_URL=''

AWS_BUCKET_NAME=''
AWS_BUCKET_REGION=''
AWS_ACCESS_KEY=''
AWS_SECRET_ACCESS_KEY=''
```

Add in your values here. The [database url](https://www.prisma.io/docs/concepts/database-connectors/mysql#base-url-and-path) has to be for a MySQL database, unless you want to change the prisma setup, then go nuts and use whatever you want. 


## Run the app

```sh
npm i
npm start
```

Visit the api at [localhost 8080](http://localhost:8080)

# React Frontend

All the frontend react code is in the react directory, run all frontend commands from inside that directory.

## Run the app

```sh
yarn 
yarn dev
```

Visit the app at [localhost 3000](http://localhost:3000)

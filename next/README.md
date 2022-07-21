## Setup

### .env

Create a new file called `.env` and add the following lines:

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
yarn
yarn dev
```

Visit the app at [localhost 3000](http://localhost:3000)
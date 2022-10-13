# Calendar Events App
build using:
  - TypeScript
  - Nodejs
  - [Fastify](https://www.fastify.io)
  - GraphQL
  - postgres: (knex + objection)
  - docker
  - [Ajv](https://ajv.js.org)
  - [pino](https://getpino.io)

### Quick start (local setup)


- Install postgres: `brew install postgresql`
- Create a postgres user (with password), and set up a database for the project:

```SQL
CREATE USER calender_user WITH PASSWORD 'password';
CREATE DATABASE calender_app;
GRANT ALL PRIVILEGES ON DATABASE calender_app TO calender_user;
```
- set `DATABASE_URL` environment variable on .env file
- run the migratino to init db
```sh
npm run db:migrate
```
- Start the development server

```sh
cp .env.example .env
npm i
npm run dev
```
The http service should be run at port 9000

#### API's
- GET /api/v1/event/:email

#### grpahql
- /grpahql

try it using terminal.
```sh
curl -H "Content-Type:application/json" -XPOST -d '{"query": "query { getEventsByUserEmail(email: "Gerard84@gmail.com") { id title createdBy start end alarm url } }"}' http://localhost:9000/graphql

```

or using [/altair](http://localhost:9000/altair) GraphQL client.


### Docker setup
- 90% completed need to be tested
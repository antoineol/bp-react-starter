## Requirements

## Requirements

- [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli#download-and-install)

## Usage

Setup:

- Copy `.env.example` to `.env`
- Get the `AIRTABLE_API_KEY` from https://airtable.com/account and paste it in `.env`
- `yarn install`: installs node modules for API and front
  
Start project: 

- `yarn start`: starts database, API, hasura and front
- `yarn console`: opens the Hasura console. Useful to check the database and create migrations.

## Deployment

Suggested deployment:

- The front on netlify (watch for front-starter folder)
- The API on Google App Engine (recommended?) or Google Cloud Run (example Cloud Build script: api-starter/cloudbuild.yaml)
- Hasura on Google Cloud Run (config for Google Cloud Build: db/hasura/cloudbuild-hasura-app.yaml)
- Hasura migrations run with Google Cloud Build (config: db/cloudbuild-hasura-migrations.yaml)

## Upgrade steps

- Continue on the front: src/features/auth/auth0-hook-methods.ts
- Ensure the token is renewed well
- Ensure the API recognizes the token

## Tooling that can be added

Sentry for error monitoring
API doc with swagger
Nice to have: netlify CMS for static content?

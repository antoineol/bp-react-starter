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

You're getting the following error while Apollo initializes the connection to Hasura back-end? And your project is running in WSL2?

> Could not verify JWT: JWTIssuedAtFuture

Run:

`yarn fixtime`

This is a known issue that might be fixed in the future, but it has been around for a long time.

## Setup

- Update .env at the root and in front-starter to match your configuration
- The starter uses an Auth0 rule to define the Hasura claims in JWT, following this guide: https://hasura.io/docs/latest/graphql/core/guides/integrations/auth0-jwt.html

## Deployment

Suggested deployment:

- The front on netlify (watch for front-starter folder)
- The API on Google App Engine (recommended?) or Google Cloud Run (example Cloud Build script: api-starter/cloudbuild.yaml)
- Hasura on Google Cloud Run (config for Google Cloud Build: db/hasura/cloudbuild-hasura-app.yaml)
- Hasura migrations run with Google Cloud Build (config: db/cloudbuild-hasura-migrations.yaml)

## Upgrade steps

- Hasura on page Profile
- Form on page Profile

## Tooling that can be added

Sentry for error monitoring
API doc with swagger
Nice to have: netlify CMS for static content?

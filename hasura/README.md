Update the schema with `yarn schema`.

To squash the schema (merge all migration files into one single file), [steps here](https://blog.hasura.io/resetting-hasura-migrations/). Beware: if the app is already deployed on multiple environments, it may prevent other environments from applying new migrations (unsynchronized migrations).

## Usage

```bash
yarn install
yarn start
yarn test
```

## Add validation

NestJS allow to do model-driven validation with class-validator and class-transformer. See this article for more information: https://docs.nestjs.com/pipes#binding-validation-pipes

But this is only recommended for server-side-only validation. See comments in main.ts. If the same validation should be applied on both client-side and server-side, a different approach should be considered, like a model/validation configuration. Example: declare your model on AirTable and load it on both client-side (to generate the form + validate) and on server-side (to validate).

Ce projet est basé sur [Create React App](https://facebook.github.io/create-react-app/docs/getting-started) (CRA) et [Material UI](https://material-ui.com/getting-started/installation/) (MUI) dont la lecture de la documentation est fortement recommandée, surtout pour les Tech Leads et Dev Leads.

## Usage

Tous exemples sont basés sur yarn, qui est recommandé : `npm install -g yarn`

Clonez le projet et `yarn install`.

Scripts disponibles :

- `yarn start` : démarre l'app localement (lazy reload / hot replacement) avec l'environnement de développement
- `start:staging` : démarre l'app localement avec environnement de staging
- `start:prod` : démarre l'app localement avec environnement de production
- `build:staging` : build l'app avec l'environnement de staging
- `build:prod` : build l'app avec l'environnement de production
- `test` : lance les tests de l'app en watch mode. Notez que CRA ne lance que les tests de [ce qui a changé depuis le dernier commit](https://facebook.github.io/create-react-app/docs/running-tests#version-control-integration).
  - Avec WebStorm, il est recommandé de plutôt lancer les tests par le lanceur intégré à l'IDE. Soit en lançant seulement les tests sur lesquels vous travaillez, soit en lançant l'ensemble des tests avec une configuration dédiée (il y a une option "All Tests" dans l'éditeur de configuration).
- `serve` : après un build, lance un serveur HTTP sur le dossier build pour vérifier localement que le contenu build est bon, avant de le déployer.
- `eject` : si votre projet doit vraiment faire des changements avancés, par exemple de la configuration webpack. La plupart du temps, des alternatives évitant d'éjecter existent. Et en avant-dernier recours, pensez à fork CRA ([article officiel présentant cette alternative](https://facebook.github.io/create-react-app/docs/alternatives-to-ejecting))

Pour mettre à jour les bibliothèques (node modules) : `yarn upgrade-interactive --latest`. Après ça, testez bien que tous les tests passent et que l'app tourne.

## Améliorations possibles

- Re-enable hmr: appConfig.useHotModuleReplacement
- Follow-up hasura JWT over cookies instead of headers ([github issue](https://github.com/hasura/graphql-engine/issues/2183), [another issue](https://github.com/hasura/graphql-engine/issues/2205))
- Use react snapshots or an equivalent

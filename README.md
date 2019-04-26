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

## Avancé : reconstruction du starter

Certaines étapes demandent de copier des fichiers de ce dépôt directement pour éviter de les réimplémenter (e.g. src/common/test.utils.tsx).

### Initialiser le projet

Utiliser [Create React App](https://facebook.github.io/create-react-app/docs/getting-started). Pour créer un projet nommé “my-app” :

```bash
yarn create react-app my-app --typescript
```

([doc sur TypeScript](https://facebook.github.io/create-react-app/docs/adding-typescript))

Ce projet est ensuite étendu avec les fonctionnalités suivantes.

### Versionner la configuration WebStorm

Pour que les règles de formatage de WebStorm et autres ajustements soient partagés entre les membres de l’équipe.

Ajouter au .gitignore :

```gitignore
# version WebStorm project config
# https://intellij-support.jetbrains.com/hc/en-us/articles/206544839
/.idea/workspace.xml
/.idea/usage.statistics.xml
/.idea/tasks.xml
```

### Editorconfig

Pour fixer quelques règles de base de formatage des fichiers.

- Copier `.editorconfig`.

### TSLint

Pour l’analyse statique de code et pour aider au formatage automatique.

- `yarn add -DE tslint tslint-config-blvd prettier tslint-config-prettier`
- Copier `tslint.json` et `.prettierrc`. Pour ce dernier, appliquer la config à WebStorm en cliquant sur Yes (si disponible) :

![Aperçu du prompt demandant d'appliquer la config](https://lh3.googleusercontent.com/grgmA_lOzKdoj5t5Xwi5gSMKYeDblIVm9H4sBImkT29t_GeQD3AxN2Y4Q9uO2VuInw1ndwgs1347RmWQIdPDyAiqn66VWEqlt2TaZd2XxFJysmDJdMe50W4mum9pVm3qQ5uPSNFH "Cliquez sur Yes pour mettre à jour la config WebStorm")

- Activer tslint sur WebStorm : Languages & Frameworks > TypeScript > TSLint : Enable

Tester en changeant un peu de code avec des syntaxes illégales (des espaces en trop en fin de ligne par exemple).

### Material UI

Cf. [la BP React du Drive](https://docs.google.com/document/d/1RdFwITlHl1AUxXmE1u076wwKbDndRkhnPv9ezzL5oNU) pour la motivation de ce choix.

- `yarn add -E @material-ui/core @material-ui/icons typeface-roboto`
- Mettre à jour le viewport dans `public/index.html` :

```html
<meta name="viewport"
      content="width=device-width, minimum-scale=1, initial-scale=1, shrink-to-fit=no">
```

- Ajouter un import dans `src/index.tsx` :

```typescript jsx
import 'typeface-roboto';
```

- Déplacer `src/serviceWorker.tsx` vers `src/_core/serviceWorker.tsx`
- Copier `src/_core/app.theme.ts`, `src/App.tsx`, `src/index.css` et supprimer `src/App.css` pour “materialiser” l’application React par défaut. Notez l’utilisation du thème et des types.

La [documentation Material UI](https://material-ui.com/getting-started/installation/) contient de nombreux guides et articles sur l’utilisation de la bibliothèque. Sa lecture est recommandée pour utiliser au mieux cette bibliothèque.

### Redux, saga, routes

- `yarn add -E react-redux redux redux-immutable immutable redux-saga reselect history react-router react-router-dom connected-react-router`
- `yarn add -DE @types/history @types/react-redux @types/redux-immutable @types/react-router @types/react-router-dom`
- Pour la structure de base Redux et saga, copier `src/_core/app.reducers.tsx`, `src/_core/app.sagas.tsx`, `src/_core/app.store.tsx`, `src/common/app.models.ts`, `src/common/routes.service.tsx`, `src/common/app.utils.tsx`
- Dans `src/common/app.utils.ts`, supprimer pour le moment la méthode `apiGet` et ses dépendances. Nous la verrons plus tard avec les variables d’environnement et Axios.
- Copier `src/index.tsx` ou ajuster la différence (history, store, provider).
- Mettons en place un exemple de service : copier `src/home/home.service.ts`. Ce fichier liste les éléments de redux nécessaires à la fonctionnalité d’incrément (sélecteurs, actions, reducers, saga, constantes/modèles).
- Copier ou ajuster `src/home/Home.tsx` si besoin.

Note : Un article mentionnait l’utilité de la bibliothèque `typesafe-actions`. Elle n’est pas utilisée dans ce template, mais si un bénéfice est identifié, elle est la bienvenue.

### Axios

Pour envoyer des requêtes HTTP avec des promises et des options de formatage des requêtes (par exemple les query params).

- `yarn add -E axios`
- `yarn add -DE axios-mock-adapter`
- Exemples de code dans `src/home/home.service.ts` et `src/common/app.utils.ts`

### Tests et Enzyme

Pour les tests unitaires avec des snapshots.

- `yarn add -DE enzyme enzyme-adapter-react-16 enzyme-to-json @types/enzyme @types/enzyme-adapter-react-16`
- Ajouter dans `package.json` :

```
{
  // ...
  "jest": {
    "snapshotSerializers": [
      "enzyme-to-json/serializer"
    ]
  }
}
```

- Copier `src/setupTests.js`, `src/common/test.utils.tsx`, 
- Copier les tests : `src/App.test.tsx` et `src/home/Home.test.tsx`
- Lancer les tests et vérifier qu’ils passent tous

### Variables d’environnement

- `yarn add -DE env-cmd`
- Copier `.env`, `.env.dev`, `.env.staging`, `src/environment/env.tsx`
- Mettre à jour les scripts npm :

```
"start": "env-cmd .env.dev react-scripts start",
"start:staging": "env-cmd .env.staging react-scripts start",
"start:prod": "react-scripts start",
"build:staging": "env-cmd .env.staging npm run build",
"build:prod": "npm run build",
…
"_______________ implementation details _______________": "",
"build": "react-scripts build"
```

(Gardons la commande de build de base séparée, elle sera complétée par la suite.)

- Éventuellement mettre à jour la méthode `apiGet` pour utiliser la variable d’environnement `apiPath` comme URL de base de l’API : ``axios.get<T>(`${env.apiPath}${url}`, config)``
- Lancer les tests et vérifier qu’ils passent toujours

Un autre outil courant pour appliquer des variables d’environnement dans les scripts npm en cross-platform est [cross-env](https://www.npmjs.com/package/cross-env).

### Versions des bibliothèques dans package.json

Fixer toutes les versions des bibliothèques en enlevant tous les symboles `^` et `~` des versions dans `dependencies` et `devDependencies`. On garantit ainsi que tout le monde partage exactement les mêmes versions et qu'elles sont cohérentes avec l’environnement de build (si séparé).

Les mises à jour des bibliothèques sont encouragées, mais l’application doit toujours avoir des tests de non-régression avant d’envoyer ce changement en production l’app. Si une régression est constatée et que sa correction sort du périmètre des tickets en cours, un ticket d’amélioration technique (upgrade de la bibliothèque causant le problème) peut être créé et sa priorité ajustée.

### Hot Module Replacement (HMR)

Le HMR a été ajouté au projet pour accélérer les cycles de dév/test. Deux fichiers sont impactés :

- `src/index.tsx` : re-render le composant `App` en cas de changement
- `src/_core/app.store.ts` : recharge les reducers pour que ça fonctionne avec Redux

### React Snapshots

Cet outil permet de faire un pré-rendu statique des pages React. C’est notamment utile pour l’hébergement statique, sans server-side rendering.

- `yarn add -DE react-snapshot`
- Mettre à jour `src/index.tsx` en utilisant la méthode render de react-snapshot :

```typescript jsx
import { render } from 'react-snapshot';
// …
return render(app, rootElt);
```

- Mettre à jour le script de build : `"build": "react-scripts build && react-snapshot",`
- Le type peut être ajouté pour éviter une erreur de typage : copier `src/react-app-env.d.ts`

### React Hooks

[Article officiel présentant le concept](https://reactjs.org/docs/hooks-intro.html)

Le concept est nouveau (version 16.8 beta au moment où ces lignes sont écrites), mais a l’air prometteur. À adopter dans le starter dès qu’il est released.

Material UI semble fournir des exemples avec les hooks pour leurs composants et échantillons de code.

### Référence

Pour challenger l’architecture de code, une bonne référence est [react-boilerplate](https://github.com/react-boilerplate/react-boilerplate). Il a l’inconvénient de ne pas être basé sur CRA, donc se prive d’un certain nombre d’avantages (exemple : TypeScript), mais contient nombre de bonnes pratiques.

Quelques commentaires et ajustements mineurs ont pu être apportés en complément, par rapport aux étapes ci-dessus, pour arriver à l’exemple de starter, afin d’aider à sa prise en main.

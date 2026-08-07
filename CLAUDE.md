# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Présentation

Front **Angular** du site de **K.A.O.S.**, troupe d'improvisation théâtrale. Ce dépôt fait partie
de l'écosystème **Scène Impro Live**, qui regroupe plusieurs briques indépendantes :

| Brique | Rôle | Stack |
| --- | --- | --- |
| **Front Angular** *(ce dépôt)* | Site public + écrans de spectacle | Angular 22 |
| App technicien | Envoie les infos de scène (thème, catégorie, temps restant) depuis le téléphone / PC du technicien | Flutter (mobile + desktop) |
| Microservices backend | API REST + diffusion temps réel | Symfony et/ou .NET, dépôts séparés |

Ce dépôt ne contient **que** le front. Ne pas y chercher — ni y ajouter — de code serveur.

## Les trois pages

1. **Accueil** (`home`) — grand public : présentation de la troupe, prochains spectacles (dates,
   lieux), liens réseaux sociaux. Contenu statique ou alimenté par l'API REST.
2. **Affichage public** (`public-display`) — écran projeté pour le public pendant la
   représentation : scène en cours (thème, catégorie, temps restant…), et à terme interaction
   depuis le mobile des spectateurs. **Temps réel.**
3. **Affichage joueurs** (`player-display`) — écran destiné aux improvisateurs sur scène : infos
   utiles en jeu. **Temps réel.**

Les noms définitifs ne sont pas arrêtés ; en attendant, ceux du `README.md` font foi.

## Commandes

```bash
npm start          # ng serve — dev server sur http://localhost:4200/
npm run build      # build de production dans dist/ (config production par défaut)
npm run watch      # build incrémental en config development
npm test           # ng test — Vitest via le builder @angular/build:unit-test (env jsdom)
ng test --include src/app/core/realtime/message-feed.spec.ts   # un seul fichier de test
ng generate component <page>                                    # scaffolding d'un composant
```

Pas de lint configuré. Formatage par **Prettier** (`printWidth: 100`, `singleQuote: true`,
parser `angular` pour les `.html`).

> **Node** : le `node` du PATH est celui bundlé par WebStorm (v24.13.0), **trop ancien** pour
> l'Angular CLI 22 (≥ v24.15.0 requis). Préfixer par le Node système :
> `export PATH="/c/Program Files/nodejs:$PATH"` — sinon `ng test` / `ng build` refusent de démarrer.

## Architecture

- **Angular 22, 100 % standalone** — pas de `NgModule`. Bootstrap par
  `bootstrapApplication(App, appConfig)` dans `src/main.ts` ; providers globaux dans
  `src/app/app.config.ts` ; routes dans `src/app/app.routes.ts`.
- **Signals d'abord** — `signal()`, `computed()`, signal inputs. Pas de propriétés mutables ni de
  `BehaviorSubject` pour l'état de vue.
- **Change detection** : en Angular 22, `OnPush` est le **défaut** (`OnPush = 0`) — ne pas
  déclarer `changeDetection` sur un nouveau composant. `ChangeDetectionStrategy.Default` est
  déprécié, alias de `Eager`. (`app.ts` déclare `Eager` par héritage du schematic ; ne pas
  reproduire.)
- **Nommage** : pas de suffixe `.component`. Un composant porte le nom de son rôle et éclate
  ses fichiers — `public-display.ts` / `.html` / `.css`, avec `templateUrl` + `styleUrl`.
- **Arborescence** :

  ```
  src/app/
  ├── core/            # transverse : temps réel, modèles de domaine, clients API
  │   └── realtime/
  ├── home/            # page d'accueil
  ├── public-display/  # écran public (spectacle)
  ├── player-display/  # écran joueurs (spectacle)
  ├── app.ts / .html / .css
  ├── app.config.ts
  └── app.routes.ts
  ```

  Seul `core/realtime/` existe à ce jour ; les trois dossiers de pages sont **prescriptifs** et
  restent à créer. Les dépendances pointent **vers l'intérieur** : une page dépend de `core/`,
  jamais l'inverse, et deux pages ne se connaissent pas.
- **TypeScript strict** : `strict`, `strictTemplates`, `noPropertyAccessFromIndexSignature`,
  `noImplicitReturns`, `noImplicitOverride`, `noFallthroughCasesInSwitch`. Respecter ces
  contraintes plutôt que de les contourner (`any`, `!`, `@ts-ignore`).

### Couche temps réel

Transport **Socket.io** (`socket.io-client`), négociation WebSocket gérée par la lib. Endpoint en
`http://` (dev) / `https://` (prod).

Le code applicatif ne dépend **jamais** de `socket.io-client` directement. Il dépend du port
`RealtimeSocket` (`src/app/core/realtime/realtime-socket.ts`) : une interface minimale
(`on` / `off` / `connect` / `disconnect`) résolue par le jeton d'injection `REALTIME_SOCKET` —
vrai socket en prod, faux socket en test. Toute évolution du transport (y compris un passage à
un WebSocket natif) se fait derrière ce port, sans toucher aux services ni aux composants.

Chaque flux temps réel est un service `providedIn: 'root'` qui :

- injecte `REALTIME_SOCKET`, s'abonne aux événements entrants et appelle `connect()` ;
- **traduit le payload réseau en modèle de domaine** (`core/realtime/message.ts`) plutôt que de
  propager le format serveur jusqu'aux composants ;
- expose son état en signals *readonly* (`_x = signal(...)` privé + `readonly x = _x.asReadonly()`) ;
- suit explicitement la connexion via les événements `connect` / `disconnect`
  (et `connect_error` le cas échéant), en s'appuyant sur la reconnexion automatique de Socket.io.

`MessageFeed` (`src/app/core/realtime/message-feed.ts`) est l'implémentation de référence :
la calquer pour tout nouveau flux (chrono, thème, catégorie…).

> ⚠️ **À faire** : `REALTIME_SOCKET` n'est lié que dans les tests. Aucun provider n'existe dans
> `app.config.ts`, donc injecter `MessageFeed` en runtime lève un `NullInjectorError`. Il faut
> fournir une factory `io(...)` (avec l'URL du service de diffusion) avant de brancher les écrans
> de spectacle.

## Tests

Runner **Vitest** intégré au builder Angular, specs co-localisées (`*.spec.ts`). Les tests
d'intégration qui parlent à un backend de dev sont suffixés `*.integration.spec.ts` et restent
séparés des tests unitaires.

Les services temps réel se testent **sans réseau** : fournir un faux socket sur `REALTIME_SOCKET`
via `TestBed`. Voir le `FakeSocket` de `message-feed.spec.ts`, qui expose un helper `serverEmit`
pour simuler un événement serveur.

## Convention de commits

Préfixe `#TYPE!` : `#FEAT!`, `#FIX!`, `#REFACTOR!`, `#TEST!`, `#DOCS!`, `#BUILD!` (dépendances,
config de build), éventuellement avec un scope — `#REFACTOR(public-display): ...`.

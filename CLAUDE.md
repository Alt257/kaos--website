# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Présentation

Site web de **Kaos**, une troupe d'improvisation théâtrale. Application Angular 22 (SPA) dont la
vocation est notamment d'afficher des informations temps réel pendant les spectacles (écran de
scène / *affichage-spectateurs*, message, temps restant, d'autres informations pourront être rajoutées par la suite) alimentées par un backend via **Socket.io**.

> Décision d'architecture : le transport temps réel abandonne **SignalR** au profit de
> **Socket.io** (via `socket.io-client`). La dépendance `@microsoft/signalr` a été retirée.
>
> État actuel : la branche `dev` est en cours de remaniement. L'ancien client SignalR ainsi que
> les features `match-impro` et `affichage-spectateurs` ont été retirés (voir `git log` pour le
> détail des suppressions).
>
> - **`match-impro` est abandonnée** : cette feature ne sera pas réintroduite. Ignorer les
>   éléments `match-impro` de l'historique git (composants, service, modèle, hub) — ils ne
>   servent plus de référence.
> - **`affichage-spectateurs`** sera réintroduite sur le nouveau transport Socket.io.
>
> L'historique git reste une référence pour le *découpage* des features encore vivantes, mais
> **pas** pour la couche transport (désormais obsolète) ni pour `match-impro` (abandonnée).

## Commandes

```bash
npm start          # ng serve — dev server sur http://localhost:4200/
npm run build      # build de production dans dist/ (config production par défaut)
npm run watch      # build incrémental en config development
npm test           # ng test — lance Vitest (runner @angular/build:unit-test, env jsdom)
ng test --include src/app/app.spec.ts   # exécuter un seul fichier de test
ng generate component features/<nom>    # scaffolding d'un composant
```

Aucune commande de lint n'est configurée. Le formatage est géré par **Prettier**
(`printWidth: 100`, `singleQuote: true`, parser `angular` pour les templates HTML).

## Architecture

- **Angular 22, 100 % standalone** — pas de `NgModule`. Bootstrap via `bootstrapApplication(App, appConfig)`
  dans `src/main.ts` ; les providers globaux (router, gestion d'erreurs) vivent dans `src/app/app.config.ts`.
- **Signals d'abord** — l'état des composants utilise `signal()` / signal inputs plutôt que des
  propriétés mutables. Préférer les signals au state impératif.
- **Convention de nommage** : pas de suffixe `.component`. Un composant se nomme par son rôle
  (`app.ts`, `app.html`, `app.css`) et sépare `templateUrl` + `styleUrl` dans des fichiers dédiés.
- **Organisation prévue** : features sous `src/app/features/<feature>/`, code transverse (clients
  temps réel, factories) sous `src/app/core/`. Les routes se déclarent dans `src/app/app.routes.ts`.
- **TypeScript strict** : `strict`, `strictTemplates`, `noPropertyAccessFromIndexSignature`,
  `noImplicitReturns` activés — respecter ces contraintes plutôt que de les contourner.

### Couche temps réel (Socket.io)

> Aucune implémentation n'existe encore sur `dev` : `src/app/core/` a été vidé lors du
> remaniement. La convention ci-dessous est **prescriptive** — elle décrit comment construire
> les services temps réel lors de leur (ré)introduction.

Chaque flux temps réel est encapsulé dans un service injectable `providedIn: 'root'`
(sous `src/app/core/`) qui :
- ouvre la connexion via `io()` de `socket.io-client`, idéalement enveloppé dans une factory
  dédiée pour pouvoir mocker le socket en test ;
- s'abonne aux événements entrants (`socket.on('<event>', ...)`) et les expose en signal ;
- traduit le payload brut du serveur en modèle interne du domaine, plutôt que de propager le
  format réseau dans les composants ;
- s'appuie sur la reconnexion automatique de Socket.io (activée par défaut), tout en gérant
  explicitement les états de connexion (`connect` / `disconnect` / `connect_error`).

L'endpoint utilise le schéma `http://` (dev) / `https://` (prod) — Socket.io négocie lui-même
la montée en WebSocket.

## Tests

Runner **Vitest** intégré au builder Angular. Les specs sont co-localisées (`*.spec.ts`).
L'historique distingue les tests unitaires des tests d'intégration (`*.integration.spec.ts`,
qui parlent au backend de dev).

## Convention de commits

Les messages suivent un préfixe `#TYPE!` : `#FEAT!`, `#REFACTOR!`, `#BUILD!` (dépendances), etc.,
parfois avec un scope façon conventional commits (`#REFACTOR(affichage-spectateurs): ...`).

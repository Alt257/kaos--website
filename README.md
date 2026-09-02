# K.A.O.S. — Site web de la troupe

Application front (Angular) du site web de la troupe de théâtre d'improvisation **K.A.O.S.**

Ce projet fait partie de l'écosystème **Scène Impro Live**, qui regroupe le front Angular et plusieurs services backend indépendants (API REST, diffusion temps réel des états de scène, etc.).

## Écosystème du projet

Ce dépôt correspond uniquement au **front Angular** (site web + écrans de spectacle). Il fait partie d'un ensemble plus large :

- **Front Angular** *(ce dépôt)* — site web de la troupe + écrans d'affichage
- **App technicien (Flutter)** — application installée sur le téléphone et l'ordinateur du technicien, permettant d'envoyer les informations (thème, catégorie, temps restant, etc.) au service de diffusion
- **Microservices backend** — API REST + diffusion temps réel, écrits en **Symfony** ou en **.NET** selon le service

## Présentation

Le site remplit trois fonctions principales, réparties sur plusieurs pages :

### 🏠 Page d'accueil

Présente la troupe K.A.O.S. au grand public :

- Présentation de la troupe
- Prochains spectacles (dates, lieux)
- Liens vers les réseaux sociaux

### 🎭 Page d'affichage public *(pendant le spectacle)*

Écran projeté à destination du public pendant les représentations :

- Informations sur la scène en cours (thème, catégorie, temps restant, etc.)
- Interaction possible via le téléphone mobile du public

### 🎬 Page d'affichage joueurs *(pendant le spectacle)*

Écran destiné aux improvisateurs sur scène :

- Informations utiles en temps réel pendant le jeu

> ℹ️ Les noms définitifs des pages/écrans ne sont pas encore arrêtés.

## Stack technique

- **Framework (ce dépôt)** : Angular
- **App technicien** : Flutter (mobile + desktop)
- **Backends** : microservices indépendants (Symfony et/ou .NET), exposant une API REST et une diffusion temps réel via WebSocket

## Démarrage

```bash
npm install
ng serve
```

L'application sera accessible sur `http://localhost:4200/`.

## Structure du projet

```
src/
├── app/
│   ├── home/              # Page d'accueil
│   ├── public-display/    # Affichage public pendant le spectacle
│   ├── player-display/    # Affichage pour les joueurs sur scène
│   └── ...
```

## Statut

🚧 Projet en cours de développement.

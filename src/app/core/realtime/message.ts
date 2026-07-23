/**
 * Modèle de domaine : un message affiché sur l'écran spectateurs.
 * Vit dans `core/` (pas dans la feature) car c'est le cœur : le service et
 * le composant en dépendent tous les deux, et les dépendances pointent vers
 * l'intérieur. C'est *notre* modèle, découplé du format réseau du serveur.
 */
export interface Message {
  content: string;
}

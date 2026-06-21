# Release v1.3.0 — Optimisations du Module Séquences et Gestion des Filtres de Classes

Cette mise à jour apporte des améliorations majeures à l'ergonomie globale de l'interface locale (notamment sur les petits écrans), simplifie l'affectation des séances et corrige des comportements inattendus lors du masquage de classes.

![Aperçu du constructeur de séquences](./UI/Screen%20Séquence%20Constructeur.png)

---

## 🚀 Nouveautés & Améliorations de l'Interface

### 1. Refonte Ergonomique du Module Séquences
L'interface du module **Séquences** a été repensée sous forme de double colonne verticale pour maximiser l'espace utile et faciliter le flux de travail :
* **Colonne de gauche (Planification)** : Regroupe le planning d'affectation interactif et le déroulé de la séquence active (Timeline et activités).
* **Colonne de droite (Configuration)** : Réunit les métadonnées de la séquence, les compétences du Bulletin Officiel (BO) et les documents de cours associés.

### 2. Panneaux Repliables Verticalement
Chaque bloc de la vue Séquences intègre désormais un bouton de repliement triangulaire (`▼` / `▲`) :
* Permet de masquer verticalement les panneaux inutilisés pour gagner en clarté.
* Optimise le confort visuel lors du travail sur petit écran (PC portables).
* L'état des panneaux est sauvegardé dans le navigateur pour être restauré à la prochaine visite.

### 3. Filtre de Classe Direct dans le Planning
* Un menu de sélection de classe est désormais inséré directement dans la barre d'en-tête du panneau **Affectation des séances (Planning)**.
* Plus besoin de repasser par la barre latérale pour changer de classe active.
* Synchronisation bidirectionnelle automatique : tout changement dans ce menu met instantanément à jour le filtre global et toutes les vues de l'application.

### 4. Nettoyage du Titre de l'Application
* Suppression de la mention superflue de classe dans le bandeau de titre supérieur (ex: "ASSP 26-27") afin de conserver une esthétique haut de gamme, neutre et aérée.

---

## 🔧 Correctifs & Améliorations de la Logique Applicative

### 5. Résolution du Masquage de Classes (Écran Blanc)
* **Bypass intelligent** : Si une classe a été masquée dans le Gestionnaire de classes (`state.hiddenClasses`), sa sélection explicite dans un menu déroulant force désormais l'affichage temporaire de ses séances. Cela évite les écrans blancs déroutants (« Aucun cours visible pour ce filtre »).
* **Indicateur dynamique** : Le bouton de la barre latérale affiche désormais le nombre exact de classes masquées :
  * *« Gérer les classes détectées (4 masquées)... »*
  * Offre une meilleure visibilité des filtres globaux actifs.

### 6. Stabilisation de la Persistance de Sélection
* Assouplissement de la validation dans `updateFilters()` pour autoriser la sélection de n'importe quelle classe faisant partie de la nomenclature réglementaire (`CANONICAL_CLASSES`), même si le fichier ICS importé ne contient aucun événement actif pour celle-ci.

---

## 📦 Fichiers modifiés dans cette version
* `index.html` : Structure HTML du sélecteur de classe interne et des boutons de repliement.
* `style.css` : Ajustement du layout en deux colonnes verticales, styles d'impression et animations de repliement.
* `app.js` : Synchronisation des filtres, logique de bypass des classes masquées et mise à jour de l'affichage.
* `MANUEL_UTILISATEUR.md` : Documentation des nouveautés et de la nouvelle ergonomie de planification.
* `JOURNAL.md` : Journalisation technique détaillée des modifications.

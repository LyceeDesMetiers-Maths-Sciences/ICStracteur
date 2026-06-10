# Journal de développement - ICStracteur

## État du document

- Projet : ICStracteur 2026-2027
- Technologie : application locale HTML, CSS et JavaScript sans serveur applicatif
- Mise à jour du journal : 6 juin 2026
- Documentation utilisateur : `MANUEL_UTILISATEUR.md`

## 1. Demande initiale

Construire un extracteur ICS robuste pour exploiter un emploi du temps Pronote :

- extraire les cours d'une classe ou d'un groupe ;
- produire une liste ordonnée avec date, heure, salle, groupe et séquence ;
- conserver les descriptions ICS repliées sur plusieurs lignes ;
- ajouter PFMP, évaluations et événements manuels ;
- suivre les cours faits, les documents distribués et les absents ;
- exporter en CSV et PDF.

Le périmètre a ensuite évolué vers un véritable outil de planification annuelle par séquences.

## 2. Contraintes métier

Classes autorisées :

- `_1CAPAS` ;
- `_2CAPAS` ;
- `1ASSP1` ;
- `1ASSP2` ;
- `1AEPA` ;
- `TAEPA`.

Le calendrier doit gérer :

- classe entière et groupes `G1`, `G2`, `GA`, `GB` ;
- Maths, Sciences, Co-intervention et cours non classés ;
- cours annulés, absences, sorties et PFMP ;
- évaluations sommatives, mini-évaluations et CCF ;
- séquences communes à plusieurs groupes.

## 3. Architecture retenue

L'application est constituée de :

- `index.html` : structure de l'interface ;
- `style.css` : mise en page écran et impression ;
- `app.js` : extraction ICS, modèle de données, filtres, vues et persistance ;
- `MANUEL_UTILISATEUR.md` : procédures d'utilisation ;
- `JOURNAL.md` : historique et décisions de développement.

Le fichier ICS reste la source des événements. Les corrections sont superposées sous forme d'annotations enregistrées dans `localStorage`.

Les événements affichés sont reconstruits à chaque rendu à partir de :

1. l'événement ICS ou manuel ;
2. ses annotations locales ;
3. la séquence programmée éventuellement rapprochée ;
4. les règles automatiques de classe, groupe, type et matière.

## 4. Phase 1 - Extraction ICS

### Demandes

- Lire un fichier Pronote réel.
- Respecter les lignes ICS repliées.
- Extraire les champs utiles.
- Éviter les classes parasites dans les menus.

### Réalisations

- Dépliage des lignes commençant par un espace ou une tabulation.
- Lecture de `SUMMARY`, `DESCRIPTION`, `LOCATION`, `DTSTART`, `DTEND` et `UID`.
- Gestion des dates simples et des dates avec horaires.
- Extraction des séquences depuis `Contenu prévu`, `Séquence` ou `Séance`.
- Canonisation des classes et des variantes CAP.
- Normalisation des groupes.
- Tri chronologique des événements.

### Corrections

- Le menu classe est limité aux six classes attendues.
- Le menu groupe est recalculé selon la classe choisie.
- L'appartenance à une classe est vérifiée dans la classe, le groupe, le titre, la séquence et la description.
- Un nouvel import réinitialise les filtres hérités du jeu de démonstration.

## 5. Phase 2 - Vues de consultation

### Vue Liste

- Tableau chronologique détaillé.
- Actions rapides Fait et Documents.
- Type et marqueur d'évaluation.
- Masquage des noms d'élèves présents dans certains événements Pronote.
- Renommage fonctionnel de l'ancienne vue tableau en `Liste`.

### Vue Grille

- Cartes de séances.
- Nombre de colonnes paramétrable.
- Statut fait ou à venir.
- Accès au détail d'un cours.

### Ergonomie générale

- Les trois vues sont exclusives.
- Le panneau gauche devient contextuel selon la vue.
- La zone centrale défile indépendamment des panneaux latéraux sur grand écran.
- Le panneau Détails conserve son propre défilement.

## 6. Phase 3 - Planification annuelle

### Demande

Obtenir une vue très synthétique du temps disponible et restant sur une page, avec un carré par cours.

### Réalisations

- Une classe doit être choisie avant affichage.
- Un carré représente une séance réelle.
- Carré plein : séance passée ou cochée faite.
- Carré vide : séance à venir.
- Carré gris : séance sans séquence.
- Zoom réglable.
- Orientation Portrait ou Paysage.
- Export via la feuille d'impression A4 paysage.

### Modes

- `Mixte` : tous les cours dans l'ordre chronologique.
- `Par matière` : colonnes Maths, Sciences, Co-intervention et Non classé.

### Repères temporels

- Regroupement des cours par mois.
- Cartouche mensuel matérialisé par un filet discret.
- Conservation des mois dans chaque colonne du mode Par matière.

## 7. Phase 4 - Évaluations et événements particuliers

Marqueurs ajoutés :

- point rouge : évaluation sommative ;
- croix rouge : mini-évaluation, interrogation ou quiz ;
- triangle : CCF ou certificative ;
- carré blanc avec croix : classe absente ;
- carré blanc avec barre oblique : absence administrative.

Corrections associées :

- Un CCF n'est plus affiché comme simple évaluation sommative.
- Les mentions préparation, entraînement, révision ou correction du CCF ne déclenchent pas le marqueur CCF.
- Le triangle CCF utilise la couleur de la matière quand elle est connue.
- Les listes d'élèves sont retirées des tableaux, légendes, infobulles et exports.
- Les cours annulés, sorties pédagogiques et PFMP sont exclus de la planification ordinaire.

## 8. Phase 5 - Séquences

### Modèle

Une séquence possède :

- un nom ;
- une matière ;
- une couleur persistante ;
- un ensemble de séances affectées.

### Fonctions livrées

- Création d'une séquence.
- Renommage et modification.
- Suppression globale.
- Affectation à plusieurs carrés.
- Retrait d'affectation vers `Sans séquence`.
- Sélection de tous les carrés d'une séquence.
- Sélection par clic sur une pastille de légende.
- Couleur identique pour une même séquence dans différents groupes.
- Chargement d'un plan textuel et rapprochement par intervalle de dates.

### Évolution de la sélection

Le premier mécanisme reposait sur `Ctrl` + clic et était trop implicite. Il a été remplacé par :

- clic simple pour sélectionner ou désélectionner ;
- `Maj` + clic pour une plage chronologique ;
- double-clic pour ouvrir le détail ;
- compteur visible ;
- `Tout sélectionner` ;
- `Désélectionner`.

Une anomalie a aussi été corrigée : `Enregistrer` modifiait la définition de la séquence mais n'affectait qu'un seul cours. Les actions sont désormais nommées `Créer + affecter` et `Enregistrer + affecter`, et s'appliquent à toute la sélection.

## 9. Phase 6 - Attribution des matières

### Anomalie `_2CAPAS`

Symptôme : la planification ne montrait qu'une heure de Maths sur l'année.

Origine trouvée dans l'ICS Pronote :

```text
MATHS,PHYSIQ.-CHIMIE - _2CAP AS
```

Le détecteur reconnaissait `chimie` et classait immédiatement le cours en Sciences, sans utiliser la salle pour départager l'intitulé mixte.

### Correction

La priorité actuelle est :

1. type Co-intervention explicite ;
2. champ `Matière` de l'ICS ;
3. salle pour une matière mixte ;
4. titre et description ;
5. type général.

Règles de salle :

- Sciences, Physique, Chimie ou laboratoire : Sciences ;
- INFO, ORDI ou Maths : Maths.

### Vérification

Test sur le fichier Pronote réel :

- 43 séances actives `_2CAPAS` avec matière mixte ;
- 31 classées Maths ;
- 12 classées Sciences.

### Correction utilisateur

- Réattribution en masse des carrés sélectionnés.
- Choix `Automatique (ICS + salle)` pour effacer une ancienne correction.
- Correction individuelle dans le panneau Détails.
- Affichage de l'origine de l'attribution.
- Recalcul automatique au rendu lorsqu'aucune correction manuelle n'existe.

### Anomalie TAEPA

Symptôme : une colonne Sciences apparaissait pour TAEPA alors que cette classe n'a que des cours de Maths dans l'emploi du temps de l'enseignant.

Les 78 cours `MATHEMATIQUES - TAEPA` étaient correctement classés. Les faux cours de Sciences provenaient d'événements Agenda :

- inscription aux examens ;
- commission éducative ;
- CCF espagnol et CCF U2 ;
- oral UFSSS ;
- épreuve d'économie-gestion.

Deux causes générales ont été identifiées :

1. le motif scientifique `ions?` n'était pas encadré par des limites de mot et reconnaissait `inscription`, `commission`, `gestion` ou `évaluation` ;
2. une évaluation Agenda sans matière reconnue était admise dans la planification en raison de son seul type `evaluation`.

Corrections :

- tous les mots-clés pédagogiques utilisent maintenant des limites de mot ;
- les évaluations ICS sans domaine Maths, Sciences ou Co-intervention restent dans la Liste mais sont exclues de la planification ;
- une réattribution manuelle à une matière les rend de nouveau visibles ;
- les événements manuels de type évaluation restent autorisés dans la planification.

## 10. Phase 7 - Horaires, durées et doublons

### Anomalie signalée

Le premier comptage de septembre 2025 pour `1ASSP1 G1` annonçait seulement un nombre de lignes, sans restituer le volume pédagogique. La semaine du 8 au 12 septembre montrait pourtant trois créneaux représentant 3 h 30.

### Origine 1 - Fuseau horaire

Pronote exporte les horaires en UTC avec le suffixe `Z`. Le parseur supprimait ce suffixe puis construisait une date locale :

```text
DTSTART:20250908T125000Z
```

était affiché 12:50 au lieu de 14:50 à Paris.

Le parseur utilise maintenant `Date.UTC` pour les dates suffixées par `Z`. Le navigateur réalise ensuite la conversion vers l'heure locale.

### Origine 2 - Séances et heures

Une ligne ICS représente une séance, pas nécessairement une heure. Les créneaux Pronote observés sont notamment :

- 55 min, équivalent à 1 h pédagogique ;
- 85 ou 95 min, équivalent à 1 h 30 pédagogique.

La planification affiche maintenant :

- le nombre de séances ;
- le volume pédagogique normalisé ;
- la durée calendrier exacte entre parenthèses.

Pour `1ASSP1 G1`, semaine du 8 au 12 septembre 2025 :

- lundi 14:50-15:45 : 1 h pédagogique ;
- mardi 16:00-16:55 : 1 h pédagogique ;
- vendredi 08:00-09:25 : 1 h 30 pédagogique ;
- total : 3 h 30 pédagogiques, 3 h 15 calendrier.

Pour septembre 2025 :

- 14 lignes Pronote initiales ;
- 1 cours annulé retiré de la planification ;
- 13 séances affichées, soit 15 h pédagogiques ;
- 1 absence personnelle matérialisée par un carré ;
- 12 séances effectivement assurées, soit 14 h pédagogiques.

### Origine 3 - Doublons de remplacement

Pronote peut exporter deux événements au même horaire :

- cours maintenu et nouveau cours ;
- cours maintenu et CCF ;
- cours modifié et test de positionnement ;
- absence administrative et cours initial.

Une déduplication par classe ou groupe et heure de début a été ajoutée. La priorité est donnée à :

1. absence ou événement spécial ;
2. évaluation ou CCF ;
3. test de positionnement ;
4. cours ordinaire ;
5. cours maintenu ou modifié ;
6. événement portant seulement une liste d'élèves.

Après correction, aucun doublon de début ne subsiste dans les séances de planification du fichier testé.

### Audit de septembre 2025

Volumes affichés après correction :

| Classe ou groupe | Séances | Volume pédagogique | Durée calendrier | Matières |
|---|---:|---:|---:|---|
| `1AEPA` | 11 | 11 h | 10 h 05 | 8 Maths, 3 Co-intervention |
| `1ASSP1 G1` | 13 | 15 h | 13 h 55 | 9 Maths, 4 Sciences |
| `1ASSP1 G2` | 13 | 15 h | 14 h 35 | 9 Maths, 4 Sciences |
| `TAEPA` | 8 | 8 h | 7 h 20 | 8 Maths |
| `_1CAPAS` | 15 | 16 h 30 | 15 h 15 | 11 Maths, 2 Sciences, 2 Co-intervention |
| `_2CAPAS` | 14 | 16 h | 14 h 50 | 9 Maths, 1 Sciences, 4 Co-intervention |

Le fichier testé ne contient aucun cours `1ASSP2` en septembre 2025.

## 11. Persistance locale

Sont enregistrés dans `localStorage` :

- annotations des événements ;
- événements manuels ;
- séquences programmées ;
- métadonnées des séquences ;
- classe et groupe sélectionnés ;
- vue active ;
- zoom et orientation ;
- nombre de colonnes de la grille.

Conséquence : un rechargement de page conserve le travail, mais le changement de navigateur ou de profil ne transporte pas les données.

## 12. Export

### CSV

- Export des événements filtrés.
- Séparateur point-virgule.
- Champs de suivi et séquences inclus.
- Nettoyage des noms d'élèves.

### PDF

- Utilisation de l'impression du navigateur.
- Feuille A4 paysage par défaut.
- Conservation des couleurs et marqueurs.
- Masquage des panneaux de contrôle à l'impression.

## 13. Décisions de conception

- La planification privilégie la densité et la vision annuelle plutôt que la lecture des intitulés.
- Les intitulés complets restent accessibles au survol ou dans Détails.
- Les couleurs représentent les séquences, pas les groupes.
- Les colonnes représentent les matières en mode éclaté.
- Un cours incertain reste visible en Non classé au lieu d'être supprimé.
- Les corrections utilisateur priment sur la détection automatique jusqu'au choix explicite Automatique.
- Le jeu d'exemple n'est jamais chargé automatiquement.

## 14. État actuel

Fonctions opérationnelles :

- import ICS fichier, texte ou URL ;
- filtres classe et groupe ;
- vues Liste, Grille et Planification ;
- suivi local des séances ;
- ajout et correction d'événements ;
- sélection multiple ;
- gestion complète des séquences ;
- réattribution des matières ;
- repères mensuels ;
- export CSV et PDF.

## 15. Limites et travaux futurs

Priorités possibles :

- sauvegarde et restauration JSON de tout le plan annuel ;
- glisser-déposer d'une séquence sur une plage de cours ;
- diagnostic d'import détaillé par classe et par règle d'attribution ;
- gestion explicite des périodes sans cours, vacances, PFMP et examens ;
- fractionnement, fusion et réordonnancement des séquences ;
- traitement des chevauchements lors du rapprochement par dates ;
- tests automatisés permanents sur plusieurs variantes d'exports Pronote.

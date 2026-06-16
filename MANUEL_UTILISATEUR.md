# Manuel utilisateur - ICStracteur

![Aperçu de la vue Planification](./Screenshot01.png)

## 1. Objet de l'application

ICStracteur transforme un calendrier Pronote au format ICS en outil de suivi et de planification annuelle.

L'application permet notamment de :

- filtrer les cours par classe et groupe ;
- consulter les séances en liste, en grille ou en planification annuelle ;
- distinguer Maths, Sciences et Co-intervention ;
- construire des séquences et les affecter aux cours ;
- repérer les évaluations, CCF et absences ;
- suivre les séances faites, les documents distribués et les absents ;
- exporter les données en CSV ou la planification en PDF.

## 2. Démarrage

L'application fonctionne localement, sans installation :
Double-cliquez sur le fichier `index.html` de l'application pour l'ouvrir dans votre navigateur.

Les corrections et les séquences sont enregistrées dans le stockage local du navigateur.

## 3. Importer un calendrier

![Export Pronote](./Pronote-exportICal.png)

Trois méthodes sont disponibles :

1. `Importer un ICS` : choisir un fichier `.ics` exporté par Pronote.
2. `Charger une URL ICS` : saisir l'adresse d'un calendrier accessible en ligne.
3. `Importer le texte` : coller le contenu complet du fichier ICS.

Après un import réel, les anciens filtres de classe et de groupe sont réinitialisés, sauf si le calendrier ne contient qu'une seule classe reconnue.

Le bouton `Charger l'exemple` remplace temporairement les événements importés par un petit jeu de démonstration. Pour retrouver l'emploi du temps réel, importer de nouveau son fichier ICS.

## 4. Choisir une classe ou un groupe

Le menu `Classe` est limité aux classes prévues (ex: `1ASSP1`, `_1CAPAS`...).
Le menu `Classe / groupe` dépend de la classe choisie. Il permet d'afficher la classe entière ou un groupe détecté.

Une classe doit être choisie pour afficher la planification annuelle.

## 5. Les trois vues

### Vue Liste
La vue `Liste` sert au contrôle détaillé. Les cours sont triés chronologiquement avec les informations (salle, type, documents, etc.). Les actions rapides permettent d'ouvrir une séance, de la cocher comme faite et de signaler les documents distribués.

### Vue Grille
La vue `Grille` affiche les séances sous forme de cartes lisibles. Le champ `Colonnes grille` règle le nombre de colonnes.

### Vue Planification
Chaque petit carré représente une séance réelle :
- carré plein : séance passée ou cochée faite ;
- carré vide : séance à venir ;
- carré gris : aucune séquence affectée ;
- couleur du bord et du fond : séquence affectée.

Deux modes sont disponibles :
- `Mixte` : toutes les matières dans l'ordre chronologique ;
- `Par matière` : colonnes Maths, Sciences, Co-intervention et éventuellement Non classé.

## 6. Sélectionner des cours

Dans la planification :
- clic simple : sélectionner ou désélectionner un carré ;
- `Maj` + clic : sélectionner une plage chronologique depuis le dernier carré choisi ;
- double-clic : ouvrir la séance dans le panneau `Détails` ;
- `Tout sélectionner` / `Désélectionner` : gérer la sélection globale.

## 7. Catalogue des Séquences (Création)

L'encart **Catalogue des Séquences** permet de définir vos séquences :

- **Générer depuis dossier cours** : L'application scanne l'arborescence de vos cours sur votre disque et génère le catalogue automatiquement.
- **Séquence** : séquence existante à modifier ;
- **Nom**, **Matière**, **Couleur** ;
- Actions : `Créer`, `Enregistrer`, `Supprimer`.

## 8. Affectation (Planification)

L'encart **Affectation** sert à lier vos séances aux séquences du catalogue.

Pour affecter une séquence :
1. Sélectionnez les carrés dans le calendrier.
2. Choisissez la séquence voulue dans le menu déroulant `Séquence à affecter`.
3. Cliquez sur `Affecter`.

Le bouton `Retirer` remet les cours sélectionnés en `Sans séquence`.
Le bouton `Sélectionner séances` met en surbrillance toutes les séances actuellement rattachées à la séquence choisie.

## 9. Corriger la matière d'un cours

Pronote peut utiliser un intitulé commun. ICStracteur analyse alors le champ `Matière`, puis la salle.

### Correction en masse
1. Sélectionnez les carrés concernés.
2. Choisissez une valeur dans `Matière des cours sélectionnés` (dans la zone Affectation).
3. Cliquez sur `Réattribuer`.

Le choix `Automatique (ICS + salle)` supprime les corrections manuelles.

## 10. Évaluations et absences

Les marqueurs superposés aux carrés sont :
- point rouge : évaluation sommative ;
- croix rouge : mini-évaluation, interrogation ou quiz ;
- triangle : CCF ou évaluation certificative ;
- carré blanc barré d'une croix : classe absente ;
- carré blanc avec barre oblique : absence administrative.

## 11. Export PDF

![Aperçu de l'export PDF](./Screenshot02-pdf.png)

L'export PDF permet d'imprimer votre progression (vue Planification).

1. Choisissez la vue `Planification`.
2. Dans le panneau de gauche, réglez l'**Orientation (PDF)** (Portrait/Paysage) et le **Format (PDF)** (A4/A3).
3. Réglez le zoom.
4. Cliquez sur **Exporter PDF**.

La grille s'ajustera au mieux sur la page imprimée et évitera de couper les mois en deux pages distinctes.

## 12. Données conservées

Le navigateur conserve localement :
- les corrections et annotations ;
- les événements manuels ;
- les séquences (catalogue) ;
- les réglages d'affichage et options d'impression.

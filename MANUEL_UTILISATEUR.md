# Manuel utilisateur - ICStracteur

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

Ouvrir l'application dans un navigateur récent :

```text
http://127.0.0.1:4174/
```

L'application fonctionne localement. Les corrections et les séquences sont enregistrées dans le stockage local du navigateur.

## 3. Importer un calendrier

Trois méthodes sont disponibles :

1. `Importer un ICS` : choisir un fichier `.ics` exporté par Pronote.
2. `Charger une URL ICS` : saisir l'adresse d'un calendrier accessible en ligne.
3. `Importer le texte` : coller le contenu complet du fichier ICS.

Après un import réel, les anciens filtres de classe et de groupe sont réinitialisés, sauf si le calendrier ne contient qu'une seule classe reconnue.

Le bouton `Charger l'exemple` remplace temporairement les événements importés par un petit jeu de démonstration. Pour retrouver l'emploi du temps réel, importer de nouveau son fichier ICS.

## 4. Choisir une classe ou un groupe

Le menu `Classe` est limité aux classes prévues :

- `_1CAPAS` ;
- `_2CAPAS` ;
- `1ASSP1` ;
- `1ASSP2` ;
- `1AEPA` ;
- `TAEPA`.

Le menu `Classe / groupe` dépend de la classe choisie. Il permet d'afficher la classe entière ou un groupe détecté, par exemple `1ASSP1 G1` ou `1ASSP1 G2`.

Une classe doit être choisie pour afficher la planification annuelle.

## 5. Les trois vues

### Vue Liste

La vue `Liste` sert au contrôle détaillé. Les cours sont triés chronologiquement avec :

- date et heure ;
- salle ;
- classe ou groupe ;
- séquence extraite de Pronote ;
- séquence prévue ;
- type et marqueur d'évaluation ;
- état fait ;
- documents distribués ;
- absents.

Les actions rapides permettent d'ouvrir une séance, de la cocher comme faite et de signaler les documents distribués.

Les noms d'élèves présents dans certains intitulés Pronote, notamment les convocations de CCF, sont masqués dans les vues de lecture et dans l'export CSV.

### Vue Grille

La vue `Grille` affiche les séances sous forme de cartes lisibles. Le champ `Colonnes grille` règle le nombre de colonnes.

Cette vue convient à la lecture des intitulés. La planification annuelle se fait dans la vue suivante.

### Vue Planification

Chaque petit carré représente une séance réelle :

- carré plein : séance passée ou cochée faite ;
- carré vide : séance à venir ;
- carré gris : aucune séquence affectée ;
- couleur du bord et du fond : séquence affectée.

Les cours sont regroupés par mois dans des cartouches à filet discret.

Le nombre de carrés est un nombre de séances, pas un nombre d'heures. La ligne de statistiques affiche aussi :

- le volume pédagogique, avec les créneaux Pronote normalisés (55 min = 1 h, 85 min = 1 h 30) ;
- entre parenthèses, la durée calendrier exacte issue du fichier ICS.

Deux modes sont disponibles :

- `Mixte` : toutes les matières dans l'ordre chronologique ;
- `Par matière` : colonnes Maths, Sciences, Co-intervention et éventuellement Non classé.

Le curseur `Zoom` règle la taille des carrés. L'orientation Portrait ou Paysage est choisie dans le panneau gauche.

## 6. Sélectionner des cours

Dans la planification :

- clic simple : sélectionner ou désélectionner un carré ;
- `Maj` + clic : sélectionner une plage chronologique depuis le dernier carré choisi ;
- double-clic : ouvrir la séance dans le panneau `Détails` ;
- `Tout sélectionner` : sélectionner tous les cours actuellement visibles ;
- `Désélectionner` : vider la sélection.

Le compteur indique le nombre de cours sélectionnés.

En mode `Par matière`, une sélection avec `Maj` suit toujours l'ordre chronologique général. Elle peut donc traverser plusieurs matières.

Cliquer sur une pastille de la légende sélectionne tous les carrés affectés à cette séquence.

## 7. Créer et gérer les séquences

La zone `Gestion des séquences` contient :

- `Séquence` : séquence existante à modifier ;
- `Nom` : intitulé de la séquence ;
- `Matière` : Maths, Sciences, Co-intervention ou Non classé ;
- `Couleur` : couleur commune à tous les cours de la séquence.

Actions disponibles :

- `Créer + affecter` : créer la séquence et l'appliquer à tous les carrés sélectionnés ;
- `Enregistrer + affecter` : modifier ou renommer la séquence et l'appliquer à la sélection ;
- `Sélectionner` : sélectionner tous les cours déjà rattachés à cette séquence ;
- `Supprimer` : supprimer la définition et remettre ses cours en `Sans séquence`.

Deux groupes utilisant la même séquence partagent la même couleur.

## 8. Affectation rapide

Pour affecter une séquence existante :

1. sélectionner les carrés ;
2. choisir la séquence dans `Affecter la sélection` ;
3. cliquer sur `Affecter`.

Pour créer rapidement un nom de séquence, saisir son nom dans `Nouvelle séquence`, puis cliquer sur `Affecter`.

Le bouton `Retirer` remet les cours sélectionnés en `Sans séquence`.

## 9. Corriger la matière d'un cours

Pronote peut utiliser un intitulé commun, par exemple `MATHS,PHYSIQ.-CHIMIE`. ICStracteur analyse alors le champ `Matière`, puis la salle :

- salle de sciences ou laboratoire : Sciences ;
- salle informatique ou salle contenant `ORDI` : Maths.

### Correction en masse

1. sélectionner les carrés concernés ;
2. choisir une valeur dans `Matière des cours sélectionnés` ;
3. cliquer sur `Réattribuer`.

Le choix `Automatique (ICS + salle)` supprime les corrections manuelles de la sélection et relance le calcul automatique.

### Correction individuelle

1. double-cliquer sur un carré ;
2. modifier le champ `Matière` dans le panneau `Détails` ;
3. cliquer sur `Enregistrer`.

Le texte sous le champ indique l'origine de l'attribution : correction manuelle, champ Matière de l'ICS, salle ou intitulé.

## 10. Évaluations et absences

Les marqueurs superposés aux carrés sont :

- point rouge : évaluation sommative ;
- croix rouge : mini-évaluation, interrogation ou quiz ;
- triangle : CCF ou évaluation certificative ;
- carré blanc barré d'une croix : classe absente ;
- carré blanc avec barre oblique : absence administrative.

La couleur du triangle de CCF dépend de la matière détectée.

Une simple mention de préparation ou d'entraînement au CCF ne transforme pas la séance en CCF.

Les événements d'agenda d'autres disciplines, par exemple un CCF d'espagnol, restent consultables dans la Liste mais ne sont pas ajoutés à la planification Maths-Sciences tant qu'aucune matière ne leur est attribuée manuellement.

## 11. Ajouter ou modifier un événement

Le bouton `Ajouter un événement` permet de créer manuellement un cours, une évaluation, une PFMP ou un autre événement.

Le panneau `Détails` permet de modifier :

- titre, date et horaires ;
- salle et groupe ;
- séquence extraite et séquence prévue ;
- type et matière ;
- marqueur d'évaluation ;
- état fait ;
- documents distribués ;
- absents et notes.

Le bouton `Supprimer` retire l'événement de l'application. Pour un cours issu de l'ICS, un nouvel import du calendrier peut le faire réapparaître.

## 12. Charger un plan de séquences

La zone `Séquences programmées` accepte une ligne par séquence.

Format simple :

```text
Acide-base | 2026-09-01 | 2026-09-22
```

Format avec matière et nombre de séances :

```text
Oxydoréduction | sciences | 2026-09-29 | 2026-10-13 | 4 | note facultative
```

Actions :

- `Charger le plan` : enregistrer la liste des séquences ;
- `Rapprocher` : affecter aux cours la séquence dont l'intervalle contient leur date.

Une affectation manuelle déjà présente n'est pas remplacée par le rapprochement.

## 13. Légendes et statistiques

La légende des séquences affiche :

- la couleur ;
- le nom abrégé ;
- le nombre de séances.

Elle est redimensionnable verticalement. Une séance sans affectation apparaît dans `Sans séquence`.

La ligne de statistiques indique le nombre de séances, le volume pédagogique, la durée calendrier exacte, les séances passées ou faites, les séances à venir, les évaluations et la répartition par matière.

Les heures affichées sont converties depuis l'UTC du fichier Pronote vers l'heure locale du navigateur. Par exemple, `12:50Z` en septembre correspond à `14:50` à Paris.

Pronote peut exporter plusieurs versions d'un même créneau, par exemple un cours maintenu et un CCF de remplacement. ICStracteur ne conserve qu'un carré et privilégie l'événement le plus informatif : absence, évaluation, positionnement ou cours de remplacement.

## 14. Export

### CSV

`Exporter CSV` crée un fichier séparé par des points-virgules, exploitable dans un tableur.

### PDF

`Exporter PDF` ouvre l'impression du navigateur. Avant l'export :

1. choisir la classe ;
2. ouvrir `Planification` ;
3. choisir Mixte ou Par matière ;
4. régler le zoom et l'orientation ;
5. lancer l'export.

La feuille d'impression est préparée en A4 paysage par défaut.

## 15. Données conservées

Le navigateur conserve localement :

- les corrections et annotations ;
- les événements manuels ;
- les séquences programmées ;
- les couleurs et matières des séquences ;
- le dernier mode d'affichage et certains réglages.

Ces données ne sont pas intégrées au fichier ICS. Elles dépendent du navigateur et du profil utilisateur employés.

## 16. Limites actuelles

- Pas de glisser-déposer des séquences.
- Pas encore d'import/export JSON complet du plan annuel et des annotations.
- Le rapprochement par dates ne gère pas les chevauchements complexes entre séquences.
- Une matière mixte sans salle suffisamment explicite peut nécessiter une réattribution manuelle.
- Les événements d'agenda sans matière explicite sont volontairement exclus de la planification.
- La suppression d'un événement ICS n'est pas une modification du calendrier Pronote source.

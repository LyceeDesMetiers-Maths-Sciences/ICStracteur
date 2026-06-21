# Rapport de vérification des fichiers Markdown

Date de vérification : 2026-06-21

Objectif : signaler les coquilles et corruptions de texte repérées dans les fichiers `.md` sans modifier les sources, car une autre IA travaille en parallèle.

## Synthèse

- `README.md` : globalement propre, seulement quelques harmonisations typographiques possibles.
- `programme_maths_cap.md` : globalement exploitable, avec une zone mal découpée dans la partie `Automatismes`.
- `programme_maths_2nde.md` : plusieurs lignes corrompues.
- `programme_maths_1ere.md` : plusieurs lignes corrompues.
- `programme_maths_terminale.md` : plusieurs lignes corrompues.
- `programme_sciences_cap.md` : fichier fortement corrompu.
- `programme_sciences_2nde.md` : fichier fortement corrompu.
- `programme_sciences_1ere.md` : fichier partiellement corrompu avec doublons et fragments OCR.
- `programme_sciences_terminale.md` : fichier fortement corrompu.

## Détail par fichier

### `README.md`

Références :
- ligne 3
- lignes 11 à 17
- ligne 22

Remarques :
- `BacPro` pourrait être harmonisé en `Bac Pro`.
- `1ere` pourrait être harmonisé en `1re` si une normalisation typographique est souhaitée.
- Rien de structurellement cassé.

### `programme_maths_cap.md`

Référence :
- lignes 187 à 190

Remarques :
- Le point `À partir de la représentation graphique d’une fonction f...` a été éclaté sur plusieurs cases à cocher.
- Cela ressemble à une erreur de découpage plus qu’à une simple coquille.

### `programme_maths_2nde.md`

Références principales :
- ligne 10
- lignes 23 à 35
- lignes 57 à 72
- lignes 79 à 94
- ligne 107

Remarques :
- Présence de fragments OCR comme `Di`, `Vo`, `E`, `cabulaire`, `xpérience`, `Coe`, `fficients`.
- Plusieurs phrases sont tronquées ou réparties sur plusieurs puces.
- La structure du contenu reste partiellement reconnaissable, mais une simple correction orthographique ne suffira pas partout.

### `programme_maths_1ere.md`

Références principales :
- lignes 22 à 32
- ligne 43
- ligne 54
- lignes 117 à 122
- lignes 140 à 153

Remarques :
- Corruption visible dans `Probabilités`, `Suites numériques`, `Géométrie dans l’espace` et `Trigonométrie`.
- Exemples de fragments corrompus : `Événe`, `Proba événe`, `Sen`, `passa`, `cercl`, `cell`, `éométrique`, `adians`.
- Certaines lignes sont récupérables, d’autres nécessitent une reconstruction à partir d’une source fiable.

### `programme_maths_terminale.md`

Références principales :
- lignes 10 à 15
- lignes 37 à 45
- lignes 52 à 58
- lignes 77 à 82
- lignes 91 à 109
- lignes 136 à 151

Remarques :
- Corruption dans `Statistiques`, `Suites`, `Fonctions polynômes de degré 3`, `Calculs commerciaux`, `Vecteurs`, `Trigonométrie`, `Logarithme népérien`, `Nombres complexes`.
- Exemples de fragments corrompus : `s ajustement`, `justement`, `sitive`, `remier`, `Da`, `inusoïdale`, `logari`, `expone`, `galité`, `odule`.
- La partie `Nombres complexes` est particulièrement dégradée.

### `programme_sciences_cap.md`

Références principales :
- lignes 10 à 18
- lignes 25 à 32
- lignes 42 à 45
- lignes 52 à 60
- lignes 67 à 80
- lignes 87 à 104
- lignes 111 à 115

Remarques :
- Insertion de morceaux de titres de chapitres dans les listes.
- Très nombreux débuts et fins de mots manquants.
- Fragments typiques : `Sa`, `l’ét`, `Conn`, `exploi`, `proportio`, `transfert`, `signau`, `lum`, `Sav`.
- Le fichier doit être considéré comme fortement corrompu.

### `programme_sciences_2nde.md`

Références principales :
- lignes 10 à 18
- ligne 26
- lignes 51 à 62
- lignes 69 à 80
- lignes 88 à 102
- lignes 109 à 118

Remarques :
- Nombreuses insertions de texte parasite au milieu des puces.
- Fragments typiques : `d’ produit`, `l domestique`, `exploi`, `représ`, `sign`, `lu`, `ayonnement`, `nnaître`.
- Les modules `Chimie`, `Acoustique`, `Thermique` et `Optique` sont très dégradés.

### `programme_sciences_1ere.md`

Références principales :
- lignes 32 à 38
- lignes 45 à 50
- lignes 60 à 61
- lignes 68 à 69
- lignes 79 à 96
- lignes 106 à 108
- ligne 115
- ligne 142
- ligne 193
- ligne 216

Remarques :
- Le début du fichier est plutôt propre, puis apparaissent des doublons et des versions corrompues d’une même phrase.
- Exemples :
- répétition de blocs complets dans `Distinguer énergie et puissance électrique`;
- doublons dans `Transporter l’énergie sous forme électrique`;
- lignes parasites dans `Cinématique`, `Pression`, `Solutions aqueuses`;
- fragment résiduel `Utilisation d’un logiciel de géométrie dy`.
- Fichier partiellement récupérable par dédoublonnage et suppression des lignes OCR parasites.

### `programme_sciences_terminale.md`

Références principales :
- lignes 26 à 31
- lignes 38 à 39
- lignes 49 à 63
- lignes 69 à 75
- lignes 82 à 89
- lignes 96 à 101
- lignes 128 à 133
- lignes 162 à 168
- lignes 185 à 195
- lignes 217 à 220

Remarques :
- C’est le fichier le plus dégradé avec de nombreuses sections mélangées.
- Exemples :
- doublons incomplets puis doublons propres ;
- fusion de contenus sans rapport dans une même section ;
- fragments OCR massifs dans `Rayonnement thermique et effet de serre`, `Cinématique et dynamique`, `Caractériser la propagation d’un signal sonore`, `Atténuer une onde sonore par transmission`.
- Certaines sections de fin redeviennent propres, par exemple `Interpréter les indicateurs...`, `Déterminer l’action d’un détergent...`, `Exploiter des bio-ressources...`, `Étudier l’empreinte environnementale...`.

## Priorité de reprise conseillée

1. `programme_sciences_terminale.md`
2. `programme_sciences_2nde.md`
3. `programme_sciences_cap.md`
4. `programme_maths_terminale.md`
5. `programme_maths_1ere.md`
6. `programme_maths_2nde.md`
7. `programme_sciences_1ere.md`
8. `programme_maths_cap.md`
9. `README.md`

## Recommandation

Pour les fichiers de sciences CAP, 2nde et terminale, ainsi que maths 1ere et terminale, une relecture manuelle seule sera lente et peu fiable. Il vaut mieux comparer avec une source BO propre ou avec la version amont ayant servi à générer ces fichiers.

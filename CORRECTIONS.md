# Points à corriger - ICStracteur

Liste issue de l'analyse critique du code (`app.js`) et de la documentation.
Classée par priorité réelle : intégrité et confidentialité des données d'abord,
robustesse ensuite, confort en dernier.

## État des corrections

| Point | Sujet | État |
|---|---|---|
| 1.1 | Export/import JSON de tout l'état | **FAIT** |
| 1.2 | Clé d'identité déterministe (fin du `Math.random()`) | **FAIT** |
| 1.3 | Stabilité des UID au réimport | **FAIT** (clé de contenu) + vérif. empirique à faire |
| 2.1 | Purge des noms d'élèves à l'import | **FAIT** |
| 3.1 | Harnais de test sur l'attribution | **FAIT** (`test.mjs`, 22 assertions) |
| 4.1 | `detectType` forçant en `cours` | **FAIT** |
| 4.2 | Logique d'annulation dispersée | **NON FAIT** (volontaire, voir ci-dessous) |
| 4.3 | Domaine `ap` orphelin | **FAIT** |
| 4.4 | Déduplication trop agressive | **NON FAIT** (à surveiller, voir ci-dessous) |

Fichiers livrés : `app.js` (modifié), `index.html` (2 boutons ajoutés),
`test.mjs` (harnais, à lancer avec `node test.mjs`).

### Ce qui a été fait, en détail

- **1.1** Deux boutons dans la barre d'outils : « Sauvegarder (JSON) » exporte
  annotations + événements manuels + séquences + métadonnées + réglages dans un
  seul fichier ; « Restaurer (JSON) » réimporte (avec confirmation). C'est le
  filet de sécurité qui manquait : exporte régulièrement, et le fichier vit hors
  du navigateur.
- **1.2 / 1.3** `parseEvent` utilise l'UID Pronote quand il existe, sinon une
  clé `auto-<hash>` calculée sur le contenu stable (résumé, date, salle, groupe,
  classe). Réimporter le même ICS produit les mêmes clés : plus de perte
  silencieuse d'annotations. Les UID Pronote existants sont conservés tels quels,
  donc aucune annotation déjà stable n'est cassée. Reste à vérifier
  empiriquement que Pronote ne régénère pas ses UID en cours d'année (comparer
  deux exports espacés).
- **2.1** Les noms d'élèves sont purgés **avant** stockage : `summary`,
  `sequence` et `description` ne conservent que la version assainie ; les lignes
  structurantes de la description (Type, Matière, Groupe, Salle, Contenu prévu...)
  sont préservées. Le champ brut n'existe plus après l'import, donc l'export JSON
  n'embarque aucun nom.
- **3.1** `test.mjs` charge le vrai `app.js` (via `vm` avec stubs DOM) et teste
  les cas réels du JOURNAL : intitulé mixte `_2CAPAS` départagé par la salle,
  faux positifs d'agenda TAEPA (inscription, commission, oral, épreuve),
  limites de mots, clé déterministe, purge des noms.

### Ce qui n'a pas été fait, et pourquoi

- **4.2 (logique d'annulation dispersée).** Non corrigé volontairement.
  `eventCollisionPriority` et `isExcludedSummaryEvent` inspectent des champs
  légèrement différents. Les fusionner est une refacto cosmétique sur du code qui
  fonctionne, et la forcer maintenant ajouterait un risque de régression sur la
  déduplication sans gain de robustesse. À faire un jour au calme, avec des tests
  de non-régression dédiés.
- **4.4 (déduplication trop agressive).** Non corrigé : le cas (deux vrais cours
  distincts à la même heure pour la même classe entière) ne se produit pas dans
  l'emploi du temps actuel. Le corriger sans cas réel reviendrait à deviner. À
  surveiller : si un cours « disparaît » sans raison, c'est ici qu'il faut
  regarder (clé `scope|heure` dans `deduplicateEvents`).

---

## Priorité 1 - Intégrité des données (à faire avant la rentrée)

### 1.1 Aucune sauvegarde des annotations hors `localStorage`

**Problème.** Les annotations (fait, documents, séquence affectée, correction de
matière, absents, notes) sont la seule donnée irremplaçable de l'application :
l'ICS est régénérable depuis Pronote, pas elles. Or elles vivent uniquement dans
le `localStorage` d'un navigateur et d'un profil donnés.

`localStorage` survit à un redémarrage du navigateur ou de l'ordinateur. Il NE
survit PAS à :

- vider le cache / les données de navigation du site ;
- changer de navigateur ou de profil (Chrome != Firefox, perso != pro) ;
- changer d'ordinateur (poste maison != poste lycée) ;
- la navigation privée (effacée à la fermeture) ;
- certains nettoyages automatiques agressifs.

Il n'existe aujourd'hui aucune copie de secours et aucun moyen de restaurer.
La seule « stratégie » de sauvegarde est « ne toucher à rien ».

**Correction.** Ajouter un export et un import JSON de la totalité de l'état
persistant : `annotations`, `manual`, `plannedSequences`, `sequenceMeta`, et les
réglages d'affichage. Deux boutons dans la barre d'outils, réutilisant
`downloadBlob` déjà présent (ligne 1891) pour l'export et un `<input type=file>`
pour l'import.

### 1.2 `Math.random()` dans la clé d'identité d'un événement

**Problème.** `parseEvent`, ligne 267 :

```js
const uid = normalizeText(props.UID?.[0]?.value || `${summary}-${dtstart?.toISOString?.() || Math.random()}`);
```

Pour un VEVENT sans `UID`, la clé contient `Math.random()`. Comme `event.id`
sert de clé d'annotation dans `localStorage`, réimporter le *même* fichier ICS
attribue une clé différente à l'événement, qui **perd alors toutes ses
annotations** - silencieusement, sans message, sans redémarrage. Le carré
redevient vide.

**Correction.** Remplacer le fallback aléatoire par une clé déterministe basée
sur le contenu stable de l'événement, par exemple un hash de
`summary + dtstart + location + group`. Deux imports du même fichier doivent
produire la même clé.

### 1.3 Hypothèse non vérifiée : stabilité des UID Pronote dans le temps

**Problème.** L'application suppose que l'UID d'un cours reste identique d'un
export Pronote à l'autre sur l'année. Si Pronote régénère les UID lors d'un
déplacement, d'une modification ou d'une nouvelle version d'export, toutes les
annotations rattachées deviennent orphelines. Aucun test ne documente ce
comportement. Le risque se découvre typiquement en cours d'année, après des
mois de saisie.

**Correction.** Vérifier empiriquement la stabilité des UID en comparant deux
exports réels du même calendrier à quelques semaines d'intervalle. Si les UID ne
sont pas stables, baser l'identité sur le contenu (cf. 1.2) plutôt que sur l'UID.

---

## Priorité 2 - Confidentialité des données d'élèves (RGPD)

### 2.1 Noms d'élèves seulement masqués à l'affichage, jamais purgés

**Problème.** `removeTaggedStudentNames` (ligne 1519) et `sanitizeDisplayText`
(ligne 1504) nettoient les noms à l'affichage et à l'export CSV. Mais les noms
**bruts restent dans `event.summary` et `event.description`**, en mémoire et
dans `localStorage`. Conséquences :

- un futur export JSON (cf. 1.1) embarquerait les noms en clair ;
- les DevTools ou l'inspection du `localStorage` les exposent directement ;
- le masquage repose sur des regex de structure Pronote (ligne 1527 :
  `<...>` suivi d'un ou deux mots) qui laissent passer un nom à trois mots, un
  nom non balisé, ou une convocation formatée autrement.

Pour des données d'élèves mineurs, « nettoyer à la sortie » ne satisfait pas le
RGPD. L'écran a l'air propre alors que la donnée sensible est conservée.

**Correction.** À l'import, après extraction des champs utiles dans
`parseEvent`, écraser `summary` et `description` par leur version sanitizée
**avant tout stockage**. Le champ brut ne doit jamais être persisté. Conserver
au besoin uniquement les sous-champs utiles déjà extraits (séquence, salle,
classe, groupe).

---

## Priorité 3 - Robustesse de l'attribution des matières

### 3.1 Détection par mots-clés codés en dur, non testée en continu

**Problème.** L'historique (JOURNAL phases 6 et 9) montre une suite de
corrections réactives : `_2CAPAS` (chimie capté trop tôt), TAEPA (`ions?` sans
limite de mot captant `inscription`, `commission`, `gestion`). `detectDomainInText`
(ligne 471) est une longue liste de mots-clés avec une priorité à six niveaux
dans `detectDomain` (ligne 514). Chaque nouvel intitulé Pronote peut être mal
classé, et l'erreur ne se voit qu'à l'œil, sur un carré aberrant.

**Correction.** Constituer un jeu de fixtures à partir de VEVENT réels
représentatifs (mixte `MATHS,PHYSIQ.-CHIMIE`, agenda TAEPA, CCF, cours annulé,
co-intervention) et écrire une poignée d'assertions du type
`detectDomain(...) === 'maths'`. Une vingtaine de lignes suffisent à empêcher
toute régression future de cette fonction et à éviter de rejouer le bug
`_2CAPAS`.

---

## Priorité 4 - Points mineurs mais réels

### 4.1 `detectType` force certains événements en `cours`

Ligne 510 : tout texte contenant `sciences`/`physique`/`chimie`/`math` est
classé `cours`. Une réunion ou un bilan intitulé « bilan maths » devient un
cours. Couplé à `isExcludedSummaryEvent` (liste de chaînes), deux heuristiques
fragiles s'empilent.

### 4.2 Logique d'annulation dispersée

La décision « cet événement est annulé / spécial et sort de la planification »
est répartie sur au moins trois endroits : `deduplicateEvents` /
`eventCollisionPriority` (ligne 618), `isExcludedSummaryEvent` (ligne 1374) et
`specialEventMarker` (ligne 1465). Centraliser dans un seul prédicat
`eventStatus(event)` éviterait les divergences.

### 4.3 Domaine `ap` orphelin

`normalizeDomain` (ligne 459) peut renvoyer `ap`, mais `SUMMARY_DOMAINS`
(ligne 28) ne contient pas `ap`. Un cours classé `ap` disparaît de
`planningDomainStats` (ligne 917, `counts.get('ap')` vaut `undefined`) et de
l'affichage par matière. Soit la valeur est morte, soit c'est un trou. À
trancher : supprimer `ap` ou l'ajouter aux domaines gérés.

### 4.4 Déduplication potentiellement trop agressive

`deduplicateEvents` (ligne 609) utilise la clé `scope|dtstart.getTime()`. Deux
vrais cours distincts à la même heure pour la même classe entière (par exemple
une co-intervention assurée par deux intervenants) seraient fusionnés à tort.
Peu probable dans l'emploi du temps actuel, mais non garanti. À surveiller si un
cours « disparaît » sans raison.

---

## Ordre d'exécution conseillé

1. **Export/import JSON** (1.1) - le seul défaut qui peut effacer des mois de
   travail sans prévenir.
2. **Purge des noms d'élèves à l'import** (2.1) - conformité, et préalable
   indispensable avant d'activer l'export JSON.
3. **Clé d'identité déterministe** (1.2) + **vérification UID Pronote** (1.3) -
   pour que l'export/import et le réimport ICS ne perdent rien.
4. **Harnais de test sur l'attribution** (3.1) - tranquillité durable.
5. Points mineurs (4.x) au fil de l'eau.

Les fonctions de confort listées en section 15 du JOURNAL (glisser-déposer,
fusion de séquences, rapprochement par chevauchement) viennent **après** ces
points. Ce sont des améliorations visibles, mais elles ne touchent ni
l'intégrité ni la confidentialité des données.

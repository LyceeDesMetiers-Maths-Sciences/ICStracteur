# Prompt d’intégration `programmes.json` dans le module Séquences d’ICStracteur

Tu travailles sur l’application **ICStracteur**.

Objectif : intégrer la source locale `programmes.json` dans le **module Séquences** pour permettre à l’utilisateur de sélectionner un **niveau** et une **discipline**, puis de voir les **parties**, **modules**, **capacités** et **connaissances** du programme officiel correspondant, avec possibilité de cocher les éléments retenus dans la séquence.

## Fichier source à utiliser

Le fichier à lire est :

`/home/jeanpat/Documents/LycéePro/2026-2027/Projets/WebApp/ICStracteur 2026-06-17/BullOff/programmes.json`

## Structure du JSON

Le fichier a cette structure générale :

```json
{
  "schema_version": 2,
  "generated_from": "markdown",
  "description": "...",
  "programmes": [
    {
      "id": "programme_maths_2nde",
      "slug": "maths-2nde",
      "fichier_source": "programme_maths_2nde.md",
      "discipline": "Mathématiques",
      "discipline_code": "maths",
      "niveau": "2nde",
      "niveau_code": "2nde",
      "parties": [
        {
          "titre": "Statistique et probabilités",
          "slug": "statistique-et-probabilites",
          "modules": [
            {
              "titre": "Statistique à une variable",
              "slug": "statistique-a-une-variable",
              "capacites": [
                {
                  "id": "maths-2nde__statistique-et-probabilites__statistique-a-une-variable__capacite_001",
                  "type": "capacite",
                  "ordre": 1,
                  "texte": "Recueillir et organiser des données statistiques."
                }
              ],
              "connaissances": [
                {
                  "id": "maths-2nde__statistique-et-probabilites__statistique-a-une-variable__connaissance_001",
                  "type": "connaissance",
                  "ordre": 1,
                  "texte": "Regroupement par classes d’une série statistique."
                }
              ]
            }
          ]
        }
      ]
    }
  ],
  "index_items": [
    {
      "id": "...",
      "programme_slug": "maths-2nde",
      "discipline_code": "maths",
      "niveau_code": "2nde",
      "partie_slug": "...",
      "module_slug": "...",
      "module_titre": "...",
      "partie_titre": "...",
      "type": "capacite",
      "ordre": 1,
      "texte": "..."
    }
  ]
}
```

## Contraintes fonctionnelles

Implémente les comportements suivants dans le module **Séquences** :

1. L’utilisateur choisit un `niveau` et une `discipline`.
2. L’application retrouve le bon programme via `niveau_code` + `discipline_code`.
3. L’application affiche l’arborescence :
   - Partie
   - Module
   - Capacités
   - Connaissances
4. Chaque capacité et chaque connaissance peut être cochée ou décochée.
5. Les sélections doivent être stockées à partir des `id` stables des items, jamais à partir du texte libre.
6. Si un texte évolue plus tard mais que l’`id` reste stable, la séquence doit rester compatible.
7. L’UI doit supporter les programmes sans connaissances explicites sur un module.
8. L’ordre d’affichage doit respecter `ordre`.

## Contraintes techniques

1. Crée un petit service ou utilitaire dédié pour charger et interroger `programmes.json`.
2. Ne mélange pas la logique de parsing JSON avec le composant UI.
3. Prévois des types forts si le projet est en TypeScript.
4. Ajoute des helpers de ce type :
   - `getProgramme(disciplineCode, niveauCode)`
   - `getParties(programme)`
   - `flattenProgrammeItems(programme)`
   - `groupSelectedItemsByModule(programme, selectedIds)`
5. Stocke la sélection sous une forme compacte, par exemple :

```ts
selectedProgrammeItemIds: string[]
```

6. Si le projet a déjà un modèle de séquence, intègre cette donnée sans casser l’existant.
7. Si une migration de données est nécessaire, implémente-la proprement.

## UX attendue

Dans l’écran ou formulaire Séquences :

1. Ajouter ou brancher un sélecteur `Niveau`.
2. Ajouter ou brancher un sélecteur `Discipline`.
3. Afficher ensuite les parties et modules du programme correspondant.
4. Présenter les capacités et connaissances sous forme de checklist.
5. Permettre éventuellement le repli/dépli par partie ou module si cela améliore la lisibilité.
6. Afficher clairement s’il n’existe aucun programme pour une combinaison donnée.

## Résultat attendu

Je veux un changement de code complet, pas seulement une explication.

Le livrable doit inclure :

1. Le chargement du fichier `programmes.json`.
2. Les types/interfaces du programme.
3. L’intégration dans le module Séquences.
4. Le stockage des sélections via les `id`.
5. Les adaptations éventuelles du modèle de données.
6. Les tests utiles si le projet en comporte.

## Vérifications à faire

Avant de terminer :

1. Vérifier qu’une séquence avec `niveau = 2nde` et `discipline = maths` affiche bien les modules correspondants.
2. Vérifier que cocher des éléments enregistre bien leurs `id`.
3. Vérifier qu’au rechargement les éléments précédemment choisis restent cochés.
4. Vérifier qu’un changement de niveau ou discipline remplace correctement la vue du programme.
5. Vérifier qu’aucun texte n’est utilisé comme clé métier.

## Important

- Utilise **exclusivement** `programmes.json` comme source programme.
- N’essaie pas de parser les `.md` à l’exécution.
- Garde le code simple, lisible et maintenable.
- Si l’architecture existante du projet suggère une meilleure intégration que ce prompt, adapte-toi à l’existant tout en conservant les contraintes ci-dessus.

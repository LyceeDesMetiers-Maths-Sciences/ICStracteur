// Harnais de test minimal pour ICStracteur (point 3.1).
// On charge le vrai app.js dans un contexte vm avec des stubs DOM/localStorage
// suffisants, puis on teste les fonctions pures critiques sur des VEVENT réels.
import { readFileSync } from "node:fs";
import vm from "node:vm";

const source = readFileSync(new URL("./app.js", import.meta.url), "utf8");

// --- Stubs minimaux ---------------------------------------------------------
const noop = () => {};
function makeEl() {
  return new Proxy(
    {
      value: "",
      innerHTML: "",
      textContent: "",
      className: "",
      style: { setProperty: noop },
      dataset: {},
      classList: { toggle: noop, add: noop, remove: noop },
      files: [],
      checked: false,
      addEventListener: noop,
      querySelector: () => makeEl(),
      querySelectorAll: () => [],
      appendChild: noop,
      cloneNode: () => makeEl(),
      showModal: noop,
      close: noop,
      setAttribute: noop,
    },
    {
      get: (t, p) => {
        if (p in t) return t[p];
        if (p === "content") return { firstElementChild: makeEl() };
        if (p === "firstElementChild") return makeEl();
        return makeEl();
      },
    }
  );
}
const store = new Map();
const sandbox = {
  document: {
    getElementById: () => makeEl(),
    querySelector: () => makeEl(),
    createElement: () => makeEl(),
    createDocumentFragment: () => makeEl(),
  },
  localStorage: {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
  },
  window: { print: noop },
  alert: noop,
  confirm: () => true,
  fetch: noop,
  console,
  Intl,
  Date,
  Math,
  JSON,
  Set,
  Map,
  URL,
  Blob: class {},
  setTimeout,
  globalThis: {},
};
sandbox.globalThis = sandbox;
vm.createContext(sandbox);

// Empêche les appels top-level (bindEvents/render...) de tourner : on coupe le
// source juste avant cette section et on récupère le scope via un export manuel.
const cut = source.indexOf("\nbindEvents();");
const body = cut === -1 ? source : source.slice(0, cut);
const exposed = [
  "parseEvent",
  "parseIcs",
  "detectType",
  "detectDomain",
  "detectDomainInText",
  "stableEventKey",
  "sanitizeDisplayText",
  "sanitizePersistedDescription",
  "normalizeDomain",
];
const wrapped = `${body}\n;({ ${exposed.join(", ")} });`;
const api = vm.runInContext(wrapped, sandbox);

// --- Mini framework d'assertions -------------------------------------------
let passed = 0;
let failed = 0;
function check(name, cond) {
  if (cond) {
    passed++;
    console.log(`  ok   ${name}`);
  } else {
    failed++;
    console.log(`  FAIL ${name}`);
  }
}
function eq(name, got, want) {
  check(`${name} (= ${JSON.stringify(want)}, got ${JSON.stringify(got)})`, got === want);
}

// --- Fixtures inspirées des cas réels du JOURNAL ----------------------------
console.log("Attribution de matière (detectDomain) :");

// _2CAPAS : intitulé mixte, départagé par la salle (cf. JOURNAL phase 6).
eq(
  "MATHS,PHYSIQ.-CHIMIE en salle info -> maths",
  api.detectDomain("MATHS,PHYSIQ.-CHIMIE - _2CAP AS", "Matière : MATHS,PHYSIQ.-CHIMIE", "B12 INFO ORDI", "cours"),
  "maths"
);
eq(
  "MATHS,PHYSIQ.-CHIMIE en labo sciences -> sciences",
  api.detectDomain("MATHS,PHYSIQ.-CHIMIE - _2CAP AS", "Matière : MATHS,PHYSIQ.-CHIMIE", "E231 SCIENCES", "cours"),
  "sciences"
);

// Cours clairs.
eq("MATHEMATIQUES - TAEPA -> maths", api.detectDomain("MATHEMATIQUES - TAEPA", "", "B10", "cours"), "maths");
eq("Sciences physiques -> sciences", api.detectDomain("Sciences physiques", "", "E228", "cours"), "sciences");
eq("Co-intervention -> cointervention", api.detectDomain("Co-intervention", "", "", "cointervention"), "cointervention");

console.log("\nFaux positifs d'agenda (detectType) :");
// TAEPA : événements agenda qui ne doivent PAS devenir des cours (cf. phase 9).
eq("Inscription aux examens -> autre", api.detectType("Inscription aux examens", "", ""), "autre");
eq("Commission éducative -> autre", api.detectType("Commission éducative", "", ""), "autre");
eq("Oral UFSSS -> autre", api.detectType("Oral UFSSS", "", ""), "autre");
eq("Épreuve économie-gestion -> autre", api.detectType("Épreuve d'économie-gestion", "", ""), "autre");
// Un vrai cours de maths reste un cours.
eq("MATHEMATIQUES -> cours", api.detectType("MATHEMATIQUES - TAEPA", "Type : Cours", "B10"), "cours");
// CCF reste une évaluation.
eq("CCF espagnol -> evaluation", api.detectType("CCF espagnol", "", ""), "evaluation");

console.log("\nMots à limites (pas de capture parasite) :");
// 'ions' ne doit pas capter 'inscription'/'commission'/'gestion'.
eq("'inscription' ne déclenche pas sciences", api.detectDomainInText("inscription aux examens"), "autre");
eq("'gestion' ne déclenche pas sciences", api.detectDomainInText("economie gestion"), "autre");

console.log("\nClé déterministe (stableEventKey) :");
const ev1 = { summary: "Sciences - 1ASSP1 G1", dtstart: new Date(Date.UTC(2026, 8, 1, 6, 15)), location: "E231", group: "1ASSP1 G1", className: "1ASSP1" };
const ev1bis = { ...ev1 };
eq("même contenu -> même clé", api.stableEventKey(ev1), api.stableEventKey(ev1bis));
check("clé non vide", api.stableEventKey(ev1).length > 0);
const ev2 = { ...ev1, dtstart: new Date(Date.UTC(2026, 8, 8, 6, 15)) };
check("contenu différent -> clé différente", api.stableEventKey(ev1) !== api.stableEventKey(ev2));

console.log("\nIdentité ICS stable au réimport (parseEvent) :");
const icsSansUid = `BEGIN:VCALENDAR
BEGIN:VEVENT
DTSTART:20260901T081500
DTEND:20260901T091500
SUMMARY:Sciences - 1ASSP1 G1
LOCATION:E231 SCIENCES
DESCRIPTION:Contenu prévu : Acide-base\\nType : Cours\\nGroupe : [1ASSP1 G1]
END:VEVENT
END:VCALENDAR`;
const a = api.parseIcs(icsSansUid)[0];
const b = api.parseIcs(icsSansUid)[0];
eq("réimport sans UID -> même id", a.id, b.id);
check("id sans UID préfixé 'auto-'", a.id.startsWith("auto-"));

console.log("\nPurge des noms d'élèves (point 2.1) :");
const icsAvecNoms = `BEGIN:VCALENDAR
BEGIN:VEVENT
UID:ccf-1
DTSTART:20260901T081500
DTEND:20260901T091500
SUMMARY:CCF <1ASSP1> DUPONT Marie, MARTIN Lucas
LOCATION:E231
DESCRIPTION:Convocation <1ASSP1> DUPONT Marie\\nType : Évaluation
END:VEVENT
END:VCALENDAR`;
const c = api.parseIcs(icsAvecNoms)[0];
check("summary purgé ne contient pas 'DUPONT'", !c.summary.includes("DUPONT"));
check("summary purgé ne contient pas 'MARTIN'", !c.summary.includes("MARTIN"));
check("description purgée ne contient pas 'DUPONT'", !c.description.includes("DUPONT"));
check("ligne structurante 'Type :' conservée", c.description.includes("Type"));

console.log(`\n${passed} réussis, ${failed} échoués.`);
process.exit(failed ? 1 : 0);

const state = {
  sourceName: "demo",
  imported: [],
  manual: loadManualEvents(),
  plannedSequences: loadPlannedSequences(),
  sequenceMeta: loadSequenceMeta(),
  annotations: loadAnnotations(),
  filters: {
    className: localStorage.getItem("icstracteur.classFilter") || "",
    group: localStorage.getItem("icstracteur.groupFilter") || "",
    search: "",
    type: "",
    status: "",
  },
  viewMode: localStorage.getItem("icstracteur.viewMode") || "summary",
  gridColumns: Number(localStorage.getItem("icstracteur.gridColumns") || 4),
  summaryOrientation: localStorage.getItem("icstracteur.summaryOrientation") || "landscape",
  summaryMode: localStorage.getItem("icstracteur.summaryMode") || "mixed",
  summaryZoom: Number(localStorage.getItem("icstracteur.summaryZoom") || 14),
  selectedId: null,
  selectedSummaryIds: new Set(),
  selectedSequenceTitle: "",
  summaryEventOrder: [],
  summarySelectionAnchorId: "",
};

const CANONICAL_CLASSES = ["_1CAPAS", "_2CAPAS", "1ASSP1", "1ASSP2", "1AEPA", "TAEPA"];
const SUMMARY_DOMAINS = ["maths", "sciences", "cointervention", "autre"];
const SEQUENCE_COLORS = [
  "#2563eb",
  "#f97316",
  "#16a34a",
  "#8b5cf6",
  "#dc2626",
  "#0891b2",
  "#ca8a04",
  "#db2777",
  "#4f46e5",
  "#0f766e",
  "#9333ea",
  "#ea580c",
];

const els = {
  icsFile: document.getElementById("icsFile"),
  loadDemo: document.getElementById("loadDemo"),
  addManual: document.getElementById("addManual"),
  exportCsv: document.getElementById("exportCsv"),
  exportPdf: document.getElementById("exportPdf"),
  exportBackup: document.getElementById("exportBackup"),
  importBackup: document.getElementById("importBackup"),
  viewTable: document.getElementById("viewTable"),
  viewGrid: document.getElementById("viewGrid"),
  viewSummary: document.getElementById("viewSummary"),
  icsUrl: document.getElementById("icsUrl"),
  loadUrl: document.getElementById("loadUrl"),
  icsText: document.getElementById("icsText"),
  loadText: document.getElementById("loadText"),
  plannedText: document.getElementById("plannedText"),
  loadPlanned: document.getElementById("loadPlanned"),
  applyPlanned: document.getElementById("applyPlanned"),
  plannedList: document.getElementById("plannedList"),
  sequenceManagerSelect: document.getElementById("sequenceManagerSelect"),
  sequenceManagerTitle: document.getElementById("sequenceManagerTitle"),
  sequenceManagerDomain: document.getElementById("sequenceManagerDomain"),
  sequenceManagerColor: document.getElementById("sequenceManagerColor"),
  sequenceCreate: document.getElementById("sequenceCreate"),
  sequenceUpdate: document.getElementById("sequenceUpdate"),
  sequenceDelete: document.getElementById("sequenceDelete"),
  sequenceSelectSquares: document.getElementById("sequenceSelectSquares"),
  sequenceAssignSelect: document.getElementById("sequenceAssignSelect"),
  sequenceAssignName: document.getElementById("sequenceAssignName"),
  domainAssignSelect: document.getElementById("domainAssignSelect"),
  assignSelectedSequence: document.getElementById("assignSelectedSequence"),
  clearSelectedSequence: document.getElementById("clearSelectedSequence"),
  assignSelectedDomain: document.getElementById("assignSelectedDomain"),
  selectedCount: document.getElementById("selectedCount"),
  controlsTitle: document.getElementById("controlsTitle"),
  gridColumns: document.getElementById("gridColumns"),
  summaryOrientation: document.getElementById("summaryOrientation"),
  summaryMode: document.getElementById("summaryMode"),
  summaryModePanel: document.getElementById("summaryModePanel"),
  summaryZoom: document.getElementById("summaryZoom"),
  summaryZoomLabel: document.getElementById("summaryZoomLabel"),
  summarySelectionCount: document.getElementById("summarySelectionCount"),
  selectAllSummary: document.getElementById("selectAllSummary"),
  clearSummarySelection: document.getElementById("clearSummarySelection"),
  gridPanel: document.querySelector(".grid-panel"),
  gridWrap: document.getElementById("gridWrap"),
  tablePanel: document.querySelector(".table-panel"),
  summaryPanel: document.querySelector(".summary-panel"),
  summaryWrap: document.getElementById("summaryWrap"),
  summaryStats: document.getElementById("summaryStats"),
  classFilter: document.getElementById("classFilter"),
  groupFilter: document.getElementById("groupFilter"),
  searchInput: document.getElementById("searchInput"),
  typeFilter: document.getElementById("typeFilter"),
  statusFilter: document.getElementById("statusFilter"),
  rows: document.getElementById("rows"),
  stats: document.getElementById("stats"),
  rowTemplate: document.getElementById("rowTemplate"),
  details: document.getElementById("details"),
  detailForm: document.getElementById("detailForm"),
  deleteEvent: document.getElementById("deleteEvent"),
  manualDialog: document.getElementById("manualDialog"),
  manualForm: document.getElementById("manualForm"),
  closeManual: document.getElementById("closeManual"),
};

const detailFields = {
  id: document.getElementById("detailId"),
  title: document.getElementById("detailTitle"),
  date: document.getElementById("detailDate"),
  start: document.getElementById("detailStart"),
  end: document.getElementById("detailEnd"),
  room: document.getElementById("detailRoom"),
  group: document.getElementById("detailGroup"),
  sequence: document.getElementById("detailSequence"),
  plannedSequence: document.getElementById("detailPlannedSequence"),
  type: document.getElementById("detailType"),
  domain: document.getElementById("detailDomain"),
  domainOrigin: document.getElementById("detailDomainOrigin"),
  evaluation: document.getElementById("detailEvaluation"),
  done: document.getElementById("detailDone"),
  docs: document.getElementById("detailDocs"),
  absents: document.getElementById("detailAbsents"),
  notes: document.getElementById("detailNotes"),
};

const manualFields = {
  date: document.getElementById("manualDate"),
  start: document.getElementById("manualStart"),
  end: document.getElementById("manualEnd"),
  room: document.getElementById("manualRoom"),
  group: document.getElementById("manualGroup"),
  title: document.getElementById("manualTitle"),
  plannedSequence: document.getElementById("manualPlannedSequence"),
  type: document.getElementById("manualType"),
  sequence: document.getElementById("manualSequence"),
  notes: document.getElementById("manualNotes"),
  evaluation: document.getElementById("manualEvaluation"),
  done: document.getElementById("manualDone"),
  docs: document.getElementById("manualDocs"),
  absents: document.getElementById("manualAbsents"),
};

function loadAnnotations() {
  try {
    return JSON.parse(localStorage.getItem("icstracteur.annotations") || "{}");
  } catch {
    return {};
  }
}

function saveAnnotations() {
  localStorage.setItem("icstracteur.annotations", JSON.stringify(state.annotations));
}

function loadManualEvents() {
  try {
    return JSON.parse(localStorage.getItem("icstracteur.manual") || "[]").map((event) => ({
      ...event,
      dtstart: event.dtstart ? new Date(event.dtstart) : null,
      dtend: event.dtend ? new Date(event.dtend) : null,
    }));
  } catch {
    return [];
  }
}

function saveManualEvents() {
  const payload = state.manual.map((event) => ({
    ...event,
    dtstart: event.dtstart ? event.dtstart.toISOString() : null,
    dtend: event.dtend ? event.dtend.toISOString() : null,
  }));
  localStorage.setItem("icstracteur.manual", JSON.stringify(payload));
}

function loadPlannedSequences() {
  try {
    return JSON.parse(localStorage.getItem("icstracteur.plannedSequences") || "[]").map((seq) => ({
      ...seq,
      start: seq.start ? new Date(seq.start) : null,
      end: seq.end ? new Date(seq.end) : null,
    }));
  } catch {
    return [];
  }
}

function savePlannedSequences() {
  const payload = state.plannedSequences.map((seq) => ({
    ...seq,
    start: seq.start ? seq.start.toISOString() : null,
    end: seq.end ? seq.end.toISOString() : null,
  }));
  localStorage.setItem("icstracteur.plannedSequences", JSON.stringify(payload));
}

function loadSequenceMeta() {
  try {
    return JSON.parse(localStorage.getItem("icstracteur.sequenceMeta") || "{}");
  } catch {
    return {};
  }
}

function saveSequenceMeta() {
  localStorage.setItem("icstracteur.sequenceMeta", JSON.stringify(state.sequenceMeta));
}

function normalizeText(value) {
  return String(value || "")
    .replace(/\\n/g, "\n")
    .replace(/\\,/g, ",")
    .replace(/\\;/g, ";")
    .replace(/\\\\/g, "\\")
    .trim();
}

function unfoldIcs(text) {
  return String(text || "").replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n").reduce((lines, line) => {
    if (/^[ \t]/.test(line) && lines.length) {
      lines[lines.length - 1] += line.slice(1);
    } else {
      lines.push(line);
    }
    return lines;
  }, []);
}

function parseIcs(text) {
  const lines = unfoldIcs(text);
  const events = [];
  let current = null;
  for (const line of lines) {
    if (line === "BEGIN:VEVENT") {
      current = [];
      continue;
    }
    if (line === "END:VEVENT") {
      if (current) events.push(parseEvent(current));
      current = null;
      continue;
    }
    if (current) current.push(line);
  }
  return events.filter(Boolean);
}

function parseEvent(lines) {
  const props = {};
  for (const line of lines) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const left = line.slice(0, idx);
    const right = line.slice(idx + 1);
    const [name, ...params] = left.split(";");
    const key = name.toUpperCase();
    if (!props[key]) props[key] = [];
    props[key].push({ params, value: right });
  }
  const dtstart = parseDateProp(props.DTSTART?.[0]);
  const dtend = parseDateProp(props.DTEND?.[0]);
  // Contenu BRUT : sert uniquement à l'extraction et au calcul de la clé.
  // Il n'est jamais conservé dans l'objet retourné (cf. purge plus bas).
  const rawSummary = normalizeText(props.SUMMARY?.[0]?.value || "");
  const rawDescription = normalizeText(props.DESCRIPTION?.[0]?.value || "");
  const location = normalizeText(props.LOCATION?.[0]?.value || "");
  const rawUid = normalizeText(props.UID?.[0]?.value || "");

  // Extraction sur le contenu brut (les noms d'élèves n'altèrent pas ces champs).
  const type = detectType(rawSummary, rawDescription, location);
  const domain = detectDomain(rawSummary, rawDescription, location, type);
  const className = extractClassName(rawSummary, rawDescription);
  const group = extractGroup(rawSummary, rawDescription, className);
  const sequence = extractSequence(rawSummary, rawDescription);

  // Clé d'identité. On privilégie l'UID Pronote s'il existe ; sinon on calcule
  // une clé DÉTERMINISTE à partir du contenu stable. Plus de Math.random() :
  // réimporter le même fichier produit la même clé, donc les annotations sont
  // conservées (cf. points 1.2 et 1.3 de CORRECTIONS.md).
  const contentKey = stableEventKey({ summary: rawSummary, dtstart, location, group, className });
  const uid = rawUid || `auto-${contentKey}`;

  // Purge des noms d'élèves AVANT stockage : les champs persistés ne contiennent
  // que la version assainie (cf. point 2.1). Le contenu brut n'existe plus après
  // cette fonction.
  const summary = sanitizeDisplayText(rawSummary);
  const description = sanitizePersistedDescription(rawDescription);

  return {
    id: uid,
    source: "ics",
    uid,
    summary,
    description,
    location,
    dtstart,
    dtend,
    type,
    domain,
    className,
    group,
    sequence: sanitizeDisplayText(sequence),
  };
}

// Clé déterministe basée sur le contenu stable d'un événement.
// Calculée sur le SUMMARY brut (avant purge) pour rester identique d'un import
// à l'autre, indépendamment de la présence ou non d'un UID Pronote.
function stableEventKey({ summary, dtstart, location, group, className }) {
  const basis = [
    String(summary || ""),
    dtstart?.toISOString?.() || "",
    String(location || ""),
    String(group || ""),
    String(className || ""),
  ].join("|");
  let hash = 0;
  for (let i = 0; i < basis.length; i++) {
    hash = ((hash << 5) - hash + basis.charCodeAt(i)) | 0;
  }
  return (hash >>> 0).toString(36);
}

// Purge des noms d'élèves dans la DESCRIPTION conservée. On garde les lignes
// structurantes (Contenu prévu, Type, Matière, Groupe, Salle...) qui ne portent
// pas de données nominatives, et on assainit le reste ligne par ligne.
function sanitizePersistedDescription(description) {
  const keepPrefixes = /^(contenu prévu|contenu prevu|séquence|sequence|séance|seance|type|mati[eè]re|professeur|groupe|groupes|classe|classes|salle|salles)\s*:/i;
  return String(description || "")
    .split("\n")
    .map((line) => {
      const trimmed = line.trim();
      if (!trimmed) return "";
      if (keepPrefixes.test(trimmed)) return trimmed;
      return sanitizeDisplayText(trimmed);
    })
    .filter(Boolean)
    .join("\n");
}

function parseDateProp(entry) {
  if (!entry) return null;
  const raw = entry.value.trim();
  const isDateOnly = entry.params.some((p) => /VALUE=DATE/i.test(p)) || /^\d{8}$/.test(raw);
  if (isDateOnly) {
    const y = Number(raw.slice(0, 4));
    const m = Number(raw.slice(4, 6)) - 1;
    const d = Number(raw.slice(6, 8));
    return new Date(y, m, d, 0, 0, 0, 0);
  }
  const isUtc = /Z$/i.test(raw);
  const clean = raw.replace(/Z$/i, "");
  const year = Number(clean.slice(0, 4));
  const month = Number(clean.slice(4, 6)) - 1;
  const day = Number(clean.slice(6, 8));
  const hour = Number(clean.slice(9, 11));
  const minute = Number(clean.slice(11, 13));
  const second = Number(clean.slice(13, 15) || 0);
  if (isUtc) return new Date(Date.UTC(year, month, day, hour, minute, second, 0));
  return new Date(year, month, day, hour, minute, second, 0);
}

function extractGroup(summary, description, className = "") {
  const text = `${summary}\n${description}`;
  const patterns = [
    /Groupe\s*:\s*\[?([^\]\n<]+)\]?/i,
    /Groupes?\s*:\s*([^\n<]+)/i,
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return normalizeGroupName(match[1], className);
  }
  return className || "";
}

function extractClassName(summary, description) {
  const text = `${summary}\n${description}`;
  return canonicalClassFromText(text);
}

function canonicalClassFromText(value) {
  const normalized = normalizeText(value).toUpperCase().replace(/\s+/g, "");
  const compact = normalized.replace(/[^A-Z0-9]/g, "");
  for (const className of CANONICAL_CLASSES) {
    if (normalized.includes(className)) return className;
  }
  if (compact.includes("1CAPAS") || compact.includes("1CAPA")) return "_1CAPAS";
  if (compact.includes("2CAPAS") || compact.includes("2CAPA")) return "_2CAPAS";
  return "";
}

function normalizeGroupName(value, className = "") {
  const raw = normalizeText(value).replace(/\s+/g, " ").trim();
  const canonical = canonicalClassFromText(raw) || className;
  const compact = raw.toUpperCase().replace(/\s+/g, "");
  const canonicalCompact = canonical.replace(/\s+/g, "");
  const groupMatch = compact.match(/(?:GROUPE|GR|G)([12AB])$/);
  if (canonical && groupMatch) return `${canonical} G${groupMatch[1]}`;
  if (canonical && compact.includes(`${canonicalCompact}G1`)) return `${canonical} G1`;
  if (canonical && compact.includes(`${canonicalCompact}G2`)) return `${canonical} G2`;
  if (canonical && compact.includes(`${canonicalCompact}GA`)) return `${canonical} GA`;
  if (canonical && compact.includes(`${canonicalCompact}GB`)) return `${canonical} GB`;
  if (canonical && compact === canonicalCompact) return canonical;
  return raw || canonical;
}

function extractSequence(summary, description) {
  const lines = String(description || "").split("\n");
  const markers = [
    "Contenu prévu :",
    "Séquence :",
    "Sequence :",
    "Séance :",
  ];
  for (let i = 0; i < lines.length; i++) {
    const current = lines[i].trim();
    for (const marker of markers) {
      if (current.toLowerCase().startsWith(marker.toLowerCase())) {
        const pieces = [current.slice(marker.length).trim()];
        for (let j = i + 1; j < lines.length; j++) {
          const next = lines[j].trim();
          if (/^(Type|Matière|Professeur|Groupe|Groupes|Classe|Classes|Salle|Salles)\s*:/i.test(next)) break;
          if (next) pieces.push(next);
        }
        const candidate = pieces.join("\n").trim();
        if (candidate) return candidate;
      }
    }
  }
  return normalizeText(summary);
}

function parsePlannedSequences(text) {
  return String(text || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const parts = line.split("|").map((part) => part.trim());
      const title = parts[0] || `Séquence ${index + 1}`;
      const second = parts[1] || "";
      const third = parts[2] || "";
      const fourth = parts[3] || "";
      const fifth = parts[4] || "";
      const sixth = parts[5] || "";
      let domain = normalizeDomain(title);
      let start = null;
      let end = null;
      let slots = null;
      let note = "";

      if (parts.length === 3) {
        start = parseDateOnly(second);
        end = parseDateOnly(third);
      } else if (parts.length === 4 && parseDateOnly(second) !== null) {
        start = parseDateOnly(second);
        end = parseDateOnly(third);
        note = fourth || "";
      } else if (parts.length >= 4) {
        domain = normalizeDomain(second || title);
        start = parseDateOnly(third);
        end = parseDateOnly(fourth);
        slots = parts.length >= 5 ? parseInt(fifth, 10) || null : null;
        note = sixth || "";
      }
      return {
        id: `planned-${index + 1}`,
        title: title || `Séquence ${index + 1}`,
        domain,
        start,
        end,
        slots,
        note,
      };
    });
}

function parseDateOnly(value) {
  const match = String(value || "").match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]), 0, 0, 0, 0);
}

function findPlannedSequenceForEvent(event) {
  const date = event.dtstart;
  if (!date) return "";
  const match = state.plannedSequences.find((seq) => {
    if (seq.start && date < seq.start) return false;
    if (seq.end && date > seq.end) return false;
    return true;
  });
  return match ? match.title : "";
}

function renderPlannedSequences() {
  if (!els.plannedList) return;
  if (!state.plannedSequences.length) {
    els.plannedList.innerHTML = "<div>Aucune séquence programmée chargée.</div>";
    return;
  }
  els.plannedList.innerHTML = state.plannedSequences
    .map((seq) => {
      const dates = `${seq.start ? formatDate(seq.start) : "..." } → ${seq.end ? formatDate(seq.end) : "..."}`;
      const right = [dates, seq.domain ? seq.domain : "", seq.slots ? `${seq.slots} séances` : ""].filter(Boolean).join(" · ");
      return `<div class="planned-item"><span>${escapeHtml(seq.title)}</span><span>${escapeHtml(right)}</span></div>`;
    })
    .join("");
}

function normalizeDomain(value) {
  const text = String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  if (/co\s*-?\s*inter/.test(text) || text.includes("cointervention")) return "cointervention";
  if (detectDomainInText(text) === "maths") return "maths";
  if (detectDomainInText(text) === "sciences") return "sciences";
  // 'ap' (accompagnement personnalisé) n'est pas un domaine de planification
  // géré dans SUMMARY_DOMAINS. On le classe en 'autre' pour qu'un tel cours
  // reste comptabilisé et affiché au lieu de disparaître (cf. point 4.3).
  return "autre";
}

function detectDomainInText(value) {
  const text = String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  if (/co\s*-?\s*inter/.test(text) || text.includes("cointervention")) return "cointervention";
  const hasMath = /\b(?:maths?|mathematiques?)\b/.test(text);
  const hasScience = /\b(?:sciences?|physiq(?:ue)?|chimie|phy|pc)\b/.test(text);
  if (hasMath && hasScience) return "ambiguous";
  const strongScience = /\b(?:physiq(?:ue)?|chimie|ions?|conductimetrie|acides?|bases?|oxydoreduction|tension|intensite|ph)\b/.test(text);
  const strongMath = /\b(?:calculs?|nombres?|numerique|fonctions?|equations?|proportions?|pourcentages?|statistiques?|probabilites?|geometrie|aires?|perimetres?|volumes?|tableur|graphiques?|echelle|reperes?|trigonometrie|pythagore|thales)\b/.test(text);
  if (strongScience && !strongMath) return "sciences";
  if (strongMath && !strongScience) return "maths";
  if (hasMath) return "maths";
  if (hasScience) return "sciences";
  return "autre";
}

function extractIcsSubject(description) {
  const match = normalizeText(description).match(/(?:^|\n)Mati[eè]re\s*:\s*([^\n]+)/i);
  return normalizeText(match?.[1] || "");
}

function detectDomainFromLocation(location) {
  const text = String(location || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  if (/sciences?|physiq|chimie|labo/.test(text)) return "sciences";
  if (/info|ordi|math/.test(text)) return "maths";
  return "autre";
}

function detectType(summary, description, location) {
  const text = `${summary}\n${description}\n${location}`.toLowerCase();
  if (text.includes("pfmp") || text.includes("en entreprise")) return "pfmp";
  if (text.includes("évaluation") || text.includes("evaluation") || text.includes("ccf")) return "evaluation";
  if (text.includes("cointer") || text.includes("co-inter") || text.includes("co intervention")) return "cointervention";
  if (/\bcours\b/.test(text)) return "cours";
  // Un événement d'agenda (réunion, commission, conseil, convocation, oral...)
  // ne doit pas devenir un cours simplement parce qu'il mentionne une matière
  // (cf. point 4.1). On l'écarte explicitement avant la règle de repli.
  const agendaMarker = /\b(reunion|réunion|commission|conseil|convocation|oral|inscription|jury|bilan|brevet|examen|epreuve|épreuve|formation|stage|sortie)\b/i;
  if (agendaMarker.test(text)) return "autre";
  if (text.includes("sciences") || text.includes("physique") || text.includes("chimie") || text.includes("math")) return "cours";
  return "autre";
}

function detectDomain(summary, description, location, type) {
  if (type === "cointervention") return "cointervention";
  const subjectDomain = detectDomainInText(extractIcsSubject(description));
  if (subjectDomain !== "autre" && subjectDomain !== "ambiguous") return subjectDomain;
  const locationDomain = detectDomainFromLocation(location);
  if (subjectDomain === "ambiguous" && locationDomain !== "autre") return locationDomain;
  const summaryDomain = detectDomainInText(summary);
  if (summaryDomain !== "autre" && summaryDomain !== "ambiguous") return summaryDomain;
  const descriptionDomain = detectDomainInText(description);
  if (descriptionDomain !== "autre" && descriptionDomain !== "ambiguous") return descriptionDomain;
  if ((summaryDomain === "ambiguous" || descriptionDomain === "ambiguous") && locationDomain !== "autre") {
    return locationDomain;
  }
  if (summaryDomain === "ambiguous") {
    const text = String(summary || "").toLowerCase();
    const mathIndex = text.search(/math|mathematiques?|maths/);
    const scienceIndex = text.search(/science|physiq|chimie/);
    if (mathIndex !== -1 && (scienceIndex === -1 || mathIndex <= scienceIndex)) return "maths";
    return "sciences";
  }
  if (locationDomain !== "autre" && locationDomain !== "ambiguous") return locationDomain;
  return normalizeDomain(type);
}

function domainOrigin(event) {
  const annotation = state.annotations[eventKey(event)] || {};
  if (Object.hasOwn(annotation, "domain")) return "Attribution manuelle";
  const subject = extractIcsSubject(event.description || "");
  const subjectDomain = detectDomainInText(subject);
  if (subjectDomain === "ambiguous") {
    const roomDomain = detectDomainFromLocation(event.location || event.room || "");
    if (roomDomain !== "autre") return `Matière ICS mixte, départagée par la salle ${event.location || event.room}`;
    return "Matière ICS mixte, attribution automatique par défaut";
  }
  if (subjectDomain !== "autre") return `Champ Matière de l’ICS : ${subject}`;
  const roomDomain = detectDomainFromLocation(event.location || event.room || "");
  if (roomDomain !== "autre") return `Déduite de la salle ${event.location || event.room}`;
  return "Déduite automatiquement de l’intitulé";
}

function eventKey(event) {
  return event.id;
}

function mergedEvent(event) {
  const a = state.annotations[eventKey(event)] || {};
  const dtstart = a.manualDate && a.manualStart ? buildDate(a.manualDate, a.manualStart) : event.dtstart;
  const dtend = a.manualDate && a.manualEnd ? buildDate(a.manualDate, a.manualEnd) : event.dtend;
  const planned = a.plannedSequence || event.plannedSequence || findPlannedSequenceForEvent({ ...event, dtstart, dtend });
  const rawTitle = a.title || event.summary || "";
  const rawClass = a.className || event.className || "";
  const rawGroup = a.group || event.group || "";
  const className = canonicalClassFromText(`${rawClass}\n${rawGroup}\n${rawTitle}\n${event.description || ""}`);
  const group = normalizeGroupName(rawGroup || className, className);
  const type = a.type || event.type || "autre";
  const domain = Object.hasOwn(a, "domain")
    ? a.domain
    : detectDomain(rawTitle, event.description || "", event.location || "", type);
  return {
    ...event,
    dtstart,
    dtend,
    title: rawTitle,
    room: a.room || event.location || "",
    className,
    group,
    sequence: a.sequence || event.sequence || "",
    plannedSequence: planned || "",
    type,
    domain,
    evaluation: Boolean(a.evaluation),
    done: Boolean(a.done),
    docs: Boolean(a.docs),
    absents: a.absents || "",
    notes: a.notes || "",
    manualDate: a.manualDate || null,
    manualStart: a.manualStart || null,
    manualEnd: a.manualEnd || null,
  };
}

function allEvents() {
  const events = [...state.imported, ...state.manual].map(mergedEvent);
  return deduplicateEvents(events)
    .sort((a, b) => (a.dtstart?.getTime?.() || 0) - (b.dtstart?.getTime?.() || 0));
}

function deduplicateEvents(events) {
  const bySlot = new Map();
  for (const event of events) {
    if (event.source === "manual" || !event.dtstart) {
      bySlot.set(`unique:${event.id}`, event);
      continue;
    }
    const scope = event.group || event.className || canonicalClassFromText(`${event.summary}\n${event.description}`);
    const key = `${scope}|${event.dtstart.getTime()}`;
    const current = bySlot.get(key);
    if (!current || eventCollisionPriority(event) > eventCollisionPriority(current)) {
      bySlot.set(key, event);
    }
  }
  return Array.from(bySlot.values());
}

function eventCollisionPriority(event) {
  const text = normalizeText(`${event.title || event.summary}\n${event.description}`).toLowerCase();
  if (/cours annul[eé]|sortie p[eé]dagogique/.test(text)) return 0;
  if (specialEventMarker(event)) return 100;
  if (evaluationMarker(event)) return 90;
  if (/test\s+positionnement|positionnement/.test(text)) return 80;
  if (/<\s*inactive\s*>/i.test(text) || /<[^>]+>\s*[^,\n]+/.test(text)) return 30;
  if (/cours modifi[eé]/.test(text)) return 40;
  if (/cours maintenu/.test(text)) return 50;
  return 60;
}

function formatDate(date) {
  if (!date) return "";
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function formatTime(date) {
  if (!date) return "";
  return new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function localDateParts(date) {
  if (!date) return { y: "", m: "", d: "", h: "", min: "" };
  return {
    y: String(date.getFullYear()).padStart(4, "0"),
    m: String(date.getMonth() + 1).padStart(2, "0"),
    d: String(date.getDate()).padStart(2, "0"),
    h: String(date.getHours()).padStart(2, "0"),
    min: String(date.getMinutes()).padStart(2, "0"),
  };
}

function updateFilters() {
  const events = allEvents();
  const classes = CANONICAL_CLASSES;
  const activeClasses = activeCanonicalClasses(events);
  const currentClass = state.filters.className || els.classFilter.value || "";
  const currentGroup = state.filters.group || els.groupFilter.value || "";
  const classOptions = ["<option value=\"\">Toutes les classes</option>"]
    .concat(classes.map((className) => `<option value="${escapeHtml(className)}">${escapeHtml(className)}</option>`));
  els.classFilter.innerHTML = classOptions.join("");
  if (currentClass && classes.includes(currentClass) && (!activeClasses.length || activeClasses.includes(currentClass))) {
    els.classFilter.value = currentClass;
  } else {
    els.classFilter.value = "";
  }

  const selectedClass = els.classFilter.value || "";
  const groupScope = selectedClass
    ? events.filter((event) => event.className === selectedClass || event.group.startsWith(selectedClass))
    : events;
  const groups = Array.from(new Set(groupScope
    .map((event) => event.group || event.className)
    .filter(Boolean)
    .filter((group) => !selectedClass || group === selectedClass || group.startsWith(`${selectedClass} `))))
    .sort((a, b) => a.localeCompare(b, "fr"));
  const options = ["<option value=\"\">Tous les groupes</option>"]
    .concat(groups.map((group) => `<option value="${escapeHtml(group)}">${escapeHtml(group)}</option>`));
  els.groupFilter.innerHTML = options.join("");
  if (groups.includes(currentGroup)) els.groupFilter.value = currentGroup;
  else els.groupFilter.value = "";
  state.filters.className = els.classFilter.value || "";
  state.filters.group = els.groupFilter.value || "";
  localStorage.setItem("icstracteur.classFilter", state.filters.className);
  localStorage.setItem("icstracteur.groupFilter", state.filters.group);
  renderPlannedSequences();
}

function activeCanonicalClasses(events) {
  const active = new Set();
  for (const event of events) {
    for (const className of CANONICAL_CLASSES) {
      if (eventBelongsToClass(event, className)) active.add(className);
    }
  }
  return Array.from(active);
}

function reconcileFiltersAfterImport(preferredClass = "", keepCurrent = false) {
  const activeClasses = activeCanonicalClasses(allEvents());
  const currentClass = state.filters.className || els.classFilter.value || "";
  let nextClass = "";
  if (preferredClass && activeClasses.includes(preferredClass)) {
    nextClass = preferredClass;
  } else if (keepCurrent && currentClass && activeClasses.includes(currentClass)) {
    nextClass = currentClass;
  } else if (activeClasses.length === 1) {
    nextClass = activeClasses[0];
  }
  state.filters.className = nextClass;
  state.filters.group = "";
  localStorage.setItem("icstracteur.classFilter", state.filters.className);
  localStorage.setItem("icstracteur.groupFilter", state.filters.group);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function matchesFilter(event) {
  const className = els.classFilter.value;
  const group = els.groupFilter.value;
  const search = els.searchInput.value.trim().toLowerCase();
  const type = els.typeFilter.value;
  const status = els.statusFilter.value;
  const done = isEventDone(event, new Date());
  if (className && !eventBelongsToClass(event, className)) return false;
  if (group && event.group !== group) return false;
  if (type && event.type !== type) return false;
  if (status === "done" && !done) return false;
  if (status === "todo" && done) return false;
  if (!search) return true;
  const haystack = [
    event.title,
    event.room,
    event.group,
    event.sequence,
    event.notes,
    event.absents,
  ].join("\n").toLowerCase();
  return haystack.includes(search);
}

function matchesPlanningFilter(event) {
  const className = els.classFilter.value;
  const group = els.groupFilter.value;
  if (className && !eventBelongsToClass(event, className)) return false;
  if (group && event.group !== group) return false;
  return true;
}

function eventBelongsToClass(event, className) {
  if (!className) return true;
  if (event.className === className) return true;
  if (event.group === className || event.group?.startsWith(`${className} `)) return true;
  const detected = canonicalClassFromText([
    event.className,
    event.group,
    event.title,
    event.summary,
    event.sequence,
    event.plannedSequence,
    event.description,
  ].join("\n"));
  return detected === className;
}

function render() {
  const sourceEvents = allEvents();
  const events = sourceEvents.filter(matchesFilter);
  const planningEvents = sourceEvents.filter(matchesPlanningFilter);
  pruneSelectedSummaryIds(planningEvents);
  renderPlannedSequences();
  renderTable(events);
  renderGrid(events);
  renderSummary(planningEvents);
  syncViewMode();
  renderStats(events);
}

function renderTable(events) {
  els.rows.innerHTML = "";
  const fragment = document.createDocumentFragment();
  const now = new Date();
  events.forEach((event, index) => {
    const tr = els.rowTemplate.content.firstElementChild.cloneNode(true);
    tr.dataset.id = event.id;
    tr.querySelector(".idx").textContent = String(index + 1);
    tr.querySelector(".date").textContent = formatDate(event.dtstart);
    tr.querySelector(".time").textContent = `${formatTime(event.dtstart)}${event.dtend ? ` - ${formatTime(event.dtend)}` : ""}`;
    tr.querySelector(".room").textContent = event.room || "";
    tr.querySelector(".group").textContent = event.group || "";
    tr.querySelector(".sequence").textContent = displaySequence(event);
    tr.querySelector(".plannedSequence").textContent = sanitizeDisplayText(event.plannedSequence || "");
    const marker = evaluationMarker(event);
    const typeCell = tr.querySelector(".type");
    typeCell.innerHTML = `<span class="type-tag ${escapeHtml(marker === "ccf" ? "ccf" : event.type)}">${escapeHtml(marker === "ccf" ? "CCF" : labelForType(event.type))}</span>`;
    const evalCell = tr.querySelector(".evaluation");
    evalCell.innerHTML = marker ? evaluationBadge(marker) : "";
    tr.classList.toggle("evaluation-day", event.evaluation || event.type === "evaluation");
    tr.querySelector(".done").innerHTML = doneCell(event, now);
    tr.querySelector(".docs").innerHTML = checkboxCell(event.docs);
    tr.querySelector(".absents").textContent = event.absents || "";
    const actions = tr.querySelector(".actions");
    actions.innerHTML = `
      <div class="mini-actions">
        <button type="button" data-action="open">Ouvrir</button>
        <button type="button" data-action="toggle-done">${event.done ? "Décocher" : "Cocher"}</button>
        <button type="button" data-action="toggle-docs">${event.docs ? "Docs ok" : "Docs ?"}</button>
      </div>
    `;
    actions.querySelector('[data-action="open"]').addEventListener("click", () => openDetails(event.id));
    actions.querySelector('[data-action="toggle-done"]').addEventListener("click", () => toggleFlag(event.id, "done"));
    actions.querySelector('[data-action="toggle-docs"]').addEventListener("click", () => toggleFlag(event.id, "docs"));
    fragment.appendChild(tr);
  });
  els.rows.appendChild(fragment);
}

function renderGrid(events) {
  if (!els.gridWrap) return;
  els.gridWrap.style.setProperty("--grid-cols", String(clampGridCols(state.gridColumns)));
  els.gridWrap.innerHTML = "";
  if (!events.length) {
    els.gridWrap.innerHTML = '<div class="planned-item">Aucun événement visible.</div>';
    return;
  }
  const fragment = document.createDocumentFragment();
  const now = new Date();
  events.forEach((event) => {
    const card = document.createElement("article");
    const done = isEventDone(event, now);
    const evaluation = Boolean(event.evaluation || event.type === "evaluation");
    card.className = `sequence-card ${done ? "done" : "todo"}${evaluation ? " evaluation" : ""} type-${safeClassName(event.type)}`;
    card.dataset.id = event.id;
    card.title = buildCardTooltip(event);
    const metaLeft = [formatDate(event.dtstart), formatTime(event.dtstart)].filter(Boolean).join(" ");
    const metaRight = [event.room, event.group].filter(Boolean).join(" · ");
    card.innerHTML = `
      <span class="card-badge">${done ? "fait" : "à venir"}</span>
      <div class="card-title">${escapeHtml(displayTitle(event))}</div>
      <div class="card-seq">${escapeHtml(displaySequence(event))}</div>
      <div class="card-meta">
        <span>${escapeHtml(metaLeft)}</span>
        <span>${escapeHtml(metaRight)}</span>
      </div>
    `;
    card.addEventListener("click", () => openDetails(event.id));
    fragment.appendChild(card);
  });
  els.gridWrap.appendChild(fragment);
}

function renderSummary(events) {
  if (!els.summaryWrap || !els.summaryStats) return;
  const className = els.classFilter.value;
  const group = els.groupFilter.value;
  if (!className) {
    state.summaryEventOrder = [];
    els.summaryWrap.className = `summary-wrap summary-empty ${state.summaryOrientation}`;
    els.summaryWrap.innerHTML = '<div class="summary-notice">Choisis une classe pour afficher la planification annuelle.</div>';
    els.summaryStats.textContent = "La planification est volontairement limitée à une classe ou un groupe.";
    updateSequenceAssignmentControls([]);
    return;
  }
  const now = new Date();
  const summaryEvents = events.filter(isSummaryEvent);
  state.summaryEventOrder = summaryEvents.map((event) => event.id);
  const mode = state.summaryMode === "split" ? "split" : "mixed";
  els.summaryWrap.className = `summary-wrap ${state.summaryOrientation} mode-${mode}`;
  els.summaryWrap.style.setProperty("--summary-square-size", `${clampSummaryZoom(state.summaryZoom)}px`);
  els.summaryWrap.innerHTML = mode === "split"
    ? renderSplitSummary(summaryEvents, now)
    : renderMixedSummary(summaryEvents, now);
  updateSequenceAssignmentControls(summaryEvents);
  const done = summaryEvents.filter((event) => isEventDone(event, now)).length;
  const evaluations = summaryEvents.filter((event) => evaluationMarker(event)).length;
  const calendarMinutes = summaryEvents.reduce((total, event) => total + eventDurationMinutes(event), 0);
  const pedagogicalMinutes = summaryEvents.reduce((total, event) => total + pedagogicalDurationMinutes(event), 0);
  const first = summaryEvents[0]?.dtstart;
  const last = summaryEvents.at(-1)?.dtstart;
  const scope = group || className;
  const span = first && last ? `${formatDate(first)} -> ${formatDate(last)}` : "aucune séance";
  const domains = planningDomainStats(summaryEvents);
  els.summaryStats.textContent = `${scope} - ${summaryEvents.length} séances, ${formatDuration(pedagogicalMinutes)} pédagogiques (${formatDuration(calendarMinutes)} calendrier), ${done} passées/faites, ${summaryEvents.length - done} à venir, ${evaluations} évaluations repérées. ${domains}. ${span}.`;
}

function eventDurationMinutes(event) {
  if (!event.dtstart || !event.dtend) return 0;
  return Math.max(0, Math.round((event.dtend.getTime() - event.dtstart.getTime()) / 60000));
}

function pedagogicalDurationMinutes(event) {
  const minutes = eventDurationMinutes(event);
  if (!minutes) return 0;
  return Math.max(30, Math.round(minutes / 30) * 30);
}

function formatDuration(minutes) {
  const total = Math.max(0, Math.round(Number(minutes) || 0));
  const hours = Math.floor(total / 60);
  const rest = total % 60;
  if (!hours) return `${rest} min`;
  return rest ? `${hours} h ${String(rest).padStart(2, "0")}` : `${hours} h`;
}

function planningDomainStats(events) {
  const counts = new Map(SUMMARY_DOMAINS.map((domain) => [domain, 0]));
  for (const event of events) {
    counts.set(event.domain, (counts.get(event.domain) || 0) + 1);
  }
  return SUMMARY_DOMAINS
    .filter((domain) => counts.get(domain))
    .map((domain) => `${labelForDomain(domain)} ${counts.get(domain)}`)
    .join(", ") || "aucune matière";
}

function renderMixedSummary(events, now) {
  if (!events.length) return '<div class="summary-notice">Aucun cours maths/sciences/co-intervention visible pour ce filtre.</div>';
  return `
    <section class="summary-sheet">
      <div class="summary-sheet-head">
        <h3>Chronologie mixte</h3>
        ${renderSummaryLegend()}
      </div>
      ${renderSequenceLegend(events)}
      ${renderMonthGroups(events, now)}
    </section>
  `;
}

function renderSplitSummary(events, now) {
  if (!events.length) return '<div class="summary-notice">Aucun cours maths/sciences/co-intervention visible pour ce filtre.</div>';
  const columns = SUMMARY_DOMAINS
    .map((domain) => ({ domain, events: events.filter((event) => event.domain === domain) }))
    .filter((column) => column.events.length);
  return `
    <section class="summary-sheet">
      <div class="summary-sheet-head">
        <h3>Éclaté par matière</h3>
        ${renderSummaryLegend()}
      </div>
      ${renderSequenceLegend(events)}
      <div class="summary-columns">
        ${columns.map((column) => `
          <section class="summary-domain domain-${safeClassName(column.domain)}">
            <h4>${escapeHtml(labelForDomain(column.domain))}<span>${column.events.length}</span></h4>
            ${renderMonthGroups(column.events, now)}
          </section>
        `).join("")}
      </div>
    </section>
  `;
}

function renderMonthGroups(events, now) {
  const groups = new Map();
  for (const event of events) {
    const key = event.dtstart
      ? `${event.dtstart.getFullYear()}-${String(event.dtstart.getMonth() + 1).padStart(2, "0")}`
      : "sans-date";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(event);
  }
  return `
    <div class="summary-months">
      ${Array.from(groups.values()).map((monthEvents) => `
        <fieldset class="summary-month">
          <legend>${escapeHtml(formatMonth(monthEvents[0]?.dtstart))}</legend>
          <div class="summary-squares">${monthEvents.map((event) => renderSummarySquare(event, now)).join("")}</div>
        </fieldset>
      `).join("")}
    </div>
  `;
}

function formatMonth(date) {
  if (!date) return "Sans date";
  return new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric" }).format(date);
}

function renderSequenceLegend(events) {
  const items = sequenceLegendItems(events);
  if (!items.length) return "";
  return `
    <div class="sequence-legend" aria-label="Couleurs des séquences">
      ${items.map((item) => `
        <span class="sequence-chip" data-sequence="${escapeHtml(item.title)}" title="${escapeHtml(item.title)}">
          <i style="background: ${item.color}"></i>
          <span>${escapeHtml(item.shortTitle)}</span>
          <b>${item.count}</b>
        </span>
      `).join("")}
    </div>
  `;
}

function sequenceLegendItems(events) {
  const bySequence = new Map();
  for (const event of events) {
    if (specialEventMarker(event)) continue;
    const key = sequenceKey(event);
    if (!bySequence.has(key)) {
      bySequence.set(key, {
        title: key,
        shortTitle: shortSequenceTitle(key),
        color: sequenceColor(key),
        count: 0,
      });
    }
    bySequence.get(key).count += 1;
  }
  return Array.from(bySequence.values());
}

function updateSequenceAssignmentControls(events) {
  if (!els.sequenceAssignSelect || !els.selectedCount) return;
  const selected = state.selectedSummaryIds.size;
  const names = sequenceCatalogItems(events)
    .map((item) => item.title)
    .filter((title) => title !== "Sans séquence");
  els.sequenceAssignSelect.innerHTML = ['<option value="">Choisir une séquence</option>']
    .concat(names.map((name) => `<option value="${escapeHtml(name)}">${escapeHtml(shortSequenceTitle(name))}</option>`))
    .join("");
  els.selectedCount.textContent = selected
    ? `${selected} carré${selected > 1 ? "s" : ""} sélectionné${selected > 1 ? "s" : ""}.`
    : "Aucun carré sélectionné.";
  updateSummarySelectionCount();
  updateSequenceManagerControls(events);
}

function updateSummarySelectionCount() {
  if (!els.summarySelectionCount) return;
  const count = state.selectedSummaryIds.size;
  els.summarySelectionCount.textContent = `${count} sélectionné${count > 1 ? "s" : ""}`;
  if (els.selectedCount) {
    els.selectedCount.textContent = count
      ? `${count} carré${count > 1 ? "s" : ""} sélectionné${count > 1 ? "s" : ""}.`
      : "Aucun carré sélectionné.";
  }
}

function toggleSummarySelection(id, extendRange = false) {
  if (extendRange && state.summarySelectionAnchorId) {
    const start = state.summaryEventOrder.indexOf(state.summarySelectionAnchorId);
    const end = state.summaryEventOrder.indexOf(id);
    if (start !== -1 && end !== -1) {
      const [from, to] = start < end ? [start, end] : [end, start];
      for (const eventId of state.summaryEventOrder.slice(from, to + 1)) {
        state.selectedSummaryIds.add(eventId);
      }
    }
  } else if (state.selectedSummaryIds.has(id)) {
    state.selectedSummaryIds.delete(id);
  } else {
    state.selectedSummaryIds.add(id);
  }
  state.summarySelectionAnchorId = id;
  syncSummarySelectionClasses();
  updateSummarySelectionCount();
}

function syncSummarySelectionClasses() {
  els.summaryWrap?.querySelectorAll(".summary-square").forEach((square) => {
    square.classList.toggle("selected", state.selectedSummaryIds.has(square.dataset.id));
  });
}

function clearSummarySelection() {
  state.selectedSummaryIds.clear();
  state.summarySelectionAnchorId = "";
  syncSummarySelectionClasses();
  updateSummarySelectionCount();
}

function selectAllSummarySquares() {
  state.selectedSummaryIds = new Set(state.summaryEventOrder);
  state.summarySelectionAnchorId = state.summaryEventOrder.at(-1) || "";
  syncSummarySelectionClasses();
  updateSummarySelectionCount();
}

function sequenceCatalogItems(events) {
  const byTitle = new Map();
  for (const item of sequenceLegendItems(events)) {
    byTitle.set(item.title, {
      ...item,
      domain: sequenceDefinitionDomain(item.title),
    });
  }
  for (const seq of state.plannedSequences) {
    const title = normalizeText(seq.title);
    if (!title) continue;
    byTitle.set(title, {
      title,
      shortTitle: shortSequenceTitle(title),
      color: sequenceColor(title),
      count: byTitle.get(title)?.count || 0,
      domain: state.sequenceMeta[title]?.domain || seq.domain || "autre",
    });
  }
  for (const [title, meta] of Object.entries(state.sequenceMeta)) {
    const cleanTitle = normalizeText(title);
    if (!cleanTitle) continue;
    byTitle.set(cleanTitle, {
      title: cleanTitle,
      shortTitle: shortSequenceTitle(cleanTitle),
      color: sequenceColor(cleanTitle),
      count: byTitle.get(cleanTitle)?.count || 0,
      domain: meta.domain || byTitle.get(cleanTitle)?.domain || "autre",
    });
  }
  return Array.from(byTitle.values()).sort((a, b) => a.title.localeCompare(b.title, "fr"));
}

function sequenceDefinitionDomain(title) {
  const planned = state.plannedSequences.find((seq) => normalizeText(seq.title) === title);
  return state.sequenceMeta[title]?.domain || planned?.domain || "autre";
}

function updateSequenceManagerControls(events) {
  if (!els.sequenceManagerSelect) return;
  const catalog = sequenceCatalogItems(events).filter((item) => item.title !== "Sans séquence");
  const current = state.selectedSequenceTitle || els.sequenceManagerSelect.value || "";
  els.sequenceManagerSelect.innerHTML = ['<option value="">Choisir une séquence</option>']
    .concat(catalog.map((item) => `<option value="${escapeHtml(item.title)}">${escapeHtml(shortSequenceTitle(item.title))} (${item.count})</option>`))
    .join("");
  if (current && catalog.some((item) => item.title === current)) {
    els.sequenceManagerSelect.value = current;
    fillSequenceManager(current);
  } else if (!els.sequenceManagerTitle.value) {
    state.selectedSequenceTitle = "";
    els.sequenceManagerSelect.value = "";
  }
}

function fillSequenceManager(title) {
  if (!title) {
    state.selectedSequenceTitle = "";
    if (els.sequenceManagerTitle) els.sequenceManagerTitle.value = "";
    if (els.sequenceManagerDomain) els.sequenceManagerDomain.value = "maths";
    if (els.sequenceManagerColor) els.sequenceManagerColor.value = SEQUENCE_COLORS[0];
    return;
  }
  state.selectedSequenceTitle = title;
  if (els.sequenceManagerTitle) els.sequenceManagerTitle.value = title;
  if (els.sequenceManagerDomain) els.sequenceManagerDomain.value = sequenceDefinitionDomain(title);
  if (els.sequenceManagerColor) els.sequenceManagerColor.value = sequenceColor(title);
}

function upsertSequenceDefinition(title, domain, color) {
  const cleanTitle = normalizeText(title);
  if (!cleanTitle) return "";
  const existing = state.plannedSequences.find((seq) => normalizeText(seq.title) === cleanTitle);
  if (existing) {
    existing.domain = domain || existing.domain || "autre";
  } else {
    state.plannedSequences.push({
      id: `seq-${globalThis.crypto?.randomUUID?.() || Date.now()}`,
      title: cleanTitle,
      domain: domain || "autre",
      start: null,
      end: null,
      slots: null,
      note: "",
    });
  }
  state.sequenceMeta[cleanTitle] = {
    ...(state.sequenceMeta[cleanTitle] || {}),
    domain: domain || "autre",
    color: /^#[0-9a-f]{6}$/i.test(color || "") ? color : sequenceColor(cleanTitle),
  };
  savePlannedSequences();
  saveSequenceMeta();
  return cleanTitle;
}

function createManagedSequence() {
  const title = normalizeText(els.sequenceManagerTitle?.value || "");
  const domain = els.sequenceManagerDomain?.value || "autre";
  const color = els.sequenceManagerColor?.value || sequenceColor(title);
  const savedTitle = upsertSequenceDefinition(title, domain, color);
  if (!savedTitle) return;
  state.selectedSequenceTitle = savedTitle;
  assignManagedSequenceToSelection(savedTitle, domain);
  render();
}

function updateManagedSequence() {
  const oldTitle = state.selectedSequenceTitle || els.sequenceManagerSelect?.value || "";
  const newTitle = normalizeText(els.sequenceManagerTitle?.value || oldTitle);
  if (!newTitle) return;
  const domain = els.sequenceManagerDomain?.value || "autre";
  const color = els.sequenceManagerColor?.value || sequenceColor(newTitle);
  if (oldTitle && oldTitle !== newTitle) renameSequenceEverywhere(oldTitle, newTitle);
  const savedTitle = upsertSequenceDefinition(newTitle, domain, color);
  state.selectedSequenceTitle = savedTitle;
  assignManagedSequenceToSelection(savedTitle, domain);
  render();
}

function assignManagedSequenceToSelection(title, domain) {
  if (!state.selectedSummaryIds.size) return;
  for (const id of state.selectedSummaryIds) {
    state.annotations[id] = {
      ...(state.annotations[id] || {}),
      plannedSequence: title,
      domain,
    };
  }
  saveAnnotations();
}

function renameSequenceEverywhere(oldTitle, newTitle) {
  for (const seq of state.plannedSequences) {
    if (normalizeText(seq.title) === oldTitle) seq.title = newTitle;
  }
  if (state.sequenceMeta[oldTitle] && !state.sequenceMeta[newTitle]) {
    state.sequenceMeta[newTitle] = state.sequenceMeta[oldTitle];
  }
  delete state.sequenceMeta[oldTitle];
  for (const [id, annotation] of Object.entries(state.annotations)) {
    if (normalizeText(annotation.plannedSequence) === oldTitle) {
      state.annotations[id] = { ...annotation, plannedSequence: newTitle };
    }
  }
  for (const event of allEvents()) {
    if (sequenceKey(event) === oldTitle) {
      state.annotations[event.id] = {
        ...(state.annotations[event.id] || {}),
        plannedSequence: newTitle,
      };
    }
  }
  saveAnnotations();
}

function deleteManagedSequence() {
  const title = state.selectedSequenceTitle || els.sequenceManagerSelect?.value || "";
  if (!title) return;
  if (!confirm(`Supprimer la séquence "${title}" et retirer son affectation des séances ?`)) return;
  state.plannedSequences = state.plannedSequences.filter((seq) => normalizeText(seq.title) !== title);
  delete state.sequenceMeta[title];
  for (const event of allEvents()) {
    if (sequenceKey(event) === title || normalizeText(state.annotations[event.id]?.plannedSequence) === title) {
      state.annotations[event.id] = {
        ...(state.annotations[event.id] || {}),
        plannedSequence: "Sans séquence",
      };
    }
  }
  state.selectedSequenceTitle = "";
  if (els.sequenceManagerTitle) els.sequenceManagerTitle.value = "";
  savePlannedSequences();
  saveSequenceMeta();
  saveAnnotations();
  render();
}

function selectSquaresForManagedSequence() {
  const title = state.selectedSequenceTitle || els.sequenceManagerSelect?.value || "";
  selectSquaresForSequence(title);
}

function selectSquaresForSequence(title) {
  if (!title) return;
  state.selectedSequenceTitle = title;
  state.selectedSummaryIds.clear();
  for (const event of allEvents().filter(matchesPlanningFilter).filter(isSummaryEvent)) {
    if (sequenceKey(event) === title) state.selectedSummaryIds.add(event.id);
  }
  render();
}

function assignSequenceToSelected() {
  const ids = Array.from(state.selectedSummaryIds);
  const name = normalizeText(els.sequenceAssignName?.value || els.sequenceAssignSelect?.value || "");
  if (!ids.length || !name) return;
  upsertSequenceDefinition(name, sequenceDefinitionDomain(name), state.sequenceMeta[name]?.color || sequenceColor(name));
  for (const id of ids) {
    state.annotations[id] = {
      ...(state.annotations[id] || {}),
      plannedSequence: name,
    };
  }
  if (els.sequenceAssignName) els.sequenceAssignName.value = "";
  saveAnnotations();
  render();
}

function clearSequenceFromSelected() {
  const ids = Array.from(state.selectedSummaryIds);
  if (!ids.length) return;
  for (const id of ids) {
    state.annotations[id] = {
      ...(state.annotations[id] || {}),
      plannedSequence: "Sans séquence",
    };
  }
  saveAnnotations();
  render();
}

function assignDomainToSelected() {
  const ids = Array.from(state.selectedSummaryIds);
  const domain = els.domainAssignSelect?.value || "";
  if (!ids.length || !domain) return;
  for (const id of ids) {
    const annotation = { ...(state.annotations[id] || {}) };
    if (domain === "auto") delete annotation.domain;
    else annotation.domain = domain;
    state.annotations[id] = annotation;
  }
  saveAnnotations();
  render();
}

function shortSequenceTitle(value) {
  const text = normalizeText(value).replace(/\s+/g, " ");
  return text.length > 34 ? `${text.slice(0, 31)}...` : text;
}

function renderSummaryLegend() {
  return `
    <div class="summary-legend" aria-label="Légende">
      <span><i class="summary-dot"></i>sommative</span>
      <span><i class="summary-cross"></i>mini-éval.</span>
      <span><i class="summary-triangle"></i>CCF</span>
      <span><i class="summary-absent"></i>classe absente</span>
      <span><i class="summary-admin-absence"></i>absence admin</span>
    </div>
  `;
}

function renderSummarySquare(event, now) {
  const done = isEventDone(event, now);
  const marker = evaluationMarker(event);
  const special = specialEventMarker(event);
  const key = sequenceKey(event);
  const color = special ? "#ffffff" : sequenceColor(key);
  const title = buildSummaryEventTooltip(event);
  return `
    <button
      type="button"
      class="summary-square ${done ? "filled" : "empty"} ${key === "Sans séquence" ? "unassigned" : ""} ${state.selectedSummaryIds.has(event.id) ? "selected" : ""} domain-${safeClassName(event.domain)} ${marker ? `marker-${marker}` : ""} ${special ? `special-${special}` : ""}"
      style="--sequence-color: ${color}"
      data-id="${escapeHtml(event.id)}"
      title="${escapeHtml(title)}"
      aria-label="${escapeHtml(title)}"
    ></button>
  `;
}

function isSummaryEvent(event) {
  if (!event.dtstart) return false;
  if (event.type === "pfmp") return false;
  if (specialEventMarker(event)) return true;
  if (isExcludedSummaryEvent(event)) return false;
  if (SUMMARY_DOMAINS.includes(event.domain) && event.domain !== "autre") return true;
  if (event.source === "manual") return event.type === "cours" || event.type === "evaluation" || event.evaluation;
  return event.type === "cours";
}

function isExcludedSummaryEvent(event) {
  const text = normalizeText([
    event.title,
    event.summary,
    event.sequence,
    event.plannedSequence,
    event.notes,
  ].join("\n")).toLowerCase();
  return [
    "annulé",
    "annule",
    "absence",
    "abs personnelle",
    "sortie pédagogique",
    "sortie pedagogique",
    "pfmp",
  ].some((needle) => text.includes(needle));
}

function isEventDone(event, now) {
  if (event.done) return true;
  const end = event.dtend || event.dtstart;
  return end ? end < now : false;
}

function sequenceKey(event) {
  const raw = normalizeText(sanitizeDisplayText(event.plannedSequence || event.sequence || ""));
  const cleaned = cleanSequenceKey(raw);
  return cleaned || "Sans séquence";
}

function cleanSequenceKey(value) {
  let text = normalizeText(value).replace(/\s+/g, " ").trim();
  if (!text) return "";
  text = text.replace(/^(contenu prévu|sequence|séquence|seance|séance)\s*:\s*/i, "");
  for (const className of CANONICAL_CLASSES) {
    const escaped = className.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    text = text.replace(new RegExp(`\\b${escaped}\\s+G[12AB]\\b`, "gi"), "");
    text = text.replace(new RegExp(`\\b${escaped}\\b`, "gi"), "");
  }
  text = text
    .replace(/\bG[12AB]\b/gi, "")
    .replace(/\b(mathématiques|mathematiques|maths|sciences|physique|chimie|physique-chimie|co[- ]?intervention)\b/gi, "")
    .replace(/\s*-\s*$/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
  return text;
}

function sequenceColor(value) {
  if (value === "Sans séquence") return "#cbd5e1";
  const metaColor = state.sequenceMeta?.[value]?.color;
  if (/^#[0-9a-f]{6}$/i.test(metaColor || "")) return metaColor;
  const text = String(value || "sequence");
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = ((hash << 5) - hash + text.charCodeAt(i)) | 0;
  }
  return SEQUENCE_COLORS[Math.abs(hash) % SEQUENCE_COLORS.length];
}

function evaluationMarker(event) {
  if (isCcfEvent(event)) return "ccf";
  const text = normalizeText([
    event.title,
    event.summary,
    event.sequence,
    event.plannedSequence,
    event.notes,
  ].join("\n")).toLowerCase();
  if (text.includes("mini") || text.includes("flash") || text.includes("interro") || text.includes("quiz")) return "mini";
  if (event.evaluation || event.type === "evaluation" || text.includes("évaluation") || text.includes("evaluation") || text.includes("sommative")) return "summative";
  return "";
}

function isCcfEvent(event) {
  const text = normalizeText([
    event.title,
    event.summary,
    event.sequence,
    event.plannedSequence,
    event.notes,
  ].join("\n"))
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  if (!/\bccf\b|certificative|certification/.test(text)) return false;
  if (/prepar|entrain|revision|reviser|entrainement|correction/.test(text)) return false;
  return true;
}

function specialEventMarker(event) {
  const text = normalizeText([
    event.title,
    event.summary,
    event.sequence,
    event.plannedSequence,
    event.notes,
  ].join("\n"))
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  if (/classe\s+absente|groupe\s+absent|classe\s+en\s+stage|classe\s+sortie/.test(text)) return "class-absent";
  if (/absence\s+admin|abs\.?\s*admin|absence\s+administrative|abs\s+personnelle|absence\s+personnelle/.test(text)) return "admin-absence";
  return "";
}

function evaluationBadge(marker) {
  const label = labelForEvaluationMarker(marker);
  const content = marker === "ccf" ? "▲" : marker === "mini" ? "×" : "•";
  return `<span class="evaluation-badge ${escapeHtml(marker)}" title="${escapeHtml(label)}">${content}</span>`;
}

function labelForEvaluationMarker(marker) {
  switch (marker) {
    case "ccf": return "CCF / certificative";
    case "mini": return "Mini-évaluation";
    case "summative": return "Évaluation sommative";
    default: return "Évaluation";
  }
}

function displayTitle(event) {
  return sanitizeDisplayText(event.title || event.summary || "");
}

function displaySequence(event) {
  return sanitizeDisplayText(event.plannedSequence || event.sequence || event.title || event.summary || "");
}

function sanitizeDisplayText(value) {
  let text = normalizeText(value).replace(/\s+/g, " ").trim();
  if (!text) return "";
  const lower = text.toLowerCase();
  if (lower.startsWith("ccf")) return "CCF";
  if (lower.startsWith("commission éducative") || lower.startsWith("commission educative")) return "Commission éducative";
  text = removeTaggedStudentNames(text);
  text = text
    .replace(/\s*,\s*,+/g, ", ")
    .replace(/(?:^|[-,;])\s*$/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
  return text;
}

function removeTaggedStudentNames(value) {
  let text = String(value || "");
  for (const className of CANONICAL_CLASSES) {
    const classPattern = className.startsWith("_")
      ? `(?:_)?${className.slice(1).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`
      : className.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    text = text.replace(new RegExp(`<\\s*${classPattern}\\s*>\\s*[^,<\\n]+(?:\\s+[^,<\\n]+)?`, "gi"), "");
  }
  text = text.replace(/<\s*[^>]+\s*>\s*[^,<\n]+(?:\s+[^,<\n]+)?/g, "");
  return text.replace(/\s*,\s*/g, ", ").replace(/^[-,\s]+|[-,\s]+$/g, "");
}

function buildSummaryEventTooltip(event) {
  const marker = evaluationMarker(event);
  return [
    `${formatDate(event.dtstart)} ${formatTime(event.dtstart)}${event.dtend ? ` - ${formatTime(event.dtend)}` : ""}`,
    eventDurationMinutes(event) ? `${formatDuration(pedagogicalDurationMinutes(event))} pédagogique (${formatDuration(eventDurationMinutes(event))} calendrier)` : "",
    labelForDomain(event.domain),
    event.group || event.className || "",
    event.room || "",
    displaySequence(event) || displayTitle(event),
    domainOrigin(event),
    marker ? labelForEvaluationMarker(marker) : "",
  ].filter(Boolean).join("\n");
}

function pruneSelectedSummaryIds(events) {
  if (!state.selectedSummaryIds.size) return;
  const ids = new Set(events.map((event) => event.id));
  for (const id of state.selectedSummaryIds) {
    if (!ids.has(id)) state.selectedSummaryIds.delete(id);
  }
}

function safeClassName(value) {
  return String(value || "autre").toLowerCase().replace(/[^a-z0-9_-]+/g, "-");
}

function buildCardTooltip(event) {
  return [
    displayTitle(event),
    formatDate(event.dtstart),
    `${formatTime(event.dtstart)}${event.dtend ? ` - ${formatTime(event.dtend)}` : ""}`,
    event.room || "",
    event.group || "",
    displaySequence(event),
    event.notes || "",
  ].filter(Boolean).join("\n");
}

function clampGridCols(value) {
  const n = Number(value) || 4;
  return Math.min(12, Math.max(2, n));
}

function clampSummaryZoom(value) {
  const n = Number(value) || 14;
  return Math.min(24, Math.max(8, n));
}

function syncViewMode() {
  const isTable = state.viewMode === "table";
  const isGrid = state.viewMode === "grid";
  const isSummary = state.viewMode === "summary";
  document.body.dataset.view = state.viewMode;
  els.tablePanel.classList.toggle("hidden", !isTable);
  els.gridPanel.classList.toggle("hidden", !isGrid);
  els.summaryPanel.classList.toggle("hidden", !isSummary);
  els.viewGrid?.classList.toggle("view-active", isGrid);
  els.viewSummary?.classList.toggle("view-active", isSummary);
  els.viewTable?.classList.toggle("view-active", state.viewMode === "table");
  if (els.controlsTitle) {
    els.controlsTitle.textContent = isSummary ? "Planification" : isGrid ? "Grille" : "Liste";
  }
  localStorage.setItem("icstracteur.viewMode", state.viewMode);
}

function setViewMode(mode) {
  state.viewMode = mode === "grid" ? "grid" : mode === "summary" ? "summary" : "table";
  syncViewMode();
}

function setSummaryMode(value) {
  state.summaryMode = value === "split" ? "split" : "mixed";
  localStorage.setItem("icstracteur.summaryMode", state.summaryMode);
  syncSummaryControls();
  render();
}

function syncSummaryControls() {
  const mode = state.summaryMode === "split" ? "split" : "mixed";
  const zoom = clampSummaryZoom(state.summaryZoom);
  state.summaryZoom = zoom;
  if (els.summaryMode) els.summaryMode.value = mode;
  if (els.summaryModePanel) els.summaryModePanel.value = mode;
  if (els.summaryZoom) els.summaryZoom.value = String(zoom);
  if (els.summaryZoomLabel) els.summaryZoomLabel.textContent = `${zoom} px`;
}

function labelForDomain(domain) {
  switch (domain) {
    case "maths": return "Maths";
    case "sciences": return "Sciences";
    case "cointervention": return "Co-intervention";
    case "ap": return "AP";
    default: return "Non classé";
  }
}

function labelForType(type) {
  switch (type) {
    case "cointervention": return "Co-intervention";
    case "evaluation": return "Évaluation";
    case "pfmp": return "PFMP";
    case "cours": return "Cours";
    default: return "Autre";
  }
}

function checkboxCell(flag) {
  return flag ? "Oui" : "Non";
}

function doneCell(event, now) {
  if (event.done) return "Oui";
  return isEventDone(event, now) ? "Passé" : "Non";
}

function renderStats(events) {
  const total = allEvents().length;
  const now = new Date();
  const done = allEvents().filter((e) => isEventDone(e, now)).length;
  const docs = allEvents().filter((e) => e.docs).length;
  const groups = new Set(allEvents().map((e) => e.group).filter(Boolean)).size;
  els.stats.textContent = `${total} événements importés ou saisis, ${done} passés/faits, ${docs} avec documents distribués, ${groups} groupes/classes visibles.`;
}

function openDetails(id) {
  const event = allEvents().find((e) => e.id === id);
  if (!event) return;
  state.selectedId = id;
  detailFields.id.value = id;
  detailFields.title.value = event.title || "";
  detailFields.date.value = toDateInput(event.dtstart);
  detailFields.start.value = toTimeInput(event.dtstart);
  detailFields.end.value = toTimeInput(event.dtend);
  detailFields.room.value = event.room || "";
  detailFields.group.value = event.group || "";
  detailFields.sequence.value = event.sequence || "";
  detailFields.plannedSequence.value = event.plannedSequence || "";
  detailFields.type.value = event.type || "autre";
  const annotation = state.annotations[id] || {};
  detailFields.domain.value = Object.hasOwn(annotation, "domain") ? event.domain : "auto";
  detailFields.domainOrigin.textContent = domainOrigin(event);
  detailFields.evaluation.checked = Boolean(event.evaluation || event.type === "evaluation");
  detailFields.done.checked = Boolean(event.done);
  detailFields.docs.checked = Boolean(event.docs);
  detailFields.absents.value = event.absents || "";
  detailFields.notes.value = event.notes || "";
}

function toDateInput(date) {
  const parts = localDateParts(date);
  return `${parts.y}-${parts.m}-${parts.d}`;
}

function toTimeInput(date) {
  const parts = localDateParts(date);
  return `${parts.h}:${parts.min}`;
}

function toggleFlag(id, flag) {
  const a = state.annotations[id] || {};
  a[flag] = !a[flag];
  state.annotations[id] = a;
  saveAnnotations();
  render();
}

function upsertAnnotation(id, data) {
  state.annotations[id] = {
    ...(state.annotations[id] || {}),
    ...data,
  };
  saveAnnotations();
}

function updateManualEvent(id, data) {
  const index = state.manual.findIndex((event) => event.id === id);
  if (index === -1) return;
  state.manual[index] = {
    ...state.manual[index],
    summary: data.title ?? state.manual[index].summary,
    location: data.room ?? state.manual[index].location,
    className: data.className ?? state.manual[index].className,
    group: data.group ?? state.manual[index].group,
    sequence: data.sequence ?? state.manual[index].sequence,
    plannedSequence: data.plannedSequence ?? state.manual[index].plannedSequence,
    type: data.type ?? state.manual[index].type,
    evaluation: Boolean(data.evaluation ?? state.manual[index].evaluation),
    dtstart: data.manualDate && data.manualStart ? buildDate(data.manualDate, data.manualStart) : state.manual[index].dtstart,
    dtend: data.manualDate && data.manualEnd ? buildDate(data.manualDate, data.manualEnd) : state.manual[index].dtend,
  };
  saveManualEvents();
}

function removeEvent(id) {
  state.imported = state.imported.filter((event) => event.id !== id);
  state.manual = state.manual.filter((event) => event.id !== id);
  saveManualEvents();
  delete state.annotations[id];
  saveAnnotations();
  state.selectedId = null;
  render();
}

function makeManualEvent() {
  return {
    id: `manual-${globalThis.crypto?.randomUUID?.() || Date.now()}`,
    source: "manual",
    uid: "",
    summary: "",
    description: "",
    location: "",
    dtstart: null,
    dtend: null,
    className: "",
    type: "cours",
    group: "",
    sequence: "",
  };
}

function openManualDialog() {
  manualFields.date.value = toDateInput(new Date());
  manualFields.start.value = "08:00";
  manualFields.end.value = "09:00";
  manualFields.room.value = "";
  manualFields.group.value = els.groupFilter.value || "";
  manualFields.title.value = "";
  manualFields.plannedSequence.value = "";
  manualFields.type.value = "cours";
  manualFields.sequence.value = "";
  manualFields.notes.value = "";
  manualFields.evaluation.checked = false;
  manualFields.done.checked = false;
  manualFields.docs.checked = false;
  manualFields.absents.value = "";
  els.manualDialog.showModal();
}

function createManualEventFromForm() {
  const event = makeManualEvent();
  event.summary = manualFields.title.value.trim();
  event.dtstart = buildDate(manualFields.date.value, manualFields.start.value);
  event.dtend = buildDate(manualFields.date.value, manualFields.end.value);
  state.manual.unshift(event);
  saveManualEvents();
  upsertAnnotation(event.id, {
    title: manualFields.title.value.trim(),
    manualDate: manualFields.date.value,
    manualStart: manualFields.start.value,
    manualEnd: manualFields.end.value,
    className: els.classFilter.value || "",
    room: manualFields.room.value.trim(),
    group: manualFields.group.value.trim(),
    sequence: manualFields.sequence.value.trim(),
    plannedSequence: manualFields.plannedSequence.value.trim(),
    type: manualFields.type.value,
    evaluation: manualFields.evaluation.checked,
    done: manualFields.done.checked,
    docs: manualFields.docs.checked,
    absents: manualFields.absents.value.trim(),
    notes: manualFields.notes.value.trim(),
  });
  els.manualDialog.close();
  updateFilters();
  render();
  openDetails(event.id);
}

function buildDate(dateValue, timeValue) {
  if (!dateValue || !timeValue) return null;
  const [y, m, d] = dateValue.split("-").map(Number);
  const [h, min] = timeValue.split(":").map(Number);
  return new Date(y, m - 1, d, h, min, 0, 0);
}

async function importIcsFile(file) {
  const text = await file.text();
  state.sourceName = file.name;
  setImportedEvents(parseIcs(text));
}

function setImportedEvents(events, options = {}) {
  state.imported = events;
  reconcileFiltersAfterImport(options.preferredClass || "", Boolean(options.keepCurrent));
  updateFilters();
  render();
}

function importIcsText(text) {
  state.sourceName = "texte ICS";
  setImportedEvents(parseIcs(text));
}

async function importIcsUrl(url) {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const text = await response.text();
  importIcsText(text);
}

function loadDemoData() {
  const demo = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
UID:demo-1
DTSTART:20260901T081500
DTEND:20260901T091500
SUMMARY:Sciences - 1ASSP1 G1
LOCATION:E231 SCIENCES
DESCRIPTION;LANGUAGE=fr:Contenu prévu : Acide-base\\nMesure du pH\\nPréparation au CCF\\nType : Cours\\nGroupe : [1ASSP1 G1]
END:VEVENT
BEGIN:VEVENT
UID:demo-2
DTSTART:20260908T091500
DTEND:20260908T103000
SUMMARY:Sciences - 1ASSP1 G1
LOCATION:E231 SCIENCES
DESCRIPTION;LANGUAGE=fr:Contenu prévu : Oxydoréduction\\nCorrosion du métal\\nPassivation\\nType : Cours\\nGroupe : [1ASSP1 G1]
END:VEVENT
BEGIN:VEVENT
UID:demo-3
DTSTART:20260915T081500
DTEND:20260915T091500
SUMMARY:Co-intervention - Détergent
LOCATION:E228 SCIENCES
DESCRIPTION;LANGUAGE=fr:Contenu prévu : Tensioactifs et nettoyage\\nDocuments distribués\\nType : Co-intervention\\nGroupe : [1ASSP1 G2]
END:VEVENT
END:VCALENDAR`;
  state.sourceName = "exemple";
  setImportedEvents(parseIcs(demo), { preferredClass: "1ASSP1" });
}

// === Sauvegarde / restauration complète (point 1.1) ============================
// Exporte la totalité de l'état persistant dans un seul fichier JSON. C'est la
// seule donnée irremplaçable : l'ICS est régénérable, pas les annotations.
const BACKUP_VERSION = 1;

function buildBackupPayload() {
  return {
    app: "ICStracteur",
    backupVersion: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    annotations: state.annotations,
    manual: state.manual.map((event) => ({
      ...event,
      dtstart: event.dtstart ? event.dtstart.toISOString() : null,
      dtend: event.dtend ? event.dtend.toISOString() : null,
    })),
    plannedSequences: state.plannedSequences.map((seq) => ({
      ...seq,
      start: seq.start ? seq.start.toISOString() : null,
      end: seq.end ? seq.end.toISOString() : null,
    })),
    sequenceMeta: state.sequenceMeta,
    settings: {
      classFilter: state.filters.className,
      groupFilter: state.filters.group,
      viewMode: state.viewMode,
      gridColumns: state.gridColumns,
      summaryOrientation: state.summaryOrientation,
      summaryMode: state.summaryMode,
      summaryZoom: state.summaryZoom,
    },
  };
}

function exportBackup() {
  const json = JSON.stringify(buildBackupPayload(), null, 2);
  downloadBlob(json, `icstracteur-sauvegarde-${new Date().toISOString().slice(0, 10)}.json`, "application/json");
}

function applyBackupPayload(payload) {
  if (!payload || typeof payload !== "object") throw new Error("Fichier illisible.");
  if (payload.app && payload.app !== "ICStracteur") throw new Error("Ce fichier n'est pas une sauvegarde ICStracteur.");

  if (payload.annotations && typeof payload.annotations === "object") {
    state.annotations = payload.annotations;
    saveAnnotations();
  }
  if (Array.isArray(payload.manual)) {
    state.manual = payload.manual.map((event) => ({
      ...event,
      dtstart: event.dtstart ? new Date(event.dtstart) : null,
      dtend: event.dtend ? new Date(event.dtend) : null,
    }));
    saveManualEvents();
  }
  if (Array.isArray(payload.plannedSequences)) {
    state.plannedSequences = payload.plannedSequences.map((seq) => ({
      ...seq,
      start: seq.start ? new Date(seq.start) : null,
      end: seq.end ? new Date(seq.end) : null,
    }));
    savePlannedSequences();
  }
  if (payload.sequenceMeta && typeof payload.sequenceMeta === "object") {
    state.sequenceMeta = payload.sequenceMeta;
    saveSequenceMeta();
  }
  const s = payload.settings || {};
  if (typeof s.classFilter === "string") state.filters.className = s.classFilter;
  if (typeof s.groupFilter === "string") state.filters.group = s.groupFilter;
  if (typeof s.viewMode === "string") state.viewMode = s.viewMode;
  if (s.gridColumns != null) state.gridColumns = clampGridCols(s.gridColumns);
  if (s.summaryOrientation === "portrait" || s.summaryOrientation === "landscape") state.summaryOrientation = s.summaryOrientation;
  if (s.summaryMode === "split" || s.summaryMode === "mixed") state.summaryMode = s.summaryMode;
  if (s.summaryZoom != null) state.summaryZoom = clampSummaryZoom(s.summaryZoom);
  localStorage.setItem("icstracteur.classFilter", state.filters.className);
  localStorage.setItem("icstracteur.groupFilter", state.filters.group);
  localStorage.setItem("icstracteur.viewMode", state.viewMode);
  localStorage.setItem("icstracteur.gridColumns", String(state.gridColumns));
  localStorage.setItem("icstracteur.summaryOrientation", state.summaryOrientation);
  localStorage.setItem("icstracteur.summaryMode", state.summaryMode);
  localStorage.setItem("icstracteur.summaryZoom", String(state.summaryZoom));
}

async function importBackupFile(file) {
  const text = await file.text();
  let payload;
  try {
    payload = JSON.parse(text);
  } catch {
    throw new Error("JSON invalide.");
  }
  const proceed = confirm(
    "Restaurer cette sauvegarde remplacera les annotations, événements manuels et séquences actuels. Continuer ?"
  );
  if (!proceed) return;
  applyBackupPayload(payload);
  syncViewMode();
  syncSummaryControls();
  els.gridColumns.value = String(clampGridCols(state.gridColumns));
  els.summaryOrientation.value = state.summaryOrientation;
  updateFilters();
  render();
}
// ===============================================================================

function exportCsv() {
  const rows = [["index", "date", "heure", "salle", "groupe", "sequence", "type", "fait", "documents", "absents", "notes"]];
  allEvents().filter(matchesFilter).forEach((event, idx) => {
    rows.push([
      idx + 1,
      formatDate(event.dtstart),
      `${formatTime(event.dtstart)}${event.dtend ? ` - ${formatTime(event.dtend)}` : ""}`,
      event.room || "",
      event.group || "",
      displaySequence(event),
      event.type || "",
      event.done ? "oui" : "non",
      event.docs ? "oui" : "non",
      event.absents || "",
      sanitizeDisplayText(event.notes || ""),
    ]);
  });
  const csv = rows.map((row) => row.map(csvEscape).join(";")).join("\n");
  downloadBlob(csv, `icstracteur-${new Date().toISOString().slice(0, 10)}.csv`, "text/csv;charset=utf-8");
}

function csvEscape(value) {
  const text = String(value ?? "");
  if (/[;"\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

function downloadBlob(content, filename, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function bindEvents() {
  els.icsFile.addEventListener("change", async () => {
    const file = els.icsFile.files?.[0];
    if (file) await importIcsFile(file);
  });
  els.loadDemo.addEventListener("click", loadDemoData);
  els.addManual.addEventListener("click", openManualDialog);
  els.exportCsv.addEventListener("click", exportCsv);
  els.exportPdf.addEventListener("click", () => window.print());
  els.exportBackup?.addEventListener("click", exportBackup);
  els.importBackup?.addEventListener("change", async () => {
    const file = els.importBackup.files?.[0];
    if (!file) return;
    try {
      await importBackupFile(file);
    } catch (error) {
      alert(`Restauration impossible : ${error.message}`);
    } finally {
      els.importBackup.value = "";
    }
  });
  els.viewTable.addEventListener("click", () => setViewMode("table"));
  els.viewGrid.addEventListener("click", () => setViewMode("grid"));
  els.viewSummary.addEventListener("click", () => setViewMode("summary"));
  els.gridColumns.value = String(clampGridCols(state.gridColumns));
  els.summaryOrientation.value = state.summaryOrientation;
  syncSummaryControls();
  els.loadUrl.addEventListener("click", async () => {
    const url = els.icsUrl.value.trim();
    if (!url) return;
    try {
      await importIcsUrl(url);
    } catch (error) {
      alert(`Impossible de charger l'ICS: ${error.message}`);
    }
  });
  els.loadText.addEventListener("click", () => {
    const text = els.icsText.value.trim();
    if (!text) return;
    importIcsText(text);
  });
  els.gridColumns.addEventListener("input", () => {
    state.gridColumns = clampGridCols(els.gridColumns.value);
    localStorage.setItem("icstracteur.gridColumns", String(state.gridColumns));
    render();
  });
  els.summaryOrientation.addEventListener("change", () => {
    state.summaryOrientation = els.summaryOrientation.value === "portrait" ? "portrait" : "landscape";
    localStorage.setItem("icstracteur.summaryOrientation", state.summaryOrientation);
    render();
  });
  els.summaryMode.addEventListener("change", () => {
    setSummaryMode(els.summaryMode.value);
  });
  els.summaryModePanel.addEventListener("change", () => {
    setSummaryMode(els.summaryModePanel.value);
  });
  els.summaryZoom.addEventListener("input", () => {
    state.summaryZoom = clampSummaryZoom(els.summaryZoom.value);
    localStorage.setItem("icstracteur.summaryZoom", String(state.summaryZoom));
    syncSummaryControls();
    render();
  });
  els.summaryWrap.addEventListener("click", (event) => {
    const sequenceChip = event.target.closest(".sequence-chip");
    if (sequenceChip?.dataset.sequence) {
      selectSquaresForSequence(sequenceChip.dataset.sequence);
      return;
    }
    const square = event.target.closest(".summary-square");
    if (!square?.dataset.id) return;
    toggleSummarySelection(square.dataset.id, event.shiftKey);
  });
  els.summaryWrap.addEventListener("dblclick", (event) => {
    const square = event.target.closest(".summary-square");
    if (!square?.dataset.id) return;
    openDetails(square.dataset.id);
  });
  els.selectAllSummary.addEventListener("click", selectAllSummarySquares);
  els.clearSummarySelection.addEventListener("click", clearSummarySelection);
  els.loadPlanned.addEventListener("click", () => {
    state.plannedSequences = parsePlannedSequences(els.plannedText.value);
    savePlannedSequences();
    updateFilters();
    render();
  });
  els.applyPlanned.addEventListener("click", () => {
    const events = [...state.imported, ...state.manual];
    for (const event of events) {
      const planned = findPlannedSequenceForEvent(event);
      if (!planned) continue;
      state.annotations[event.id] = {
        ...(state.annotations[event.id] || {}),
        plannedSequence: state.annotations[event.id]?.plannedSequence || planned,
      };
    }
    saveAnnotations();
    render();
  });
  els.sequenceManagerSelect.addEventListener("change", () => {
    fillSequenceManager(els.sequenceManagerSelect.value);
  });
  els.sequenceCreate.addEventListener("click", createManagedSequence);
  els.sequenceUpdate.addEventListener("click", updateManagedSequence);
  els.sequenceDelete.addEventListener("click", deleteManagedSequence);
  els.sequenceSelectSquares.addEventListener("click", selectSquaresForManagedSequence);
  els.assignSelectedSequence.addEventListener("click", assignSequenceToSelected);
  els.clearSelectedSequence.addEventListener("click", clearSequenceFromSelected);
  els.assignSelectedDomain.addEventListener("click", assignDomainToSelected);
  els.groupFilter.addEventListener("change", () => {
    state.filters.group = els.groupFilter.value || "";
    localStorage.setItem("icstracteur.groupFilter", state.filters.group);
    render();
  });
  els.classFilter.addEventListener("change", () => {
    state.filters.className = els.classFilter.value || "";
    localStorage.setItem("icstracteur.classFilter", state.filters.className);
    updateFilters();
    render();
  });
  els.searchInput.addEventListener("input", render);
  els.typeFilter.addEventListener("change", render);
  els.statusFilter.addEventListener("change", render);
  els.detailForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const id = detailFields.id.value;
    if (!id) return;
    const payload = {
      title: detailFields.title.value.trim(),
      manualDate: detailFields.date.value,
      manualStart: detailFields.start.value,
      manualEnd: detailFields.end.value,
      className: els.classFilter.value || "",
      room: detailFields.room.value.trim(),
      group: detailFields.group.value.trim(),
      sequence: detailFields.sequence.value.trim(),
      plannedSequence: detailFields.plannedSequence.value.trim(),
      type: detailFields.type.value,
      domain: detailFields.domain.value,
      evaluation: detailFields.evaluation.checked,
      done: detailFields.done.checked,
      docs: detailFields.docs.checked,
      absents: detailFields.absents.value.trim(),
      notes: detailFields.notes.value.trim(),
    };
    if (payload.domain === "auto") {
      const annotation = { ...(state.annotations[id] || {}) };
      delete annotation.domain;
      state.annotations[id] = annotation;
      delete payload.domain;
    }
    upsertAnnotation(id, payload);
    updateManualEvent(id, payload);
    render();
    openDetails(id);
  });
  els.deleteEvent.addEventListener("click", () => {
    const id = detailFields.id.value;
    if (!id) return;
    if (confirm("Supprimer cet événement ?")) removeEvent(id);
  });
  els.manualForm.addEventListener("submit", (event) => {
    event.preventDefault();
    createManualEventFromForm();
  });
  els.closeManual.addEventListener("click", () => els.manualDialog.close());
}

bindEvents();
syncViewMode();
reconcileFiltersAfterImport();
updateFilters();
render();

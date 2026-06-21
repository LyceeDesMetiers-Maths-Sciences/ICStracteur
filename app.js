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
  selectedElementEventId: "",
  selectedElementIndex: null,
  hiddenClasses: JSON.parse(localStorage.getItem("icstracteur.hiddenClasses") || "[]"),
  printFormat: localStorage.getItem("icstracteur.printFormat") || "A4",
  allScannedFiles: JSON.parse(localStorage.getItem("icstracteur.allScannedFiles") || "[]"),
  activeResourceTab: "docs",
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
  planningClassFilter: document.getElementById("planningClassFilter"),
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
  toggleTheme: document.getElementById("toggleTheme"),
  folderImport: document.getElementById("folderImport"),
  btnManageClasses: document.getElementById("btnManageClasses"),
  classManagerDialog: document.getElementById("classManagerDialog"),
  classManagerList: document.getElementById("classManagerList"),
  closeClassManager: document.getElementById("closeClassManager"),
  printFormat: document.getElementById("printFormat"),
  viewSequences: document.getElementById("viewSequences"),
  sequencesPanel: document.querySelector(".sequences-panel"),
  seqBuilderBanner: document.getElementById("seqBuilderBanner"),
  btnCreateSequenceInline: document.getElementById("btnCreateSequenceInline"),
  seqBuilderPlanningWrap: document.getElementById("seqBuilderPlanningWrap"),
  seqBuilderTimelineEmpty: document.getElementById("seqBuilderTimelineEmpty"),
  seqBuilderTimelineContent: document.getElementById("seqBuilderTimelineContent"),
  seqBuilderHoursCalculated: document.getElementById("seqBuilderHoursCalculated"),
  seqBuilderTimeline: document.getElementById("seqBuilderTimeline"),
  seqBuilderTitle: document.getElementById("seqBuilderTitle"),
  seqBuilderDomain: document.getElementById("seqBuilderDomain"),
  seqBuilderColor: document.getElementById("seqBuilderColor"),
  seqBuilderLevel: document.getElementById("seqBuilderLevel"),
  seqBuilderHours: document.getElementById("seqBuilderHours"),
  seqBuilderNote: document.getElementById("seqBuilderNote"),
  seqBuilderSave: document.getElementById("seqBuilderSave"),
  seqBuilderDelete: document.getElementById("seqBuilderDelete"),
  seqBuilderDocsList: document.getElementById("seqBuilderDocsList"),
  seqBuilderFolderImport: document.getElementById("seqBuilderFolderImport"),
  seqBuilderEditorContent: document.getElementById("seqBuilderEditorContent"),
  seqBuilderSequenceConfig: document.getElementById("seqBuilderSequenceConfig"),
  activityDialog: document.getElementById("activityDialog"),
  activityEventId: document.getElementById("activityEventId"),
  activityIndex: document.getElementById("activityIndex"),
  activityForm: document.getElementById("activityForm"),
  activityType: document.getElementById("activityType"),
  activityTitle: document.getElementById("activityTitle"),
  activityDoc: document.getElementById("activityDoc"),
  activityUrl: document.getElementById("activityUrl"),
  btnDeleteActivity: document.getElementById("btnDeleteActivity"),
  closeActivityDialog: document.getElementById("closeActivityDialog"),
  boModuleSelect: document.getElementById("boModuleSelect"),
  boModuleCoverageBar: document.getElementById("boModuleCoverageBar"),
  boModuleCoverageText: document.getElementById("boModuleCoverageText"),
  boCapacitiesList: document.getElementById("boCapacitiesList"),
  boKnowledgesList: document.getElementById("boKnowledgesList"),
  viewProjection: document.getElementById("viewProjection"),
  projectionPanel: document.querySelector(".projection-panel"),
  projectionClassTitle: document.getElementById("projectionClassTitle"),
  projectionYearCircle: document.getElementById("projectionYearCircle"),
  projectionYearPercent: document.getElementById("projectionYearPercent"),
  projectionYearDone: document.getElementById("projectionYearDone"),
  projectionYearRemaining: document.getElementById("projectionYearRemaining"),
  projectionTimeBudget: document.getElementById("projectionTimeBudget"),
  projectionSeqEmpty: document.getElementById("projectionSeqEmpty"),
  projectionSeqContent: document.getElementById("projectionSeqContent"),
  projectionSeqTitle: document.getElementById("projectionSeqTitle"),
  projectionSeqDomain: document.getElementById("projectionSeqDomain"),
  projectionSeqBar: document.getElementById("projectionSeqBar"),
  projectionSeqProgressText: document.getElementById("projectionSeqProgressText"),
  projectionSeqObjectives: document.getElementById("projectionSeqObjectives"),
  projectionMilestonesList: document.getElementById("projectionMilestonesList"),
  projectionSplitWrap: document.getElementById("projectionSplitWrap"),
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

function detectLevelFromText(text) {
  if (!text) return null;
  const upper = text.toUpperCase();
  if (upper.includes("CAP")) return "CAP";
  if (upper.includes("2NDE") || upper.includes("SECONDE")) return "2nde";
  if (upper.includes("1ERE") || upper.includes("PREMIERE") || /\b1[A-Z]/.test(upper) || /_1[A-Z]/.test(upper)) return "1ere";
  if (upper.includes("TERMINALE") || /\bT[A-Z]/.test(upper) || /_T[A-Z]/.test(upper)) return "Terminale";
  return null;
}

function findPlannedSequenceForEvent(event) {
  const date = event.dtstart;
  if (!date) return "";
  
  // Resolve event domain
  const type = event.type || "autre";
  const domain = detectDomain(event.summary || "", event.description || "", event.location || "", type);
  
  // Resolve event class name
  const className = canonicalClassFromText(`${event.className || ""}\n${event.group || ""}\n${event.summary || ""}\n${event.description || ""}`);
  const eventLevel = detectLevelFromText(className);
  
  const match = state.plannedSequences.find((seq) => {
    // A sequence MUST have at least one date limit to auto-match by date range
    if (!seq.start && !seq.end) return false;
    if (seq.start && date < seq.start) return false;
    if (seq.end && date > seq.end) return false;
    
    // Check domain matching
    const seqMeta = state.sequenceMeta[seq.title] || {};
    const seqDomain = seq.domain || seqMeta.domain;
    if (seqDomain && seqDomain !== "autre" && domain && domain !== "autre" && seqDomain !== domain) {
      return false;
    }
    
    // Check level/class matching
    const seqLevel = seqMeta.level; // e.g. "CAP", "2nde", "1ere", "Terminale"
    if (seqLevel && eventLevel && seqLevel !== eventLevel) {
      return false;
    }
    
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
  const currentFilterClass = state.filters.className;
  const events = [...state.imported, ...state.manual]
    .map(mergedEvent)
    .filter((event) => event.className === currentFilterClass || !state.hiddenClasses?.includes(event.className));
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
  if (els.planningClassFilter) {
    els.planningClassFilter.innerHTML = classOptions.join("");
  }
  if (currentClass && classes.includes(currentClass)) {
    els.classFilter.value = currentClass;
  } else {
    els.classFilter.value = "";
  }
  if (els.planningClassFilter) {
    els.planningClassFilter.value = els.classFilter.value;
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
  if (els.btnManageClasses) {
    const hiddenCount = state.hiddenClasses?.length || 0;
    els.btnManageClasses.textContent = hiddenCount > 0
      ? `Gérer les classes détectées (${hiddenCount} masquée${hiddenCount > 1 ? "s" : ""})...`
      : "Gérer les classes détectées...";
  }
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
  renderProjection(planningEvents);
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

function renderProjection(events) {
  if (!els.projectionPanel) return;

  const className = els.classFilter.value;
  const group = els.groupFilter.value;

  if (!className) {
    if (els.projectionClassTitle) els.projectionClassTitle.textContent = "Aucune classe";
    document.getElementById("projectionYearPercent").textContent = "0%";
    document.getElementById("projectionYearDone").textContent = "0";
    document.getElementById("projectionYearRemaining").textContent = "0";
    document.getElementById("projectionTimeBudget").innerHTML = "Veuillez sélectionner une classe.";
    
    document.getElementById("projectionSeqEmpty").classList.remove("hidden");
    document.getElementById("projectionSeqContent").classList.add("hidden");
    
    document.getElementById("projectionMilestonesList").innerHTML = '<div class="projection-empty-msg">Sélectionnez une classe pour afficher les échéances.</div>';
    if (els.projectionSplitWrap) els.projectionSplitWrap.innerHTML = '<div class="projection-empty-msg">Sélectionnez une classe pour afficher la planification.</div>';
    return;
  }

  const now = new Date();
  const scope = group ? `${className} (${group})` : className;
  if (els.projectionClassTitle) els.projectionClassTitle.textContent = scope;

  const activeLessons = events.filter(isSummaryEvent);
  const totalCount = activeLessons.length;
  const doneLessons = activeLessons.filter(event => isEventDone(event, now));
  const doneCount = doneLessons.length;
  const remainingCount = totalCount - doneCount;

  const percent = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  document.getElementById("projectionYearPercent").textContent = `${percent}%`;
  document.getElementById("projectionYearDone").textContent = String(doneCount);
  document.getElementById("projectionYearRemaining").textContent = String(remainingCount);

  const circle = document.getElementById("projectionYearCircle");
  if (circle) {
    const circumference = 2 * Math.PI * 50;
    const offset = circumference - (circumference * percent) / 100;
    circle.style.strokeDashoffset = String(offset);
  }

  const totalMinutes = activeLessons.reduce((sum, e) => sum + pedagogicalDurationMinutes(e), 0);
  const doneMinutes = doneLessons.reduce((sum, e) => sum + pedagogicalDurationMinutes(e), 0);
  const remainingMinutes = Math.max(0, totalMinutes - doneMinutes);
  
  document.getElementById("projectionTimeBudget").innerHTML = 
    `Temps de cours restant : <strong>${formatDuration(remainingMinutes)}</strong> (sur un total de ${formatDuration(totalMinutes)})`;

  const activeSeqName = findActiveSequence(activeLessons, now);
  if (activeSeqName) {
    document.getElementById("projectionSeqEmpty").classList.add("hidden");
    document.getElementById("projectionSeqContent").classList.remove("hidden");
    
    document.getElementById("projectionSeqTitle").textContent = activeSeqName;

    const seqLessons = activeLessons.filter(e => sequenceKey(e) === activeSeqName);
    const seqDone = seqLessons.filter(e => isEventDone(e, now)).length;
    const seqTotal = seqLessons.length;
    const seqPercent = seqTotal > 0 ? Math.round((seqDone / seqTotal) * 100) : 0;

    const bar = document.getElementById("projectionSeqBar");
    if (bar) bar.style.width = `${seqPercent}%`;
    document.getElementById("projectionSeqProgressText").textContent = `Séance ${seqDone} / ${seqTotal} (${seqPercent}%)`;

    const meta = state.sequenceMeta[activeSeqName] || {};
    const domainText = labelForDomain(meta.domain || seqLessons[0]?.domain || "autre");
    const domainBadge = document.getElementById("projectionSeqDomain");
    if (domainBadge) {
      domainBadge.textContent = domainText;
      domainBadge.style.background = meta.color || "var(--accent)";
      domainBadge.style.color = "#ffffff";
    }
    if (bar && meta.color) {
      bar.style.backgroundColor = meta.color;
    }

    const objectives = document.getElementById("projectionSeqObjectives");
    if (objectives) {
      objectives.textContent = meta.note || "Aucun objectif ou note saisi pour cette séquence.";
    }
  } else {
    document.getElementById("projectionSeqEmpty").classList.remove("hidden");
    document.getElementById("projectionSeqContent").classList.add("hidden");
  }

  const classEvents = allEvents().filter(matchesPlanningFilter);
  const milestones = getUpcomingMilestones(classEvents, now);

  const milestonesList = document.getElementById("projectionMilestonesList");
  if (milestonesList) {
    if (milestones.length === 0) {
      milestonesList.innerHTML = '<div class="projection-empty-msg">Aucune échéance à venir.</div>';
    } else {
      milestonesList.innerHTML = milestones.map(m => {
        const lessonsBefore = activeLessons.filter(e => !isEventDone(e, now) && e.dtstart < m.date).length;
        
        let badgeIcon = "🎯";
        let badgeClass = "type-evaluation";
        let countdownText = "";
        
        if (m.type === "ccf") {
          badgeIcon = "🔺";
          badgeClass = "type-ccf";
        } else if (m.type === "pfmp") {
          badgeIcon = "💼";
          badgeClass = "type-pfmp";
        } else if (m.type === "vacances") {
          badgeIcon = "🌴";
          badgeClass = "type-vacances";
        }

        if (lessonsBefore === 0) {
          countdownText = "Prochain cours";
        } else {
          countdownText = `Dans ${lessonsBefore} séance${lessonsBefore > 1 ? "s" : ""}`;
        }

        const isUrgent = lessonsBefore <= 2;
        const countdownClass = isUrgent && m.type !== "vacances" ? "milestone-countdown urgent" : "milestone-countdown";

        return `
          <div class="milestone-item ${badgeClass}">
            <div class="milestone-badge">${badgeIcon}</div>
            <div class="milestone-details">
              <span class="milestone-title">${escapeHtml(m.title)}</span>
              <span class="milestone-subtitle">${formatDate(m.date)} à ${formatTime(m.date)}</span>
            </div>
            <span class="${countdownClass}">${countdownText}</span>
          </div>
        `;
      }).join("");
    }
  }
  if (els.projectionSplitWrap) {
    els.projectionSplitWrap.innerHTML = renderProjectionSplitSummary(activeLessons, now);
  }
}

function renderProjectionSplitSummary(events, now) {
  if (!events.length) return '<div class="projection-empty-msg">Aucun cours visible.</div>';
  const columns = SUMMARY_DOMAINS
    .map((domain) => ({ domain, events: events.filter((event) => event.domain === domain) }))
    .filter((column) => column.events.length);
  
  return `
    ${renderSequenceLegend(events)}
    <div class="summary-columns" style="width: 100%; margin-top: 1rem;">
      ${columns.map((column) => `
        <section class="summary-domain domain-${safeClassName(column.domain)}">
          <h4 style="font-size: 1.1rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid var(--line); padding-bottom: 0.3rem; margin-top: 0;">
            <span>${escapeHtml(labelForDomain(column.domain))}</span>
            <span class="domain-count" style="font-size: 0.85rem; padding: 0.15rem 0.5rem; background: var(--bg); border-radius: 12px; color: var(--muted);">${column.events.length} séances</span>
          </h4>
          ${renderMonthGroups(column.events, now)}
        </section>
      `).join("")}
    </div>
  `;
}


function findActiveSequence(activeLessons, now) {
  const upcomingWithSeq = activeLessons.find(e => !isEventDone(e, now) && sequenceKey(e) !== "Sans séquence");
  if (upcomingWithSeq) return sequenceKey(upcomingWithSeq);
  
  const completedWithSeq = [...activeLessons].reverse().find(e => isEventDone(e, now) && sequenceKey(e) !== "Sans séquence");
  if (completedWithSeq) return sequenceKey(completedWithSeq);
  
  return null;
}

function getUpcomingMilestones(events, now) {
  const milestones = [];
  const processedVacationDays = new Set();
  const processedPfmpDays = new Set();
  
  const sortedEvents = [...events].sort((a, b) => a.dtstart - b.dtstart);
  
  for (const event of sortedEvents) {
    if (isEventDone(event, now)) continue;
    
    if (isVacancesEvent(event)) {
      const dateString = event.dtstart.toDateString();
      if (!processedVacationDays.has(dateString)) {
        milestones.push({
          type: "vacances",
          title: event.summary || "Vacances",
          date: event.dtstart,
          event
        });
        processedVacationDays.add(dateString);
      }
      continue;
    }
    
    if (event.type === "pfmp" || (event.summary && event.summary.toLowerCase().includes("pfmp"))) {
      const dateString = event.dtstart.toDateString();
      if (!processedPfmpDays.has(dateString)) {
        milestones.push({
          type: "pfmp",
          title: event.summary || "Stage PFMP",
          date: event.dtstart,
          event
        });
        processedPfmpDays.add(dateString);
      }
      continue;
    }
    
    const marker = evaluationMarker(event);
    if (marker) {
      milestones.push({
        type: marker === "ccf" ? "ccf" : "evaluation",
        title: event.summary || (marker === "ccf" ? "CCF" : "Évaluation"),
        date: event.dtstart,
        event
      });
    }
  }
  
  return milestones.slice(0, 4);
}

function isVacancesEvent(event) {
  const text = `${event.summary || ""} ${event.description || ""}`.toLowerCase();
  return text.includes("vacances") || 
         text.includes("férié") || 
         text.includes("ferie") || 
         text.includes("toussaint") || 
         text.includes("noël") || 
         text.includes("noel") || 
         text.includes("printemps") || 
         text.includes("pâques") || 
         text.includes("paques") || 
         text.includes("pont de");
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
  const allEventsList = allEvents().filter(matchesPlanningFilter).filter(isSummaryEvent);
  const clickedEvent = allEventsList.find(e => e.id === id);
  
  if (extendRange && state.summarySelectionAnchorId) {
    const anchorEvent = allEventsList.find(e => e.id === state.summarySelectionAnchorId);
    if (anchorEvent && clickedEvent && (state.summaryMode !== "split" || anchorEvent.domain === clickedEvent.domain)) {
      const domainFilter = state.summaryMode === "split" ? clickedEvent.domain : null;
      const targetList = domainFilter ? allEventsList.filter(e => e.domain === domainFilter) : allEventsList;
      
      const start = targetList.findIndex(e => e.id === state.summarySelectionAnchorId);
      const end = targetList.findIndex(e => e.id === id);
      if (start !== -1 && end !== -1) {
        const [from, to] = start < end ? [start, end] : [end, start];
        for (const ev of targetList.slice(from, to + 1)) {
          state.selectedSummaryIds.add(ev.id);
        }
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
  const isSequences = state.viewMode === "sequences";
  const isProjection = state.viewMode === "projection";
  document.body.dataset.view = state.viewMode;
  els.tablePanel.classList.toggle("hidden", !isTable);
  els.gridPanel.classList.toggle("hidden", !isGrid);
  els.summaryPanel.classList.toggle("hidden", !isSummary);
  els.sequencesPanel?.classList.toggle("hidden", !isSequences);
  els.projectionPanel?.classList.toggle("hidden", !isProjection);
  els.viewGrid?.classList.toggle("view-active", isGrid);
  els.viewSummary?.classList.toggle("view-active", isSummary);
  els.viewTable?.classList.toggle("view-active", isTable);
  els.viewSequences?.classList.toggle("view-active", isSequences);
  els.viewProjection?.classList.toggle("view-active", isProjection);
  if (els.controlsTitle) {
    els.controlsTitle.textContent = isSummary ? "Planification" : isGrid ? "Grille" : isSequences ? "Séquences" : isProjection ? "Mode Élèves" : "Liste";
  }
  if (isSequences) {
    initSequencesBuilderView();
  }
  localStorage.setItem("icstracteur.viewMode", state.viewMode);
}

function setViewMode(mode) {
  state.viewMode = ["grid", "summary", "table", "sequences", "projection"].includes(mode) ? mode : "table";
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
    allScannedFiles: state.allScannedFiles || [],
    settings: {
      classFilter: state.filters.className,
      groupFilter: state.filters.group,
      viewMode: state.viewMode,
      gridColumns: state.gridColumns,
      summaryOrientation: state.summaryOrientation,
      summaryMode: state.summaryMode,
      summaryZoom: state.summaryZoom,
      printFormat: state.printFormat,
      hiddenClasses: state.hiddenClasses,
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
  if (Array.isArray(payload.allScannedFiles)) {
    state.allScannedFiles = payload.allScannedFiles;
    saveAllScannedFiles();
  } else {
    const docs = new Set();
    for (const m of Object.values(state.sequenceMeta || {})) {
      if (m.documents && Array.isArray(m.documents)) {
        m.documents.forEach(d => docs.add(d));
      }
    }
    state.allScannedFiles = Array.from(docs).sort();
    saveAllScannedFiles();
  }
  const s = payload.settings || {};
  if (typeof s.classFilter === "string") state.filters.className = s.classFilter;
  if (typeof s.groupFilter === "string") state.filters.group = s.groupFilter;
  if (typeof s.viewMode === "string") state.viewMode = s.viewMode;
  if (s.gridColumns != null) state.gridColumns = clampGridCols(s.gridColumns);
  if (s.summaryOrientation === "portrait" || s.summaryOrientation === "landscape") state.summaryOrientation = s.summaryOrientation;
  if (s.summaryMode === "split" || s.summaryMode === "mixed") state.summaryMode = s.summaryMode;
  if (s.summaryZoom != null) state.summaryZoom = clampSummaryZoom(s.summaryZoom);
  if (typeof s.printFormat === "string") state.printFormat = s.printFormat;
  if (Array.isArray(s.hiddenClasses)) state.hiddenClasses = s.hiddenClasses;
  localStorage.setItem("icstracteur.classFilter", state.filters.className);
  localStorage.setItem("icstracteur.groupFilter", state.filters.group);
  localStorage.setItem("icstracteur.viewMode", state.viewMode);
  localStorage.setItem("icstracteur.gridColumns", String(state.gridColumns));
  localStorage.setItem("icstracteur.summaryOrientation", state.summaryOrientation);
  localStorage.setItem("icstracteur.summaryMode", state.summaryMode);
  localStorage.setItem("icstracteur.summaryZoom", String(state.summaryZoom));
  localStorage.setItem("icstracteur.printFormat", state.printFormat);
  localStorage.setItem("icstracteur.hiddenClasses", JSON.stringify(state.hiddenClasses));
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
  els.btnManageClasses?.addEventListener("click", openClassManager);
  els.closeClassManager?.addEventListener("click", () => els.classManagerDialog?.close());
  els.toggleTheme?.addEventListener("click", toggleTheme);
  els.folderImport?.addEventListener("change", async () => {
    const files = els.folderImport.files;
    if (files && files.length > 0) {
      await importFolderSequences(files);
      els.folderImport.value = "";
    }
  });
  els.printFormat?.addEventListener("change", () => {
    state.printFormat = els.printFormat.value;
    localStorage.setItem("icstracteur.printFormat", state.printFormat);
    updatePrintStyle();
  });

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
  els.viewSequences?.addEventListener("click", () => setViewMode("sequences"));
  els.viewProjection?.addEventListener("click", () => setViewMode("projection"));
  els.gridColumns.value = String(clampGridCols(state.gridColumns));
  els.summaryOrientation.value = state.summaryOrientation;
  if (els.printFormat) els.printFormat.value = state.printFormat;
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
    if (els.planningClassFilter) {
      els.planningClassFilter.value = els.classFilter.value;
    }
    updateFilters();
    render();
  });
  if (els.planningClassFilter) {
    els.planningClassFilter.addEventListener("change", () => {
      state.filters.className = els.planningClassFilter.value || "";
      localStorage.setItem("icstracteur.classFilter", state.filters.className);
      els.classFilter.value = els.planningClassFilter.value;
      updateFilters();
      render();
    });
  }
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

  // Collapsed panel states are managed via inline onclick="toggleSequencePanel(...)" handlers.

  // Restore collapsed panel states globally at startup
  try {
    restoreCollapsedPanels();
  } catch (err) {
    console.error("Error restoring collapsed panels state globally:", err);
  }
}

// ==========================================
// --- CLASS MANAGER (LOGIQUE) ---
// ==========================================

function openClassManager() {
  const detectedClasses = new Set();
  state.imported.forEach(event => {
    if (event.className) detectedClasses.add(event.className);
  });
  CANONICAL_CLASSES.forEach(c => detectedClasses.add(c));
  
  const sortedClasses = Array.from(detectedClasses).sort();
  
  els.classManagerList.innerHTML = "";
  sortedClasses.forEach(className => {
    const isHidden = state.hiddenClasses?.includes(className);
    const label = document.createElement("label");
    label.style.display = "flex";
    label.style.alignItems = "center";
    label.style.gap = "0.5rem";
    label.style.padding = "0.25rem 0";
    label.innerHTML = `
      <input type="checkbox" value="${className}"${!isHidden ? " checked" : ""}>
      <span>${className}</span>
    `;
    label.querySelector("input").addEventListener("change", (e) => {
      if (!e.target.checked) {
        if (!state.hiddenClasses.includes(className)) {
          state.hiddenClasses.push(className);
        }
      } else {
        state.hiddenClasses = state.hiddenClasses.filter(c => c !== className);
      }
      localStorage.setItem("icstracteur.hiddenClasses", JSON.stringify(state.hiddenClasses));
      reconcileFiltersAfterImport();
      updateFilters();
      render();
    });
    els.classManagerList.appendChild(label);
  });
  
  els.classManagerDialog?.showModal();
}

// ==========================================
// --- DOSSIERS COURS / SEQUENCES IMPORT ---
// ==========================================

async function importFolderSequences(files) {
  const seqsMap = new Map();
  const newScannedFiles = new Set(state.allScannedFiles || []);
  for (const file of files) {
    const path = file.webkitRelativePath || "";
    if (!path) continue;
    const parts = path.split("/").map(p => p.trim());
    if (parts.length < 2) continue;
    const fileName = parts[parts.length - 1];
    if (fileName.startsWith(".") || fileName === "Thumbs.db" || fileName.toLowerCase() === "desktop.ini") continue;
    
    // store relative path excluding the top-level selection folder name
    const subPath = parts.slice(1).join("/");
    newScannedFiles.add(subPath);
    
    // detect class context in parent folders
    let classContext = "";
    const classRegex = /\b(?:1BP|1CAP-AS|2CAP-AS|TBP|1ASSP|2ASSP|TASSP|1AEPA|TAEPA|2nde|1ere|Terminale|CAP)\b/i;
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      const match = part.match(/(?:202[4567]_)?\b(1BP|1CAP-AS|2CAP-AS|TBP|1ASSP|2ASSP|TASSP|1AEPA|TAEPA|2nde|1ere|Terminale|CAP)\b/i);
      if (match) {
        classContext = match[1].toUpperCase();
        break;
      }
    }
    if (!classContext) {
      for (let i = 0; i < parts.length - 1; i++) {
        if (classRegex.test(parts[i])) {
          classContext = parts[i];
          break;
        }
      }
    }
    
    // determine sequence name from parent folders
    let parentFolder = parts[parts.length - 2];
    const genericFolders = /^(?:cours|activites|tp|travaux\s+pratiques|evals?|evaluations?|controles?|exercices?|exos?|revisions?|docs?|documents?|ressources?|tests?|annexes?|fichiers?)$/i;
    if (genericFolders.test(parentFolder) && parts.length > 3) {
      parentFolder = parts[parts.length - 3];
    }
    
    if (parentFolder === parts[0] || (classContext && parentFolder.toLowerCase().includes(classContext.toLowerCase()))) {
      parentFolder = "Général";
    }
    
    let seqTitle = "";
    if (classContext && parentFolder !== "Général") {
      seqTitle = `${classContext} - ${parentFolder}`;
    } else if (classContext) {
      seqTitle = `${classContext} - Général`;
    } else {
      seqTitle = parentFolder;
    }
    
    if (!seqsMap.has(seqTitle)) {
      seqsMap.set(seqTitle, []);
    }
    seqsMap.get(seqTitle).push(subPath);
  }
  
  if (seqsMap.size === 0) {
    alert("Aucun fichier de cours valide détecté.");
    return;
  }
  
  state.allScannedFiles = Array.from(newScannedFiles).sort();
  saveAllScannedFiles();
  
  let addedCount = 0;
  let updatedCount = 0;
  for (const [title, docsList] of seqsMap.entries()) {
    const cleanTitle = title;
    
    // Vote domain
    const domainVotes = { maths: 0, sciences: 0, cointervention: 0, autre: 0 };
    const titleDomain = detectDomainInText(cleanTitle);
    if (titleDomain && titleDomain !== "autre") {
      domainVotes[titleDomain] += 3;
    }
    for (const doc of docsList) {
      const fileDomain = detectDomainInText(doc);
      if (fileDomain && fileDomain !== "autre") {
        domainVotes[fileDomain] += 1;
      }
    }
    let maxVotes = 0;
    let detectedDomain = "autre";
    for (const [dom, votes] of Object.entries(domainVotes)) {
      if (votes > maxVotes) {
        maxVotes = votes;
        detectedDomain = dom;
      }
    }
    
    // Detect level
    let detectedLevel = "2nde";
    const lowerTitle = cleanTitle.toLowerCase();
    if (lowerTitle.includes("1ere") || lowerTitle.includes("premiere") || lowerTitle.includes("1bp") || lowerTitle.includes("1cap")) {
      detectedLevel = "1ere";
    } else if (lowerTitle.includes("terminale") || lowerTitle.includes("tbp")) {
      detectedLevel = "Terminale";
    } else if (lowerTitle.includes("cap") || lowerTitle.includes("2cap")) {
      detectedLevel = "CAP";
    } else if (lowerTitle.includes("2nde") || lowerTitle.includes("seconde")) {
      detectedLevel = "2nde";
    }
    
    const color = sequenceColor(cleanTitle);
    const existing = state.plannedSequences.find((seq) => normalizeText(seq.title) === normalizeText(cleanTitle));
    if (existing) {
      existing.domain = detectedDomain !== "autre" ? detectedDomain : existing.domain;
      updatedCount++;
    } else {
      state.plannedSequences.push({
        id: `seq-${globalThis.crypto?.randomUUID?.() || Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        title: cleanTitle,
        domain: detectedDomain,
        start: null,
        end: null,
        slots: null,
        note: "",
      });
      addedCount++;
    }
    state.sequenceMeta[cleanTitle] = {
      ...(state.sequenceMeta[cleanTitle] || {}),
      domain: detectedDomain,
      color: state.sequenceMeta[cleanTitle]?.color || color,
      level: state.sequenceMeta[cleanTitle]?.level || detectedLevel,
      documents: docsList,
    };
  }
  
  savePlannedSequences();
  saveSequenceMeta();
  updateFilters();
  render();
  
  if (state.viewMode === "sequences") {
    renderSequencesBuilder();
  }
  
  alert(`Importation réussie :\n- Séquences créées ou enrichies : ${addedCount + updatedCount}\n- Fichiers indexés : ${newScannedFiles.size}`);
}

function saveAllScannedFiles() {
  localStorage.setItem("icstracteur.allScannedFiles", JSON.stringify(state.allScannedFiles || []));
}

function updatePrintStyle() {
  if (typeof document === "undefined") return;
  let styleEl = document.getElementById("print-page-style");
  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = "print-page-style";
    document.head.appendChild(styleEl);
  }
  const format = state.printFormat === "A3" ? "A3" : "A4";
  const orientation = state.summaryOrientation === "portrait" ? "portrait" : "landscape";
  styleEl.textContent = `
    @media print {
      @page {
        size: ${format} ${orientation};
        margin: 10mm;
      }
    }
  `;
}

// ==========================================
// --- THEME SOMBRE / CLAIR (LOGIQUE) ---
// ==========================================

function initTheme() {
  if (typeof window === "undefined" || typeof document === "undefined" || !document.body) return;
  const savedTheme = localStorage.getItem("icstracteur.theme");
  const systemPrefersDark = typeof window.matchMedia === "function" && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const isDark = savedTheme === "dark" || (!savedTheme && systemPrefersDark);
  document.body.classList.toggle("dark", isDark);
  updateThemeButton(isDark);
}

function toggleTheme() {
  const isDark = !document.body.classList.contains("dark");
  document.body.classList.toggle("dark", isDark);
  localStorage.setItem("icstracteur.theme", isDark ? "dark" : "light");
  updateThemeButton(isDark);
}

function updateThemeButton(isDark) {
  if (els.toggleTheme) {
    els.toggleTheme.textContent = isDark ? "☀️ Mode clair" : "🌙 Mode sombre";
  }
}

// ==========================================
// --- CONSTRUCTEUR DE SEQUENCES (LOGIQUE) ---
// ==========================================

let seqBuilderInitialized = false;

function initSequencesBuilderView() {
  if (seqBuilderInitialized) {
    renderSequencesBuilder();
    return;
  }
  
  // Bind horizontal banner events
  els.btnCreateSequenceInline.addEventListener("click", () => {
    const title = prompt("Saisissez le nom de la nouvelle séquence :");
    if (title === null) return;
    const cleanTitle = title.trim();
    if (!cleanTitle) {
      alert("Le nom de la séquence ne peut pas être vide.");
      return;
    }
    const normalized = normalizeText(cleanTitle);
    const existing = state.plannedSequences.find(s => normalizeText(s.title) === normalized);
    if (existing) {
      alert("Une séquence avec ce nom existe déjà.");
      return;
    }
    
    const id = `seq-${globalThis.crypto?.randomUUID?.() || Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const domain = "maths";
    const color = SEQUENCE_COLORS[state.plannedSequences.length % SEQUENCE_COLORS.length];
    
    state.plannedSequences.push({
      id: id,
      title: cleanTitle,
      domain: domain,
      start: null,
      end: null,
      slots: null,
      note: ""
    });
    
    state.sequenceMeta[cleanTitle] = {
      domain: domain,
      color: color,
      level: "2nde",
      hours: "0",
      note: "",
      documents: [],
      capacities: [],
      knowledges: [],
      sessions: {}
    };
    
    savePlannedSequences();
    saveSequenceMeta();
    updateFilters();
    render();
    
    state.selectedSequenceTitle = cleanTitle;
    state.selectedElementEventId = "";
    state.selectedElementIndex = null;
    renderSequencesBuilder();
  });

  // Bind forms & metadata change events
  els.seqBuilderLevel.addEventListener("change", updateBOModuleList);
  els.seqBuilderDomain.addEventListener("change", updateBOModuleList);
  els.boModuleSelect.addEventListener("change", renderBOModuleChecklists);
  
  els.seqBuilderFolderImport?.addEventListener("change", async () => {
    const files = els.seqBuilderFolderImport.files;
    if (files && files.length > 0) {
      await importFolderSequences(files);
      els.seqBuilderFolderImport.value = "";
    }
  });

  els.seqBuilderSave.addEventListener("click", () => {
    const activeTitle = state.selectedSequenceTitle;
    if (!activeTitle) return;
    
    const newTitle = els.seqBuilderTitle.value.trim();
    if (!newTitle) {
      alert("Veuillez saisir un nom pour la séquence.");
      return;
    }
    
    const domain = els.seqBuilderDomain.value;
    const color = els.seqBuilderColor.value;
    const level = els.seqBuilderLevel.value;
    const hours = els.seqBuilderHours.value || "0";
    const note = els.seqBuilderNote.value;
    const boModule = els.boModuleSelect.value;
    
    const checkedCaps = Array.from(els.boCapacitiesList.querySelectorAll("input[type='checkbox']:checked"))
      .map(cb => cb.value);
    const checkedKnows = Array.from(els.boKnowledgesList.querySelectorAll("input[type='checkbox']:checked"))
      .map(cb => cb.value);
    const checkedDocs = Array.from(els.seqBuilderDocsList.querySelectorAll("input[type='checkbox']:checked"))
      .map(cb => cb.value);
      
    if (activeTitle !== newTitle) {
      const existing = state.plannedSequences.find(s => normalizeText(s.title) === normalizeText(newTitle));
      if (existing) {
        alert("Une séquence avec ce nom existe déjà.");
        return;
      }
      renameSequenceEverywhere(activeTitle, newTitle);
    }
    
    const seqObj = state.plannedSequences.find(s => s.title === newTitle);
    if (seqObj) {
      seqObj.domain = domain;
      seqObj.note = note;
    }
    
    state.sequenceMeta[newTitle] = {
      ...(state.sequenceMeta[newTitle] || {}),
      domain: domain,
      color: color,
      level: level,
      hours: hours,
      note: note,
      module: boModule,
      documents: checkedDocs,
      capacities: checkedCaps,
      knowledges: checkedKnows
    };
    
    savePlannedSequences();
    saveSequenceMeta();
    updateFilters();
    render();
    
    alert("Séquence enregistrée !");
    state.selectedSequenceTitle = newTitle;
    renderSequencesBuilder();
  });
  
  els.seqBuilderDelete.addEventListener("click", () => {
    const activeTitle = state.selectedSequenceTitle;
    if (!activeTitle) return;
    
    if (confirm(`Supprimer la séquence "${activeTitle}" et retirer son affectation des séances ?`)) {
      state.plannedSequences = state.plannedSequences.filter(s => s.title !== activeTitle);
      delete state.sequenceMeta[activeTitle];
      
      for (const event of allEvents()) {
        if (sequenceKey(event) === activeTitle || normalizeText(state.annotations[event.id]?.plannedSequence) === activeTitle) {
          state.annotations[event.id] = {
            ...(state.annotations[event.id] || {}),
            plannedSequence: "Sans séquence",
          };
        }
      }
      
      savePlannedSequences();
      saveSequenceMeta();
      saveAnnotations();
      updateFilters();
      render();
      
      state.selectedSequenceTitle = "";
      state.selectedElementEventId = "";
      state.selectedElementIndex = null;
      renderSequencesBuilder();
    }
  });

  // Bind Activity Modal Dialog Events
  els.activityForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const eventId = els.activityEventId.value;
    const indexStr = els.activityIndex.value;
    const type = els.activityType.value;
    const title = els.activityTitle.value.trim();
    const doc = els.activityDoc.value;
    const url = els.activityUrl.value.trim();

    if (!title) return;

    const activeTitle = state.selectedSequenceTitle;
    if (!activeTitle) return;

    const meta = state.sequenceMeta[activeTitle] || {};
    if (!meta.sessions) meta.sessions = {};
    if (!meta.sessions[eventId]) meta.sessions[eventId] = [];

    const activityData = { type, title, doc, url };

    if (indexStr === "") {
      // Add
      meta.sessions[eventId].push(activityData);
    } else {
      // Edit
      const idx = Number(indexStr);
      if (meta.sessions[eventId][idx]) {
        meta.sessions[eventId][idx] = activityData;
      }
    }

    saveSequenceMeta();
    renderSequencesBuilder();
    els.activityDialog.close();
  });

  els.btnDeleteActivity.addEventListener("click", () => {
    const eventId = els.activityEventId.value;
    const indexStr = els.activityIndex.value;
    if (indexStr === "") return;

    const activeTitle = state.selectedSequenceTitle;
    if (!activeTitle) return;

    const meta = state.sequenceMeta[activeTitle] || {};
    if (meta.sessions && meta.sessions[eventId]) {
      const idx = Number(indexStr);
      meta.sessions[eventId].splice(idx, 1);
      if (meta.sessions[eventId].length === 0) {
        delete meta.sessions[eventId];
      }
    }

    saveSequenceMeta();
    renderSequencesBuilder();
    els.activityDialog.close();
  });

  els.closeActivityDialog.addEventListener("click", () => {
    els.activityDialog.close();
  });

  // Bind Split Planning Selection click/shift-click
  els.seqBuilderPlanningWrap.addEventListener("click", (event) => {
    const chip = event.target.closest(".sequence-chip");
    if (chip?.dataset.sequence) {
      const seqTitle = chip.dataset.sequence;
      if (seqTitle !== "Sans séquence") {
        state.selectedSequenceTitle = seqTitle;
        state.selectedElementEventId = "";
        state.selectedElementIndex = null;
        renderSequencesBuilder();
      }
      return;
    }
    
    const btn = event.target.closest(".summary-square");
    if (!btn) return;
    
    const eventId = btn.dataset.id;
    const activeTitle = state.selectedSequenceTitle;
    if (!activeTitle) {
      alert("Veuillez d'abord sélectionner ou créer une séquence dans le bandeau supérieur.");
      return;
    }
    
    const allPlanningEvents = allEvents().filter(matchesPlanningFilter).filter(isSummaryEvent);
    const eventObj = allPlanningEvents.find(e => e.id === eventId);
    if (!eventObj) return;
    
    if (specialEventMarker(eventObj) === "class-absent") {
      alert("Impossible d'affecter une séquence à un jour d'absence de la classe.");
      return;
    }
    
    if (event.shiftKey && state.summarySelectionAnchorId) {
      const targetDomain = eventObj.domain;
      const domainEvents = allPlanningEvents.filter(e => e.domain === targetDomain);
      const anchorIndex = domainEvents.findIndex(e => e.id === state.summarySelectionAnchorId);
      const currentIndex = domainEvents.findIndex(e => e.id === eventId);
      
      if (anchorIndex !== -1 && currentIndex !== -1) {
        const startIdx = Math.min(anchorIndex, currentIndex);
        const endIdx = Math.max(anchorIndex, currentIndex);
        const targetEvents = domainEvents.slice(startIdx, endIdx + 1);
        
        const firstIsAssigned = (sequenceKey(targetEvents[0]) === activeTitle);
        const newSeq = firstIsAssigned ? "Sans séquence" : activeTitle;
        
        for (const ev of targetEvents) {
          if (specialEventMarker(ev) === "class-absent") continue;
          state.annotations[ev.id] = {
            ...(state.annotations[ev.id] || {}),
            plannedSequence: newSeq
          };
        }
        
        saveAnnotations();
        render();
        renderSequencesBuilder();
        return;
      }
    }
    
    state.summarySelectionAnchorId = eventId;
    const currentSeq = sequenceKey(eventObj);
    const newSeq = currentSeq === activeTitle ? "Sans séquence" : activeTitle;
    
    state.annotations[eventObj.id] = {
      ...(state.annotations[eventObj.id] || {}),
      plannedSequence: newSeq
    };
    
    saveAnnotations();
    render();
    renderSequencesBuilder();
  });
  
  seqBuilderInitialized = true;
  renderSequencesBuilder();
}

function renderSequencesBuilder() {
  renderSequencesBanner();
  
  const activeTitle = state.selectedSequenceTitle || "";
  const allPlanningEvents = allEvents().filter(matchesPlanningFilter);
  const activeLessons = allPlanningEvents.filter(isSummaryEvent);
  
  // Render split planning grid
  const now = new Date();
  els.seqBuilderPlanningWrap.innerHTML = renderSequencesBuilderPlanning(activeLessons, now);
  
  if (!activeTitle || !state.plannedSequences.some(s => s.title === activeTitle)) {
    state.selectedSequenceTitle = "";
    els.seqBuilderTimelineEmpty.classList.remove("hidden");
    els.seqBuilderTimelineContent.classList.add("hidden");
    state.selectedElementEventId = "";
    state.selectedElementIndex = null;
    renderElementEditor();
    return;
  }
  
  els.seqBuilderTimelineEmpty.classList.add("hidden");
  els.seqBuilderTimelineContent.classList.remove("hidden");
  
  loadSelectedSequenceForBuilder();
  renderSequencesBuilderTimeline(activeTitle, activeLessons);
  renderElementEditor();
}

function renderSequencesBanner() {
  if (!els.seqBuilderBanner) return;
  els.seqBuilderBanner.innerHTML = "";
  
  const activeTitle = state.selectedSequenceTitle || "";
  const allPlanningEvents = allEvents().filter(matchesPlanningFilter).filter(isSummaryEvent);
  
  for (const seq of state.plannedSequences) {
    const meta = state.sequenceMeta[seq.title] || {};
    const seqLessons = allPlanningEvents.filter(e => sequenceKey(e) === seq.title);
    const totalMinutes = seqLessons.reduce((sum, e) => sum + pedagogicalDurationMinutes(e), 0);
    const hoursText = formatDuration(totalMinutes);
    
    const row = document.createElement("tr");
    row.className = `seq-list-row ${seq.title === activeTitle ? "active" : ""}`;
    row.style.setProperty("--seq-color", meta.color || "#3b82f6");
    
    row.innerHTML = `
      <td>
        <div class="seq-name-cell">
          <span class="seq-color-dot" style="background: ${meta.color || '#3b82f6'};"></span>
          <span class="seq-title-text" title="${escapeHtml(seq.title)}">${escapeHtml(seq.title)}</span>
        </div>
      </td>
      <td style="text-align: right; vertical-align: middle;">
        <span class="seq-duration-badge">${hoursText}</span>
      </td>
    `;
    
    row.addEventListener("click", () => {
      state.selectedSequenceTitle = seq.title;
      state.selectedElementEventId = "";
      state.selectedElementIndex = null;
      renderSequencesBuilder();
    });
    
    els.seqBuilderBanner.appendChild(row);
  }
}

function restoreCollapsedPanels() {
  console.log("restoreCollapsedPanels called");
  let collapsedStates = {};
  try {
    collapsedStates = JSON.parse(localStorage.getItem("icstracteur.collapsedPanels") || "{}");
  } catch (e) {
    console.error("Failed to parse collapsedPanels in restoreCollapsedPanels:", e);
    return;
  }
  
  for (const [panelKey, isCollapsed] of Object.entries(collapsedStates)) {
    try {
      const panelEl = {
        planning: document.getElementById("panelPlanning"),
        banner: document.getElementById("panelBanner"),
        timeline: document.getElementById("panelTimeline"),
        editor: document.getElementById("panelEditor")
      }[panelKey];
      
      if (panelEl) {
        panelEl.classList.toggle("collapsed", !!isCollapsed);
        const btn = panelEl.querySelector(".panel-collapse-btn");
        if (btn) {
          btn.textContent = isCollapsed ? "▶" : "▼";
        }
        const parentEl = panelEl.parentElement;
        if (parentEl) {
          parentEl.classList.toggle(`${panelKey}-collapsed`, !!isCollapsed);
        }
        console.log("Restored panel", panelKey, "collapsed state to:", !!isCollapsed);
      }
    } catch (err) {
      console.error("Error restoring panel state for:", panelKey, err);
    }
  }
}
window.restoreCollapsedPanels = restoreCollapsedPanels;

function toggleSequencePanel(panelKey) {
  console.log("toggleSequencePanel called for", panelKey);
  const panelEl = {
    planning: document.getElementById("panelPlanning"),
    banner: document.getElementById("panelBanner"),
    timeline: document.getElementById("panelTimeline"),
    editor: document.getElementById("panelEditor")
  }[panelKey];
  
  if (!panelEl) return;
  
  const isCollapsed = panelEl.classList.toggle("collapsed");
  
  // Update triangle icon/button text
  const btn = panelEl.querySelector(".panel-collapse-btn");
  if (btn) {
    btn.textContent = isCollapsed ? "▶" : "▼";
  }
  
  // Toggle parent layout width adjustment class
  const parentEl = panelEl.parentElement;
  if (parentEl) {
    parentEl.classList.toggle(`${panelKey}-collapsed`, isCollapsed);
  }
  
  // Save state
  let collapsedStates = {};
  try {
    collapsedStates = JSON.parse(localStorage.getItem("icstracteur.collapsedPanels") || "{}");
  } catch (e) {}
  collapsedStates[panelKey] = isCollapsed;
  try {
    localStorage.setItem("icstracteur.collapsedPanels", JSON.stringify(collapsedStates));
  } catch (e) {}
}
window.toggleSequencePanel = toggleSequencePanel;

function loadSelectedSequenceForBuilder() {
  const title = state.selectedSequenceTitle;
  if (!title) return;
  
  const meta = state.sequenceMeta[title] || {};
  els.seqBuilderTitle.value = title;
  els.seqBuilderDomain.value = meta.domain || "maths";
  els.seqBuilderColor.value = meta.color || "#3b82f6";
  els.seqBuilderLevel.value = meta.level || "2nde";
  els.seqBuilderHours.value = meta.hours || "0";
  els.seqBuilderNote.value = meta.note || "";
  
  updateBOModuleList();
  renderScannedDocsList(meta);
}

function renderSequencesBuilderPlanning(events, now) {
  if (!events.length) return '<div class="projection-empty-msg">Aucun cours visible pour ce filtre.</div>';
  const columns = SUMMARY_DOMAINS
    .map((domain) => ({ domain, events: events.filter((event) => event.domain === domain) }))
    .filter((column) => column.events.length);
  
  return `
    <div class="summary-columns" style="width: 100%; margin-bottom: 1rem;">
      ${columns.map((column) => `
        <section class="summary-domain domain-${safeClassName(column.domain)}">
          <h4 style="font-size: 0.9rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid var(--line); padding-bottom: 0.2rem; margin-top: 0;">
            <span>${escapeHtml(labelForDomain(column.domain))}</span>
            <span class="domain-count" style="font-size: 0.75rem; padding: 0.1rem 0.4rem; background: var(--bg); border-radius: 10px; color: var(--muted);">${column.events.length}</span>
          </h4>
          ${renderSequencesBuilderMonthGroups(column.events, now)}
        </section>
      `).join("")}
    </div>
    ${renderSequenceLegend(events)}
  `;
}

function renderSequencesBuilderMonthGroups(events, now) {
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
          <legend style="font-size: 0.75rem;">${escapeHtml(formatMonth(monthEvents[0]?.dtstart))}</legend>
          <div class="summary-squares">${monthEvents.map((event) => renderSequencesBuilderSquare(event, now)).join("")}</div>
        </fieldset>
      `).join("")}
    </div>
  `;
}

function renderSequencesBuilderSquare(event, now) {
  const done = isEventDone(event, now);
  const marker = evaluationMarker(event);
  const special = specialEventMarker(event);
  const key = sequenceKey(event);
  const color = special ? "#ffffff" : sequenceColor(key);
  const tooltip = buildSummaryEventTooltip(event);
  
  const activeTitle = state.selectedSequenceTitle || "";
  const isActiveSeq = key !== "Sans séquence" && key === activeTitle;
  const isOtherSeq = key !== "Sans séquence" && key !== activeTitle;
  
  let borderStyle = "";
  if (isActiveSeq) {
    borderStyle = "border: 2px solid var(--accent); box-shadow: 0 0 0 1px white;";
  }
  
  return `
    <button
      type="button"
      class="summary-square ${done ? "filled" : "empty"} ${key === "Sans sequence" || key === "Sans séquence" ? "unassigned" : ""} ${isActiveSeq ? "active-seq" : ""} ${isOtherSeq ? "other-seq" : ""} domain-${safeClassName(event.domain)} ${marker ? `marker-${marker}` : ""} ${special ? `special-${special}` : ""}"
      style="--sequence-color: ${color}; ${borderStyle}"
      data-id="${escapeHtml(event.id)}"
      title="${escapeHtml(tooltip)}"
      aria-label="${escapeHtml(tooltip)}"
    ></button>
  `;
}

function normalizeSessionActivity(act) {
  if (!act) return { type: "activite", title: "Nouvel élément", duration: 15, docs: [], urls: [] };
  const typeMap = {
    "cours": "activite",
    "exercice": "activite",
    "tp": "activite",
    "eval-courte": "mini-eval",
    "eval-longue": "devoir"
  };
  const type = typeMap[act.type] || act.type || "activite";
  
  return {
    type: type,
    title: act.title || "",
    duration: typeof act.duration === "number" ? act.duration : 15,
    docs: Array.isArray(act.docs) ? act.docs : (act.doc ? [act.doc] : []),
    urls: Array.isArray(act.urls) ? act.urls : (act.url ? [act.url] : [])
  };
}

function labelForElementType(type) {
  const labels = {
    "appel": "Appel",
    "automatisme": "Automatisme",
    "activite": "Activité",
    "mini-eval": "Mini éval.",
    "devoir": "Devoir",
    "correction": "Correction"
  };
  return labels[type] || "Activité";
}
function renderElementEditor() {
  const container = els.seqBuilderEditorContent;
  if (!container) return;
  
  const activeTitle = state.selectedSequenceTitle;
  if (!activeTitle) {
    container.innerHTML = "";
    els.seqBuilderSequenceConfig?.classList.add("hidden");
    return;
  }
  
  const eventId = state.selectedElementEventId;
  const idx = state.selectedElementIndex;
  
  if (!eventId || idx === null) {
    els.seqBuilderSequenceConfig?.classList.remove("hidden");
    container.innerHTML = `
      <div class="element-legend-panel" style="display: flex; flex-direction: column; gap: 0.75rem; border-top: 1px solid var(--line); padding-top: 0.75rem; margin-top: 0.5rem; width: 100%;">
        <h4 style="margin: 0 0 0.5rem 0; font-size: 0.95rem; font-weight: 600;">🧩 Légende des éléments</h4>
        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
          <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.82rem;">
            <span style="width: 28px; height: 18px; border-radius: 3px; display: inline-block; border: 1px solid rgba(0,0,0,0.1);" class="builder-block type-appel"></span>
            <span>Appel (Présence)</span>
          </div>
          <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.82rem;">
            <span style="width: 28px; height: 18px; border-radius: 3px; display: inline-block; border: 1px solid rgba(0,0,0,0.1);" class="builder-block type-automatisme"></span>
            <span>Automatisme (Calcul mental, flash...)</span>
          </div>
          <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.82rem;">
            <span style="width: 28px; height: 18px; border-radius: 3px; display: inline-block; border: 1px solid rgba(0,0,0,0.1);" class="builder-block type-activite"></span>
            <span>Activité (Cours / TP)</span>
          </div>
          <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.82rem;">
            <span style="width: 28px; height: 18px; border-radius: 3px; display: inline-block; border: 1px solid rgba(0,0,0,0.1);" class="builder-block type-mini-eval"></span>
            <span>Mini éval. (Test court)</span>
          </div>
          <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.82rem;">
            <span style="width: 28px; height: 18px; border-radius: 3px; display: inline-block; border: 1px solid rgba(0,0,0,0.1);" class="builder-block type-devoir"></span>
            <span>Devoir (Contrôle long / DM)</span>
          </div>
          <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.82rem;">
            <span style="width: 28px; height: 18px; border-radius: 3px; display: inline-block; border: 1px solid rgba(0,0,0,0.1);" class="builder-block type-correction"></span>
            <span>Correction</span>
          </div>
        </div>
        <p class="field-hint" style="margin-top: 1rem; border-top: 1px dashed var(--line); padding-top: 0.75rem;">
          💡 Cliquez sur un bloc coloré dans la ligne horaire d'une séance pour configurer ses détails et ressources.
        </p>
      </div>
    `;
    return;
  }
  
  els.seqBuilderSequenceConfig?.classList.add("hidden");
  const meta = state.sequenceMeta[activeTitle] || {};
  const sessionsObj = meta.sessions || {};
  const activities = sessionsObj[eventId] || [];
  const act = activities[idx];
  
  if (!act) {
    state.selectedElementEventId = "";
    state.selectedElementIndex = null;
    renderElementEditor();
    return;
  }
  
  const normAct = normalizeSessionActivity(act);
  const docsArray = state.allScannedFiles || [];
  const activeDocs = normAct.docs || [];
  const urlsText = (normAct.urls || []).join("\n");
  
  let docsHtml = "";
  if (docsArray.length === 0) {
    docsHtml = `<span class="field-hint">Aucun document scanné disponible.</span>`;
  } else {
    docsHtml = docsArray.map(doc => {
      const filename = doc.split("/").pop();
      const isChecked = activeDocs.includes(doc);
      return `
        <label style="display: flex; align-items: flex-start; gap: 0.4rem; font-size: 0.78rem; cursor: pointer; color: var(--text);">
          <input type="checkbox" class="editor-doc-cb" value="${escapeHtml(doc)}"${isChecked ? " checked" : ""}>
          <span>${escapeHtml(filename)}</span>
        </label>
      `;
    }).join("");
  }
  
  const activeTab = state.activeResourceTab || "docs";
  let tabContentHtml = "";
  if (activeTab === "docs") {
    tabContentHtml = `
      <div class="editor-docs-list-container" style="display: flex; flex-direction: column; gap: 0.25rem; width: 100%;">
        <span class="field-hint" style="margin-bottom: 0.15rem; font-size: 0.75rem; color: var(--text-muted);">Associer des documents scannés :</span>
        <div id="editorScannedDocsList" style="border: 1px solid var(--line); border-radius: 6px; padding: 0.5rem; background: var(--bg); max-height: 140px; overflow-y: auto; display: flex; flex-direction: column; gap: 0.35rem; width: 100%; box-sizing: border-box;">
          ${docsHtml}
        </div>
      </div>
    `;
  } else {
    tabContentHtml = `
      <div class="editor-urls-container" style="display: flex; flex-direction: column; gap: 0.25rem; width: 100%;">
        <span class="field-hint" style="font-size: 0.75rem; color: var(--text-muted);">Liens URLs (un par ligne) :</span>
        <textarea id="editorUrlsText" rows="5" placeholder="https://..." style="width: 100%; padding: 0.45rem; border-radius: 6px; border: 1px solid var(--line); background: var(--bg); color: var(--text); font-family: monospace; font-size: 0.78rem; resize: vertical; box-sizing: border-box;">${escapeHtml(urlsText)}</textarea>
      </div>
    `;
  }

  container.innerHTML = `
    <div class="element-editor-panel" style="display: flex; flex-direction: column; gap: 1rem; width: 100%;">
      <h4 style="margin: 0; font-size: 0.95rem; font-weight: 600; color: var(--accent); display: flex; align-items: center; justify-content: space-between;">
        <span>⚙️ Configurer l'élément</span>
        <button type="button" class="btn-deselect-element" style="background: transparent; border: none; color: var(--muted); cursor: pointer; font-size: 1.1rem; line-height: 1;">×</button>
      </h4>
      
      <div style="display: flex; flex-direction: column; gap: 0.75rem;">
        <label style="font-size: 0.8rem; font-weight: 600; display: flex; flex-direction: column; gap: 0.25rem; color: var(--text);">
          Type d'élément
          <select id="editElementType" style="width: 100%; padding: 0.45rem; border-radius: 6px; border: 1px solid var(--line); background: var(--bg); color: var(--text);">
            <option value="appel"${normAct.type === "appel" ? " selected" : ""}>📘 Appel</option>
            <option value="automatisme"${normAct.type === "automatisme" ? " selected" : ""}>🟥 Automatisme</option>
            <option value="activite"${normAct.type === "activite" ? " selected" : ""}>🟩 Activité</option>
            <option value="mini-eval"${normAct.type === "mini-eval" ? " selected" : ""}>🟦 Mini éval.</option>
            <option value="devoir"${normAct.type === "devoir" ? " selected" : ""}>🟫 Devoir</option>
            <option value="correction"${normAct.type === "correction" ? " selected" : ""}>🟢 Correction</option>
          </select>
        </label>
        
        <label style="font-size: 0.8rem; font-weight: 600; display: flex; flex-direction: column; gap: 0.25rem; color: var(--text);">
          Titre / Description
          <input type="text" id="editElementTitle" placeholder="ex: Calcul mental..." value="${escapeHtml(normAct.title)}" style="width: 100%; padding: 0.45rem; border-radius: 6px; border: 1px solid var(--line); background: var(--bg); color: var(--text);" />
        </label>
        
        <label style="font-size: 0.8rem; font-weight: 600; display: flex; flex-direction: column; gap: 0.25rem; color: var(--text);">
          Durée (minutes)
          <input type="number" id="editElementDuration" min="1" max="120" value="${normAct.duration}" style="width: 100%; padding: 0.45rem; border-radius: 6px; border: 1px solid var(--line); background: var(--bg); color: var(--text);" />
        </label>
        
        <button type="button" id="btnDeleteSelectedElement" class="danger" style="width: 100%; padding: 0.45rem; border-radius: 6px; font-size: 0.82rem; color: var(--danger); border: 1px solid var(--line); background: var(--panel); cursor: pointer; transition: background 0.2s;">Supprimer cet élément</button>
      </div>
      
      <div class="editor-resources-section" style="border-top: 1px solid var(--line); padding-top: 0.75rem; display: flex; flex-direction: column; gap: 0.5rem; width: 100%;">
        <h4 style="margin: 0; font-size: 0.9rem; font-weight: 600; color: var(--text);">📎 Ressources associées</h4>
                <div class="editor-tabs" style="display: flex; gap: 0.25rem; margin-bottom: 0.25rem; border-bottom: 1.5px solid var(--line); padding-bottom: 0.25rem; width: 100%;">
          <button type="button" class="editor-tab ${activeTab === 'docs' ? 'active-tab' : ''}" data-tab="docs" style="flex: 1; padding: 0.35rem 0.5rem; font-size: 0.8rem; font-weight: 600; border-radius: 4px 4px 0 0; border: none; cursor: pointer; background: ${activeTab === 'docs' ? 'var(--accent)' : 'transparent'}; color: ${activeTab === 'docs' ? 'white' : 'var(--muted)'}; transition: all 0.2s;">📁 Fichiers</button>
          <button type="button" class="editor-tab ${activeTab === 'urls' ? 'active-tab' : ''}" data-tab="urls" style="flex: 1; padding: 0.35rem 0.5rem; font-size: 0.8rem; font-weight: 600; border-radius: 4px 4px 0 0; border: none; cursor: pointer; background: ${activeTab === 'urls' ? 'var(--accent)' : 'transparent'}; color: ${activeTab === 'urls' ? 'white' : 'var(--muted)'}; transition: all 0.2s;">🔗 Liens Web</button>
        </div>
        ${tabContentHtml}
      </div>
    </div>
  `;
  
  const selectType = container.querySelector("#editElementType");
  const inputTitle = container.querySelector("#editElementTitle");
  const inputDuration = container.querySelector("#editElementDuration");
  const textareaUrls = container.querySelector("#editorUrlsText");
  const btnDelete = container.querySelector("#btnDeleteSelectedElement");
  const btnClose = container.querySelector(".btn-deselect-element");
  
  const saveChange = () => {
    const activeTitle = state.selectedSequenceTitle;
    if (!activeTitle) return;
    
    const meta = state.sequenceMeta[activeTitle] || {};
    if (!meta.sessions || !meta.sessions[eventId] || !meta.sessions[eventId][idx]) return;
    
    const element = meta.sessions[eventId][idx];
    
    const allPlanningEvents = allEvents().filter(matchesPlanningFilter);
    const event = allPlanningEvents.find(e => e.id === eventId);
    if (!event) return;
    
    const totalDuration = eventDurationMinutes(event) || 55;
    const otherElements = meta.sessions[eventId].filter((_, i) => i !== idx);
    const otherUsed = otherElements.reduce((sum, act) => sum + (Number(act.duration) || 0), 0);
    const maxAvailable = Math.max(1, totalDuration - otherUsed);
    
    let durationVal = Math.max(1, Number(inputDuration.value) || 1);
    if (durationVal > maxAvailable) {
      durationVal = maxAvailable;
      inputDuration.value = durationVal;
    }
    
    element.type = selectType.value;
    element.title = inputTitle.value.trim();
    element.duration = durationVal;
    
    if (textareaUrls) {
      element.urls = textareaUrls.value.split("\n").map(l => l.trim()).filter(Boolean);
    }
    
    const docCheckboxes = container.querySelectorAll(".editor-doc-cb");
    if (docCheckboxes.length > 0) {
      const checkedDocs = Array.from(docCheckboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value);
      element.docs = checkedDocs;
    }
    
    saveSequenceMeta();
    
    const activeLessons = allPlanningEvents.filter(isSummaryEvent);
    renderSequencesBuilderTimeline(activeTitle, activeLessons);
    renderSequencesBanner();
  };
  
  selectType.addEventListener("change", saveChange);
  inputTitle.addEventListener("input", saveChange);
  inputDuration.addEventListener("input", saveChange);
  if (textareaUrls) textareaUrls.addEventListener("input", saveChange);
  
  container.querySelectorAll(".editor-doc-cb").forEach(cb => {
    cb.addEventListener("change", saveChange);
  });
  
  container.querySelectorAll(".editor-tab").forEach(tabBtn => {
    tabBtn.addEventListener("click", () => {
      saveChange();
      state.activeResourceTab = tabBtn.dataset.tab;
      renderElementEditor();
    });
  });
  
  btnDelete.addEventListener("click", () => {
    const activeTitle = state.selectedSequenceTitle;
    if (!activeTitle) return;
    
    const meta = state.sequenceMeta[activeTitle] || {};
    if (meta.sessions && meta.sessions[eventId]) {
      meta.sessions[eventId].splice(idx, 1);
      if (meta.sessions[eventId].length === 0) {
        delete meta.sessions[eventId];
      }
    }
    
    state.selectedElementEventId = "";
    state.selectedElementIndex = null;
    
    saveSequenceMeta();
    renderSequencesBuilder();
    renderElementEditor();
  });
  
  btnClose.addEventListener("click", () => {
    state.selectedElementEventId = "";
    state.selectedElementIndex = null;
    renderSequencesBuilder();
    renderElementEditor();
  });
}

function addNewElementToSession(eventId) {
  const activeTitle = state.selectedSequenceTitle;
  if (!activeTitle) return;
  
  const allPlanningEvents = allEvents().filter(matchesPlanningFilter);
  const event = allPlanningEvents.find(e => e.id === eventId);
  if (!event) return;
  
  const totalDuration = eventDurationMinutes(event) || 55;
  const meta = state.sequenceMeta[activeTitle] || {};
  if (!meta.sessions) meta.sessions = {};
  if (!meta.sessions[eventId]) meta.sessions[eventId] = [];
  
  const normActivities = meta.sessions[eventId].map(normalizeSessionActivity);
  const usedMinutes = normActivities.reduce((sum, act) => sum + (Number(act.duration) || 0), 0);
  const remaining = Math.max(0, totalDuration - usedMinutes);
  
  if (remaining <= 0) {
    alert("La séance est déjà pleine (durée maximale atteinte).");
    return;
  }
  
  const newDuration = Math.min(15, remaining);
  const newElement = {
    type: "activite",
    title: "Nouvel élément",
    duration: newDuration,
    docs: [],
    urls: []
  };
  
  meta.sessions[eventId].push(newElement);
  
  state.selectedElementEventId = eventId;
  state.selectedElementIndex = meta.sessions[eventId].length - 1;
  
  saveSequenceMeta();
  renderSequencesBuilder();
  renderElementEditor();
}

function renderSequencesBuilderTimeline(activeTitle, activeLessons) {
  const timeline = els.seqBuilderTimeline;
  if (!timeline) return;
  
  const seqLessons = activeLessons.filter(e => sequenceKey(e) === activeTitle).sort((a, b) => a.dtstart - b.dtstart);
  
  const totalMinutes = seqLessons.reduce((sum, e) => sum + pedagogicalDurationMinutes(e), 0);
  if (els.seqBuilderHoursCalculated) els.seqBuilderHoursCalculated.textContent = formatDuration(totalMinutes);
  
  if (seqLessons.length === 0) {
    timeline.innerHTML = '<div class="projection-empty-msg" style="padding: 2rem 1rem; font-size: 0.88rem;">Aucune séance rattachée à cette séquence. Cliquez sur les carrés du planning à gauche pour y rattacher des cours.</div>';
    return;
  }
  
  const meta = state.sequenceMeta[activeTitle] || {};
  const sessionsObj = meta.sessions || {};
    timeline.innerHTML = seqLessons.map((event, idx) => {
    const rawActivities = sessionsObj[event.id] || [];
    const normActivities = rawActivities.map(normalizeSessionActivity);
    
    const totalDuration = eventDurationMinutes(event) || 55;
    const usedMinutes = normActivities.reduce((sum, act) => sum + (Number(act.duration) || 0), 0);
    const remainingMinutes = Math.max(0, totalDuration - usedMinutes);
    
    let blocksHtml = "";
    
    normActivities.forEach((act, blockIdx) => {
      const isSelected = state.selectedElementEventId === event.id && state.selectedElementIndex === blockIdx;
      const widthPercent = (act.duration / totalDuration) * 100;
      
      const typeLabel = act.type === "appel" ? "📘" :
                        act.type === "automatisme" ? "🟥" :
                        act.type === "activite" ? "🟩" :
                        act.type === "mini-eval" ? "🟦" :
                        act.type === "devoir" ? "🟫" : "🟢";
                        
      const hasAttachment = (act.docs && act.docs.length > 0) || (act.urls && act.urls.length > 0);
      const tooltip = `${escapeHtml(act.title || labelForElementType(act.type))} (${act.duration} min)${hasAttachment ? '\n[Pièces jointes]' : ''}`;
      
      blocksHtml += `
        <div class="builder-block type-${escapeHtml(act.type)} ${isSelected ? 'active-block' : ''}" 
             style="width: ${widthPercent}%;"
             data-event-id="${escapeHtml(event.id)}"
             data-index="${blockIdx}"
             title="${escapeHtml(tooltip)}">
          <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${typeLabel} ${escapeHtml(act.title || labelForElementType(act.type))}</span>
          ${hasAttachment ? '<span style="font-size: 0.65rem; margin-left: 0.2rem;">📎</span>' : ""}
        </div>
      `;
    });
    
    if (remainingMinutes > 0) {
      const widthPercent = (remainingMinutes / totalDuration) * 100;
      const isVide = normActivities.length === 0;
      blocksHtml += `
        <div class="builder-block block-empty ${isVide ? 'bandeau-vide' : ''}"
             style="width: ${widthPercent}%;"
             data-event-id="${escapeHtml(event.id)}"
             data-action="fill"
             title="${isVide ? 'Séance vide. Cliquez pour ajouter un élément.' : 'Temps restant : ' + remainingMinutes + ' min. Cliquez pour ajouter.'}">
          <span>${isVide ? 'Bandeau non rempli' : '+'} (${remainingMinutes} min)</span>
        </div>
      `;
    }
    
    return `
      <div class="timeline-session-row" style="display: flex; align-items: center; gap: 0.75rem; border: 1px solid var(--line); border-radius: 8px; background: var(--bg); padding: 0.5rem 0.75rem; min-height: 64px;">
        <div class="timeline-session-time" style="flex: 0 0 auto; display: flex; flex-direction: column; align-items: flex-start; min-width: 95px;">
          <span class="timeline-session-date" style="font-weight: bold; font-size: 0.85rem; color: var(--accent);">Jour ${idx + 1}</span>
          <span class="timeline-session-date" style="font-size: 0.8rem; color: var(--text); opacity: 0.9;">${escapeHtml(formatDate(event.dtstart))}</span>
          <span class="timeline-session-hours" style="font-size: 0.72rem; color: var(--muted);">${formatTime(event.dtstart)} - ${formatTime(event.dtend || event.dtstart)}</span>
        </div>
        
        <div class="timeline-session-bar-wrap" style="flex: 1; display: flex; align-items: center; gap: 0.5rem; min-width: 0;">
          <button type="button" class="btn-add-element" data-event-id="${escapeHtml(event.id)}" title="Ajouter un élément" style="width: 26px; height: 26px; border-radius: 50%; border: 1px dashed var(--line); color: var(--muted); font-weight: bold; background: var(--panel); cursor: pointer; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 1rem;">+</button>
          
          <div class="session-timeline-bar-container" style="flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 0.15rem;">
            <div class="session-timeline-scale" style="display: flex; justify-content: space-between; font-size: 0.68rem; color: var(--muted); margin-bottom: 0.1rem; padding: 0 0.2rem;">
              <span>${formatTime(event.dtstart)}</span>
              <span style="opacity: 0.6; font-size: 0.65rem;">${totalDuration} min</span>
              <span>${formatTime(event.dtend || event.dtstart)}</span>
            </div>
            
            <div class="session-timeline-bar" style="display: flex; height: 32px; border: 1.5px solid var(--line); border-radius: 6px; background: var(--panel); overflow: hidden; position: relative; width: 100%;">
              ${blocksHtml}
            </div>
          </div>
        </div>
        
        <button type="button" class="btn-remove-session" data-event-id="${escapeHtml(event.id)}" title="Retirer de la séquence" style="flex-shrink: 0; background: transparent; border: none; color: var(--muted); cursor: pointer; font-size: 1.2rem; padding: 0.25rem; line-height: 1; opacity: 0.6; transition: opacity 0.2s;">×</button>
      </div>
    `;
  }).join("");
  
  timeline.querySelectorAll(".session-timeline-bar").forEach(bar => {
    bar.addEventListener("click", (e) => {
      const block = e.target.closest(".builder-block");
      if (!block) return;
      
      const eventId = block.dataset.eventId;
      const idxStr = block.dataset.index;
      
      if (idxStr !== undefined) {
        state.selectedElementEventId = eventId;
        state.selectedElementIndex = Number(idxStr);
        renderSequencesBuilderTimeline(activeTitle, activeLessons);
        renderElementEditor();
      } else if (block.classList.contains("block-empty")) {
        addNewElementToSession(eventId);
      }
    });
  });
  
  timeline.querySelectorAll(".btn-add-element").forEach(btn => {
    btn.addEventListener("click", () => {
      const eventId = btn.dataset.eventId;
      addNewElementToSession(eventId);
    });
  });
  
  timeline.querySelectorAll(".btn-remove-session").forEach(btn => {
    btn.addEventListener("click", () => {
      const eventId = btn.dataset.eventId;
      
      if (state.selectedElementEventId === eventId) {
        state.selectedElementEventId = "";
        state.selectedElementIndex = null;
      }
      
      state.annotations[eventId] = {
        ...(state.annotations[eventId] || {}),
        plannedSequence: "Sans séquence"
      };
      
      saveAnnotations();
      render();
      renderSequencesBuilder();
      renderElementEditor();
    });
  });
}

function updateBOModuleList() {
  const level = els.seqBuilderLevel.value;
  const domain = els.seqBuilderDomain.value;
  
  let subject = "maths";
  if (domain === "sciences") {
    subject = "sciences";
  }
  
  const modulesList = (typeof CURRICULUM !== "undefined" && CURRICULUM[subject]?.[level]) || [];
  
  els.boModuleSelect.innerHTML = `<option value="">-- Sélectionner un module --</option>`;
  for (const mod of modulesList) {
    const opt = document.createElement("option");
    opt.value = mod.name;
    opt.textContent = mod.name;
    els.boModuleSelect.appendChild(opt);
  }
  
  const activeTitle = state.selectedSequenceTitle;
  const meta = activeTitle ? (state.sequenceMeta[activeTitle] || {}) : {};
  
  if (meta.module && modulesList.some(m => m.name === meta.module)) {
    els.boModuleSelect.value = meta.module;
  } else {
    els.boModuleSelect.value = "";
  }
  
  renderBOModuleChecklists();
}

function renderBOModuleChecklists() {
  const level = els.seqBuilderLevel.value;
  const domain = els.seqBuilderDomain.value;
  const moduleName = els.boModuleSelect.value;
  
  let subject = "maths";
  if (domain === "sciences") {
    subject = "sciences";
  }
  
  const activeTitle = state.selectedSequenceTitle;
  const meta = activeTitle ? (state.sequenceMeta[activeTitle] || {}) : {};
  const activeCaps = meta.capacities || [];
  const activeKnows = meta.knowledges || [];
  
  const modulesList = (typeof CURRICULUM !== "undefined" && CURRICULUM[subject]?.[level]) || [];
  const moduleObj = modulesList.find(m => m.name === moduleName);
  
  if (!moduleObj) {
    els.boCapacitiesList.innerHTML = `<p class="field-hint">Sélectionnez un module pour afficher les capacités.</p>`;
    els.boKnowledgesList.innerHTML = `<p class="field-hint">Sélectionnez un module pour afficher les connaissances.</p>`;
    els.boModuleCoverageBar.style.width = "0%";
    els.boModuleCoverageText.textContent = "0% du module couvert";
    return;
  }
  
  // Render Capacities
  els.boCapacitiesList.innerHTML = "";
  if (moduleObj.capacities.length === 0) {
    els.boCapacitiesList.innerHTML = `<p class="field-hint">Aucune capacité définie pour ce module.</p>`;
  } else {
    moduleObj.capacities.forEach((cap, idx) => {
      const isChecked = activeCaps.includes(cap);
      const label = document.createElement("label");
      label.className = `bo-checkbox-item${isChecked ? " checked" : ""}`;
      label.innerHTML = `
        <input type="checkbox" value="${escapeHtml(cap)}"${isChecked ? " checked" : ""}>
        <span>${escapeHtml(cap)}</span>
      `;
      label.querySelector("input").addEventListener("change", (e) => {
        label.classList.toggle("checked", e.target.checked);
        updateBOModuleCoverage();
      });
      els.boCapacitiesList.appendChild(label);
    });
  }
  
  // Render Knowledges
  els.boKnowledgesList.innerHTML = "";
  if (moduleObj.knowledges.length === 0) {
    els.boKnowledgesList.innerHTML = `<p class="field-hint">Aucune connaissance définie pour ce module.</p>`;
  } else {
    moduleObj.knowledges.forEach((know, idx) => {
      const isChecked = activeKnows.includes(know);
      const label = document.createElement("label");
      label.className = `bo-checkbox-item${isChecked ? " checked" : ""}`;
      label.innerHTML = `
        <input type="checkbox" value="${escapeHtml(know)}"${isChecked ? " checked" : ""}>
        <span>${escapeHtml(know)}</span>
      `;
      label.querySelector("input").addEventListener("change", (e) => {
        label.classList.toggle("checked", e.target.checked);
        updateBOModuleCoverage();
      });
      els.boKnowledgesList.appendChild(label);
    });
  }
  
  updateBOModuleCoverage();
}

function updateBOModuleCoverage() {
  const totalCheckboxes = els.boCapacitiesList.querySelectorAll("input[type='checkbox']").length +
                         els.boKnowledgesList.querySelectorAll("input[type='checkbox']").length;
  const checkedCheckboxes = els.boCapacitiesList.querySelectorAll("input[type='checkbox']:checked").length +
                           els.boKnowledgesList.querySelectorAll("input[type='checkbox']:checked").length;
  
  let percent = 0;
  if (totalCheckboxes > 0) {
    percent = Math.round((checkedCheckboxes / totalCheckboxes) * 100);
  }
  
  els.boModuleCoverageBar.style.width = `${percent}%`;
  els.boModuleCoverageText.textContent = `${percent}% du module couvert`;
}

function renderScannedDocsList(meta) {
  els.seqBuilderDocsList.innerHTML = "";
  
  // Find all unique documents across all sequences plus the global pool
  const allScannedDocs = new Set(state.allScannedFiles || []);
  for (const m of Object.values(state.sequenceMeta || {})) {
    if (m.documents && Array.isArray(m.documents)) {
      m.documents.forEach(doc => allScannedDocs.add(doc));
    }
  }
  
  const docArray = Array.from(allScannedDocs).sort();
  
  if (docArray.length === 0) {
    els.seqBuilderDocsList.innerHTML = `<p class="field-hint" style="text-align: center; width: 100%;">Aucun document trouvé. Utilisez "Scanner dossier" pour indexer vos cours.</p>`;
    return;
  }
  
  const activeDocs = (meta && meta.documents) || [];
  
  docArray.forEach(doc => {
    const isChecked = activeDocs.includes(doc);
    const label = document.createElement("label");
    label.className = `doc-checkbox-item${isChecked ? " checked" : ""}`;
    
    const parts = doc.split("/");
    const filename = parts[parts.length - 1];
    const folderPath = parts.slice(0, -1).join("/");
    
    label.innerHTML = `
      <input type="checkbox" value="${escapeHtml(doc)}"${isChecked ? " checked" : ""}>
      <div style="display: flex; flex-direction: column; gap: 0.1rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
        <span style="font-weight: 500; font-size: 0.82rem; color: var(--text);">${escapeHtml(filename)}</span>
        ${folderPath ? `<span style="font-family: monospace; font-size: 0.68rem; color: var(--text-muted); opacity: 0.75;">${escapeHtml(folderPath)}</span>` : ""}
      </div>
    `;
    
    label.querySelector("input").addEventListener("change", (e) => {
      label.classList.toggle("checked", e.target.checked);
    });
    els.seqBuilderDocsList.appendChild(label);
  });
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// --- INITIALIZATION ---
initTheme();
updatePrintStyle();
bindEvents();
syncViewMode();
reconcileFiltersAfterImport();
updateFilters();
render();

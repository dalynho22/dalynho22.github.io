/* app.js
   Pokemon Team Builder
   - fetch by ID or name from PokeAPI
   - cache responses (memory only) to reduce API calls
   - show sprite + cry (audio) + load moves into 4 dropdowns
   - add up to 6 team members with selected moves, display cards, remove support
*/

"use strict";

const API_BASE = "https://pokeapi.co/api/v2/pokemon/";
const TEAM_LIMIT = 6;

// ====== DOM ======
const pokemonInput = document.getElementById("pokemonInput");
const searchBtn = document.getElementById("searchBtn");

const pokemonImg = document.getElementById("pokemonImg");
const pokemonNameTag = document.getElementById("pokemonNameTag");
const pokemonAudio = document.getElementById("pokemonAudio");

const moveSelects = [
  document.getElementById("move1"),
  document.getElementById("move2"),
  document.getElementById("move3"),
  document.getElementById("move4"),
];

const addToTeamBtn = document.getElementById("addToTeamBtn");
const statusMsg = document.getElementById("statusMsg");

const teamContainer = document.getElementById("teamContainer");
const teamCount = document.getElementById("teamCount");

// ====== CACHE ======
// In-memory cache for this page load (no localStorage)
const memoryCache = new Map();

// ====== TEAM STATE ======
let team = []; // items: { id, name, sprite, moves: [..4], cryUrl }
let currentPokemon = null;

// ====== HELPERS ======
function setStatus(text, isError = false) {
  statusMsg.textContent = text;
  statusMsg.style.color = isError ? "#ffe2e2" : "#ffffff";
}

function normalizeQuery(q) {
  return String(q).trim().toLowerCase();
}

function clearSelect(selectEl, placeholderText = "Select Move") {
  selectEl.innerHTML = "";
  const opt = document.createElement("option");
  opt.value = "";
  opt.textContent = placeholderText;
  selectEl.appendChild(opt);
}

function populateMovesDropdowns(moves) {
  for (const sel of moveSelects) {
    clearSelect(sel, "Select Move");

    for (const m of moves) {
      const opt = document.createElement("option");
      opt.value = m;
      opt.textContent = m;
      sel.appendChild(opt);
    }
  }
}

function getCryUrlFromData(data) {
  const cries = data?.cries;
  if (!cries) return "";
  return cries.latest || cries.newest || "";
}

function getSpriteUrlFromData(data) {
  const art =
    data?.sprites?.other?.["official-artwork"]?.front_default ||
    data?.sprites?.front_default ||
    "";
  return art;
}

function movesFromData(data) {
  const list = (data?.moves || [])
    .map((m) => m?.move?.name)
    .filter(Boolean);

  return Array.from(new Set(list));
}

function updateTeamCount() {
  teamCount.textContent = `(${team.length}/${TEAM_LIMIT})`;
}

function renderTeam() {
  teamContainer.innerHTML = "";

  if (team.length === 0) {
    const p = document.createElement("p");
    p.textContent = "No team members yet.";
    p.style.color = "rgba(255,255,255,0.95)";
    p.style.margin = "0";
    teamContainer.appendChild(p);
    updateTeamCount();
    return;
  }

  for (let i = 0; i < team.length; i++) {
    const member = team[i];

    const card = document.createElement("div");
    card.className = "teamCard";

    const top = document.createElement("div");
    top.className = "teamCardTop";

    const spriteWrap = document.createElement("div");
    spriteWrap.className = "teamSprite";

    const img = document.createElement("img");
    img.src = member.sprite;
    img.alt = member.name;

    spriteWrap.appendChild(img);

    const info = document.createElement("div");

    const nameDiv = document.createElement("div");
    nameDiv.className = "teamName";
    nameDiv.textContent = member.name;

    const movesDiv = document.createElement("div");
    movesDiv.className = "teamMoves";
    movesDiv.textContent = member.moves.filter(Boolean).join(", ") || "(no moves)";

    info.appendChild(nameDiv);
    info.appendChild(movesDiv);

    top.appendChild(spriteWrap);
    top.appendChild(info);

    const removeBtn = document.createElement("button");
    removeBtn.className = "removeBtn";
    removeBtn.type = "button";
    removeBtn.textContent = "Remove";

    removeBtn.addEventListener("click", () => {
      team.splice(i, 1);
      renderTeam();
      updateTeamCount();
      setStatus("Removed from team.");
    });

    card.appendChild(top);
    card.appendChild(removeBtn);

    teamContainer.appendChild(card);
  }

  updateTeamCount();
}

function disableAddButton() {
  addToTeamBtn.disabled = true;
}

function enableAddButton() {
  addToTeamBtn.disabled = false;
}

function hasDuplicateMoves(movesArr) {
  const set = new Set(movesArr);
  return set.size !== movesArr.length;
}

// ====== FETCH WITH MEMORY CACHE ONLY ======
async function fetchPokemon(query) {
  const q = normalizeQuery(query);
  if (!q) return null;

  // 1) Memory cache
  if (memoryCache.has(q)) return memoryCache.get(q);

  // 2) Network fetch
  const url = API_BASE + encodeURIComponent(q);
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Pokemon not found: ${q}`);
  }

  const data = await res.json();

  // Save in memory cache under:
  // - the query
  // - the pokemon's id
  // - the pokemon's name
  memoryCache.set(q, data);

  if (data?.id) {
    memoryCache.set(String(data.id), data);
  }
  if (data?.name) {
    memoryCache.set(String(data.name).toLowerCase(), data);
  }

  return data;
}

// ====== UI UPDATE FOR LOADED POKEMON ======
function showPokemon(data) {
  const name = data?.name ? data.name : "—";
  const sprite = getSpriteUrlFromData(data);
  const cryUrl = getCryUrlFromData(data);
  const moves = movesFromData(data);

  pokemonNameTag.textContent = name.toUpperCase();
  pokemonImg.src = sprite || "";
  pokemonImg.alt = name;

  // Audio
  if (cryUrl) {
    pokemonAudio.src = cryUrl;
    pokemonAudio.load();
  } else {
    pokemonAudio.removeAttribute("src");
    pokemonAudio.load();
  }

  // Dropdown moves
  if (moves.length > 0) {
    populateMovesDropdowns(moves);
  } else {
    for (const sel of moveSelects) {
      clearSelect(sel, "(no moves found)");
    }
  }

  currentPokemon = {
    id: data.id,
    name,
    sprite,
    cryUrl,
    movesList: moves,
  };

  enableAddButton();
  setStatus(`Loaded ${name}.`);
}

// ====== EVENTS ======
async function handleSearch() {
  const q = normalizeQuery(pokemonInput.value);

  if (!q) {
    setStatus("Enter a Pokemon name or ID first.", true);
    return;
  }

  setStatus("Loading...");
  disableAddButton();

  try {
    const data = await fetchPokemon(q);
    showPokemon(data);
  } catch (err) {
    // Clear display on error
    pokemonNameTag.textContent = "—";
    pokemonImg.src = "";
    pokemonAudio.removeAttribute("src");
    pokemonAudio.load();
    for (const sel of moveSelects) clearSelect(sel, "(load a pokemon first)");

    currentPokemon = null;
    disableAddButton();

    setStatus(err.message || "Failed to load Pokemon.", true);
  }
}

function handleAddToTeam() {
  if (!currentPokemon) {
    setStatus("Load a Pokemon first.", true);
    return;
  }

  if (team.length >= TEAM_LIMIT) {
    setStatus("Team is full (6). Remove one first.", true);
    return;
  }

  // Keep 4 slots (allow blanks), but prevent duplicate chosen moves
  const selectedMoves = moveSelects.map((s) => s.value.trim());
  const chosenNonEmpty = selectedMoves.filter((m) => m !== "");

  if (hasDuplicateMoves(chosenNonEmpty)) {
    setStatus("You picked the same move more than once.", true);
    return;
  }

  const member = {
    id: currentPokemon.id,
    name: currentPokemon.name,
    sprite: currentPokemon.sprite,
    cryUrl: currentPokemon.cryUrl,
    moves: selectedMoves,
  };

  team.push(member);
  renderTeam();
  setStatus(`${member.name} added to team!`);
}

// Click + Enter key for search
searchBtn.addEventListener("click", handleSearch);
pokemonInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleSearch();
});

addToTeamBtn.addEventListener("click", handleAddToTeam);

// Initialize UI state
(function init() {
  pokemonNameTag.textContent = "—";
  pokemonImg.src = "";
  for (const sel of moveSelects) clearSelect(sel, "(load a pokemon first)");
  disableAddButton();
  renderTeam();
  updateTeamCount();
})();

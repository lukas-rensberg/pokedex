/**
 * @fileoverview Script for the Pokédex App
 * @author Lukas Rensberg
 * @version 1.0.2
 */

/**
 * Global application state
 * @global
 * @type {Object}
 * @property {string} apiUrl - The URL of the Pokédex API
 * @property {number} pokemonPerPage - The number of Pokémon to load per page
 * @property {number} currentOffset - The current offset of the Pokémon to load
 * @property {boolean} isLoading - Whether the Pokédex is loading
 * @property {Array} allPokemon - The array of all Pokémon
 * @property {Object} elements - The DOM elements of the Pokédex
 * @property {Object} overlay - The overlay state
 * @property {boolean} overlay.isOpen - Whether the overlay is open
 * @property {number} overlay.currentIndex - The current index of the Pokemon in the overlay
 * @property {Array} overlay.pokemonData - The array of Pokemon data in the overlay
 * lines: 13
 */
let globals = {
  apiUrl: "https://pokeapi.co/api/v2",
  pokemonPerPage: 20,
  currentOffset: 0,
  isLoading: false,
  allPokemon: [],
  elements: {},
  overlay: {
    isOpen: false,
    currentIndex: 0,
    pokemonData: [],
  },
};

/**
 * Initialize DOM elements and store them in globals.elements
 * @returns {void}
 * lines: 11
 */
function initElements() {
  globals.elements = {
    searchInput: document.getElementById("searchInput"),
    typeFilter: document.getElementById("typeFilter"),
    pokemonGrid: document.getElementById("pokemonGrid"),
    loadingIndicator: document.getElementById("loadingIndicator"),
    loadMoreButton: document.getElementById("loadMoreButton"),
    loadMoreCount: document.getElementById("loadMoreCount"),
    pokemonOverlay: document.getElementById("pokemonOverlay"),
    overlayPokemonDetails: document.getElementById("overlayPokemonDetails"),
  };
}

/**
 * Show loading indicator and hide pokemon grid
 * @returns {void}
 * lines: 5
 */
function showLoading() {
  globals.isLoading = true;
  globals.elements.loadingIndicator.classList.add("active");
  globals.elements.pokemonGrid.style.display = "none";
}

/**
 * Hide loading indicator and show pokemon grid
 * @returns {void}
 * lines: 5
 */
function hideLoading() {
  globals.isLoading = false;
  globals.elements.loadingIndicator.classList.remove("active");
  globals.elements.pokemonGrid.style.display = "grid";
}

/**
 * Fetch Pokemon data from API
 * @param {number} offset - Starting offset for pagination
 * @param {boolean} [append=false] - Whether to append to existing data or replace
 * @returns {void}
 * lines: 10
 */
async function fetchPokemon(offset, append = false) {
  const url = `${globals.apiUrl}/pokemon?limit=${globals.pokemonPerPage}&offset=${offset}`;
  const res = await fetch(url);
  const data = await res.json();
  if (append) globals.allPokemon.push(...data.results);
  else globals.allPokemon = data.results;
  globals.currentOffset = offset + globals.pokemonPerPage;
  await displayPokemon(data.results, append);
  updateLoadMoreButton();
}

/**
 * Load initial Pokemon data on app startup
 * @returns {void}
 * lines: 12
 */
async function loadInitialPokemon() {
  showLoading();
  try {
    await fetchPokemon(0);
  } catch {
    showError(
      "Fehler beim Laden der Pokémon. Bitte laden Sie die Seite erneut oder versuchen Sie es später erneut."
    );
  } finally {
    hideLoading();
  }
}

/**
 * Load more Pokemon data for pagination
 * @returns {void}
 * lines: 14
 */
async function loadMorePokemon() {
  if (globals.isLoading) return;
  globals.elements.loadMoreButton.disabled = true;

  try {
    await fetchPokemon(globals.currentOffset, true);
  } catch {
    showError(
      "Fehler beim Laden von weiteren Pokémon. Bitte laden Sie die Seite erneut oder versuchen Sie es später erneut."
    );
  } finally {
    globals.elements.loadMoreButton.disabled = false;
  }
}

/**
 * Display Pokemon cards in the grid
 * @param {Array} pokemonList - Array of Pokemon objects to display
 * @param {boolean} [append=false] - Whether to append cards or replace existing ones
 * @returns {void}
 * lines: 12
 */
async function displayPokemon(pokemonList, append = false) {
  if (!append) {
    globals.elements.pokemonGrid.innerHTML = "";
  }

  const startIndex = append
    ? globals.allPokemon.length - pokemonList.length
    : 0;

  for (let i = 0; i < pokemonList.length; i++) {
    const pokemon = pokemonList[i];
    const globalIndex = startIndex + i;
    const card = await createPokemonCard(pokemon, globalIndex);
    if (card) {
      globals.elements.pokemonGrid.appendChild(card);
    }
  }
}

/**
 * Create a DOM element for a Pokemon card
 * @param {Object} pokemonData - Pokemon data from API
 * @param {string} typesHtml - HTML string for Pokemon types
 * @param {number} index - Index of Pokemon in the current list
 * @returns {HTMLElement} Pokemon card element
 * lines: 9
 */
function createCardElement(pokemonData, typesHtml, index) {
  const card = document.createElement("div");
  const primaryType = pokemonData.types[0].type.name;

  card.className = `pokemon-card type-${primaryType}`;
  card.innerHTML = createPokemonCardTemplate(pokemonData, typesHtml);
  card.onclick = () => openPokemonOverlay(index);
  return card;
}

/**
 * Generate HTML string for Pokemon types
 * @param {Array} types - Array of Pokemon type objects
 * @returns {string} HTML string for types
 * lines: 3
 */
function getPokemonTypesHtml(types) {
  return types.map((type) => createPokemonTypeTemplate(type)).join("");
}

/**
 * Create a complete Pokemon card with data fetching
 * @param {Object} pokemon - Basic Pokemon object with URL
 * @param {number} index - Index of Pokemon in the global list
 * @returns {Promise<HTMLElement|null>} Pokemon card element or null if error
 * lines: 13
 */
async function createPokemonCard(pokemon, index) {
  try {
    const response = await fetch(pokemon.url);
    const pokemonData = await response.json();
    const typesHtml = getPokemonTypesHtml(pokemonData.types);
    const card = createCardElement(pokemonData, typesHtml, index);

    return card;
  } catch (error) {
    return null;
  }
}

/**
 * Handle search input changes
 * @param {string} query - Search query string
 * lines: 3
 * @returns {void}
 */
function handleSearch(query) {
  // TODO: Implement search functionality
}

/**
 * Handle type filter selection changes
 * @param {string} type - Selected Pokemon type
 * lines: 3
 * @returns {void}
 */
function handleTypeFilter(type) {
  // TODO: Implement type filtering
}

/**
 * Update the load more button text and visibility
 * lines: 11
 * @returns {void}
 */
function updateLoadMoreButton() {
  const remainingCount = Math.max(0, 1010 - globals.currentOffset);
  globals.elements.loadMoreCount.textContent = `(${Math.min(
    globals.pokemonPerPage,
    remainingCount
  )} mehr)`;

  if (remainingCount <= 0) {
    globals.elements.loadMoreButton.style.display = "none";
  }
}

/**
 * Display error message in the Pokemon grid
 * @param {string} error - Error message to display
 * lines: 3
 * @returns {void}
 */
function showError(error) {
  globals.elements.pokemonGrid.innerHTML = createErrorTemplate(error);
}

/**
 * Open Pokemon overlay with detailed view
 * @param {number} pokemonIndex - Index of Pokemon in the current displayed list
 * @returns {void}
 */
async function openPokemonOverlay(pokemonIndex) {
  console.log("openPokemonOverlay:", pokemonIndex);
  globals.overlay.currentIndex = pokemonIndex;
  globals.overlay.isOpen = true;

  // Prevent body scrolling
  document.body.style.overflow = "hidden";

  // Show overlay
  globals.elements.pokemonOverlay.classList.add("active");

  // Load and display Pokemon data
  await loadOverlayPokemonData(pokemonIndex);
}

/**
 * Close Pokemon overlay
 * @returns {void}
 */
function closePokemonOverlay() {
  globals.overlay.isOpen = false;

  // Restore body scrolling
  document.body.style.overflow = "";

  // Hide overlay
  globals.elements.pokemonOverlay.classList.remove("active");
}

/**
 * Navigate to previous or next Pokemon in overlay
 * @param {number} direction - Direction to navigate (-1 for previous, 1 for next)
 * @returns {void}
 */
async function navigatePokemon(direction) {
  if (!globals.overlay.isOpen) return;

  const newIndex = globals.overlay.currentIndex + direction;

  // Check bounds against the total Pokemon available
  if (newIndex < 0 || newIndex >= globals.allPokemon.length) return;

  globals.overlay.currentIndex = newIndex;
  await loadOverlayPokemonData(newIndex);
}

/**
 * Load Pokemon data for overlay display
 * @param {number} index - Index of Pokemon to load
 * @returns {void}
 */
async function loadOverlayPokemonData(index) {
  try {
    // Check if we already have the data
    if (globals.overlay.pokemonData[index]) {
      displayOverlayPokemon(globals.overlay.pokemonData[index]);
      updateOverlayNavigation();
      return;
    }

    // Fetch Pokemon data if not cached
    const pokemonUrl = globals.allPokemon[index]?.url;
    if (!pokemonUrl) return;

    const response = await fetch(pokemonUrl);
    const pokemonData = await response.json();

    // Cache the data
    globals.overlay.pokemonData[index] = pokemonData;

    // Display Pokemon
    displayOverlayPokemon(pokemonData);
    updateOverlayNavigation();
  } catch (error) {
    console.error("Error loading Pokemon data for overlay:", error);
  }
}

/**
 * Display Pokemon data in overlay
 * @param {Object} pokemonData - Pokemon data to display
 * @returns {void}
 */
function displayOverlayPokemon(pokemonData) {
  globals.elements.overlayPokemonDetails.innerHTML =
    createPokemonOverlayTemplate(pokemonData);
}

/**
 * Update navigation buttons state
 * @returns {void}
 */
function updateOverlayNavigation() {
  const prevButton = document.querySelector(".overlay-prev");
  const nextButton = document.querySelector(".overlay-next");

  if (prevButton) {
    prevButton.disabled = globals.overlay.currentIndex <= 0;
  }

  if (nextButton) {
    nextButton.disabled =
      globals.overlay.currentIndex >= globals.allPokemon.length - 1;
  }
}

/**
 * Initialize the Pokédx application
 * lines: 4
 * @returns {void}
 */
function pokedexInit() {
  initElements();
  loadInitialPokemon();

  // Add keyboard navigation for overlay
  document.addEventListener("keydown", handleKeyboardNavigation);
}

/**
 * Handle keyboard navigation in overlay
 * @param {KeyboardEvent} event - Keyboard event
 * @returns {void}
 */
function handleKeyboardNavigation(event) {
  if (!globals.overlay.isOpen) return;

  switch (event.key) {
    case "Escape":
      closePokemonOverlay();
      break;
    case "ArrowLeft":
      navigatePokemon(-1);
      break;
    case "ArrowRight":
      navigatePokemon(1);
      break;
  }
}

document.addEventListener("DOMContentLoaded", pokedexInit);

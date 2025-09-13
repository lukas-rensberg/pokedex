/**
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
 * Get DOM elements object
 * @returns {Object} Object containing all DOM elements
 */
function getDOMElements() {
  return {
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
 * Initialize DOM elements and store them in globals.elements
 * @returns {void}
 */
function initElements() {
  globals.elements = getDOMElements();
}

/**
 * Show loading indicator and hide pokemon grid
 * @returns {void}
 */
function showLoading() {
  globals.isLoading = true;
  globals.elements.loadingIndicator.classList.add("active");
  globals.elements.pokemonGrid.style.display = "none";
}

/**
 * Hide loading indicator and show pokemon grid
 * @returns {void}
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
 * Calculate starting index for Pokemon display
 * @param {boolean} append - Whether to append to existing data
 * @param {Array} pokemonList - Array of Pokemon objects
 * @returns {number} Starting index
 */
function calculateStartIndex(append, pokemonList) {
  return append ? globals.allPokemon.length - pokemonList.length : 0;
}

/**
 * Create and append Pokemon cards to grid
 * @param {Array} pokemonList - Array of Pokemon objects
 * @param {number} startIndex - Starting index for card creation
 * @returns {void}
 */
async function createAndAppendCards(pokemonList, startIndex) {
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
 * Display Pokemon cards in the grid
 * @param {Array} pokemonList - Array of Pokemon objects to display
 * @param {boolean} [append=false] - Whether to append cards or replace existing ones
 * @returns {void}
 */
async function displayPokemon(pokemonList, append = false) {
  if (!append) {
    globals.elements.pokemonGrid.innerHTML = "";
  }

  const startIndex = calculateStartIndex(append, pokemonList);
  await createAndAppendCards(pokemonList, startIndex);
}

/**
 * Create a DOM element for a Pokemon card
 * @param {Object} pokemonData - Pokemon data from API
 * @param {string} typesHtml - HTML string for Pokemon types
 * @param {number} index - Index of Pokemon in the current list
 * @returns {HTMLElement} Pokemon card element
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
 */
function getPokemonTypesHtml(types) {
  return types.map((type) => createPokemonTypeTemplate(type)).join("");
}

/**
 * Create a complete Pokemon card with data fetching
 * @param {Object} pokemon - Basic Pokemon object with URL
 * @param {number} index - Index of Pokemon in the global list
 * @returns {Promise<HTMLElement|null>} Pokemon card element or null if error
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
 * Check if search term is valid (empty or >= 3 characters)
 * @param {string} searchTerm - Trimmed search term
 * @returns {boolean} True if valid, false otherwise
 */
function isValidSearchTerm(searchTerm) {
  return searchTerm.length === 0 || searchTerm.length >= 3;
}

/**
 * Check if Pokemon card matches search criteria
 * @param {HTMLElement} card - Pokemon card element
 * @param {string} searchTerm - Search term to match
 * @returns {boolean} True if matches, false otherwise
 */
function cardMatchesSearch(card, searchTerm) {
  const pokemonName = card.querySelector('.pokemon-name').textContent.toLowerCase();
  const pokemonId = card.querySelector('.pokemon-id').textContent;
  
  return searchTerm === '' || 
         pokemonName.includes(searchTerm) || 
         pokemonId.includes(searchTerm);
}

/**
 * Handle search input changes
 * @param {string} query - Search query string
 * @returns {void}
 */
function handleSearch(query) {
  const searchTerm = query.toLowerCase().trim();
  
  if (!isValidSearchTerm(searchTerm)) {
    return;
  }
  
  const pokemonCards = document.querySelectorAll('.pokemon-card');
  
  pokemonCards.forEach(card => {
    const matches = cardMatchesSearch(card, searchTerm);
    card.style.display = matches ? 'flex' : 'none';
  });
}

/**
 * Handle type filter selection changes
 * @param {string} type - Selected Pokemon type
 * @returns {void}
 */
function handleTypeFilter(type) {
  const pokemonCards = document.querySelectorAll('.pokemon-card');
  
  pokemonCards.forEach(card => {
    if (type === '') {
      card.style.display = 'flex';
    } else {
      const hasType = card.classList.contains(`type-${type}`);
      card.style.display = hasType ? 'flex' : 'none';
    }
  });
}

/**
 * Update the load more button text and visibility
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
 * @returns {void}
 */
function showError(error) {
  globals.elements.pokemonGrid.innerHTML = createErrorTemplate(error);
}

/**
 * Initialize the Pokédx application
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

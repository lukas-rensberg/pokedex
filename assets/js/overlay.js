/**
 * @author Lukas Rensberg
 * @version 1.0.2
 */

/**
 * Open Pokemon overlay with detailed view
 * @param {number} pokemonIndex - Index of Pokemon in the current displayed list
 * @returns {void}
 */
async function openPokemonOverlay(pokemonIndex) {
  globals.overlay.currentIndex = pokemonIndex;
  globals.overlay.isOpen = true;

  document.body.style.overflow = "hidden";
  globals.elements.pokemonOverlay.classList.add("active");
  
  await loadOverlayPokemonData(pokemonIndex);
}

/**
 * Close Pokemon overlay
 * @returns {void}
 */
function closePokemonOverlay() {
  globals.overlay.isOpen = false;
  document.body.style.overflow = "";
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

  if (newIndex < 0 || newIndex >= globals.allPokemon.length) return;

  globals.overlay.currentIndex = newIndex;
  await loadOverlayPokemonData(newIndex);
}

/**
 * Get formatted HTML for Pokemon stats
 * @param {Object} pokemonData - Pokemon data
 * @returns {string} HTML for stats
 */
function getStatsHtml(pokemonData) {
  return pokemonData.stats
    .map((stat) => {
      const statValue = stat.base_stat;
      const statPercentage = Math.min((statValue / 150) * 100, 100);
      return createPokemonOverlayStatTemplate(stat, statValue, statPercentage);
    })
    .join("");
}

/**
 * Get formatted HTML for Pokemon types
 * @param {Object} pokemonData - Pokemon data
 * @returns {string} HTML for types
 */
function getTypesHtml(pokemonData) {
  return pokemonData.types
    .map((type) => createPokemonOverlayTypeTemplate(type))
    .join("");
}

/**
 * Get formatted HTML for Pokemon abilities
 * @param {Object} pokemonData - Pokemon data
 * @returns {string} HTML for abilities
 */
function getAbilitiesHtml(pokemonData) {
  return pokemonData.abilities
    .map((ability) => ability.ability.name)
    .join(", ");
}

/**
 * Check if Pokemon data is cached
 * @param {number} index - Pokemon index
 * @returns {boolean} True if cached
 */
function isPokemonDataCached(index) {
  return !!globals.overlay.pokemonData[index];
}

/**
 * Fetch Pokemon data from API
 * @param {string} pokemonUrl - Pokemon API URL
 * @returns {Promise<Object>} Pokemon data
 */
async function fetchPokemonData(pokemonUrl) {
  const response = await fetch(pokemonUrl);
  return await response.json();
}

/**
 * Cache and display Pokemon data
 * @param {number} index - Pokemon index
 * @param {Object} pokemonData - Pokemon data to cache
 * @returns {void}
 */
function cacheAndDisplayPokemon(index, pokemonData) {
  globals.overlay.pokemonData[index] = pokemonData;
  displayOverlayPokemon(pokemonData);
  updateOverlayNavigation();
}

/**
 * Load Pokemon data for overlay display
 * @param {number} index - Index of Pokemon to load
 * @returns {void}
 */
async function loadOverlayPokemonData(index) {
  try {
    if (isPokemonDataCached(index)) {
      displayOverlayPokemon(globals.overlay.pokemonData[index]);
      updateOverlayNavigation();
      return;
    }

    const pokemonUrl = globals.allPokemon[index]?.url;
    if (!pokemonUrl) return;

    const pokemonData = await fetchPokemonData(pokemonUrl);
    cacheAndDisplayPokemon(index, pokemonData);
  } catch (error) {
    
  }
}

/**
 * Display Pokemon data in overlay
 * @param {Object} pokemonData - Pokemon data to display
 * @returns {void}
 */
function displayOverlayPokemon(pokemonData) {
  const typesHtml = getTypesHtml(pokemonData);
  const abilitiesHtml = getAbilitiesHtml(pokemonData);
  const statsHtml = getStatsHtml(pokemonData);

  globals.elements.overlayPokemonDetails.innerHTML =
    createPokemonOverlayTemplate(
      pokemonData,
      typesHtml,
      abilitiesHtml,
      statsHtml
    );
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
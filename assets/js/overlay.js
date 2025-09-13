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

    const abilitiesHtml = pokemonData.abilities
      .map((ability) => ability.ability.name)
      .join(", ");

    const typesHtml = pokemonData.types
      .map((type) => createPokemonOverlayTypeTemplate(type))
      .join("");

    const statsHtml = pokemonData.stats
      .map((stat) => {
        const statValue = stat.base_stat;
        const statPercentage = Math.min((statValue / 150) * 100, 100);
        return createPokemonOverlayStatTemplate(
          stat,
          statValue,
          statPercentage
        );
      })
      .join("");
    // Display Pokemon
    displayOverlayPokemon(pokemonData, abilitiesHtml, typesHtml, statsHtml);
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
function displayOverlayPokemon(pokemonData, abilitiesHtml) {
  globals.elements.overlayPokemonDetails.innerHTML =
    createPokemonOverlayTemplate(pokemonData, abilitiesHtml);
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

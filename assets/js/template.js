/**
 * @fileoverview Template functions for Pokemon cards
 * @author Lukas Rensberg
 * @version 1.0.2
 */

/**
 * Create HTML template for Pokemon card
 * @param {Object} pokemonData - Pokemon data from API
 * @param {string} typesHtml - HTML string for Pokemon types
 * @returns {string} HTML template for Pokemon card
 */
function createPokemonCardTemplate(pokemonData, typesHtml) {
  return `
        <div class="pokemon-card-header">
            <h3 class="pokemon-name">${pokemonData.name.toUpperCase()}</h3>
            <div class="pokemon-id">#${pokemonData.id
              .toString()
              .padStart(3, "0")}</div>
        </div>

        <div class="pokemon-card-body">
            <img src="${
              pokemonData.sprites.other["official-artwork"].front_default ||
              pokemonData.sprites.front_default
            }" alt="${pokemonData.name}" class="pokemon-image" loading="lazy">
            <div class="pokemon-info">
                <div class="pokemon-types">${typesHtml}</div>
            </div>
        </div>`;
}

/**
 * Create HTML template for Pokemon type badge
 * @param {Object} type - Pokemon type object from API
 * @returns {string} HTML template for type badge
 */
function createPokemonTypeTemplate(type) {
  return `<span class="pokemon-type type-${
    type.type.name
  }">${type.type.name.toUpperCase()}</span>`;
}

/**
 * Create HTML template for error display
 * @param {string} error - Error message to display
 * @returns {string} HTML template for error message
 */
function createErrorTemplate(error) {
  return `
        <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; background: var(--surface-color); border-radius: var(--radius-lg); color: var(--error-color);">
            <h3>Fehler!</h3>
            <p><em>Fehlermeldung:</em></br>${error}</p>
        </div>
    `;
}

/**
 * Create HTML template for Pokemon overlay detailed view
 * @param {Object} pokemonData - Complete Pokemon data from API
 * @param {string} abilitiesHtml - HTML string for Pokemon abilities
 * @param {string} statsHtml - HTML string for Pokemon stats
 * @returns {string} HTML template for detailed Pokemon overlay
 */
function createPokemonOverlayTemplate(
  pokemonData,
  typesHtml,
  abilitiesHtml,
  statsHtml
) {
  return `
    <div class="overlay-pokemon-header">
      <h2 class="overlay-pokemon-name">${pokemonData.name.toUpperCase()}</h2>
      <div class="overlay-pokemon-id">#${pokemonData.id
        .toString()
        .padStart(3, "0")}</div>
    </div>

    <div class="overlay-pokemon-content">
      <div class="overlay-pokemon-image-section">
        <img 
          src="${
            pokemonData.sprites.other["official-artwork"].front_default ||
            pokemonData.sprites.front_default
          }" 
          alt="${pokemonData.name}" 
          class="overlay-pokemon-image"
        >
        <div class="overlay-pokemon-types">
          ${typesHtml}
        </div>
      </div>

      <div class="overlay-pokemon-info">
        <div class="overlay-pokemon-stats">
          <h3 class="overlay-stats-title">Basiswerte</h3>
          ${statsHtml}
        </div>

        <div class="overlay-pokemon-details-section">
          <h3 class="overlay-details-title">Details</h3>
          <div class="overlay-detail-item">
            <span class="overlay-detail-label">Größe</span>
            <span class="overlay-detail-value">${(
              pokemonData.height / 10
            ).toFixed(1)} m</span>
          </div>
          <div class="overlay-detail-item">
            <span class="overlay-detail-label">Gewicht</span>
            <span class="overlay-detail-value">${(
              pokemonData.weight / 10
            ).toFixed(1)} kg</span>
          </div>
          <div class="overlay-detail-item">
            <span class="overlay-detail-label">Basis-Erfahrung</span>
            <span class="overlay-detail-value">${
              pokemonData.base_experience || "Unbekannt"
            }</span>
          </div>
          <div class="overlay-detail-item">
            <span class="overlay-detail-label">Fähigkeiten</span>
            <span class="overlay-detail-value">
              ${abilitiesHtml}
            </span>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Create HTML template for Pokemon overlay type badge
 * @param {Object} type - Pokemon type object from API
 * @returns {string} HTML template for type badge
 */
function createPokemonOverlayTypeTemplate(type) {
  return `<span class="overlay-pokemon-type type-${type.type.name}">${type.type.name}</span>`;
}

/**
 * Create HTML template for Pokemon overlay stat
 * @param {Object} stat - Pokemon stat object from API
 * @param {number} statValue - Value of the stat
 * @param {number} statPercentage - Percentage of the stat
 * @returns {string} HTML template for stat
 */
function createPokemonOverlayStatTemplate(stat, statValue, statPercentage) {
  return `
        <div class="overlay-stat-item">
          <span class="overlay-stat-name">${stat.stat.name.replace(
            "-",
            " "
          )}</span>
          <div class="overlay-stat-bar">
            <div class="overlay-stat-fill" style="width: ${statPercentage}%"></div>
          </div>
          <span class="overlay-stat-value">${statValue}</span>
        </div>
      `;
}

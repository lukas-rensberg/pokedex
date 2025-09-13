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

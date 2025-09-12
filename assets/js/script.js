let globals = {
    apiUrl: 'https://pokeapi.co/api/v2',
    pokemonPerPage: 20,
    currentOffset: 0,
    isLoading: false,
    allPokemon: [],
    elements: {}
};

function initializeElements() {
    globals.elements = {
        searchInput: document.getElementById('searchInput'),
        typeFilter: document.getElementById('typeFilter'),
        pokemonGrid: document.getElementById('pokemonGrid'),
        loadingIndicator: document.getElementById('loadingIndicator'),
        loadMoreButton: document.getElementById('loadMoreButton'),
        loadMoreCount: document.getElementById('loadMoreCount')
    };
}

function showLoading() {
    globals.isLoading = true;
    globals.elements.loadingIndicator.classList.add('active');
    globals.elements.pokemonGrid.style.display = 'none';
}

function hideLoading() {
    globals.isLoading = false;
    globals.elements.loadingIndicator.classList.remove('active');
    globals.elements.pokemonGrid.style.display = 'grid';
}

async function loadInitialPokemon() {
    console.log('Loading initial Pokemon...');
    showLoading();

    try {
        const response = await fetch(`${globals.apiUrl}/pokemon?limit=${globals.pokemonPerPage}&offset=0`);
        const data = await response.json();
        
        globals.allPokemon = data.results;
        globals.currentOffset = globals.pokemonPerPage;
        
        await displayPokemon(globals.allPokemon);
        updateLoadMoreButton();
    } catch (error) {
        console.error('Fehler beim Laden der Pokémon:', error);
        showError('Failed to load Pokemon. Please try again.');
    }

    hideLoading();
}

async function loadMorePokemon() {
    if (globals.isLoading) return;

    console.log('Loading more Pokemon...');
    globals.elements.loadMoreButton.disabled = true;

    try {
        const response = await fetch(`${globals.apiUrl}/pokemon?limit=${globals.pokemonPerPage}&offset=${globals.currentOffset}`);
        const data = await response.json();
        
        globals.allPokemon = [...globals.allPokemon, ...data.results];
        globals.currentOffset += globals.pokemonPerPage;
        
        await displayPokemon(data.results, true);
        updateLoadMoreButton();
    } catch (error) {
        console.error('Fehler beim Laden von weiteren Pokémon:', error);
        showError('Fehler beim Laden von weiteren Pokémon.');
    }

    globals.elements.loadMoreButton.disabled = false;
}

async function displayPokemon(pokemonList, append = false) {
    if (!append) {
        globals.elements.pokemonGrid.innerHTML = '';
    }

    for (const pokemon of pokemonList) {
        const card = await createPokemonCard(pokemon);
        if (card) {
            globals.elements.pokemonGrid.appendChild(card);
        }
    }
}

async function createPokemonCard(pokemon) {
    try {
        const response = await fetch(pokemon.url);
        const pokemonData = await response.json();
        
        const card = document.createElement('div');
        const primaryType = pokemonData.types[0].type.name;
        card.className = `pokemon-card type-${primaryType}`;
        
        const typesHtml = pokemonData.types
            .map(type => `<span class="pokemon-type type-${type.type.name}">${type.type.name.toUpperCase()}</span>`)
            .join('');

            card.innerHTML = `
                <div class="pokemon-card-header">
                    <h3 class="pokemon-name">${pokemonData.name.toUpperCase()}</h3>
                    <div class="pokemon-id">#${pokemonData.id.toString().padStart(3, '0')}</div>
                </div>
                <div class="pokemon-card-body">
                    <img src="${pokemonData.sprites.other['official-artwork'].front_default || pokemonData.sprites.front_default}" 
                         alt="${pokemonData.name}" class="pokemon-image" loading="lazy">
                    <div class="pokemon-info">
                        <div class="pokemon-types">${typesHtml}</div>
                    </div>
                </div>
            `;

            card.onclick = () => {
                console.log('Geklickt auf:', pokemonData.name);
                // TODO: Open modal with detailed info
            };

        return card;
        
    } catch (error) {
        console.error('Fehler beim Erstellen der Infokarte für:', pokemon.name, error);
        return null;
    }
}

function handleSearch(query) {
    console.log('Suche nach:', query);
    // TODO: Implement search functionality
}

function handleTypeFilter(type) {
    console.log('Filtern nach Typ:', type);
    // TODO: Implement type filtering
}

function updateLoadMoreButton() {
    const remainingCount = Math.max(0, 1010 - globals.currentOffset);
    globals.elements.loadMoreCount.textContent = `(${Math.min(globals.pokemonPerPage, remainingCount)} mehr)`;
    
    if (remainingCount <= 0) {
        globals.elements.loadMoreButton.style.display = 'none';
    }
}

function showError(message) {
    globals.elements.pokemonGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; background: var(--surface-color); border-radius: var(--radius-lg); color: var(--error-color);">
            <h3>Fehler!</h3>
            <p><em>Fehlermeldung:</em></br>${message}</p>
        </div>
    `;
}

function initializeApp() {
    initializeElements();
    loadInitialPokemon();
}

document.addEventListener('DOMContentLoaded', initializeApp);

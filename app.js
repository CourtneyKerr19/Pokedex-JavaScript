document.addEventListener("DOMContentLoaded", () => {
  const apiUrl = "https://pokeapi.co/api/v2/pokemon?limit=100000";
  const pokemonContainer = document.getElementById('pokemon-container');
  const searchInput = document.getElementById('searchInput');
  const pokemonDetails = document.getElementById('pokemon-details');

  // Fetch and display initial Pokemon data
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      data.results.forEach(pokemon => {
        fetch(pokemon.url)
          .then(response => response.json())
          .then(pokemonData => {
            createPokemonCard(pokemonData);
          });
      });
    });

  // Create and display a Pokemon card
  function createPokemonCard(pokemon) {
    const pokemonCard = document.createElement('div');
    pokemonCard.className = 'pokemon-card';
    pokemonCard.innerHTML = `
      <h2>${pokemon.name}</h2>
      <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
      <p>Height: ${pokemon.height}</p>
      <p>Weight: ${pokemon.weight}</p>
      <p>Types: ${pokemon.types.map(typeInfo => typeInfo.type.name).join(', ')}</p>
      <p>Abilities: ${pokemon.abilities.map(abilityInfo => abilityInfo.ability.name).join(', ')}</p>
    `;
    pokemonContainer.appendChild(pokemonCard);

    // Event listener for displaying more details
    pokemonCard.addEventListener('click', () => {
      history.pushState({ pokemonId: pokemon.id }, pokemon.name, `#pokemon-${pokemon.id}`);
      showPokemonDetails(pokemon);
    });
  }

  // Display the details of a specific Pokemon
  function showPokemonDetails(pokemon) {
    pokemonContainer.style.display = 'none';
    searchInput.style.display = 'none';
    pokemonDetails.style.display = 'block';
    pokemonDetails.innerHTML = `
      <h2>${pokemon.name}</h2>
      <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
      <p>Height: ${pokemon.height}</p>
      <p>Weight: ${pokemon.weight}</p>
      <p>Types: ${pokemon.types.map(typeInfo => typeInfo.type.name).join(', ')}</p>
      <p>Abilities: ${pokemon.abilities.map(abilityInfo => abilityInfo.ability.name).join(', ')}</p>
      <p>Base Stats:</p>
      <ul>
        <li>HP: ${pokemon.stats[0].base_stat}</li>
        <li>Attack: ${pokemon.stats[1].base_stat}</li>
        <li>Defense: ${pokemon.stats[2].base_stat}</li>
        <li>Special Attack: ${pokemon.stats[3].base_stat}</li>
        <li>Special Defense: ${pokemon.stats[4].base_stat}</li>
        <li>Speed: ${pokemon.stats[5].base_stat}</li>
      </ul>
      <p>Moves:</p>
      <ul>
        ${pokemon.moves.slice(0, 5).map(moveInfo => `<li>${moveInfo.move.name}</li>`).join('')}
      </ul>
      <div id="evolution-chain-${pokemon.id}"></div>
      <div id="additional-details-${pokemon.id}"></div>
      <button id="backButton">Back to Pokedex</button>
    `;

    // Fetch and display evolution chain
    fetch(pokemon.species.url)
      .then(response => response.json())
      .then(speciesData => {
        fetch(speciesData.evolution_chain.url)
          .then(response => response.json())
          .then(evolutionData => {
            displayEvolutionChain(evolutionData, pokemon.id);
          });

        // Fetch and display additional details
        displayAdditionalDetails(speciesData, pokemon.id);
      });

    // Add event listener to back button
    document.getElementById('backButton').addEventListener('click', () => {
      history.pushState({}, 'Pokedex', '/');
      showPokedex();
    });
  }

  // Display the Pokedex
  function showPokedex() {
    pokemonContainer.style.display = 'flex';
    searchInput.style.display = 'block';
    pokemonDetails.style.display = 'none';
  }

  // Display the evolution chain
  function displayEvolutionChain(evolutionData, pokemonId) {
    const evolutionChainContainer = document.getElementById(`evolution-chain-${pokemonId}`);
    let evolutionChainHTML = '<p>Evolution Chain:</p><ul>';
    let currentEvolution = evolutionData.chain;

    do {
      evolutionChainHTML += `<li>${currentEvolution.species.name}</li>`;
      currentEvolution = currentEvolution.evolves_to[0];
    } while (currentEvolution);

    evolutionChainHTML += '</ul>';
    evolutionChainContainer.innerHTML = evolutionChainHTML;
  }

  // Display additional details
  function displayAdditionalDetails(speciesData, pokemonId) {
    const additionalDetailsContainer = document.getElementById(`additional-details-${pokemonId}`);
    fetch(speciesData.varieties[0].pokemon.url)
      .then(response => response.json())
      .then(pokemonVarietyData => {
        let additionalDetailsHTML = `
          <p>Base Experience: ${pokemonVarietyData.base_experience}</p>
          <p>Color: ${speciesData.color.name}</p>
          <p>Habitat: ${speciesData.habitat ? speciesData.habitat.name : 'Unknown'}</p>
          <p>Egg Groups: ${speciesData.egg_groups.map(group => group.name).join(', ')}</p>
          <p>Generation: ${speciesData.generation.name}</p>
          <p>Capture Rate: ${speciesData.capture_rate}</p>
          <p>Gender Ratio: ${speciesData.gender_rate >= 0 ? `${speciesData.gender_rate * 12.5}% female` : 'Genderless'}</p>
          <p>Growth Rate: ${speciesData.growth_rate.name}</p>
          <p>Held Items: ${pokemonVarietyData.held_items.map(item => item.item.name).join(', ')}</p>
          <p>Forms: ${pokemonVarietyData.forms.map(form => form.name).join(', ')}</p>
          <p>Games: ${pokemonVarietyData.game_indices.map(index => index.version.name).join(', ')}</p>
        `;
        additionalDetailsContainer.innerHTML = additionalDetailsHTML;
      });
  }

  // Search functionality
  searchInput.addEventListener('input', (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const pokemonCards = document.querySelectorAll('.pokemon-card');
    pokemonCards.forEach(card => {
      const pokemonName = card.querySelector('h2').textContent.toLowerCase();
      if (pokemonName.includes(searchTerm)) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  });

  // Handle browser back and forward buttons
  window.onpopstate = function(event) {
    if (event.state && event.state.pokemonId) {
      fetch(`https://pokeapi.co/api/v2/pokemon/${event.state.pokemonId}`)
        .then(response => response.json())
        .then(pokemonData => {
          showPokemonDetails(pokemonData);
        });
    } else {
      showPokedex();
    }
  };
});



//Handle Pagination
let nextUrl = apiUrl;

function fetchPokemon(_apiUrl) {
  fetch(url)
    .then(response => response.json())
    .then(data => {
      data.results.forEach(pokemon => {
        fetch(pokemon.url)
          .then(response => response.json())
          .then(pokemonData => {
            createPokemonCard(pokemonData);
          });
      });
      nextUrl = data.next;
      if (nextUrl) {
        fetchPokemon(nextUrl);
      }
    });
}

fetchPokemon(apiUrl);

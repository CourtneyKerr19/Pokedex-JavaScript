document.addEventListener("DOMContentLoaded", () => {
  const apiUrl = "https://pokeapi.co/api/v2/pokemon?limit=10";
  const pokemonContainer = document.getElementById('pokemon-container');
  const searchInput = document.getElementById('searchInput');

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
    `;
    pokemonContainer.appendChild(pokemonCard);

    // Event listener for displaying more details
    pokemonCard.addEventListener('click', () => {
      alert(`More details about ${pokemon.name}`);
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
});

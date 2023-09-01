import axios from "axios";

const POKEMON_API_URL: string = "https://pokeapi.co/api/v2/pokemon";

/**
 * Find all pokemon until the count
 * @param count The number of pokemon to find
 */
export const findPokemonTillCount = async (count: number): Promise<[]> => {
  const response = await axios.get(`${POKEMON_API_URL}?limit=${count}`);
  for (const pokemon of response.data.results) {
    pokemon.url = await findImageForPokemon(pokemon.name);
  }
  return response.data.results;
};

/**
 * Find the image for a pokemon
 * @param name The name of the pokemon
 */
export const findImageForPokemon = async (name: string): Promise<string> => {
  const response = await axios.get(`${POKEMON_API_URL}/${name}`);
  return response.data.sprites.front_default;
};

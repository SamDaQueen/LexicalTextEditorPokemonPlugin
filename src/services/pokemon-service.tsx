import axios from "axios";

const POKEMON_API_URL: string = "https://pokeapi.co/api/v2/pokemon";

/**
 * Find all Pokémon until the count
 * @param count The number of Pokémon to find
 */
export const findPokemonTillCount = async (count: number): Promise<[]> => {
  const response = await axios.get(`${POKEMON_API_URL}?limit=${count}`);
  for (const pokemon of response.data.results) {
    pokemon.id = pokemon.url.split("/")[6];
  }
  return response.data.results;
};

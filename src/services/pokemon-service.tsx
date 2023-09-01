import axios from "axios";

const POKEMON_API_URL = "https://pokeapi.co/api/v2/pokemon";

export const findPokemonTillCount = async (count: number): Promise<JSON> => {
  const response = await axios.get(`${POKEMON_API_URL}?limit=${count}`);
  return response.data;
};

export const findPokemonByName = async (name: string): Promise<JSON> => {
  const response = await axios.get(`${POKEMON_API_URL}/${name}`);
  return response.data;
};

export const findPokemonById = async (id: number): Promise<JSON> => {
  const response = await axios.get(`${POKEMON_API_URL}/${id}`);
  return response.data;
};

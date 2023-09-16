import "./pokemon-pill.css";
import ImageCropper from "./image-cropper.tsx";
import { ReactElement } from "react";

const POKEMON_IMAGE_API_URL: string =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/";

/**
 * This component is used to display a pill with a Pokémon name and image.
 * @param name The name of the Pokémon
 * @param id The id of the Pokémon
 */
const PokemonPill: ({
  name,
  id,
}: {
  name: string;
  id: number;
}) => ReactElement = ({ name, id }) => {
  const url = `${POKEMON_IMAGE_API_URL}/${id}.png`;
  return (
    <span className="pill">
      <ImageCropper imageUrl={url} />
      <span>{name}</span>
    </span>
  );
};

export default PokemonPill;

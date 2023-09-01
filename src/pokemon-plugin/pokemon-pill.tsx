import "./pokemon-pill.css";
import ImageCropper from "./image-cropper.tsx";
import { ReactElement } from "react";

/**
 * This component is used to display a pill with a Pokemon's name and image.
 * @param name The name of the Pokemon
 * @param url The URL of the Pokemon's image
 */
const PokemonPill: ({
  name,
  url,
}: {
  name: string;
  url: string;
}) => ReactElement = ({ name, url }) => {
  return (
    <span className="pill">
      <ImageCropper imageUrl={url} />
      <span>{name}</span>
    </span>
  );
};

export default PokemonPill;

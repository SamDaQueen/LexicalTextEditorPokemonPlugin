import Editor from "./editor";
import { findPokemonTillCount } from "./services/pokemon-service.tsx";
import { useEffect } from "react";

const LexicalEditor = () => {
  const fetchPokemon = async (): Promise<JSON> => {
    return await findPokemonTillCount(151);
  };

  useEffect(() => {
    fetchPokemon().then((response) => console.log("Pokemon fetched", response));
  }, []);

  return (
    <div>
      <h2>Lexical Editor with Pokemon Plugin</h2>
      <div className="container">
        <Editor />
      </div>
    </div>
  );
};

export default LexicalEditor;

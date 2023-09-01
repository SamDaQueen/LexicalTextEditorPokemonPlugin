import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import "./index.css";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import PokemonPlugin from "../pokemon-plugin";
import PokemonNode from "../pokemon-plugin/pokemon-node.tsx";

/**
 * This is the main Lexical editor component.
 */
const Editor = () => {
  const onError = (error: Error): void => {
    console.error(error);
  };

  const initialConfig = {
    namespace: "PokemonEditor",
    onError,
    nodes: [PokemonNode],
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <RichTextPlugin
        contentEditable={<ContentEditable className="editable" />}
        placeholder={
          <div className="placeholder">
            Welcome to Lexical! <br /> This is an open-source text editor, and I
            have added the Pokémon plugin to it! <br />
            Use @ to insert find and insert your favourite Pokémons!
          </div>
        }
        ErrorBoundary={LexicalErrorBoundary}
      />
      <PokemonPlugin />
      <HistoryPlugin />
    </LexicalComposer>
  );
};

export default Editor;

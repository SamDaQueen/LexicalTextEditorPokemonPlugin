import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import "./index.css";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import PokemonPlugin from "../pokemon-plugin";

const Editor = () => {
  const onError = (error: Error): void => {
    console.error(error);
  };

  const initialConfig = {
    namespace: "PokemonEditor",
    onError,
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <PokemonPlugin />
      <RichTextPlugin
        contentEditable={<ContentEditable className="editable" />}
        placeholder={
          <div className="placeholder">Use @ to insert Pokémons</div>
        }
        ErrorBoundary={LexicalErrorBoundary}
      />
      <HistoryPlugin />
    </LexicalComposer>
  );
};

export default Editor;

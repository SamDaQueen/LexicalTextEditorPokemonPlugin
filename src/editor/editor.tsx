import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import "./editor.css";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import PokemonPlugin from "../pokemon-plugin/pokemon-plugin.tsx";

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
      <RichTextPlugin
        contentEditable={<ContentEditable className="editable" />}
        placeholder={<div className="placeholder">Enter some text...</div>}
        ErrorBoundary={LexicalErrorBoundary}
      />
      <HistoryPlugin />
    </LexicalComposer>
  );
};

export default Editor;

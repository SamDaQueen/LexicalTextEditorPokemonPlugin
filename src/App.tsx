import "./App.css";
import Editor from "./editor/editor.tsx";

function App() {
  return (
    <div>
      <h2>Lexical Editor with Pokemon Plugin</h2>
      <div className="container">
        <Editor />
      </div>
    </div>
  );
}

export default App;

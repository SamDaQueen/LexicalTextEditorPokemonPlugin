import {
  $applyNodeReplacement,
  DecoratorNode,
  EditorConfig,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from "lexical";
import { ReactNode } from "react";
import PokemonPill from "./pokemon-pill.tsx";

export type SerializedPokemonNode = Spread<
  {
    pokemonName: string;
  },
  SerializedLexicalNode
>;

const pokemonStyle = "background-color: rgba(24, 119, 232, 0.2)";

class PokemonNode extends DecoratorNode<ReactNode> {
  static getType(): string {
    return "pokemon";
  }

  static clone(node: PokemonNode): PokemonNode {
    return new PokemonNode({ ...node.__pokemon }, node.__key);
  }

  constructor(pokemonName: string, key?: NodeKey) {
    super(key);
    this.__pokemon = pokemonName;
  }

  static importJSON(serializedNode: SerializedPokemonNode): PokemonNode {
    return $createPokemonNode(serializedNode.pokemonName);
  }

  exportJSON(): SerializedPokemonNode {
    return {
      ...super.exportJSON(),
      pokemonName: this.__pokemon,
      type: "pokemon",
      version: 1,
    };
  }

  createDOM(config: EditorConfig): HTMLElement {
    const span = document.createElement("span");
    span.className = `${config.theme.pokemonNode} position-${this.__position}`;
    return span;
  }

  updateDOM(): false {
    return false;
  }

  decorate(): ReactNode {
    return <PokemonPill />;
  }
}

export function $createPokemonNode(pokemonName: string): PokemonNode {
  const pokemonNode = new PokemonNode(pokemonName);
  return $applyNodeReplacement(pokemonNode);
}

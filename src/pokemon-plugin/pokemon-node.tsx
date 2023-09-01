import {
  $applyNodeReplacement,
  DecoratorNode,
  EditorConfig,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from "lexical";
import { ReactNode } from "react";
import PokemonPill from "./pokemon-pill.tsx";
export type SerializedPokemonNode = Spread<
  {
    name: string;
    url: string;
  },
  SerializedLexicalNode
>;

class PokemonNode extends DecoratorNode<ReactNode> {
  __name: string;
  __url: string;

  static getType(): string {
    return "pokemon";
  }

  static clone(node: PokemonNode): PokemonNode {
    return new PokemonNode(node.__name, node.__url, node.__key);
  }

  constructor(name: string, url: string, key?: NodeKey) {
    super(key);
    this.__name = name;
    this.__url = url;
  }

  static importJSON(serializedNode: SerializedPokemonNode): PokemonNode {
    return $createPokemonNode(serializedNode.name, serializedNode.url);
  }

  exportJSON(): SerializedPokemonNode {
    return {
      ...super.exportJSON(),
      name: this.__name,
      url: this.__url,
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
    return <PokemonPill name={this.__name} url={this.__url} />;
  }
}

export function $createPokemonNode(name: string, url: string): PokemonNode {
  const pokemonNode = new PokemonNode(name, url);
  return $applyNodeReplacement(pokemonNode);
}

export function $isPokemonNode(node: LexicalNode): node is PokemonNode {
  return node instanceof PokemonNode;
}

export default PokemonNode;

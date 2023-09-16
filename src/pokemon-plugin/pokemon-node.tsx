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
    id: number;
  },
  SerializedLexicalNode
>;

class PokemonNode extends DecoratorNode<ReactNode> {
  __name: string;
  __id: number;

  static getType(): string {
    return "pokemon";
  }

  static clone(node: PokemonNode): PokemonNode {
    return new PokemonNode(node.__name, node.__id, node.__key);
  }

  constructor(name: string, id: number, key?: NodeKey) {
    super(key);
    this.__name = name;
    this.__id = id;
  }

  static importJSON(serializedNode: SerializedPokemonNode): PokemonNode {
    return $createPokemonNode(serializedNode.name, serializedNode.id);
  }

  exportJSON(): SerializedPokemonNode {
    return {
      ...super.exportJSON(),
      name: this.__name,
      id: this.__id,
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
    return <PokemonPill name={this.__name} id={this.__id} />;
  }
}

export function $createPokemonNode(name: string, id: number): PokemonNode {
  const pokemonNode = new PokemonNode(name, id);
  return $applyNodeReplacement(pokemonNode);
}

export function $isPokemonNode(node: LexicalNode): node is PokemonNode {
  return node instanceof PokemonNode;
}

export default PokemonNode;

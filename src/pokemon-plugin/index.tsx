import { ReactElement, useCallback, useEffect, useMemo, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  LexicalTypeaheadMenuPlugin,
  MenuOption,
  MenuTextMatch,
  useBasicTypeaheadTriggerMatch,
} from "@lexical/react/LexicalTypeaheadMenuPlugin";
import { $createPokemonNode } from "./pokemon-node.tsx";
import { TextNode } from "lexical";
import * as ReactDOM from "react-dom";
import { findPokemonTillCount } from "../services/pokemon-service.tsx";
import "./index.css";
import {
  AtSignPokemonsRegex,
  SUGGESTION_LIST_LENGTH_LIMIT,
} from "./constants.ts";

/**
 * Find all the Pokemon names that match the given text.
 * @param text The text to match.
 * @param minMatchLength The minimum length of the match.
 */
function checkForAtSignPokemons(
  text: string,
  minMatchLength: number
): MenuTextMatch | null {
  const match = AtSignPokemonsRegex.exec(text);

  if (match !== null) {
    const maybeLeadingWhitespace = match[1];

    const matchingString = match[3];
    if (matchingString.length >= minMatchLength) {
      return {
        leadOffset: match.index + maybeLeadingWhitespace.length,
        matchingString,
        replaceableString: match[2],
      };
    }
  }
  return null;
}

/**
 * The content of the list item in the typeahead menu.
 * @param name The name of the Pokemon.
 * @param url The url of the image of the Pokemon.
 */
class PokemonTypeaheadOption extends MenuOption {
  name: string;
  url: string;
  constructor(name: string, url: string) {
    super(name);
    this.name = name;
    this.url = url;
  }
}

/**
 * The typeahead menu item for Pokemon.
 * @param index The index of the item in the list.
 * @param isSelected Whether the item is selected.
 * @param onClick The callback to call when the item is clicked.
 * @param onMouseEnter The callback to call when the mouse enters the item.
 * @param option The PokemonTypeaheadOption to render.
 */
function PokemonTypeaheadMenuItem({
  index,
  isSelected,
  onClick,
  onMouseEnter,
  option,
}: {
  index: number;
  isSelected: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  option: PokemonTypeaheadOption;
}) {
  let className = "item";
  if (isSelected) {
    className += " selected";
  }
  return (
    <li
      key={option.key}
      tabIndex={-1}
      className={className}
      ref={option.setRefElement}
      role="option"
      aria-selected={isSelected}
      id={"typeahead-item-" + index}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
    >
      <span className="text">{option.name}</span>
    </li>
  );
}

/**
 * This plugin provides a typeahead menu for Pokemon names.
 * It creates a new PokemonNode when a Pokemon is selected.
 */
const PokemonPlugin = (): ReactElement | null => {
  const [pokemonData, setPokemonData] = useState([]);

  const fetchPokemon = async (): Promise<[]> => {
    return await findPokemonTillCount(151);
  };

  // Fetch the 151 Pokemon on mount.
  useEffect(() => {
    fetchPokemon().then((response) => {
      setPokemonData(response);
    });
  }, []);

  const pokemonLookupService = {
    search(
      string: string,
      callback: (results: { name: string; url: string }[]) => void
    ): void {
      setTimeout(() => {
        const results: { name: string; url: string }[] = pokemonData.filter(
          (pokemon: { name: string; url: string }) =>
            pokemon.name.toLowerCase().startsWith(string.toLowerCase())
        );
        callback(results);
      }, 500);
    },
  };

  const pokemonCache = new Map();

  function usePokemonLookupService(pokemonString: string | null) {
    const [results, setResults] = useState<{ name: string; url: string }[]>([]);

    useEffect(() => {
      const cachedResults = pokemonCache.get(pokemonString);

      if (pokemonString == null) {
        setResults([]);
        return;
      }

      if (cachedResults === null) {
        return;
      } else if (cachedResults !== undefined) {
        setResults(cachedResults);
        return;
      }

      pokemonCache.set(pokemonString, null);
      pokemonLookupService.search(pokemonString, (newResults) => {
        pokemonCache.set(pokemonString, newResults);
        setResults(newResults);
      });
    }, [pokemonString]);

    return results;
  }

  const [editor] = useLexicalComposerContext();

  const [query, setQuery] = useState<string | null>(null);

  const onSelectOption = useCallback(
    (
      selectedOption: PokemonTypeaheadOption,
      nodeToReplace: TextNode | null,
      closeMenu: () => void
    ): void => {
      editor.update((): void => {
        const pokemonNode = $createPokemonNode(
          selectedOption.name,
          selectedOption.url
        );
        if (nodeToReplace) {
          nodeToReplace.replace(pokemonNode);
        }
        closeMenu();
      });
    },
    [editor]
  );

  const checkForSlashTriggerMatch = useBasicTypeaheadTriggerMatch("/", {
    minLength: 0,
  });

  const results = usePokemonLookupService(query);

  const options = useMemo(
    () =>
      results
        .map((result) => new PokemonTypeaheadOption(result.name, result.url))
        .slice(0, SUGGESTION_LIST_LENGTH_LIMIT),
    [results]
  );

  const checkForPokemonMatch = useCallback(
    (query: string): MenuTextMatch | null => {
      const slashMatch = checkForSlashTriggerMatch(query, editor);
      if (slashMatch !== null) {
        return null;
      }
      return checkForAtSignPokemons(query, 1);
    },
    [checkForSlashTriggerMatch, editor]
  );

  return (
    <LexicalTypeaheadMenuPlugin<PokemonTypeaheadOption>
      onQueryChange={setQuery}
      onSelectOption={onSelectOption}
      triggerFn={checkForPokemonMatch}
      options={options}
      menuRenderFn={(
        anchorElementRef,
        { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex }
      ) =>
        anchorElementRef.current && results.length
          ? ReactDOM.createPortal(
              <div className="typeahead-popover mentions-menu">
                <ul>
                  {options.map((option, i: number) => (
                    <PokemonTypeaheadMenuItem
                      index={i}
                      isSelected={selectedIndex === i}
                      onClick={() => {
                        setHighlightedIndex(i);
                        selectOptionAndCleanUp(option);
                      }}
                      onMouseEnter={() => {
                        setHighlightedIndex(i);
                      }}
                      key={option.key}
                      option={option}
                    />
                  ))}
                </ul>
              </div>,
              anchorElementRef.current
            )
          : null
      }
    />
  );
};

export default PokemonPlugin;

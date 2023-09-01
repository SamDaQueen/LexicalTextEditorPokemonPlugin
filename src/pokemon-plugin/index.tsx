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

const PUNCTUATION =
  "\\.,\\+\\*\\?\\$\\@\\|#{}\\(\\)\\^\\-\\[\\]\\\\/!%'\"~=<>_:;";
const NAME = "\\b[A-Z][^\\s" + PUNCTUATION + "]";

const DocumentPokemonRegex = {
  NAME,
  PUNCTUATION,
};

const CapitalizedNamePokemonRegex = new RegExp(
  "(^|[^#])((?:" + DocumentPokemonRegex.NAME + "{" + 1 + ",})$)"
);

const PUNC = DocumentPokemonRegex.PUNCTUATION;

const TRIGGERS = ["@"].join("");

const VALID_CHARS = "[^" + TRIGGERS + PUNC + "\\s]";

const VALID_JOINS =
  "(?:" +
  " |" + // E.g. " " in "Josh Duck"
  "[" +
  PUNC +
  "]|" + // E.g. "-' in "Salier-Hellendag"
  ")";

const LENGTH_LIMIT = 75;

const AtSignPokemonsRegex = new RegExp(
  "(^|\\s|\\()(" +
    "[" +
    TRIGGERS +
    "]" +
    "((?:" +
    VALID_CHARS +
    VALID_JOINS +
    "){0," +
    LENGTH_LIMIT +
    "})" +
    ")$"
);

// At most, 5 suggestions are shown in the popup.
const SUGGESTION_LIST_LENGTH_LIMIT = 5;

const dummyPokemonData = ["bulb", "char", "squirt", "pika"];

const dummyLookupService = {
  search(string: string, callback: (results: Array<string>) => void): void {
    setTimeout(() => {
      const results = dummyPokemonData.filter((pokemon) =>
        pokemon.toLowerCase().includes(string.toLowerCase())
      );
      callback(results);
    }, 500);
  },
};

const pokemonCache = new Map();

function usePokemonLookupService(pokemonString: string | null) {
  const [results, setResults] = useState<Array<string>>([]);

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
    dummyLookupService.search(pokemonString, (newResults) => {
      pokemonCache.set(pokemonString, newResults);
      setResults(newResults);
    });
  }, [pokemonString]);

  return results;
}

function checkForCapitalizedNamePokemons(
  text: string,
  minMatchLength: number
): MenuTextMatch | null {
  const match = CapitalizedNamePokemonRegex.exec(text);
  if (match !== null) {
    const maybeLeadingWhitespace = match[1];

    const matchingString = match[2];
    if (matchingString != null && matchingString.length >= minMatchLength) {
      return {
        leadOffset: match.index + maybeLeadingWhitespace.length,
        matchingString,
        replaceableString: matchingString,
      };
    }
  }
  return null;
}

function checkForAtSignPokemons(
  text: string,
  minMatchLength: number
): MenuTextMatch | null {
  const match = AtSignPokemonsRegex.exec(text);

  if (match !== null) {
    // The strategy ignores leading whitespace but we need to know it's
    // length to add it to the leadOffset
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

function getPossibleQueryMatch(text: string): MenuTextMatch | null {
  const match = checkForAtSignPokemons(text, 1);
  return match === null ? checkForCapitalizedNamePokemons(text, 3) : match;
}

class PokemonTypeaheadOption extends MenuOption {
  name: string;
  picture: ReactElement;
  constructor(name: string, picture: ReactElement) {
    super(name);
    this.name = name;
    this.picture = picture;
  }
}

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
      {option.picture}
      <span className="text">{option.name}</span>
    </li>
  );
}

const PokemonPlugin = (): ReactElement | null => {
  const [editor] = useLexicalComposerContext();

  const [query, setQuery] = useState<string | null>(null);

  const onSelectOption = useCallback(
    (
      selectedOption: PokemonTypeaheadOption,
      nodeToReplace: TextNode | null,
      closeMenu: () => void
    ): void => {
      editor.update((): void => {
        const pokemonNode = $createPokemonNode(selectedOption.name);
        if (nodeToReplace) {
          nodeToReplace.replace(pokemonNode);
        }
        pokemonNode.select();
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
        .map(
          (result) =>
            new PokemonTypeaheadOption(result, <i className="icon user" />)
        )
        .slice(0, SUGGESTION_LIST_LENGTH_LIMIT),
    [results]
  );

  const checkForPokemonMatch = useCallback(
    (query: string): MenuTextMatch | null => {
      const slashMatch = checkForSlashTriggerMatch(query, editor);
      if (slashMatch !== null) {
        return null;
      }
      return getPossibleQueryMatch(query);
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

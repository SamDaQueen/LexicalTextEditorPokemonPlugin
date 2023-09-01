export const PUNCTUATION =
  "\\.,\\+\\*\\?\\$\\@\\|#{}\\(\\)\\^\\-\\[\\]\\\\/!%'\"~=<>_:;";

export const NAME = "\\b[A-Z][^\\s" + PUNCTUATION + "]";

export const DocumentPokemonRegex = {
  NAME,
  PUNCTUATION,
};

export const PUNC = DocumentPokemonRegex.PUNCTUATION;

export const TRIGGERS = ["@"].join("");

export const VALID_CHARS = "[^" + TRIGGERS + PUNC + "\\s]";

export const VALID_JOINS =
  "(?:" +
  " |" + // E.g. " " in "Josh Duck"
  "[" +
  PUNC +
  "]|" + // E.g. "-' in "Salier-Hellendag"
  ")";

export const LENGTH_LIMIT = 75;

export const AtSignPokemonsRegex = new RegExp(
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

export const SUGGESTION_LIST_LENGTH_LIMIT = 7;

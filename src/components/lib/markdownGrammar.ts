// The one definition of the display-format grammar — every parser
// (editor node regex, serializer, display renderer) imports from here
// instead of maintaining its own copy. Keep this file's patterns in sync
// with MARKDOWN_TRANSFORMERS in MarkdownInput.tsx if that list ever grows.

const BOLD_ITALIC_TOKEN_SOURCE = String.raw`(?<!\\)\*\*\*(?!\s)(.+?)(?<![\\\s])\*\*\*`;
const BOLD_TOKEN_SOURCE = String.raw`(?<!\\)\*\*(?!\s)(.+?)(?<![\\\s])\*\*`;
const ITALIC_TOKEN_SOURCE = String.raw`(?<!\\)\*(?!\s)(.+?)(?<![\\\s])\*`;
const MENTION_TOKEN_SOURCE = String.raw`@([\w-]+:[\w-]+)` + "`([^`]+)`";

// Matches a single mention token: @type:ext`name`
export const MENTION_TOKEN = new RegExp(MENTION_TOKEN_SOURCE);

// Plain Lexical text must escape the delimiters used by our restricted
// markdown format so a literal asterisk survives save -> load -> display.
export const escapeMarkdownText = (text: string) => text.replace(/[\\*]/g, "\\$&");
export const unescapeMarkdownText = (text: string) => text.replace(/\\([\\*])/g, "$1");

// Combined token matcher for display: bold+italic, bold, italic, mention —
// order matters (bold+italic must be tried before plain bold/italic).
export const DISPLAY_TOKEN_REGEX = new RegExp(
  [
    BOLD_ITALIC_TOKEN_SOURCE, // 1: bold+italic
    BOLD_TOKEN_SOURCE,        // 2: bold
    ITALIC_TOKEN_SOURCE,      // 3: italic
    MENTION_TOKEN_SOURCE,     // 4,5: mention sid, name
  ].join("|"),
  "g"
);

// Same token grammar with one outer capture for the editor deserializer.
export const EDITOR_TOKEN_REGEX = new RegExp(
  `(${[
    BOLD_ITALIC_TOKEN_SOURCE,
    BOLD_TOKEN_SOURCE,
    ITALIC_TOKEN_SOURCE,
    MENTION_TOKEN_SOURCE,
  ].join("|")})`
);

import { $createMentionNode, $isMentionNode } from "@lib/Inputs/Mentions/MentionNode";
import { EDITOR_TOKEN_REGEX, escapeMarkdownText, unescapeMarkdownText } from "@lib/markdownGrammar";
import { $getRoot, $createTextNode, $createParagraphNode, $isTextNode } from "lexical";

export function serializeEditorState(): string {
  const lines: string[] = [];
  $getRoot().getChildren().forEach((paragraph: any) => {
    let line = "";
    paragraph.getChildren?.().forEach((child: any) => {
      if ($isTextNode(child)) {
        let text = escapeMarkdownText(child.getTextContent());
        const bold = child.hasFormat("bold");
        const italic = child.hasFormat("italic");
        if (bold && italic) text = `***${text}***`;
        else if (bold) text = `**${text}**`;
        else if (italic) text = `*${text}*`;
        line += text;
      } else if ($isMentionNode(child)) {
        line += `@${child.getSid()}\`${child.getName()}\``;
      }
    });
    lines.push(line);
  });
  return lines.join("\n");
}

// Restricted to exactly the subset we allow: ***bold+italic***, **bold**,
// *italic*, and @sid`name` mentions. Anything else stays literal text.
export function deserializeToEditorState(text: string) {
  const root = $getRoot();
  root.clear();

  text.split("\n").forEach((lineText) => {
    const paragraph = $createParagraphNode();
    let remaining = lineText;

    while (remaining.length > 0) {
      const match = EDITOR_TOKEN_REGEX.exec(remaining);
      if (!match) { paragraph.append($createTextNode(unescapeMarkdownText(remaining))); break; }
      if (match.index > 0) paragraph.append($createTextNode(unescapeMarkdownText(remaining.slice(0, match.index))));

      if (match[2] !== undefined) {
        const t = $createTextNode(unescapeMarkdownText(match[2])); t.toggleFormat("bold"); t.toggleFormat("italic");
        paragraph.append(t);
      } else if (match[3] !== undefined) {
        const t = $createTextNode(unescapeMarkdownText(match[3])); t.toggleFormat("bold");
        paragraph.append(t);
      } else if (match[4] !== undefined) {
        const t = $createTextNode(unescapeMarkdownText(match[4])); t.toggleFormat("italic");
        paragraph.append(t);
      } else if (match[6] !== undefined) {
        const sid = match[5], name = match[6];
        paragraph.append($createMentionNode(sid, name, sid.split(":")[0]));
      }
      remaining = remaining.slice(match.index + match[0].length);
    }
    root.append(paragraph);
  });
}

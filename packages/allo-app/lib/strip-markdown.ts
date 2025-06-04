export function stripMarkdown(markdown: string, maxLength?: number): string {
  // Regex patterns to match different Markdown syntax
  const headerRegex = /^#{1,6}\s+/gm; // Matches headers starting with #
  const otherMarkdownRegex =
    /(\*\*|__|[*_~`]|!?\[.*?\]\(.*?\)|<.*?>|`{3}[\s\S]*?`{3}|`{1}[\s\S]*?`{1}|[-+*]\s+|>\s+|\d+\.\s+|\n|\r|\t)/g;

  // Replace headers and other markdown patterns with an empty string
  let plainText = markdown?.replace(headerRegex, "");
  plainText = plainText?.replace(otherMarkdownRegex, "").trim();

  // If maxLength is provided, slice the text to the desired length
  if (maxLength !== undefined && maxLength > 0) {
    plainText = plainText?.slice(0, maxLength);
  }

  return plainText ?? "";
}

/**
 * Reading time from raw Markdown body.
 *
 * We strip code fences, HTML tags, and Markdown punctuation so the word count
 * reflects prose, then divide by an average adult reading speed. 200 wpm is a
 * conservative, widely-used default for technical writing.
 */
export function readingTime(markdown: string): string {
  const text = markdown
    .replace(/```[\s\S]*?```/g, " ") // fenced code blocks
    .replace(/`[^`]*`/g, " ") // inline code
    .replace(/<\/?[^>]+>/g, " ") // html tags
    .replace(/[#>*_~\-!\[\]()]/g, " "); // md punctuation

  const words = text.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

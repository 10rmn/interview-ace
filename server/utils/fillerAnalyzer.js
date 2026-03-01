/**
 * Analyze an answer string for common filler words/phrases.
 *
 * Returns:
 * - totalFillerCount: number
 * - frequencies: { [filler: string]: number }
 * - cleanedText: string
 */
function analyzeFillers(input, fillerList = ["um", "uh", "like", "you know"]) {
  const text = String(input ?? "");
  const frequencies = Object.create(null);

  // Helper: escape regex special chars
  const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  // Build per-filler regex (case-insensitive, global)
  // - uses "not a word char" boundaries so "album" won't match "um"
  // - allows flexible spacing inside multi-word fillers (e.g., "you   know")
  const buildFillerRegex = (filler) => {
    const parts = filler.trim().split(/\s+/).map(escapeRegExp);
    const phrase = parts.join("\\s+");
    // Allow optional commas/periods right after filler, e.g. "um," or "you know..."
    return new RegExp(String.raw`(?<!\w)${phrase}(?!\w)(?=[\s.,!?;:)]|$)`, "gi");
  };

  let totalFillerCount = 0;

  for (const filler of fillerList) {
    const key = filler.toLowerCase();
    const re = buildFillerRegex(filler);

    const matches = text.match(re) || [];
    const count = matches.length;

    frequencies[key] = count;
    totalFillerCount += count;
  }

  // Clean text: remove all fillers
  let cleanedText = text;
  for (const filler of fillerList) {
    const re = buildFillerRegex(filler);
    cleanedText = cleanedText.replace(re, "");
  }

  // Normalize whitespace + punctuation spacing
  cleanedText = cleanedText
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([.,!?;:])/g, "$1")
    .replace(/\(\s+/g, "(")
    .replace(/\s+\)/g, ")")
    .trim();

  return { totalFillerCount, frequencies, cleanedText };
}

module.exports = { analyzeFillers };

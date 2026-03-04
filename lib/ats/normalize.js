export function normalize(text = "") {
  return text
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9.+#\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Minimal, dependency-free CSV parser (RFC4180-ish): handles quoted fields
 * containing commas, escaped quotes (""), and both \n and \r\n line endings.
 * No external library needed — this only ever parses small admin-uploaded
 * files, so it doesn't need to handle every edge case a general-purpose
 * CSV library would.
 */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  let i = 0;

  while (i < text.length) {
    const char = text[i];

    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i++;
        continue;
      }
      field += char;
      i++;
      continue;
    }

    if (char === '"') {
      inQuotes = true;
      i++;
      continue;
    }

    if (char === ",") {
      row.push(field);
      field = "";
      i++;
      continue;
    }

    if (char === "\n" || char === "\r") {
      if (char === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
      i++;
      continue;
    }

    field += char;
    i++;
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows.filter((r) => r.some((cell) => cell.trim().length > 0));
}

export interface ParsedQaRow {
  keywords: string[];
  answer_1: string;
  answer_2: string;
  answer_3: string;
}

/**
 * Parses a Q&A CSV with columns: keywords, answer_1, answer_2, answer_3.
 * The keywords cell holds multiple trigger words separated by semicolons.
 * Skips the header row automatically (detected by "keyword" appearing in
 * the first cell) and any row missing keywords or a first answer.
 */
export function parseQaCsv(text: string): ParsedQaRow[] {
  const rows = parseCsv(text);
  if (rows.length === 0) return [];

  const firstCell = (rows[0]?.[0] ?? "").trim().toLowerCase();
  const dataRows = firstCell.includes("keyword") ? rows.slice(1) : rows;

  const parsed: ParsedQaRow[] = [];

  for (const row of dataRows) {
    const keywordsCell = (row[0] ?? "").trim();
    const answer1 = (row[1] ?? "").trim();
    const answer2 = (row[2] ?? "").trim();
    const answer3 = (row[3] ?? "").trim();

    const keywords = keywordsCell
      .split(";")
      .map((k) => k.trim())
      .filter(Boolean);

    if (keywords.length === 0 || !answer1) continue;

    parsed.push({ keywords, answer_1: answer1, answer_2: answer2, answer_3: answer3 });
  }

  return parsed;
}

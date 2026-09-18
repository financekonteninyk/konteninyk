import type { Locale } from "@/lib/i18n/locale";

export const BOT_NAME = "CS Kontenin.yk";

interface ChatIntent {
  id: string;
  keywords: Record<Locale, string[]>;
  reply: Record<Locale, string>;
  showWaButton?: boolean;
}

/**
 * Rule-based knowledge base — NOT a generative AI. Each intent is matched
 * by counting keyword hits in the visitor's message; the highest-scoring
 * intent wins. Content is sourced directly from Kontenin.yk's agency
 * profile and founder bio so answers stay accurate to the real business.
 */
// Empty on purpose — CS Kontenin.yk's entire knowledge base now comes from
// the Q&A CSV you upload in Admin → Chat Assistant. Nothing is hardcoded
// here anymore, so every answer traces back to something you actually wrote.
const INTENTS: ChatIntent[] = [];

const FALLBACK_REPLY: Record<Locale, string> = {
  id: "Hmm, aku belum nangkep maksudnya nih 😅 Coba tanya soal layanan kami, content pillar, GLS, founder, klien, atau lokasi kami — atau langsung chat tim kami di WhatsApp kalau butuh jawaban lebih detail.",
  en: "Hmm, I didn't quite catch that 😅 Try asking about our services, content pillars, GLS, our founder, clients, or location — or chat directly with our team on WhatsApp for more detailed answers.",
};

export interface ChatReply {
  text: string;
  showWaButton: boolean;
  matched: boolean;
}

/** Matches a visitor's message against the knowledge base and returns the best-fit reply. */
export function getChatReply(message: string, locale: Locale, qaEntries?: ChatQaEntryLike[]): ChatReply {
  const normalized = message.toLowerCase();

  let bestIntent: ChatIntent | null = null;
  let bestScore = 0;

  for (const intent of INTENTS) {
    const score = intent.keywords[locale].reduce(
      (count, keyword) => (normalized.includes(keyword) ? count + 1 : count),
      0
    );
    if (score > bestScore) {
      bestScore = score;
      bestIntent = intent;
    }
  }

  if (bestIntent) {
    return { text: bestIntent.reply[locale], showWaButton: Boolean(bestIntent.showWaButton), matched: true };
  }

  const qaMatch = matchQaEntry(normalized, qaEntries ?? []);
  if (qaMatch) {
    return { text: qaMatch, showWaButton: true, matched: true };
  }

  return { text: FALLBACK_REPLY[locale], showWaButton: true, matched: false };
}

export interface ChatQaEntryLike {
  keywords: string[];
  answer_1: string;
  answer_2: string | null;
  answer_3: string | null;
}

/** Finds the best-matching custom Q&A entry and returns a randomly-picked variant among its answers. */
function matchQaEntry(normalizedMessage: string, entries: ChatQaEntryLike[]): string | null {
  let bestEntry: ChatQaEntryLike | null = null;
  let bestScore = 0;

  for (const entry of entries) {
    const score = entry.keywords.reduce(
      (count, keyword) => (normalizedMessage.includes(keyword.toLowerCase()) ? count + 1 : count),
      0
    );
    if (score > bestScore) {
      bestScore = score;
      bestEntry = entry;
    }
  }

  if (!bestEntry) return null;

  const variants = [bestEntry.answer_1, bestEntry.answer_2, bestEntry.answer_3].filter(
    (v): v is string => Boolean(v && v.trim())
  );
  if (variants.length === 0) return null;

  return variants[Math.floor(Math.random() * variants.length)]!;
}

/** Confirmation shown when the user switches the chat's reply language —
 * always written in the language being switched TO, not translated via
 * the site's UI locale (that would defeat the point). */
export function getLanguageSwitchMessage(target: Locale): string {
  return target === "id"
    ? "Baik, sekarang saya akan menjawab dalam Bahasa Indonesia! Mau tanya tentang apa?"
    : "Got it — I'll reply in English from now on! What would you like to know?";
}

export function getIntroMessage(locale: Locale): string {
  return locale === "en"
    ? `Hi, I'm ${BOT_NAME} 👋 Ask me about our services, pricing, or anything about Kontenin.yk. What's on your mind?`
    : `Halo, aku ${BOT_NAME} 👋 Tanya aja soal layanan, harga, atau apa pun soal Kontenin.yk. Ada yang bisa dibantu?`;
}

/** Quick-reply suggestions shown when the chat first opens, so visitors don't have to type.
 * Worded to line up with keywords already in the default Q&A CSV (matching is exact-substring,
 * not fuzzy) — if you add new keywords later, keep these in sync so the chips stay reliable. */
export function getSuggestedQuestions(locale: Locale): string[] {
  return locale === "en"
    ? [
        "What are your service prices?",
        "Why choose Kontenin.yk?",
        "What services do you offer?",
        "How do I place an order?",
        "Can I see your client portfolio?",
        "What is the Growth Loop System?",
        "How long does a project take?",
      ]
    : [
        "Berapa harga layanannya?",
        "Kenapa pilih Kontenin.yk?",
        "Layanan apa saja yang tersedia?",
        "Gimana cara order?",
        "Bisa lihat portofolio klien?",
        "Apa itu Growth Loop System?",
        "Berapa lama proses pengerjaan?",
      ];
}

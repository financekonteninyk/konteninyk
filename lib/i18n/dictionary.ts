import type { Locale } from "./locale";

export const dictionary = {
  id: {
    nav_portfolio: "Portofolio",
    nav_process: "Cara Kami Bekerja",
    nav_services: "Layanan",
    nav_about: "Tentang Kami",
    view_portfolio: "Lihat Portofolio",
    view_our_work: "Lihat Karya Kami",
    start_consultation: "Mulai Konsultasi Gratis",
    cta_subtext:
      "Ceritakan kebutuhan brand kamu — kami siap membantu menemukan langkah yang tepat.",
    chat_hint: "Ada yang bisa dibantu? 👋",

    activity_photos_label: "Kegiatan Kami",
    featured_work_label: "Karya Pilihan",

    why_us_heading_1: "Bukan Sekadar",
    why_us_heading_2: "Membuat Konten.",

    why_us_1_title: "Growth Loop System",
    why_us_1_desc:
      "Kami membangun sistem yang menghubungkan strategi, produksi, dan evaluasi dalam satu siklus berkelanjutan — sehingga setiap konten menjadi peluang untuk belajar dan berkembang.",

    why_us_2_title: "Strategi Sebelum Produksi",
    why_us_2_desc:
      "Kami memahami karakter brand, audiens, tujuan bisnis, dan posisi brand di pasar sebelum menentukan strategi dan memproduksi konten.",

    why_us_3_title: "Partner Kreatif untuk Brand Anda",
    why_us_3_desc:
      "Kami tidak sekadar menjadi vendor. Kami bekerja bersama brand untuk membangun identitas yang kuat, konsisten, dan relevan dalam jangka panjang.",

    enter_admin: "Masuk Mode Admin",
    read_full_story: "Baca Cerita Lengkap Kami",
    about_us: "Tentang Kami",
    who_we_are: "Siapa Kami",
    what_we_do: "Apa yang Kami Kerjakan",
    how_we_work: "Cara Kami Bekerja",
    selected_work: "Karya Pilihan",
    lets_talk: "Mari Bicara",

    trusted_by: "Dipercaya oleh brand yang telah kami bantu berkembang",

    /* This section shows actual creative work (short videos, carousels) —
       it's now the site's "Portfolio", swapped from the old client-logo
       grid below. */
    gallery_heading: "Portofolio",
    gallery_subheading:
      "Sebagian dari ratusan konten yang telah kami produksi untuk klien kami.",
    gallery_video_label: "Video Pendek",
    gallery_carousel_label: "Carousel",

    /* The client-case-study grid — previously labeled "Portfolio", now
       reframed as a partner/trust showcase since the actual portfolio
       (the content gallery above) has that name now. */
    partners_eyebrow: "Kolaborasi",
    partners_heading: "Brand yang Sudah Bekerja Sama",
    partners_subheading:
      "Sebagian brand yang mempercayakan kebutuhan kontennya kepada kami.",

    admin: "Admin",
    home: "Beranda",

    /* Services section — now shows the three sellable packages directly,
       with pricing revealed on tap/click rather than listed all at once. */
    services_desc:
      "Tiga cara kami bisa membantu brand kamu bertumbuh — pilih salah satu untuk lihat detail dan harganya.",
    services_tap_hint: "Ketuk untuk lihat harga",
    services_cta: "Diskusikan Paket Ini",

    process_heading: "Growth Loop System",
    process_desc:
      "Kami tidak sekadar membuat konten. Kami membangun sistem yang membantu brand terus berkembang. Melalui empat tahap yang saling terhubung, setiap strategi, konten, dan insight menjadi bagian dari proses pertumbuhan yang berkelanjutan.",

    process_loop_note:
      "Growth Loop membawa kami kembali ke tahap Strategy — setiap siklus membuat strategi berikutnya lebih tajam dari sebelumnya.",

    chat_placeholder: "Tanya tentang harga, layanan, atau apa saja...",
    chat_wa_button: "Chat via WhatsApp",
    chat_send: "Kirim",
  },

  en: {
    nav_portfolio: "Portfolio",
    nav_process: "How We Work",
    nav_services: "Services",
    nav_about: "About Us",
    view_portfolio: "View Portfolio",
    view_our_work: "View Our Work",
    start_consultation: "Start Free Consultation",
    cta_subtext:
      "Tell us what your brand needs — we're here to help you find the right direction.",
    chat_hint: "Need any help? 👋",

    activity_photos_label: "Behind the Scenes",
    featured_work_label: "Featured Work",

    why_us_heading_1: "More Than",
    why_us_heading_2: "Just Content.",

    why_us_1_title: "The Growth Loop System",
    why_us_1_desc:
      "We build a system that connects strategy, production, and evaluation in one continuous cycle — turning every piece of content into an opportunity to learn and grow.",

    why_us_2_title: "Strategy Before Production",
    why_us_2_desc:
      "We understand your brand, audience, business goals, and market position before shaping the strategy and producing the content.",

    why_us_3_title: "Your Brand's Creative Partner",
    why_us_3_desc:
      "We're more than a vendor. We work alongside brands to build strong, consistent, and relevant identities for long-term growth.",

    enter_admin: "Enter Admin Mode",
    read_full_story: "Read Our Full Story",
    about_us: "About Us",
    who_we_are: "Who We Are",
    what_we_do: "What We Do",
    how_we_work: "How We Work",
    selected_work: "Selected Work",
    lets_talk: "Let's Talk",

    trusted_by: "Trusted by brands we've helped grow",

    gallery_heading: "Portfolio",
    gallery_subheading:
      "A selection of the hundreds of content pieces we've produced for our clients.",
    gallery_video_label: "Short-Form Video",
    gallery_carousel_label: "Carousel",

    partners_eyebrow: "Collaborations",
    partners_heading: "Brands We've Worked With",
    partners_subheading:
      "A selection of brands who've trusted us with their content needs.",

    admin: "Admin",
    home: "Home",

    services_desc:
      "Three ways we can help your brand grow — pick one to see the details and pricing.",
    services_tap_hint: "Tap to see pricing",
    services_cta: "Discuss This Package",

    process_heading: "The Growth Loop System",
    process_desc:
      "We're not just creating content. We build systems that help brands keep growing. Through four connected stages, every strategy, piece of content, and insight becomes part of a continuous growth process.",

    process_loop_note:
      "The Growth Loop feeds back into Strategy — every cycle makes the next strategy sharper than the last.",

    chat_placeholder: "Ask about pricing, services, or anything...",
    chat_wa_button: "Chat on WhatsApp",
    chat_send: "Send",
  },
} as const;

export type DictionaryKey = keyof (typeof dictionary)["id"];

export function t(locale: Locale, key: DictionaryKey): string {
  return dictionary[locale][key];
}

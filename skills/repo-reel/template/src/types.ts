import type { IconName } from "./components/Icon";

/**
 * The whole video is described by one `Story` object (src/story.ts).
 * Every string on screen comes from here — fill it with facts read from the repo.
 */

export type Tone = "primary" | "info" | "warn" | "violet" | "danger";

export type Brand = {
  /** Product name, used as the wordmark when there is no logo. */
  name: string;
  tagline: string;
  /** Shown in the outro pill. Omit if the product has no public URL. */
  url?: string;
  /** Path under public/, e.g. "brand/logo.png". Must read well on a DARK background. */
  logo?: string;
  /** width / height of the logo image — required when `logo` is set. */
  logoAspect?: number;
  /** Square-ish mark for hubs/sidebars, e.g. "brand/icon.png". Falls back to a monogram. */
  icon?: string;
  palette: {
    /** Main brand colour (hex). */
    primary: string;
    /** Two stops for the hero gradient (headline words, drawn paths). Defaults to primary→soft. */
    gradient?: [string, string];
    /** Lighter tint used for highlights and glows. Derived from primary when omitted. */
    soft?: string;
    /** Darker shade. Derived when omitted. */
    deep?: string;
    info?: string;
    warn?: string;
    violet?: string;
    danger?: string;
    /** Page background — keep it very dark (#04–#0C range). */
    background?: string;
  };
};

type Base = {
  /** Override the scene's default length in frames (60 fps). */
  dur?: number;
};

export type Chip = { label: string; icon: IconName; tone?: Tone };

export type TitleScene = Base & { type: "title"; /** 1–2 lines under the logo; defaults to brand.tagline */ lines?: string[] };

export type ChaosScene = Base & {
  type: "chaos";
  /** e.g. ["Running logistics is", "chaotic."] — second item gets the glitch treatment. */
  problem: [string, string];
  /** e.g. "One platform." */
  answer: string;
  sub?: string;
  /** 6–12 things the product unifies. */
  chips: Chip[];
};

export type JourneyScene = Base & {
  type: "journey";
  eyebrow: string;
  /** Two-line headline; line 2 is gradient. */
  title: [string, string];
  /** 3–7 lifecycle stages, in order (read them from status enums / state machines). */
  stages: { title: string; status?: string; icon: IconName; tone?: Tone; badges?: string[] }[];
};

export type FlowScene = Base & {
  type: "flow";
  eyebrow: string;
  /** Words shown side by side; the last one is gradient. */
  title: string[];
  doc: {
    kicker: string; // "INVOICE", "ORDER", "BUILD"
    id: string; // "#INV-20417"
    items: string[]; // right-aligned values for the line items
    totalLabel: string;
    total: number;
    prefix?: string; // "$"
    decimals?: number;
    /** Status progression shown on the document, e.g. UNPAID → PARTIAL → PAID. Last one is the "done" state. */
    states: { label: string; tone: Tone }[];
    /** Big stamp text when the final state is reached. */
    stamp?: string;
    methods?: { icon: IconName; label: string }[];
  };
  flowLabel: string;
  /** 1–4 recipients the value fans out to. */
  destinations: { label: string; sub: string; amount?: number; tone?: Tone; badge?: string }[];
  illustrative?: boolean;
};

export type OrbitScene = Base & {
  type: "orbit";
  eyebrow: string;
  /** 4–8 actors / roles / services around the product hub. */
  nodes: Chip[];
  /** Caption: first part gradient, second part white. */
  caption: [string, string];
  sub?: string;
};

export type DashboardScene = Base & {
  type: "dashboard";
  eyebrow: string;
  title: [string, string];
  kpis: { label: string; value: number; prefix?: string; suffix?: string; decimals?: number; tone?: Tone }[];
  barsTitle: string;
  lineTitle: string;
  sidebar?: IconName[];
  toasts: { icon: IconName; title: string; sub: string; tone?: Tone }[];
  /** Optional scanning card under the toasts (e.g. an AI/automation feature). */
  scanCard?: { title: string; done: string };
  illustrative?: boolean;
};

export type TrustScene = Base & {
  type: "trust";
  eyebrow: string;
  title: [string, string];
  /** OTP / 2FA typing block — only if the product really has 2FA. */
  code?: { label: string; meta?: string; digits: string; verified?: string };
  features: { icon: IconName; title: string; sub: string; tone?: Tone }[];
};

export type StatsScene = Base & {
  type: "stats";
  eyebrow: string;
  title: [string, string];
  /** 3–6 real numbers counted from the repo (files, tests, endpoints, integrations…). */
  stats: { value: number; label: string; prefix?: string; suffix?: string; decimals?: number; tone?: Tone }[];
  /** Optional row of tech/tag pills under the stats. */
  tags?: string[];
};

export type ShowcaseScene = Base & {
  type: "showcase";
  title: [string, string];
  /** 1–3 cards: brands, apps, platforms, editions… */
  cards: {
    logo?: string;
    logoHeight?: number;
    /** Text next to / instead of the logo. */
    wordmark?: string;
    tagline: string;
    url?: string;
    tone?: Tone;
  }[];
  sub?: string;
};

export type OutroScene = Base & { type: "outro"; tagline?: string; url?: string };

export type SceneConfig =
  | TitleScene
  | ChaosScene
  | JourneyScene
  | FlowScene
  | OrbitScene
  | DashboardScene
  | TrustScene
  | StatsScene
  | ShowcaseScene
  | OutroScene;

export type Story = {
  brand: Brand;
  scenes: SceneConfig[];
  /** Background music bed volume (0 disables). */
  musicVolume?: number;
};

export type Cue = { at: number; sfx: SfxName; vol?: number; trim?: number };
export type SfxName = "whoosh" | "whoosh-short" | "impact" | "riser" | "tick" | "pop" | "key" | "chime" | "shimmer";

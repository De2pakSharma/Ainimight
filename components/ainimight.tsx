"use client"

import * as React from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import * as THREE from "three"
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js"
import CircularGallery from "./CircularGallery"
import "./CircularGallery.css"
import TextPressure from "./TextPressure"
import BounceCards from "./BounceCards"
import "./BounceCards.css"
import ScrollVelocity from "./ScrollVelocity"

/**
 * Oriel Studio Template
 *
 * A design-studio site told as a film: nine full-screen scenes, one on screen
 * at a time. Inside a scene the content glides on a soft lerped scroll; at the
 * scene's edge (after a small buffer, so one stray wheel tick never skips a
 * scene) the next scene slides in and its content rises and untilts.
 *
 * Every cut has a job:
 *   - scene slide        wheel, trackpad, PageDown / arrows / space
 *   - marquee flash      only between About and What we make (750 ms)
 *   - disc + logo stroke every menu, nav, Home / End / number-key jump
 *   - in-scene wipes     a black disc swallows the lilac People scene, a 1 px
 *                        line grows tall then wide into white after Work, the
 *                        rope's squircle floods the screen.
 *
 * How the scroll works: each scene is a real `overflow:auto` scroller (so
 * focus, find-in-page and screen readers scroll it natively). Wheel input is
 * taken over and eased into that scroller's scrollTop; every scrubbed effect is
 * a GSAP timeline on a ScrollTrigger whose `scroller` is the scene. Pinned
 * stages are plain `position:sticky`. When a scrubbed value crosses a threshold
 * a short timed tween fires (the tag pop, the slot-machine roll, the spell-in).
 *
 * Mobile (narrow or touch-only) and prefers-reduced-motion get a stacked page
 * on the window's native scroll: horizontal scenes stack, the form becomes a
 * bottom sheet, the rope renders at 1x. Reduced motion also drops every wipe
 * and scrub: timelines rest on their key frame and content simply fades in.
 *
 * Media: Pexels photos and videos (Pexels licence, free to use and modify).
 * Fonts: Inter Tight + Bricolage Grotesque (SIL OFL) from Google Fonts.
 */

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger)

export type OrielProject = {
  name: string
  kind: string
  year: string
  /** Any image URL. */
  img: string
}

export interface OrielStudioTemplateProps {
  /** Studio name: logo, menu, copy. */
  brand?: string
  /** The hero line, set in the quirky display face. */
  headline?: string
  projects?: OrielProjectX[]
  email?: string
  /** Height of the film frame. Must be a definite length. */
  height?: string
  /** "auto" follows the host's .dark class. */
  theme?: "auto" | "light" | "dark"
  /**
   * Frames for the rope scene, scrubbed by scroll (e.g. 48 photographic renders of a knot coming undone).
   * Without them the frames are baked once from the built-in 3D rope.
   */
  ropeFrames?: string[]
  /** Google Fonts stylesheet; null loads nothing (bring your own fonts). */
  fontHref?: string | null
  className?: string
}

const FONT_HREF =
  "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,300..800&family=Inter+Tight:wght@300..800&display=swap"

/** Local brand work, shipped beside the page. */
const IMG = (n: string, sm = false) => "./work/" + n + (n.endsWith(".svg") ? "" : sm ? "-sm.webp" : ".webp")
const LOGO = "./logo.png"

/** Frames in the baked rope sequence. */
const ROPE_FRAMES = 64
const REEL = ["munch-grid"]
const MAKE = "sarrohi-1"

export type OrielProjectX = OrielProject & { caseId?: string }

const DEFAULT_PROJECTS: OrielProjectX[] = [
  { name: "Munchbrew", kind: "Packaging Design", year: "munchbrew.com", img: IMG("munch-grid"), caseId: "munchbrew" },
  { name: "Sarrohi", kind: "Visual language", year: "sarrohi.com", img: IMG("sarrohi-1"), caseId: "sarrohi" },
  { name: "Impact & Dialogue", kind: "Brand Identity & Logo Redesign", year: "impactdialogue.org", img: IMG("idf-1"), caseId: "idf" },
  { name: "Being Men", kind: "Identity", year: "YouTube", img: IMG("beingmen-1"), caseId: "beingmen" },
  { name: "Loomi", kind: "Branding and packaging", year: "Wellness", img: IMG("loomi-boxes"), caseId: "loomi" },
  { name: "Rollercoaster", kind: "Book cover design", year: "Publishing", img: IMG("book-rollercoaster"), caseId: "rollercoaster" },
  { name: "55 Questions", kind: "Book cover design", year: "Publishing", img: IMG("book-55-questions"), caseId: "q55" },
]

/** About cards: every line is lifted word for word from the project files. */
const CARDS = [
  {
    tint: "var(--or-warm)",
    tag: "Why we exist?",
    title: "Bad design is everywhere.",
    text: "And every time we encounter it, something inside us refuses to accept it as good enough. Ainimight Studio was built on that refusal. We believe exceptional design shouldn't be a luxury. Every brand regardless of stage or sector deserves an identity that's precise, purposeful, and impossible to forget.",
    clip: IMG("munch-bluepea"),
    caseId: "munchbrew",
  },
  {
    tint: "var(--or-mint)",
    tag: "What we do?",
    title: "Impossible to ignore — and impossible to forget.",
    text: "We are a multidisciplinary creative studio. We build brand identities, illustration systems, packaging, animation, and publications that make brands impossible to ignore — and impossible to forget.",
    clip: IMG("sarrohi-1"),
    caseId: "sarrohi",
  },
  {
    tint: "var(--or-lilac-soft)",
    tag: "When we show up ?",
    title: "When a brand is ready to stop blending in.",
    text: "When a founder knows their business deserves more than a generic logo. When a company is launching, scaling, or finally becoming what it always should have been.",
    clip: IMG("idf-1"),
    caseId: "idf",
  },
  {
    tint: "var(--or-blush-soft)",
    tag: "How we work ?",
    title: "Nothing is generic. Nothing is accidental.",
    text: "We don’t separate strategy from aesthetics. We start with who you are, understand what you want to feel like, and build the visual world that makes that real. Every element is considered.",
    clip: IMG("loomi-trio"),
    caseId: "loomi",
  },
  {
    tint: "var(--or-warm)",
    tag: "Who we are ?",
    title: "A focused, senior-led studio.",
    text: "We operate with the intentionality of a boutique and the rigour of an agency. Our team brings cross-disciplinary expertise across brand strategy, illustration, motion, packaging, and editorial design — every project led by the same hands from brief to delivery.",
    clip: IMG("beingmen-1"),
    caseId: "beingmen",
  },
]

const AVATARS = ["munch-bluepea", "sarrohi-bag", "idf-4", "beingmen-poster", "loomi-cover", "munch-hibiscus", "book-rollercoaster-flat", "idf-1", "munch-jasmine"]
const TAGS = ["Branding systems", "Packaging", "Illustration", "Animation"]
const CURSORS = [
  { name: "Aina", c: "#f08a7e", x: -38, y: -20 },
  { name: "Client", c: "#4c5c8e", x: 36, y: -17 },
  { name: "Print", c: "#3fbf8f", x: 38, y: 8 },
  { name: "Type", c: "#c58cf2", x: -40, y: 12 },
  { name: "Colour", c: "#f995c7", x: -14, y: 22 },
  { name: "Copy", c: "#4fb7e8", x: 18, y: 23 },
]
const PROOF = ["Make it mean something", "Curiosity before conclusion", "Craft is non negotiable", "The brand’s voice, amplified"]
const CLIENTS = ["Munchbrew", "Sarrohi", "Impact and Dialogue Foundation", "The Being Men Show", "Loomi", "Cladiron", "Vishwakarma Publications", "Amit Baraskar"]
const SERVICES = ["Branding", "Packaging", "Illustration", "Animation", "Publishing", "Something else"]
const BUDGETS = ["The Seed", "The Foundation", "The Startup", "The Enterprise"]

/** Project stack: one card per client, captions from the brand profile. */
const CASE = [
  { img: "munch-grid", t: "Munchbrew · Packaging Design", d: "Packaging that made consumers trust the product before a single word was read.", id: "munchbrew" },
  { img: "sarrohi-1", t: "Sarrohi", d: "We are rooted, and we are here to stay.", id: "sarrohi" },
  { img: "idf-1", t: "Impact and Dialogue Foundation", d: "Approachable enough to welcome survivors, credible enough to attract serious investment.", id: "idf" },
  { img: "beingmen-1", t: "The Being Men Show", d: "A visual voice that felt honest, confident, and worth watching.", id: "beingmen" },
  { img: "loomi-trio", t: "Loomi · Branding and packaging", d: "Packaging you'd want to keep, not throw away.", id: "loomi" },
  { img: "book-rollercoaster", t: "The Entrepreneurial Rollercoaster", d: "Reads clearly at thumbnail.", id: "rollercoaster" },
]

const SERVICE_COLS = [
  { n: "01", h: "Branding Systems", p: "Strategy, identity, typography, colour, tone of voice. We don't just make things look good — we make them make sense." },
  { n: "02", h: "Packaging", p: "Structure, finish, illustration — all considered. We design packaging that makes people pick your product off the shelf and never put it back." },
  { n: "03", h: "Illustration", p: "Characters, brand worlds, editorial art. We draw the things words can't say — and make sure they say exactly the right thing" },
  { n: "04", h: "Animation", p: "Logo reveals, explainer videos, social content. We create movement that communicates, engages, and sticks." },
]
const ROI = [
  { n: 23, k: "Revenue & Growth", p: "Consistent branding drives up to 23% increase in revenue. Strong brands achieve 3x the sales volume and command a 13% price premium. Brand-connected customers are 52% more valuable to a business." },
  { n: 81, k: "Purchase Behaviour", p: "81% of consumers must trust a brand before buying. 59% prefer buying from brands they already know. 46% will pay more from a brand they trust. It takes 5-7 brand interactions to be recalled. Every touchpoint counts." },
  { n: 82, k: "Scaling & Investment", p: "82% of investors want a strong brand before committing capital. Top brands outperformed the world market in shareholder returns by 74%. Strong brand foundations consistently lead to better fundraising outcomes. (Fabrik Brands)" },
]
const VALUES = [
  { h: "Make it mean something", p: "We don’t make things pretty for the sake of pretty. Every creative decision is anchored in purpose, strategy, and the brand’s actual truth." },
  { h: "Curiosity before conclusion", p: "We ask the uncomfortable questions before we pick up the pen. Understanding comes before execution — always" },
  { h: "Craft is non negotiable", p: "Good enough is never good enough here. We work until the details stop standing out and start holding the whole thing together" },
  { h: "The brand’s voice, amplified", p: "We don’t replace your vision. We clarify it, strengthen it, and give it a form that the world can feel." },
]
const PLANS = [
  { t: "The Seed", pr: "Rs. 25,000", p: "1 logo + colour palette + Primary & secondary font + 2 revision rounds" },
  { t: "The Foundation", pr: "Rs. 40,000", p: "Primary + secondary logo + Moodboard + 2 font sets + 3 revision rounds" },
  { t: "The Startup", pr: "Rs. 70,000", p: "Primary & secondary logo + logo mark + Business card + letterhead + Social media kit + 5 revision rounds" },
  { t: "The Enterprise", pr: "Rs. 1,25,000", hot: true, p: "Primary & secondary logo, logo mark + Business card + letterhead + Social media kit + typography system for print & digital + Brand positioning + Brand Strategy (ICP + competitor study) + Packaging artwork / illustration for 2 SKUs" },
]

type Mood = { id: string; name: string; tag: string; made: string; body: string[]; ing: [string, string][]; bg: string; ink: string; fg: string; tone: "light" | "dark" }
const MOODS: Mood[] = [
  {
    id: "calm",
    name: "Loomi Calm",
    tag: "Calm your nerves, but keep your wonder",
    made: "24 gummies made with Ashwagandha , Chamomile & Lemon Balm",
    body: ["For the overthinkers, the deep feelers and the ones who carry a little too much.", "Loomi Calm combines Ashwagandha, Chamomile and Lemon Balm to help you find moments of ease without dimming your curiosity.", "Take a breath. You've got this."],
    ing: [["Ashwagandha", "Supports the body's response to everyday stress."], ["Chamomile", "Traditionally used to promote relaxation."], ["Lemon Balm", "Helps encourage a sense of calm and ease."]],
    bg: "#e9c8f7",
    ink: "#4c5c8e",
    fg: "#23284a",
    tone: "light",
  },
  {
    id: "chill",
    name: "Loomi Chill",
    tag: "Unwind slowly, let the overthinking go.",
    made: "24 gummies made with Goji Berry Lemon balm , passionflower and Ashwagandha",
    body: ["Some days move a little too fast.", "Loomi Chill is made for those moments when you want to slow down, reset and breathe a little deeper.", "Relax into the present."],
    ing: [["Ashwagandha", "Supports the body's response to everyday stress."], ["Chamomile", "Traditionally used to promote relaxation."], ["Lemon Balm", "Helps encourage a sense of calm and ease."]],
    bg: "#93c7ff",
    ink: "#9b2c47",
    fg: "#1d2b52",
    tone: "light",
  },
  {
    id: "sleep",
    name: "Loomi Sleep",
    tag: "Sleep peacefully, wake wonderfully.",
    made: "24 gummies made with Chamomile, L-Theanine & Melatonin",
    body: ["When your mind won't switch off, give it permission to rest.", "Loomi Sleep combines calming botanicals with Melatonin to help support a peaceful night's sleep and a refreshed morning.", "Good nights begin with gentle rituals."],
    ing: [["Chamomile", "Supports relaxation before bedtime."], ["L-Theanine", "Encourages a calm, relaxed state."], ["Melatonin", "Supports healthy sleep cycles."]],
    bg: "#0b1433",
    ink: "#f07fa8",
    fg: "#e8ebff",
    tone: "dark",
  },
]

const BRANDS = [
  { name: "Munchbrew", kind: "Packaging Design", imgs: ["munch-bluepea", "munch-hibiscus", "munch-jasmine", "munch-lavender", "munch-chamomile"], caseId: "munchbrew", words: [] as string[] },
  { name: "Sarrohi", kind: "Visual language", imgs: ["sarrohi-1", "sarrohi-bag", "sarrohi-boxes", "sarrohi-cards"], caseId: "sarrohi", words: [] as string[] },
  { name: "Impact & Dialogue", kind: "Brand Identity & Logo Redesign", imgs: ["idf-1", "idf-2", "idf-3", "idf-4"], caseId: "idf", words: [] as string[] },
  { name: "Being Men", kind: "Identity", imgs: ["beingmen-1", "beingmen-poster", "beingmen-phone"], caseId: "beingmen", words: [] as string[] },
  { name: "Loomi", kind: "Branding and packaging", imgs: ["loomi-trio", "loomi-boxes", "loomi-cover", "loomi-sachets"], caseId: "loomi", words: [] as string[] },
  { name: "Cladiron", kind: "Logo / identity", imgs: [], caseId: "cladiron", words: ["Multi dimensional", "Reliant", "Sturdy"] },
]

const SHELF = [
  { image: IMG("book-rollercoaster-flat"), text: "The Entrepreneurial Rollercoaster", caseId: "rollercoaster" },
  { image: IMG("book-look-between-flat"), text: "The Look Between", caseId: "look" },
  { image: IMG("book-bosses-wild-flat"), text: "Bosses of the Wild", caseId: "bosses" },
  { image: IMG("book-55-questions-flat"), text: "55 Questions on Health & Fitness", caseId: "q55" },
  { image: IMG("munch-lavender"), text: "Munchbrew Lavender", caseId: "munchbrew" },
  { image: IMG("beingmen-poster"), text: "The Being Men Show", caseId: "beingmen" },
  { image: IMG("munch-chamomile"), text: "Munchbrew Chamomile", caseId: "munchbrew" },
]

// ---- case studies: every string below is copied word for word from the Drive files ----------
type Block =
  | { t: "h"; text: string }
  | { t: "p"; text: string; lead?: boolean }
  | { t: "quote"; text: string; by?: string }
  | { t: "img"; src: string; cap?: string; tall?: boolean }
  | { t: "imgs"; srcs: string[]; tall?: boolean }
  | { t: "pairs"; items: [string, string | string[]][] }
  | { t: "list"; title: string; items: string[] }
  | { t: "swatch"; items: [string, string, boolean?][]; note?: string }
  | { t: "cols"; items: { k: string; h: string; p: string; img?: string; sw?: string }[] }
  | { t: "bounce"; srcs: string[]; cap: string }
  | { t: "moods" }
  | { t: "glow"; lines: string[] }
  | { t: "link"; href: string; label: string }
type CaseStudy = { title: string; kicker: string; sub?: string; meta?: [string, string][]; hero?: string; tint: string; blocks: Block[]; foot?: string }

const CASES: Record<string, CaseStudy> = {
  munchbrew: {
    title: "Munchbrew",
    kicker: "Packaging Design",
    sub: "A premium tea and honey brand",
    hero: "munch-grid",
    tint: "#c9a45c",
    meta: [["Client", "Munchbrew"], ["Discipline", "Packaging Design"], ["Live", "munchbrew.com"]],
    blocks: [
      { t: "p", lead: true, text: "A premium tea and honey brand needed packaging worthy of their craft. We built a visual identity system that placed them alongside the finest in the Indian market — packaging that made consumers trust the product before a single word was read." },
      { t: "link", href: "https://munchbrew.com/", label: "https://munchbrew.com/" },
      { t: "imgs", srcs: ["munch-bluepea", "munch-hibiscus"] },
      { t: "imgs", srcs: ["munch-jasmine", "munch-chamomile"] },
      { t: "img", src: "munch-lavender", tall: true },
    ],
  },
  sarrohi: {
    title: "Sarrohi",
    kicker: "Visual language — identity, typography, tone",
    sub: "A fashion brand rooted in Indian culture and craft",
    hero: "sarrohi-1",
    tint: "#6b4a34",
    meta: [["Client", "Sarrohi"], ["Discipline", "Identity, typography, tone"], ["Live", "sarrohi.com"]],
    blocks: [
      { t: "p", lead: true, text: "A fashion brand rooted in Indian culture and craft needed to feel both premium and proud of its heritage. We built a complete visual language — identity, typography, tone — that said: we are rooted, and we are here to stay." },
      { t: "link", href: "https://sarrohi.com/", label: "https://sarrohi.com/" },
      { t: "imgs", srcs: ["sarrohi-bag", "sarrohi-boxes"] },
      { t: "img", src: "sarrohi-cards" },
      { t: "img", src: "sarrohi-live", cap: "sarrohi.com — live" },
    ],
  },
  idf: {
    title: "Impact and Dialogue Foundation",
    kicker: "Brand Identity & Logo Redesign",
    sub: "An NGO dedicated to fighting human trafficking",
    hero: "idf-1",
    tint: "#0e8c8c",
    meta: [["Client", "Impact and Dialogue Foundation"], ["Discipline", "Brand Identity & Logo Redesign"], ["Live", "impactdialogue.org"]],
    blocks: [
      { t: "p", lead: true, text: "An NGO dedicated to fighting human trafficking needed a new identity that could hold two truths simultaneously: approachable enough to welcome survivors, credible enough to attract serious investment. We redesigned their logo and full brand system to do exactly that." },
      { t: "link", href: "https://impactdialogue.org/", label: "https://impactdialogue.org/" },
      { t: "imgs", srcs: ["idf-4", "idf-2"] },
      { t: "img", src: "idf-3" },
      { t: "img", src: "idf-live", cap: "impactdialogue.org — live" },
    ],
  },
  beingmen: {
    title: "The Being Men Show",
    kicker: "Identity",
    sub: "A media brand exploring modern masculinity",
    hero: "beingmen-1",
    tint: "#e4572e",
    meta: [["Client", "The Being Men Show"], ["Discipline", "Identity"], ["Live", "youtube.com/@beingmenshow"]],
    blocks: [
      { t: "p", lead: true, text: "A media brand exploring modern masculinity needed a visual voice that felt honest, confident, and worth watching. We shaped the identity to match the conversation they were starting and the audience they were building." },
      { t: "link", href: "https://www.youtube.com/@beingmenshow", label: "https://www.youtube.com/@beingmenshow" },
      { t: "imgs", srcs: ["beingmen-poster", "beingmen-phone"], tall: true },
      { t: "img", src: "beingmen-banner", cap: "youtube.com/@beingmenshow — live" },
    ],
  },
  loomi: {
    title: "Loomi",
    kicker: "Project Overview - Branding and packaging",
    hero: "loomi-cover",
    tint: "#f995c7",
    meta: [["Project", "Branding and packaging"], ["Primary Colour", "4c5c8e"], ["Secondary Colour", "f995c7"], ["Net Qty", "24 Gummies"]],
    blocks: [
      { t: "h", text: "Calming your Inner world" },
      { t: "p", text: "We live in an overstimulated world.", lead: true },
      { t: "p", text: "Information never stops flowing in and our nervous systems feel it. We can't control the happenings of the world. But we can regulate how we hold them." },
      { t: "quote", text: "Loomi comes from Lumen + Umi.\nLight flowing like water. Calm you can keep." },
      { t: "p", text: "The positioning is simple: small rituals, and products that comfort without clashing. Packaging you'd want to keep, not throw away." },
      { t: "p", text: "So the packaging had to be as distinctive as the problem it solves. Not another gummy bag destined for the bin but something that stays with you, long after." },
      { t: "p", text: "Our role was to keep the brand approachable, youthful, and poised. We built a scalable system across branding, visual identity, packaging, and positioning one built to stand out." },
      { t: "p", text: "The palette is inviting by design. Something that doesn't just sit on a shelf, but becomes part of your routine." },
      { t: "img", src: "loomi-trio" },
      { t: "h", text: "The Loomi Logo" },
      { t: "p", text: "To highlight the part that it’s something related to light and calmness at the same time, we came up with a lightning bolt with a wellness leaf to describe the fluidity of the brand and its product." },
      { t: "img", src: "loomi-logo-1", cap: "Logomark Breakdown" },
      { t: "cols", items: [
        { k: "Lumen", h: "Lightning bolt", p: "Lightning bolt to represent the name Lumen" },
        { k: "Wellness", h: "Plant", p: "The wellness part is kept generic and known to the industry so a plant to represent the calmness that brand aims to bring ." },
      ] },
      { t: "img", src: "loomi-logo-4" },
      { t: "imgs", srcs: ["loomi-basket", "loomi-char-calm"], tall: true },
      { t: "imgs", srcs: ["loomi-logo-6", "loomi-logo-2"] },
      { t: "swatch", items: [["Primary Colour", "#4c5c8e", true], ["Secondary Colour", "#f995c7", true]] },
      { t: "h", text: "Packaging" },
      { t: "img", src: "loomi-boxes" },
      { t: "imgs", srcs: ["loomi-bottles", "loomi-sachets"] },
      { t: "moods" },
      { t: "img", src: "loomi-label-calm", cap: "Loomi Calm" },
      { t: "img", src: "loomi-label-chill", cap: "Loomi Chill" },
      { t: "img", src: "loomi-label-sleep", cap: "Loomi Sleep" },
      { t: "glow", lines: ["Not every day is the same.  Some mornings ask for clarity. Some afternoons call for balance. Some evenings simply need stillness.", "Loomi exists to meet you where you are, offering thoughtful blends inspired by nature and made for real life.", "A quiet companion for every chapter of your day."] },
      { t: "pairs", items: [
        ["Recommended Usage", "Take 2 gummies daily, preferably after a meal, or as directed by your healthcare professional. Do not exceed the recommended daily intake."],
        ["Storage", "Store in a cool, dry place away from direct sunlight. Keep out of reach of children."],
        ["Net Qty", "24 Gummies"],
        ["Made in India", ["100% Vegan", "Gluten Free", "No Artificial Colours", "No Gelatin"]],
      ] },
      { t: "img", src: "loomi-poster" },
      { t: "img", src: "loomi-basket", tall: true },
    ],
  },
  q55: {
    title: "55 Questions on Health & Fitness",
    kicker: "BOOK COVER DESIGN — CASE STUDY",
    sub: "Amit Baraskar · Self-help / Wellness · Print & Digital",
    hero: "book-55-questions",
    tint: "#8fa6bd",
    meta: [["Client", "Amit Baraskar"], ["Author", "CA, Sports Nutritionist (IFA)"], ["Deliverable", "Book cover design"], ["Explorations", "3 concepts"]],
    foot: "Ainimight Studio · Book Cover Design · 2025",
    blocks: [
      { t: "h", text: "The Brief" },
      { t: "quote", text: "A lot of advice running in the society is about focusing on one thing at a time" },
      { t: "pairs", items: [
        ["About the book", "Science-backed Q&A guide structured around four pillars of well-being: Diet, Physical Activity, Recovery, and Monitoring. Written by a former state-level athlete turned CA and certified Sports Nutritionist, blending disciplined research with practical application."],
        ["The four pillars", ["Diet & Nutrition", "Physical Activity", "Recovery & Stress", "Measuring & Monitoring"]],
        ["Author positioning", "Not a fitness influencer but a rigorous practitioner: former high-jump record holder, CA, treasury specialist. The cover needed authority and precision, not inspiration-poster energy."],
        ["Iconographic approach", "Each pillar mapped to one flat icon: food bowl (diet), pull-up bar figure (activity), meditation figure (recovery), health monitor (measurement)."],
      ] },
      { t: "list", title: "Design direction needed", items: ["Communicate all four pillars visually", "Feel credible, not trendy or gym-poster", "Work for dual audiences: Indian and international", "Clean, structured, information-forward tone"] },
      { t: "h", text: "Selected direction: The Annotated Diagram" },
      { t: "img", src: "book-55-questions-flat", tall: true },
      { t: "p", text: "A central icon panel sits inside a clean grey field, with the four pillar labels written in casual hand-script and connected to each quadrant via fine leader lines, like a researcher's annotated diagram. The title anchors the lower third in a confident display type pairing: spaced small-caps author name above a large numeral \"55\" set alongside serif title text. Muted blue-grey palette signals credibility without clinical coldness." },
      { t: "swatch", items: [["Slate blue-grey field", "#8fa3b5"], ["Deep teal icon panel", "#3f6878"], ["White inner frame", "#f4f4f2"]], note: "Script annotation + display serif title" },
      { t: "h", text: "Design explorations" },
      { t: "p", text: "Three concepts were developed, each exploring a different structural metaphor for the four pillars: from a diagrammatic annotation layout to an organic vertical totem, to a colloquial sticky-note approach." },
      { t: "cols", items: [
        { k: "Exploration 2", h: "The Totem — Solid Background", img: "q55-explore-1", sw: "Forest green · White field", p: "The four pillar icons stacked vertically inside an arched panel, a totem-like structure set against a white field with a botanical icon pattern. Forest green palette with white line-work gives a naturalistic, contemporary wellness feel." },
        { k: "Exploration 3", h: "The Totem — Colour Variant", img: "q55-explore-2", sw: "Forest green · Warm citrine", p: "The same arch structure tested against a warm yellow-green background to evaluate contrast, shelf presence, and warmth. The muted citrine field softens the green, shifting tone from clinical to welcoming." },
        { k: "Exploration 1 · Early concept", h: "The Sticky Note", img: "q55-explore-3", sw: "Cobalt blue · Yellow sticky", p: "An early-stage concept exploring a colloquial register: a yellow sticky note pinned to a solid cobalt blue cover with handwritten title. Friendly, but too casual for the author's credentialed positioning." },
      ] },
      { t: "h", text: "Why the annotated diagram was selected" },
      { t: "p", text: "The annotation concept won because it reflected Amit Baraskar's dual identity most precisely. The hand- script labels carry warmth and accessibility, while the clean icon grid and structured typography signal the rigour of a certified expert. The blue-grey palette reads as authoritative without the stiffness of a textbook. The framed panel-within-panel structure creates visual depth without ornament, and the large \"55\" numeral in the title hierarchy makes the book's format immediately legible, which is essential for discoverability on platforms like Amazon and Kindle. The totem concepts, while visually striking, pushed the book further into the wellness lifestyle category rather than positioning it as a structured knowledge resource." },
    ],
  },
  rollercoaster: {
    title: "The Entrepreneurial Rollercoaster",
    kicker: "BOOK COVER DESIGN — CASE STUDY",
    sub: "Sushant Junnarkar · Fiction / Business Narrative · Vishwakarma Publications",
    hero: "book-rollercoaster",
    tint: "#7a5bb5",
    meta: [["Client", "Vishwakarma Publications"], ["Author", "Sushant Junnarkar (IIMA)"], ["Deliverable", "Book cover design"], ["Explorations", "3 concepts"]],
    foot: "Ainimight Studio · Book Cover Design · 2025",
    blocks: [
      { t: "h", text: "The Brief" },
      { t: "pairs", items: [
        ["About the book", "A first-person account of an entrepreneur's early move into India's online grocery space in 2011. Despite a promising start, the venture failed. The book is a tell-all journey of hard-won lessons, anecdote-rich and light-hearted, with a necessary dash of humour. A crash course in costly mistakes, written for anyone ready to learn from the front lines of a failed startup."],
        ["Author positioning", "IIMA alumnus. Built career at Asian Paints and HSBC. Pioneer in Indian e-commerce, later drove digital transformation across fashion, luxury, and beauty. Writing as a hobby: the voice is insider and candid, not academic."],
        ["Tone and genre", ["Fiction / Narrative Non-fiction", "Light-hearted", "Anecdote-rich", "Indian startup context"]],
        ["Visual language", "Isometric or editorial illustration style. A suited figure as the everyman entrepreneur protagonist. Purple as the primary palette: energetic, unconventional, distinct on shelf. White typography bold enough to read at thumbnail scale."],
      ] },
      { t: "list", title: "Design direction needed", items: ["Capture chaos, failure, and humour simultaneously", "Feel bold and energetic, not sombre or corporate", "The rollercoaster as the central visual metaphor", "Work for Indian print and digital retail"] },
      { t: "h", text: "Selected direction: The Isometric Rollercoaster" },
      { t: "img", src: "book-rollercoaster-flat", tall: true },
      { t: "p", text: "A full-bleed purple field carries an isometric wooden rollercoaster. A suited businessman is flung off the peak mid-fall, bills scattering around him, while the cart descends the other side. Bold white rounded serif title sits top-aligned; author name anchors the base. Reads clearly at thumbnail and communicates chaos, money loss, and dark humour at a glance." },
      { t: "swatch", items: [["Purple field", "#6f55a8"], ["White/cream structure", "#f1ece1"], ["Red coaster cart", "#e0484f"]], note: "Isometric illustration + bold rounded serif title" },
      { t: "bounce", srcs: ["rc-journey-1", "rc-journey-2", "rc-journey-3", "rc-journey-4", "rc-journey-5"], cap: "The journey · 01 → 05" },
      { t: "h", text: "Design explorations" },
      { t: "cols", items: [
        { k: "Exploration 2", h: "The Type-Led Script", img: "rc-journey-4", sw: "Purple field · White script type · Type-dominant layout", p: "The title becomes the composition. \"Rollercoaster\" is set in a large white script filling most of the cover, with the illustration reduced to a supporting element: the businessman flung off track, cart on fire. Bold and graphic, but risks losing legibility at thumbnail scale." },
        { k: "Exploration 3", h: "The Outline Script", img: "rc-journey-5", sw: "Purple + grid BG · Teal coin accents · Dashed outline type + coin pit", p: "Same large script but with a dashed outline stroke, giving the title a blueprint quality reinforcing the \"unfinished venture\" theme. The entrepreneur emerges from a dark coin pit, reaching upward. A more hopeful undertone compared to the pure fall narrative." },
      ] },
      { t: "h", text: "Why the isometric rollercoaster was selected" },
      { t: "p", text: "The selected direction communicated the rollercoaster metaphor immediately, carried the dark humour through the falling figure and scattered bills, and gave the title room to breathe. The isometric perspective set the cover apart from typical Indian business books with a contemporary, editorial quality. The type-led explorations, while striking, risked reading as a design exercise over a story, and lost clarity at thumbnail scale. Publisher: Vishwakarma Publications." },
      { t: "h", text: "On the back cover" },
      { t: "quote", text: "Success is celebrated publicly; failure is a secret buried deep." },
      { t: "p", text: "This is the story of an entrepreneur's early move in India's online grocery space in 2011. Despite a promising start and doing many things right, the venture ultimately failed. Yet, it was a goldmine of hard-won lessons. This book is an entrepreneur's tell-all journey, holding nothing back. Consider it your crash course in avoiding the costly mistakes he made. An insightful, anecdote-rich, and surprisingly light-hearted read—with a necessary dash of humour—for anyone ready to learn from the front lines of a failed entrepreneurial venture." },
      { t: "p", text: "Sushant Junnarkar, an alumnus of the Indian Institute of Management, Ahmedabad (IIMA), built his early career foundation at prestigious firms like Asian Paints and HSBC before pivoting to the digital world. As an early entrepreneur and among the pioneers in the Indian e-commerce space, he gained firsthand experience leading ventures from their nascent stages. He went on to drive digital transformation across diverse sectors, including fashion, luxury, and beauty. Sushant continues to capitalise on his deep, cross-sector expertise in e-commerce, marketing, and entrepreneurship, in his day job stints as digital expert, and writing as a hobby!" },
      { t: "pairs", items: [["Cover design", "AINA DHINGRA"], ["Genre", "FICTION"], ["Price", "RS 260"], ["Publisher", "www.vishwakarmapublications.com"]] },
    ],
  },
  cladiron: {
    title: "Cladiron",
    kicker: "Logo / identity",
    tint: "#cfd8c8",
    blocks: [
      { t: "p", text: "Cladiron started with a simple idea that clothing doesn’t need to be inaccessible or limited to one season , one collection or one gender. They wanted to be multi dimensional, reliant and sturdy. Their previous logo didn’t do justice to their approach. The previous logo / identity was too literal and lacking in terms of functionality.", lead: true },
      { t: "p", text: "As the business came closer to the launch, we reworked on the previous ideas to make the new and currently existing as the one that could be identified better in their category , has longer shelf life and is compatible with the brand values." },
      { t: "list", title: "In their words", items: ["Multi dimensional", "Reliant", "Sturdy"] },
    ],
  },
  look: {
    title: "The Look Between",
    kicker: "Book cover design",
    sub: "Julian Arden",
    hero: "book-look-between",
    tint: "#c7e8cf",
    blocks: [{ t: "img", src: "book-look-between-flat", tall: true }],
  },
  bosses: {
    title: "Bosses of the Wild",
    kicker: "Book cover design",
    sub: "Manjiri Gokhale Joshi",
    hero: "book-bosses-wild",
    tint: "#d9dccf",
    blocks: [
      { t: "quote", text: "Lessons From The Corporate Jungle.\nAnalyzing the animal personality types at work.", by: "Foreword by K.V. Kamath, Chairman, ICIC Bank" },
      { t: "img", src: "book-bosses-wild-flat", tall: true },
    ],
  },
}

const SCENES = [
  { id: "intro", label: "Ainimight", tone: "light" },
  { id: "home", label: "Home", tone: "light" },
  { id: "about", label: "Studio", tone: "light" },
  { id: "make", label: "What we make", tone: "light" },
  { id: "people", label: "People", tone: "light" },
  { id: "quote", label: "Belief", tone: "dark" },
  { id: "work", label: "Work", tone: "dark" },
  { id: "case", label: "Projects", tone: "light" },
  { id: "services", label: "Services", tone: "light" },
  { id: "roi", label: "Why brand", tone: "dark" },
  { id: "brands", label: "Clients", tone: "light" },
  { id: "proof", label: "What we stand for", tone: "light" },
  { id: "shelf", label: "Publishing", tone: "dark" },
  { id: "pricing", label: "Investment", tone: "light" },
  { id: "rope", label: "Process", tone: "dark" },
  { id: "contact", label: "Contact", tone: "light" },
] as const
const IX = (id: string) => SCENES.findIndex((s) => s.id === id)

// #region deck-logic
// Everything the scene engine decides, as pure functions (lifted by the test).
export const EDGE_BUFFER = 260
export const GESTURE_GAP = 170
export const SLIDE_MS = 700

export function normalizeWheel(deltaY: number, mode: number, page: number) {
  return mode === 1 ? deltaY * 32 : mode === 2 ? deltaY * page : deltaY
}

/** One frame of the soft scroll: moves 6% of the way per 60 Hz frame, frame-rate independent. */
export function glide(cur: number, target: number, ease: number, dtMs: number) {
  const k = 1 - Math.pow(1 - ease, Math.min(dtMs, 64) / (1000 / 60))
  const next = cur + (target - cur) * k
  return Math.abs(target - next) < 0.3 ? target : next
}

/**
 * A wheel delta inside the active scene. Scroll inside until the glide has
 * reached the edge; then hold the overflow in `push` and only turn the scene
 * once it passes the buffer.
 */
export function wheelStep(
  s: { target: number; push: number },
  delta: number,
  cur: number,
  max: number,
  buffer: number,
  gain: number,
  lead = Infinity,
): { target: number; push: number; turn: number } {
  if (delta > 0) {
    if (cur < max - 1.5) return { target: Math.min(max, s.target + delta * gain, cur + lead), push: 0, turn: 0 }
    const push = Math.max(0, s.push) + delta
    return push >= buffer ? { target: max, push: 0, turn: 1 } : { target: max, push, turn: 0 }
  }
  if (delta < 0) {
    if (cur > 1.5) return { target: Math.max(0, s.target + delta * gain, cur - lead), push: 0, turn: 0 }
    const push = Math.min(0, s.push) + delta
    return push <= -buffer ? { target: 0, push: 0, turn: -1 } : { target: 0, push, turn: 0 }
  }
  return { target: s.target, push: s.push, turn: 0 }
}

export function stepIndex(i: number, dir: number, n: number) {
  const j = i + dir
  return j < 0 || j >= n ? -1 : j
}

/** +1 when a scrubbed value rises through `at`, -1 when it falls back through it. */
export function crossed(prev: number, cur: number, at: number) {
  return prev < at && cur >= at ? 1 : prev >= at && cur < at ? -1 : 0
}

export function band(p: number, a: number, b: number) {
  return Math.min(1, Math.max(0, (p - a) / (b - a)))
}

/** Which slot-machine label a progress shows: the last stop passed, -1 before the first. */
export function slotIndex(p: number, stops: number[]) {
  let i = -1
  for (let k = 0; k < stops.length; k++) if (p >= stops[k]) i = k
  return i
}

/** Letters lit by a reading progress; the last 5% holds the whole quote lit. */
export function litCount(p: number, total: number) {
  return Math.max(0, Math.min(total, Math.ceil((p / 0.95) * total)))
}

export function wrap(i: number, n: number) {
  return ((i % n) + n) % n
}

/** Signed distance of card i from the active card on a looping ring. */
export function ringOffset(i: number, active: number, n: number) {
  let d = wrap(i - active, n)
  if (d > n / 2) d -= n
  return d
}

/** What a key does to the deck. */
export function keyIntent(key: string, shift: boolean, n: number): { kind: string; to: number } | null {
  if (key === "ArrowDown" || key === "PageDown" || (key === " " && !shift)) return { kind: "step", to: 1 }
  if (key === "ArrowUp" || key === "PageUp" || (key === " " && shift)) return { kind: "step", to: -1 }
  if (key === "Home") return { kind: "jump", to: 0 }
  if (key === "End") return { kind: "jump", to: n - 1 }
  if (/^[1-9]$/.test(key) && +key <= n) return { kind: "jump", to: +key - 1 }
  return null
}

/** The marquee flash plays on one cut only. */
export function interstitial(fromId: string, toId: string) {
  return fromId === "about" && toId === "make"
}

/** The jump disc is the opposite of the scene it leaves. */
export function discColor(leavingTone: string) {
  return leavingTone === "dark" ? "light" : "dark"
}
// #endregion

const cx = (...a: (string | false | null | undefined)[]) => a.filter(Boolean).join(" ")

/** Letters wrapped for the typed-in reveal; the plain text stays readable. */
function Spell({ text, hidden }: { text: string; hidden?: boolean }) {
  // words wrapped in *asterisks* are set in the italic accent face
  const words = text.split(" ")
  const plain = text.replace(/\*/g, "")
  let n = 0
  // a run of words between *…* is set in the accent face
  let inEm = false
  const em = words.map((w) => {
    if (w.startsWith("*")) inEm = true
    const on = inEm
    if (/\*[.,?!]?$/.test(w)) inEm = false
    return on
  })
  return (
    <>
      {!hidden && <span className="or-sr">{plain}</span>}
      <span className="or-spell" aria-hidden="true" data-spell="">
        {words.map((w, wi) => (
          <React.Fragment key={wi}>
            <span className={cx("or-w", em[wi] && "or-em")}>
              {[...w.replace(/\*/g, "")].map((c, ci) => (
                <span className="or-l" key={ci} style={{ "--i": n++ } as React.CSSProperties}>
                  {c}
                </span>
              ))}
            </span>
            {wi < words.length - 1 ? " " : null}
          </React.Fragment>
        ))}
      </span>
    </>
  )
}

/** Rolling-text hover: the label flips out tilted and a copy rolls in. */
function Roll({ children }: { children: string }) {
  return (
    <span className="or-roll">
      <span className="or-roll-s">{children}</span>
      <span className="or-roll-t" aria-hidden="true">
        <span>{children}</span>
        <span>{children}</span>
      </span>
    </span>
  )
}

/** A still that breathes: slow Ken Burns drift, paused while its scene is off screen. */
function Clip({ src, className }: { src: string; className?: string }) {
  return <img className={cx("or-vid or-kb", className)} src={src} alt="" aria-hidden="true" draggable={false} loading="lazy" />
}

/** The showreel: brand work crossfading with a slow push-in. */
function Reel({ srcs }: { srcs: string[] }) {
  return (
    <div className="or-reel-show" aria-hidden="true">
      {srcs.map((s, k) => (
        <img key={s + k} src={s} alt="" draggable={false} style={{ "--k": k, "--n": srcs.length } as React.CSSProperties} />
      ))}
    </div>
  )
}

/** The Ainimight "am" script mark, coloured by the current text colour. */
function Mark({ className }: { className?: string }) {
  return <span className={cx("or-mark", className)} aria-hidden="true" />
}

function Eye() {
  return (
    <svg viewBox="0 0 140 140" className="or-eye" aria-hidden="true">
      <defs>
        <path id="or-ring" d="M70 70m-55 0a55 55 0 1 1 110 0a55 55 0 1 1 -110 0" />
        <clipPath id="or-almond">
          <path d="M40 70Q70 44 100 70Q70 96 40 70Z" />
        </clipPath>
      </defs>
      <g className="or-eye-ring">
        <text>
          <textPath href="#or-ring" startOffset="0">
            AINIMIGHT STUDIO · CHANDIGARH · INDIA ·
          </textPath>
        </text>
      </g>
      <g className="or-lash">
        <path d="M55 52l-3-6M70 49v-7M85 52l3-6M47 58l-5-4M93 58l5-4" />
      </g>
      <path d="M40 70Q70 44 100 70Q70 96 40 70Z" fill="#fff" />
      <g clipPath="url(#or-almond)">
        <g className="or-iris">
          <circle cx="70" cy="70" r="13" fill="#b1da96" />
          <circle cx="70" cy="70" r="7" fill="#17171a" />
          <circle cx="73" cy="67" r="2" fill="#fff" />
        </g>
        <rect className="or-lid or-lid-t" x="38" y="42" width="64" height="29" />
        <rect className="or-lid or-lid-b" x="38" y="69" width="64" height="29" />
      </g>
      <path d="M40 70Q70 44 100 70Q70 96 40 70Z" fill="none" stroke="#17171a" strokeWidth="2.4" strokeLinejoin="round" />
    </svg>
  )
}

function Stars() {
  return (
    <span className="or-stars" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} viewBox="0 0 20 20">
          <path d="M10 1.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L10 14.8l-5.2 2.8 1-5.8L1.5 7.7l5.9-.8Z" />
        </svg>
      ))}
    </span>
  )
}

function Carousel({ projects, onOpen }: { projects: OrielProjectX[]; onOpen?: (id: string) => void }) {
  const [at, setAt] = React.useState(0)
  const n = projects.length
  const drag = React.useRef<number | null>(null)
  const go = (d: number) => setAt((a) => wrap(a + d, n))
  const p = projects[at]
  return (
    <div
      className="or-car"
      role="region"
      aria-roledescription="carousel"
      aria-label="Selected work"
      onPointerDown={(e) => (drag.current = e.clientX)}
      onPointerUp={(e) => {
        if (drag.current == null) return
        const dx = e.clientX - drag.current
        drag.current = null
        if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1)
      }}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") (go(1), e.preventDefault())
        if (e.key === "ArrowLeft") (go(-1), e.preventDefault())
      }}
    >
      <div className="or-car-ring">
        {projects.map((pr, i) => {
          const d = ringOffset(i, at, n)
          return (
            <figure
              key={pr.name}
              className={cx("or-car-card", d === 0 && "is-on")}
              style={{ "--d": d, opacity: Math.abs(d) > 1 ? 0 : 1 } as React.CSSProperties}
              aria-hidden={d !== 0}
              onClick={() => (d ? go(d) : pr.caseId && onOpen?.(pr.caseId))}
              data-cursor={d === 0 ? "view" : "nav"}
            >
              <img src={pr.img} alt={pr.name + ", " + pr.kind} draggable={false} />
              <figcaption className="or-car-meta">
                <span>{pr.kind}</span>
                <span>{pr.year}</span>
              </figcaption>
              {d === 0 && pr.caseId && <span className="or-car-view">Open case study ↗</span>}
            </figure>
          )
        })}
      </div>
      <h3 className="or-car-title" key={p.name} aria-live="polite">
        <Spell text={p.name} />
      </h3>
      <div className="or-car-foot">
        <div className="or-car-bars" aria-hidden="true">
          {projects.map((pr, i) => (
            <span key={pr.name} className={cx(i === at && "is-on")} />
          ))}
        </div>
        <span className="or-car-count">
          {String(at + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
        </span>
        <button type="button" className="or-car-btn" data-mag="" data-cursor="nav" aria-label="Previous project" onClick={() => go(-1)}>
          ←
        </button>
        <button type="button" className="or-car-btn" data-mag="" data-cursor="nav" aria-label="Next project" onClick={() => go(1)}>
          →
        </button>
      </div>
    </div>
  )
}

/** A long-form case study that slides up over the film. Copy is verbatim from the project files. */
function CaseSheet({ id, onClose, onNext, small }: { id: string | null; onClose: () => void; onNext: (id: string) => void; small?: boolean }) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [shown, setShown] = React.useState<string | null>(id)
  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    if (id) {
      setShown(id)
      el.scrollTop = 0
      gsap.fromTo(el, { yPercent: 100 }, { yPercent: 0, duration: 0.9, ease: "expo.out", overwrite: true })
      requestAnimationFrame(() => {
        const items = el.querySelectorAll("[data-cs]")
        gsap.fromTo(items, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.05, ease: "power3.out", delay: 0.25, overwrite: true })
      })
      el.focus({ preventScroll: true })
    } else if (shown) {
      gsap.to(el, { yPercent: 100, duration: 0.6, ease: "power3.in", overwrite: true, onComplete: () => setShown(null) })
    }
  }, [id])
  const c = shown ? CASES[shown] : null
  const order = ["munchbrew", "sarrohi", "idf", "beingmen", "loomi", "rollercoaster", "q55", "cladiron", "look", "bosses"]
  const next = shown ? order[(order.indexOf(shown) + 1) % order.length] : "loomi"
  const block = (b: Block, k: number): React.ReactNode => {
    switch (b.t) {
      case "h":
        return <h3 key={k} className="or-cs-h" data-cs="">{b.text}</h3>
      case "p":
        return <p key={k} className={cx("or-cs-p", b.lead && "is-lead")} data-cs="">{b.text}</p>
      case "quote":
        return (
          <blockquote key={k} className="or-cs-q" data-cs="">
            {b.text.split("\n").map((l, i) => (
              <span key={i}>{l}</span>
            ))}
            {b.by && <cite>{b.by}</cite>}
          </blockquote>
        )
      case "img":
        return (
          <figure key={k} className={cx("or-cs-img", b.tall && "is-tall")} data-cs="">
            <img src={IMG(b.src)} alt={b.cap || c?.title || ""} loading="lazy" />
            {b.cap && <figcaption>{b.cap}</figcaption>}
          </figure>
        )
      case "imgs":
        return (
          <div key={k} className={cx("or-cs-imgs", b.tall && "is-tall")} data-cs="">
            {b.srcs.map((x) => (
              <img key={x} src={IMG(x)} alt="" loading="lazy" />
            ))}
          </div>
        )
      case "pairs":
        return (
          <dl key={k} className="or-cs-pairs" data-cs="">
            {b.items.map(([a, v]) => (
              <div key={a}>
                <dt>{a}</dt>
                <dd>{Array.isArray(v) ? <span className="or-cs-tags">{v.map((x) => <i key={x}>{x}</i>)}</span> : v}</dd>
              </div>
            ))}
          </dl>
        )
      case "list":
        return (
          <div key={k} className="or-cs-list" data-cs="">
            <small>{b.title}</small>
            <ul>
              {b.items.map((x) => (
                <li key={x}>
                  <b>+</b> {x}
                </li>
              ))}
            </ul>
          </div>
        )
      case "swatch":
        return (
          <div key={k} className="or-cs-sw" data-cs="">
            {b.items.map(([n, hex, show]) => (
              <div key={n} className="or-cs-chip">
                <i style={{ background: hex }} />
                <span>
                  {n}
                  {show && <small>Hex Code: {hex.slice(1)}</small>}
                </span>
              </div>
            ))}
            {b.note && <em>{b.note}</em>}
          </div>
        )
      case "cols":
        return (
          <div key={k} className={cx("or-cs-cols", b.items.length === 2 && "is-two")} data-cs="">
            {b.items.map((x) => (
              <article key={x.h}>
                {x.img && <img src={IMG(x.img)} alt={x.h} loading="lazy" />}
                <small>{x.k}</small>
                <h4>{x.h}</h4>
                <p>{x.p}</p>
                {x.sw && <em>{x.sw}</em>}
              </article>
            ))}
          </div>
        )
      case "bounce":
        return (
          <figure key={k} className="or-cs-bounce" data-cs="">
            <BounceCards
              key={(shown || "") + (small ? "s" : "d")}
              images={b.srcs.map((x) => IMG(x))}
              containerWidth={small ? 320 : 640}
              containerHeight={small ? 220 : 380}
              cardSize={small ? 104 : 200}
              spread={small ? 52 : 112}
              rotation={8}
              animationDelay={0.6}
              borderWidth={small ? 3 : 4}
              radius={small ? 6 : 10}
              pushDistance={small ? 40 : 90}
            />
            <figcaption>{b.cap}</figcaption>
          </figure>
        )
      case "moods":
        return (
          <div key={k} className="or-cs-moods" data-cs="">
            {MOODS.map((m) => (
              <article key={m.id} style={{ background: m.bg, color: m.fg }}>
                <img src={IMG("loomi-char-" + m.id, true)} alt={m.name} loading="lazy" />
                <h4 style={{ color: m.ink }}>{m.name}</h4>
                <p>{m.tag}</p>
                <small>{m.made}</small>
              </article>
            ))}
          </div>
        )
      case "link":
        return (
          <a key={k} className="or-cs-link" href={b.href} target="_blank" rel="noopener noreferrer" data-cs="" data-cursor="nav">
            <span>Visit the live site</span>
            <b>{b.label.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")} ↗</b>
          </a>
        )
      case "glow":
        return (
          <div key={k} className="or-cs-glow" data-cs="">
            {b.lines.map((l) => (
              <p key={l}>{l}</p>
            ))}
          </div>
        )
    }
  }
  return (
    <div ref={ref} className={cx("or-cs", shown && "is-on")} role="dialog" aria-modal="true" aria-label={c ? c.title + " case study" : "Case study"} tabIndex={-1} data-lenis-prevent="" onScroll={(e) => e.currentTarget.classList.toggle("is-scrolled", e.currentTarget.scrollTop > 30)} style={{ "--cs": c?.tint || "#b0c7dd" } as React.CSSProperties}>
      {c && (
        <>
          <div className="or-cs-bar">
            <button type="button" className="or-cs-x" onClick={onClose} aria-label="Close the case study" data-cursor="nav">
              <span>Close</span>
              <i />
            </button>
          </div>
          <header className="or-cs-top">
            <p className="or-cs-k" data-cs="">
              {c.kicker}
            </p>
            <h2 className="or-cs-t" data-cs="">
              {c.title}
            </h2>
            {c.sub && (
              <p className="or-cs-sub" data-cs="">
                {c.sub}
              </p>
            )}
            {c.meta && (
              <dl className="or-cs-meta" data-cs="">
                {c.meta.map(([a, v]) => (
                  <div key={a}>
                    <dt>{a}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
            )}
          </header>
          {c.hero ? (
            <figure className="or-cs-hero" data-cs="">
              <img src={IMG(c.hero)} alt={c.title} />
            </figure>
          ) : (
            <div className="or-cs-type" data-cs="" aria-hidden="true">
              {c.title}
            </div>
          )}
          <div className="or-cs-body">{c.blocks.map(block)}</div>
          <footer className="or-cs-foot">
            {c.foot && <small>{c.foot}</small>}
            <button type="button" className="or-cs-next" onClick={() => onNext(next)} data-cursor="nav">
              <small>Next case study</small>
              <b>{CASES[next].title} →</b>
            </button>
          </footer>
        </>
      )}
    </div>
  )
}

/** Loomi moods: a segmented switcher (after 21st.dev "Segmented Tabs") that recolours the whole scene. */
function Moods({ onTone }: { onTone: (t: "light" | "dark") => void }) {
  const [at, setAt] = React.useState(0)
  const [hover, setHover] = React.useState(-1)
  const paused = React.useRef(false)
  const rootRef = React.useRef<HTMLDivElement>(null)
  const m = MOODS[at]
  React.useEffect(() => onTone(m.tone), [at])
  React.useEffect(() => {
    const t = window.setInterval(() => {
      const scene = rootRef.current?.closest(".or-scene")
      const on = scene?.classList.contains("is-active") || rootRef.current?.closest(".or-stack")
      if (on && !paused.current) setAt((a) => (a + 1) % MOODS.length)
    }, 6500)
    return () => clearInterval(t)
  }, [])
  return (
    <div
      ref={rootRef}
      className="or-moods"
      style={{ "--mbg": m.bg, "--mink": m.ink, "--mfg": m.fg } as React.CSSProperties}
      onPointerEnter={() => (paused.current = true)}
      onPointerLeave={() => (paused.current = false)}
    >
      <div className="or-moods-l">
        <p className="or-moods-k" data-rise="">
          Loomi · Packaging
        </p>
        <h2 className="or-moods-h" data-rise="">
          Not every day is the same.
        </h2>
        <div className="or-seg" role="tablist" aria-label="Loomi moods" data-rise="" style={{ "--at": at, "--hv": hover < 0 ? at : hover } as React.CSSProperties} onPointerLeave={() => setHover(-1)}>
          <span className="or-seg-hv" aria-hidden="true" />
          <span className="or-seg-bg" aria-hidden="true" />
          {MOODS.map((x, k) => (
            <button key={x.id} type="button" role="tab" aria-selected={k === at} className={cx(k === at && "is-on")} onClick={() => setAt(k)} onPointerEnter={() => setHover(k)} data-cursor="nav">
              {x.name.replace("Loomi ", "")}
              {k === at && <i className="or-seg-prog" key={at} />}
            </button>
          ))}
        </div>
        <div className="or-moods-copy" key={m.id} aria-live="polite">
          <h3>{m.name}</h3>
          <p className="or-moods-tag">{m.tag}</p>
          {m.body.map((b) => (
            <p key={b}>{b}</p>
          ))}
          <small>{m.made}</small>
        </div>
      </div>
      <div className="or-moods-art" aria-hidden="true">
        <span className="or-moods-ring" />
        {MOODS.map((x, k) => (
          <img key={x.id} src={IMG("loomi-char-" + x.id)} alt="" className={cx(k === at && "is-on")} style={{ "--o": k - at } as React.CSSProperties} />
        ))}
      </div>
      <div className="or-moods-ing" key={m.id + "i"}>
        <small>Key Ingredients</small>
        {m.ing.map(([a, b]) => (
          <div key={a}>
            <b>{a}</b>
            <span>{b}</span>
          </div>
        ))}
        <p className="or-moods-fine">Net Qty: 24 Gummies · Made in India, 100% Vegan, Gluten Free, No Artificial Colours, No Gelatin</p>
      </div>
    </div>
  )
}

/** The Loomi logo bento (spotlight borders after React Bits "MagicBento"). */
function LogoBento({ onOpen }: { onOpen: (id: string) => void }) {
  const [copied, setCopied] = React.useState("")
  const move = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.querySelectorAll<HTMLElement>(".or-bt").forEach((t) => {
      const r = t.getBoundingClientRect()
      t.style.setProperty("--mx", e.clientX - r.left + "px")
      t.style.setProperty("--my", e.clientY - r.top + "px")
    })
  }
  const copy = (hex: string) => {
    try {
      navigator.clipboard?.writeText(hex).catch(() => {})
    } catch {}
    setCopied(hex)
    window.setTimeout(() => setCopied(""), 1400)
  }
  return (
    <div className="or-logo-s">
      <div className="or-logo-head">
        <p className="or-brands-k" data-rise="">
          Loomi · Visual identity
        </p>
        <h2 className="or-logo-h">
          <Spell text="The Loomi *Logo*" />
        </h2>
      </div>
      <div className="or-bento" onPointerMove={move}>
        <figure className="or-bt or-bt-a" data-rise="">
          <img src={IMG("loomi-logo-1")} alt="Logomark Breakdown: lightning bolt plus plant equals the Loomi mark" />
        </figure>
        <div className="or-bt or-bt-b" data-rise="">
          <p>To highlight the part that it’s something related to light and calmness at the same time, we came up with a lightning bolt with a wellness leaf to describe the fluidity of the brand and its product.</p>
          <button type="button" className="or-bt-link" onClick={() => onOpen("loomi")} data-cursor="nav">
            Read the Loomi case study ↗
          </button>
        </div>
        <figure className="or-bt or-bt-c" data-rise="">
          <img src={IMG("loomi-logo-6")} alt="Loomi horizontal lockup" />
        </figure>
        <div className="or-bt or-bt-q" data-rise="">
          <small>Lightning bolt to represent the name Lumen</small>
          <b>Loomi comes from Lumen + Umi.</b>
        </div>
        <figure className="or-bt or-bt-d" data-rise="">
          <img src={IMG("loomi-logo-2")} alt="Loomi mark in primary and secondary colours" />
        </figure>
        {[
          ["Primary Colour", "#4c5c8e"],
          ["Secondary Colour", "#f995c7"],
        ].map(([n, hex]) => (
          <button key={hex} type="button" className="or-bt or-bt-sw" style={{ "--sw": hex } as React.CSSProperties} onClick={() => copy(hex)} data-rise="" data-cursor="nav">
            <small>{n}</small>
            <b>Hex Code: {hex.slice(1)}</b>
            <em>{copied === hex ? "Copied" : "Click to copy"}</em>
          </button>
        ))}
      </div>
    </div>
  )
}

function ContactForm({ email, onClose }: { email: string; onClose?: () => void }) {
  const [picked, setPicked] = React.useState<string[]>(["Product design"])
  const [budget, setBudget] = React.useState(BUDGETS[1])
  const [sent, setSent] = React.useState(false)
  const toggle = (s: string) => setPicked((p) => (p.includes(s) ? p.filter((x) => x !== s) : [...p, s]))
  return (
    <form
      className={cx("or-form", sent && "is-sent")}
      onSubmit={(e) => {
        e.preventDefault()
        const f = new FormData(e.currentTarget)
        const body = "Name: " + f.get("name") + "\nEmail: " + f.get("email") + "\nInterested in: " + picked.join(", ") + "\nBudget: " + budget + "\n\n" + (f.get("brief") || "")
        const a = document.createElement("a")
        a.href = "mailto:" + email + "?subject=" + encodeURIComponent("New brief for Ainimight") + "&body=" + encodeURIComponent(body)
        a.target = "_blank"
        a.rel = "noopener"
        a.click()
        setSent(true)
      }}
    >
      {onClose && (
        <button type="button" className="or-sheet-x" aria-label="Close the form" onClick={onClose}>
          ×
        </button>
      )}
      <div className="or-form-row" data-rise="">
        <label className="or-field">
          <span>Name &amp; company</span>
          <input name="name" autoComplete="name" placeholder="Your name, your brand" required />
        </label>
        <label className="or-field">
          <span>Your email</span>
          <input name="email" type="email" autoComplete="email" placeholder={"you@" + email.split("@")[1]} required />
        </label>
      </div>
      <fieldset className="or-chips" data-rise="">
        <legend>I'm interested in…</legend>
        {SERVICES.map((s) => (
          <label key={s} className={cx("or-chip", "or-rl", picked.includes(s) && "is-on")} data-cursor="nav">
            <input type="checkbox" checked={picked.includes(s)} onChange={() => toggle(s)} />
            <Roll>{s}</Roll>
          </label>
        ))}
      </fieldset>
      <fieldset className="or-chips" data-rise="">
        <legend>Project budget (INR)</legend>
        {BUDGETS.map((b) => (
          <label key={b} className={cx("or-chip", "or-rl", budget === b && "is-on")} data-cursor="nav">
            <input type="radio" name="budget" checked={budget === b} onChange={() => setBudget(b)} />
            <Roll>{b}</Roll>
          </label>
        ))}
      </fieldset>
      <label className="or-field or-field-wide" data-rise="">
        <span>Tell us about it</span>
        <textarea name="brief" rows={2} placeholder="What are you making, and how should people feel when they hold it?" />
      </label>
      <div className="or-submit-row" data-rise="">
        <span className="or-pulse" data-mag="" data-cursor="button">
          <i />
          <i />
          <i />
          <i />
          <button type="submit" className="or-submit">
            <span>Send</span> <span>the</span> <span>brief</span>
          </button>
        </span>
        <p className="or-sent" role="status">
          {sent ? "Your brief is ready in your mail app. If it didn't open, write to " + email + " and we'll reply within two working days." : ""}
        </p>
      </div>
    </form>
  )
}

export default function Ainimight({
  brand = "Ainimight",
  headline = "We are a multidisciplinary *creative studio.* We build brand identities, illustration systems, packaging, animation, and publications that make brands *impossible to ignore* — and impossible to forget.",
  projects = DEFAULT_PROJECTS,
  email = "contact@ainimight.com",
  height = "100svh",
  theme = "auto",
  fontHref = FONT_HREF,
  ropeFrames,
  className,
}: OrielStudioTemplateProps) {
  const rootRef = React.useRef<HTMLDivElement>(null)
  const engine = React.useRef<{ jump: (i: number) => void; setTone: (i: number, t: string | undefined) => void } | null>(null)
  // the preloader holds the hero's entrance until the first frame is ready
  const intro = React.useRef<{ done: boolean; cbs: (() => void)[] }>({ done: false, cbs: [] })
  const afterIntro = (fn: () => void) => (intro.current.done ? fn() : intro.current.cbs.push(fn))
  const [caseId, setCaseId] = React.useState<string | null>(null)
  const openCase = (id: string) => setCaseId(id)
  const [mode, setMode] = React.useState<"deck" | "stack">("deck")
  const [reduced, setReduced] = React.useState(false)
  const [dark, setDark] = React.useState(theme === "dark")
  const [menu, setMenu] = React.useState(false)
  const [hover, setHover] = React.useState(0)
  const [sheet, setSheet] = React.useState(false)
  const [shelfOn, setShelfOn] = React.useState(false)
  React.useEffect(() => {
    const t = window.setTimeout(() => setShelfOn(true), 1800)
    return () => clearTimeout(t)
  }, [])
  const contactRef = React.useRef<HTMLElement>(null)

  // Case study sheet: the film pauses underneath, Escape closes it, the page behind never scrolls.
  React.useEffect(() => {
    const root = rootRef.current
    if (!root) return
    root.classList.toggle("or-case-open", !!caseId)
    if (mode === "stack") document.documentElement.style.overflow = caseId ? "hidden" : ""
    if (!caseId) return
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setCaseId(null)
    window.addEventListener("keydown", esc)
    return () => window.removeEventListener("keydown", esc)
  }, [caseId, mode])

  // No counter: the entrance character IS the loading screen. The rest of the site (header,
  // showreel, rail, contact chips) is released the first time the visitor comes through the portal.
  const releaseIntro = () => {
    if (intro.current.done) return
    intro.current.done = true
    intro.current.cbs.splice(0).forEach((f) => f())
  }
  /** Flowing menu: the marquee slides in from whichever edge the pointer crossed. */
  const flow = (enter: boolean) => (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    const r = el.getBoundingClientRect()
    const top = e.clientY - r.top < r.height / 2
    const m = el.querySelector(".or-flow-marq")
    const inn = el.querySelector(".or-flow-inner")
    const d = { duration: 0.6, ease: "expo.out" }
    if (enter) {
      gsap.set(m, { yPercent: top ? -101 : 101 })
      gsap.set(inn, { yPercent: top ? 101 : -101 })
      gsap.to([m, inn], { yPercent: 0, ...d, overwrite: true })
    } else {
      gsap.to(m, { yPercent: top ? -101 : 101, ...d, overwrite: true })
      gsap.to(inn, { yPercent: top ? 101 : -101, ...d, overwrite: true })
    }
  }

  // Mode: deck needs a fine pointer and room; everything else gets the stacked page.
  React.useLayoutEffect(() => {
    const el = rootRef.current!
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)")
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)")
    const pick = () => {
      setReduced(rm.matches)
      setMode(fine.matches && !rm.matches && el.parentElement!.clientWidth >= 600 ? "deck" : "stack")
      setDark(theme === "dark" || (theme === "auto" && !!el.closest(".dark")))
    }
    pick()
    const ro = new ResizeObserver(pick)
    ro.observe(el.parentElement!)
    fine.addEventListener("change", pick)
    rm.addEventListener("change", pick)
    return () => {
      ro.disconnect()
      fine.removeEventListener("change", pick)
      rm.removeEventListener("change", pick)
    }
  }, [theme])

  // The film: scene engine, scrubbed timelines, living details.
  React.useLayoutEffect(() => {
    const root = rootRef.current!
    const deck = mode === "deck"
    const q = <T extends Element = HTMLElement>(s: string, from: ParentNode = root) => from.querySelector(s) as T
    const qa = <T extends Element = HTMLElement>(s: string, from: ParentNode = root) => [...from.querySelectorAll(s)] as T[]
    const scenes = qa(".or-scene")
    const probe = q(".or-probe")
    const R = () => probe.getBoundingClientRect().width
    const header = q(".or-header")
    const N = scenes.length
    const cleanups: (() => void)[] = []
    const on = <K extends keyof WindowEventMap>(t: Window | HTMLElement, ev: K, fn: (e: WindowEventMap[K]) => void, opt?: AddEventListenerOptions) => {
      t.addEventListener(ev, fn as EventListener, opt)
      cleanups.push(() => t.removeEventListener(ev, fn as EventListener, opt))
    }

    const S = {
      active: 0,
      cur: 0,
      target: 0,
      push: 0,
      written: 0,
      busyUntil: 0,
      lastWheel: 0,
      stale: false,
      changedAt: 0,
      tone: [] as (string | undefined)[],
      solid: false,
      introP: 0,
      bake: () => {},
    }
    const toneOf = (i: number) => (dark ? "dark" : S.tone[i] ?? SCENES[i].tone)
    const rail = qa(".or-rail button")
    const applyTone = (force?: string) => {
      header.setAttribute("data-tone", force ?? toneOf(S.active))
      rail.forEach((b, k) => b.classList.toggle("is-on", k === S.active))
    }
    // While the entrance is still closed the screen shows nothing but the character.
    const gate = () => {
      const closed = !reduced && S.active === IX("intro") && S.introP < 0.6
      root.classList.toggle("or-gated", closed)
      if (S.active === IX("home") || (S.active > IX("intro") && !closed)) releaseIntro()
    }
    const setTone = (i: number, t: string | undefined) => {
      if (S.tone[i] === t) return
      S.tone[i] = t
      if (i === S.active) applyTone()
    }
    root.classList.add("or-live")

    const ctx = gsap.context(() => {
      const scrollerOf = (el: HTMLElement) => (deck ? el : window)
      const scrub = (i: number, track: HTMLElement, tl: gsap.core.Timeline, rest: number, onUpdate?: (p: number) => void) => {
        if (reduced) {
          tl.progress(rest)
          onUpdate?.(rest)
          return
        }
        ScrollTrigger.create({
          trigger: track,
          scroller: scrollerOf(scenes[i]),
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          animation: tl,
          invalidateOnRefresh: true,
          onUpdate: onUpdate && ((st) => onUpdate(st.progress)),
          onRefresh: onUpdate && ((st) => onUpdate(st.progress)),
        })
      }
      const W = () => root.clientWidth
      const H = () => (deck ? root.clientHeight : window.innerHeight)

      // ---- 0 Entrance: the mouth opens, the head becomes a portal, the studio is inside --
      // Same beats as the reference reel: little "o" mouth → mouth stretches into a ring while the
      // eyes ride up to the brow → the face goes dark → the dark disc floods the screen → the line
      // types in word by word, services light up in colour, the client strip slides in. All scrubbed,
      // so scrolling back up plays it in reverse.
      {
        const i = IX("intro")
        const st = q(".or-intro")
        const hole = q(".or-in-hole", st)
        const mouth = q<SVGEllipseElement>(".or-ch-mouth", st)
        const words = qa(".or-iw", st)
        const DEEP = "#1c4038"
        const tl = gsap.timeline({ paused: true, defaults: { ease: "none" } })
        tl.to(q(".or-ch-cheeks", st), { opacity: 0, duration: 0.14 }, 0.04)
          .to(mouth, { scaleX: 9.3, scaleY: 8.45, y: -130, svgOrigin: "500 730", duration: 0.46, ease: "power1.in" }, 0)
          .to(q(".or-ch-eyes", st), { y: -246, scale: 0.36, svgOrigin: "500 575", duration: 0.46, ease: "power1.in" }, 0)
          .to(q(".or-ch-fringe", st), { y: -70, scaleY: 0.55, svgOrigin: "500 300", duration: 0.46, ease: "power1.in" }, 0)
          .to(q(".or-ch-face", st), { fill: DEEP, duration: 0.07 }, 0.47)
          .to(qa(".or-ch-eyes, .or-ch-leaf", st), { opacity: 0, duration: 0.06 }, 0.5)
          .to(q(".or-in-ch", st), { scale: 1.18, transformOrigin: "50% 62%", duration: 0.3, ease: "power1.in" }, 0.5)
          .fromTo(q(".or-in-copy", st), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.12 }, 0.5)
          .fromTo(q(".or-in-logos", st), { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.1 }, 0.84)
        let last = 0
        let lit = -1
        const portal = (p: number) => {
          const sr = st.getBoundingClientRect()
          const mr = mouth.getBoundingClientRect()
          const cxp = mr.left + mr.width / 2 - sr.left
          const cyp = mr.top + mr.height / 2 - sr.top
          const r0 = Math.max(mr.width, mr.height) / 2
          const cover = Math.hypot(Math.max(cxp, sr.width - cxp), Math.max(cyp, sr.height - cyp)) + 4
          const k = band(p, 0.58, 0.8)
          const r = p <= 0 ? 0 : r0 + (cover - r0) * k * k
          hole.style.clipPath = "circle(" + r.toFixed(1) + "px at " + cxp.toFixed(1) + "px " + cyp.toFixed(1) + "px)"
          const n = Math.round(band(p, 0.55, 0.93) * words.length)
          if (n !== lit) {
            words.forEach((w, j) => w.classList.toggle("is-on", j < n))
            lit = n
          }
          if (crossed(last, p, 0.66)) setTone(i, p >= 0.66 ? "dark" : undefined)
          last = p
          S.introP = p
          gate()
        }
        scrub(i, q(".or-intro-track"), tl, 1, portal)
      }

      // ---- 1 Home: showreel grows from its slot to full bleed -----------------------
      {
        const rcv = q<HTMLCanvasElement>(".or-ribbon")
        const rib = mountRibbon(rcv, Math.min(2, window.devicePixelRatio || 1))
        let ribRaf = 0
        let ribSeen = true
        const rio = new IntersectionObserver((es) => (ribSeen = es[0].isIntersecting))
        if (!deck) rio.observe(rcv)
        const t0 = performance.now()
        let frozen = 0
        let ribGo = false
        afterIntro(() => (ribGo = true))
        const ribTick = (now: number) => {
          ribRaf = requestAnimationFrame(ribTick)
          const on = ribGo && (deck ? S.active === IX("home") : ribSeen)
          if (!on || document.hidden) return
          if (rcv.classList.contains("is-paused") || reduced) {
            if (!frozen) frozen = now
            return
          }
          if (frozen) (frozen = 0)
          rib.render(now - t0)
        }
        ribRaf = requestAnimationFrame(ribTick)
        cleanups.push(() => (cancelAnimationFrame(ribRaf), rio.disconnect(), rib.dispose()))
        const track = q(".or-reel-track")
        const mask = q(".or-reel-mask")
        if (deck && !reduced) {
          gsap.fromTo(
            mask,
            { clipPath: () => "inset(0px " + 9.375 * R() + "px " + Math.max(0, H() - 40 * R()) + "px " + 9.375 * R() + "px round " + 1.6 * R() + "px)" },
            {
              clipPath: "inset(0px 0px 0px 0px round 0px)",
              ease: "none",
              scrollTrigger: { trigger: track, scroller: scenes[IX("home")], start: "top bottom", end: "top top", scrub: true, invalidateOnRefresh: true },
            },
          )
        }
        if (deck && !reduced) {
          // the copy dissolves as it rises toward the header, so no line ever runs under the nav
          qa(".or-hero, .or-rate, .or-services, .or-s-home .or-deck-pill, .or-eye-wrap").forEach((el) =>
            gsap.fromTo(
              el,
              { opacity: 1 },
              {
                opacity: 0,
                ease: "none",
                immediateRender: false,
                scrollTrigger: { trigger: el, scroller: scenes[IX("home")], start: () => "top " + 12 * R() + "px", end: () => "top " + 6.2 * R() + "px", scrub: true, invalidateOnRefresh: true },
              },
            ),
          )
        }
        if (!reduced) {
          const reelIn = gsap.fromTo(q(".or-reel-in"), { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 3, ease: "power2.inOut", paused: true })
          const eyeIn = gsap.fromTo(q(".or-eye"), { scale: 0.3, opacity: 0 }, { scale: 1, opacity: 1, duration: 2, ease: "power3.out", paused: true })
          afterIntro(() => {
            reelIn.delay(0.15).play()
            eyeIn.delay(0.35).play()
          })
        }
      }

      // ---- 1 About: cards scroll sideways, pill windows slide inside them --------------
      {
        const i = IX("about")
        const track = q(".or-about-track")
        const row = q(".or-about-row")
        const stage = q(".or-stage", track)
        if (deck && !reduced) {
          const travel = () => Math.max(0, row.scrollWidth - stage.clientWidth)
          const size = () => (track.style.height = travel() + stage.clientHeight + "px")
          size()
          const ro = new ResizeObserver(() => (size(), ScrollTrigger.refresh()))
          ro.observe(row)
          cleanups.push(() => ro.disconnect())
          const slide = gsap.to(row, {
            x: () => -travel(),
            ease: "none",
            scrollTrigger: { trigger: track, scroller: scenes[i], start: "top top", end: "bottom bottom", scrub: true, invalidateOnRefresh: true },
          })
          qa(".or-card", row).forEach((card) => {
            const pill = q(".or-card-pill", card)
            gsap.fromTo(
              pill,
              { x: () => card.clientWidth - pill.offsetWidth - 2 * pill.offsetLeft },
              {
                x: 0,
                ease: "none",
                scrollTrigger: { trigger: card, containerAnimation: slide, start: "left 85%", end: "left 10%", scrub: true, invalidateOnRefresh: true },
              },
            )
          })
        }
      }

      // ---- 2 What we make: full-screen clip shrinks into a product UI -----------------
      {
        const i = IX("make")
        const st = q(".or-make")
        const track = q(".or-make-track")
        const media = q(".or-make-media", st)
        const mock = q(".or-mock", st)
        const slotVid = q<HTMLVideoElement>(".or-slot video", st)
        const bigVid = q<HTMLVideoElement>("video", media)
        const mockTop = () => (H() - 38 * R()) / 2 + 0.5 * R()
        const inset = (t: number, r: number, b: number, l: number, rad: number) =>
          "inset(" + t + "px " + r + "px " + b + "px " + l + "px round " + rad + "px)"
        // measured, not computed: the stacked layout zooms the mock
        const slotInset = () => {
          const s = q(".or-slot", st).getBoundingClientRect()
          const g = st.getBoundingClientRect()
          return inset(s.top - g.top, g.right - s.right, g.bottom - s.bottom, s.left - g.left, (deck ? 1 : 0.34) * R())
        }
        const cz = deck ? 1 : 0.45
        const tl = gsap.timeline({ paused: true, defaults: { ease: "none" } })
        tl.fromTo(q(".or-make-word", st), { x: 0, scale: 1 }, { x: () => -0.22 * W(), scale: 0.42, opacity: 0, duration: 0.14 }, 0)
          .fromTo(media, { clipPath: () => inset(0.3 * H(), 0, 0.3 * H(), W(), 2 * R()) }, { clipPath: () => inset(0.24 * H(), 0.05 * W(), 0.24 * H(), 0.66 * W(), 2.4 * R()), duration: 0.07 }, 0.01)
          .to(media, { clipPath: () => inset(0, 0, 0, 0, 0), duration: 0.09 }, 0.08)
          .to(media, { clipPath: slotInset, duration: 0.11, ease: "power1.inOut" }, 0.21)
          .set(mock, { autoAlpha: 1 }, 0.2)
          .set(media, { autoAlpha: 0 }, 0.45)
          .fromTo(q(".or-skel", mock), { opacity: 1 }, { opacity: 0, duration: 0.06 }, 0.38)
          .fromTo(q(".or-mock-in", mock), { opacity: 0 }, { opacity: 1, duration: 0.06 }, 0.38)
          .fromTo(q(".or-make-light", st), { opacity: 0 }, { opacity: 1, duration: 0.06 }, 0.46)
          .fromTo(mock, { width: () => 66 * R(), borderRadius: () => 2.25 * R() }, { width: () => 22 * R(), borderRadius: () => 3.4 * R(), duration: 0.16, ease: "power1.inOut" }, 0.64)
          .fromTo(q(".or-notch", mock), { opacity: 0 }, { opacity: 1, duration: 0.04 }, 0.76)
        qa(".or-cur", st).forEach((c, k) => {
          const from = CURSORS[k]
          tl.fromTo(c, { x: () => from.x * 1.9 * cz * R(), y: () => from.y * 2.4 * cz * R(), opacity: 0 }, { x: () => from.x * cz * R(), y: () => from.y * cz * R(), opacity: 1, duration: 0.09, ease: "power2.out" }, 0.5 + k * 0.012)
            .to(c, { x: () => (from.x * 0.55 + (k % 2 ? 4 : -4)) * cz * R(), y: () => (from.y * 0.9 + (k % 3) * 2) * cz * R(), duration: 0.2 }, 0.62)
            .to(c, { x: () => from.x * 2.2 * cz * R(), opacity: 0, duration: 0.07 }, 0.9)
        })
        const tag = q(".or-tag", st)
        const labels = qa(".or-tag-l", tag)
        const stops = [0.3, 0.47, 0.64, 0.82]
        let shown = -2
        const pop = (p: number) => {
          // scrubbed progress → timed pops: the pill springs in, the label rolls like a slot machine
          const idx = slotIndex(p, stops)
          if (idx === shown) return
          const up = idx > shown
          gsap.to(tag, idx < 0 ? { opacity: 0, scale: 0.5, duration: 0.3 } : { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.6)" })
          labels.forEach((l, k) => {
            if (k === idx) gsap.fromTo(l, { yPercent: up ? 100 : -100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.45, ease: "power3.out" })
            else if (k === shown) gsap.to(l, { yPercent: up ? -100 : 100, opacity: 0, duration: 0.45, ease: "power3.in" })
            else gsap.set(l, { opacity: 0 })
          })
          shown = idx
          if (bigVid && slotVid && p > 0.3 && Math.abs(slotVid.currentTime - bigVid.currentTime) > 0.3) slotVid.currentTime = bigVid.currentTime
        }
        scrub(i, track, tl, 0.6, pop)
      }

      // ---- 3 People: a sentence splits open, lets the team in, becomes a word ----------
      {
        const i = IX("people")
        const st = q(".or-people")
        const gap = q(".or-gap", st)
        const ava = qa(".or-ava > *", st)
        const word = q(".or-gap-word", st)
        const tl = gsap.timeline({ paused: true, defaults: { ease: "none" } })
        // start states live at time 0: a refresh invalidates the later fromTo's, which then don't render at progress 0
        const pill = q(".or-ava", st)
        tl.set(ava, { scale: 0 }, 0)
          .set(word, { opacity: 0 }, 0)
          .set(pill, { opacity: 0, scaleX: 0.2 }, 0)
          .set(qa(".or-fly", st), { y: () => H() }, 0)
          .fromTo(gap, { width: 0 }, { width: () => pill.scrollWidth, duration: 0.14, ease: "power2.inOut" }, 0.06)
          .to(pill, { opacity: 1, scaleX: 1, transformOrigin: "0% 50%", duration: 0.14, ease: "power2.inOut" }, 0.06)
          .fromTo(ava, { scale: 0 }, { scale: 1, duration: 0.06, stagger: 0.008, ease: "back.out(2)" }, 0.1)
          .to(ava, { y: () => -5 * R(), scale: 0.5, opacity: 0, duration: 0.07, stagger: 0.006 }, 0.32)
          .to(pill, { opacity: 0, duration: 0.05 }, 0.37)
          .to(gap, { width: () => word.offsetWidth, duration: 0.1, ease: "power2.inOut" }, 0.36)
          .fromTo(word, { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.08 }, 0.38)
        qa(".or-fly", st).forEach((f, k) => {
          tl.fromTo(
            f,
            { y: () => H() * (0.7 + k * 0.1), rotate: [-20, 14, -8][k] },
            { y: () => -H() * (0.9 + k * 0.15), rotate: [60, -50, 40][k], duration: 0.45 },
            0.18 + k * 0.06,
          )
        })
        const disc = q(".or-swallow", st)
        tl.fromTo(disc, { x: () => 0.7 * W(), scale: 0.18, rotate: 0 }, { x: 0, scale: 1, rotate: -120, duration: 0.16, ease: "power2.in" }, 0.82)
        let last = 0
        scrub(i, q(".or-people-track"), tl, 0.5, (p) => {
          if (deck && crossed(last, p, 0.93)) setTone(i, p >= 0.93 ? "dark" : undefined)
          last = p
        })
      }

      // ---- 4 Quote: grey words light up letter by letter --------------------------------
      {
        const i = IX("quote")
        const letters = qa(".or-q .or-l")
        const bar = q(".or-qbar i")
        let n = -1
        const light = (p: number) => {
          const k = litCount(p, letters.length)
          if (k === n) return
          letters.forEach((l, j) => l.classList.toggle("is-lit", j < k))
          n = k
          bar.style.transform = "scaleY(" + p + ")"
        }
        scrub(i, q(".or-quote-track"), gsap.timeline({ paused: true }).to({}, { duration: 1 }), 1, light)
        if (!reduced) gsap.from(qa(".or-ring-c"), { opacity: 0, scale: 0.9, duration: 0.6, stagger: 0.2, delay: 0.3, paused: deck, id: "rings" })
      }

      // ---- 5 Work: thread draws, then a 1px line grows tall, then wide, into white -----
      {
        const i = IX("work")
        const st = q(".or-work")
        const path = q<SVGPathElement>(".or-thread path", st)
        const tl = gsap.timeline({ paused: true, defaults: { ease: "none" } })
        const slit = q(".or-slit", st)
        // like the reference: the work scrolls up and away (it is not faded in place), the hand
        // circle shrinks and lets a thread out to the top centre, a 1px line drops from there,
        // then the line widens into white
        tl.fromTo(q(".or-work-lift", st), { y: 0 }, { y: () => -1.15 * H(), duration: 0.36, ease: "power1.in" }, 0.1)
          .fromTo(q(".or-work-lift", st), { opacity: 1 }, { opacity: 0, duration: 0.11, ease: "power1.in" }, 0.12)
          .fromTo(q(".or-hand", st), { scale: 1 }, { scale: 0, duration: 0.2, ease: "power2.in" }, 0.32)
          .fromTo(path, { strokeDashoffset: 1, opacity: 1 }, { strokeDashoffset: 0, duration: 0.2 }, 0.34)
          .fromTo(slit, { scaleY: 0, scaleX: () => 1.5 / W() }, { scaleY: 1, duration: 0.12, ease: "power2.in" }, 0.54)
          .to(path, { opacity: 0, duration: 0.05 }, 0.64)
          .to(slit, { scaleX: 1, duration: 0.24, ease: "power3.in" }, 0.72)
        let last = 0
        if (deck) scrub(i, q(".or-work-track"), tl, 0, (p) => {
          if (crossed(last, p, 0.9)) setTone(i, p >= 0.9 ? "light" : undefined)
          last = p
        })
      }

      // ---- 6 Case: Loomi photos land on a tilted stack, the ones below tip back -------
      {
        const i = IX("case")
        const st = q(".or-case")
        const cards = qa(".or-tilt", st)
        const n = cards.length
        const num = q(".or-case-n", st)
        const fill = q(".or-case-rail b", st)
        const tl = gsap.timeline({ paused: true, defaults: { ease: "none" } })
        const tilt = [0, 7, -6, 5, -4, 6]
        // start states set outright (not as zero-length tweens) so progress 0 always shows card one alone
        cards.forEach((c, k) => gsap.set(c, k ? { y: H() * 1.05, rotate: tilt[k], scale: 1.04, filter: "brightness(1)" } : { y: 0, rotate: -2, scale: 1, filter: "brightness(1)" }))
        for (let k = 1; k < n; k++) {
          const at = (k - 1) * 1
          tl.fromTo(cards[k], { y: () => H() * 1.05, rotate: tilt[k], scale: 1.04 }, { y: 0, rotate: k % 2 ? 1.5 : -1.5, scale: 1, duration: 1, ease: "power2.out", immediateRender: false }, at)
          for (let j = 0; j < k; j++) {
            const d = k - j
            tl.to(cards[j], { y: () => -d * 1.8 * R(), scale: 1 - d * 0.055, rotate: (j % 2 ? 1 : -1) * (2 + d * 1.6), filter: "brightness(" + Math.max(0.45, 1 - d * 0.16) + ")", duration: 1, ease: "power2.out" }, at)
          }
        }
        tl.to({}, { duration: 0.3 })
        let shownN = -1
        scrub(i, q(".or-case-track"), tl, 1, (p) => {
          const k = Math.min(n, 1 + Math.floor(p * (n - 1) + 0.35))
          if (k !== shownN) {
            shownN = k
            num.textContent = String(k).padStart(2, "0")
          }
          fill.style.transform = "scaleX(" + p + ")"
        })
      }

      // ---- 8 Proof: a 3D text cube turns from claim to evidence ----------------------
      {
        const i = IX("proof")
        const tl = gsap.timeline({ paused: true, defaults: { ease: "none" } })
        // starts a little turned so it reads as a cube, not a list
        tl.fromTo(q(".or-cube"), { rotateY: 16 }, { rotateY: -90, duration: 0.6, ease: "power1.inOut" }, 0.2)
        scrub(i, q(".or-proof-track"), tl, 1)
      }

      // ---- 7 Rope: a scrubbed knot comes undone, the squircle floods the screen -------
      {
        const i = IX("rope")
        const st = q(".or-rope")
        const box = q(".or-squircle", st)
        const rope = mountRope(q<HTMLCanvasElement>(".or-rope-c", st), Math.min(2, window.devicePixelRatio || 1))
        cleanups.push(rope.dispose)
        const idea = q(".or-idea", st)
        const ideaL = qa(".or-l", idea)
        // centred by percent, so it stays centred while its width grows (a px offset would drift)
        gsap.set(box, { xPercent: -50, yPercent: -50, x: 0, y: 0 })
        const tl = gsap.timeline({ paused: true, defaults: { ease: "none" } })
        tl.fromTo(q(".or-rope-bg path", st), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.36 }, 0)
          .fromTo(box, { width: () => (deck ? 28 : 20) * R(), height: () => (deck ? 19 : 14) * R(), borderRadius: () => (deck ? 7 : 4.5) * R(), y: 0 }, { width: () => W() - 3 * R(), height: () => H() - 7.5 * R(), borderRadius: () => 4 * R(), y: () => -1.5 * R(), duration: 0.28, ease: "power2.inOut" }, 0.58)
          .fromTo(q(".or-rope-fill", st), { opacity: 0 }, { opacity: 1, duration: 0.2 }, 0.62)
          .fromTo(q(".or-rope-line", st), { opacity: 1, y: 0 }, { opacity: 0, y: () => -6 * R(), duration: 0.12 }, 0.5)
          .fromTo(q(".or-marq", st), { opacity: 0 }, { opacity: 1, duration: 0.1 }, 0.8)
        // The rope is an image sequence, like the reference: a fixed run of frames picked by scroll.
        // Given frames (ropeFrames) play as-is; otherwise ROPE_FRAMES are baked once from the 3D rope.
        const seq = q<HTMLCanvasElement>(".or-rope-seq", st)
        const sg = seq.getContext("2d")!
        let frames: (HTMLImageElement | Blob)[] | null = null
        const decoded = new Map<number, ImageBitmap>()
        let band01 = [0, 1]
        let fi = -1
        let rv = 0
        const drawSeq = (force?: boolean) => {
          if (!frames) return
          const k = Math.round(rv * (frames.length - 1))
          if (k === fi && !force) return
          fi = k
          const w = seq.clientWidth
          const h = seq.clientHeight
          const f = frames[k]
          if (f instanceof Blob) {
            const bm = decoded.get(k)
            if (!bm) {
              createImageBitmap(f).then((b) => {
                if (!alive) return b.close()
                decoded.set(k, b)
                // keep a handful of decoded neighbours, close the rest
                for (const key of decoded.keys()) if (decoded.size > 8 && Math.abs(key - fi) > 4) (decoded.get(key)!.close(), decoded.delete(key))
                if (fi === k) drawSeq(true)
              })
              return
            }
            sg.clearRect(0, 0, w, h)
            sg.drawImage(bm, 0, band01[0] * h, w, (band01[1] - band01[0]) * h)
            return
          }
          sg.clearRect(0, 0, w, h)
          if (ropeFrames) {
            // cover-fit a full photographic frame
            const s = Math.max(w / f.naturalWidth, h / f.naturalHeight)
            sg.drawImage(f, (w - f.naturalWidth * s) / 2, (h - f.naturalHeight * s) / 2, f.naturalWidth * s, f.naturalHeight * s)
          }
        }
        const sizeSeq = () => {
          const dpr = deck ? Math.min(2, window.devicePixelRatio) : 1
          seq.width = seq.clientWidth * dpr
          seq.height = seq.clientHeight * dpr
          sg.setTransform(dpr, 0, 0, dpr, 0, 0)
          sg.imageSmoothingQuality = "high"
          drawSeq(true)
        }
        let alive = true
        cleanups.push(() => {
          alive = false
          decoded.forEach((b) => b.close())
        })
        const load = async () => {
          if (ropeFrames?.length) {
            const imgs = await Promise.all(
              ropeFrames.map((u) => {
                const im = new Image()
                im.decoding = "async"
                im.src = u
                return im.decode().then(() => im)
              }),
            )
            if (!alive) return
            frames = imgs
          } else {
            const baked = await rope.bake(deck ? ROPE_FRAMES : 28)
            if (!alive) return
            frames = baked.frames
            band01 = baked.band
          }
          st.classList.add("or-seq-on")
          sizeSeq()
        }
        // baked lazily: in the deck once the visitor reaches Work, on the stacked page shortly after load;
        // until then (or if baking fails) the live 3D rope answers the scroll
        let baking = false
        S.bake = () => {
          if (baking) return
          baking = true
          load().catch(() => {})
        }
        const bakeT = deck ? 0 : window.setTimeout(S.bake, 1500)
        cleanups.push(() => clearTimeout(bakeT))
        let last = 0
        scrub(i, q(".or-rope-track"), tl, 1, (p) => {
          rv = band(p, 0.04, 0.62)
          if (frames) drawSeq()
          else rope.set(rv)
          const c = crossed(last, p, 0.74)
          if (c > 0 || (reduced && p >= 0.74)) gsap.fromTo(ideaL, { yPercent: 80, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.5, stagger: 0.02, ease: "power3.out", overwrite: true })
          if (c < 0) gsap.to(ideaL, { opacity: 0, duration: 0.2, overwrite: true })
          last = p
        })
        const ro = new ResizeObserver(() => {
          rope.resize()
          if (frames) sizeSeq()
        })
        ro.observe(st)
        cleanups.push(() => ro.disconnect())
      }

      // ---- the deck: wheel, keys, focus, the cuts ---------------------------------------
      // Video: the active scene plays, the next one preloads, everything else is paused and unloaded-until-needed.
      const vids = scenes.map((s) => qa<HTMLVideoElement>("video", s))
      const seenV = new Set<HTMLVideoElement>()
      const syncMedia = () => {
        if (S.active >= IX("work")) S.bake()
        vids.forEach((vs, i) =>
          vs.forEach((v) => {
            if (!deck) return
            if (i === S.active) v.play().catch(() => {})
            else {
              v.pause()
              if (i === S.active + 1 && v.preload === "none") v.preload = "auto"
            }
          }),
        )
      }
      if (!deck) {
        const io = new IntersectionObserver(
          (es) =>
            es.forEach((e) => {
              const v = e.target as HTMLVideoElement
              if (e.isIntersecting) (seenV.add(v), v.play().catch(() => {}))
              else if (seenV.has(v)) v.pause()
            }),
          { rootMargin: "200px 0px" },
        )
        vids.flat().forEach((v) => io.observe(v))
        cleanups.push(() => io.disconnect())
      }
      const proofActive = () => (deck ? S.active === IX("proof") : true)

      const arrive = (i: number, delay: number) => {
        const scene = scenes[i]
        const fh = root.clientHeight
        // measured against the scene, which may still be off-frame mid-slide
        const top = scene.getBoundingClientRect().top
        const vis = (el: Element) => {
          const r = el.getBoundingClientRect()
          return r.bottom > top && r.top < top + fh
        }
        const rise = qa("[data-rise]", scene).filter(vis)
        const spell = qa("[data-spell] .or-l", scene).filter((l) => !l.closest(".or-idea, .or-q, .or-car-title") && vis(l))
        if (reduced) {
          gsap.fromTo(scene, { opacity: 0 }, { opacity: 1, duration: 0.35 })
          return
        }
        gsap.fromTo(rise, { y: 50, rotate: 3, opacity: 0, transformOrigin: "0% 100%" }, { y: 0, rotate: 0, opacity: 1, duration: 0.6, stagger: 0.05, ease: "power3.out", delay, overwrite: "auto", clearProps: "transform" })
        gsap.fromTo(spell, { yPercent: 70, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.5, stagger: 0.014, ease: "power3.out", delay: delay + 0.05, overwrite: "auto" })
        if (i === IX("quote")) gsap.getById("rings")?.restart(true)
        if (i === IX("roi")) countUp(scene, delay)
      }

      // Count-up stats (after React Bits "CountUp"): numbers roll from zero each time Brands arrives.
      const countUp = (scene: HTMLElement, delay = 0) =>
        qa("[data-count]", scene).forEach((el, k) => {
          const o = { v: 0 }
          const to = +(el.getAttribute("data-count") || 0)
          gsap.to(o, { v: to, duration: 1.4, delay: delay + 0.2 + k * 0.12, ease: "power3.out", onUpdate: () => (el.textContent = String(Math.round(o.v)).padStart(2, "0")) })
        })

      const place = (to: number, fromBelow: boolean) => {
        // off-frame scenes stay in the tree (screen readers, Tab), only translated out of view
        scenes.forEach((s, k) => gsap.set(s, { yPercent: k < to ? -100 : k > to ? 100 : 0 }))
        const sc = scenes[to]
        const max = sc.scrollHeight - sc.clientHeight
        S.cur = S.target = S.written = fromBelow ? max : 0
        sc.scrollTop = S.cur
        S.push = 0
        S.active = to
        root.setAttribute("data-scene", SCENES[to].id)
        scenes.forEach((sc, k) => sc.classList.toggle("is-active", k === to))
        gate()
        applyTone()
        syncMedia()
        ScrollTrigger.update()
      }

      const slide = (to: number) => {
        const from = S.active
        const dir = to > from ? 1 : -1
        const now = performance.now()
        S.busyUntil = now + (reduced ? 400 : SLIDE_MS + 120)
        S.changedAt = now
        S.stale = true
        const a = scenes[from]
        const b = scenes[to]
        const max = b.scrollHeight - b.clientHeight
        S.cur = S.target = S.written = dir > 0 ? 0 : max
        b.scrollTop = S.cur
        S.push = 0
        S.active = to
        root.setAttribute("data-scene", SCENES[to].id)
        scenes.forEach((sc, k) => sc.classList.toggle("is-active", k === to || k === from))
        gate()
        gsap.delayedCall(SLIDE_MS / 1000, () => scenes[from].classList.remove("is-active"))
        if (reduced) {
          place(to, dir < 0)
          arrive(to, 0)
          return
        }
        gsap.set(b, { yPercent: 100 * dir })
        gsap.to(b, { yPercent: 0, duration: SLIDE_MS / 1000, ease: "power2.inOut" })
        gsap.to(a, { yPercent: -100 * dir, duration: SLIDE_MS / 1000, ease: "power2.inOut", onComplete: syncMedia })
        if (interstitial(SCENES[from].id, SCENES[to].id)) flash()
        else applyTone()
        syncMedia()
        ScrollTrigger.update()
        // content starts rising while the scene is still travelling, so no frame of the cut is empty
        arrive(to, 0.22)
      }

      // The 750 ms marquee: rotated rows racing at five speeds, header flicked white.
      const flash = () => {
        const ov = q(".or-flash")
        applyTone("dark")
        gsap.set(ov, { autoAlpha: 1 })
        qa(".or-flash-row", ov).forEach((r, k) =>
          gsap.fromTo(r, { xPercent: k % 2 ? -50 : 0 }, { xPercent: k % 2 ? 0 : -50, duration: [1.5, 0.75, 1.25, 0.9, 0.75, 1.1, 0.8][k], ease: "none", repeat: 1 }),
        )
        gsap.delayedCall(0.75, () => {
          gsap.set(ov, { autoAlpha: 0 })
          applyTone()
        })
      }

      // Menu / nav jumps: a disc sweeps in, the logo draws itself, the scene swaps, the disc fades.
      const jump = (to: number) => {
        if (to === S.active || to < 0 || to >= N) return
        if (!deck) {
          scenes[to].scrollIntoView({ behavior: reduced ? "auto" : "smooth" })
          return
        }
        if (reduced) {
          place(to, false)
          arrive(to, 0)
          return
        }
        const now = performance.now()
        S.busyUntil = now + 1500
        S.changedAt = now + 1000
        S.stale = true
        const ov = q(".or-jump")
        const paths = qa<SVGGeometryElement>(".or-jump-logo path, .or-jump-logo text", ov)
        ov.setAttribute("data-c", discColor(toneOf(S.active)))
        gsap
          .timeline()
          .set(ov, { autoAlpha: 1 })
          .fromTo(q(".or-jump-disc", ov), { x: () => -2 * Math.max(W(), H()), opacity: 1 }, { x: 0, duration: 0.45, ease: "power3.out" })
          .fromTo(paths, { strokeDashoffset: 420 }, { strokeDashoffset: 0, duration: 0.5, ease: "power1.inOut" }, 0.4)
          .fromTo(q(".or-jump-mark", ov), { opacity: 0, scale: 0.6, transformOrigin: "50% 50%" }, { opacity: 1, scale: 1, duration: 0.45, ease: "back.out(2)" }, 0.35)
          .call(() => place(to, false), [], 0.6)
          .to(ov, { autoAlpha: 0, duration: 0.4 }, 1.0)
          .call(() => arrive(to, 0), [], 1.0)
      }
      engine.current = { jump, setTone }

      if (deck) {
        place(0, false)
        arrive(IX("intro"), 0)
        // The soft scroll: one rAF eases the active scene's scrollTop toward its target.
        let raf = 0
        let then = performance.now()
        const loop = (t: number) => {
          const dt = t - then
          then = t
          const sc = scenes[S.active]
          if (Math.abs(S.target - S.cur) > 0.01) {
            S.cur = glide(S.cur, S.target, 0.05, dt)
            sc.scrollTop = S.cur
            S.written = sc.scrollTop
          }
          // free-scrolling content (the contact page) slides under a frosted header
          const solid = SCENES[S.active].id === "contact" && S.cur > 40
          if (solid !== S.solid) {
            S.solid = solid
            header.classList.toggle("is-solid", solid)
          }
          raf = requestAnimationFrame(loop)
        }
        raf = requestAnimationFrame(loop)
        cleanups.push(() => cancelAnimationFrame(raf))

        // Anything else that scrolls a scene (focus, find, a screen reader) is adopted, not fought.
        scenes.forEach((sc, i) =>
          on(sc, "scroll", () => {
            if (i !== S.active) return
            if (Math.abs(sc.scrollTop - S.written) > 2) S.cur = S.target = S.written = sc.scrollTop
          }),
        )
        // Focus is never trapped off-screen: tabbing into another scene brings it in.
        on(root, "focusin", (e) => {
          const s = (e.target as HTMLElement).closest(".or-scene")
          const i = scenes.indexOf(s as HTMLElement)
          if (i >= 0 && i !== S.active && performance.now() > S.busyUntil) place(i, false)
          root.scrollTop = 0
          root.scrollLeft = 0
        })
        on(root, "scroll", () => {
          root.scrollTop = 0
          root.scrollLeft = 0
        })

        const turn = (dir: number) => {
          const to = stepIndex(S.active, dir, N)
          if (to < 0) return false
          slide(to)
          return true
        }

        on(
          root,
          "wheel",
          (e) => {
            if (e.ctrlKey || root.classList.contains("or-menu-open") || root.classList.contains("or-case-open")) return
            const now = performance.now()
            const gap = now - S.lastWheel
            S.lastWheel = now
            const delta = normalizeWheel(e.deltaY, e.deltaMode, root.clientHeight)
            if (!delta) return
            // inertia from the gesture that turned the scene must not turn the next one
            if (gap > GESTURE_GAP || now - S.changedAt > 1400) S.stale = false
            if (now < S.busyUntil || S.stale) return e.preventDefault()
            const sc = scenes[S.active]
            const max = sc.scrollHeight - sc.clientHeight
            const r = wheelStep(S, delta, S.cur, max, EDGE_BUFFER, 2.6, root.clientHeight * 0.9)
            S.target = r.target
            S.push = r.push
            if (r.turn && !turn(r.turn)) return // first top / last bottom: let the host page scroll
            e.preventDefault()
          },
          { passive: false },
        )

        on(window, "keydown", (e) => {
          const t = e.target as HTMLElement
          if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return
          if (t.closest("input, textarea, select, [contenteditable]")) return
          if (root.classList.contains("or-case-open")) return
          if (root.classList.contains("or-menu-open")) {
            if (e.key === "Escape") setMenu(false)
            return
          }
          const k = keyIntent(e.key, e.shiftKey, N)
          if (!k) return
          if (e.key === " " && t.closest("button, a, label")) return
          e.preventDefault()
          if (performance.now() < S.busyUntil) return
          if (k.kind === "jump") return jump(k.to)
          const sc = scenes[S.active]
          const max = sc.scrollHeight - sc.clientHeight
          const step = /Page| /.test(e.key) ? root.clientHeight * 0.85 : 140
          const atEdge = k.to > 0 ? S.cur >= max - 1.5 : S.cur <= 1.5
          if (atEdge) turn(k.to)
          else S.target = Math.min(max, Math.max(0, S.target + k.to * step))
        })
      } else {
        // Stacked: native scroll; header tone and arrivals follow the window.
        scenes.forEach((s, i) => {
          ScrollTrigger.create({
            trigger: s,
            start: "top 10%",
            end: "bottom 10%",
            onToggle: (st) => {
              if (!st.isActive) return
              S.active = i
              gate()
              applyTone()
            },
          })
          qa("[data-rise], [data-spell]", s).filter((el) => !el.closest(".or-idea, .or-car-title")).forEach((el) =>
            reduced
              ? gsap.from(el, { opacity: 0, duration: 0.5, scrollTrigger: { trigger: el, start: "top 92%", once: true } })
              : gsap.from(el.matches("[data-spell]") ? qa(".or-l", el) : el, {
                  y: el.matches("[data-spell]") ? 0 : 40,
                  yPercent: el.matches("[data-spell]") ? 70 : 0,
                  rotate: el.matches("[data-spell]") ? 0 : 3,
                  opacity: 0,
                  duration: 0.5,
                  stagger: 0.014,
                  ease: "power3.out",
                  scrollTrigger: { trigger: el, start: "top 92%", once: true },
                }),
          )
        })
        applyTone()
        syncMedia()
        ScrollTrigger.create({ trigger: scenes[IX("roi")], start: "top 70%", once: true, onEnter: () => countUp(scenes[IX("roi")]) })
      }

      // ---- living details ---------------------------------------------------------------
      const dot = q(".or-dot")
      const iris = q(".or-iris")
      const eye = q(".or-eye")
      const blob = q(".or-blob")
      const mags = qa("[data-mag]")
      const ptr = { x: -100, y: -100, bx: 0, by: 0, dx: -100, dy: -100, idle: 0, inside: false }
      const magScene = mags.map((m) => scenes.indexOf(m.closest(".or-scene") as HTMLElement))
      let sleepT = 0
      on(window, "pointermove", (e) => {
        if (e.pointerType !== "mouse") return
        ptr.x = e.clientX
        ptr.y = e.clientY
        ptr.idle = performance.now()
        ptr.inside = true
        const t = (e.target as HTMLElement).closest?.("[data-cursor], a, button, label") as HTMLElement | null
        dot.setAttribute("data-k", t ? t.getAttribute("data-cursor") || "nav" : "")
        eye.classList.remove("is-asleep")
        clearTimeout(sleepT)
        sleepT = window.setTimeout(() => eye.classList.add("is-asleep"), 2000)
      })
      cleanups.push(() => clearTimeout(sleepT))
      let raf2 = 0
      const live = () => {
        const fine = deck
        // idle pointer and settled magnets: nothing to read or write this frame
        const still = performance.now() - ptr.idle > 1500 && Math.abs(ptr.x - ptr.dx) < 0.5 && Math.abs(ptr.y - ptr.dy) < 0.5 && (!proofActive() || (ptr.bx === ptr.x && ptr.by === ptr.y))
        if (fine && !still) {
          // reads first, then writes: one layout per frame; only the header, the chips and the active scene's magnets
          const act = mags.filter((_, k) => magScene[k] < 0 || magScene[k] === S.active)
          const rects = act.map((m) => m.getBoundingClientRect())
          const er = S.active === IX("home") ? eye.getBoundingClientRect() : ({ width: 0 } as DOMRect)
          const rr = root.getBoundingClientRect()
          ptr.dx += (ptr.x - ptr.dx) * 0.18
          ptr.dy += (ptr.y - ptr.dy) * 0.18
          // the size container is the dot's containing block, so place it in frame coordinates
          dot.style.transform = "translate3d(" + (ptr.dx - rr.left) + "px," + (ptr.dy - rr.top) + "px,0)"
          act.forEach((m, k) => {
            const r = rects[k]
            const cxm = r.left + r.width / 2
            const cym = r.top + r.height / 2
            const reach = Math.max(r.width, r.height) * 0.9 + 30
            const ox = ptr.x - cxm
            const oy = ptr.y - cym
            const inside = Math.abs(ox) < reach && Math.abs(oy) < reach
            const cur = (m as HTMLElement & { _m?: number[] })._m ?? [0, 0]
            const tx = inside ? ox * 0.28 : 0
            const ty = inside ? oy * 0.28 : 0
            cur[0] += (tx - cur[0]) * 0.12
            cur[1] += (ty - cur[1]) * 0.12
            ;(m as HTMLElement & { _m?: number[] })._m = cur
            m.style.translate = cur[0].toFixed(2) + "px " + cur[1].toFixed(2) + "px"
          })
          if (er.width) {
            const ex = ptr.x - (er.left + er.width / 2)
            const ey = ptr.y - (er.top + er.height / 2)
            const d = Math.hypot(ex, ey) || 1
            const k = Math.min(1, d / 300) * 8
            iris.setAttribute("transform", "translate(" + ((ex / d) * k).toFixed(2) + " " + ((ey / d) * k * 0.6).toFixed(2) + ")")
          }
          if (proofActive()) {
            ptr.bx += (ptr.x - ptr.bx) * 0.04
            ptr.by += (ptr.y - ptr.by) * 0.04
            if (Math.abs(ptr.x - ptr.bx) < 0.3 && Math.abs(ptr.y - ptr.by) < 0.3) (ptr.bx = ptr.x), (ptr.by = ptr.y)
            blob.style.transform = "translate3d(" + (ptr.bx - rr.left) + "px," + (ptr.by - rr.top) + "px,0)"
          }
        }
        raf2 = requestAnimationFrame(live)
      }
      if (deck) raf2 = requestAnimationFrame(live)
      cleanups.push(() => cancelAnimationFrame(raf2))

      // Bubbles rising behind the cube, drawn only while that scene is on screen.
      {
        const cv = q<HTMLCanvasElement>(".or-bubbles")
        const g = cv.getContext("2d")!
        const cols = ["#1c4038", "#b1da96", "#f2cf7b", "#7fbf9a"]
        const count = deck ? 30 : 10
        let parts: { x: number; y: number; r: number; v: number; c: string }[] = []
        const size = () => {
          const dpr = Math.min(2, window.devicePixelRatio)
          cv.width = cv.clientWidth * dpr
          cv.height = cv.clientHeight * dpr
          g.setTransform(dpr, 0, 0, dpr, 0, 0)
          const w = cv.clientWidth
          const h = cv.clientHeight
          parts = Array.from({ length: count }, (_, k) => ({ x: Math.random() * w, y: h * (0.2 + Math.random()), r: 2.5 + Math.random() * 3.5, v: 0.4 + Math.random() * 1.2, c: cols[k % cols.length] }))
        }
        let raf3 = 0
        let seen = !deck
        const io = new IntersectionObserver((es) => (seen = es[0].isIntersecting))
        if (!deck) io.observe(cv)
        const draw = () => {
          raf3 = requestAnimationFrame(draw)
          if (reduced || (deck ? S.active !== IX("proof") : !seen)) return
          const w = cv.clientWidth
          const h = cv.clientHeight
          g.clearRect(0, 0, w, h)
          for (const p of parts) {
            p.y -= p.v
            if (p.y + p.r < 0) p.y = h + 40
            g.beginPath()
            g.arc(p.x, p.y, p.r, 0, Math.PI * 2)
            g.fillStyle = p.c
            g.fill()
          }
        }
        size()
        raf3 = requestAnimationFrame(draw)
        const ro = new ResizeObserver(size)
        ro.observe(cv)
        cleanups.push(() => (cancelAnimationFrame(raf3), ro.disconnect(), io.disconnect()))
      }

      ScrollTrigger.refresh()
    }, root)

    return () => {
      engine.current = null
      cleanups.forEach((f) => f())
      ctx.revert()
      root.classList.remove("or-live")
    }
  }, [mode, reduced, dark])

  React.useEffect(() => {
    rootRef.current?.classList.toggle("or-menu-open", menu)
  }, [menu])

  const nav = (i: number) => (e: React.MouseEvent) => {
    e.preventDefault()
    if (menu) {
      engine.current?.jump(i)
      window.setTimeout(() => setMenu(false), mode === "deck" ? 500 : 0)
    } else engine.current?.jump(i)
  }
  const MENU = [
    { label: "Studio", to: IX("about"), panel: <img src={IMG("sarrohi-1")} alt="" /> },
    { label: "Projects", to: IX("case"), panel: <img src={IMG("munch-grid")} alt="" /> },
    { label: "Services", to: IX("services"), panel: <img src={IMG("idf-1")} alt="" /> },
    { label: "Clients", to: IX("brands"), panel: <img src={IMG("beingmen-1")} alt="" /> },
    { label: "Investment", to: IX("pricing"), panel: <img src={IMG("loomi-trio")} alt="" /> },
    { label: "Contact", to: IX("contact"), panel: <span style={{ background: "#b1da96" }} /> },
  ]
  const quote = "The best brands don’t shout. They stay with you."

  return (
    <div
      ref={rootRef}
      className={cx("or-root", "or-gated", mode === "stack" && "or-stack", reduced && "or-reduced", dark && "or-dark", className)}
      style={{ "--h": height } as React.CSSProperties}
      data-scene="home"
    >
      {fontHref && <link rel="stylesheet" href={fontHref} />}
      <style>{CSS}</style>
      <div className="or-probe" aria-hidden="true" />

      <header className="or-header" data-tone="light">
        <nav className="or-rail" aria-label="Scene index">
          {SCENES.map((s, k) => (
            <button key={s.id} type="button" className={cx(k === 0 && "is-on")} aria-label={"Go to " + s.label} data-cursor="menu" onClick={() => engine.current?.jump(k)}>
              <i />
              <span>{String(k + 1).padStart(2, "0") + " " + s.label}</span>
            </button>
          ))}
        </nav>
        <a href="#home" className="or-logo or-rl" data-cursor="nav" onClick={nav(IX("intro"))} aria-label={brand + " home"}>
          <Mark className="or-logo-m" />
          <span>{brand.toLowerCase()}</span>
        </a>
        <nav className="or-nav" aria-label="Scenes">
          {[
            ["Studio", IX("about")],
            ["Work", IX("case")],
            ["Services", IX("services")],
            ["Clients", IX("brands")],
            ["Pricing", IX("pricing")],
            ["Contact", IX("contact")],
          ].map(([l, i]) => (
            <a key={l} href={"#" + SCENES[i as number].id} className="or-rl" data-cursor="nav" onClick={nav(i as number)}>
              <Roll>{l as string}</Roll>
            </a>
          ))}
        </nav>
        <div className="or-head-r">
          <a href="#contact" className="or-talk or-rl" data-mag="" data-cursor="nav" onClick={nav(IX("contact"))}>
            <i />
            <Roll>Let's talk</Roll>
          </a>
          <button type="button" className={cx("or-burger", menu && "is-open")} data-mag="" data-cursor="menu" aria-expanded={menu} aria-controls="or-menu" onClick={() => setMenu((m) => !m)}>
            <span className="or-burger-t">
              <span>menu</span>
              <span>close</span>
            </span>
            <span className="or-burger-l" aria-hidden="true">
              <i />
              <i />
            </span>
          </button>
        </div>
      </header>

      {/* 0 ── Entrance: the character opens wide, its mouth becomes the studio */}
      <section className="or-scene or-s-intro" id="intro" aria-label="Ainimight Studio">
        <div className="or-track or-intro-track">
          <div className="or-stage or-intro">
            <div className="or-in-bg">
              <svg className="or-in-ch" viewBox="0 0 1000 1000" aria-hidden="true">
                <path className="or-ch-hair" d="M140 1000V600C140 360 300 215 500 215S860 360 860 600V1000Z" />
                <g className="or-ch-bun">
                  <circle cx="500" cy="190" r="62" />
                  <path className="or-ch-leaf" d="M500 132C468 96 470 58 500 30C530 58 532 96 500 132Z" />
                  <path className="or-ch-leaf" d="M512 128C540 102 572 100 598 112C584 138 552 150 512 128Z" />
                </g>
                <ellipse className="or-ch-face" cx="500" cy="600" rx="255" ry="275" />
                <path className="or-ch-fringe" d="M245 540C240 395 350 300 500 300S760 395 755 540C715 468 620 432 545 452C520 420 480 420 455 452C380 432 285 468 245 540Z" />
                <g className="or-ch-cheeks">
                  <ellipse cx="368" cy="690" rx="42" ry="22" />
                  <ellipse cx="632" cy="690" rx="42" ry="22" />
                </g>
                <g className="or-ch-eyes">
                  <circle className="or-ch-lens" cx="405" cy="575" r="72" />
                  <circle className="or-ch-lens" cx="595" cy="575" r="72" />
                  <path className="or-ch-lens" d="M477 572Q500 556 523 572" />
                  <path className="or-ch-lid" d="M375 575H435M565 575H625" />
                  <circle className="or-ch-pupil" cx="405" cy="575" r="11" />
                  <circle className="or-ch-pupil" cx="595" cy="575" r="11" />
                </g>
                <ellipse className="or-ch-mouth" cx="500" cy="730" rx="26" ry="30" />
              </svg>
            </div>
            <div className="or-in-hole">
              <div className="or-in-copy">
                <p className="or-in-eyebrow">Ainimight Studio.</p>
                <h1 className="or-in-h">
                  {"Built for brands that refuse to blend in.".split(" ").map((w, k) => (
                    <span key={k} className="or-iw or-iw-sp">
                      {w}
                    </span>
                  ))}
                </h1>
                <p className="or-in-svc">
                  {["Illustration", "Branding", "Animation", "Packaging", "Publishing"].map((w, k) => (
                    <span key={w} className={"or-iw or-iw-c" + k}>
                      {w}
                      {k < 4 ? <i> · </i> : null}
                    </span>
                  ))}
                </p>
              </div>
              <div className="or-in-logos" aria-label="Trusted by">
                <div>
                  {[...CLIENTS, ...CLIENTS].map((c, k) => (
                    <span key={k} className={"or-lg or-lg" + (k % 5)} aria-hidden={k >= CLIENTS.length}>
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 1 ── Home */}
      <section className="or-scene or-s-home" id="home" aria-label="Home">
        <div className="or-home">
          <h1 className="or-hero">
            <Spell text={headline} />
          </h1>
          <div className="or-home-meta" data-rise="">
            <span className="or-rate">
              <Mark className="or-rate-m" />
              <span>
                <small className="or-rate-k">Trusted by brands like</small>
                <small>Munchbrew, Sarrohi &amp; Impact and Dialogue</small>
              </span>
            </span>
            <p className="or-services">Illustration / Branding / Animation / Packaging / Publishing — Chandigarh, working worldwide</p>
            <a className="or-deck-pill or-rl" href="#work" data-mag="" data-cursor="nav" onClick={nav(IX("work"))}>
              <Roll>See the work</Roll>
            </a>
          </div>
          <div className="or-eye-wrap">
            <Eye />
          </div>
        </div>
        <div className="or-reel-track">
          <div className="or-reel">
            <div className="or-reel-mask">
              <div className="or-reel-in">
                <canvas className="or-ribbon" aria-hidden="true" />
              </div>
              <span className="or-reel-cap">Showreel 2026 · Ainimight Studio, Chandigarh</span>
              <button
                type="button"
                className="or-play"
                data-mag=""
                data-cursor="button"
                aria-label="Pause or play the work reel"
                onClick={(e) => {
                  const r = (e.currentTarget.parentElement as HTMLElement).querySelector(".or-ribbon")!
                  const paused = r.classList.toggle("is-paused")
                  e.currentTarget.classList.toggle("is-paused", paused)
                }}
              >
                <i />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 1 ── About */}
      <section className="or-scene or-s-about" id="about" aria-label="About">
        <div className="or-track or-about-track">
          <div className="or-stage">
            <div className="or-about-row">
              <h2 className="or-about-h">
                <Spell text={"Why we *exist?*"} />
              </h2>
              {CARDS.map((c, i) => (
                <article key={c.title} className="or-card" style={{ background: c.tint }} data-rise="">
                  <svg className="or-card-rings" viewBox="0 0 600 600" aria-hidden="true">
                    <circle cx="160" cy="180" r="290" />
                    <circle cx="430" cy="110" r="290" />
                  </svg>
                  <div className={cx("or-card-pill", !c.clip && "is-type")}>{c.clip ? <Clip src={c.clip} /> : <span>{c.tag}</span>}</div>
                  <span className="or-card-tag">{c.tag}</span>
                  <h3>{c.title}</h3>
                  <p>{c.text}</p>
                  <button type="button" className="or-card-go or-rl" onClick={() => openCase(c.caseId)} data-cursor="nav">
                    <Roll>Read the case study</Roll> <i>↗</i>
                  </button>
                  <span className="or-num" aria-hidden="true">
                    0{i + 1}
                  </span>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2 ── What we make */}
      <section className="or-scene or-s-make" id="make" aria-label="What we make">
        <div className="or-track or-make-track">
          <div className="or-stage or-make">
            <div className="or-make-light" aria-hidden="true">
              <span className="or-grid" />
            </div>
            <h2 className="or-make-word">
              <Spell text="We make" />
            </h2>
            <div className="or-mock" aria-hidden="true">
              <div className="or-mock-in">
                <div className="or-m-top">
                  <Mark className="or-m-logo" />
                  <span className="or-m-tab is-on">Boards</span>
                  <span className="or-m-tab">Sketches</span>
                  <span className="or-m-tab">Print runs</span>
                  <span className="or-m-search">Search artwork</span>
                  <span className="or-m-faces">
                    {AVATARS.slice(0, 4).map((a) => (
                      <img key={a} src={IMG(a, true)} alt="" />
                    ))}
                  </span>
                  <span className="or-m-new">+ New artwork</span>
                </div>
                <div className="or-m-side">
                  {[0, 1, 2, 3, 4].map((k) => (
                    <i key={k} className={cx(k === 1 && "is-on")} />
                  ))}
                </div>
                <div className="or-m-stats">
                  {[
                    ["Sketches on the wall", "64", "#7c8cff"],
                    ["Going to print", "9", "#3fbf8f"],
                    ["Colour proofs", "3", "#f2b84b"],
                  ].map(([a, b, c]) => (
                    <div key={a} className="or-m-stat">
                      <small>{a}</small>
                      <b>{b}</b>
                      <span style={{ background: c }} />
                    </div>
                  ))}
                </div>
                <div className="or-m-title">
                  <small>Munchbrew / Flower tea range</small>
                  <b>Today</b>
                </div>
                {[
                  ["Sketching", "#9a9aa3", ["Blue pea label", "Hibiscus tin", "Gift box"]],
                  ["On the table", "#7c8cff", []],
                  ["Printed", "#3fbf8f", ["Logo lockup", "Pattern system"]],
                ].map(([t, c, items], k) => (
                  <div key={t as string} className={"or-m-col or-m-col" + k}>
                    <div className="or-m-colh">
                      <i style={{ background: c as string }} />
                      {t as string}
                    </div>
                    {k === 1 ? (
                      <div className="or-m-card or-m-card-big">
                        <b>Hero packshot</b>
                        <small>Packaging · 3D · due Friday</small>
                        <div className="or-slot">
                          <Clip src={IMG(MAKE)} />
                        </div>
                      </div>
                    ) : (
                      (items as string[]).map((it, j) => (
                        <div key={it} className="or-m-card">
                          <b>{it}</b>
                          <small>{["Illustration", "Colour", "Print"][j % 3]} · {j + 2} notes</small>
                          <span className="or-m-bar">
                            <span style={{ width: 30 + j * 25 + "%", background: c as string }} />
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                ))}
              </div>
              <div className="or-skel">
                <i style={{ left: "5.5%", top: "4%", width: "30%", height: "6%" }} />
                <i style={{ left: "70%", top: "4%", width: "24%", height: "6%" }} />
                {[0, 1, 2].map((k) => (
                  <i key={"s" + k} style={{ left: 8.3 + k * 30.3 + "%", top: "15%", width: "28%", height: "15%" }} />
                ))}
                <i style={{ left: "8.3%", top: "35%", width: "22%", height: "6%" }} />
                {[8.3, 34.1, 67.4].map((l, k) => (
                  <i key={"c" + k} style={{ left: l + "%", top: "47%", width: k === 1 ? "31.8%" : "24%", height: "48%" }} />
                ))}
              </div>
              <span className="or-notch" />
            </div>
            <div className="or-make-media" aria-hidden="true">
              <Clip src={IMG(MAKE)} />
            </div>
            {CURSORS.map((c) => (
              <span key={c.name} className="or-cur" style={{ "--c": c.c } as React.CSSProperties} aria-hidden="true">
                <svg viewBox="0 0 16 18">
                  <path d="M1 1l13 6.5-5.6 1.6L5.8 16Z" />
                </svg>
                <b>{c.name}</b>
              </span>
            ))}
            <div className="or-tag" aria-live="polite">
              {TAGS.map((t) => (
                <span key={t} className="or-tag-l">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3 ── People */}
      <section className="or-scene or-s-people" id="people" aria-label="Concepts">
        <div className="or-track or-people-track">
          <div className="or-stage or-people">
            <div className="or-flies" aria-hidden="true">
              {[IMG("munch-hibiscus"), IMG("idf-4"), IMG("sarrohi-bag")].map((src, k) => (
                <img key={src} className={"or-fly or-fly" + k} src={src} alt="" />
              ))}
            </div>
            <h2 className="or-people-h">
              <span className="or-sr">Every project led by the same hands from brief to delivery.</span>
              <span className="or-pl" aria-hidden="true">
                <Spell text="Every project" hidden />
              </span>
              <span className="or-pl or-hi" aria-hidden="true">
                <Spell text="led by the same" hidden />
              </span>
              <span className="or-pl" aria-hidden="true">
                <span className="or-gap">
                  <span className="or-ava">
                    {AVATARS.map((a, k) => (
                      <img key={a + k} src={IMG(a, true)} alt="" />
                    ))}
                    <b>+1</b>
                  </span>
                  <span className="or-gap-word">hands</span>
                </span>
                <Spell text="from brief" hidden />
              </span>
              <span className="or-pl" aria-hidden="true">
                <Spell text="to delivery" hidden />
              </span>
            </h2>
            <span className="or-swallow" aria-hidden="true" />
          </div>
        </div>
      </section>

      {/* 4 ── Quote */}
      <section className="or-scene or-s-quote" id="quote" aria-label="What we believe">
        <div className="or-track or-quote-track">
          <div className="or-stage or-quote">
            <span className="or-ring-c or-ring-c0" aria-hidden="true" />
            <span className="or-ring-c or-ring-c1" aria-hidden="true" />
            <span className="or-ring-c or-ring-c2" aria-hidden="true" />
            <span className="or-qmark" aria-hidden="true" data-rise="">
              “
            </span>
            <blockquote className="or-q">
              <Spell text={quote} />
            </blockquote>
            <span className="or-qbar" aria-hidden="true">
              <i />
            </span>
            <p className="or-qcap" data-rise="">
              — Ainimight Studio. We believe every brand has a soul. Our work is making it visible.
            </p>
          </div>
        </div>
      </section>

      {/* 5 ── Work */}
      <section className="or-scene or-s-work" id="work" aria-label="Selected work">
        <div className="or-track or-work-track">
          <div className="or-stage or-work">
            <div className="or-work-lift">
              <p className="or-work-k" data-rise="">
                Trusted by brands who believe in the power of design · drag, use ← → or click to open
              </p>
              <div data-rise="" className="or-car-wrap">
                <Carousel projects={projects} onOpen={openCase} />
              </div>
            </div>
            <div className="or-hand" aria-hidden="true">
              <Clip src={IMG("loomi-cover")} />
            </div>
            <svg className="or-thread" viewBox="0 0 1440 900" preserveAspectRatio="none" aria-hidden="true">
              <path pathLength={1} d="M1272 748C1262 520 1060 410 900 330C780 270 722 170 720 -10" />
            </svg>
            <span className="or-slit" aria-hidden="true" />
          </div>
        </div>
      </section>

      {/* 7 ── Selected projects: a tilt stack, one card per client (after 21st.dev "tilt-stack-scroll") */}
      <section className="or-scene or-s-case" id="case" aria-label="Selected projects">
        <div className="or-track or-case-track">
          <div className="or-stage or-case">
            <div className="or-case-l">
              <p className="or-case-k" data-rise="">
                Trusted by brands who believe in the power of design.
              </p>
              <h2 className="or-case-h">
                <Spell text="Selected *work*" />
              </h2>
              <p className="or-case-sub" data-rise="">
                We believe every brand has a soul. <b>Our work is making it visible.</b>
              </p>
              <div className="or-case-tags" data-rise="">
                {["Illustration", "Branding", "Animation", "Packaging", "Publishing"].map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
              <div className="or-case-rail" data-rise="">
                <span className="or-case-n">01</span>
                <i>
                  <b />
                </i>
                <span>{String(CASE.length).padStart(2, "0")}</span>
              </div>
            </div>
            <div className="or-case-stack">
              {CASE.map((c, k) => (
                <figure key={c.img} className="or-tilt" style={{ zIndex: k + 1 }}>
                  <img src={IMG(c.img)} alt={c.t} draggable={false} />
                  <figcaption>
                    <span className="or-tilt-txt">
                      <b>{c.t}</b>
                      <span>{c.d}</span>
                    </span>
                    <button type="button" className="or-tilt-go" onClick={() => openCase(c.id)} data-cursor="nav">
                      Open case ↗
                    </button>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 8 ── Services: "Here's what we bring to the table." */}
      <section className="or-scene or-s-services" id="services" aria-label="Services">
        <div className="or-svc">
          <div className="or-svc-head">
            <p className="or-brands-k" data-rise="">
              Services
            </p>
            <h2 className="or-svc-h">
              <Spell text="Here's what we bring to *the table.*" />
            </h2>
          </div>
          <div className="or-svc-cols">
            {SERVICE_COLS.map((c, k) => (
              <article key={c.n} className="or-arch" style={{ "--k": k } as React.CSSProperties} data-rise="">
                <img src={IMG(["sarrohi-cards", "munch-bluepea", "loomi-char-calm", "beingmen-phone"][k], true)} alt="" aria-hidden="true" />
                <span className="or-arch-n">{c.n}</span>
                <h3>{c.h}</h3>
                <p>{c.p}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 9 ── Why brand: the numbers */}
      <section className="or-scene or-s-roi" id="roi" aria-label="Why investing in brand pays">
        <div className="or-roi">
          <h2 className="or-roi-h">
            <Spell text="This is not a cost. It's the *highest-ROI decision* your brand will make." />
          </h2>
          <div className="or-roi-cards">
            {ROI.map((r) => (
              <article key={r.k} className="or-roi-c" data-rise="">
                <p>{r.p}</p>
                <div>
                  <b>
                    <span data-count={r.n}>00</span>%
                  </b>
                  <small>{r.k}</small>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 10 ── Clients (flowing menu, after React Bits "FlowingMenu") */}
      <section className="or-scene or-s-brands" id="brands" aria-label="Clients">
        <div className="or-brands">
          <p className="or-brands-k" data-rise="">
            Clients
          </p>
          <h2 className="or-brands-h">
            <Spell text="Trusted by brands who believe in *the power of design.*" />
          </h2>
          <div className="or-flow" data-rise="">
            {BRANDS.map((b) => (
              <div key={b.name} className={cx("or-flow-item", !b.caseId && "is-soon")} onMouseEnter={flow(true)} onMouseLeave={flow(false)}>
                <a href={b.caseId ? "#" + b.caseId : "#contact"} className="or-flow-link" data-cursor="nav" onClick={(e) => (e.preventDefault(), b.caseId ? openCase(b.caseId) : engine.current?.jump(IX("contact")))}>
                  <span>{b.name}</span>
                  <small>{b.kind}</small>
                  <i aria-hidden="true">↗</i>
                </a>
                <div className="or-flow-marq" aria-hidden="true">
                  <div className="or-flow-inner">
                    <div className="or-flow-track">
                      {[0, 1, 2, 3].map((r) =>
                        (b.imgs.length ? b.imgs : b.words).map((im, k) => (
                          <React.Fragment key={r + "-" + k}>
                            <span>{b.imgs.length ? b.name : im}</span>
                            {b.imgs.length ? <img src={IMG(im, true)} alt="" /> : <em>✦</em>}
                          </React.Fragment>
                        )),
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11 ── What we stand for: the 3D cube */}
      <section className="or-scene or-s-proof" id="proof" aria-label="What we stand for">
        <div className="or-track or-proof-track">
          <div className="or-stage or-proof">
            <canvas className="or-bubbles" aria-hidden="true" />
            <span className="or-blob" aria-hidden="true" />
            <div className="or-cube-wrap">
              <div className="or-cube">
                <div className="or-face or-face-a">
                  <span className="or-sr">What we stand for.</span>
                  {Array.from({ length: 13 }, (_, k) => (
                    <span key={k} aria-hidden="true" className={cx(k === 0 && "is-hi")}>
                      What we <em>stand for.</em>
                    </span>
                  ))}
                </div>
                <ul className="or-face or-face-b">
                  {VALUES.map((v) => (
                    <li key={v.h}>
                      <b>{v.h}</b>
                      <small>{v.p}</small>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9 ── The shelf (React Bits "CircularGallery") */}
      <section className="or-scene or-s-shelf" id="shelf" aria-label="Book covers">
        <div className="or-shelf">
          <p className="or-shelf-k" data-rise="">
            Book cover design
          </p>
          <h2 className="or-shelf-h">
            <Spell text="Covers that read *at thumbnail*" />
          </h2>
          <p className="or-shelf-sub" data-rise="">
            Finished covers and the explorations behind them. Drag the shelf, or click a cover to read its case study.
          </p>
          <div className="or-shelf-g" data-cursor="view">
            {shelfOn && (
              <CircularGallery
                items={SHELF}
                bend={2.2}
                textColor="#ffffff"
                borderRadius={0.035}
                font="500 20px Inter Tight"
                itemAspect={0.68}
                itemSize={1.05}
                gap={0.2}
                autoScroll={0.5}
                shadow={0.4}
                openOnClick={false}
                onItemClick={(_, i) => SHELF[i]?.caseId && openCase(SHELF[i].caseId)}
              />
            )}
          </div>
        </div>
      </section>

      {/* 13 ── Investment in your brand */}
      <section className="or-scene or-s-pricing" id="pricing" aria-label="Investment in your brand">
        <div className="or-price">
          <div className="or-price-head">
            <p className="or-brands-k" data-rise="">
              Pricing
            </p>
            <h2 className="or-price-h">
              <Spell text="Investment in *your brand*" />
            </h2>
          </div>
          <div className="or-price-cards">
            {PLANS.map((pl) => (
              <article key={pl.t} className={cx("or-plan", pl.hot && "is-hot")} data-rise="">
                {pl.hot && <span className="or-plan-tag">Most popular</span>}
                <small>{pl.t}</small>
                <b>{pl.pr}</b>
                <ul>
                  {pl.p.split(" + ").map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
                <button type="button" className="or-plan-go or-rl" data-cursor="nav" onClick={() => engine.current?.jump(IX("contact"))}>
                  <Roll>Start with this</Roll> <i>→</i>
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 14 ── Rope */}
      <section className="or-scene or-s-rope" id="process" aria-label="How we work">
        <div className="or-track or-rope-track">
          <div className="or-stage or-rope">
            <span className="or-rope-fill" aria-hidden="true" />
            <svg className="or-rope-bg" viewBox="0 0 1440 900" preserveAspectRatio="none" aria-hidden="true">
              <path pathLength={1} d="M1460 470C1180 560 860 600 640 640C430 680 330 820 230 800C110 776 120 640 300 620C520 596 560 760 470 900" />
            </svg>
            <p className="or-rope-line" data-rise="">
              We ask the uncomfortable questions before we pick up the pen.
            </p>
            <div className="or-squircle">
              <canvas className="or-rope-c" aria-hidden="true" />
              <canvas className="or-rope-seq" aria-hidden="true" />
              <h2 className="or-idea">
                <span className="or-sr">Let’s build something worth remembering.</span>
                <span className="or-idea-l">
                  <Spell text="Worth" hidden />
                </span>
                <span className="or-idea-l">
                  <Spell text="remembering." hidden />
                </span>
              </h2>
              <div className="or-marq" aria-label="Clients">
                <div>
                  {[...CLIENTS, ...CLIENTS].map((c, k) => (
                    <span key={k} aria-hidden={k >= CLIENTS.length}>
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 11 ── Contact + footer */}
      <section ref={contactRef} className="or-scene or-s-contact" id="contact" aria-label="Contact">
        <div className="or-contact">
          <div className="or-contact-l">
            <h2 className="or-contact-h" data-rise="">
              Let’s build <img src={IMG("munch-bluepea", true)} alt="" className="or-contact-face" /> something worth remembering.
              <small className="or-contact-sub">You have the vision. We have the craft. The rest is just getting started.</small>
            </h2>
            <div className="or-trust" data-rise="">
              <small>Email</small>
              <a className="or-under or-mail-big" href={"mailto:" + email} data-cursor="nav">
                {email}
              </a>
              <span className="or-contact-meta">
                <span>
                  <small>Web</small>
                  <a className="or-under" href="https://art.ainimight.com" target="_blank" rel="noopener noreferrer" data-cursor="nav">
                    art.ainimight.com
                  </a>
                </span>
                <span>
                  <small>Instagram</small>
                  <a className="or-under" href="https://www.instagram.com/ainimight" target="_blank" rel="noopener noreferrer" data-cursor="nav">
                    @ainimight
                  </a>
                </span>
                <span>
                  <small>Studio</small>
                  <b>Chandigarh, India</b>
                </span>
              </span>
            </div>
            <div className="or-follow" data-rise="">
              <small>Read a case study</small>
              <span className="or-follow-cases">
                {[
                  ["Munchbrew", "munchbrew"],
                  ["Sarrohi", "sarrohi"],
                  ["Impact & Dialogue", "idf"],
                  ["Being Men", "beingmen"],
                  ["Loomi", "loomi"],
                ].map(([l, id]) => (
                  <button key={id} type="button" className="or-chip-s or-rl" data-cursor="nav" onClick={() => openCase(id)}>
                    <Roll>{l}</Roll>
                  </button>
                ))}
              </span>
            </div>
            <button type="button" className="or-sheet-open" data-rise="" onClick={() => setSheet(true)}>
              Start a brief
            </button>
          </div>
          <div className={cx("or-sheet", sheet && "is-open")}>
            <ContactForm email={email} onClose={mode === "stack" ? () => setSheet(false) : undefined} />
          </div>
        </div>
        <div className="or-velo" aria-hidden="true">
          <ScrollVelocity
            scrollContainerRef={mode === "deck" ? (contactRef as React.RefObject<HTMLElement>) : undefined}
            texts={["Illustration · Branding · Animation · Packaging · Publishing · ", "Built for brands that refuse to blend in · Chandigarh · Worldwide · "]}
            velocity={40}
            numCopies={4}
            skewWithVelocity={6}
            parallaxClassName="or-velo-p"
            scrollerClassName="or-velo-s"
          />
        </div>
        <footer className="or-foot">
          <div className="or-foot-big" aria-hidden="true">
            <Mark className="or-foot-m" />
            <div className="or-press">
              <TextPressure text="ainimight" fontFamily="Roboto Flex" flex weight width italic={false} textColor="currentColor" minFontSize={24} />
            </div>
          </div>
          <div className="or-foot-row">
            <address>
              {brand} Studio
              <br />
              Chandigarh, India · Working worldwide
            </address>
            <a className="or-under" href={"mailto:" + email} data-cursor="nav">
              {email}
            </a>
            <a className="or-deck-pill or-rl" href="#work" data-cursor="nav" onClick={nav(IX("work"))}>
              <Roll>See the work</Roll>
            </a>
            <small>© 2026 {brand} Studio</small>
          </div>
        </footer>
      </section>

      {/* overlays */}
      <div className="or-flash" aria-hidden="true">
        <div className="or-flash-in">
          {Array.from({ length: 7 }, (_, k) => (
            <div key={k} className="or-flash-row">
              {"WE MAKE ".repeat(10)}
            </div>
          ))}
        </div>
      </div>
      <div className="or-jump" aria-hidden="true">
        <span className="or-jump-disc" />
        <svg className="or-jump-logo" viewBox="0 0 420 90">
          <image className="or-jump-mark" href={LOGO} x="0" y="4" width="112" height="80" />
          <text x="124" y="70" pathLength={420}>
            {brand.toLowerCase()}
          </text>
        </svg>
      </div>

      <div id="or-menu" className={cx("or-menu", menu && "is-open")} role="dialog" aria-modal="false" aria-label="Menu" aria-hidden={!menu}>
        <div className="or-menu-social">
          <small>Case studies</small>
          {[
            ["Munchbrew", "munchbrew"],
            ["Sarrohi", "sarrohi"],
            ["Impact and Dialogue Foundation", "idf"],
            ["The Being Men Show", "beingmen"],
            ["Loomi", "loomi"],
          ].map(([l, id]) => (
            <a
              key={id}
              href={"#" + id}
              className="or-rl"
              data-cursor="nav"
              tabIndex={menu ? 0 : -1}
              onClick={(e) => {
                e.preventDefault()
                setMenu(false)
                openCase(id)
              }}
            >
              <Roll>{l}</Roll>
            </a>
          ))}
          <small className="or-menu-mail">Get in touch</small>
          <a href={"mailto:" + email} className="or-under" tabIndex={menu ? 0 : -1}>
            {email}
          </a>
        </div>
        <div className="or-menu-prev" aria-hidden="true">
          {MENU.map((m, k) => (
            <span key={m.label} className={cx("or-menu-p", hover === k && "is-on")}>
              {m.panel}
            </span>
          ))}
        </div>
        <nav className="or-menu-links" aria-label="Menu">
          <small>Menu</small>
          {MENU.map((m, k) => (
            <a
              key={m.label}
              href={"#" + SCENES[m.to].id}
              className="or-rl"
              data-cursor="nav"
              tabIndex={menu ? 0 : -1}
              onMouseEnter={() => setHover(k)}
              onFocus={() => setHover(k)}
              onClick={nav(m.to)}
            >
              <Roll>{m.label}</Roll>
            </a>
          ))}
        </nav>
      </div>

      <div className="or-float">
        <a href={"mailto:" + email} className="or-metal or-metal-o" data-cursor="nav" aria-label={"Email " + email}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3 6h18v12H3z M3 7l9 6 9-6" />
          </svg>
        </a>
        <a href="#contact" className="or-metal or-metal-o" data-cursor="nav" aria-label="Chat with the studio" onClick={nav(IX("contact"))}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 5h16v11H9l-5 4z" />
          </svg>
        </a>
        <a href="#contact" className="or-metal or-metal-p" data-cursor="nav" onClick={nav(IX("contact"))}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 6h16v14H4zM4 10h16M8 3v5M16 3v5" />
          </svg>
          Book a call
        </a>
      </div>
      <CaseSheet id={caseId} small={mode === "stack"} onClose={() => setCaseId(null)} onNext={(id) => setCaseId(id)} />

      <span className="or-grain" aria-hidden="true" />
      <span className="or-dot" aria-hidden="true" />
    </div>
  )
}

// ---- the showreel: silk ribbons rendered live at the screen's own resolution ---------------
// Real-time WebGL instead of a video file: on a 4K display it draws 3840 px wide, so the motion
// is never softer than the screen. Colours are Ainimight blue and the Loomi palette.
function mountRibbon(canvas: HTMLCanvasElement, dpr: number) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" })
  renderer.setPixelRatio(dpr)
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 0.95
  renderer.outputColorSpace = THREE.SRGBColorSpace
  const scene = new THREE.Scene()
  const pmrem = new THREE.PMREMGenerator(renderer)
  const env = pmrem.fromScene(new RoomEnvironment(), 0.03).texture
  scene.environment = env
  const camera = new THREE.PerspectiveCamera(30, 16 / 9, 0.1, 100)
  camera.position.set(0, 0, 15)
  const key = new THREE.DirectionalLight(0xffffff, 2.4)
  key.position.set(-5, 7, 9)
  scene.add(key)
  const fill = new THREE.DirectionalLight(0xd8e6ff, 1.1)
  fill.position.set(6, -4, 6)
  scene.add(fill)

  const SEG = 300
  const ACROSS = 8
  type Rib = { mesh: THREE.Mesh; geo: THREE.BufferGeometry; pos: Float32Array; o: { w: number; amp: number; freq: number; spd: number; ph: number; tw: number; y: number; z: number; bend: number; len: number } }
  const ribs: Rib[] = []
  const make = (color: number, sheen: number, o: Rib["o"]) => {
    const geo = new THREE.BufferGeometry()
    const pos = new Float32Array((SEG + 1) * (ACROSS + 1) * 3)
    const idx: number[] = []
    for (let i = 0; i < SEG; i++)
      for (let j = 0; j < ACROSS; j++) {
        const a = i * (ACROSS + 1) + j
        const b = a + ACROSS + 1
        idx.push(a, b, a + 1, b, b + 1, a + 1)
      }
    geo.setIndex(idx)
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3))
    const mat = new THREE.MeshPhysicalMaterial({
      color,
      roughness: 0.32,
      metalness: 0,
      clearcoat: 1,
      clearcoatRoughness: 0.12,
      sheen: 1,
      sheenRoughness: 0.35,
      sheenColor: new THREE.Color(sheen),
      side: THREE.DoubleSide,
      envMapIntensity: 0.85,
    })
    const mesh = new THREE.Mesh(geo, mat)
    scene.add(mesh)
    ribs.push({ mesh, geo, pos, o })
  }
  make(0xa9d68b, 0xe4ffd2, { w: 2.6, amp: 1.7, freq: 1.05, spd: 0.16, ph: 0, tw: 2.3, y: 0.6, z: 0, bend: 0.5, len: 15 })
  make(0x1c4038, 0x7fbf9a, { w: 1.7, amp: 1.25, freq: 1.4, spd: -0.12, ph: 2.1, tw: 3.1, y: -1.5, z: -1.6, bend: 0.35, len: 16 })
  make(0xf1e8d0, 0xffffff, { w: 1.1, amp: 2.1, freq: 0.8, spd: 0.09, ph: 4.2, tw: 1.6, y: -0.2, z: 1.4, bend: 0.25, len: 14 })

  const build = (r: Rib, t: number) => {
    const { o, pos } = r
    let k = 0
    for (let i = 0; i <= SEG; i++) {
      const u = i / SEG
      const x = (u - 0.5) * o.len * 2
      const ph = u * Math.PI * 2 * o.freq + t * o.spd * 6 + o.ph
      const cy = o.y + Math.sin(ph) * o.amp + Math.sin(ph * 0.47 + t * 0.21) * 0.6
      const cz = o.z + Math.cos(ph * 0.83 + t * 0.17) * 1.4
      const th = Math.sin(u * Math.PI * o.tw + t * o.spd * 3 + o.ph) * 1.35 + u * 0.9
      const c = Math.cos(th)
      const sn = Math.sin(th)
      for (let j = 0; j <= ACROSS; j++) {
        const v = (j / ACROSS) * 2 - 1
        const ly = (v * o.w) / 2
        const lz = -o.bend * v * v
        pos[k++] = x
        pos[k++] = cy + ly * c - lz * sn
        pos[k++] = cz + ly * sn + lz * c
      }
    }
    r.geo.attributes.position.needsUpdate = true
    r.geo.computeVertexNormals()
  }
  const ptr = { x: 0, y: 0, cx: 0, cy: 0 }
  const onMove = (e: PointerEvent) => {
    ptr.x = (e.clientX / window.innerWidth) * 2 - 1
    ptr.y = (e.clientY / window.innerHeight) * 2 - 1
  }
  window.addEventListener("pointermove", onMove)
  const resize = () => {
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    if (!w || !h) return
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.fov = w / h < 1 ? 48 : 30
    camera.updateProjectionMatrix()
  }
  const ro = new ResizeObserver(resize)
  ro.observe(canvas)
  resize()
  // adaptive resolution: full device density (4K on a 4K screen), stepping down only if frames run long
  let pr = dpr
  let slow = 0
  let fast = 0
  const render = (ms: number) => {
    const t0 = performance.now()
    const t = ms / 1000
    ribs.forEach((r) => build(r, t))
    ptr.cx += (ptr.x - ptr.cx) * 0.04
    ptr.cy += (ptr.y - ptr.cy) * 0.04
    camera.position.x = ptr.cx * 0.9
    camera.position.y = -ptr.cy * 0.6
    camera.lookAt(0, 0, 0)
    renderer.render(scene, camera)
    const took = performance.now() - t0
    if (took > 24) slow++
    else if (took < 9) fast++
    if (slow > 20 && pr > 0.75) {
      pr = Math.max(0.75, pr - 0.25)
      renderer.setPixelRatio(pr)
      resize()
      slow = fast = 0
    } else if (fast > 240 && pr < dpr) {
      pr = Math.min(dpr, pr + 0.25)
      renderer.setPixelRatio(pr)
      resize()
      slow = fast = 0
    }
  }
  return {
    render,
    dispose: () => {
      ro.disconnect()
      window.removeEventListener("pointermove", onMove)
      ribs.forEach((r) => (r.geo.dispose(), (r.mesh.material as THREE.Material).dispose()))
      env.dispose()
      pmrem.dispose()
      renderer.dispose()
    },
  }
}

// ---- the rope: a lit 3D tube whose knot comes undone with scroll ------------------------
function mountRope(canvas: HTMLCanvasElement, dpr: number) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
  renderer.setPixelRatio(dpr)
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.outputColorSpace = THREE.SRGBColorSpace
  const scene = new THREE.Scene()
  const pmrem = new THREE.PMREMGenerator(renderer)
  const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
  scene.environment = env
  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100)
  camera.position.set(0, 0.4, 15)
  camera.lookAt(0, 0, 0)
  const key = new THREE.DirectionalLight(0xfff2e6, 2.2)
  key.position.set(-4, 6, 8)
  // a soft contact shadow on the squircle's back wall is what sells the rope as an object
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  key.castShadow = true
  key.shadow.mapSize.set(dpr > 1 ? 2048 : 1024, dpr > 1 ? 2048 : 1024)
  Object.assign(key.shadow.camera, { left: -12, right: 12, top: 5, bottom: -5, near: 1, far: 30 })
  key.shadow.radius = 6
  key.shadow.bias = -0.0005
  scene.add(key)
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(60, 20), new THREE.ShadowMaterial({ color: 0x1f3354, opacity: 0.16 }))
  wall.position.z = -0.75
  wall.receiveShadow = true
  scene.add(wall)
  const rim = new THREE.DirectionalLight(0xc8c2ff, 1.6)
  rim.position.set(6, -2, -4)
  scene.add(rim)

  // Twisted-strand normal map, drawn once: diagonal grooves that repeat along the rope.
  const tc = document.createElement("canvas")
  tc.width = 128
  tc.height = 64
  const g = tc.getContext("2d")!
  const img = g.createImageData(128, 64)
  for (let y = 0; y < 64; y++)
    for (let x = 0; x < 128; x++) {
      const ph = ((x + y * 2) / 32) * Math.PI * 2
      const fine = Math.sin(((x * 3 - y) / 9) * Math.PI) * 0.18
      const nx = Math.cos(ph) * 0.55 + fine
      const ny = Math.cos(ph) * 0.35
      const o = (y * 128 + x) * 4
      img.data[o] = 128 + nx * 127
      img.data[o + 1] = 128 + ny * 127
      img.data[o + 2] = 235
      img.data[o + 3] = 255
    }
  g.putImageData(img, 0, 0)
  const normal = new THREE.CanvasTexture(tc)
  normal.wrapS = normal.wrapT = THREE.RepeatWrapping
  normal.repeat.set(70, 1)
  const mat = new THREE.MeshPhysicalMaterial({
    color: 0xb1da96,
    roughness: 0.58,
    sheen: 1,
    sheenRoughness: 0.45,
    sheenColor: new THREE.Color(0xffffff),
    normalMap: normal,
    normalScale: new THREE.Vector2(0.9, 0.9),
    envMapIntensity: 0.9,
  })
  const mesh = new THREE.Mesh(new THREE.BufferGeometry(), mat)
  mesh.castShadow = true
  scene.add(mesh)

  // An overhand knot: an opened trefoil, with tails running out to both sides.
  const knot: THREE.Vector3[] = []
  const M = 56
  for (let k = 0; k <= M; k++) {
    const t = Math.PI + 0.42 + (k / M) * (2 * Math.PI - 0.84)
    knot.push(new THREE.Vector3(Math.sin(t) + 2 * Math.sin(2 * t), Math.cos(t) - 2 * Math.cos(2 * t) + 1.2, -Math.sin(3 * t) * 1.1).multiplyScalar(0.42))
  }
  let L = 9
  const base = (span: number) => {
    const a = knot[0].clone()
    const b = knot[knot.length - 1].clone()
    const left = [new THREE.Vector3(-span, -0.35, 0.5), new THREE.Vector3(-span * 0.55, -0.25, 0.45), new THREE.Vector3(-1.6, b.y - 0.1, 0.4)]
    const right = [new THREE.Vector3(1.6, a.y - 0.1, -0.4), new THREE.Vector3(span * 0.55, -0.25, -0.45), new THREE.Vector3(span, -0.35, -0.5)]
    // the right tail leaves from the knot's first point, the left tail enters at its last
    const pts = [...left, ...[...knot].reverse(), ...right]
    const lens = [0]
    for (let k = 1; k < pts.length; k++) lens.push(lens[k - 1] + pts[k].distanceTo(pts[k - 1]))
    const total = lens[lens.length - 1]
    const straight = pts.map((_, k) => new THREE.Vector3(-span + (2 * span * lens[k]) / total, -0.3, 0))
    return { pts, straight, s: lens.map((l) => l / total) }
  }
  let shape = base(L)
  let p = -1
  const build = (v: number) => {
    const pts = shape.pts.map((a, k) => {
      const s = shape.s[k]
      const mid = 1 - Math.abs(2 * s - 1)
      const local = Math.min(1, Math.max(0, (v - mid * 0.35) / 0.65))
      const e = local * local * (3 - 2 * local)
      const o = a.clone().lerp(shape.straight[k], e)
      o.z += Math.sin(Math.PI * e) * 0.9 * mid
      return o
    })
    const geo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, false, "centripetal"), dpr > 1 ? 420 : 240, 0.17, dpr > 1 ? 22 : 14, false)
    mesh.geometry.dispose()
    mesh.geometry = geo
  }
  const render = () => renderer.render(scene, camera)
  const resize = () => {
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    if (!w || !h) return
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    const halfW = Math.tan((camera.fov * Math.PI) / 360) * camera.position.z * camera.aspect
    const span = halfW * 1.15
    if (Math.abs(span - L) > 0.05) {
      L = span
      shape = base(L)
      want = Math.max(0, p)
      p = -1
      flush()
    } else render()
  }
  // scroll can report several values a frame; rebuild the tube at most once per frame
  let want = 0
  let raf = 0
  const flush = () => {
    raf = 0
    if (Math.abs(want - p) < 0.002) return
    p = want
    mesh.rotation.y = -0.25 + p * 0.25
    build(p)
    render()
  }
  const set = (v: number) => {
    want = v
    if (!raf) raf = requestAnimationFrame(flush)
  }
  // Bake the whole un-knotting into a frame sequence: render each state once, keep only
  // the horizontal band the rope lives in, then the GL canvas can sit idle while scroll scrubs bitmaps.
  // shortcut: frames are baked for the frame's aspect at bake time and only rescaled after a resize.
  const bake = async (n: number) => {
    const cw = canvas.width
    const ch = canvas.height
    const band = [0.16, 0.84]
    const sy = Math.round(ch * band[0])
    const sh = Math.round(ch * (band[1] - band[0]))
    const k = Math.min(1, 2880 / cw)
    const frames: Blob[] = []
    const tmp = document.createElement("canvas")
    tmp.width = Math.round(cw * k)
    tmp.height = Math.round(sh * k)
    const tg = tmp.getContext("2d")!
    for (let f = 0; f < n; f++) {
      const v = f / (n - 1)
      mesh.rotation.y = -0.25 + v * 0.25
      build(v)
      render()
      // createImageBitmap snapshots the drawing buffer synchronously, before it can be cleared
      const bm = await createImageBitmap(canvas, 0, sy, cw, sh, { resizeWidth: tmp.width, resizeHeight: tmp.height, resizeQuality: "high" })
      tg.clearRect(0, 0, tmp.width, tmp.height)
      tg.drawImage(bm, 0, 0)
      bm.close()
      // ~60 KB of WebP per frame instead of ~3 MB of raw bitmap; decoded on demand while scrubbing
      frames.push(await new Promise<Blob>((r, j) => tmp.toBlob((b) => (b ? r(b) : j(new Error("toBlob"))), "image/webp", 0.94)))
      if (f % 2) await new Promise((r) => requestAnimationFrame(r))
    }
    p = -1
    return { frames, band }
  }
  resize()
  want = 0
  flush()
  return {
    set,
    bake,
    resize,
    dispose: () => {
      cancelAnimationFrame(raf)
      wall.geometry.dispose()
      ;(wall.material as THREE.Material).dispose()
      mesh.geometry.dispose()
      mat.dispose()
      normal.dispose()
      env.dispose()
      pmrem.dispose()
      renderer.dispose()
    },
  }
}

// R is the zoom unit: N R → calc(N * var(--r)). The deck sets --r so a 90 x 56.25 R
// composition fills any frame (the layout zooms, never reflows); the stack sets it
// from the width.
const rr = (s: string) => s.replace(/(-?\d*\.?\d+)R\b/g, "calc($1*var(--r))")

const CSS = rr(`
.or-root{--or-paper:#ffffff;--or-warm:#f4efe2;--or-mint:#ebf4e1;--or-lilac:#b1da96;--or-lilac-soft:#eef4e6;--or-brand:#b1da96;--or-brand-deep:#1c4038;--or-cream:#eae1c9;--or-blush:#b1da96;--or-ink:#0e1f1a;--or-mute:#7d8a84;--or-line:#e3e6df;--or-night:#10291f;--or-hi:#ffffff;--or-blush-soft:#fbf0ec;
  --r:min(calc(100cqw / 90),calc(100cqh / 56.25));
  position:relative;width:100%;height:var(--h);overflow:hidden;container-type:size;isolation:isolate;
  background:var(--or-paper);color:var(--or-ink);font-family:"Inter Tight",ui-sans-serif,system-ui,sans-serif;letter-spacing:-.02em;-webkit-font-smoothing:antialiased;cursor:auto}
.or-root.or-dark{--or-paper:#101012;--or-warm:#17161a;--or-mint:#10211d;--or-lilac:#2a2442;--or-lilac-soft:#1c1926;--or-ink:#f2f0ec;--or-mute:#8f8d96;--or-line:#2a2a2f;--or-hi:#b9a9ff;--or-blush-soft:#1c1617}
.or-root.or-stack{height:auto;overflow:visible;overflow-x:clip;container-type:normal;--r:min(calc(100vw / 24.375),17px)}
.or-root *,.or-root *::before,.or-root *::after{box-sizing:border-box}
.or-root img,.or-root video,.or-root canvas{max-width:none;display:block}
.or-root a{color:inherit;text-decoration:none}
:where(.or-root) button{font:inherit;color:inherit;background:none;border:0;padding:0;cursor:pointer}
.or-root :focus-visible{outline:2px solid #7c8cff;outline-offset:3px;border-radius:6px}
.or-probe{position:absolute;width:1R;height:0;visibility:hidden}
.or-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
.or-spell .or-w{display:inline-block;white-space:nowrap}
.or-spell .or-l{display:inline-block}
.or-vid{width:100%;height:100%;object-fit:cover}

/* rolling text */
.or-roll{position:relative;display:inline-flex;overflow:hidden;vertical-align:top;padding-bottom:.08em}
.or-roll-s{opacity:0}
.or-roll-t{position:absolute;inset:0}
.or-roll-t>span{position:absolute;left:0;top:0;white-space:nowrap;transform-origin:0 100%;transition:transform .5s cubic-bezier(.3,.7,.2,1)}
.or-roll-t>span:last-child{transform:translateY(105%) rotate(8deg)}
.or-rl:hover .or-roll-t>span:first-child,.or-rl:focus-visible .or-roll-t>span:first-child{transform:translateY(-110%) rotate(-8deg)}
.or-rl:hover .or-roll-t>span:last-child,.or-rl:focus-visible .or-roll-t>span:last-child{transform:none}

/* header */
.or-header{position:absolute;z-index:40;top:0;left:0;right:0;display:flex;align-items:center;justify-content:space-between;padding:2.6R 3.1R .8R;--hc:var(--or-ink);color:var(--hc);transition:color .3s;pointer-events:none}
.or-header[data-tone=dark]{--hc:#ffffff}
.or-header>*{pointer-events:auto}
.or-logo{display:flex;align-items:center;gap:.55R;font-weight:700;font-size:2R;letter-spacing:-.06em}
.or-logo-m{width:2.7R;height:1.95R}
.or-nav{display:flex;gap:2.8R;font-size:1.1R;position:absolute;left:50%;transform:translateX(-50%)}
.or-head-r{display:flex;align-items:center;gap:1.6R}
.or-talk{display:inline-flex;align-items:center;gap:.5R;border:.12R solid var(--hc);border-radius:2R;padding:.55R 1.05R;font-size:.95R;font-weight:500;transition:border-color .3s}
.or-talk i{width:.42R;height:.42R;border-radius:50%;background:#7fd858;box-shadow:0 0 0 .2R rgb(127 216 88 / .2)}
.or-burger{display:inline-flex;align-items:center;gap:.7R;font-size:1.05R;font-weight:500}
.or-burger-t{display:inline-flex;flex-direction:column;height:1.3R;overflow:hidden;line-height:1.3R}
.or-burger-t>span{transition:transform .3s ease}
.or-burger.is-open .or-burger-t>span{transform:translateY(-100%)}
.or-burger-l{position:relative;width:1.95R;height:.9R}
.or-burger-l i{position:absolute;left:0;right:0;height:.13R;background:currentColor;top:.15R;transition:transform .3s ease,width .3s}
.or-burger-l i+i{top:.6R}
.or-burger.is-open .or-burger-l i{transform:translateY(.22R) rotate(45deg)}
.or-burger.is-open .or-burger-l i+i{transform:translateY(-.23R) rotate(-45deg)}
.or-menu-open .or-header{--hc:#0b0b0c;color:#0b0b0c}

/* scenes */
.or-scene{position:absolute;inset:0;overflow-y:auto;overflow-x:hidden;scrollbar-width:none;overscroll-behavior:contain;background:var(--or-paper)}
.or-scene::-webkit-scrollbar{display:none}
.or-stack .or-scene{position:relative;inset:auto;overflow:visible;overflow-x:clip}
.or-track{position:relative}
.or-stage{position:sticky;top:0;height:var(--h);overflow:hidden}

/* 0 home */
.or-home{position:relative;min-height:calc(var(--h) - 13R);padding:15R 9.375R 0}
.or-hero{font-family:"Bricolage Grotesque","Inter Tight",sans-serif;font-weight:500;font-size:3.45R;line-height:1.14;letter-spacing:-.035em;max-width:58R;margin:0;font-variation-settings:"opsz" 60}
.or-home-meta{display:flex;align-items:flex-start;gap:4R;margin-top:2.4R}
.or-rate{display:inline-flex;align-items:center;gap:.7R}
.or-rate-m{width:3.3R;height:2.4R;color:var(--or-brand-deep)}
.or-rate>span{display:flex;flex-direction:column;gap:.15R}
.or-rate small{font-size:.85R;color:var(--or-ink)}
.or-stars{display:inline-flex;gap:.1R}
.or-stars svg{width:.95R;height:.95R;fill:#f2c84b}
.or-services{margin:0;max-width:24R;font-size:1R;line-height:1.3;color:var(--or-mute);text-transform:uppercase;letter-spacing:-.01em}
.or-deck-pill{margin-left:auto;align-self:center;display:inline-flex;background:var(--or-line);border-radius:3R;padding:.55R 1.1R;font-size:1.05R;letter-spacing:-.03em;transition:opacity .3s}
.or-deck-pill:hover{opacity:.8}
.or-eye-wrap{position:absolute;right:9.375R;top:13R;width:10.5R;height:10.5R}
.or-eye{width:100%;height:100%;overflow:visible}
.or-eye-ring{transform-origin:70px 70px;animation:or-spin 12s linear infinite}
.or-eye-ring text{font:700 10.6px "Inter Tight",sans-serif;letter-spacing:.14em;fill:#1c4038}
.or-lash path{stroke:#17171a;stroke-width:2.2;stroke-linecap:round;fill:none;transition:opacity .3s}
.or-lid{fill:#ffeeee;transition:transform .5s ease}
.or-lid-t{transform-origin:70px 42px;transform:scaleY(0)}
.or-lid-b{transform-origin:70px 98px;transform:scaleY(0)}
.or-eye.is-asleep .or-lid{transform:scaleY(1)}
.or-eye.is-asleep .or-lash{opacity:.25}
@keyframes or-spin{to{transform:rotate(360deg)}}
.or-reel-track{position:relative;height:calc(var(--h) * 1.5)}
.or-reel{position:sticky;top:0;height:var(--h)}
.or-reel-mask{position:absolute;inset:0;clip-path:inset(0px 9.375R 16R 9.375R round 1.6R)}
.or-reel-in{position:absolute;inset:0;background:#c7d3e6}
.or-reel-cap{position:absolute;left:11R;bottom:20R;color:#fff;font-size:1R;opacity:.9}
.or-play{position:absolute;left:50%;top:calc(var(--h) / 2 - 8R);width:5.4R;height:5.4R;margin-left:-2.7R;border-radius:50%;background:#fff;display:grid;place-items:center}
.or-play i{width:0;height:0;border-left:.75R solid #000;border-top:.45R solid transparent;border-bottom:.45R solid transparent;margin-left:.2R}
.or-play.is-paused i{border-left-color:#000}
.or-play:not(.is-paused) i{width:.75R;height:.95R;border:0;border-left:.25R solid #000;border-right:.25R solid #000;margin:0}

/* 1 about */
.or-about-row{position:absolute;left:0;top:8.6R;bottom:1.4R;display:flex;gap:1.5R;padding-left:9.375R;padding-right:4R;will-change:transform}
.or-about-row::after{content:"";flex:none;width:5.5R}
.or-about-h{flex:none;width:30R;align-self:center;font-size:5.1R;font-weight:500;line-height:1.05;letter-spacing:-.05em;margin:0 0 6R}
.or-card{flex:none;position:relative;width:67.4R;height:100%;border-radius:3R;padding:4R 5R;display:flex;flex-direction:column;justify-content:flex-end;overflow:hidden}
.or-card-rings{position:absolute;inset:-6R auto auto -4R;width:52R;height:52R;fill:none;stroke:#d0cfd4;stroke-width:1;opacity:.75;pointer-events:none}
.or-dark .or-card-rings{stroke:#3a3a42}
.or-card-pill{position:absolute;top:2R;left:2R;width:32R;height:15R;border-radius:13.5R;overflow:hidden;background:#e9e3f2}
.or-card-pill video{transform:scale(1.1)}
.or-card h3{position:relative;font-size:4.1R;line-height:1.06;font-weight:500;letter-spacing:-.05em;margin:0 0 1.4R;max-width:50R}
.or-card p{position:relative;font-size:1.12R;line-height:1.42;color:#6e6d74;max-width:40R;margin:0}
.or-num{position:absolute;right:4.4R;bottom:2.8R;font-size:5.6R;font-weight:500;color:transparent;-webkit-text-stroke:1px #c9c7cc;letter-spacing:-.04em}

/* 2 make */
.or-s-make,.or-make{background:var(--or-warm)}
.or-make-track{height:calc(var(--h) * 5)}
.or-make-light{position:absolute;inset:0;background:var(--or-paper);opacity:0}
.or-grid{position:absolute;inset:0;background-image:linear-gradient(var(--or-line) 1px,transparent 1px),linear-gradient(90deg,var(--or-line) 1px,transparent 1px);background-size:5.6R 5.6R;background-position:center}
.or-grid::after{content:"";position:absolute;left:0;right:0;top:50%;border-top:1px dashed #b9b6bd}
.or-make-word{position:absolute;left:9.375R;top:50%;margin:-4.5R 0 0;font-size:7.5R;font-weight:700;letter-spacing:-.05em;text-transform:uppercase;transform-origin:0 50%;white-space:nowrap}
.or-make-media{position:absolute;inset:0;clip-path:inset(0px 0px 0px 100%);z-index:3}
.or-mock{position:absolute;left:50%;top:calc((var(--h) - 38R) / 2 + .5R);width:66R;height:38R;transform:translateX(-50%);border-radius:2.25R;background:#141416;overflow:hidden;opacity:0;visibility:hidden;color:#f4f3f6;z-index:2;box-shadow:0 2R 5R rgb(20 20 30 / .18)}
.or-mock-in{position:absolute;left:50%;top:0;width:66R;height:38R;margin-left:-33R}
.or-mock-in small{color:#8d8c96;font-size:.72R}
.or-m-top{position:absolute;left:1.5R;right:1.5R;top:1.2R;height:2.6R;display:flex;align-items:center;gap:1.4R;font-size:.82R}
.or-m-logo{width:1.9R;height:1.4R;color:#fff}
.or-m-tab{color:#8d8c96}
.or-m-tab.is-on{color:#fff;background:#26262b;padding:.35R .8R;border-radius:1R}
.or-m-search{margin-left:auto;background:#1f1f23;color:#76757e;border-radius:1R;padding:.4R 4R .4R 1R}
.or-m-faces{display:flex}
.or-m-faces img{width:1.8R;height:1.8R;border-radius:50%;border:.15R solid #141416;margin-left:-.5R;object-fit:cover}
.or-m-new{background:#5a6cff;border-radius:1R;padding:.45R .9R;font-weight:600}
.or-m-side{position:absolute;left:1.5R;top:5.5R;display:flex;flex-direction:column;gap:1R}
.or-m-side i{width:2.4R;height:2.4R;border-radius:.8R;background:#1f1f23}
.or-m-side i.is-on{background:#5a6cff}
.or-m-stats{position:absolute;left:5.5R;right:1.5R;top:5.5R;height:6R;display:grid;grid-template-columns:repeat(3,1fr);gap:1R}
.or-m-stat{position:relative;background:#1c1c20;border-radius:1.2R;padding:1R 1.2R;display:flex;flex-direction:column;justify-content:space-between}
.or-m-stat b{font-size:2R;letter-spacing:-.04em}
.or-m-stat span{position:absolute;right:1.2R;bottom:1.1R;width:5R;height:.4R;border-radius:1R}
.or-m-title{position:absolute;left:5.5R;top:12.6R;display:flex;flex-direction:column}
.or-m-title b{font-size:2.6R;letter-spacing:-.05em;line-height:1.1}
.or-m-col{position:absolute;top:17.5R;bottom:1.2R;background:#1a1a1e;border-radius:1.4R;padding:1R;display:flex;flex-direction:column;gap:.8R}
.or-m-col0{left:5.5R;width:16R}
.or-m-col1{left:22.5R;width:21R}
.or-m-col2{left:44.5R;width:16R}
.or-m-colh{display:flex;align-items:center;gap:.5R;font-size:.85R;font-weight:600}
.or-m-colh i{width:.5R;height:.5R;border-radius:50%}
.or-m-card{background:#232328;border-radius:1R;padding:.9R 1R;display:flex;flex-direction:column;gap:.35R;font-size:.9R}
.or-m-card-big{flex:1;position:relative}
.or-m-bar{height:.3R;background:#2f2f35;border-radius:1R;overflow:hidden;margin-top:.3R}
.or-m-bar span{display:block;height:100%}
.or-slot{position:absolute;left:1R;right:1R;bottom:1R;height:10.5R;border-radius:1R;overflow:hidden}
.or-skel{position:absolute;inset:0;background:#141416}
.or-skel i{position:absolute;border-radius:1R;background:linear-gradient(90deg,#1f1f23,#2a2a2f,#1f1f23);background-size:200% 100%;animation:or-shim 1.4s linear infinite}
@keyframes or-shim{to{background-position:-200% 0}}
.or-notch{position:absolute;left:50%;top:.7R;width:6R;height:1.3R;margin-left:-3R;border-radius:1R;background:#000;opacity:0}
.or-cur{position:absolute;left:50%;top:calc(var(--h) / 2);z-index:4;display:flex;align-items:flex-start;gap:.1R;opacity:0;pointer-events:none}
.or-cur svg{width:1.3R;height:1.45R;fill:var(--c);stroke:#fff;stroke-width:1.2}
.or-cur b{margin-top:1.1R;background:var(--c);color:#fff;font-size:.72R;font-weight:600;padding:.15R .5R;border-radius:.5R}
.or-tag{position:absolute;left:50%;top:calc((var(--h) - 38R) / 2 + 39.7R);width:23.6R;height:4.4R;margin-left:-11.8R;border-radius:2.2R;background:#fff;color:#0b0b0c;box-shadow:0 1R 3R rgb(0 0 0 / .08);overflow:hidden;opacity:0;transform:scale(.5);z-index:5}
.or-tag-l{position:absolute;inset:0;display:grid;place-items:center;font-size:1.1R;font-weight:500;text-transform:uppercase;letter-spacing:-.01em;opacity:0}

/* 3 people */
.or-s-people,.or-people{background:var(--or-lilac)}
.or-people-track{height:calc(var(--h) * 4.5)}
.or-people-h{position:absolute;inset:0;margin:0;display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:6R;line-height:8.2R;font-weight:700;letter-spacing:-.045em;text-transform:uppercase;text-align:center;z-index:2}
.or-pl{display:flex;align-items:center;white-space:nowrap}
.or-hi{color:var(--or-hi)}
.or-gap{position:relative;display:inline-flex;align-items:center;justify-content:center;height:6.4R;margin:0 .3em;width:0;overflow:visible}
.or-ava{position:absolute;left:0;top:50%;transform:translateY(-50%);display:flex;align-items:center;padding:.4R;border-radius:4R;background:rgb(255 255 255 / .9);opacity:0}
.or-ava>*{width:4.6R;height:4.6R;border-radius:50%;object-fit:cover;margin-left:-.8R;border:.2R solid #fff;flex:none;transform:scale(0)}
.or-ava>*:first-child{margin-left:0}
.or-ava b{display:grid;place-items:center;background:#17171a;color:#fff;font-size:1.3R;letter-spacing:0}
.or-gap-word{position:absolute;left:50%;top:50%;translate:-50% -50%;white-space:nowrap;opacity:0}
.or-flies{position:absolute;inset:0;z-index:1;pointer-events:none;-webkit-mask-image:linear-gradient(transparent 3R,#000 10R);mask-image:linear-gradient(transparent 3R,#000 10R)}
.or-fly{position:absolute;transform:translateY(calc(var(--h) * 1.2));width:24R;height:17R;object-fit:cover;border-radius:1.9R;box-shadow:0 2R 4R rgb(40 20 80 / .15);z-index:1}
.or-fly0{left:10R;top:10R}
.or-fly1{right:9R;top:4R;width:20R;height:24R}
.or-fly2{left:44R;top:22R;width:18R;height:14R}
.or-swallow{position:absolute;left:calc(100% - 4R);top:50%;width:calc(var(--h) * 4.6);height:calc(var(--h) * 4.6);margin:calc(var(--h) * -2.3) 0 0 calc(var(--h) * -2.3);border-radius:50%;background:var(--or-night);transform:scale(0);z-index:3}

/* 4 quote */
.or-s-quote,.or-quote,.or-s-work,.or-work,.or-s-rope,.or-rope{background:var(--or-night);color:#fff}
.or-quote-track{height:calc(var(--h) * 2.6)}
.or-qmark{position:absolute;left:8R;top:7R;font-family:"Bricolage Grotesque",serif;font-size:16R;line-height:1;color:#5f5f62}
.or-q{position:absolute;left:12R;top:15.5R;width:44R;margin:0;font-size:4.5R;line-height:1.14;letter-spacing:-.04em;color:#57575b}
.or-q .or-l{transition:color .25s}
.or-q .or-l.is-lit{color:#fff}
.or-ring-c{position:absolute;right:-6R;width:28.75R;height:28.75R;border-radius:50%;background:#16362c}
.or-ring-c0{top:-14R}
.or-ring-c1{top:14R}
.or-ring-c2{top:42R}
.or-qbar{position:absolute;right:12R;top:20R;width:.25R;height:15.6R;background:#3c3c40;border-radius:1R;overflow:hidden}
.or-qbar i{position:absolute;inset:0;background:#fff;transform-origin:top;transform:scaleY(0)}
.or-qcap{position:absolute;right:5.5R;bottom:6R;width:20R;margin:0;font-size:.95R;line-height:1.35;color:#8b8a90;text-align:right}

/* 5 work */
.or-work-track{height:calc(var(--h) * 3)}
.or-work-k{position:absolute;left:9.375R;top:9R;margin:0;font-size:1R;color:#8b8a90}
.or-car-wrap{position:absolute;inset:0}
.or-car{position:absolute;inset:0;touch-action:pan-y;user-select:none}
.or-car-ring{position:absolute;left:50%;top:calc(var(--h) / 2 - 1R);width:0;height:0}
.or-car-card{position:absolute;left:-18.8R;top:-12.7R;width:37.6R;height:25.4R;margin:0;border-radius:1.4R;overflow:hidden;cursor:grab;transform:translateX(calc(var(--d) * 42R)) scale(calc(1 - min(1, max(var(--d), -1 * var(--d))) * .12));transition:transform .8s cubic-bezier(.6,0,.2,1),opacity .5s}
.or-car-card img{width:100%;height:100%;object-fit:cover;pointer-events:none}
.or-car-card::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgb(27 26 26 / 0) 40%,#1b1a1a)}
.or-car-meta{position:absolute;left:1.4R;right:1.4R;top:1.2R;display:flex;justify-content:space-between;z-index:1}
.or-car-meta span{border:1px solid rgb(255 255 255 / .55);border-radius:2R;padding:.3R .8R;font-size:.8R;backdrop-filter:blur(6px)}
.or-car-title{position:absolute;left:calc(50% - 21.8R);top:calc(var(--h) / 2 + 6.8R);margin:0;font-family:"Bricolage Grotesque",sans-serif;font-size:4.4R;line-height:1;font-weight:600;letter-spacing:-.04em;text-transform:uppercase;pointer-events:none;z-index:2}
.or-car-title .or-l{animation:or-up .5s cubic-bezier(.2,.7,.2,1) both;animation-delay:calc(var(--i) * 30ms)}
.or-car-foot{position:absolute;left:9.375R;bottom:3.4R;display:flex;align-items:center;gap:1.4R}
.or-car-bars{display:flex;gap:.4R}
.or-car-bars span{width:1.25R;height:.19R;background:#4a4a4f;border-radius:1R;transition:width .5s ease,background .5s}
.or-car-bars span.is-on{width:4.2R;background:#fff}
.or-car-count{white-space:nowrap;font-family:"Bricolage Grotesque",sans-serif;font-weight:600;font-size:1.1R}
.or-car-btn{width:3.4R;height:3.4R;border-radius:50%;border:1px solid #4a4a4f;font-size:1.2R;transition:border-color .3s}
.or-car-btn:hover{border-color:#fff}
.or-hand{position:absolute;right:6R;bottom:5R;width:9R;height:9R;border-radius:50%;overflow:hidden;border:.12R solid #fff}
.or-work-lift{position:absolute;inset:0}
.or-thread{position:absolute;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none}
.or-thread path{fill:none;stroke:#fff;stroke-width:2.2;stroke-dasharray:1;stroke-dashoffset:1}
.or-slit{position:absolute;inset:0;background:var(--or-paper);transform:scaleX(0) scaleY(0);transform-origin:50% 0}
@keyframes or-up{from{transform:translateY(70%);opacity:0}}

/* 6 proof */
.or-proof-track{height:calc(var(--h) * 3)}
.or-bubbles{position:absolute;inset:0;width:100%;height:100%}
.or-blob{position:absolute;left:-12R;top:-12R;width:24R;height:24R;border-radius:50%;pointer-events:none;background:radial-gradient(circle,#cfe9bd 0 30%,#b1da96 45%,rgb(177 218 150 / 0) 70%);opacity:.75;filter:blur(1.5R)}
.or-dark .or-blob{opacity:.25}
.or-cube-wrap{position:absolute;inset:0;perspective:50R;display:grid;place-items:center}
.or-cube{position:relative;width:40R;height:38R;transform-style:preserve-3d;margin-top:3R;translate:0 0 -20R}
.or-face{position:absolute;inset:0;margin:0;padding:0;list-style:none;display:flex;flex-direction:column;justify-content:center;backface-visibility:hidden;text-transform:uppercase;font-weight:800;letter-spacing:-.03em;background:var(--or-paper)}
.or-face-a{transform:translateZ(20R);font-size:2.42R;line-height:1.06;gap:.04R;white-space:nowrap}
.or-face-a em{font-style:normal;color:#2f7d5e}
.or-face-a .is-hi{color:#2f7d5e}
.or-face-b{transform:rotateY(90deg) translateZ(20R);font-size:3.9R;line-height:1.04}
.or-face-b li:first-child{color:#2f7d5e}
.or-face-b a:hover{color:#1c4038}

/* 7 rope */
.or-rope-track{height:calc(var(--h) * 4)}
.or-rope-fill{position:absolute;inset:0;background:#10291f;opacity:0}
.or-rope-bg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
.or-rope-bg path{fill:none;stroke:#47474c;stroke-width:1.4;stroke-dasharray:1;stroke-dashoffset:1}
.or-dark .or-rope-fill{background:#2c2638}
.or-rope-line{position:absolute;left:50%;top:15.5R;width:42R;margin:0 0 0 -21R;text-align:center;font-size:2.5R;line-height:1.2;letter-spacing:-.04em;z-index:2}
.or-squircle{position:absolute;left:50%;top:calc(50% + 4R);width:28R;height:19R;translate:-50% -50%;border-radius:7R;overflow:hidden;z-index:3;background:radial-gradient(120% 90% at 50% 35%,#3f6b5c,#1c4038 55%,#10291f)}
.or-dark .or-squircle{background:radial-gradient(120% 90% at 50% 40%,#3a3350,#2a2440)}
.or-rope-c,.or-rope-seq{position:absolute;left:50%;top:50%;width:100cqw;height:var(--h);translate:-50% -50%}
.or-rope-seq{display:none}
.or-seq-on .or-rope-seq{display:block}
.or-seq-on .or-rope-c{visibility:hidden}
.or-idea{position:absolute;left:0;right:0;top:50%;margin:-8.4R 0 0;display:flex;flex-direction:column;align-items:center;text-align:center;font-size:7R;line-height:1.08;font-weight:300;letter-spacing:-.04em;color:#fff;text-transform:uppercase;text-shadow:0 .5R 3R rgb(60 40 120 / .25)}
.or-idea .or-l{opacity:0}
.or-marq{position:absolute;left:0;right:0;bottom:3R;overflow:hidden;opacity:0;color:rgb(255 255 255 / .72);mask-image:linear-gradient(90deg,transparent,#000 15%,#000 85%,transparent)}
.or-marq>div{display:flex;gap:4R;width:max-content;animation:or-marq 40s linear infinite}
.or-marq span{font-size:1.3R;font-weight:700;letter-spacing:-.03em;white-space:nowrap}
.or-marq span:nth-child(3n){font-family:"Bricolage Grotesque",serif;font-weight:500;font-style:italic}
@keyframes or-marq{to{transform:translateX(-50%)}}

/* 8 contact */
.or-contact{display:grid;grid-template-columns:33R 1fr;gap:3R;padding:15R 9.375R 6R}
.or-contact-h{margin:0;font-size:2.6R;line-height:1.2;font-weight:500;letter-spacing:-.04em}
.or-contact-h .or-contact-face{display:inline-block;width:3.2R;height:3.2R;border-radius:50%;object-fit:cover;vertical-align:middle;background:#f2c84b}
.or-trust,.or-follow{margin-top:3R;display:flex;flex-direction:column;gap:.9R}
.or-trust>small,.or-follow>small{font-size:1R;color:var(--or-mute)}
.or-follow>span{display:flex;gap:.6R}
.or-social{width:3R;height:3R;border-radius:50%;border:1px solid var(--or-line);display:grid;place-items:center;font-size:.8R;font-weight:600;transition:border-color .4s}
.or-social:hover{border-color:#bcbcbc}
.or-sheet-open{display:none}
.or-sheet-x{display:none}
.or-form{display:flex;flex-direction:column;gap:2.2R}
.or-form-row{display:grid;grid-template-columns:1fr 1fr;gap:3R}
.or-field{display:flex;flex-direction:column;gap:.7R;font-size:.95R;font-weight:500}
.or-field input,.or-field textarea{font:inherit;font-weight:400;font-size:1.05R;color:inherit;background:none;border:0;border-bottom:1px solid var(--or-line);padding:.6R 0;outline:none;resize:none;transition:border-color .4s}
.or-field input:focus,.or-field textarea:focus{border-color:var(--or-ink)}
.or-field input::placeholder,.or-field textarea::placeholder{color:#a3a2a8}
.or-chips{border:0;margin:0;padding:0;display:flex;flex-wrap:wrap;gap:.9R}
.or-chips legend{font-size:.95R;font-weight:500;margin-bottom:1R;padding:0}
.or-chip{position:relative;display:inline-flex;border:1.5px solid var(--or-line);border-radius:3.75R;padding:.9R 1.7R;font-size:.95R;cursor:pointer;transition:border-color .3s,background .3s}
.or-chip:hover{border-color:#bcbcbc}
.or-chip.is-on{border-color:var(--or-ink);background:var(--or-ink);color:var(--or-paper)}
.or-chip input{position:absolute;opacity:0;pointer-events:none}
.or-chip:has(input:focus-visible){outline:2px solid #7c8cff;outline-offset:3px}
.or-submit-row{display:flex;align-items:center;gap:2R;margin-top:.6R}
.or-pulse{position:relative;display:inline-flex}
.or-pulse i{position:absolute;inset:0;border-radius:6R;border:1px solid #bcbcbc;opacity:0}
.or-pulse:hover i{animation:or-wave 1.5s ease infinite}
.or-pulse i:nth-child(2){animation-delay:.375s}
.or-pulse i:nth-child(3){animation-delay:.75s}
.or-pulse i:nth-child(4){animation-delay:1.125s}
.or-pulse::after{content:"";position:absolute;inset:0;border-radius:6R;border:1px solid #bcbcbc;animation:or-wave 3s ease infinite;pointer-events:none}
@keyframes or-wave{0%{opacity:.9;transform:scale(1)}100%{opacity:0;transform:scale(1.15,1.4)}}
.or-submit{position:relative;background:var(--or-ink)!important;color:var(--or-paper)!important;border-radius:6R!important;padding:1.6R 3.4R!important;font-size:1.15R!important;font-weight:500}
.or-submit span{display:inline-block;transition:transform .3s}
.or-submit span:nth-child(2){transform:rotate(8.6deg)}
.or-submit span:nth-child(3){transform:rotate(-8.4deg)}
.or-submit:hover span{transform:none}
.or-sent{margin:0;font-size:1R;color:var(--or-mute);max-width:22R}
.or-foot{padding:4R 9.375R 3R;border-top:1px solid var(--or-line);margin:0 0 0}
.or-foot-big{display:flex;align-items:center;gap:1.5R;font-size:17R;line-height:.9;font-weight:700;letter-spacing:-.08em}
.or-foot-m{flex:none;width:17R;height:12R;color:var(--or-brand)}
.or-foot-row{display:flex;align-items:flex-end;gap:4R;margin-top:3R;font-size:1R;color:var(--or-mute)}
.or-foot-row address{font-style:normal;line-height:1.4}
.or-foot-row small{margin-left:auto;font-size:.9R}
.or-foot-row .or-deck-pill{margin-left:0;color:var(--or-ink)}
.or-under{position:relative;color:var(--or-ink);padding-bottom:.3R;background:linear-gradient(currentColor,currentColor) 50% 100%/0 1px no-repeat,linear-gradient(rgb(128 128 128 / .3),rgb(128 128 128 / .3)) 0 100%/100% 1px no-repeat;transition:background-size .5s ease}
.or-under:hover{background-size:100% 1px,100% 1px}

/* overlays */
.or-flash{position:absolute;inset:0;z-index:30;background:#000;overflow:hidden;visibility:hidden;opacity:0;pointer-events:none}
.or-flash-in{position:absolute;left:-30%;top:-28%;width:160%;rotate:-15deg}
.or-flash-row{width:max-content;font-size:11R;line-height:12.4R;font-weight:800;letter-spacing:-.04em;color:var(--or-blush);white-space:nowrap}
.or-jump{position:absolute;inset:0;z-index:60;visibility:hidden;opacity:0;pointer-events:none;display:grid;place-items:center;--dc:#0b0b0c;--lc:#ffffff}
.or-jump[data-c=light]{--dc:#ffffff;--lc:#0b0b0c}
.or-jump-disc{position:absolute;left:50%;top:50%;width:max(150cqw,150cqh);height:max(150cqw,150cqh);margin:calc(max(150cqw,150cqh) / -2) 0 0 calc(max(150cqw,150cqh) / -2);border-radius:50%;background:var(--dc)}
.or-jump-logo{position:relative;width:33.6R;height:7.2R;overflow:visible}
.or-jump-logo path,.or-jump-logo text{fill:none;stroke:var(--lc);stroke-width:3;stroke-dasharray:420;stroke-dashoffset:420}
.or-jump-logo text{font:700 76px "Inter Tight",sans-serif;letter-spacing:-.06em;stroke-width:1.6}

/* menu */
.or-menu{position:absolute;inset:0;z-index:35;display:grid;grid-template-columns:1fr 18R 1fr;align-items:center;gap:6R;padding:9R 3.1R 3R;background:linear-gradient(203.7deg,#fff 48.1%,#eeebeb 86%);color:#0b0b0c;opacity:0;visibility:hidden;transform:translate(10%,-150%) rotate(12deg) scale(1.5);transition:transform .75s ease,visibility .75s ease,opacity .3s .5s}
.or-menu.is-open{opacity:1;visibility:visible;transform:none;transition:transform .75s ease,visibility .75s ease,opacity .3s}
.or-menu>*{opacity:0;transform:translateY(-6R);transition:transform .75s ease .3s,opacity .75s .3s}
.or-menu.is-open>*{opacity:1;transform:none}
.or-menu small{display:block;font-size:.85R;color:#9e9e9e;margin-bottom:1.2R}
.or-menu-social{display:flex;flex-direction:column;gap:.6R;font-size:1R;align-self:stretch;justify-content:center}
.or-menu-mail{margin-top:5R}
.or-menu-prev{position:relative;height:27R;border-radius:.4R;overflow:hidden}
.or-menu-p{position:absolute;top:0;bottom:0;left:0;max-width:0;width:100%;overflow:hidden;transition:max-width .3s ease}
.or-menu-p.is-on{left:auto;right:0;max-width:100%;transition:max-width .5s ease}
.or-menu-p>*{position:absolute;right:0;top:0;width:18R;height:27R;object-fit:cover;display:block}
.or-menu-links{display:flex;flex-direction:column;gap:.4R;font-size:3.5R;letter-spacing:-.045em}

/* floating contact chips with a brushed-metal edge */
.or-float{position:absolute;right:1.4R;bottom:1.4R;z-index:45;display:flex;flex-direction:column;align-items:flex-end;gap:1R}
.or-metal{display:inline-flex;align-items:center;justify-content:center;gap:.5R;color:#26272b;background:linear-gradient(32deg,#b8c2ce,#fff 50%) padding-box,linear-gradient(80deg,#737989,#fbffff,#fbffff,#707988) border-box;border:1.5px solid transparent;box-shadow:0 .25R .75R .5R rgb(0 0 0 / .08);transition:transform .2s ease}
.or-metal:hover{transform:scale(1.08)}
.or-metal svg{width:1.3R;height:1.3R;fill:none;stroke:currentColor;stroke-width:1.6;stroke-linejoin:round}
.or-metal-o{width:3.1R;height:3.1R;border-radius:50%}
.or-dark .or-metal{color:#ecebf0;background:linear-gradient(32deg,#24262b,#4a4d56 50%) padding-box,linear-gradient(80deg,#4c5160,#c7ccd6,#c7ccd6,#4b505e) border-box;box-shadow:0 .25R .75R .5R rgb(0 0 0 / .35)}
.or-rail{position:absolute;left:2.4R;top:calc(var(--h) / 2);translate:0 -50%;display:flex;flex-direction:column;gap:.15R}
.or-rail button{position:relative;display:flex;align-items:center;width:3.4R;height:1.3R;padding:0 0 0 .7R;color:inherit}
.or-rail i{display:block;width:.9R;height:1.5px;background:currentColor;opacity:.35;transition:width .5s cubic-bezier(.3,.7,.2,1),opacity .3s}
.or-rail span{position:absolute;left:3.6R;top:50%;font-size:.75R;letter-spacing:0;opacity:0;translate:-.4R -50%;transition:opacity .3s,translate .3s;white-space:nowrap;pointer-events:none;padding:.3R .7R;border-radius:2R;background:#fff;color:#0e1f1a;box-shadow:0 .3R 1.2R rgb(16 41 31 / .14)}
.or-header[data-tone="dark"] .or-rail span{background:#1c4038;color:#fff;box-shadow:none}
.or-rail button.is-on i{width:2.2R;opacity:1}
.or-rail button:hover span,.or-rail button:focus-visible span{opacity:1;translate:0 -50%}
.or-stack .or-rail{display:none}
.or-metal-p{border-radius:2R;padding:.5R 1R;font-size:.88R}
.or-metal-p svg{width:1R;height:1R}

/* cursor */
.or-dot{position:fixed;left:-.31R;top:-.31R;width:.62R;height:.62R;z-index:100;pointer-events:none;mix-blend-mode:difference;display:none}
.or-dot::before{content:"";position:absolute;left:50%;top:50%;width:100%;height:100%;border-radius:50%;background:#fff;translate:-50% -50%;transition:width .3s ease,height .3s ease}
.or-live:not(.or-stack) .or-dot{display:block}
.or-dot[data-k=nav]::before{width:6R;height:6R}
.or-dot[data-k=menu]::before{width:5R;height:5R}
.or-dot[data-k=button]::before{width:12R;height:12R}


/* ainimight: logo mark, stills, reel */
.or-mark{display:inline-block;background:currentColor;-webkit-mask:url(./logo-mask.png) center/contain no-repeat;mask:url(./logo-mask.png) center/contain no-repeat}
.or-kb{animation:or-kb 14s ease-in-out infinite alternate;animation-play-state:paused}
.or-scene.is-active .or-kb,.or-stack .or-kb{animation-play-state:running}
@keyframes or-kb{from{transform:scale(1.04) translate(0,0)}to{transform:scale(1.16) translate(-2%,-1.5%)}}
.or-ribbon{position:absolute;inset:0;width:100%;height:100%;display:block}
.or-reel-in{background:radial-gradient(120% 90% at 30% 20%,#f4efe0 0%,#d6e9c6 45%,#9fc8a6 100%)!important}
.or-reel-show{position:absolute;inset:0;overflow:hidden;background:#0b0b0c}
.or-reel-show img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;animation:or-xfade calc(var(--n) * 3.2s) linear infinite;animation-delay:calc(var(--k) * 3.2s - .6s)}
.or-reel-show.is-paused img{animation-play-state:paused}
@keyframes or-xfade{0%{opacity:0;transform:scale(1.02)}4%{opacity:1}12.5%{opacity:1}17%{opacity:0;transform:scale(1.12)}100%{opacity:0;transform:scale(1.12)}}
.or-reel-mask::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgb(0 0 0 / 0) 70%,rgb(20 24 50 / .22));pointer-events:none}
.or-reel-cap,.or-play{z-index:2}
.or-reel-cap{text-shadow:0 1px 12px rgb(30 30 60 / .55)}
.or-rate-k{color:var(--or-mute)!important}
.or-mail-big{font-size:1.5R;align-self:flex-start;letter-spacing:-.03em}

/* 6 case: tilt stack */
.or-s-case,.or-case{background:var(--or-blush-soft)}
.or-case-track{height:calc(var(--h) * 4.2)}
.or-case-l{position:absolute;left:9.375R;top:13R;width:26R;z-index:2}
.or-case-k{margin:0 0 1.2R;font-size:1R;color:var(--or-mute)}
.or-case-h{margin:0;font-family:"Bricolage Grotesque",sans-serif;font-size:6R;line-height:.95;font-weight:600;letter-spacing:-.05em}
.or-case-sub{margin:2R 0 0;font-size:1.3R;line-height:1.35;color:var(--or-mute)}
.or-case-tags{display:flex;flex-wrap:wrap;gap:.6R;margin-top:2R}
.or-case-tags span{border:1px solid var(--or-line);border-radius:2R;padding:.4R .9R;font-size:.85R;background:var(--or-paper)}
.or-case-rail{display:flex;align-items:center;gap:1R;margin-top:4R;font-family:"Bricolage Grotesque",sans-serif;font-weight:600;font-size:1.1R}
.or-case-rail i{position:relative;width:12R;height:.2R;background:var(--or-line);border-radius:1R;overflow:hidden}
.or-case-rail b{position:absolute;inset:0;background:var(--or-ink);transform-origin:0 50%;transform:scaleX(0)}
.or-case-stack{position:absolute;left:41R;top:calc(var(--h) / 2 - 15R);width:44R;height:30R}
.or-tilt{position:absolute;inset:0;margin:0;border-radius:2R;overflow:hidden;background:#ddd;box-shadow:0 2.5R 5R -1.5R rgb(60 30 30 / .35);transform-origin:50% 100%;will-change:transform}
.or-tilt img{width:100%;height:100%;object-fit:cover;display:block}
.or-tilt figcaption{position:absolute;left:1.4R;right:1.4R;bottom:1.4R;display:flex;flex-direction:column;gap:.3R;padding:1.1R 1.3R;border-radius:1.3R;background:rgb(255 255 255 / .82);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);color:#0b0b0c}
.or-tilt figcaption b{font-size:1.25R;letter-spacing:-.03em}
.or-tilt figcaption span{font-size:.9R;color:#55545a}

/* 7 brands: flowing menu + count-up */
.or-s-brands{background:var(--or-paper)}
.or-brands{height:var(--h);padding:9.6R 9.375R 2.6R;display:flex;flex-direction:column}
.or-brands-k{margin:0 0 1R;font-size:1R;color:var(--or-mute)}
.or-brands-h{margin:0 0 3R;font-size:3.2R;font-weight:500;letter-spacing:-.045em;max-width:40R;line-height:1.05}
.or-flow{border-bottom:1px solid var(--or-line)}
.or-flow-item{position:relative;overflow:hidden;border-top:1px solid var(--or-line);height:5.5R}
.or-flow-link{position:relative;display:flex;align-items:center;justify-content:space-between;height:100%;padding:0 1R}
.or-flow-link span{font-family:"Bricolage Grotesque",sans-serif;font-size:4R;font-weight:600;letter-spacing:-.05em;text-transform:uppercase;line-height:1}
.or-flow-link small{font-size:1R;color:var(--or-mute)}
.or-flow-marq{position:absolute;inset:0;overflow:hidden;background:var(--or-brand);pointer-events:none;transform:translateY(101%)}
.or-flow-inner{height:100%;transform:translateY(-101%)}
.or-flow-track{display:flex;align-items:center;height:100%;width:max-content;animation:or-marq 18s linear infinite}
.or-flow-track span{font-family:"Bricolage Grotesque",sans-serif;font-size:4.2R;font-weight:600;letter-spacing:-.05em;text-transform:uppercase;color:#0b0b0c;padding:0 2R;white-space:nowrap}
.or-flow-track img{width:12R;height:5.6R;border-radius:3R;object-fit:cover;flex:none}
.or-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:2R;margin-top:auto;padding-top:2.4R}
.or-stat{display:flex;flex-direction:column;gap:.6R}
.or-stat b{font-family:"Bricolage Grotesque",sans-serif;font-size:4R;font-weight:500;letter-spacing:-.05em;line-height:1;font-variant-numeric:tabular-nums}
.or-stat small{font-size:.95R;color:var(--or-mute);max-width:14R}

/* 9 shelf: circular gallery */
.or-s-shelf,.or-shelf{background:#0d0f14;color:#fff}
.or-shelf{position:relative;height:var(--h);overflow:hidden}
.or-shelf-k{position:absolute;left:9.375R;top:11R;margin:0;font-size:1R;color:#8b8a90}
.or-shelf-h{position:absolute;left:9.375R;top:13R;margin:0;font-family:"Bricolage Grotesque",sans-serif;font-size:4.6R;font-weight:500;letter-spacing:-.045em;line-height:1}
.or-shelf-sub{position:absolute;right:9.375R;top:13.4R;margin:0;width:15.5R;font-size:1R;line-height:1.35;color:#8b8a90;text-align:right}
.or-shelf-g{position:absolute;left:0;right:0;top:20R;bottom:2R}
.or-shelf::before{content:"";position:absolute;left:50%;top:60%;width:70R;height:30R;translate:-50% -50%;background:radial-gradient(closest-side,rgb(176 199 221 / .22),transparent);pointer-events:none}

/* footer: pressure wordmark */
.or-foot-big{color:var(--or-ink)}
.or-press{flex:1;height:15R;min-width:0}
.or-press h1{margin:0}


/* ===== ainimight v2 ===== */
.or-em{font-family:"Instrument Serif",Georgia,serif;font-style:italic;font-weight:400;letter-spacing:-.01em;color:var(--or-brand-deep)}
.or-dark .or-em{color:var(--or-brand)}
.or-s-quote .or-em,.or-s-work .or-em,.or-s-shelf .or-em{color:var(--or-brand)}
.or-hero .or-em{font-size:1.08em;line-height:1}
.or-home::before,.or-home::after{content:"";position:absolute;z-index:-1;border-radius:50%;filter:blur(3R);pointer-events:none;animation:or-drift 16s ease-in-out infinite alternate}
.or-home::before{right:2R;top:5R;width:34R;height:26R;background:radial-gradient(closest-side,rgb(177 218 150 / .55),transparent)}
.or-home::after{right:22R;top:20R;width:22R;height:18R;background:radial-gradient(closest-side,rgb(234 225 201 / .7),transparent);animation-duration:21s}
@keyframes or-drift{to{transform:translate(-6R,4R) scale(1.15)}}
.or-grain{position:absolute;inset:0;z-index:96;pointer-events:none;opacity:.05;mix-blend-mode:multiply;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}
.or-stack .or-grain{position:fixed}
.or-dot[data-k=view]::before{width:9R;height:9R}

/* about cards */
.or-card-tag{position:relative;align-self:flex-start;font-size:.8R;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--or-brand-deep);margin-bottom:1R;padding:.35R .8R;border-radius:2R;background:rgb(255 255 255 / .7)}
.or-card-go{position:relative;align-self:flex-start;display:inline-flex;gap:.5R;align-items:center;margin-top:1.6R;font-size:.95R;font-weight:500;border-bottom:1px solid currentColor;padding-bottom:.2R}
.or-card-pill.is-type{display:grid;place-items:center;background:#1f2a20;color:#e7efe2}
.or-card-pill.is-type span{font-family:"Instrument Serif",serif;font-style:italic;font-size:5R;letter-spacing:-.02em}

/* work */
.or-car-view{position:absolute;right:1.4R;bottom:1.4R;z-index:2;background:#fff;color:#0b0b0c;border-radius:2R;padding:.55R 1R;font-size:.85R;font-weight:500;animation:or-up .5s .3s both}
.or-car-card{box-shadow:0 2R 4R -1R rgb(0 0 0 / .5)}

/* case */
.or-case-sub b{color:var(--or-ink);font-weight:500}
.or-pill-btn{display:inline-flex;align-items:center;gap:.7R;margin-top:2.2R;background:var(--or-ink);color:var(--or-paper);border-radius:3R;padding:1R 1.6R;font-size:1R;font-weight:500}
.or-pill-btn i{font-style:normal;display:grid;place-items:center;width:1.8R;height:1.8R;border-radius:50%;background:#f995c7;color:#0b0b0c;font-size:.9R}
.or-case-rail{margin-top:2.6R}

/* 7 moods */
.or-moods{position:relative;min-height:var(--h);display:grid;grid-template-columns:27R 1fr 19R;gap:2.4R;align-items:center;padding:9R 6R 3.4R;background:var(--mbg);color:var(--mfg);transition:background-color .9s ease,color .9s ease;overflow:hidden}
.or-moods-k{margin:0 0 1R;font-size:.95R;opacity:.7}
.or-moods-h{margin:0 0 2R;font-family:"Instrument Serif",serif;font-style:italic;font-weight:400;font-size:3.6R;line-height:1;letter-spacing:-.02em}
.or-seg{position:relative;display:inline-grid;grid-template-columns:repeat(3,7.4R);padding:.35R;border-radius:3R;background:rgb(255 255 255 / .28);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px)}
.or-seg-bg,.or-seg-hv{position:absolute;top:.35R;bottom:.35R;left:.35R;width:7.4R;border-radius:3R;transition:transform .55s cubic-bezier(.3,.8,.2,1)}
.or-seg-bg{background:#fff;transform:translateX(calc(var(--at) * 100%));box-shadow:0 .4R 1.2R rgb(0 0 0 / .12)}
.or-seg-hv{background:rgb(255 255 255 / .35);transform:translateX(calc(var(--hv) * 100%))}
.or-seg button{position:relative;z-index:1;padding:.8R 0;font-size:1R;font-weight:500;color:var(--mfg);transition:color .4s}
.or-seg button.is-on{color:#0b0b0c}
.or-seg-prog{position:absolute;left:30%;right:30%;bottom:.3R;height:2px;border-radius:2px;background:var(--mink);transform-origin:0 50%;animation:or-prog 6.5s linear both}
@keyframes or-prog{from{transform:scaleX(0)}to{transform:scaleX(1)}}
.or-moods-copy{margin-top:2.4R}
.or-moods-copy>*{animation:or-fadeup .7s cubic-bezier(.2,.7,.2,1) both}
.or-moods-copy>*:nth-child(2){animation-delay:.05s}.or-moods-copy>*:nth-child(3){animation-delay:.1s}.or-moods-copy>*:nth-child(4){animation-delay:.15s}.or-moods-copy>*:nth-child(5){animation-delay:.2s}.or-moods-copy>*:nth-child(6){animation-delay:.25s}
@keyframes or-fadeup{from{opacity:0;transform:translateY(1.6R)}}
.or-moods-copy h3{margin:0;font-family:"Bricolage Grotesque",sans-serif;font-size:4.2R;line-height:1;font-weight:600;letter-spacing:-.045em;color:var(--mink);transition:color .9s}
.or-moods-tag{margin:.6R 0 1.4R!important;font-family:"Instrument Serif",serif;font-style:italic;font-size:1.7R!important;line-height:1.15!important;opacity:1!important}
.or-moods-copy p{margin:0 0 .7R;font-size:1.05R;line-height:1.45;opacity:.85}
.or-moods-copy small{display:block;margin-top:1.2R;font-size:.85R;opacity:.7}
.or-moods-art{position:relative;height:44R;display:grid;place-items:center}
.or-moods-ring{position:absolute;width:34R;height:34R;border-radius:50%;border:1px dashed rgb(255 255 255 / .55);animation:or-spin 40s linear infinite}
.or-moods-ring::after{content:"";position:absolute;inset:4R;border-radius:50%;background:radial-gradient(closest-side,rgb(255 255 255 / .35),transparent)}
.or-moods-art img{position:absolute;width:24R;aspect-ratio:549/705;height:auto;object-fit:cover;border-radius:2.4R;box-shadow:0 3R 6R -2R rgb(0 0 0 / .35);opacity:0;transform:translateX(calc(var(--o) * 16R)) rotate(calc(var(--o) * 10deg)) scale(.8);transition:transform 1s cubic-bezier(.3,.8,.2,1),opacity .6s ease}
.or-moods-art img.is-on{opacity:1;transform:none}
.or-moods-ing{display:flex;flex-direction:column;gap:1.3R;align-self:center}
.or-moods-ing>*{animation:or-fadeup .7s cubic-bezier(.2,.7,.2,1) both}
.or-moods-ing>small{font-size:.85R;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--mink);transition:color .9s}
.or-moods-ing div{display:flex;flex-direction:column;gap:.3R;padding-top:1R;border-top:1px solid color-mix(in srgb,var(--mfg) 18%,transparent)}
.or-moods-ing b{font-size:1.25R;letter-spacing:-.02em}
.or-moods-ing span{font-size:.95R;line-height:1.4;opacity:.8}
.or-moods-fine{margin:.6R 0 0;font-size:.78R;line-height:1.45;opacity:.6}

/* 8 logo bento */
.or-s-logo{background:#f6f6f9}
.or-logo-s{height:var(--h);padding:9.6R 9.375R 2.6R;display:flex;flex-direction:column;gap:1.6R}
.or-logo-head{display:flex;align-items:flex-end;justify-content:space-between}
.or-logo-head .or-brands-k{margin:0}
.or-logo-h{margin:0;font-size:3.6R;font-weight:500;letter-spacing:-.045em;line-height:1}
.or-bento{flex:1;min-height:0;display:grid;grid-template-columns:repeat(4,1fr);grid-template-rows:1fr 1fr .78fr;grid-template-areas:"a a b b" "a a d c" "q q s1 s2";gap:1R}
.or-bt{position:relative;margin:0;border-radius:1.6R;overflow:hidden;background:#fff;border:1px solid #e6e6ee;text-align:left;font:inherit;color:inherit;isolation:isolate;transition:transform .5s cubic-bezier(.3,.8,.2,1),box-shadow .5s}
.or-bt::before{content:"";position:absolute;inset:0;z-index:2;pointer-events:none;opacity:0;transition:opacity .4s;background:radial-gradient(16R circle at var(--mx,50%) var(--my,50%),rgb(249 149 199 / .22),transparent 65%)}
.or-bt::after{content:"";position:absolute;inset:0;z-index:3;pointer-events:none;border-radius:inherit;padding:1px;opacity:0;transition:opacity .4s;background:radial-gradient(14R circle at var(--mx,50%) var(--my,50%),#4c5c8e,transparent 70%);-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude}
.or-bento:hover .or-bt::before,.or-bento:hover .or-bt::after{opacity:1}
.or-bt:hover{transform:translateY(-.3R);box-shadow:0 1.6R 3R -1.4R rgb(40 50 90 / .3)}
.or-bt img{width:100%;height:100%;object-fit:cover;display:block}
.or-bt-a{grid-area:a}.or-bt-a img{object-fit:contain;background:#fff;padding:1R}
.or-bt-a figcaption{position:absolute;left:1.2R;top:1.1R;font-size:.8R;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#4c5c8e}
.or-bt-b{grid-area:b;padding:2R 2.2R;display:flex;flex-direction:column;justify-content:space-between;background:linear-gradient(135deg,#fff,#fbeff6)}
.or-bt-b p{margin:0;font-size:1.3R;line-height:1.4;letter-spacing:-.015em;max-width:44R}
.or-bt-link{align-self:flex-start;font-size:.95R;font-weight:500;border-bottom:1px solid currentColor;padding-bottom:.2R;color:#4c5c8e}
.or-bt-c{grid-area:c}.or-bt-d{grid-area:d}
.or-bt-q{grid-area:q;padding:1.6R 2R;background:#4c5c8e;color:#f995c7;display:flex;flex-direction:column;justify-content:space-between;border-color:#4c5c8e}
.or-bt-q small{font-size:.85R;color:rgb(255 255 255 / .7)}
.or-bt-q b{font-family:"Instrument Serif",serif;font-style:italic;font-weight:400;font-size:2.8R;line-height:1;letter-spacing:-.02em}
.or-bt-sw{display:flex;flex-direction:column;justify-content:flex-end;gap:.25R;padding:1.4R 1.6R;background:var(--sw);color:#fff;border-color:transparent;cursor:pointer}
.or-bt-sw:nth-of-type(n){grid-area:auto}
.or-bento>.or-bt-sw:nth-last-child(2){grid-area:s1}.or-bento>.or-bt-sw:last-child{grid-area:s2;color:#3a2440}
.or-bt-sw small{font-size:.8R;opacity:.85}.or-bt-sw b{font-size:1.4R;letter-spacing:-.02em}.or-bt-sw em{font-style:normal;font-size:.75R;opacity:.7}

/* 9 projects */
.or-flow-link i{font-style:normal;margin-left:2R;display:grid;place-items:center;min-width:3R;height:3R;padding:0 .9R;border-radius:2R;border:1px solid var(--or-line);font-size:.85R}
.or-flow-link small{margin-left:auto}
.or-flow-item.is-soon .or-flow-link span{color:#b9b8bf}
.or-flow-track em{font-style:normal;font-size:2.4R;color:#4c5c8e;padding:0 1R}

/* contact */
.or-follow-cases{display:flex;flex-wrap:wrap;gap:.6R}
.or-chip-s{display:inline-flex;border:1px solid var(--or-line);border-radius:2R;padding:.5R 1R;font-size:.9R;transition:border-color .3s}
.or-chip-s:hover{border-color:var(--or-ink)}
.or-velo{padding:1.6R 0;border-top:1px solid var(--or-line);overflow:hidden;-webkit-mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent);mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)}
.or-velo-p{position:relative;overflow:hidden}
.or-velo-s{display:flex;white-space:nowrap;font-family:"Bricolage Grotesque",sans-serif;font-size:5R;line-height:1.15;font-weight:600;letter-spacing:-.045em;text-transform:uppercase}
.or-velo-s span{flex-shrink:0;padding-right:.4em}
.or-velo-p+.or-velo-p .or-velo-s{color:transparent;-webkit-text-stroke:1px var(--or-ink)}

/* case study sheet */
.or-cs{position:absolute;inset:0;z-index:75;overflow-y:auto;overscroll-behavior:contain;background:var(--or-paper);color:var(--or-ink);visibility:hidden;scrollbar-width:thin;outline:none}
.or-cs.is-on{visibility:visible}
.or-stack .or-cs{position:fixed}
.or-cs-bar{position:sticky;top:0;z-index:5;display:flex;justify-content:flex-end;padding:1.6R 2.4R 2.2R;pointer-events:none;transition:background-color .3s}
.or-cs-bar::before{content:"";position:absolute;inset:0;background:linear-gradient(var(--or-paper) 62%,color-mix(in srgb,var(--or-paper) 0%,transparent));opacity:0;transition:opacity .35s}
.or-cs.is-scrolled .or-cs-bar::before{opacity:1}
.or-cs-x{position:relative;pointer-events:auto;display:flex;align-items:center;gap:.8R;background:var(--or-ink);color:var(--or-paper)!important;border-radius:3R!important;padding:.75R .8R .75R 1.4R!important;font-size:.95R;font-weight:500;width:max-content;box-shadow:0 .6R 1.6R rgb(0 0 0 / .2)}
.or-cs-x i{position:relative;width:1.8R;height:1.8R;border-radius:50%;background:rgb(255 255 255 / .16)}
.or-cs-x i::before,.or-cs-x i::after{content:"";position:absolute;left:50%;top:50%;width:.9R;height:1.5px;background:currentColor;translate:-50% -50%;rotate:45deg}
.or-cs-x i::after{rotate:-45deg}
.or-cs-top{margin-top:-7.1R;padding:7R 9.375R 3R;background:linear-gradient(180deg,color-mix(in srgb,var(--cs) 30%,#fff),var(--or-paper))}
.or-cs-k{margin:0 0 1.2R;font-size:.85R;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:color-mix(in srgb,var(--cs) 55%,#111)}
.or-cs-t{margin:0;font-family:"Bricolage Grotesque",sans-serif;font-size:6.4R;line-height:.95;font-weight:600;letter-spacing:-.05em;max-width:62R}
.or-cs-sub{margin:1.4R 0 0;font-size:1.25R;color:#55545c}
.or-cs-meta{display:grid;grid-template-columns:repeat(4,1fr);gap:2R;margin:3R 0 0;padding-top:1.6R;border-top:1px solid rgb(0 0 0 / .1)}
.or-cs-meta dt{font-size:.75R;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:#8a8990;margin-bottom:.4R}
.or-cs-meta dd{margin:0;font-size:1.05R}
.or-cs-hero{margin:0 9.375R;border-radius:2R;overflow:hidden;background:#eee}
.or-cs-hero img{width:100%;max-height:46R;object-fit:cover;display:block}
.or-cs-type{margin:0 9.375R;border-radius:2R;padding:6R 4R;background:#1f2a20;color:#e7efe2;font-family:"Instrument Serif",serif;font-style:italic;font-size:12R;line-height:.9;letter-spacing:-.03em}
.or-cs-body{max-width:64R;margin:0 auto;padding:5R 2.4R 3R;display:flex;flex-direction:column;gap:2R}
.or-cs-h{margin:2.2R 0 0;font-family:"Bricolage Grotesque",sans-serif;font-size:2.8R;line-height:1.05;font-weight:600;letter-spacing:-.04em}
.or-cs-p{margin:0;font-size:1.22R;line-height:1.62;color:#3b3a42}
.or-cs-p.is-lead{font-size:1.9R;line-height:1.3;letter-spacing:-.02em;color:var(--or-ink)}
.or-cs-q{margin:1R 0;padding:1.6R 0 1.6R 2.2R;border-left:3px solid var(--cs);font-family:"Instrument Serif",serif;font-style:italic;font-size:2.8R;line-height:1.12;letter-spacing:-.015em;display:flex;flex-direction:column;gap:.4R}
.or-cs-q cite{font-family:"Inter Tight",sans-serif;font-style:normal;font-size:.95R;color:#7a7980;margin-top:.8R}
.or-cs-img{margin:0;display:flex;flex-direction:column;gap:.7R}
.or-cs-img img{width:100%;border-radius:1.4R;display:block;background:#f2f2f2}
.or-cs-img.is-tall img{max-height:64R;object-fit:contain;background:transparent;box-shadow:0 2R 4R -2R rgb(0 0 0 / .35);width:auto;max-width:100%;align-self:center}
.or-cs-img figcaption{font-size:.85R;color:#8a8990}
.or-cs-imgs{display:grid;grid-template-columns:1fr 1fr;gap:1.2R}
.or-cs-imgs img{width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:1.4R;display:block}
.or-cs-imgs.is-tall img{aspect-ratio:3/4}
.or-cs-pairs{margin:0;display:grid;grid-template-columns:1fr 1fr;gap:1.4R 2.4R}
.or-cs-pairs>div{padding-top:1R;border-top:1px solid var(--or-line)}
.or-cs-pairs dt{font-size:.75R;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:#8a8990;margin-bottom:.6R}
.or-cs-pairs dd{margin:0;font-size:1.05R;line-height:1.55;color:#3b3a42}
.or-cs-tags{display:flex;flex-wrap:wrap;gap:.5R}
.or-cs-tags i{font-style:normal;padding:.35R .8R;border-radius:2R;background:color-mix(in srgb,var(--cs) 22%,#fff);font-size:.9R}
.or-cs-list{padding:1.8R 2R;border-radius:1.4R;background:color-mix(in srgb,var(--cs) 12%,#fff)}
.or-cs-list small{display:block;font-size:.75R;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:#8a8990;margin-bottom:1R}
.or-cs-list ul{margin:0;padding:0;list-style:none;display:grid;grid-template-columns:1fr 1fr;gap:.7R 2R}
.or-cs-list li{font-size:1.1R;line-height:1.4}
.or-cs-list li b{color:color-mix(in srgb,var(--cs) 70%,#111);margin-right:.3R}
.or-cs-sw{display:flex;flex-wrap:wrap;align-items:center;gap:1.4R}
.or-cs-chip{display:flex;align-items:center;gap:.8R}
.or-cs-chip i{width:3.4R;height:3.4R;border-radius:50%;box-shadow:inset 0 0 0 1px rgb(0 0 0 / .08)}
.or-cs-chip span{display:flex;flex-direction:column;font-size:1R}
.or-cs-chip small{font-size:.8R;color:#8a8990}
.or-cs-sw em{font-size:.95R;color:#7a7980}
.or-cs-cols{display:grid;grid-template-columns:repeat(3,1fr);gap:1.6R}
.or-cs-cols.is-two{grid-template-columns:1fr 1fr}
.or-cs-cols article{display:flex;flex-direction:column;gap:.6R}
.or-cs-cols img{width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:1.2R;margin-bottom:.6R;background:#eee}
.or-cs-cols.is-two img{aspect-ratio:3/4;object-fit:contain;background:color-mix(in srgb,var(--cs) 14%,#fff)}
.or-cs-cols small{font-size:.75R;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:#8a8990}
.or-cs-cols h4{margin:0;font-size:1.45R;letter-spacing:-.025em}
.or-cs-cols p{margin:0;font-size:1R;line-height:1.55;color:#4a4950}
.or-cs-cols em{font-size:.85R;color:#8a8990}
.or-cs-bounce{margin:1R 0;display:flex;flex-direction:column;align-items:center;gap:.8R;padding:2R 0;border-radius:1.6R;background:color-mix(in srgb,var(--cs) 14%,#fff);overflow:hidden}
.or-cs-bounce .bounce-cards__card{aspect-ratio:409/610!important}
.or-cs-bounce figcaption{font-size:.85R;color:#8a8990}
.or-cs-moods{display:grid;grid-template-columns:repeat(3,1fr);gap:1.2R}
.or-cs-moods article{border-radius:1.4R;padding:1.2R 1.2R 1.6R;display:flex;flex-direction:column;gap:.4R}
.or-cs-moods img{width:100%;aspect-ratio:549/705;object-fit:cover;border-radius:1R;margin-bottom:.6R}
.or-cs-moods h4{margin:0;font-size:1.5R;letter-spacing:-.03em}
.or-cs-moods p{margin:0;font-family:"Instrument Serif",serif;font-style:italic;font-size:1.25R;line-height:1.2}
.or-cs-moods small{font-size:.8R;opacity:.75;line-height:1.4}
.or-cs-glow{padding:3.4R 3.4R;border-radius:1.6R;background:linear-gradient(180deg,#6c3fd0,#b989ef 70%,#e6aaff);color:#f6d79b;font-family:Georgia,"Instrument Serif",serif;font-size:1.7R;line-height:1.4}
.or-cs-glow p{margin:0 0 1R}
.or-cs-glow p:last-child{margin:1.4R 0 0;font-style:italic}
.or-cs-foot{max-width:64R;margin:0 auto;padding:2R 2.4R 6R;display:flex;flex-direction:column;gap:2R}
.or-cs-foot>small{font-size:.85R;color:#8a8990}
.or-cs-next{display:flex;flex-direction:column;gap:.4R;padding:2.4R 0;border-top:1px solid var(--or-line);text-align:left}
.or-cs-next small{font-size:.85R;color:#8a8990}
.or-cs-next b{font-family:"Bricolage Grotesque",sans-serif;font-size:3.6R;font-weight:600;letter-spacing:-.045em;line-height:1;transition:color .3s}
.or-cs-next:hover b{color:var(--or-brand-deep)}
.or-case-open .or-header,.or-case-open .or-float{opacity:0;pointer-events:none}
.or-float{transition:opacity .4s}
.or-header{transition:color .3s,opacity .7s ease,translate .7s cubic-bezier(.2,.7,.2,1)!important}
.or-float{transition:opacity .7s ease,translate .7s cubic-bezier(.2,.7,.2,1)!important}
.or-gated .or-header{opacity:0;translate:0 -1.6R;pointer-events:none}
.or-gated .or-header>*{pointer-events:none}
.or-gated .or-float{opacity:0;translate:0 1.6R;pointer-events:none}
.or-rail{transition:opacity .4s ease}
.or-menu-open .or-rail{opacity:0;pointer-events:none}
.or-header::before{content:"";position:absolute;inset:0;z-index:-1;background:rgb(255 255 255 / .82);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);border-bottom:1px solid var(--or-line);opacity:0;transition:opacity .35s;pointer-events:none}
.or-header.is-solid::before{opacity:1}
.or-header.is-solid{padding-bottom:1.2R}

/* preloader */
.or-pre{position:absolute;inset:0;z-index:120;display:grid;place-items:center}
.or-stack .or-pre{position:fixed}
.or-pre-b{position:absolute;top:0;bottom:0;left:calc(var(--k) * 16.6667%);width:calc(16.6667% + 1px);background:#16362e}
.or-pre-b:nth-child(even){background:#1c4038}
.or-pre-c{position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;gap:1.4R;color:#fff}
.or-pre-logo{position:relative;width:15R;height:10.7R}
.or-pre-logo .or-mark{display:block;width:100%;height:100%}
.or-pre-base{position:absolute;inset:0;color:rgb(255 255 255 / .1)}
.or-pre-fill{position:absolute;inset:0;color:#b1da96;clip-path:inset(100% 0 0 0)}
.or-pre-n{font-family:"Bricolage Grotesque",sans-serif;font-size:4.4R;font-weight:500;letter-spacing:-.04em;font-variant-numeric:tabular-nums;line-height:1}
.or-pre-c small{font-size:.75R;letter-spacing:.18em;text-transform:uppercase;color:rgb(255 255 255 / .5)}


/* ===== v4: entrance portal ===== */
.or-s-intro,.or-intro{background:#b1da96}
.or-intro-track{height:calc(var(--h) * 4.2)}
.or-in-bg{position:absolute;inset:0;background:radial-gradient(90% 70% at 50% 100%,#c6e6ae 0%,#b1da96 55%,#a3d085 100%)}
.or-in-mark{position:absolute;right:3.1R;top:7.4R;font-family:"Bricolage Grotesque",sans-serif;font-size:1.6R;font-weight:600;letter-spacing:-.04em;color:#1c4038}
.or-in-mark sup{font-size:.5em;margin-left:.1em}
.or-in-loc{position:absolute;left:3.1R;top:7.8R;font-size:.9R;color:#1c4038;opacity:.75}
.or-in-ch{position:absolute;left:50%;bottom:-1px;height:min(78%,72R);aspect-ratio:1;translate:-50% 0;overflow:visible;will-change:transform}
.or-ch-hair,.or-ch-bun circle,.or-ch-fringe{fill:#1c4038}
.or-ch-leaf{fill:#eae1c9}
.or-ch-face{fill:#f6efdd}
.or-ch-cheeks ellipse{fill:#f2a9b8;opacity:.6}
.or-ch-lens{fill:none;stroke:#e0566f;stroke-width:9;stroke-linecap:round}
.or-ch-lid{stroke:#1c4038;stroke-width:6;stroke-linecap:round}
.or-ch-pupil{fill:#1c4038}
.or-ch-mouth{fill:#1c4038}
.or-ch-eyes{animation:or-blink 5s infinite}
@keyframes or-blink{0%,92%,100%{opacity:1}95%{opacity:.15}}
.or-in-hint{position:absolute;left:3.1R;bottom:3.2R;display:flex;flex-direction:column;align-items:center;gap:.8R;font-size:.8R;letter-spacing:.16em;text-transform:uppercase;color:#1c4038}
.or-in-hint i{width:1.5R;height:2.4R;border:1.5px solid currentColor;border-radius:1R;position:relative}
.or-in-hint i::after{content:"";position:absolute;left:50%;top:.4R;width:2px;height:.5R;margin-left:-1px;background:currentColor;border-radius:2px;animation:or-wheel 1.6s ease-in-out infinite}
@keyframes or-wheel{0%{transform:translateY(0);opacity:1}70%{transform:translateY(.8R);opacity:0}100%{opacity:0}}
.or-in-hole{position:absolute;inset:0;background:radial-gradient(80% 70% at 50% 40%,#1f4a3f 0%,#10291f 70%);color:#eae1c9;clip-path:circle(0 at 50% 75%);z-index:2}
.or-in-copy{position:absolute;left:0;right:0;top:50%;translate:0 -58%;text-align:center;padding:0 6R}
.or-in-eyebrow{margin:0 0 1.6R;font-size:.95R;letter-spacing:.24em;text-transform:uppercase;color:#b1da96}
.or-in-h{margin:0 auto;max-width:62R;font-family:"Bricolage Grotesque",sans-serif;font-size:5.4R;line-height:1.02;font-weight:600;letter-spacing:-.05em;color:#f4efe2}
.or-in-svc{margin:2.2R 0 0;font-family:"Instrument Serif",serif;font-style:italic;font-size:2.4R;letter-spacing:-.01em}
.or-in-svc i{font-style:normal;color:rgb(234 225 201 / .35)}
.or-iw{display:inline-block;opacity:0;transform:translateY(.4em);filter:blur(6px);transition:opacity .45s ease,transform .55s cubic-bezier(.2,.7,.2,1),filter .45s ease}
.or-iw.is-on{opacity:1;transform:none;filter:none}
.or-iw-sp{margin-right:.24em}
.or-iw-c0{color:#b1da96}.or-iw-c1{color:#f2a9b8}.or-iw-c2{color:#9fd3e0}.or-iw-c3{color:#f2cf7b}.or-iw-c4{color:#eae1c9}
.or-in-logos{position:absolute;left:0;right:0;bottom:3.4R;overflow:hidden;-webkit-mask-image:linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent);mask-image:linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent)}
.or-in-logos>div{display:flex;align-items:center;gap:4.2R;width:max-content;animation:or-marq 36s linear infinite}
.or-lg{white-space:nowrap;color:#eae1c9;opacity:.8;font-size:1.25R}
.or-lg0{font-family:"Bricolage Grotesque",sans-serif;font-weight:700;letter-spacing:-.03em;text-transform:uppercase}
.or-lg1{font-family:"Instrument Serif",serif;font-style:italic;font-size:1.6R}
.or-lg2{font-weight:300;letter-spacing:.32em;text-transform:uppercase;font-size:1R}
.or-lg3{font-family:Georgia,serif;letter-spacing:.06em}
.or-lg4{font-weight:800;letter-spacing:-.05em}

/* projects stack captions */
.or-tilt figcaption{flex-direction:row!important;align-items:center;justify-content:space-between;gap:1R}
.or-tilt-txt{display:flex;flex-direction:column;gap:.3R;min-width:0}
.or-tilt-go{flex:none;background:#1c4038!important;color:#eae1c9!important;border-radius:2R!important;padding:.6R 1.1R!important;font-size:.85R;font-weight:500}
.or-case-sub b{color:var(--or-brand-deep)}

/* services arches */
.or-s-services{background:var(--or-cream)}
.or-svc{height:var(--h);padding:9.4R 9.375R 0;display:flex;flex-direction:column}
.or-svc-head{display:flex;align-items:flex-end;justify-content:space-between;gap:3R}
.or-svc-head .or-brands-k{margin:0}
.or-svc-h{margin:0;font-size:3.8R;font-weight:600;letter-spacing:-.05em;line-height:1;color:#1c4038;text-transform:uppercase;text-align:right}
.or-svc-cols{flex:1;display:grid;grid-template-columns:repeat(4,1fr);gap:1.2R;align-items:end;margin-top:2R}
.or-arch{position:relative;height:calc(52% + var(--k) * 12%);border-radius:7R 7R 0 0;background:#b1da96;color:#1c4038;padding:2.4R 2R 2R;display:flex;flex-direction:column;gap:1R;overflow:hidden;transition:background-color .5s ease,color .5s ease}
.or-arch img{position:absolute;right:-2R;top:-2R;width:12R;height:12R;object-fit:cover;border-radius:50%;opacity:0;pointer-events:none;transform:scale(.6) rotate(-12deg);transition:opacity .5s ease,transform .7s cubic-bezier(.2,.7,.2,1)}
.or-arch:hover{background:#1c4038;color:#eae1c9}
.or-arch:hover img{opacity:1;transform:none}
.or-arch-n{font-size:1R;font-weight:600;letter-spacing:.08em}
.or-arch h3{margin:0;font-size:2.1R;line-height:1;letter-spacing:-.04em;text-transform:uppercase;font-weight:600}
.or-arch p{margin:0;font-size:1.02R;line-height:1.45;max-width:18R}

/* ROI */
.or-s-roi{background:#1c4038;color:#eae1c9}
.or-roi{height:var(--h);padding:10R 9.375R 4R;display:grid;grid-template-columns:1fr 1.15fr;gap:4R;align-items:center}
.or-roi-h{margin:0;font-family:"Bricolage Grotesque",sans-serif;font-size:4.2R;line-height:1.05;font-weight:600;letter-spacing:-.045em;text-transform:uppercase;color:#b1da96}
.or-roi-h .or-em{color:#eae1c9;text-transform:none}
.or-roi-cards{display:flex;flex-direction:column;gap:1.2R}
.or-roi-c{display:grid;grid-template-columns:1fr auto;gap:2R;align-items:center;background:#eae1c9;color:#1c4038;border-radius:3R;padding:1.8R 2.4R}
.or-roi-c p{margin:0;font-size:.95R;line-height:1.45}
.or-roi-c div{display:flex;flex-direction:column;align-items:flex-end}
.or-roi-c b{font-family:"Bricolage Grotesque",sans-serif;font-size:5.4R;line-height:1;font-weight:500;letter-spacing:-.05em;font-variant-numeric:tabular-nums}
.or-roi-c small{margin-top:.5R;font-size:.75R;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#2f7d5e}

/* values cube face */
.or-face-b{font-size:2.3R!important;gap:1.6R;padding:0 1R!important}
.or-face-b li{display:flex;flex-direction:column;gap:.4R}
.or-face-b li b{font-weight:800}
.or-face-b li small{font-size:.8R;line-height:1.35;text-transform:none;font-weight:400;letter-spacing:0;color:var(--or-mute)}
.or-face-b li:first-child{color:inherit!important}
.or-face-b li:first-child b{color:#2f7d5e}

/* pricing */
.or-s-pricing{background:var(--or-paper)}
.or-price{height:var(--h);padding:9.6R 9.375R 3R;display:flex;flex-direction:column;gap:2.4R}
.or-price-head{display:flex;align-items:flex-end;justify-content:space-between}
.or-price-head .or-brands-k{margin:0}
.or-price-h{margin:0;font-size:4.2R;font-weight:600;letter-spacing:-.05em;line-height:1;text-transform:uppercase;color:#1c4038}
.or-price-cards{flex:1;display:grid;grid-template-columns:repeat(4,1fr);gap:1.2R;min-height:0}
.or-plan{position:relative;display:flex;flex-direction:column;gap:.8R;padding:2R;border-radius:2R;background:#1c4038;color:#eae1c9;overflow:hidden;transition:transform .5s cubic-bezier(.2,.7,.2,1)}
.or-plan:hover{transform:translateY(-.6R)}
.or-plan.is-hot{background:#b1da96;color:#1c4038}
.or-plan-tag{align-self:flex-start;margin-bottom:.2R;font-size:.7R;font-weight:700;letter-spacing:.1em;text-transform:uppercase;padding:.35R .7R;border-radius:2R;background:#1c4038;color:#b1da96}
.or-plan small{font-size:.85R;font-weight:700;letter-spacing:.1em;text-transform:uppercase;opacity:.8}
.or-plan b{font-family:"Bricolage Grotesque",sans-serif;font-size:3R;font-weight:500;letter-spacing:-.04em}
.or-plan ul{margin:.4R 0 0;padding:0;list-style:none;display:flex;flex-direction:column;gap:.5R;font-size:.92R;line-height:1.35;flex:1}
.or-plan li{padding-left:1.2R;position:relative}
.or-plan li::before{content:"+";position:absolute;left:0;opacity:.6}
.or-plan-go{align-self:flex-start;display:inline-flex;gap:.5R;font-size:.95R;font-weight:500;border-bottom:1px solid currentColor;padding-bottom:.2R}

/* contact extras + case links */
.or-contact-sub{display:block;margin-top:1.2R;font-size:1.1R;line-height:1.4;color:var(--or-mute);letter-spacing:-.01em}
.or-contact-meta{display:flex;flex-wrap:wrap;gap:1.4R 2.6R;margin-top:1.6R}
.or-contact-meta>span{display:flex;flex-direction:column;gap:.3R;font-size:1R}
.or-contact-meta small{font-size:.8R;color:var(--or-mute)}
.or-cs-link{display:flex;justify-content:space-between;align-items:center;gap:1R;padding:1.4R 1.8R;border-radius:1.4R;background:#1c4038;color:#eae1c9;transition:background-color .3s}
.or-cs-link:hover{background:#2f6b57}
.or-cs .or-cs-link,.or-cs .or-cs-link b,.or-cs .or-cs-link span{color:#eae1c9}
.or-stack .or-cs-link{flex-direction:column;align-items:flex-start;gap:.4R}
.or-stack .or-cs-link b{text-align:left}
.or-cs-link span{font-size:.85R;opacity:.8;flex:none;white-space:nowrap}
.or-cs-link b{font-size:1.1R;overflow-wrap:anywhere;text-align:right}

/* ---- stacked: phones, touch, reduced motion ---- */
.or-stack .or-header{position:fixed;padding:1.2R 1.25R;background:rgb(255 255 255 / .78);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);transition:color .3s,background-color .3s}
.or-stack .or-header[data-tone=dark]{background:rgb(8 8 9 / .62)}
.or-stack .or-nav,.or-stack .or-talk{display:none}
.or-stack .or-logo{font-size:1.6R}
.or-stack .or-home{min-height:0;padding:7R 1.25R 2R}
.or-stack .or-hero{font-size:1.9R;line-height:1.2}
.or-stack .or-home-meta{flex-wrap:wrap;gap:1.4R}
.or-stack .or-deck-pill{margin-left:0}
.or-stack .or-eye-wrap{display:none}
.or-stack .or-reel-track{height:auto;padding:0 1.25R}
.or-stack .or-reel{position:relative;height:auto;aspect-ratio:4/5}
.or-stack .or-reel-mask{clip-path:inset(0 round 1.2R)}
.or-stack .or-reel-cap{left:1.2R;bottom:1.2R}
.or-stack .or-play{top:50%;margin-top:-2.7R}
.or-stack .or-about-track{height:auto!important}
.or-stack .or-s-about .or-stage{position:relative;height:auto;overflow:visible}
.or-stack .or-about-row::after{display:none}
.or-stack .or-about-row{position:relative;top:0;flex-direction:column;padding:4R 1.25R 2R;gap:1.2R;transform:none!important}
.or-stack .or-about-h{width:auto;font-size:2.6R;margin:0 0 1R;align-self:flex-start}
.or-stack .or-card{width:auto;height:auto;min-height:30R;border-radius:1.2R;padding:13R 1.4R 1.6R}
.or-stack .or-card-pill{left:1R;right:1R;width:auto;height:10.5R;top:1R}
.or-stack .or-card h3{font-size:1.75R}
.or-stack .or-card p{font-size:.95R}
.or-stack .or-num{font-size:2.4R;right:1.4R;bottom:1.4R}
.or-stack .or-make-track{height:calc(var(--h) * 3.4)}
.or-stack .or-make-word{left:1.25R;font-size:3.6R;margin-top:-2R}
.or-stack .or-mock,.or-stack .or-tag,.or-stack .or-cur{zoom:.34}
.or-stack .or-cur{zoom:.6}
.or-stack .or-tag{zoom:.7;top:calc(var(--h) / 2 / .7 + 10.5R)}
.or-stack .or-cube{translate:0 0 -8.5R}
.or-stack .or-mock{top:calc(var(--h) / 2 / .34 - 19R)}
.or-stack .or-people-track{height:calc(var(--h) * 3)}
.or-stack .or-people-h{font-size:1.6R;line-height:2.6R}
.or-stack .or-gap{height:2.6R}
.or-stack .or-ava{padding:.15R}
.or-stack .or-ava>*{width:1.9R;height:1.9R;margin-left:-.45R;border-width:.1R}
.or-stack .or-ava b{font-size:.6R}
.or-stack .or-fly{width:11R;height:8R}
.or-stack .or-fly1{right:1R;width:9R;height:11R}
.or-stack .or-fly2{left:8R}
.or-stack .or-quote-track{height:calc(var(--h) * 2)}
.or-stack .or-qmark{left:1R;top:5R;font-size:8R}
.or-stack .or-q{left:1.25R;right:1.25R;width:auto;top:11R;font-size:2.1R}
.or-stack .or-ring-c{width:14R;height:14R;right:-8R}
.or-stack .or-qbar{right:1.25R;top:auto;bottom:12R;height:7R}
.or-stack .or-qcap{left:1.25R;right:3R;width:auto;bottom:4R;text-align:left}
.or-stack .or-work-track{height:auto}
.or-stack .or-work{position:relative;height:auto;min-height:44R}
.or-stack .or-work-k{left:1.25R;top:5R}
.or-stack .or-car-ring{top:20R}
.or-stack .or-car-card{left:-10.5R;top:-7.5R;width:21R;height:15R;transform:translateX(calc(var(--d) * 22.5R)) scale(calc(1 - min(1, max(var(--d), -1 * var(--d))) * .12))}
.or-stack .or-car-title{left:1.25R;top:27R;font-size:2.4R}
.or-stack .or-car-foot{left:1.25R;bottom:3R;gap:1R}
.or-stack .or-thread,.or-stack .or-slit,.or-stack .or-hand{display:none}
.or-stack .or-proof-track{height:calc(var(--h) * 2.2)}
.or-stack .or-cube{width:17R;height:17R}
.or-stack .or-face-a{transform:translateZ(8.5R);font-size:1R}
.or-stack .or-face-b{transform:rotateY(90deg) translateZ(8.5R);font-size:1.65R}
.or-stack .or-blob{display:none}
.or-stack .or-rope-track{height:calc(var(--h) * 2.6)}
.or-stack .or-rope-line{width:auto;left:1.25R;right:1.25R;margin:0;top:6.5R;font-size:1.5R}
.or-stack .or-idea{font-size:2.6R;margin-top:-3R}
.or-stack .or-squircle{width:20R;height:14R;border-radius:4.5R}
.or-stack .or-rope-line{top:6.5R}
.or-stack .or-contact{grid-template-columns:1fr;padding:7R 1.25R 3R}
.or-stack .or-contact-h{font-size:1.75R}
.or-stack .or-contact-h .or-contact-face{width:2.3R;height:2.3R}
.or-stack .or-sheet-open{display:inline-flex;margin-top:2.4R;align-self:flex-start;background:var(--or-ink);color:var(--or-paper);border-radius:3R;padding:1R 2R;font-size:1R;font-weight:500}
.or-stack .or-sheet{position:fixed;left:0;right:0;bottom:0;z-index:70;max-height:88svh;overflow:auto;background:var(--or-paper);border-radius:1.6R 1.6R 0 0;padding:3R 1.25R 2R;box-shadow:0 -1R 4R rgb(0 0 0 / .15);transform:translateY(105%);transition:transform .5s ease}
.or-stack .or-sheet.is-open{transform:none}
.or-stack .or-sheet-x{display:grid;place-items:center;position:absolute;right:1R;top:.8R;width:2.6R;height:2.6R;border-radius:50%;background:var(--or-line);font-size:1.4R}
.or-stack .or-form-row{grid-template-columns:1fr;gap:1.4R}
.or-stack .or-chip{padding:.7R 1.1R}
.or-stack .or-submit{padding:1.2R 2.4R!important}
.or-stack .or-foot{padding:3R 1.25R 6R}
.or-stack .or-foot-big{font-size:6R}
.or-stack .or-foot-m{width:5.6R;height:4R}
.or-stack .or-foot-row{flex-wrap:wrap;gap:1.4R}
.or-stack .or-menu{position:fixed;grid-template-columns:1fr;padding:7R 1.25R 2R;gap:2R;align-content:start}
.or-stack .or-menu-prev{display:none}
.or-stack .or-menu-links{order:-1;font-size:2.4R}
.or-stack .or-float{position:fixed;right:1R;bottom:1R}
.or-stack .or-flash,.or-stack .or-jump{position:fixed}
.or-stack .or-case-track{height:auto}
.or-stack .or-case{position:relative;height:auto;padding:5R 1.25R 3R;display:flex;flex-direction:column;gap:2R}
.or-stack .or-case-l{position:relative;left:auto;top:auto;width:auto}
.or-stack .or-case-h{font-size:4.4R}
.or-stack .or-case-sub{font-size:1R}
.or-stack .or-case-rail{display:none}
.or-stack .or-case-stack{position:relative;left:auto;top:auto;width:auto;height:auto;display:flex;flex-direction:column;gap:1.2R}
.or-stack .or-tilt{position:relative;inset:auto;aspect-ratio:4/3;transform:none!important;filter:none!important}
.or-stack .or-tilt figcaption{left:.8R;right:.8R;bottom:.8R;padding:.7R .9R}
.or-stack .or-brands{height:auto;padding:5R 1.25R 3R}
.or-stack .or-brands-h{font-size:2R}
.or-stack .or-flow-item{height:5R}
.or-stack .or-flow-link span{font-size:2.2R}
.or-stack .or-flow-link small{display:none}
.or-stack .or-stats{grid-template-columns:1fr 1fr;gap:1.4R}
.or-stack .or-stat b{font-size:3R}
.or-stack .or-shelf{height:auto;display:flex;flex-direction:column;gap:.8R;padding:5R 1.25R 1R}
.or-stack .or-shelf-k,.or-stack .or-shelf-h,.or-stack .or-shelf-sub{position:relative;left:auto;right:auto;top:auto;width:auto;text-align:left}
.or-stack .or-shelf-h{font-size:2.4R}
.or-stack .or-shelf-sub{font-size:.9R}
.or-stack .or-shelf-g{position:relative;top:auto;left:auto;right:auto;bottom:auto;height:30R;margin:0 -1.25R}
.or-stack .or-press{height:6R}
.or-stack .or-rate-k{color:var(--or-mute)!important}
.or-mail-big{font-size:1.1R}
.or-stack .or-home::before{right:-6R;top:4R;width:22R}
.or-stack .or-home::after{display:none}
.or-stack .or-swallow{display:none}
.or-stack .or-float .or-metal-p,.or-stack .or-float .or-metal-o+.or-metal-o{display:none}
.or-stack .or-float .or-metal-o{width:2.8R;height:2.8R}
.or-stack .or-card h3{font-size:1.7R}
.or-stack .or-card p{font-size:.95R;max-width:none}
.or-stack .or-card-tag{font-size:.7R}
.or-stack .or-card-pill.is-type span{font-size:3R}
.or-stack .or-car-view{font-size:.75R;right:.8R;bottom:.8R}
.or-stack .or-pill-btn{margin-top:1.4R}
.or-stack .or-moods{grid-template-columns:1fr;min-height:0;padding:5R 1.25R 3R;gap:1.8R}
.or-stack .or-moods-h{font-size:2.4R}
.or-stack .or-seg{grid-template-columns:repeat(3,1fr);display:grid;width:100%}
.or-stack .or-seg-bg,.or-stack .or-seg-hv{width:calc((100% - .7R) / 3)}
.or-stack .or-moods-copy h3{font-size:2.6R}
.or-stack .or-moods-art{height:24R;order:-1}
.or-stack .or-moods-ring{width:22R;height:22R}
.or-stack .or-moods-art img{width:16R}
.or-stack .or-logo-s{height:auto;padding:5R 1.25R 3R}
.or-stack .or-logo-h{font-size:2.2R}
.or-stack .or-logo-head{flex-direction:column;align-items:flex-start;gap:.6R}
.or-stack .or-bento{grid-template-columns:1fr 1fr;grid-template-rows:none;grid-auto-rows:auto;grid-template-areas:"a a" "b b" "c d" "q q" "s1 s2"}
.or-stack .or-bt-a{aspect-ratio:16/10}
.or-stack .or-bt-c,.or-stack .or-bt-d{aspect-ratio:1}
.or-stack .or-bt-b{padding:1.4R}
.or-stack .or-bt-b p{font-size:1R;margin-bottom:1R}
.or-stack .or-bt-q b{font-size:1.8R}
.or-stack .or-bt-q small{margin-bottom:1R}
.or-stack .or-bt-sw{min-height:8R;padding:1R}
.or-stack .or-flow-link i{display:none}
.or-stack .or-velo-s{font-size:2.4R}
.or-stack .or-cs-bar{padding:1R 1R 1.6R}
.or-stack .or-cs-top{margin-top:-5.9R}
.or-stack .or-cs-top{padding:5R 1.25R 2R}
.or-stack .or-cs-t{font-size:2.6R}
.or-stack .or-cs-sub{font-size:1R}
.or-stack .or-cs-meta{grid-template-columns:1fr 1fr;gap:1.2R}
.or-stack .or-cs-hero,.or-stack .or-cs-type{margin:0 1.25R;border-radius:1.2R}
.or-stack .or-cs-type{font-size:4.6R;padding:3R 1.6R}
.or-stack .or-cs-body{padding:2.6R 1.25R 2R;gap:1.4R}
.or-stack .or-cs-h{font-size:1.8R;margin-top:1.2R}
.or-stack .or-cs-p{font-size:1R}
.or-stack .or-cs-p.is-lead{font-size:1.3R}
.or-stack .or-cs-q{font-size:1.6R;padding-left:1.2R}
.or-stack .or-cs-pairs,.or-stack .or-cs-list ul,.or-stack .or-cs-cols,.or-stack .or-cs-cols.is-two,.or-stack .or-cs-moods{grid-template-columns:1fr}
.or-stack .or-cs-imgs{gap:.6R}
.or-stack .or-cs-glow{padding:1.8R;font-size:1.1R}
.or-stack .or-cs-foot{padding:1.4R 1.25R 4R}
.or-stack .or-cs-next b{font-size:2R}
.or-stack .or-pre-logo{width:10R;height:7.1R}
.or-stack .or-pre-n{font-size:3R}
.or-stack .or-pre-c small{font-size:.6R;text-align:center;max-width:18R}
.or-stack .or-intro-track{height:calc(var(--h) * 3)}
.or-stack .or-in-ch{height:auto;width:min(140vw,80svh)}
.or-stack .or-in-mark{top:5.4R;right:1.25R;font-size:1.1R}
.or-stack .or-in-loc{top:5.6R;left:1.25R;font-size:.7R;max-width:10R}
.or-stack .or-in-hint{left:1.25R;bottom:auto;top:9R}
.or-stack .or-in-copy{padding:0 1.25R}
.or-stack .or-in-h{font-size:2.5R}
.or-stack .or-in-svc{font-size:1.25R}
.or-stack .or-in-logos{bottom:2.4R}
.or-stack .or-svc{height:auto;padding:5R 1.25R 3R}
.or-stack .or-svc-head{flex-direction:column;align-items:flex-start;gap:.6R}
.or-stack .or-svc-h{font-size:2R;text-align:left}
.or-stack .or-svc-cols{grid-template-columns:1fr 1fr;gap:.8R}
.or-stack .or-arch{height:auto;min-height:18R;border-radius:4R 4R 1R 1R;padding:1.6R 1.1R}
.or-stack .or-arch h3{font-size:1.25R}
.or-stack .or-arch p{font-size:.82R}
.or-stack .or-roi{height:auto;grid-template-columns:1fr;padding:5R 1.25R 3R;gap:2R}
.or-stack .or-roi-h{font-size:2.1R}
.or-stack .or-roi-c{grid-template-columns:1fr;padding:1.4R;border-radius:1.6R}
.or-stack .or-roi-c div{align-items:flex-start;order:-1}
.or-stack .or-roi-c b{font-size:3.4R}
.or-stack .or-price{height:auto;padding:5R 1.25R 3R}
.or-stack .or-price-head{flex-direction:column;align-items:flex-start;gap:.6R}
.or-stack .or-price-h{font-size:2.2R}
.or-stack .or-price-cards{grid-template-columns:1fr;gap:.9R}
.or-stack .or-plan{padding:1.6R}
.or-stack .or-face-b{font-size:1R!important;gap:.6R}
.or-stack .or-face-b li small{display:none}
.or-stack .or-proof{--cw:min(80vw,56svh)}
.or-stack .or-cube-wrap{perspective:calc(var(--cw) * 2.6)}
.or-stack .or-cube{width:var(--cw);height:var(--cw);margin-top:0;translate:0 0 calc(var(--cw) / -2)}
.or-stack .or-face-a{transform:translateZ(calc(var(--cw) / 2));font-size:calc(var(--cw) / 15)}
.or-stack .or-face-b{transform:rotateY(90deg) translateZ(calc(var(--cw) / 2));font-size:calc(var(--cw) / 11.5)!important;gap:calc(var(--cw) / 30)}
.or-stack .or-tilt figcaption{flex-direction:column!important;align-items:flex-start}
.or-stack .or-contact-meta{gap:1R 1.6R}
.or-reduced .or-eye-ring,.or-reduced .or-marq>div,.or-reduced .or-skel i,.or-reduced .or-kb,.or-reduced .or-flow-track,.or-reduced .or-in-logos>div,.or-reduced .or-ch-eyes,.or-reduced .or-moods-ring,.or-reduced .or-home::before,.or-reduced .or-home::after{animation:none}
.or-reduced .or-pulse::after,.or-reduced .or-pulse i{animation:none!important}
.or-reduced .or-roll-t>span,.or-reduced .or-menu,.or-reduced .or-menu>*{transition-duration:.01s!important}
.or-reduced .or-idea .or-l{opacity:1}
.or-reduced .or-iw{opacity:1;transform:none;filter:none}
@media (prefers-reduced-motion:reduce){.or-root *{scroll-behavior:auto}}
`)

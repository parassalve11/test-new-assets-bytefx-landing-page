# ByteFX landing — redesign v2

A ground-up rebuild of the bytefx.com homepage, following `../plan.md`.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
```

## Stack

- **Next.js 16** (App Router, Turbopack) — the page prerenders fully static
- **JavaScript / JSX only** — no TypeScript
- **Tailwind CSS v4** — tokens are CSS-first in `app/globals.css` under `@theme`. There is **no `tailwind.config.js`**; adding one will not be read.
- `motion/react` for animation, `lucide-react` for icons, `cn()` in `lib/utils.js`

## Design system

Brand values sampled from the live site, not guessed:

| Token | Value | Use |
|---|---|---|
| `brand` | `#1356BE` | text, icons, hairlines, decorative bars |
| `brand-solid` | `#1356BE` | **fills that carry white type** |
| `go` | `#4CD201` | primary CTA fill |
| `on-go` | `#01061A` | type on green |
| `go-600` | `#3CA800` | green text on a `go-50` tint |
| `ink` | `#01061A` | headings |
| `body` / `muted` | `#47536B` / `#8794A8` | paragraphs / eyebrows |
| `line` / `line-strong` | `#E3E9F2` / `#CBD5E5` | hairlines |
| `canvas` / `surface` | `#FFFFFF` / `#FFFFFF` | page / anything on top of it |
| `alt` / `sunken` | `#F7F9FC` / `#F1F4F9` | alternating bands / inset panels |
| `shell` | `#01061A` | drawer scrims and isolated dark panels |
| `warn-50` / `warn-600` | `#FFF4E5` / `#B45309` | advisory notices |
| `up` / `down` | `#16A34A` / `#DC2626` | market data only |

Typeface is **Poppins** 300–700 via `next/font/google`.

Three rules that carry most of the look:

1. **Nothing sits above the H2.** The kicker line every section used to carry
   ("Markets", "Funding", "Mobile"…) restated the heading directly underneath
   it, so it was a word of chrome on every screen — removed, along with the
   category line on each market tile ("EQUITIES" over "Stocks"). The `eyebrow`
   class stays for labels *inside* a card or table (Min. deposit, Watchlist,
   Method / Withdrawal); that is a different job.
2. **Sections alternate white / `bg-alt`,** broken by the two saturated bands.
   That alternation is the rhythm — no dividers. Adding a section means
   re-checking the run.
3. **Headings are solid.** No gradient on text, and no two-tone accent phrase
   — no coloured word inside a sentence at all. Reference is
   [xtb.com](https://www.xtb.com/int), whose headings carry entirely on size,
   weight and tight tracking. Size and weight are the hierarchy; colour goes
   on CTAs, market data and icons.

   This replaced a blue→green `text-gradient-brand` accent on eight headings
   and a blue-word/green-word pair on three more. **The utilities were deleted
   from `globals.css`, not just unused** — `text-gradient-brand`,
   `text-brand-blue` and `text-brand-green` no longer exist, so the treatment
   cannot creep back one span at a time. The old metrics strip always set its
   figures in solid `ink`; the rest of the page now matches it rather than the
   other way round.

All numbers use `.tnum` (tabular figures) so prices never jitter.

### The saturated band

`Section` takes `bg="brand"` — the deep blue `band-brand`, used once on the
landing page (the platforms section) to break the light run so the page is not
one long scroll of white.

Anything placed on it must use fixed-colour classes (`text-white`,
`border-white/20`, `bg-white/8`, the white `pay-puck`) rather than surface
tokens — `text-ink` on a deep blue band is near-black on near-black.

**Known rhythm bug:** `AccountTypes` and `MobileApp` are both `bg="alt"` and
sit adjacent, so the alternation flattens across two full sections. A band
between them was tried and removed (see Platforms below); if it is ever
fixed, flipping one of the two to white is the cheaper move.

A lime `band-go` was tried for the mobile section and removed — that section is
back on `bg-alt`. Worth knowing if it is ever revisited: white on `#4CD201` is
2.3:1 and fails outright, so a green band has to carry near-black type
(`on-go`), and deepening the green enough to carry white stops it reading as
the brand green at all.

### Light only

**The site has no dark mode, and adding one back is a real piece of work
rather than a flag.** The `data-theme` attribute, the pre-paint resolver
script in `app/layout.jsx`, `@custom-variant dark`, the whole
`:root[data-theme="dark"]` token block, twelve unlayered dark overrides for
the treatments that bake in literal colours (`coin`, `band-brand`,
`arc-wash`, `platinum-*`, `plate-well`, `pay-puck`, `::selection`) and
`components/ui/theme-toggle.jsx` were all removed together. Restoring the
toggle without restoring those overrides gives you a half-inverted page.

What survives, and is worth keeping: every themed value is still a bare
custom property on `:root` mapped onto Tailwind names through `@theme
inline`. So `text-ink`, `bg-surface` and `border-line` remain the single
source of truth for a colour, and a palette change is still a one-line edit.
There is no `dark:` utility anywhere in the tree — the one that existed
(`dark:brightness-[1.55]` on the stocks mark in `Markets.jsx`) went with it.

`brand` and `brand-solid` are now the same hue. They are kept as two names
because they mean two different things at the call site, and collapsing them
would lose that.

## Layout

```
app/
  globals.css        design tokens (@theme) + utilities + reduced-motion killswitch
  layout.jsx         Poppins, metadata
  page.jsx           section order — the comments there are load-bearing
components/
  ui/                primitives: section, button, reveal, count-up,
                     accordion, tabs, navbar-menu, glowing-effect
  site/              the page sections
lib/utils.js         cn()
```

## Icons

Instrument marks are **real logos**, not generic glyphs — that was a specific
client requirement and it is what the original page did too.

- `components/ui/brand-icons.jsx` — 19 brand marks extracted at build time from
  `simple-icons` (CC0). Apple, NVIDIA, Tesla, Google, Meta, Bitcoin, Ethereum,
  Tether, Visa, Mastercard, Apple Pay, and the socials.
- `components/ui/flag-icons.jsx` — country flags from `country-flag-icons`
  (MIT), used for paired FX discs (EUR/USD renders as an EU disc behind a US
  disc).
- `components/ui/asset-icon.jsx` — `InstrumentIcon` maps a symbol to the right
  mark. Add new instruments there so the ticker, bento and watchlist can never
  disagree.

Both source packages are **devDependencies** — the marks are already inlined,
so nothing ships to the browser but the paths actually used. Re-run the
extraction only if a mark needs updating. Amazon, Microsoft and LinkedIn are
not in simple-icons v16 (trademark removals); LinkedIn falls back to lucide.

## Markets: the bento

Five tiles on a twelve-column grid — Forex (7) + Indices (5), then Crypto,
Stocks and Metals & Energy (4 each). Reference: `references/market.png`.

Every tile reads in the same order: the count with its icon, the market, a
short blue rule, one sentence, then the CTA pinned to the bottom-left, with the
artwork bleeding off the bottom-right corner behind all of it. That is what
lets the marks run large without ever colliding with the type — each tile caps
its copy column (`copyWidth` in `MARKETS`) and the artwork starts where it
ends. Indices is the one tile whose CTA is the bare arrow rather than a
labelled pill: the rising bar its medallions are mounted on lands in the
bottom-left corner, exactly where the label would go, and the reference makes
the same call.

**The card surface is near-white, not platinum.** It used to be brushed
platinum, because the marks then in the repo were dark steel cutouts that read
as stickers on flat white and needed a metal ground under them. The current
set is saturated — gold bars, a green NVIDIA chip, blue orbit trails — and
colour of that strength on grey goes muddy, so `market-plate` is white with a
cool bottom edge and the only tint is a whisper of brand blue pooled in the
bottom-right corner under the mark. `platinum-wash` on the section then has to
be a shade *cooler* than the cards, or the bento dissolves into the page;
`platinum-plate` and `platinum-grain` are no longer used by anything.

**Marks.** `indices.webp`, `CrypoCurrency.webp`, `stocks_metal.webp` and
`gold_and_sliver.webp` are the delivered renders, converted (see “Asset
formats”). The clip was derived:

| Asset | Derived from | How |
| --- | --- | --- |
| `forex_coins.webm` + `.webp` poster | `media-source/forex_coins_source.mp4` | Rendered transparency checkerboard keyed back out to a real alpha channel, cropped to content, scaled to 816×540, encoded VP9 `yuva420p`. 3.5 MB → 1.6 MB. |

**The clip now carries real alpha, and that is the whole design.** The source
is a "transparent background" stock render whose transparency was flattened
into the pixels as an editor checkerboard — two flat greys in ~26px squares.
A luma key cannot lift it: the coins are silver, so their own mid-greys land
on the board's greys and the key bites holes through the rims and faces. The
pass that does work is in `scripts/key-checkerboard.py`, and it is three
stages — learn the board per pixel from the frames where each pixel is
uncovered, key against that plate and repair the bite marks morphologically,
then *demodulate*: an empty pixel still carries the board's ±swing and nothing
the coins cover does, which is the only test that tells a dark coin face from
genuine emptiness. Re-run it as:

```sh
python scripts/key-checkerboard.py media-source/forex_coins_source.mp4 \
  public/assets/forex_coins.webm --crop 1088:720:100:0 --scale 816:540 \
  --crf 42 --poster public/assets/forex_coins_poster.webp
```

`-auto-alt-ref 0` in that script is load-bearing: libvpx silently drops the
alpha stream without it. Note also that ffmpeg cannot *decode* WebM alpha, so
`ffmpeg -i out.webm` will report `yuv420p` and an alphaextract will come back
solid — check the result in a browser, not in ffmpeg.

**What the alpha bought.** The old opaque cut was baked onto `#EDEBE9` and the
card had to be built around hiding that: `.forex-plate` washed the same tone
across its right half so the clip's background and the card were
indistinguishable, and below `sm` the clip's own panel carried the tone.
All of that is deleted. The Forex tile now wears the ordinary `market-plate`
and the clip is a corner mark exactly like the other four — same bleed off the
bottom-right, same `metal-float` drift, same hover scale — and, because there
is no baked tone left, it works unchanged on the dark card, which the old cut
never could. Below `sm` the card stacks and the clip becomes a full-bleed band
of its own between the copy and the CTA, where a corner mark would be squeezed
behind the pill.

It is `preload="none"`, played and paused by an IntersectionObserver, and never
fetched at all under reduced motion, where the transparent poster is the whole
story.

## Asset formats: WebP and WebM everywhere

Every raster asset under `public/assets` is WebP and every clip is WebM. The
raster pass converted 39 PNG/JPEG files, **49.6 MB → 5.0 MB**, encoding each
one both lossy (q84) and lossless and keeping whichever came out smaller —
which picks lossy for the renders and would pick lossless for anything flat
enough to deserve it. Alpha is preserved. The originals are deleted, not left
beside the conversions.

What is deliberately *not* WebP: `bytefx-app-qr.svg` and the 265 flags in
`public/assets/flags/`, which are vectors and are already smaller and sharper
than any raster of them would be.

`media-source/` holds the delivered mp4 that `forex_coins.webm` was cut from.
It sits outside `public/` on purpose — nothing under `public/` is shipped that
the site does not use.

## Trading conditions: the metallic carousel

`components/site/Conditions.jsx`, directly under Markets. Replaces
`MetricsStrip`, which is deleted.

The strip rendered the same five numbers as hairline-separated columns. That
was right when it sat directly under the hero and had to stay quiet; as a
section in its own right it read as a footer that had drifted up the page.
These are the five things somebody actually compares between brokers, so they
now get room to be compared — and they sit under Markets rather than under the
hero, because the numbers land better once the reader knows what is traded.

**Reference** is XTB's "Choose your way to understand the market" carousel,
saved at `ref/image.png`. Borrowed: the shape of the interaction, and the idea
that the product art carries the card. Like that reference, all five cards now
share one quiet platinum surface; the numbers and metallic artwork provide the
visual differences instead of unrelated background colours.

### Geometry — measured, not guessed

`ref/image.png` was measured directly rather than eyeballed. The card is
**711 × 314 in an 869-wide frame**:

| Property | Reference | Here |
| --- | --- | --- |
| Card width | 82% of frame | `lg:w-[82%]` |
| Card aspect | 2.26 : 1 | `lg:min-h-[440px]` |
| Art width | ~44% of card | `lg:max-w-[400px]` |
| Next card | peeks at the right edge | same, a consequence of 82% |

The first attempt used `(100%-2rem)/2.4` — a 41% card with 240px art, **less
than half the reference in both dimensions**, which is why it read as a tile
rather than a panel. **If this is re-tuned, keep the card near 82% and the art
above 360px.** The size is the design; shrink either and it stops being this
section.

### Platinum fills

Every card uses the same light platinum gradient from `globals.css`. Dark copy
is shared across the run, including a stronger label tint for readable
contrast.

A narrow highlight crosses a card once when it becomes active or when an
inactive card is hovered. It does not loop, sits behind all content and artwork,
and is removed entirely under reduced motion. The carousel remains the source
of interaction; the sheen is only a quiet response to that state.

**The cursor** is the pill under the track. The active card is a bar rather
than a dot, so it reads as a position along a run instead of five equal
options. It advances every 2s (`DWELL_MS`) and pauses on hover, focus or
touch. **Scroll-snap does the actual paging** — the track is a plain
scrollable region that works with trackpad, swipe, scrollbar and keyboard
whether or not the JS runs, and the cursor is a control over that rather than
a replacement for it. Scroll position is the source of truth for which card is
*shown* (via `IntersectionObserver`), so a manual swipe and an automatic
advance update the cursor through the same path and cannot disagree.
Auto-advance never runs under reduced motion.

**Why the run has a second piece of state.** At the original 5s dwell the
timer could simply read the observed index and add one. At 2s it cannot: the
smooth scroll is usually still in flight when the next tick fires, and the
last-to-first wrap scrolls back across cards 3, 2 and 1, so the observer
reports each of them in turn and a `+1` on the observed index would reverse
the run mid-wrap. `targetRef` holds where the run is heading and `settledRef`
records whether the scroller has arrived; the timer advances the target, and
the observer only re-seats the target once it has caught up — which is what a
genuine user swipe does. The order is therefore always 0→1→2→3→4→0.

**Assets.** The five renders were supplied as 1254px PNGs totalling 8.35 MB.
They are converted to 620px WebP (358 KB total, a 23× saving) and the
component references the `.webp` files. The source PNGs are deleted. Re-run the
conversion if a render is ever replaced; 620px covers a 2× DPR at the ~240px
they display at.

### The cursor, in numbers

The run advances on a 2s timer, so the control under it has two jobs: say
where in the five you are, and say that the next one is coming. Five dots did
neither — they read as five equal options, and they showed no time passing at
all, so a card that changed while you were reading it changed for no visible
reason.

It is now five numbers. The one you are on is inked and carries a hairline
meter that fills across the dwell; the ones behind it stay solid because you
have seen them; the ones ahead are light. A `01 / 05` fraction closes the pill,
which is the same fact in the form a reader takes in without counting. The same
index is printed at the top of the card itself, so someone who lands mid-run
knows where they are without looking away from what they are reading.

The meter is keyed on the active index, so it remounts and restarts on every
advance rather than resetting a transform. Hovering, or moving focus into the
track, pauses the run — and pauses the meter with it (`animationPlayState`),
because a clock that keeps running while the thing it is timing has stopped is
worse than no clock. It is not rendered at all under reduced motion, where the
run does not advance by itself and the meter would be measuring nothing.

**The card body was re-laid at the same time.** The label, the number and the
sentence used to be one block floating in the vertical middle of a 460px panel,
which left a third of the card empty above and below it. The index and label
now pin to the top of the copy column and the number centres in what is left,
so the panel is a composition rather than a box with something in the middle
of it.

### The terms grid underneath

Four hairline-framed cells below the carousel (`TERMS`), each a **bold**
one-line statement with a supporting sentence and a green rule that extends on
hover: no internal deposit fee, negative balance protection, segregated client
funds, one balance across every market.

The carousel prints the numbers — 1:2000, 0.1 pips, 150+, ~20ms, 24/6. The
grid prints the terms those numbers sit inside, which is the other half of the
same question and reads badly as a sixth card. It is a grid rather than more
cards precisely because these are flat statements with no artwork and no
sequence: nothing here needs to be paged through.

**Nothing in it is a new claim.** All four lines already appear on the site —
three in `WhyByteFX.jsx` (which is not rendered on the landing page, so there
is no on-page repetition) and one in the instruments card copy. Do not add a
fifth line here that is not substantiated somewhere else first.

It reflows 1 → 2 → 4 columns, and the cell borders are switched per breakpoint
(`sm:[&:nth-child(-n+2)]:border-b`, `sm:[&:nth-child(odd)]:border-r`,
`xl:border-b-0!`) so the frame stays a single hairline lattice at every width
rather than leaving a stray edge.

## Account types

`components/site/AccountTypes.jsx`. Three cards: Standard, Pro (badged "most
chosen", raised 12px at `lg`), and Raw.

**Raw is not a third spec column and no longer pretends to be one.** Its
pricing is negotiated on volume, so there is no honest figure for a "min.
deposit" slot and no spec row that means the same thing as its neighbours'.
The card used to render the full spec list anyway, blurred behind a frosted
overlay, with the real message — "Pricing built around your volume" — revealed
on hover. That hid the offer behind an interaction, printed figures nobody was
meant to read, and left every touch user looking at a smudge.

It is now stated plainly: eyebrow where the other two put their name, the offer
where they put their price, four proof points where they put their spec list,
and one CTA to contact. The four points are the Raw specs that still mean
something without a deposit tier attached (0.0 pips, $8 round turn, swap-free,
MT5 from 0.01 lot); the rest are not printed because they do not apply.

What marks it out as the different one is the border: `GlowingEffect` traces a
brand-hued arc around its edge that follows the cursor and lights up as the
pointer nears the card. See "The two Aceternity components".

Cards stretch to a common height (`lg:items-stretch`) so the three CTAs land on
one baseline — with the spec list gone, Raw is the short card and would
otherwise float 240px above its neighbours' buttons.

**The "Compare every specification side by side" dropdown is deleted**, along
with `AccountTypes.module.css`, which existed only for the blur overlay. The
table restated, behind a click, the two spec lists printed in full directly
above it, and once Raw stopped carrying a spec column there was no third column
left for it to compare.

## Funding: the marks, not the render

`components/site/Funding.jsx`.

This was a heading on the left and one composite render on the right — a
picture of eight payment marks, cropped square, with Visa sliced off one edge
and UPI off the other. It said "we take cards" and nothing else, the marks it
showed could not be read at a glance, and 1.9 MB of PNG carried a single
sentence's worth of information.

`public/assets/payment_methods/` already shipped every logo cut out
individually, and **none of them were used**. Each one now gets its own card —
white `pay-puck`, the name, and the one fact a reader actually wants beside it:
how long the deposit takes. Six cards, six answers, and every card is a link
into `/funding`.

### The band

It is the site's **second** dark band, carrying the hero's treatment layer for
layer: `hero-tools`, `hero-tools-grid`, `hero-scrim`, `hero-bloom`. Change the
hero band and this changes with it.

Two reasons, and the first one is rhythm. Everything between Markets and the
close is a long light run — conditions, showcase, accounts, mobile — and
funding is the last section before the close, which is exactly where that run
needs breaking. Reusing the hero's surface rather than inventing a third one
means the page opens and closes on the same ground.

The second is the marks themselves. Half of them ship fixed colours that
disappear on white — Apple Pay's black wordmark, the navy bank glyph — which
is why each sits on a white `pay-puck`. On a blue band those pucks stop being
patches of white on white and read as objects.

| Layer | What it is |
| --- | --- |
| Backdrop | The composite render, demoted to what it is actually good at. Sits *between* the grid and the scrim, so the scrim dims it behind the headline — the same arrangement that keeps the hero copy legible. |
| Method rail | Six `hero-proof` glass cards, 2 → 3 → 6 columns. |
| Promises | Four glass rows: the $0 fee (green puck, because it is the only one that is a number), instant deposits, back to source, audited processing. |

**The backdrop is deliberately faint** (`opacity-[0.32]`, `pay-backdrop` mask).
The cards underneath show the same six marks at a readable size, so a bright
backdrop puts every logo on the band twice and reads as a mistake rather than
as depth. It also has to sit *wholly inside* the band: the section clips its
own overflow, so anything hanging over the top edge is cut on a straight line
no mask can soften. It is hidden entirely below `md`, where there is no room
for it beside the copy.

**The mark widths are optical, not measured.** Every logo ships inside a
different amount of empty canvas — Visa's wordmark floats in roughly half of
its 1254px square, the Bitcoin coin fills most of its own — so each card sets
its own `markClassName`. That is what makes six very different marks read as
one size in the row. Re-cut an asset and you re-tune its width.

**Two funding facts are stated as fact on this page and no more**: the $0
ByteFX fee, and instant deposits on everything except bank wire (1–2 business
days). Withdrawal windows are deliberately not printed per method — they are
provider- and bank-dependent, the footnote says exactly that, and a number per
card would be the easiest way to put a promise on the page nobody can keep.

## The closing panel

`components/site/FinalCta.jsx` and `FinalCtaVisual.jsx`.

The artwork used to be a translucent white card floating on the section's
`brand-50` ground: a pale rectangle with nothing holding it to the page, which
read as a different component someone had dropped in. It is now a defined box
built from the section's own palette — a `brand-50` → white plate, the
section's `brand-100` hairline, and a three-step `figcaption` strip along the
foot.

Those three steps (open · verify · fund) are the same three the heading
promises, which is what earns the panel its space: it is not decoration, it is
the flow. **The three micro-chips that used to sit under the buttons** — "Free
to open", "No deposit fee", "Verified in minutes" — are gone. Two of them
repeated things the page had already said (Funding prints the $0 fee, the lead
here prints the $20), all three competed with the buttons directly above them,
and the step strip says it better.

## Platforms: MT5 and TradingView

`PlatformSwitch`, **inside** `components/site/MobileApp.jsx` — not a section
of its own, and it should stay that way.

The two are not alternatives, they are two front ends on one balance, and the
mobile band is already making exactly that argument ("one account, every
device"). Two logos do not need a section to repeat it. Picking one swaps the
line underneath, so the whole thing stays two rows tall however many platforms
are listed. Real tabs — click, arrow keys, Home/End — not hover, which would
put the copy out of reach on touch.

**It sits directly under the device shot,** above the feature grid. The
cluster shows the account on tablet, phone and laptop; this is the line that
says which front ends those are. Separating them put a features grid and two
store badges between the claim and its evidence.

**Atlas AI was a third tab here and has been removed.** The switcher's whole
claim is "the same account opens in all of these", and Atlas is not a place
you open an account — it is an assistant. It now lives in its own launcher;
see "Atlas AI" below. Do not put it back.

The marks are real product art in `public/assets/mobile-section/`
(`meta-treader.png`, `treadingview.png`, `atlas.png`), each on a white
`pay-puck` — TradingView's near-black wordmark has no other ground it reads
on. Note the filenames are misspelled as delivered; they are referenced as-is
rather than renamed, so fix them in one place if at all.

**Do not rebuild this as a band section.** It was tried during this pass — a
full `bg="brand"` section above the mobile band — and removed: it duplicated
a component that already existed, with worse marks (lucide placeholders,
because neither MetaTrader nor TradingView is in simple-icons and
`mt5_logo.png` is a marketing composite rather than a cutout).

## The two Aceternity components

Both were shipped as TSX and are **converted to JSX and re-tuned for light mode** here:

- `components/ui/navbar-menu.jsx` — the stock component is a floating dark pill; this is a full-width sticky header. `ProductItem`'s remote-image slot became an icon tile so the menu never depends on a CDN. The `layoutId="active"` shared-layout animation is preserved.
- `components/ui/glowing-effect.jsx` — the stock conic gradient (pink/gold/olive/slate) is swapped for the brand hues. It hosts on the **Raw account card** in `AccountTypes.jsx`, and only there: one card on the page is the negotiated one, and a border that lights up as the cursor approaches says "talk to us" in a way a static outline cannot. Keep it to one host — a second card with a traced edge and neither of them means anything.

## ByteFX × Thailand

`components/site/Thailand.jsx`, between funding and the final CTA. The page's
one saturated, photographic moment.

**It is an IB incentive campaign, not a market-entry section.** An Introducing
Broker whose referred clients trade 500 lots earns five nights in Thailand.
That makes it the last surviving piece of the Partnership section it replaced
("Grow with ByteFX", deleted this pass) — which is why both CTAs point at
`/partnership` and not `/signup`. The audience is brokers; sending them to the
retail signup form would be the wrong door.

The two numbers *are* the offer, so they are set as the section's largest
non-heading type rather than buried in a paragraph. Everything else is
scaffolding around them.

**The lockup sits above the H2, breaking the section rule on purpose.** That
rule exists because every section used to carry a kicker restating the heading
underneath it — a word of chrome on every screen. This is not that: it is a
campaign lockup carrying the brand mark, and the H2 below says something
completely different. Do not reintroduce a text kicker elsewhere on the
strength of this one.

**The logo is the real `Logo.png`, on a white plate.** It sets "Byte" in brand
blue (`#1357BD`), which on this scrim is about 1.6:1 and unreadable. Rather
than recolour the mark, it sits on a `pay-puck` — the same treatment the
funding section gives Visa, Apple Pay and the app QR code, and for the same
reason: a fixed-colour mark gets the ground it was drawn for instead of being
repainted to suit the surface. A knockout variant was built during this pass
and deleted; the plate is the better answer and it is already the house
pattern.

**The terms are incomplete.** The qualifying period, which account types count
toward the 500 lots, whether the five nights include flights, and the campaign
end date are all unspecified. The disclaimer in the component is deliberately
generic — do not ship it as the full terms.

**The image is natural, not architectural** — Mu Ko Ang Thong National Marine
Park. The prize is a holiday, so it should look like one; a Bangkok skyline
was used first and rejected for reading as a business district.

That swap also dropped a licence problem. The skyline shot was CC BY-**SA**,
whose share-alike clause is a poor fit for a commercial site. This one is
© Vyacheslav Argenberg, plain [CC BY
4.0](https://creativecommons.org/licenses/by/4.0/) via Wikimedia Commons, so
**attribution is the only condition** — but it is a condition, not a caption.
Do not remove the credit line, and do not swap the image without replacing the
credit to match.

**It is a bright image**, unlike the dusk skyline it replaced — turquoise
water across two thirds of the frame. White type therefore depends entirely on
the scrim, which is heavier than it would need to be over a darker photograph.
Check any replacement against the copy before swapping it in.

The master is downscaled to 2200px / q72 progressive JPEG (312 KB) and served
through `next/image` with `sizes="100vw"`; it is deliberately not `priority`,
because it sits six sections down and must not compete with the hero for LCP.

**Removed with it:** the `Partnership` and `Community` components are gone,
and the four `"/#partnership"` anchors in `Navbar.jsx` (nav list, menu item,
two `ProductItem`s) plus the one in `Footer.jsx` now point at `/partnership`.
**That route does not exist yet** — and this section now sends traffic to it
twice more, so it is the single most load-bearing gap on the page.

## The hero

The band is one claim, two buttons and three chips centred on a blue field.
Nothing else is allowed in the frame: `Ticker` streams live quotes directly
beneath it, `Conditions` prints
1:2000, 0.1 pips, 150+, ~20ms and 24/6, and `FinalCta` closes with the risk
warning — so the hero's only job is to state the claim and get out of the way.

Three sections below it dictate the shape:

| Section | What it already owns | What the hero therefore cannot do |
| --- | --- | --- |
| `Conditions` | 1:2000, 0.1 pips, 150+, ~20ms, 24/6 | Restate the numbers |
| `Ticker` | Live streaming quotes | Carry a second live price widget 900px above the first |
| `FinalCta` | "Start trading in under five minutes", risk warning | Be a CTA block. Labels match deliberately — they bookend the page |

### The background

The same treatment as the **"ByteFX Enhanced Trading Tools" card** in
`TradingShowcase`: `linear-gradient(150deg, #2f66d1, #0c2c78)` under a 42px
white grid at 16%. The stops and the grid pitch are the card's own, lifted
into `globals.css` as `hero-tools` / `hero-tools-grid` so the two surfaces
cannot drift apart — **change one and you change both.** Over them sit
`hero-scrim` (contrast for the white type) and `hero-bloom` (one green light
low in the frame, so the CTA is not the only green pixel on a screen of blue).

The grid is masked to an ellipse rather than the card's horizontal fade.
Full-bleed, a horizontally-masked grid cuts off hard against the navbar at the
top and against the white `Ticker` at the foot.

`hero-scrim` is two gradients because one cannot do both jobs: a centre radial
that pulls the middle of the frame down so the H1 clears contrast over the
lighter end of the gradient, and a linear
that darkens top and bottom — the top so the navbar's white pill has something
to sit on, the bottom so the band meets the white `Ticker` without a bright
seam. It is tinted `#04123a`, not near-black; a neutral scrim greys the blue
out and the band stops matching the tools card.

**This replaced a full-bleed aurora photograph** (`public/assets/hero/aurora.jpg`,
still in the repo and now unused — delete it once this is approved). The
photograph was a licensed stock frame with nothing to do with the product, it
cost ~440 KB on the LCP element, and it needed a heavy scrim to keep the H1
legible. The gradient costs nothing and is on-brand by construction.

There are exactly **two** dark bands on the landing page: this one and
`Funding`, which reuses these same four utilities. The page therefore opens and
closes on the same surface, and everything between them is the white / `alt`
alternation. The hard edge at the foot of this section is the page's first and
strongest contrast — do not soften it with a border, and do not add a third
band without taking one of these two away.

### The composition

The copy stays in one centred column at every breakpoint. The hero does not
render `public/assets/hero/left-side.png` or reserve a second column for it, so
the heading, actions and proof chips keep the same balance on wide screens and
phones.

**Open:** there is no regulator chip. ByteFX Capital Ltd's licence entity and
number need the same compliance sign-off the Trust items are badged for. Add a
fourth `ProofBadge` in `Hero.jsx` once legal confirms — the row is built for
four and currently carries three. The withdrawal-speed line was cut from the lead
copy for the same reason.

## Atlas AI

`components/site/AtlasChat.jsx`, mounted in `app/layout.jsx` so it is on every
page. A launcher pinned to the **bottom-right** of the viewport that opens a
chat panel above itself.

It sat bottom-left for a while, on the argument that the right corner is where
scroll and cookie furniture goes. In practice this site has neither, the
right-hand corner is where every reader already looks for a chat launcher, and
on mobile the right thumb rest is a reason to put a *tap target* there rather
than a reason to avoid it. The column is right-aligned (`items-end`) so the
launcher and the panel share their right edge, and the panel's
`transformOrigin` is its bottom-right corner so it scales out of the button
that opened it. It carries its label ("Ask Atlas AI") on desktop — an unlabelled circle in a
corner is a guess. The panel header uses `hero-tools`, the same gradient as
the hero band and the tools card, so it reads as part of the site rather than
a bolted-on third-party bubble.

**Matching is by word prefix, not substring.** This is the one piece of
`AtlasChat` that is easy to get wrong and was in fact got wrong first time: a
plain `includes` check answered "what is your refund policy" with the
deposit-methods line, because "refund" contains "fund". `prefixMatcher`
anchors each phrase to the start of a word, so `fund` still catches "funding"
and "funds" while "refund" falls through to the fallback — which is where a
question this table cannot answer belongs. Keep that property when you add
entries, and prefer stems (`trade`, `spread`, `fee`) over whole words.

**It is a scripted assistant, not a model.** There is no Atlas endpoint yet.
`KNOWLEDGE` is a lookup table over facts already printed elsewhere on this
site — the account specs in `AccountTypes`, the numbers in `Conditions`, the
funding line in `Funding`, the platforms in `MobileApp`. It invents nothing,
and when a question does not match it says so and hands off to `/support`
rather than guessing. Nothing is persisted and nothing leaves the browser.

The header badge reads **"Scripted demo"** and must keep reading it until this
is wired to a real model. When the endpoint lands: replace `answerFor()` with
the request, keep `KNOWLEDGE` as the seeded suggestions, drop the badge.

Escape closes it, the input takes focus on open, the transcript is a
`role="log"` with `aria-live="polite"`, and the panel footer says in plain
words that the answers are scripted and are not financial advice.

## Signup: the country picker and the phone field

`components/ui/country-select.jsx`, used by `AuthPanel`. Country and phone are
one control in two halves: choosing a country writes that country's dialling
code into the phone field and swaps the phone icon for the country's flag, so
the number is already in international form before anyone types a digit.
Switching country afterwards *replaces* the code rather than stacking a second
one in front of it, and keeps whatever national digits were already typed.

**Why it is not a `<select>`.** A native option cannot carry a flag, and the
emoji flags a `<select>` would have to fall back on do not render on Windows
at all — they come out as two letters. So the picker is a listbox built by
hand, with a filter field, arrow keys, Enter, Escape and click-outside, plus a
hidden input so the surrounding `<form>` still submits a country code.

That hidden input deliberately carries no `required`. A zero-size control
cannot be focused, and the browser refuses to report a validation message it
cannot scroll to — which deadlocks the whole form with nothing on screen. The
signup handler checks for a country itself and puts the message in the same
status strip as the password mismatch.

**The data is generated, not hand-kept.** `lib/countries.js` is written by
`node scripts/generate-countries.mjs`, which reads the flag set out of
`public/assets/flags/`, the calling codes out of `libphonenumber-js` and the
English names out of `Intl.DisplayNames`. Both of those packages are dev
dependencies; the site ships neither. 245 countries survive the intersection
of "has a flag" and "has a calling code". They are stored as tuples rather
than objects because the array is inlined into the client bundle.

All 245 rows are in the DOM whenever the menu is open. That is cheap: the
flags are `loading="lazy"`, so only the dozen on screen are ever fetched, and
the filter runs over a lowercased haystack precomputed at generation time.
Names that *start* with the query sort first, so typing "in" reaches India
before Argentina.

**Theme.** The auth routes render without the site chrome (see `SiteShell`),
so the navbar's theme switch is not on the page. `AuthHeader` carries its own
`ThemeToggle`, restyled to match the "Back to website" pill, on all four auth
routes — signup, login, forgot-password and verify-email.

## Motion contract

- Section entry: `opacity 0→1, y 24→0`, 0.5s, `[0.22,1,0.36,1]`, `once: true`. Use `Reveal` / `RevealGroup` + `RevealItem`.
- Two signature moments only: the ticker's tick-flash, and the phone parallax in the mobile section.
- `prefers-reduced-motion: reduce` disables every reveal, counter, marquee and parallax — enforced both in `globals.css` and per-component via `useReducedMotion()`. Keep it that way.

## Before this goes live

- **`/partnership` does not exist**, and it is now the page's main conversion
  target. Seven links point at it: four in `Navbar.jsx`, one in `Footer.jsx`,
  and both CTAs in the Thailand IB campaign. Build the route before ship.
- **The Thailand campaign terms are incomplete.** Qualifying period, eligible
  account types, whether flights are included, and the end date are all
  unspecified; the disclaimer in `Thailand.jsx` is a placeholder, not the
  terms. See “ByteFX × Thailand”.
- The hero ships without a **regulator trust chip** and without a
  withdrawal-speed claim; both need compliance sign-off. See “The hero”.
- Items badged **LEGAL REVIEW** in the Trust section, and the withdrawal
  windows in `Funding.jsx`, need compliance sign-off. The marketing reference
  for the funding section prints INSTANT on crypto/USDT withdrawals; the live
  site says ~1 hour. The conservative number ships — flip it only on sign-off.
- `.rail-path` in `globals.css` is dead: it styled the connector fan of a
  funding layout that no longer exists. Delete it with the next cleanup pass.
- The funding footnote is the only place withdrawal windows are described, and
  it describes them as indicative. If compliance signs off on real per-method
  windows, they belong on the method cards — the shape is already there.
- WebTrader and phone screens are hand-built placeholders; swap for real product captures.
- `components/site/Ticker.jsx` runs a simulated feed. Replace `useSimulatedFeed` with the real socket; the contract is `{ symbol, price, change }`.
- Platform capability lines in `MobileApp.jsx`'s `PLATFORMS` are written from
  what each platform does generally, not from an integration spec. Confirm the
  TradingView broker link.
- **Atlas AI answers are a scripted lookup table**, not a model, and the panel
  says so on its header badge and in its footer. Wire `answerFor()` to the
  real endpoint and drop the badge before anyone treats it as support. Have
  compliance read `KNOWLEDGE` first — it restates account, spread, leverage
  and funding terms in a conversational voice, which is a different review
  surface from the same facts in a spec table.
- Mobile has been audited statically but not viewed on a device. Check 390 / 768 / 1024.
  The funding method rail reflows 2 → 3 → 6 columns and the fee card stacks
  below `sm`; both have been captured headless at 390 but not touched on glass.
- **Seen rendered at ~1440 only.** The hero band, the orbit, the terms grid,
  the two-tab platform switcher and the Atlas panel have all been looked at in
  a browser and behave. Confirmed live: the carousel advances on 2s and wraps
  forwards from the last card to the first (forced to index 4, the next
  reading was index 1, i.e. 4 → 0 → 1), and Atlas returns the fallback for
  "what is your refund policy" rather than the funding answer.
- **Mobile has still not been viewed.** The verification browser was running
  at ~33% page zoom, so a 390px window still laid out as desktop and the
  narrow breakpoints could not be exercised. Check 390 / 768 before ship — in
  particular the hero orbit against the copy column, where the ellipse is
  sized off `min(1500px, 168vw)` and has only been reasoned about below
  `sm`, and the Atlas panel, which is `w-[min(370px,calc(100vw-2rem))]`.
- Still unverified by eye: the white type and logo plate over the Ang Thong
  photo, and the Atlas launcher against the footer at the very bottom of the
  page.
- The Markets video has not been watched playing in a browser — the verification tab was backgrounded throughout, and Chrome will not decode media there. Wiring, poster, encode and first frame are all confirmed; **watch it loop once** before shipping.

# Craft notes, gotchas & extending the template

## Techniques already in the template (reuse, don't reinvent)
- `anim.ts`: `ease()` (eased 0→1 between frames), `sp()` (spring with delay), `shake()` (decaying camera shake), `hash()`, `lerp()`, `pointAt()` (null-safe path point).
- `components/Text.tsx`: `Kinetic` per-character rise + de-blur + fade (with `gradient` per-char colouring and staggered `exitAt`), `Eyebrow`, `Header`, `Counter` (ease-out quart), `Illustrative` tag.
- `components/Particles.tsx`: noise-driven depth bokeh with `burst` (explode from a point) and `converge` (collapse into a point).
- `components/Overlays.tsx`: `GrainVignette` (feTurbulence re-seeded per frame), `LightSweep` (screen-blended light leak), `Flash`.
- `components/Background.tsx`: noise-drifting mesh gradient + scrolling perspective grid floor.
- `components/Brand.tsx`: `Logo` (image with masked shine, or gradient wordmark fallback), `BrandMark` (icon or monogram).
- `components/Glass.tsx`: `cardStyle()` (lit-edge glass card), `Pill`, `Bar` (UI skeleton).
- `components/Transitions.tsx`: `zoomThrough` CSS transition. Also used: `pushCut`, `fade` from `@remotion/transitions`.
- Motion blur: `<CameraMotionBlur samples={6}>` around fast-moving layers only (it renders children N times).
- SVG path drawing: `evolvePath(progress, d)` → strokeDasharray/offset; comet head via `pointAt`.
- 3D: parent `perspective`, child `rotateX/Y` + `translateZ`; depth-of-field = blur by z; `-webkit-box-reflect` for floor reflections.
- Audio: every scene exports `<type>Cues(cfg)`; `Video.tsx` offsets them by scene start and adds a whoosh at each cut. `trim` (= `trimBefore`) aligns a riser's END with a hit.

## Verified gotchas (each one bit us once)
1. **Shader transitions** (`zoomBlur`, `crossZoom`, `filmBurn`, `linearBlur`, `dreamyZoom`, `blurSlide`) use Chrome's experimental HTML-in-canvas — avoid in renders. CSS ones are safe: `fade`, `slide`, `wipe`, `pushCut`, `flip`, `clockWipe`, `iris`, plus our `zoomThrough`.
2. **Never `linear` motion** — always `sp()` or eased `interpolate`; linear reads as cheap.
3. **Text wrapping**: long titles in fixed-width cards wrap and overflow. Everything card-bound is `whiteSpace: "nowrap"`; if it clips, shorten the copy in `story.ts`.
4. **Cards clip under 3D**: a card clamped inside the frame can still project outside once the parent is rotated/panned. Keep ≥150 px margin on rotated layers.
5. **Neighbouring cards overlap** when stages are dense: Journey alternates cards above/below; more than 7 stages won't fit.
6. **`white-logo.png` may not be white** — always Read the image. Transparent PNG with dark ink on a dark background is invisible; use the colour logo, or a CSS `filter: brightness(0) invert(1)` on it as a last resort.
7. **Gradient text + per-char transforms**: `background-clip: text` breaks on transformed child spans — `Kinetic` colours each char instead; use `background-clip` only on a single untransformed element (the wordmark, the Chaos "answer").
8. `getPointAtLength` is typed nullable → use `pointAt`.
9. `Audio` prop is `trimBefore` (not the deprecated `startFrom`).
10. **Bundle once, then stills**: `npx remotion bundle` then `npx remotion still build Main …`; re-bundle after every source change (stills from a stale `build/` show old code).
11. Render stills at `--scale=0.5` for review; they're 4× faster and still legible.
12. `backdrop-filter` and `CameraMotionBlur` are the expensive bits; if a render is slow, drop `samples` to 4 or use `cardStyle(color, { solid: true })`.
13. Windows: no system ffmpeg needed (Remotion ships one). If `build/`/`out/` is locked, close the Studio/player.
14. Don't use `Math.random()` — use `random(seed)` from remotion or `hash()`; renders are parallel and must be deterministic.
15. Keep durations ≥ ~80% of scene defaults — internal animations are frame-timed.

## Adding a new scene type
1. `src/types.ts`: add `export type FooScene = Base & { type: "foo"; …fields }` and add it to the `SceneConfig` union.
2. `src/scenes/Foo.tsx`: export `Foo: React.FC<{ cfg: FooScene; index: string }>`, `fooDur` (frames) and `fooCues(cfg): Cue[]`. Use `Header` for the eyebrow/title, `cardStyle`, `tone()`, `sp/ease`. All motion from `useCurrentFrame()` only.
3. `src/Video.tsx`: add a `case "foo"` in `resolve()`; add `"foo"` to `NUMBERED` if it should get an eyebrow number.
4. `scripts/timeline.mjs`: add `foo: <frames>` to `DEFAULTS`.
5. Typecheck, bundle, still-check.

## Changing the look
- Font: in `src/theme.ts`, swap `@remotion/google-fonts/Inter` for the product's Google font (same `loadFont` API).
- Resolution/fps: `W`, `H`, `FPS` in `theme.ts` (all layouts assume 1920×1080; for vertical/social, author a new composition rather than scaling).
- Light theme is NOT supported — the glow/screen-blend aesthetic needs a dark background.

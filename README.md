# Pocket Delvers

**Three dice. One adventurer. One more room.**

A playable, open-source, mobile-first tactical roguelite. It runs entirely in your browser, even offline after the first visit, and is suitable for GitHub Pages with no backend, build step, or paid hosting.

## Gameplay

- **5×5 turn-based tactical encounters.** Enemies telegraph their intended target before you act; moving, shielding and stunning are vital.
- **Three dice each turn.** Assign dice to Move, Strike, Guard, or your hero's unique Special. Stronger dice change your options.
- **Four classes.** Guardian, Arcanist, Ranger, and the unlockable Rogue. Each has a unique ability.
- **Ten-room expeditions.** Choose between regular battles, more dangerous elite fights, campsites, a merchant and treasure rooms; face a final boss.
- **Build variety.** Find relics with gameplay-changing effects; every room earns legacy shards, even on death.
- **Designed for mobile.** Touch-friendly, responsive, installable PWA, custom pixel sprites, optional tiny sound cues.
- **Private to your device.** Saves automatically through `localStorage` and supports JSON export/import. No analytics, accounts, server, ads, purchases or subscriptions.

### Controls

1. Pick a hero to begin.
2. Tap one of your three dice, then an action, then a highlighted tile or enemy. Guard uses a dedicated confirmation button.
3. When you spend all three dice (or select *End turn*), enemies resolve the actions they telegraphed at the start of your turn. Red cells show targeted tiles.
4. Win encounters to select relics, choose your next route and progress toward Room 10.

On a keyboard: `1`, `2`, `3` choose dice; `M`, `S`, `G`, `E` select actions; arrow keys move; Enter ends the turn.

## Running locally

No external dependencies. Serve this directory from a local HTTP server:

```bash
python3 -m http.server 5173
```

Open `http://localhost:5173` in your browser. (The `npm run dev` script also starts the server.)

## Publishing on GitHub Pages

The source is already committed to [joaodperes/Pocket-Delvers](https://github.com/joaodperes/Pocket-Delvers). The deployable game lives on `main`; future changes should be developed on `dev` and merged through pull requests.

**One-time setup:** In the repository open **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**, select **main** and **/ (root)**, then click **Save**.

After GitHub Pages finishes publishing, the game should be available at **https://joaodperes.github.io/Pocket-Delvers/**. This URL only works after Pages is enabled and deployment succeeds. Subsequent pushes to `main` will republish automatically; pushes to `dev` will not.

On iPhone, open the site in Safari and tap **Share → Add to Home Screen**. After the initial successful visit, the service worker can make the game available offline. Saves are local to each browser; use JSON export/import to move progress.

The included GitHub Action `.github/workflows/check.yml` runs syntax and game-rule tests on updates to `main`, `dev`, and pull requests.

## Tests

```bash
npm test
```

Tests cover combat movement, enemy telegraphs, dice consumption, potion use, room progression, unlocks, and save-file loading.

## Project files

- `engine.js` — pure game rules, state, combat, progression and persistence validation.
- `app.js` — DOM rendering, input, save/export/import and audio.
- `styles.css` — touch-first responsive interface.
- `assets/*.png` — handcrafted generated pixel sprites and app icons.
- `manifest.webmanifest`, `sw.js` — installable/offline PWA.
- `tests/engine.test.js` — rule tests.
- `make_sprites.py` — optional script to regenerate the included sprites using Pillow.

## Limitations & roadmap

This is a complete **first playable**, not a fully balanced commercial release. Future iterations could add more enemy types, daily seeded runs, hero talent choices, boss phases, combat animations, dungeon events, statistics and accessibility refinements. Game saves are browser-specific until exported.

## License

MIT — see [LICENSE](LICENSE).
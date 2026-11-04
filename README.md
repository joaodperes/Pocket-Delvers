# Pocket Delvers

**Three dice. One adventurer. One more room.**

Pocket Delvers is a mobile-first, turn-based tactical dice roguelite made for GitHub Pages. It runs as a static browser game without a backend or paid hosting. Version **0.2** adds readable combat numbers, meaningful movement rolls, rerolls, custom dice, and a character pack.

## Play

1. At the guild, choose a hero and configure three dice in the **Dice Forge**. The default dice have faces `1,2,3,4,5,6`.
2. During a fight, pick a die and an action. Buttons preview the **exact movement range, direct damage, or guard** for that die. Then tap a highlighted tile or enemy. Guard is confirmed separately. Each die can be spent once.
3. **Movement:** a die showing N lets you move along a traversable path of **up to N tiles** (so a 1 moves 1, a 2 moves 2, and so on). You may stop early. The Windstrider Boots add +1. Walls and enemies block routes. Movement is orthogonal, not diagonal.
4. **Strike:** adjacent only (Manhattan range 1); damage is `2 + ceil(die/2)` plus weapon bonuses and applicable relic/die synergies.
5. **Guard:** grants `die + 1` shield plus applicable modifiers. The Guardian gets an extra +2. Shield absorbs incoming attack damage for the current round.
6. **Specials:** require a **3+** die. See your hero's ability and exact expected direct damage on the button; chain damage, stun, displacement, or shielding are listed in ability descriptions. Tap enemies to inspect HP, damage, range and next action, or expand **Enemies** under the board.
7. After you spend your dice (or choose **End turn**), enemies resolve their telegraphed attacks and advance. The danger summary shows incoming damage, damage blocked, and HP at risk *from attacks currently targeting your tile*.
8. Reach room 10, collecting relics, gold and upgrades. Permanent die blueprints are unlocked by **elite encounters and bosses**, then equipped at the guild for future expeditions.

### Heroes

| Hero | HP | Special (die 3+) | Passive |
| --- | ---: | --- | --- |
| Guardian | 38 | Shield Bash: melee hit, +1 damage, stuns | Guard gains +2 shield |
| Arcanist | 29 | Chain Bolt: range 3, half-damage chains to adjacent enemies | Multi-target lightning |
| Ranger | 32 | Aimed Shot: range 4, +1 damage, +4 instead on 6 | Critical-roll specialist |
| Rogue | 28 | Shadowstep: range 2, attack, reposition and gain 2 guard | One extra **free** reroll each round (unlock at 40 legacy shards or after winning) |

Special direct damage before the hero modifier is `1 + die value`, plus training, relic and die-type bonuses. The detailed value displayed in combat is authoritative.

### Rerolls and custom dice

You get **1 reroll focus every round**, which rerolls a selected *unused* die without consuming it. The Rogue gets an additional free reroll every round. The **Twilight Mirror** adds +1 focus per round. When focus is depleted, a **Fortune Tonic** can be consumed to reroll a die; you start with one and can find or buy more.

| Die | Faces | Synergy | Unlock |
| --- | --- | --- | --- |
| Adventurer Die | `1,2,3,4,5,6` | All numbers possible | Default |
| Evenstone | `2,2,4,4,6,6` | An even roll grants +2 extra guard | First new elite blueprint |
| Moonshard | `1,3,3,5,5,5` | An odd roll adds +2 strike damage | Later elite blueprint |
| Twin Six | `2,3,4,5,6,6` | Two sixes and **no one** | First boss blueprint |
| Stormglass | `1,2,3,4,5,6` | Rolls 4+ add +2 special damage | Later boss blueprint |

This is inspired by the *dice manipulation/odd–even equipment choice* design space seen in dice-focused roguelikes, but uses original rules and artwork. Relics such as **Evenbound Sigil** (+2 strike with even dice) and **Oddwood Charm** (+2 special with odd dice) create cross-die synergies. A custom die's face distribution is actually used for each roll and reroll, not merely displayed cosmetically. Duplicate unlocked dice may be equipped in multiple slots.

### Inventory and enemy inspection

The **pack icon (♧)** in the header, or **View bonuses & inventory**, opens the character sheet showing class special/passive, strike and special upgrades, relic descriptions, equipped dice, healing potions, reroll tonics and current reroll focus. **Tap an enemy** or expand **ENEMIES** below the board to see its exact HP, damage, attack range and intent. All numbers reflect the current battle state.

### Controls

- **Mobile:** Tap die → action → highlighted tile/enemy. Guard uses a confirmation button. **Reroll** sits beside the active die. The action preview is visible above the bottom bar.
- **Keyboard:** `1`, `2`, `3` choose dice; `M`, `S`, `G`, `E` actions; arrow keys move; Enter ends turn; Escape closes a panel.
- Dice roll on screen entry and reroll with a short animation, honoring `prefers-reduced-motion`.

## Local development

Requires Node.js 22+ only for tests; the site itself needs no dependencies. From the project root:

```bash
npm run check
npm run dev
```

Open `http://localhost:5173`. The tests cover movement, damage previews, attack telegraphs, guard, classes, rerolls, equipped die distributions, elite/boss unlocks and legacy save migration.

## GitHub Pages

Production is published from **`main`** using **Settings → Pages → Build and deployment → Deploy from a branch → main / (root)**. New work is made on **`dev`** and reviewed in pull requests. Expected production URL: `https://joaodperes.github.io/Pocket-Delvers/` after the one-time Pages configuration.

Install on iPhone via Safari → Share → Add to Home Screen. The service worker caches static assets after the first online load and updates its cache when the app version changes. Your game saves in your browser's `localStorage`; use **Settings → Export/Import** to back up or transfer progress. Version 0.2 automatically migrates saves from v0.1, and previous boss victories retroactively unlock their boss dice.

## Project structure

- `engine.js`: pure game rules, state, combat, progression, save migration.
- `app.js`: touch UI, exact previews, inventory and enemy inspection, save/export/import.
- `styles.css`: desktop and mobile layouts, dice roll animations.
- `assets/`: original pixel sprites and app icons.
- `manifest.webmanifest`, `sw.js`: installable offline PWA.
- `tests/engine.test.js`: automated rules tests.
- `.github/workflows/check.yml`: CI validation on `main`, `dev`, and PRs.

## Status

A playable **v0.2 prototype**, not yet a fully balanced game. Enemy variety, boss behaviors, combat pacing, deeper character-build systems and equipment constraints should be validated over more full expeditions.

## License

MIT — see [LICENSE](LICENSE).

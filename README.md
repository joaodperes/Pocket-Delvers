# Pocket Delvers

**Different heroes. Different dice. One more room.**

A mobile-first tactical dice roguelite for GitHub Pages. No server, accounts, downloads, or runtime dependencies. It autosaves locally, offers JSON import/export and offline installation as a Progressive Web App.

**Status:** v0.6 development build. This is not a production release. See [design rationale](docs/DESIGN.md) and the detailed [Run Paths design and balance guide](docs/RUN_PATHS.md).

## Play

1. Choose a hero. The Guardian is available from the start; reach room 3 to unlock Ranger, defeat an elite to unlock Arcanist, and defeat the Grave Warden to unlock Rogue. Existing saves retain previously unlocked heroes.
2. Each class has a unique **signature die distribution** and a different combat economy. The Rogue starts with two dice but can never roll above four. Other heroes start with one die. Choose a different first die for **each hero** in the Dice Forge when you unlock permanent blueprints.
3. In combat, choose an unused die, choose an action it supports, and tap a valid tile or enemy. Dice return each round. Move spends a die to travel **up to the rolled value** through traversable tiles; Guard protects you until the enemy turn completes.
4. **Strikes** and **Guard** produce +1 Charge. **Skills** require a die showing 3+ and spend 2 Charge. The Arcanist starts battles with 2 Charge, has a 6-Charge maximum, and regenerates 1 Charge at the start of every new round. Arcane Skills also gain +2 baseline damage. Stronger spells are balanced by basic Strikes that start at **max(0, roll − 2)** arcane damage before Ward and relics.
5. Enemies telegraph their attacks. Most melee enemies pursue up to two tiles per turn; **Gloom Hounds** sprint three and announce a dodgeable Pounce. **Ash Archers** and **Cinder Seers** fire tracking shots; Seers drain one Charge only if their attack damages HP. Break line of sight with cover, leave range, block, stun, or kill an enemy to avoid its attack. Actual post-Armor/Ward damage is visible on enemies before choosing an attack.
6. Earn run-only dice and choose relics. **Cindercoil** can Strike or cast but never Move or Guard; **Iron Bastion** can Move or Guard but cannot attack. Specialized dice may have high values but fewer allowed actions. Relics can enhance spells at the cost of Guard or HP, reward distant attacks over close-range fighting, or turn weak rolls into valuable Bleed/Charge generators.
7. After the second room, commit to **one of three run-only Paths** for your hero. Every Path changes combat rules and includes a drawback. After room 10, win or die. Extra dice and relics reset each expedition; unlocked heroes and blueprints persist. Autosave works between actions.

### Classes

| Class | Starting dice | Maximum dice | Roll cap | Charge cap / regeneration | Combat identity |
|---|---|---:|---:|---|---|
| Guardian | Ironheart `1/2/2/3/4/5` | 3 | 6 | 4 / none | Melee tank; extra Guard, stuns, can trade speed for survival |
| Ranger | Wayfinder `1/2/3/4/5/5` | 3 | 6 | 4 / none | Physical range 3, armor-piercing skill; distance-rewarding relics |
| Arcanist | Aether Spark `1/2/2/3/4/6` | 3 | 6 | **6 / +1 per turn** | Arcane skills and multi-target chains; extremely weak basic Strike; risky spell relics |
| Rogue | **Two** Cutpurse dice `1/2/2/3/4/4` | **4** | **4 for every die** | 4 / none | More actions, −1 Strike damage, low rolls, Bleed and extra rerolls |

Face distributions are deliberate choices, not extra hidden bonuses. When a Rogue acquires a high-face die, 5 and 6 turn into 4. The Dice Forge and backpack show the actual effective faces, and class-incompatible relics do not appear as rewards.

### Paths: your expedition's one defining commitment

After clearing **room 2**, choose one of three class-specific Paths. The choice lasts until the expedition ends and cannot be changed. In an older save already beyond room 2, your next non-boss reward will offer the choice instead.

| Class | Path A | Path B | Path C |
|---|---|---|---|
| Guardian | **Stone Sentinel:** stronger Guard, movement capped at 2 | **Vengeful Edge:** +1 Strike and healing on kills, −2 Guard | **Shield Runner:** moving gives Guard, slightly weaker Skill |
| Ranger | **Eagle Eye:** long-range bonus, adjacent penalty | **Windrunner:** movement generates Guard and Charge, −1 Strike | **Marked Quarry:** focus-fire bonus on marked targets, −1 Skill |
| Arcanist | **Overchannel:** +4 Skill but costs 3 Charge and −1 Guard | **Wardweaver:** casting generates Guard but deals −2 Skill damage | **Frail Star:** +3 Skill at the price of 5 permanent HP and −2 Guard |
| Rogue | **Flurry:** bonus on later Strikes in the same turn, −2 Guard | **Smoke Dancer:** movement generates Guard and Charge, −1 Strike | **Loaded Chances:** +1 reroll/round, lower Strike and Guard |

This is not a new currency or leveling tree. Paths are **exclusive run identities**. Their bonuses appear in action previews, and the choice is listed in the character pack and combat screen.

### Why Strike, Guard and Skill all matter

- **Strike:** direct physical or arcane damage; generates 1 Charge, can apply Bleed, trigger distance or low-roll bonuses, or simply channel magic even if it deals zero damage.
- **Guard:** survives telegraphed damage and generates 1 Charge. Some builds specialize in low-roll guards or shield-heavy play.
- **Skill:** spends 2 Charge and requires 3+, but produces tactical effects such as stun, armor piercing, chained magic or repositioning. Damage alone is not always its advantage.
- **Move:** positioning uses dice too. Tracking projectiles remain threatening if you move sideways; blocking line of sight or escaping their range matters.

### Run-defining loot examples

| Item | Benefit | Trade-off |
|---|---|---|
| Unstable Catalyst (Arcanist) | Skills +3 | Strikes −1 and Guard −3 |
| Shattered Reservoir (Arcanist) | +2 maximum Charge; Skills +2 at 5+ current Charge | Guard −2 |
| Blood Conduit (Arcanist) | Skills +4 | Spend 2 HP per cast; cannot cast at 2 HP or less |
| Longshot Strings (Ranger) | Strikes at distance 3+ gain +3 | Adjacent Strikes −2 |
| Counterweight Plate (Guardian) | Guard +3 | Movement −1 tile, minimum one |
| Tempered Edge (Guardian) | Physical Strikes +2 | Guard −2 |
| Underhand Tricks (Rogue) | Rolls 1–2 deal +3 Strike damage | Skills −2 |
| Twin Cut (Rogue) | Second Strike of the round applies +2 Bleed | Guard −2 |

Many other general relics and creature drops still exist, including bleed, guard, range, reroll and multi-target synergies. Items appear as **choices**, not automatic stacks. Class-specific items are never offered to other classes.

### Dice progression

- Guardian, Ranger and Arcanist begin each run with one die. Their first completed room offers a choice of a second die: balanced Adventurer, mobile/defensive Windstep, or offensive/defensive Emberfang.
- Rogue begins with two lower dice and chooses a relic after the first room instead of immediately gaining a third action.
- Later rooms and the merchant can award more dice, up to the class cap (three, or four for Rogue). After room 2 you first select a Path, delaying another relic or die reward in exchange for class-defining strategy.
- Specialized dice may be limited to `MOVE/GUARD`, `STRIKE/GUARD`, `SKILL/GUARD`, or `STRIKE/SKILL`. Cindercoil refunds Charge on a six-point Skill; Iron Bastion generates extra Charge from high Guard rolls. Their limitations are visibly marked on action buttons.
- Permanent blueprints unlock alternative first-die choices **per hero**; they do not grant free extra dice. Character starter distributions are always available.

## Install and run

No build step is needed. Serve the repository on localhost to use browser modules and the service worker:

```bash
python3 -m http.server 5173
```

Then open http://localhost:5173/. Alternatively, deploy `main` to **Settings → Pages → Deploy from a branch → main / (root)**; only merged changes to `main` are intended for the public site. On iOS, Safari → Share → Add to Home Screen.

## Development and tests

```bash
npm run check
```

This checks JavaScript syntax and runs Node's built-in test runner. The repository's GitHub Actions workflow executes these checks on pull requests. Gameplay rules live in `engine.js`; UI, interactions and animation effects in `app.js`; visual styles in `styles.css`; and offline caching in `sw.js`.

**Progress and privacy:** Save files remain in your browser's local storage unless exported manually. No backend or player tracking. Import/export JSON is available from settings. v0.1–v0.5 saves are migrated to v0.6, including in-progress dice and unlocked blueprints. Legacy equipped nonstandard dice are respected as each hero's starting selection, and previously unlocked characters are not removed.

### Development branches and scope

`main` remains the public Pages branch. The `dev` branch is for integrated test builds. New combat systems, saves and documentation should pass `npm run check` before merging. `npm run balance` runs a **seeded diagnostic agent** across all 12 Paths; this is not a human skill model or a success-rate target. See [RUN_PATHS.md](docs/RUN_PATHS.md) for edge cases, trade-offs and regression coverage.

MIT licensed; see [LICENSE](LICENSE).

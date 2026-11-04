# Roguelite consistency audit — v0.7

**Scope:** `engine.js`, `app.js`, home/records, rewards, shops, save import/export, run lifecycle, and old data migrations. This documents implemented safeguards as well as open design limitations. The game remains a mobile-first tactical roguelite with **discovery unlocks**, not a no-progression roguelike.

## The design contract

1. Choose a hero, then enter the dungeon. No permanent equipment picker, starter die reroll, prep shop, purchased stat tree, or shard economy.
2. Every **new** expedition starts from the same class baseline. A hero unlock changes which classes are selectable; it must not improve starting damage or actions.
3. All powers must be **earned inside the current expedition**. Advanced dice can be discovered permanently, but this only broadens their chance of appearing as future *reward choices*. These patterns are sidegrades, often with restricted actions, rather than guaranteed power boosts.
4. The **ongoing** expedition is an exception to reset semantics: save and restore must faithfully retain its built-up dice, relics, Path, consumables, gold and HP. Abandoning, winning or losing ends it; a subsequent start resets power.
5. Read-only guild records and settings are allowed to persist. Their UI should never imply that collected loot is equipped for the next run.

## Persistence matrix

| System | New run | Persists between runs? | Behavior / guarantee |
|---|---|---|---|
| Hero unlocks | Hero is selectable if previously earned | **Yes** | Guardian default; Ranger, Arcanist, Rogue milestone unlocks. Existing older unlocks preserved. |
| Hero starting dice / max dice / Charge rules | Fixed values from `HEROES` | **Same class defaults** | Rogue two dice and cap four; other classes one starting die. No selector. |
| Dice discoveries / blueprints | Unlocks *possibility* of drops | **Yes** | Elite unlocks Evenstone/Moonshard; boss unlocks Gravebone/Stormglass. Not auto-equipped. |
| Best room, victories, expedition count | Tracked in records | **Yes** | Informational, no associated combat bonus. |
| UI preference / sound | As chosen | **Yes** | Convenience only. |
| Equipped extra dice | Signature loadout only | **No** | Earn through room rewards and merchant, with class cap. |
| Relics, enemy trophies | Empty | **No** | Choice-based loot; no passive inheritance. |
| Chosen class Path / oath | None | **No** | Choose once per run after room two. |
| HP/max HP changes | Class baseline | **No** | Run-only hearts, blessings, sacrifice costs. |
| Strike/Skill upgrades | Both 0 | **No** | Merchant/camp bonuses apply to current run only. |
| Gold / merchant purchases | 0 gold | **No** | Merchant names the die it sells, and gives no persistent boost. |
| Potions / reroll tonics | Fixed base supply (2 / 1) | **No** | Start fresh each run. |
| Current combat dice / shield / Charge / enemy positions | New encounter | **No** | Rolled per round or encounter; mid-run autosave preserves state. |
| Historical shards (`meta.shards`) | No visible or earned shards | **No** | Obsolete unused currency removed; only consulted to preserve legacy Rogue unlock from v0.1–0.2. |

## Audit findings and fixes

1. **Permanent Dice Forge / hero starter selectors — removed.** Every fresh run now uses `HEROES[hero].startingDice`, even if an older save contains `meta.starters` or `meta.equipped`.
2. **Blueprints previously changed first dice — corrected.** Only common dice plus already discovered special patterns appear in `diceOptions()`. Signature class dice are not global loot. The read-only Guild Records catalogue communicates unlock conditions.
3. **First-room rewards repeated the same trio — improved.** One randomized unrestricted die, one utility die and one offensive specialist are offered. This keeps guaranteed usable actions while varying combinations. Rogue instead chooses relics, with a randomized class-relevant choice.
4. **Merchant mystery die — changed to a visible die.** The merchant displays actual faces and permitted actions before purchase; old `newdie` offers migrate without losing in-progress shops.
5. **Phantom shard currency — retired.** No shard accrual, balance display or spending route. Historic counts were unspendable and misled players into expecting permanent upgrades.
6. **Misleading "permanent damage" / "equip next time" labels — corrected.** Camp and merchant bonuses are run-only; blueprints unlock future dungeon possibilities.
7. **Completed runs could be paused as if active — blocked.** Victory/defeat now conclude via the return-to-guild control rather than creating a resumable finished run.
8. **Old saves — migration retained.** Ongoing legacy runs preserve collected equipment, while new runs always reset. Old hero and blueprint unlocks remain. No legacy preparation settings affect fresh power.
9. **Service worker updated.** New cache version avoids serving obsolete home-screen controls on installed mobile PWAs after deployment/reload.

## Other systems reviewed (kept by design)

- **Class identity:** fixed HP, damage type, attack range, Charge cap/regen, rolls, and number of dice define initial trade-offs. Class-unlock requirements do not add hidden stats.
- **Combat skills:** Strike/Guard generate Charge; Skills spend it. Buffs and debuffs from class Paths and relics apply only through `run` fields, not guild metadata.
- **Enemies:** tracking archers/Seers, hunters and dodgeable Pounces affect the *current* encounter only. Defeated enemies may offer run relics and can trigger a separate permanent loot-pattern discovery.
- **Dungeon route:** camp recovery, treasure, elites and the merchant trade opportunities for danger; no pre-run choices provide those bonuses.
- **Run history:** current lifetime metrics are kept for information, not to scale attacks or unlock permanent power purchases.

## Regression tests and remaining risks

`npm run check` covers fresh baselines for all heroes, blueprint gating, variable but viable first-room rewards, run-only merchant dice, restarted-run resets, paused runs, v0.1–v0.6 imports, no completed-run resume, Path/Charge effects, ranged attacks and UI rendering.

Open playtest questions: real human difficulty, whether the early die choices are sufficiently interesting across repeated runs, class balance (especially the Rogue's action economy), and phone touch/animation quality. Future procedural map generation and seeded replay would improve run differentiation; neither is promised or implemented here. Browser storage is local to the device and can be lost without backup.

**Future development rule:** any newly saved field should be classified in this persistence matrix before it is added. When in doubt, put combat power in `run`, not `meta`.

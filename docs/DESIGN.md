# Class economies & roguelite run identity — design history

> **Current implementation: v0.6.** The class economies below originated in v0.5 and remain the foundation. For the *new* mutually exclusive Paths, creature behaviors, trade-off costs and balance procedure, read [RUN_PATHS.md](RUN_PATHS.md). This file preserves the v0.5 baseline so future balance changes can be compared rather than silently rewriting the design rationale.

## v0.5 baseline

This is the working design rationale, not a declaration that balancing is finished. The aim is to make choices *different*, not give each new item a bigger number.

## What changed and why

Earlier builds had the same first die for every hero, a shared 4-Charge limit and mostly positive-only rewards. A Rogue with three high rolls and a Guardian with three high rolls could feel interchangeable, and an Arcanist could alternate attacks and spells without meaningful resource specialization.

In v0.5 **each hero has a different action budget, face distribution, and resource identity**:

- **Guardian:** one slightly low-weighted Ironheart die; 3-die max. Its low faces still make strong Guard-to-Charge decisions. Counterweight trades mobility for shielding; Tempered Edge trades shielding for higher melee damage.
- **Ranger:** one Wayfinder die with two 5s and no 6. Its Aimed Shot gains +1 at **5+**, so its signature die can actually trigger its own core talent; six-triggered relics remain a later loot opportunity. Distance-sensitive drops reward good positioning.
- **Arcanist:** one Aether Spark die (1/2/2/3/4/6). Six maximum Charge (eight with Reservoir) and +1 Charge automatically at the start of every turn, including the opening turn. Its basic Strike starts at **max(0, die − 2)** damage **before Ward and any relics** and still produces +1 Charge even if no damage gets through. Skills have +2 base damage beyond the normal arcane formula. This was necessary to make the class more than a fragile Guardian with a different damage type. This creates real choices between casting, channeling and survival.
- **Rogue:** two Cutpurse dice each turn, up to four dice later in the run. **Every** roll is capped at four, even on later loot dice. Basic Strikes have −1 damage relative to their normal physical baseline, compensated by an additional action, Bleed, a free reroll and combo relics. This has a higher action budget than other heroes, so early-run difficulty may need dedicated playtesting.

## Calculated starter numbers (without relics, before enemy defenses)

| Class | Avg. first-die face | Typical initial Strike damage (avg.) | Initial actions per round | Initial Charge |
|---|---:|---:|---:|---:|
| Guardian | 2.83 | 4.67 | 1 | 1/4 |
| Ranger | 3.33 | 5.00 | 1 | 1/4 |
| Arcanist | 3.00 | 1.17 | 1 | 2/6 |
| Rogue | 2.67 | 3.50 **per die** | 2 | 1/4 |

These are per-die raw direct damage averages, not win-rate estimates; misses due to range, Armor/Ward, cast opportunities, movement needs, Bleed and Guard change real outcomes. The Arcanist needs a die of 3+ to cast, and the Rogue must close to melee range. A six-triggered relic is **unusable** by Rogue and is excluded from Rogue's reward pool.

## Trade-offs the player should feel

1. **Guard vs power:** Catalyst adds spell damage but weakens Guard and Strikes. Reservoir increases maximum Charge and rewards careful storage rather than spamming every skill. Blood Conduit gains power at a measurable HP cost (and cannot bypass that cost at 1 HP).
2. **Melee vs ranged:** Longshot Strings rewards keeping distance from the enemy. When a ranged attack lands adjacent, it loses damage. This can make the player choose cover/position over simply rolling high.
3. **Many low dice vs fewer high dice:** Rogue has more actions but weaker base Strikes and a hard roll ceiling. Low-roll combos and multiple-actions-per-round rewards give low values a purpose.
4. **Survival vs mobility:** Counterweight improves Guardian Guard but slows moves. That is not automatically optimal against tracking archers or telegraphed area threats.
5. **Abilities vs regular attacks:** Strikes/Guard restore Charge while skills spend it. Powerful relics widen the gap only if the player pays an explicit cost elsewhere.

## Playtest questions before merging

- Can the Arcanist survive room 1 with a low Aether Spark roll while handling an adjacent threat? Does +1 Charge/turn feel rewarding, not automatic victory?
- Does Rogue's initial second action let it overperform in rooms 1–3? Compare damage received, turns per battle, and win rate on repeat seeds rather than one perfect run.
- Does the Ranger's no-six starter die create interesting demand for future high-face dice, rather than making early combat frustrating?
- Are high-cost relics temptations, not traps? Compare winning runs with and without Catalyst/Reservoir/Blood Conduit.
- Does acquiring a restricted die create interesting action placement decisions? If a die only supports Move or Guard, it should not be an invisible dead draw.
- Are actions and statistics understandable on a 390px phone with four Rogue dice? Use the backpack for full explanations, not microscopic in-game text.
- Check real iPhone touch behavior and animations; desktop headless tests do not replace on-device playtesting.

## Earlier proposed experiments and current status

- **Partly implemented v0.6:** Cinder Seers use tracking Hex Drain, which removes one Charge only when their attack penetrates Guard; Gloom Hounds announce dodgeable Pounce attacks and sprint three tiles. Neither directly punishes Charge hoarding or repeated Guard.
- **Implemented as class Paths in v0.6:** one mutually exclusive, run-only Path choice after room 2. It does not occupy a relic slot and does not prevent future relic drops.
- Biomes with distinct enemy decks and meaningful branching routes.
- Metaprogression that unlocks **choices** (new dice/sidegrade relics), not unconditional starting damage or free action count.
- Seeded daily runs and balance telemetry in a local-only test harness, without requiring a server.

No additional permanent currencies or character stat trees are part of v0.5 or v0.6: the depth comes from different dice, constraints and enemy counterplay.

## Automated balance probe (directional, not human win rates)

Run `npm run balance` to sample 200 seeded ten-room expeditions per class with the same primitive deterministic agent. The agent prefers casting and attacks when possible, walks toward targets, and takes the first suitable rewards; it does not optimize positioning, advanced synergy or resource preservation. It cannot establish fairness or player win probability. It **can** quickly reveal severe class-specific stalls or unintended changes to action economy.

In the current baseline the probe completes 186/200 Guardian, 155/200 Ranger, 90/200 Arcanist and 181/200 Rogue expeditions. These are intentionally *not* target win rates. The Arcanist was initially completing only 36/200 before the +2 Skill base adjustment, so that change was retained. A dedicated playtest is still required for Guardian/Rogue difficulty and whether enemy variety is sufficient.

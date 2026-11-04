# v0.7 Run Paths: class identity, enemy pressure and balance

**Status:** implemented in `dev` for playtesting. GitHub Pages continues to publish `main` until reviewed. [DESIGN.md](DESIGN.md) records the v0.5 foundations; this is the canonical guide for run-only class Paths added in v0.6.

## Design goals and scope

1. **One identity-defining decision early:** after room 1, choose a die from three varying offers (or, as Rogue, choose a relic); after room 2, choose **one** of three mutually exclusive Paths. You cannot change it until the run ends. Do not add permanent currencies or talent trees.
2. **Distinct costs, not strictly bigger numbers:** every path has a downside (less Guard, weaker attacks, capped movement, extra Charge cost or max-HP loss). Previews must reflect the choice so the player can make decisions without consulting a spreadsheet.
3. **Enemy diversity should challenge habits:** tracking fire tests cover and Guard; fast telegraphed lunges test repositioning; Charge drain matters mainly for mage builds and applies only when HP is actually damaged.
4. **Runs have varied *choices*, not arbitrary power:** extra dice, action restrictions, class distributions and reward filtering mean the same roll can matter differently across classes.
5. **Accessible on a phone:** four action buttons, a five-by-five board, one optional character pack, concise Path descriptions, and clearly stated drawbacks.

## Run progression

| Event | Reward / decision | Persist after death? |
|---|---|---|
| Character selected | Signature dice and class economy | Signature kit stays available |
| Room 1 cleared | Non-Rogue chooses second die; Rogue chooses a relic | No |
| Room 2 cleared | Pick one of three Path options matched to hero | No |
| Later encounters / shop | Dice, relics, potions, and conditional enemy trophies | No |
| Elite and boss | Discover new loot dice patterns and unlock heroes | Yes |

Old v0.1–v0.6 saves retain their existing in-progress dice, character unlocks and relics. An older run already beyond room 2 but missing a Path gets a Path choice at its next non-boss reward; a run that reaches the final boss without another reward can complete without a Path. Existing runs aren't rewritten retroactively.

## Path matrix — precise mechanics

**Guardian:**

| Path | Benefit | Downside | Useful with / countered by |
|---|---|---|---|
| Stone Sentinel | Guard **+3**, regain **1 Charge** when an enemy attack is actually blocked | Movement range **max 2**, including Boots | Guard dice and Bastion Link; struggles against tracking ranged fire and distant foes |
| Vengeful Edge | Strike **+1**, heal **1 HP** on a killing Strike | Guard **−2** | Direct damage and cleanup; weaker when surrounded or against high Armor |
| Shield Runner | Moving **2+** tiles grants **3 Guard** | Skills **−1 damage** | Movement dice, Hound Spur; unreliable when cornered or movement costs a die you need to attack |

**Ranger:**

| Path | Benefit | Downside | Useful with / countered by |
|---|---|---|---|
| Eagle Eye | Strikes from distance **3+** deal **+3** | Adjacent Strikes **−2** | Wayfinder dice, Longshot Strings; threatened by rushing Hounds |
| Windrunner | Moving **2+** tiles grants **2 Guard** and **+1 Charge** | Strikes **−1** | Defensive mobility; moving still spends an action |
| Marked Quarry | First Strike marks the living target; later Strikes against it deal **+2** (mark lasts until battle ends or another enemy is marked) | Skills **−1** | Multiple dice, bosses; weaker when repeatedly changing targets |

**Arcanist:**

| Path | Benefit | Downside | Useful with / countered by |
|---|---|---|---|
| Overchannel | Skills **+4 damage** | Skill cost rises from **2 to 3 Charge**, Guard **−1** | Reservoir, Spellweave, regen; Seers interrupt casts by draining Charge |
| Wardweaver | Every Skill immediately grants **3 Guard** | Skills **−2 damage** | Durable casting, long fights; weaker against enemy attrition through defenses |
| Frail Star | Skills **+3 damage** | Lose **5 max/current HP** when selected; Guard **−2** | Burst damage and careful cover; heavily punished by chip damage |

**Rogue:**

| Path | Benefit | Downside | Useful with / countered by |
|---|---|---|---|
| Flurry | Second and subsequent Strikes in a turn deal **+2** | Guard **−2** | Two starting Cutpurse dice, Twin Cut, bleed; requires spending multiple dice on attack |
| Smoke Dancer | Moving **2+** tiles grants **2 Guard** and **+1 Charge** | Strikes **−1** | Mobility / Shadowstep; fewer damaging turns |
| Loaded Chances | Gain **one additional reroll focus each round** | Strikes **−1**, Guard **−1** | Custom low-face dice, Underhand Tricks; rerolls improve flexibility, not action count |

Guard cannot go below 0. Strike damage may be 0 against Armor/Ward, especially for Arcanist. Skill damage has a floor of 1 after mitigation. Charge is capped at class max. The extra Path Charge on Guard or blocking is subject to that cap. All Path bonuses are *run-only*.

## Enemy counterplay and loot

| Enemy | Introduced | Telegraph / behavior | Counter | Conditional drop |
|---|---|---|---|---|
| Ash Archer | Normal room 2 | Tracking ranged shot in clear line of sight | Walls, guarding, stun, leaving range | Ashstring: distant physical Strike bonus |
| Gloom Hound | Normal room 3 | Sprints **3 tiles**, then a fixed-tile **Pounce** in range 2 | Move off marked tile, block, stun | Hound Spur: moving 3+ tiles grants 2 Guard |
| Cinder Seer | Normal room 4 | **Hex Drain**, tracking shot range 3. On **HP damage only**, reduce Charge by 1 | Break line of sight, Guard fully, stun | Seer Shard: 5+ Skills +2, Guard −1 |
| Hollow Brute | Elites / later rooms | Heavy melee | Keep distance, hit with arcane, control | Hollow Grip: adjacent Skills +2 |

Later ordinary rooms draw a mixed population rather than always beginning with an Archer. Enemy attack and move intentions are declared before the player acts. After their action, intentions refresh. There is no untelegraphed immediate follow-up attack.

## Added run-only dice

| Die | Faces | Valid actions | Conditional effect |
|---|---|---|---|
| **Cindercoil** | `1 / 1 / 2 / 4 / 5 / 6` | Strike, Skill | Casting on **6** refunds 1 Charge; cannot Move or Guard |
| **Iron Bastion** | `2 / 3 / 4 / 4 / 5 / 5` | Move, Guard | Guard on **4+** also gains 1 Charge; cannot Strike or Skill |

These dice can appear as later run rewards or visible shop offers. They are not pre-run equip choices. Rogue's global roll cap of four still applies. Because Cindercoil's six-point refund would be impossible for Rogue, **the random loot pool excludes Cindercoil for Rogue**. This keeps rewards meaningful without silently changing the global roll cap. The Rogue also avoids Gravebone as random loot, because its high-roll skill-refund effect cannot trigger under a cap of four.

## Measured diagnostics and honest limitations

The project includes `npm run balance` (`RUNS=200 npm run balance` for a broader sweep). A deterministic agent plays the same set of seeded rooms under each Path, preferring Skill, then Strike, then movement, then Guard; it uses simple distance and exposure penalties. It does **not** reroll, optimize cover as well as a human, or select equipment intelligently. Thus its outcomes cannot establish human win rates, ideal difficulty, or fairness, but can identify unusually strong/weak mechanics.

A 90-run-per-Path local diagnostic after tuning revealed: Guardian about **82–88/90** clears, Ranger **44–73/90**, Arcanist **48–60/90**, Rogue **76–82/90**. The Ranger's Marked Quarry and Guardian's Vengeful Edge still seem relatively strong; the Arcanist is significantly more fragile, as intended but possibly too fragile. Do not present these as player success percentages. Adjust using hands-on player decisions and more realistic AI tests before merging.

## Test and release checklist

- [x] Hero-specific Path lists are mutually exclusive; exactly three choices for each hero.
- [x] Path choice survives pause/export/import; legacy saves restore with no invented Path.
- [x] Movement cap affects *reachable tiles*, not just the on-screen description.
- [x] Overchannel really charges 3 and cannot be cast at 2.
- [x] Enemy Charge drain only happens when HP is damaged.
- [x] Hound Pounce telegraph can be dodged; Hound can move three cells.
- [x] Both new dice disable prohibited actions and apply conditional effects.
- [x] No backend, new permanent currency, or screen-size-dependent combat logic.
- [ ] Test at iPhone touch size and check screen-reader descriptions for Path choices.
- [ ] Compare experienced-player win rates on multiple seeds, not one long lucky run.
- [ ] Check whether a die slot with restrictions ever becomes a dead action in a corner.
- [x] Exclude Cindercoil from Rogue random dice offers because its six-only refund cannot trigger.
- [ ] Decide whether enemy-specific drops should have a guaranteed/weighted offer.

## Longer-term experiments — NOT implemented

- **Die forging within a run:** choose to change one face of a specific die in exchange for removing an action; requires UI for choosing slot and comparing probabilities.
- **Biome-specific enemy families:** crypt, fungal caverns, broken observatory, each with mixed patterns and telegraphed hazards; map should not become unreadable on 5×5 mobile grid.
- **Enemy archetypes that counter hoarding:** fully telegraphed spells scaling with stored Charge, or enemies that crack Guard, but never unavoidable traps.
- **Run history and seed replay:** deterministic seed recording and an optional run recap, with no cross-device tracking or online leaderboard requirements.

Prioritize meaningful counterplay, not raw extra stats. Avoid monetization, time gates and grind-based power bonuses.

## Fresh-start consistency (v0.7)

A **Path** is exclusively a run choice; the `run.oath` field is reset at the start of every expedition. Gold, bought upgrades, consumables, relics, and additional dice are also run-only. The historical Dice Forge screen and legacy shard currency have been retired; discovered dice patterns enrich reward pools but cannot override a class signature starter. Check [ROGUELITE_AUDIT.md](ROGUELITE_AUDIT.md) before adding new menus, merchants, trophies, or progression unlocks.

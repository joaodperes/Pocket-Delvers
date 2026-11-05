# v0.8 Balance methodology and preliminary results

**Purpose:** Reproducible regression diagnostics for the combat loop. This is not a target human win-rate, proof of fairness, or a substitute for playtesting. The `scripts/balance-probe.mjs` heuristic cannot plan several turns ahead, does not optimize all reward combinations, and has no access to a learned combat policy.

## Changes from the old probe

The v0.7 probe aggressively approached the closest foe even as Ranger/Arcanist, and usually avoided every optional champion. That inflated the apparent Guardian/Rogue advantage and did not explore the route risk trade-off. The v0.8 probe runs **three strategies per hero** with the same seed list:

- `native-safe`: Melee heroes pursue range 1, Ranger aims for range 3 and Arcanist for range 2; avoid optional elites when camp/cache/merchant exists, but still face compulsory room-five champion.
- `native-trial`: Same class-aware movement, actively choose optional elite branches to observe encounter pressure and reward risk. The boss remains mandatory.
- `generic-risk`: Approach range 1 even as ranged classes, also choose optional elites. This provides a rough sanity check for positioning costs.

At each die the agent evaluates available Strike/Skill targets, expected damage and enemy threats; prefers sensible ranged spacing and avoids active toxic ground when it can. It knows that cover and range affect tracking attacks. It still **does not** optimize rerolls, build paths, equipment, long-term Charge use, or enemy-intent combinations. Those limitations can substantially affect both relative class strength and absolute success rates.

Use `RUNS=60 npm run balance` for an initial probe, and `RUNS=200 npm run balance` for a broader diagnostic. `npm run check` runs gameplay and UI regression tests. Seed lists use a deterministic local RNG. No network calls or user tracking.

## Initial v0.8 sample — 60 seeds per scenario

These are successful *bot-run expeditions out of 60*, not observed player percentages. Every path includes a mandatory champion in room five. Results are sensitive to the specific script and its reward heuristics.

| Hero | Native safe routes | Native optional-elite routes | Generic approach / optional elites |
|---|---:|---:|---:|
| Guardian | 40/60 | 1/60 | 1/60 |
| Ranger | 58/60 | 48/60 | 19/60 |
| Arcanist | 52/60 | 6/60 | 2/60 |
| Rogue | 49/60 | 23/60 | 23/60 |

No simulation stalled during the 60-seed run after fixing an orphan Binding Crystal. These numbers identify real *questions*: why are safe Ranger/Arcanist runs so consistently completed? Are repeated optional champions disproportionately punishing the Guardian? Does the basic agent overvalue moving into danger or neglect defensive Charge generation? **Do not tune raw HP/damage solely to make these counts equal**. Test in the browser with deliberate human strategies, and revise the probe when it fails common-sense tactical cases.

## Proposed acceptance criteria before release

1. All four classes can win and have defensible counterplay against each elite and the three boss phases, with no impossible seeds verified in manually tested samples.
2. At least one powerful decision per encounter (target prioritization, route/cover, Guard vs attack, cast vs save Charge); random damage spikes or unavoidable simultaneous attacks should not determine outcomes.
3. Maintain guaranteed full warning for poison and marked attacks and never seal the player's only die.
4. Instrument **test-only** metrics: damage received, turns, dice left unused, rerolls spent, active hazards crossed, optional elite attempts, and which abilities delivered enemy damage. Do not add server-side analytics or an extra persistent grind currency.
5. Compare skilled manual runs per class/Path using varied seeds before agreeing a target win rate. Less than an arbitrary fixed percentage is not automatically better if defeats feel random.
6. Verify UI on an actual small touchscreen and with reduced-motion preference, and check complete boss actions rather than only screenshots of turn one.

**Release posture:** v0.8 is a development candidate. Keep the open PR in draft and leave GitHub Pages `main` unchanged until a real playtest finds the combat reasonably fair and understandable.

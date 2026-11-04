# v0.8 Combat encounters — implementer and playtester guide

Status: **implemented on `dev`, not certified for production**. Code authority: `engine.js`; presentation: `app.js`, `styles.css`. All encounters use a 5×5 board and three core promises: player sees intentions before spending dice, a new poison tile does not damage on its placement turn, and every danger can be answered by at least one action or build decision.

## Encounter lifecycle

1. Start of the player turn: enemies show their planned action above their sprite, their full intention in the ENEMIES drawer and enemy detail card. The board draws marked attack/poison-seeding tiles and existing toxic terrain. Tracking attacks show `!` on movement destinations still exposed to line of sight.
2. Player chooses dice, attacks, guard, moves, rerolls or skills. A Move automatically chooses the **lowest-poison route within the roll's maximum movement**, preferring the shorter safe route; each active toxic tile crossed costs **1 HP** (ignores Guard). The optional Sporeheart trophy reduces this cost by 1 per tile and grants 1 Charge once per move containing toxin.
3. On End Turn or spending the final available die, existing active poison deals **2 HP** (boss-seeded poison deals **3 HP**) to a player still standing there, ignoring Guard. Enemy Bleed resolves, then each enemy executes its *previously telegraphed* action. Shieldbreakers crack up to 3 Guard **before** normal damage is blocked. Ranged tracking requires current, unblocked line of sight and range. Fixed-tile lanes/sweeps miss if the player leaves their painted squares.
4. Poison `SEED` actions **place** the tile at the end of the turn, but that tile activates the **following** player turn. Poison expires after two dangerous enemy-turn resolutions. Total live seeded hazard cells are capped at four; obstacles are never poisonous.
5. When an attack finishes, enemy intentions refresh for the new round. A newly spawned enemy does not act on the same round it appears. A dying summoner/binder cannot leave an immortal or inaccessible objective.

A fully guarded tracking shot doesn't drain Charge; Cinder Seer's Hex Drain triggers only on HP damage. A 'Riposte' stance only retaliates on the second adjacent **Strike** in the same turn, and its 3 damage can be Guarded. Skills can interrupt champions with a two-hit Stagger counter; the first Guardian Shield Bash by itself doesn't lock down bosses.

## Normal encounter roster

| Enemy | Telegraph and behavior | How to counter it |
|---|---|---|
| Mire Slime / Boneguard | Basic marked melee | Dodge or Guard, use physical/arcane defenses strategically |
| Ash Archer | `TRACKING SHOT` | Break line of sight, outrange or interrupt; lateral movement alone fails |
| Cinder Seer | `HEX DRAIN` tracking, steals 1 Charge on HP hit | Cover or fully block; avoid losing casting opportunities |
| Gloom Hound | Sprint 3, marked Pounce | Move off the announced square after it sprints |
| Shieldbreaker | `GUARD CRACK` destroys up to 3 Guard before a normal hit | Stun, reposition or strike before the hit; not permanently bypassing all shields |
| Hollow Duelist | `RIPOSTE` on second adjacent Strike in a turn | Use one Strike then Move/Skill, or block 3 retaliation damage |
| Venom Spore | `TOXIC SEEDS` places one warned tile, lasting two player turns | Choose a safer route; do not end on poison |
| Hex Sniper | `PINNING LANE` marks an entire row or column, no tracking | Step out of the marked lane, Guard or stun |
| War Drummer | `WAR CHANT` increases allied attack damage +1, capped at +2 while it survives | Target the Drummer; the damage bonus ends immediately on its defeat |
| Grave Summoner | Raises weak Bone Wisps (maximum two active, global enemy cap 7) | Destroy summoner, or use area damage against Wisps |

Normal room depth influences the pool; enemy combinations, not just HP, produce later-run pressure. New support archetypes appear later than early simple fights. The UI exposes the specific attack type, marked squares, and any special counters on each enemy's detail card.

## Mandatory and optional elites

**Room 5 is always a `Trial of Champions`.** No safe-route bypass. Other elites remain opt-in on branch choices (they're risky by design). Each elite battle contains one primary champion and, later in a run, one supporting monster.

| Champion | Unique challenge | Recovery / loot |
|---|---|---|
| **Iron Executioner** | Marks a multi-tile Hammer Sweep around the player's previous position. Player can dodge; it advances when outside swing range. | After attempting the sweep (hit or miss) it has one `RECOVERING` enemy turn. **Executioner Edge**: +3 Strike on 5+, −2 Guard. |
| **Spore Matriarch** | Alternates a two-tile toxic seed pattern with tracking attacks. Poison placement is warned and never hits immediately. | **Sporeheart**: mitigate poison entry, generate Charge by crossing poison. |
| **Soul Binder** | Periodically announces `BIND ONE DIE` and creates a fragile Binding Crystal. If hero has 2+ dice, one die is sealed next round; a one-die hero never loses its only die. | Destroying Crystal restores the sealed die that round and grants 2 Charge. Defeating Binder also removes all owned crystals. **Unbound Prism**: low Guard rolls generate Charge but Skills cost 1 HP. |

Elite control uses Stagger rather than unconditional stun: **two landed Skills** trigger a one-turn interrupt and reset the counter. Stagger displays as `0/2` or `1/2`. Summoned crystals and support minions never persist to a new expedition.

## Grave Warden — final encounter

**Base HP 58; three HP thresholds; champion Stagger rules.** Phase transitions happen immediately when HP crosses the threshold (no extra untelegraphed attack). Minions raised by phase transitions do not act until their next full enemy turn.

1. **Phase I (above 70% HP): The Hunt.** Alternates marked Reaping Sweep (multi-tile) and `GRAVE BOLT` tracking when in sight. Approaches the player if it can't attack.
2. **Phase II (70% down to above 35%): Rotting Ground.** Adds a recurring two-tile poison seeding turn to its sweep/bolt repertoire, with the same full warning and two-turn expiration as the Matriarch.
3. **Phase III (35% HP or below): Final Stand.** Raises two Boneguards once and adds more frequent poison cycles alongside tracking and sweeps. Defeating the Warden and its surviving minions completes the expedition.

Specialty design constraint: **the player always has agency**. The Warden is not immune to control, but two Skills must land for one interrupt. Cover remains effective against tracking Bolts. The boss does not gain arbitrary invulnerability or instant movement; its complexity comes from combining learned mechanics under pressure.

## Counterplay and fairness regression checklist

- [x] Poison warning and activation are distinct turns; no damage on seed placement; active poison ignores Guard.
- [x] A two-point move may cross toxic terrain even with a safe endpoint; a sufficiently high die may take a longer safe path.
- [x] Shield crack applies before Guard absorption; Duelist Riposte responds to second adjacent Strike, not any action.
- [x] Sniper lane is fixed, not tracking. All tracking shots check range and line of sight at resolution.
- [x] Summoned minions cannot act immediately; summoner cap prevents unlimited spam.
- [x] Binder never seals a player's only die; crystal death restores a sealed die; binder death cleans up crystals.
- [x] Executioner gets a recovery turn on a hit **or miss**.
- [x] Boss phases, phase-three summons, champion stagger and mandatory room 5 are tested.
- [x] Old v1–v7 save data restores, with new enemy/hazard fields populated safely.
- [ ] Human testing at 390px iPhone with sound and motion; inspect stacked spell/poison announcements and accessibility.
- [ ] Run full multi-seed human expeditions across all four classes and each Path; verify neither poison nor sealing becomes an unavoidable trap.
- [ ] Rebalance the class outcomes once play logs exist. Automated bots cannot certify win-rate fairness.

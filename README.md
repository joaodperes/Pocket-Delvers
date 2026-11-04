# Pocket Delvers

**Start with one die. Earn your next move. One more room.**

Pocket Delvers is an original, mobile-first, tactical dice roguelite that runs entirely in the browser. It needs no backend or runtime dependencies and supports GitHub Pages, offline installation, and local saves.

## Play (v0.4 development preview)

1. Choose a hero from the guild. New players begin with **Guardian**, unlocking the **Ranger** by reaching room 3, **Arcanist** by defeating their first elite, and **Rogue** by defeating the final boss. Existing v0.1/v0.2 players retain previously available characters.
2. Start with one die. Your first victory offers three choices for a second die; subsequent battles, elites, and merchants can add a third. Some dice only allow specific actions. Pick a die, pick a permitted action, then tap an available tile or enemy. Spent dice are unavailable until the next round. **Move** goes up to the rolled number of traversable orthogonal tiles.
3. **Strikes** deal reliable damage and generate **+1 Charge**. **Guard** adds shield until the end of the turn and generates **+1 Charge**. **Skills** require a die showing **3+** and spend **2 Charge**. Charge begins at 1 per encounter, persists between rounds, and caps at 4.
4. Read enemy arrows/damage markers. Melee enemies hunt two tiles each enemy turn. Ash Archers shoot TRACKING arrows whenever you stay within range and clear line of sight. Moving sideways is not enough: hide behind a wall, leave range, block, stun, or kill them. Fixed melee attacks still allow traditional dodging. Expand the enemy roster or tap an enemy to inspect its attack and defenses.
5. **Physical** damage is reduced by enemy **Armor**; **Arcane** damage by **Ward**. Both are flat reductions. The number on a valid target shows actual direct damage **after** resistances. Damage previews are recalculated for each selected die.
6. Win fights, choose relics, collect equipment dropped by different monster types, unlock custom dice, and delve to room 10.

### Classes and reasons to choose them

| Delver | Basic attack | Special (costs 2 Charge) | Identity |
| --- | --- | --- | --- |
| Guardian | Physical +1, range 1 | Shield Bash: melee damage and stun | Guard +2; low-die Guardian/Bastion combinations |
| Ranger | Physical +1, range 3 | Aimed Shot: range 4, armor piercing, +2 on 6 | Ranged positioning, high-face rewards |
| Arcanist | Arcane +2, range 3 | Chain Bolt: chain half damage to adjacent foes | Punishes armored targets, multi-hit Charge refunds |
| Rogue | Physical +1, range 1 | Shadowstep: range 2, reposition and gain Guard | Odd rolls cause Bleed; free reroll each round |

Regular attacks are **not inferior skills**: strikes generate Charge, sometimes hit harder than specials (Guardian), and activate conditional effects on equipment. Skills cost Charge for a control, range, positioning, or multi-target payoff.

### Loot that changes playstyle

Each regular battle offers three choices. A monster you defeated can offer its specific drop alongside two other items. Relic cards show **synergy tags** such as `ARCANE`, `BLEED`, `RANGED`, `GUARD`, and `DICE`, with class-relevant cards highlighted.

- **Mire Slime → Mire Catalyst:** odd Strikes add Bleed damage over the next two enemy turns.
- **Boneguard → Boneguard Plating:** even Guard rolls give bonus shield.
- **Ash Archer → Ashstring:** ranged Strikes from two or more tiles away hit harder.
- **Hollow Brute → Hollow Grip:** Skills deal extra damage to adjacent enemies.
- **Bastion Link:** a 1 or 2 becomes an excellent Guard roll and generates extra Charge.
- **Ley Capacitor:** multi-target Skills can refund Charge.
- **Hawkeye Wrap:** ranged Strikes on 5+ deal additional damage.
- **Night Oil:** odd physical Strikes add Bleed.

Some relics still grant straightforward survival or damage improvements, intentionally providing approachable alternatives to synergy-focused builds. Monster drops are optional reward picks, never forced.

### Custom dice and rerolls

Select ONE permanent starting die at the guild. Collect a second and third die inside each expedition; all in-run extra dice reset after that expedition. Every die has actual weighted faces and conditional mechanics, rather than an unconditional upgrade:

| Die | Faces | Effect | Source |
| --- | --- | --- | --- |
| Adventurer | `1 2 3 4 5 6` | Balanced | Starting die |
| Evenstone | `1 2 2 4 4 6` | Even Guard adds +2 | Elite |
| Moonshard | `1 1 3 3 5 5` | Odd Strikes +1 damage | Elite |
| Gravebone | `1 2 3 3 5 6` | Guard with 1 grants +2 Charge; Skill with 6 refunds 1 Charge | Boss |
| Stormglass | `1 2 3 4 5 6` | Skills on 4+ deal +1 damage | Later boss |
| Windstep | `3 4 4 5 6 6` | Only MOVE/GUARD; Guard +1 | Expedition |
| Emberfang | `1 2 3 4 5 6` | Only STRIKE/GUARD; low Strikes +3 | Expedition |
| Spellweave | `2 3 3 4 5 6` | Only SKILL/GUARD; Guard gives extra Charge | Expedition |

The v0.2 **Twin Six** blueprint is automatically migrated to **Gravebone**; permanent progression is not lost.

Every character has one free die reroll per round, the Rogue gains a second, and Twilight Mirror and Fortune Tonics offer further rerolls. Rerolling never spends the die.

### UI and effects

Action buttons preview base damage, Guard, movement, and skill eligibility; attackable targets show damage after Armor/Ward. The character pack (♧) shows bonuses, class stats, relics, equipped dice, consumables, Charge, and reroll resources. Enemies show HP, armor, ward, Bleed, and announced actions.

Dice have roll animations. **v0.4 adds moving weapon / spell projectiles, target-flinch effects and visible enemy attacks**, in addition to class-specific impact flashes, Guard and damage feedback, honoring `prefers-reduced-motion`. These are short readable impact effects, not full frame-by-frame character sprite animations.

### Saving / offline

The game saves automatically to `localStorage`, with JSON export and import in Settings. Save files from v0.1, v0.2, and v0.3 are migrated on load, with previous hero access preserved. Offline play uses a versioned service worker; new releases require an online visit to update cached assets.

## Development

The game itself has zero install or build dependencies. For checks, use Node.js 22+:

```bash
npm run check
npm run dev
```

Then open <http://localhost:5173>. `npm run check` runs syntax checks and tests. The project is a static PWA with `index.html`, `app.js`, `engine.js`, `styles.css`, `assets/`, `manifest.webmanifest`, and `sw.js`.

## Publish on GitHub Pages

Production comes from `main` with **Settings → Pages → Build and deployment → Deploy from a branch → main / (root)**. Development work goes into `dev` and is reviewed via pull request. The expected production address after Pages is enabled is <https://joaodperes.github.io/Pocket-Delvers/>.

## Status

**v0.4 development branch**: one-die expeditions, tactical enemy pressure, specialized dice and visible attack animations. Damage, enemy HP, rewards, and progression still need playtesting over complete expeditions; the underlying combat rules are unit-tested, but final balance is not guaranteed.

## License

MIT — see [LICENSE](LICENSE).

### v0.4 design and difficulty notes

- **Start weak, build power:** every new run starts with only your chosen first die. Your first defeated room guarantees a choice of second die; later rewards can offer a third. The goal is to create distinct builds and harder early-game decisions without increasing the number of interface controls.
- **Dice have tradeoffs:** Windstep's high movement/Guard rolls cannot be spent on attacking; Emberfang cannot Move or cast; Spellweave cannot Move or Strike. Disabled actions are visually indicated.
- **Enemies close gaps:** melee enemies hunt up to two tiles each enemy turn and route around walls. Archers are guaranteed in standard encounters from room 2, use tracking shots when the hero is within line of sight and range, and reposition when obstructed. The boss gains an alternating tracking projectile on even turns.
- **Honest threat display:** tracking targets are not fixed squares. Movement options with `!` are still exposed to a tracking shot. Guard/cover/range remain useful counterplay.
- **Motion:** actual projectile travel, class-colored impacts, enemy missile effects and hit reactions; reduced-motion preference remains supported.
- **Old runs:** saves in progress with three dice keep their existing loadout so an update does not remove earned progress mid-encounter.

Difficulty has automated mechanics tests but still needs real run-by-run tuning of damage, healing and reward frequencies.

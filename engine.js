// Pocket Delvers v0.7 — deterministic game rules; zero runtime dependencies.
export const MAX_ROOMS=10, SIZE=5, STORAGE_KEY='pocket-delvers-save-v1', MAX_CHARGE=4, SKILL_COST=2;
export const DICE_TYPES={
 ironheart:{name:'Ironheart',tag:'STEADY',starterFor:'guardian',faces:[1,2,2,3,4,5],desc:'Guardian signature die: steady Guard rolls, no six.',power:'GUARDIAN STARTER. More low faces for Guard-to-Charge builds.'},
 wayfinder:{name:'Wayfinder',tag:'AIM',starterFor:'ranger',faces:[1,2,3,4,5,5],desc:'Ranger signature die: two fives, no six.',power:'RANGER STARTER. More consistent long-range Strikes.'},
 aether:{name:'Aether Spark',tag:'CHANNEL',starterFor:'arcanist',faces:[1,2,2,3,4,6],desc:'Arcanist signature die: volatile and low-biased.',power:'ARCANIST STARTER. Two twos to channel Guard, one six for big spells.'},
 knives:{name:'Cutpurse',tag:'QUICK',starterFor:'rogue',faces:[1,2,2,3,4,4],desc:'Rogue signature die, maximum four.',power:'ROGUE STARTER. Two low dice per round with odd Bleed synergies.'},
 standard:{name:'Adventurer Die',tag:'BALANCED',faces:[1,2,3,4,5,6],desc:'Every number is possible.',power:'A reliable die for any build.'},
 evenstone:{name:'Evenstone',tag:'EVEN',faces:[1,2,2,4,4,6],desc:'Reliable low and medium even rolls.',power:'Even rolls grant +2 Guard.',color:'even'},
 moon:{name:'Moonshard',tag:'ODD',faces:[1,1,3,3,5,5],desc:'Low-average rolls with guaranteed odd outcomes.',power:'Odd Strikes deal +1 damage.',color:'odd'},
 gravebone:{name:'Gravebone',tag:'TACTIC',faces:[1,2,3,3,5,6],desc:'The Grave Warden’s measured die. No 4, two 3s.',power:'Guard with 1: +2 Charge. Skill with 6: refund 1 Charge.',color:'six'},
 stormglass:{name:'Stormglass',tag:'SURGE',faces:[1,2,3,4,5,6],desc:'Special-attack focused, with all six faces.',power:'Skills on 4+ deal +1 damage.',color:'surge'},
 stride:{name:'Windstep',tag:'UTILITY',faces:[3,4,4,5,6,6],allowed:['move','guard'],desc:'Strong movement and defense, but cannot Strike or use Skills.',power:'MOVE / GUARD ONLY. Windstep Guard gains +1 extra shield.',color:'even'},
 ember:{name:'Emberfang',tag:'ASSAULT',faces:[1,2,3,4,5,6],allowed:['strike','guard'],desc:'A weapon die with no movement or skill casting.',power:'STRIKE / GUARD ONLY. Strikes on 1–2 deal +3 damage.',color:'odd'},
 sigil:{name:'Spellweave',tag:'CHANNEL',faces:[2,3,3,4,5,6],allowed:['skill','guard'],desc:'Specialized casting die; cannot move or perform a basic Strike.',power:'SKILL / GUARD ONLY. Guard grants +1 extra Charge.',color:'surge'},
 cinder:{name:'Cindercoil',tag:'VOLATILE',faces:[1,1,2,4,5,6],allowed:['strike','skill'],desc:'Powerful attacks with no movement or Guard, and two risky ones.',power:'STRIKE / SKILL ONLY. A Skill on 6 refunds 1 Charge.',color:'surge'},
 bastiondie:{name:'Iron Bastion',tag:'BULWARK',faces:[2,3,4,4,5,5],allowed:['move','guard'],desc:'A defensive die with no Strike or Skill.',power:'MOVE / GUARD ONLY. Guard on 4+ also gains 1 Charge.',color:'even'}
};
export const HEROES={
 guardian:{name:'The Guardian',title:'IRONBOUND',hp:38,startingDice:['ironheart'],maxDice:3,maxCharge:4,physical:1,arcane:0,strikeType:'physical',strikeRange:1,skillType:'physical',skill:'Shield Bash',desc:'Range 1 · Stun one enemy; damage reduced versus Strike',passive:'Bulwark: Guard +2. Physical +1.',unlock:'Starting hero'},
 ranger:{name:'The Ranger',title:'WAYFINDER',hp:32,startingDice:['wayfinder'],maxDice:3,maxCharge:4,physical:1,arcane:0,strikeType:'physical',strikeRange:3,skillType:'physical',skill:'Aimed Shot',desc:'Range 4 · Pierces armor; +1 damage on rolls 5+',passive:'Deadeye: Ranged Strike range 3; Physical +1; 5+ Aimed Shots gain damage.',unlock:'Reach room 3'},
 arcanist:{name:'The Arcanist',title:'STORMCALLER',hp:29,startingDice:['aether'],maxDice:3,maxCharge:6,chargeRegen:1,physical:0,arcane:2,strikeType:'arcane',strikeRange:3,skillType:'arcane',skill:'Chain Bolt',desc:'Range 3 · Chains half damage to nearby enemies',passive:'Arcane Engine: 6 max Charge, +1 Charge each turn, +2 Skill damage. Strikes deal roll −2 before Ward.',unlock:'Defeat your first elite'},
 rogue:{name:'The Rogue',title:'NIGHTBLADE',hp:28,startingDice:['knives','knives'],maxDice:4,rollCeiling:4,maxCharge:4,physical:1,arcane:0,strikeType:'physical',strikeRange:1,skillType:'physical',skill:'Shadowstep',desc:'Range 2 · Reposition, guard +2, lower direct damage',passive:'Quick Hands: two dice, up to four; rolls cap at 4 and Strikes deal −1. Free reroll/round, odd Bleed.',unlock:'Defeat the Grave Warden'}
};
export const ENEMIES={
 slime:{name:'Mire Slime',hp:8,damage:3,range:1,armor:0,ward:1,weakness:'Physical attacks',drop:'mire'},
 skeleton:{name:'Boneguard',hp:11,damage:4,range:1,armor:2,ward:0,weakness:'Arcane attacks',drop:'bone'},
 archer:{name:'Ash Archer',hp:9,damage:4,range:4,armor:0,ward:1,weakness:'Physical attacks',drop:'ash'},
 seer:{name:'Cinder Seer',hp:12,damage:5,range:3,armor:0,ward:2,weakness:'Physical damage; cover prevents Hex Drain',drop:'cindershard'},
 hound:{name:'Gloom Hound',hp:12,damage:5,range:2,armor:1,ward:0,weakness:'Arcane damage; its marked Pounce can be dodged',drop:'houndspur'},
 brute:{name:'Hollow Brute',hp:17,damage:6,range:1,armor:2,ward:0,weakness:'Arcane attacks',drop:'brutegrip'},
 boss:{name:'Grave Warden',hp:49,damage:7,range:1,armor:1,ward:1,weakness:'Careful timing',drop:null}
};
export const RELICS=[
 {id:'fang',icon:'✦',name:'Serrated Fang',desc:'Physical Strikes inflict Bleed 1 (2 turns).',tags:['PHYSICAL','BLEED']},
 {id:'ward',icon:'⬡',name:'Stone Ward',desc:'All Guard actions grant +2 shield.',tags:['GUARD']},
 {id:'boots',icon:'➤',name:'Windstrider Boots',desc:'Move one extra tile per movement die.',tags:['POSITION']},
 {id:'lens',icon:'◈',name:'Arcane Lens',desc:'Arcane Strikes and Skills deal +2 damage.',tags:['ARCANE']},
 {id:'chalice',icon:'✧',name:'Dusk Chalice',desc:'Heal 3 HP after each battle.',tags:['SURVIVAL']},
 {id:'heart',icon:'♥',name:'Ember Heart',desc:'Gain +6 max HP and heal 6 immediately.',tags:['SURVIVAL']},
 {id:'tooth',icon:'◆',name:'Lucky Tooth',desc:'Strikes with a 6 deal +3 damage.',tags:['DICE','STRIKE']},
 {id:'shell',icon:'⬟',name:'Iron Shell',desc:'Start battles with 3 Guard.',tags:['GUARD']},
 {id:'vial',icon:'✚',name:'Crimson Vial',desc:'Gain a healing potion.',tags:['SUPPLY']},
 {id:'echo',icon:'❖',name:'Echo Charm',desc:'Using a Skill heals 1 HP.',tags:['SKILL','SURVIVAL']},
 {id:'mirror',icon:'◌',name:'Twilight Mirror',desc:'One more free dice reroll each round.',tags:['DICE']},
 {id:'parity',icon:'⬢',name:'Evenbound Sigil',desc:'Even-die physical Strikes deal +2 damage.',tags:['PHYSICAL','DICE']},
 {id:'oddwood',icon:'☾',name:'Oddwood Charm',desc:'Odd-die Skills deal +2 damage.',tags:['SKILL','DICE']},
 {id:'tonic',icon:'↻',name:'Fortune Phial',desc:'Gain two reroll tonics.',tags:['SUPPLY','DICE']},
 {id:'bastion',icon:'▣',name:'Bastion Link',desc:'Guard with 1 or 2: +3 shield and +1 extra Charge.',tags:['GUARD','DICE']},
 {id:'capacitor',icon:'✺',name:'Ley Capacitor',desc:'If a Skill damages 2+ enemies, refund 1 Charge.',tags:['ARCANE','SKILL']},
 {id:'hawkeye',icon:'◎',name:'Hawkeye Wrap',desc:'Ranged Strikes on 5+ deal +2 damage.',tags:['RANGED','PHYSICAL']},
 {id:'nightoil',icon:'☽',name:'Night Oil',desc:'Odd physical Strikes apply +1 Bleed (2 turns).',tags:['BLEED','DICE']},
 {id:'mire',icon:'♜',name:'Mire Catalyst',desc:'Odd Strikes inflict Bleed 1 (2 turns). Dropped by Slimes.',tags:['BLEED','DICE'],drop:'slime'},
 {id:'bone',icon:'⬔',name:'Boneguard Plating',desc:'Even Guard grants +2 shield. Dropped by Boneguards.',tags:['GUARD','DICE'],drop:'skeleton'},
 {id:'ash',icon:'⌁',name:'Ashstring',desc:'Ranged Strikes at distance 2+ deal +2. Dropped by Ash Archers.',tags:['RANGED'],drop:'archer'},
 {id:'brutegrip',icon:'⌘',name:'Hollow Grip',desc:'Skills against adjacent enemies deal +2. Dropped by Brutes.',tags:['SKILL','MELEE'],drop:'brute'},
 {id:'cindershard',icon:'✧',name:'Seer Shard',desc:'Skills on rolls 5+ deal +2; Guard actions −1. Dropped by Cinder Seers.',tags:['ARCANE','SKILL','TRADEOFF'],drop:'seer'},
 {id:'houndspur',icon:'➠',name:'Hound Spur',desc:'Moving 3+ tiles gives +2 Guard. Dropped by Gloom Hounds.',tags:['POSITION','GUARD'],drop:'hound'},
 {id:'unstable',icon:'✴',name:'Unstable Catalyst',desc:'Arcane Skills +3; Strikes −1 and Guard −3. Commit to casting.',tags:['ARCANE','SKILL','TRADEOFF'],exclusive:'arcanist'},
 {id:'reservoir',icon:'◇',name:'Shattered Reservoir',desc:'+2 maximum Charge; Skills at 5+ Charge deal +2. Guard −2.',tags:['ARCANE','CHARGE','TRADEOFF'],exclusive:'arcanist'},
 {id:'bloodmagic',icon:'☄',name:'Blood Conduit',desc:'Arcane Skills +4, cost 2 HP per cast and cannot cast below 3 HP.',tags:['ARCANE','SKILL','TRADEOFF'],exclusive:'arcanist'},
 {id:'longshot',icon:'➳',name:'Longshot Strings',desc:'Strikes from 3+ tiles away +3 damage; adjacent Strikes −2.',tags:['RANGED','POSITION','TRADEOFF'],exclusive:'ranger'},
 {id:'counterweight',icon:'⛨',name:'Counterweight Plate',desc:'Guard +3; Move −1 tile (minimum 1).',tags:['GUARD','POSITION','TRADEOFF'],exclusive:'guardian'},
 {id:'temper',icon:'⚒',name:'Tempered Edge',desc:'Physical Strikes +2; Guard −2.',tags:['MELEE','PHYSICAL','TRADEOFF'],exclusive:'guardian'},
 {id:'underhand',icon:'☾',name:'Underhand Tricks',desc:'Strikes on 1–2 deal +3; Skills deal −2.',tags:['BLEED','DICE','TRADEOFF'],exclusive:'rogue'},
 {id:'twincut',icon:'✃',name:'Twin Cut',desc:'Second Strike each turn inflicts +2 Bleed; Guard −2.',tags:['BLEED','DICE','TRADEOFF'],exclusive:'rogue'}
];
// Paths are exclusive, run-only choices after room 2. Every benefit has a visible cost.
export const OATHS={
 fortress:{hero:'guardian',icon:'▣',name:'Stone Sentinel',desc:'Guard +3. Movement cannot exceed 2 tiles. If enemy damage is blocked, gain +1 Charge.',tags:['GUARD','CHARGE','TRADEOFF']},
 avenger:{hero:'guardian',icon:'⚔',name:'Vengeful Edge',desc:'Strikes +1 and killing blows restore 1 HP. Guard −2.',tags:['PHYSICAL','MELEE','TRADEOFF']},
 march:{hero:'guardian',icon:'➤',name:'Shield Runner',desc:'Moving 2+ tiles gives +3 Guard. Skills −1 damage.',tags:['POSITION','GUARD','TRADEOFF']},
 eagle:{hero:'ranger',icon:'◎',name:'Eagle Eye',desc:'Strikes from 3+ tiles get +3 damage. Adjacent Strikes −2.',tags:['RANGED','POSITION','TRADEOFF']},
 wind:{hero:'ranger',icon:'⌁',name:'Windrunner',desc:'Move 2+ tiles: +2 Guard and +1 Charge. Strikes −1 damage.',tags:['POSITION','CHARGE','TRADEOFF']},
 seeker:{hero:'ranger',icon:'⌾',name:'Marked Quarry',desc:'Striking an enemy marks it; subsequent Strikes against that enemy gain +2 damage. Skills −1 damage.',tags:['RANGED','STRIKE','TRADEOFF']},
 storm:{hero:'arcanist',icon:'✺',name:'Overchannel',desc:'Skills +4 damage but cost 3 Charge instead of 2. Guard −1.',tags:['ARCANE','SKILL','TRADEOFF']},
 weave:{hero:'arcanist',icon:'◇',name:'Wardweaver',desc:'Each Skill grants +3 Guard. Skills −2 damage.',tags:['ARCANE','GUARD','TRADEOFF']},
 rift:{hero:'arcanist',icon:'✴',name:'Frail Star',desc:'Skills +3 damage, but immediately lose 5 maximum and current HP. Guard −2.',tags:['ARCANE','SKILL','TRADEOFF']},
 flurry:{hero:'rogue',icon:'✃',name:'Flurry',desc:'Second and later Strikes each turn deal +2. Guard −2.',tags:['BLEED','STRIKE','TRADEOFF']},
 shade:{hero:'rogue',icon:'☽',name:'Smoke Dancer',desc:'Move 2+ tiles: +2 Guard and +1 Charge. Strikes −1 damage.',tags:['POSITION','CHARGE','TRADEOFF']},
 trick:{hero:'rogue',icon:'◌',name:'Loaded Chances',desc:'One extra reroll focus per round. Strikes −1 and Guard −1.',tags:['DICE','TRADEOFF']}
};
export const oathOptions=hero=>Object.entries(OATHS).filter(([,o])=>o.hero===hero).map(([id,o])=>({...o,id:'oath:'+id}));
const oathOf=s=>OATHS[s.run?.oath]||null;
export const skillCostFor=s=>SKILL_COST+(s.run?.oath==='storm'?1:0);
const rand=n=>Math.floor(Math.random()*n),pick=a=>a[rand(a.length)],clamp=(n,a,b)=>Math.max(a,Math.min(n,b)),k=p=>`${p.x},${p.y}`,d=(a,b)=>Math.abs(a.x-b.x)+Math.abs(a.y-b.y),grid=()=>Array.from({length:25},(_,i)=>({x:i%5,y:Math.floor(i/5)}));
const num=(r,id)=>r.relics.filter(x=>x===id).length;
const mapDie=t=>t==='twinsix'?'gravebone':t;
const heroAffinity={guardian:['GUARD','MELEE','PHYSICAL'],ranger:['RANGED','PHYSICAL','DICE'],arcanist:['ARCANE','SKILL','DICE'],rogue:['BLEED','DICE','POSITION']};
export const maxDiceFor=hero=>HEROES[hero]?.maxDice||3;
export const rollCapFor=hero=>HEROES[hero]?.rollCeiling||6;
export const maxChargeFor=s=>(HEROES[s.run?.hero]?.maxCharge||MAX_CHARGE)+(s.run?.relics?.includes('reservoir')?2:0);
// Meta progression is unlock-only: no saved build or equipment can change a new run.
const normHeroes=m=>['guardian',...(m.best>=3?['ranger']:[]),...(m.elites>=1?['arcanist']:[]),...(m.wins>=1?['rogue']:[])];
export const fresh=()=>({version:7,phase:'home',meta:{best:0,wins:0,runs:0,elites:0,heroes:['guardian'],blueprints:['standard']},run:null,muted:false,message:''});
function normalizeMeta(meta,version){
 const m={...fresh().meta,best:Math.max(0,Number(meta?.best)||0),wins:Math.max(0,Number(meta?.wins)||0),runs:Math.max(0,Number(meta?.runs)||0),elites:Math.max(0,Number(meta?.elites)||0)};
 m.blueprints=[...new Set(['standard',...(Array.isArray(meta?.blueprints)?meta.blueprints.map(mapDie).filter(id=>DICE_TYPES[id]):[])])];
 if(m.wins>=1)m.blueprints.push('gravebone');if(m.wins>=2)m.blueprints.push('stormglass');m.blueprints=[...new Set(m.blueprints)];
 // v0.1–0.2 had three initial heroes and a 40-shard Rogue unlock. Honor them
 // during migration even though shards are no longer minted or spendable.
 const legacy=version<3?['guardian','ranger','arcanist',...((Number(meta?.shards)||0)>=40||m.wins>=1?['rogue']:[])]:[];
 m.heroes=[...new Set(['guardian',...legacy,...(Array.isArray(meta?.heroes)?meta.heroes.filter(id=>HEROES[id]):[]),...normHeroes(m)])];
 return m;
}
export const unlocked=(s,id)=>!!HEROES[id]&&(s.meta.heroes.includes(id)||normHeroes(s.meta).includes(id));
export function start(s,id){if(s.phase!=='home'||!unlocked(s,id))return false;const h=HEROES[id],loadout=[...h.startingDice];s.run={hero:id,hp:h.hp,max:h.hp,potions:2,tonics:1,gold:0,depth:1,kind:'battle',relics:[],upgrade:{strike:0,skill:0},kills:0,combat:null,choices:[],paths:[],diceLoadout:loadout,oath:null,newBlueprint:'',newHero:''};s.meta.runs++;enter(s,'battle');return true;}
const roll=(loadout,hero)=>(loadout||['standard']).map((_,id)=>{const kind=DICE_TYPES[loadout?.[id]]?loadout[id]:'standard';return {id,kind,value:Math.min(rollCapFor(hero),pick(DICE_TYPES[kind].faces)),used:false};});
const alive=c=>c.enemies.filter(e=>e.hp>0);
const occupied=(c,p)=>c.rocks.some(v=>k(v)===k(p))||alive(c).some(e=>k(e)===k(p));
function path(c,from,max){let q=[from],seen=new Map([[k(from),0]]);for(let i=0;i<q.length;i++){let a=q[i],n=seen.get(k(a));if(n>=max)continue;for(let b of [{x:a.x+1,y:a.y},{x:a.x-1,y:a.y},{x:a.x,y:a.y+1},{x:a.x,y:a.y-1}]){if(b.x<0||b.x>=5||b.y<0||b.y>=5||seen.has(k(b))||occupied(c,b))continue;seen.set(k(b),n+1);q.push(b);}}return q.slice(1);}
// Ranged attacks are explicitly telegraphed as TRACKING: they can be blocked with cover,
// Guard, stun, or distance, but cannot be dodged by a single sideways step.
const canShoot=(c,from,to,range)=>{if(d(from,to)>range)return false;const steps=Math.max(Math.abs(from.x-to.x),Math.abs(from.y-to.y));for(let i=1;i<steps;i++){const p={x:Math.round(from.x+(to.x-from.x)*i/steps),y:Math.round(from.y+(to.y-from.y)*i/steps)};if(c.rocks.some(v=>k(v)===k(p)))return false;}return true;};
export const threatens=(c,e,pos=c.player)=>!!e.intent&&e.intent.type==='attack'&&(e.intent.tracking?canShoot(c,e,pos,e.intent.range||ENEMIES[e.type].range):e.intent.targets.some(p=>k(p)===k(pos)));
function intents(c){for(let e of alive(c)){let spec=ENEMIES[e.type];if(e.stun){e.intent={type:'stun',name:'STUNNED',targets:[]};continue;}
 const ranged=e.type==='archer'||e.type==='seer'||(e.type==='boss'&&c.turn%2===0);
 if(ranged&&canShoot(c,e,c.player,spec.range+(e.type==='boss'?2:0)))e.intent={type:'attack',name:e.type==='boss'?'GRAVE BOLT':e.type==='seer'?'HEX DRAIN':'TRACKING SHOT',tracking:true,range:spec.range+(e.type==='boss'?2:0),targets:[{...c.player}]};
 else if(d(e,c.player)<=spec.range&&(!ranged||e.type==='boss'))e.intent={type:'attack',name:e.type==='boss'?'SWEEP':e.type==='hound'?'POUNCE':'STRIKE',tracking:false,targets:[{...c.player}]};
 else e.intent={type:'move',name:ranged?'SEEK ANGLE':e.type==='hound'?'SPRINT':'HUNT',steps:e.type==='hound'?3:2,targets:[]};
 }}
function pursue(c,e,steps){
 // Breadth-first distance field lets enemies navigate around rock corners.
 const q=[c.player],dist=new Map([[k(c.player),0]]),blocked=new Set(c.rocks.map(k));
 for(let i=0;i<q.length;i++){const v=q[i],depth=dist.get(k(v));for(const p of [{x:v.x+1,y:v.y},{x:v.x-1,y:v.y},{x:v.x,y:v.y+1},{x:v.x,y:v.y-1}]){
 if(p.x<0||p.x>=SIZE||p.y<0||p.y>=SIZE||blocked.has(k(p))||dist.has(k(p)))continue;dist.set(k(p),depth+1);q.push(p);}}
 for(let i=0;i<steps;i++){const cur=dist.get(k(e))??Infinity;const opts=grid().filter(p=>d(p,e)===1&&!occupied(c,p)&&k(p)!==k(c.player)&&dist.has(k(p)));opts.sort((a,b)=>dist.get(k(a))-dist.get(k(b)));if(!opts.length||dist.get(k(opts[0]))>=cur)return;e.x=opts[0].x;e.y=opts[0].y;}}


function gain(s,n){const c=s.run?.combat;if(c)c.charge=clamp((c.charge||0)+n,0,maxChargeFor(s));}
function log(c,t){c.log.unshift(t);c.log=c.log.slice(0,5);}
function grantHero(s){const m=s.meta;for(const id of ['ranger','arcanist','rogue']){if(normHeroes(m).includes(id)&&!m.heroes.includes(id)){m.heroes.push(id);if(s.run)s.run.newHero=id;}}}
function availableRelics(s){const r=s.run;const ownership=new Set(r.relics),pool=RELICS.filter(x=>(!x.exclusive||x.exclusive===r.hero)&&(r.hero!=='rogue'||x.id!=='tooth')&&!x.drop&&(!ownership.has(x.id)||['vial','tonic','heart','chalice'].includes(x.id))&&!(r.hero==='arcanist'&&['fang','parity','nightoil','hawkeye'].includes(x.id))&&!(r.hero!=='arcanist'&&['lens','capacitor'].includes(x.id))&&!(HEROES[r.hero].strikeRange===1&&['ash','hawkeye'].includes(x.id)));const affinity=heroAffinity[r.hero]||[];pool.sort((a,b)=>b.tags.filter(t=>affinity.includes(t)).length-a.tags.filter(t=>affinity.includes(t)).length);return pool;}
export const dieOffer=id=>({id:'die:'+id,icon:'🎲',name:(DICE_TYPES[id]||DICE_TYPES.standard).name+' · New die',desc:`Faces: ${(DICE_TYPES[id]||DICE_TYPES.standard).faces.join(' / ')}. ${(DICE_TYPES[id]||DICE_TYPES.standard).power}`,tags:['DIE','RUN ONLY']});
// Common dice can always be found during a run. Elite/boss discoveries expand
// the future *loot pool* — never a permanent loadout or first-die choice.
export const COMMON_DICE=['standard','stride','ember','sigil','cinder','bastiondie'];
export const DISCOVERY_DICE=['evenstone','moon','gravebone','stormglass'];
export function diceOptions(s){
 const r=s.run,ids=[...COMMON_DICE,...s.meta.blueprints.filter(id=>DISCOVERY_DICE.includes(id))];
 return [...new Set(ids)].filter(id=>DICE_TYPES[id]&&!(r.hero==='rogue'&&['cinder','gravebone'].includes(id)));
}
// Guarantee a viable all-action die while randomizing the two specialist options.
// A discovered blueprint can appear as the flexible option, not as free equipment.
export function firstRoomDice(s){
 const options=diceOptions(s);
 const flex=options.filter(id=>!DICE_TYPES[id].allowed);
 const mobility=options.filter(id=>['stride','bastiondie','sigil'].includes(id));
 const assault=options.filter(id=>['ember','cinder'].includes(id));
 return [pick(flex),pick(mobility),pick(assault)].map(dieOffer);
}

function rewards(s,source=null){const r=s.run,pool=availableRelics(s),out=[];
 if(r.depth===1&&r.diceLoadout.length===1)return firstRoomDice(s);
 if(r.depth>=2&&!r.oath)return oathOptions(r.hero);
 // Rogue already has two dice: the first victory rewards a build decision, not a free third action.
 if(r.depth===1&&r.hero==='rogue'){const proposed=pool.filter(x=>x.exclusive==='rogue'),featured=pick(proposed);const rest=pool.filter(x=>x.id!==featured.id);return [featured,...Array.from({length:2},()=>rest.splice(rand(rest.length),1)[0])];}
 if(r.diceLoadout.length<maxDiceFor(r.hero)&&(r.depth===3||r.depth>=5||r.kind==='elite'))out.push(dieOffer(pick(diceOptions(s))));
 if(source){const drop=RELICS.find(x=>x.drop===source);if(drop&&!r.relics.includes(drop.id)&&out.length<2)out.push(drop);}
 if(!out.length){const suggested=pool.filter(x=>x.tags.some(t=>heroAffinity[r.hero]?.includes(t)));if(suggested.length){const item=pick(suggested);out.push(item);pool.splice(pool.indexOf(item),1);}}
 while(out.length<3&&pool.length)out.push(pool.splice(rand(pool.length),1)[0]);return out;}

export function enter(s,kind){let r=s.run;r.kind=kind;r.newBlueprint='';r.newHero='';s.meta.best=Math.max(s.meta.best,r.depth);grantHero(s);r.combat=null;
 if(kind==='camp'){r.choices=[{id:'rest',icon:'♥',name:'Rest by the fire',desc:'Recover 40% of maximum HP.'},{id:'train',icon:'⚔',name:'Sharpen your weapon',desc:'Strikes gain +1 damage.'},{id:'meditate',icon:'✦',name:'Focus your power',desc:'Skills gain +1 damage.'}];s.phase='choice';return;}
 if(kind==='cache'){r.choices=rewards(s);s.phase='choice';return;}
 if(kind==='merchant'){r.choices=[{id:'potion',name:'Restorative Vial',icon:'✚',desc:'Gain one healing potion.',cost:10},{id:'tonic',name:'Fortune Tonic',icon:'↻',desc:'One extra die reroll, usable in any battle.',cost:9},...(r.diceLoadout.length<maxDiceFor(r.hero)?[{...dieOffer(pick(diceOptions(s))),cost:16}]:[]),{id:'sharpen',name:'Sharpen Blades',icon:'⚔',desc:'This expedition only: Strikes gain +1 damage.',cost:15},{id:'blessing',name:'Warden’s Blessing',icon:'♥',desc:'Gain 5 max HP and heal 5.',cost:19}];s.phase='shop';return;}
 const cells=grid().filter(p=>p.y>0&&p.y<4&&p.x!==2),rocks=[];for(let j=0;j<2;j++)rocks.push(cells.splice(rand(cells.length),1)[0]);
 const spots=grid().filter(p=>p.y<3&&!rocks.some(b=>k(b)===k(p))),enemies=[];const count=kind==='boss'?1:kind==='elite'?Math.min(4,2+Math.floor(r.depth/4)):Math.min(3,1+Math.floor(r.depth/3));
 for(let i=0;i<count;i++){const type=kind==='boss'?'boss':kind==='elite'&&i===0?'brute':r.depth===1?'slime':i===0&&r.depth===2?'archer':i===0&&r.depth===3?'hound':i===0&&r.depth===4?'seer':i===0&&r.depth>=5?pick(['archer','hound','seer','skeleton']):pick(r.depth<4?['slime','skeleton','archer','hound']:['slime','skeleton','archer','hound','seer','brute']);const p=spots.splice(rand(spots.length),1)[0],base=ENEMIES[type],hp=base.hp+(type==='boss'?0:Math.floor((r.depth-1)/3)*2+(kind==='elite'?3:0));enemies.push({id:`${type}-${i}`,type,...p,hp,maxHp:hp,damage:base.damage+(kind==='elite'?1:0)+Math.floor((r.depth-1)/4),stun:0,bleed:0,bleedTurns:0,intent:null});}
 r.combat={player:{x:2,y:4},rocks,enemies,defeated:[],dice:roll(r.diceLoadout,r.hero),selected:0,action:DICE_TYPES[r.diceLoadout[0]]?.allowed?.[0]||'move',turn:1,shield:3*num(r,'shell'),charge:1+(HEROES[r.hero].chargeRegen||0),strikesThisTurn:0,markedTarget:null,focus:1+num(r,'mirror')+(r.oath==='trick'?1:0),trickUsed:false,animations:[],log:[kind==='boss'?'The Grave Warden stirs.':'The darkness has company.']};intents(r.combat);s.phase='combat';s.message='';
}
export const die=s=>s.run?.combat?.dice[s.run.combat.selected];
export const available=c=>c.dice.filter(v=>!v.used).length;
export function setDie(s,i){const c=s.run?.combat;if(!c||!c.dice[i]||c.dice[i].used)return false;c.selected=i;if(!canUse(c.dice[i],c.action))c.action=DICE_TYPES[c.dice[i].kind]?.allowed?.[0]||'move';return true;}
export const canUse=(die,action)=>!die||!DICE_TYPES[die.kind]?.allowed||DICE_TYPES[die.kind].allowed.includes(action);
export function setAction(s,a){const c=s.run?.combat;if(!c||!['move','strike','guard','skill'].includes(a)||!canUse(c.dice[c.selected],a))return false;c.action=a;return true;}
export function actionPreview(s){const r=s.run,c=r?.combat,v=die(s);if(!c||!v||v.used)return null;const h=HEROES[r.hero],n=v.value,type=DICE_TYPES[v.kind]||DICE_TYPES.standard;
 const base=2+Math.ceil(n/2),strType=h.strikeType,skillType=h.skillType,skillBase=1+Math.ceil(n/2);
 const guardPenalty=num(r,'unstable')*3+num(r,'reservoir')*2+num(r,'temper')*2+num(r,'twincut')*2+(r.oath==='avenger'||r.oath==='rift'||r.oath==='flurry'?2:0)+(r.oath==='storm'||r.oath==='trick'?1:0)+num(r,'cindershard');
 const typeBonus=t=>t==='physical'?h.physical:h.arcane;
 let strike=(r.hero==='arcanist'?Math.max(0,n-2):base+typeBonus(strType))+r.upgrade.strike+(strType==='arcane'?num(r,'lens')*2:0)+(n===6?num(r,'tooth')*3:0)+(type.tag==='ODD'&&n%2?1:0)+(v.kind==='ember'&&n<=2?3:0)+(strType==='physical'&&n%2===0?num(r,'parity')*2:0)-(r.hero==='rogue'?1:0)+num(r,'temper')*2-num(r,'unstable')-num(r,'reservoir')+(r.hero==='rogue'&&n<=2?num(r,'underhand')*3:0)+(r.oath==='avenger'?1:0)-(r.oath==='wind'||r.oath==='shade'||r.oath==='trick'?1:0);
 let guard=n+1+num(r,'ward')*2+(r.hero==='guardian'?2:0)+(type.tag==='EVEN'&&n%2===0?2:0)+(n%2===0?num(r,'bone')*2:0)+(n<=2?num(r,'bastion')*3:0)+(v.kind==='stride'?1:0)+num(r,'counterweight')*3+(r.oath==='fortress'?3:0)-guardPenalty;
 let skill=skillBase+typeBonus(skillType)+r.upgrade.skill+(skillType==='arcane'?num(r,'lens')*2:0)+(n%2?num(r,'oddwood')*2:0)+(type.tag==='SURGE'&&n>=4?1:0)+(r.hero==='ranger'&&n>=5?1:0)+(r.hero==='arcanist'?2:0)+num(r,'unstable')*3+(c.charge>=5?num(r,'reservoir')*2:0)+num(r,'bloodmagic')*4-num(r,'underhand')*2+(r.oath==='storm'?4:r.oath==='rift'?3:r.oath==='weave'?-2:r.oath==='march'||r.oath==='seeker'?-1:0)+(n>=5?num(r,'cindershard')*2:0)+(v.kind==='cinder'&&n===6?0:0);
 return {allowed:type.allowed||['move','strike','guard','skill'],move:r.oath==='fortress'?Math.min(2,Math.max(1,n+num(r,'boots')-num(r,'counterweight'))):Math.max(1,n+num(r,'boots')-num(r,'counterweight')),strike:Math.max(0,strike),guard:Math.max(0,guard),skill:n<3?null:Math.max(0,skill),strikeType:strType,skillType,range:{guardian:1,arcanist:3,ranger:4,rogue:2}[r.hero],strikeRange:h.strikeRange,charge:c.charge||0,maxCharge:maxChargeFor(s),skillCost:skillCostFor(s),bloodCost:num(r,'bloodmagic')*2,skillReady:n>=3&&(c.charge||0)>=skillCostFor(s)&&r.hp>num(r,'bloodmagic')*2&&canUse(v,'skill'),type:type.name};}
export function damageAgainst(s,e,action){const p=actionPreview(s);if(!p||!['strike','skill'].includes(action))return null;const h=HEROES[s.run.hero],n=die(s).value,kind=p[action+'Type'];let raw=p[action];if(raw==null)return null;
 if(action==='strike'){
 if(h.strikeRange>1&&d(s.run.combat.player,e)>=2)raw+=num(s.run,'ash')*2;
 if(h.strikeRange>1&&n>=5)raw+=num(s.run,'hawkeye')*2;
 if(s.run.hero==='ranger'&&num(s.run,'longshot'))raw+=d(s.run.combat.player,e)>=3?num(s.run,'longshot')*3:d(s.run.combat.player,e)===1?-num(s.run,'longshot')*2:0;
 if(s.run.oath==='eagle')raw+=d(s.run.combat.player,e)>=3?3:d(s.run.combat.player,e)===1?-2:0;
 if(s.run.oath==='seeker'&&s.run.combat.markedTarget===e.id)raw+=2;
 if(s.run.oath==='flurry'&&(s.run.combat.strikesThisTurn||0)>=1)raw+=2;
 }else{
 if(d(s.run.combat.player,e)===1)raw+=num(s.run,'brutegrip')*2;
 // Aimed Shot has true armor piercing; armor does not reduce its damage.
 }
 const resist=action==='skill'&&s.run.hero==='ranger'?0:(kind==='physical'?ENEMIES[e.type].armor:ENEMIES[e.type].ward);
 return Math.max(action==='strike'?0:1,raw-resist);
}
export function incoming(s){if(s.phase!=='combat')return {total:0,blocked:0,hpLoss:0};const c=s.run.combat,total=alive(c).reduce((a,e)=>a+(threatens(c,e)?e.damage:0),0);return {total,blocked:Math.min(total,c.shield),hpLoss:Math.max(0,total-c.shield)};}
export function reroll(s,index=s.run?.combat?.selected){if(s.phase!=='combat')return false;const r=s.run,c=r.combat,v=c.dice[index];if(!v||v.used)return false;const free=r.hero==='rogue'&&!c.trickUsed;if(!free&&c.focus<=0&&r.tonics<=0)return false;const source=free?'Trickster':c.focus>0?'focus':'tonic';if(free)c.trickUsed=true;else if(c.focus>0)c.focus--;else r.tonics--;v.value=Math.min(rollCapFor(r.hero),pick((DICE_TYPES[v.kind]||DICE_TYPES.standard).faces));c.selected=index;log(c,`Rerolled die ${index+1}: ${v.value} (${source}).`);s.message='';return true;}
export function targets(s){if(s.phase!=='combat')return [];const r=s.run,c=r.combat,v=die(s),h=HEROES[r.hero];if(!v||v.used||!canUse(v,c.action))return [];if(c.action==='move')return path(c,c.player,actionPreview(s).move);
 if(c.action==='strike')return alive(c).filter(e=>d(c.player,e)<=h.strikeRange).map(e=>({x:e.x,y:e.y}));
 if(c.action==='skill'&&actionPreview(s).skillReady)return alive(c).filter(e=>d(c.player,e)<=actionPreview(s).range).map(e=>({x:e.x,y:e.y}));return [];}
function hit(s,e,hp){if(e.hp<=0)return 0;const c=s.run.combat;e.hp=Math.max(0,e.hp-hp);log(c,`${ENEMIES[e.type].name} takes ${hp} damage${e.hp===0?' and falls!':'.'}`);if(!e.hp){s.run.gold+=e.type==='boss'?25:e.type==='brute'?5:3;s.run.kills++;c.defeated??=[];c.defeated.push(e.type);}return hp;}
function applyBleed(s,e,stacks){if(stacks<=0||e.hp<=0)return;e.bleed=Math.min(6,(e.bleed||0)+stacks);e.bleedTurns=2;log(s.run.combat,`${ENEMIES[e.type].name} bleeds (${e.bleed}/turn, 2 turns).`);}
function unlockBlueprint(s){const r=s.run,candidates=r.kind==='boss'?['gravebone','stormglass']:['evenstone','moon'],next=candidates.find(id=>!s.meta.blueprints.includes(id));if(next){s.meta.blueprints.push(next);r.newBlueprint=next;return next;}if(r.kind==='elite')r.tonics++;r.newBlueprint='';return null;}
function cleared(s){let r=s.run,c=r.combat;c.enemies=alive(c);if(c.enemies.length)return false;const defeated=c.defeated||[];if(['elite','boss'].includes(r.kind))unlockBlueprint(s);if(r.kind==='elite'){s.meta.elites++;grantHero(s);}r.hp=clamp(r.hp+num(r,'chalice')*3,0,r.max);r.combat=null;
 if(r.kind==='boss'){s.meta.wins++;grantHero(s);s.phase='victory';s.message='The darkness retreats.';}
 else{const source=[...defeated].reverse().find(type=>ENEMIES[type]?.drop);r.choices=rewards(s,source);s.phase='reward';s.message='Room cleared. Choose one relic.';}return true;}
export function act(s,target){if(s.phase!=='combat')return false;const r=s.run,c=r.combat,v=die(s);if(!v||v.used||!canUse(v,c.action))return false;const n=v.value,h=HEROES[r.hero],p=actionPreview(s);
 if(c.action==='guard'){c.shield+=p.guard;gain(s,1+(v.kind==='gravebone'&&n===1?2:0)+(n<=2?num(r,'bastion'):0)+(v.kind==='sigil'?1:0)+(v.kind==='bastiondie'&&n>=4?1:0));log(c,`Guard +${p.guard}; Charge ${c.charge}/${maxChargeFor(s)}.`);}
 else{
 if(c.action==='skill'&&!p.skillReady){s.message=n<3?'Skills require a die of 3+.':c.charge<skillCostFor(s)?`Skills cost ${skillCostFor(s)} Charge. Strike or Guard to build it.`:'Blood Conduit needs more HP before you can cast.';return false;}
 if(!target||!targets(s).some(t=>k(t)===k(target))){s.message='Tap a highlighted target.';return false;}
 if(c.action==='move'){const travel=d(c.player,target);c.player={...target};if(travel>=2&&(r.oath==='march'||r.oath==='wind'||r.oath==='shade'))c.shield+=r.oath==='march'?3:2;if(travel>=2&&(r.oath==='wind'||r.oath==='shade'))gain(s,1);if(travel>=3)c.shield+=num(r,'houndspur')*2;log(c,`You reposition${travel>=2&&(r.oath==='march'||r.oath==='wind'||r.oath==='shade')?' and gain cover':''}.`);}
 else{const e=alive(c).find(x=>k(x)===k(target));if(!e)return false;
 if(c.action==='strike'){
 const dealt=damageAgainst(s,e,'strike');hit(s,e,dealt);let bleed=0;
 if(r.hero==='rogue'&&num(r,'twincut')&&c.strikesThisTurn>=1)bleed+=num(r,'twincut')*2;c.strikesThisTurn=(c.strikesThisTurn||0)+1;if(h.strikeType==='physical'&&num(r,'fang'))bleed+=num(r,'fang');if(n%2===1){bleed+=num(r,'mire');if(h.strikeType==='physical')bleed+=num(r,'nightoil')+(r.hero==='rogue'?1:0);}if(r.oath==='flurry'&&n%2===1)bleed+=1;applyBleed(s,e,bleed);if(r.oath==='seeker'&&e.hp>0)c.markedTarget=e.id;if(r.oath==='avenger'&&e.hp===0)r.hp=Math.min(r.max,r.hp+1);gain(s,1);log(c,`Strike generated 1 Charge (${c.charge}/${maxChargeFor(s)}).`);
 }else{
 const dealt=damageAgainst(s,e,'skill');gain(s,-skillCostFor(s));hit(s,e,dealt);if(r.oath==='weave')c.shield+=3;let totalHits=dealt>0?1:0;
 if(r.hero==='guardian'&&e.hp){e.stun=1;e.intent={type:'stun',name:'STUNNED',targets:[]};log(c,'Shield Bash stunned the enemy.');}
 if(r.hero==='arcanist'){for(const other of alive(c).filter(x=>x!==e&&d(x,e)<=1)){hit(s,other,Math.max(1,Math.ceil(dealt/2)-ENEMIES[other.type].ward));totalHits++;}}
 if(r.hero==='rogue'){const spots=path(c,c.player,2).filter(p=>d(p,e)===1);if(spots.length)c.player=spots[0];c.shield+=2;}
 if(num(r,'echo'))r.hp=Math.min(r.max,r.hp+num(r,'echo'));
 if(num(r,'bloodmagic')){const cost=num(r,'bloodmagic')*2;r.hp-=cost;log(c,`Blood Conduit consumes ${cost} HP.`);}
 if((v.kind==='gravebone'||v.kind==='cinder')&&n===6)gain(s,1);
 if(num(r,'capacitor')&&totalHits>=2)gain(s,num(r,'capacitor'));
 log(c,`${h.skill} spent ${skillCostFor(s)} Charge (${c.charge}/${maxChargeFor(s)} left).`);
 }
 }
 }
 v.used=true;const next=c.dice.findIndex(x=>!x.used);if(next>=0){c.selected=next;if(!canUse(c.dice[next],c.action))c.action=DICE_TYPES[c.dice[next].kind]?.allowed?.[0]||'move';}s.message='';if(cleared(s))return true;if(next<0)enemyTurn(s);return true;
}
function enemyTurn(s){const r=s.run,c=r.combat;c.animations=[];for(const e of alive(c)){if((e.bleed||0)>0){hit(s,e,e.bleed);e.bleedTurns=Math.max(0,(e.bleedTurns||0)-1);if(!e.bleedTurns)e.bleed=0;}}
 if(cleared(s))return;
 for(const e of alive(c)){const t=e.intent;if(t.type==='attack'&&threatens(c,e)){let blocked=Math.min(c.shield,e.damage),hp=e.damage-blocked;c.shield-=blocked;r.hp=Math.max(0,r.hp-hp);if(blocked&&r.oath==='fortress')gain(s,1);if(hp>0&&e.type==='seer'){gain(s,-1);log(c,'Cinder Seer drains 1 Charge through your defenses.');}c.animations.push({kind:t.tracking?'ranged':'melee',from:{x:e.x,y:e.y},to:{...c.player},amount:hp});log(c,`${ENEMIES[e.type].name} ${t.tracking?'shoots':'hits'} for ${hp}${blocked?` (${blocked} blocked)`:''}.`);}
 else if(t.type==='move'){pursue(c,e,t.steps||2);log(c,`${ENEMIES[e.type].name} closes in.`);}
 else if(t.type==='attack')log(c,`${ENEMIES[e.type].name} misses (cover, distance or dodge).`);else log(c,`${ENEMIES[e.type].name} is stunned.`);}
 if(r.hp<=0){r.combat=null;s.phase='defeat';return;}for(const e of c.enemies)e.stun=Math.max(0,e.stun-1);c.turn++;c.shield=0;c.action=DICE_TYPES[r.diceLoadout[0]]?.allowed?.[0]||'move';c.dice=roll(r.diceLoadout,r.hero);c.selected=0;c.focus=1+num(r,'mirror')+(r.oath==='trick'?1:0);c.trickUsed=false;c.strikesThisTurn=0;gain(s,HEROES[r.hero].chargeRegen||0);intents(c);s.message='';}

export function endTurn(s){if(s.phase!=='combat')return false;enemyTurn(s);return true;}
export function potion(s){if(s.phase!=='combat'||s.run.potions<1||s.run.hp===s.run.max)return false;const r=s.run;r.potions--;const h=Math.min(12,r.max-r.hp);r.hp+=h;log(r.combat,`You drink a potion (+${h} HP).`);return true;}
export function choose(s,id){if(!['choice','reward'].includes(s.phase))return false;const r=s.run,x=r.choices.find(i=>i.id===id);if(!x)return false;
 if(id.startsWith('oath:')){const oath=id.slice(5);if(r.oath||OATHS[oath]?.hero!==r.hero||r.depth<2)return false;r.oath=oath;if(oath==='rift'){r.max=Math.max(1,r.max-5);r.hp=Math.min(r.hp,r.max);} }
 else if(id.startsWith('die:')){if(r.diceLoadout.length>=maxDiceFor(r.hero))return false;r.diceLoadout.push(id.slice(4));}
 else if(id==='rest')r.hp=Math.min(r.max,r.hp+Math.ceil(r.max*.4));else if(id==='train')r.upgrade.strike++;else if(id==='meditate')r.upgrade.skill++;
 else{r.relics.push(id);if(id==='heart'){r.max+=6;r.hp+=6;}if(id==='vial')r.potions++;if(id==='tonic')r.tonics+=2;}
 r.choices=[];makePaths(s);return true;}
export function makePaths(s){const r=s.run,n=r.depth+1;
 if(n===10)r.paths=[{id:'boss',kind:'boss',icon:'☠',name:'The Grave Gate',desc:'Face the final guardian.',risk:'BOSS'}];
 else if(n===4||n===7)r.paths=[{id:'camp',kind:'camp',icon:'♨',name:'Quiet Hearth',desc:'Rest or train.',risk:'SAFE'},{id:'elite',kind:'elite',icon:'⚔',name:'Forsaken Hall',desc:'More danger; a chance to discover new future loot patterns.',risk:'DANGER'}];
 else if(n===6)r.paths=[{id:'cache',kind:'cache',icon:'✧',name:'Forgotten Vault',desc:'Claim a treasure.',risk:'TREASURE'},{id:'elite',kind:'elite',icon:'⚔',name:'Bone Citadel',desc:'A difficult encounter.',risk:'DANGER'}];
 else if(n===8)r.paths=[{id:'merchant',kind:'merchant',icon:'◈',name:'Lantern Merchant',desc:'Spend gold on upgrades.',risk:'TRADER'},{id:'elite',kind:'elite',icon:'⚔',name:'The Gauntlet',desc:'Tough foes. Valuable relics and a chance at a new discovery.',risk:'DANGER'}];
 else r.paths=[{id:'battle',kind:'battle',icon:'◇',name:pick(['Fungal Crossing','Moonlit Crypt','Broken Stair','Echoing Depths']),desc:'A standard encounter.',risk:'BATTLE'},{id:'elite',kind:'elite',icon:'⚔',name:pick(['The Bloodwell','Hollow Sanctum','Shattered Barracks']),desc:'Harder enemies, more rewards.',risk:'DANGER'}];
 s.phase='path';}
export function takePath(s,id){if(s.phase!=='path')return false;const opt=s.run.paths.find(i=>i.id===id);if(!opt)return false;s.run.depth++;enter(s,opt.kind);return true;}
export function buy(s,id){if(s.phase!=='shop')return false;const r=s.run,x=r.choices.find(i=>i.id===id);
 if(!x||r.gold<x.cost||(id==='potion'&&r.potions>=5)||(id.startsWith('die:')&&r.diceLoadout.length>=maxDiceFor(r.hero)))return false;
 if(id.startsWith('die:')&&!diceOptions(s).includes(id.slice(4)))return false;
 r.gold-=x.cost;
 if(id==='potion')r.potions++;
 if(id==='tonic')r.tonics++;
 if(id.startsWith('die:'))r.diceLoadout.push(id.slice(4));
 if(id==='sharpen'||id==='forge')r.upgrade.strike++;
 if(id==='blessing'){r.max+=5;r.hp+=5;}
 r.choices=r.choices.filter(i=>i.id!==id);return true;
}
export function leaveShop(s){if(s.phase!=='shop')return false;makePaths(s);return true;}
export function pause(s){if(!s.run||!['combat','choice','reward','path','shop'].includes(s.phase))return false;s.run.paused=s.phase;s.phase='home';return true;}
export function resume(s){if(s.phase!=='home'||!s.run?.paused)return false;s.phase=s.run.paused;delete s.run.paused;return true;}
export function abandon(s){s.run=null;s.phase='home';return true;}
export function restore(raw){if(!raw||![1,2,3,4,5,6,7].includes(raw.version)||!raw.meta)return fresh();const s=fresh();s.meta=normalizeMeta(raw.meta,raw.version);s.muted=!!raw.muted;
 if(['home','combat','choice','reward','path','shop','defeat','victory'].includes(raw.phase)&&raw.run&&HEROES[raw.run.hero]&&raw.run.depth>0&&raw.run.depth<=10&&raw.run.hp>=0&&Array.isArray(raw.run.relics)){
 if(raw.phase==='combat'&&!raw.run.combat?.dice?.length)return s;if(raw.phase==='home'&&(!raw.run.paused||!['combat','choice','reward','path','shop'].includes(raw.run.paused)))return s;s.phase=raw.phase;s.run=raw.run;s.run.tonics=Math.max(0,Number(raw.run.tonics??1)||0);s.run.newBlueprint=mapDie(raw.run.newBlueprint||'');s.run.newHero=raw.run.newHero||'';// Keep an active old expedition intact, including a legacy Forge-selected die.
 const preserved=Array.isArray(raw.run.diceLoadout)&&raw.run.diceLoadout.length?raw.run.diceLoadout:(raw.version<=3?Array(Math.max(1,raw.run.combat?.dice?.length||3)).fill('standard'):HEROES[s.run.hero].startingDice);
 s.run.diceLoadout=preserved.slice(0,maxDiceFor(s.run.hero)).map((kind,i)=>DICE_TYPES[mapDie(kind)]?mapDie(kind):(HEROES[s.run.hero].startingDice[i]||'standard'));
 // Pre-v0.7 merchants offered a mystery die. Migrate it to an explicitly
 // identified die so old saves don't lose the ability to buy a reward.
 if(s.phase==='shop'||s.run.paused==='shop')s.run.choices=(s.run.choices||[]).map(x=>x.id==='newdie'?{...dieOffer(pick(diceOptions(s))),cost:x.cost}:x.id==='forge'?{...x,id:'sharpen',name:'Sharpen Blades',desc:'This expedition only: Strikes gain +1 damage.'}:x);s.run.upgrade??={strike:0,skill:0};s.run.oath=OATHS[s.run.oath]?.hero===s.run.hero?s.run.oath:null;if(s.run.combat){const c=s.run.combat;c.focus=Math.max(0,Number(c.focus??1)||0);c.charge=clamp(Number(c.charge??1)||0,0,maxChargeFor(s));c.strikesThisTurn=Math.max(0,Number(c.strikesThisTurn)||0);c.markedTarget=typeof c.markedTarget==='string'?c.markedTarget:null;c.trickUsed=!!c.trickUsed;c.defeated??=[];c.dice.forEach((v,i)=>{v.kind=DICE_TYPES[mapDie(v.kind)]?mapDie(v.kind):(s.run.diceLoadout[i]||'standard');v.value=clamp(Number(v.value)||1,1,rollCapFor(s.run.hero));});c.animations??=[];if(!canUse(c.dice[c.selected]||c.dice[0],c.action))c.action=DICE_TYPES[c.dice[c.selected]?.kind]?.allowed?.[0]||'move';c.enemies.forEach(e=>{e.bleed??=0;e.bleedTurns??=0;});}}
 return s;}

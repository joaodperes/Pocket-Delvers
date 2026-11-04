// Pocket Delvers v0.3 — deterministic game rules; zero runtime dependencies.
export const MAX_ROOMS=10, SIZE=5, STORAGE_KEY='pocket-delvers-save-v1', MAX_CHARGE=4, SKILL_COST=2;
export const DICE_TYPES={
 standard:{name:'Adventurer Die',tag:'BALANCED',faces:[1,2,3,4,5,6],desc:'Every number is possible.',power:'A reliable die for any build.'},
 evenstone:{name:'Evenstone',tag:'EVEN',faces:[1,2,2,4,4,6],desc:'Reliable low and medium even rolls.',power:'Even rolls grant +2 Guard.',color:'even'},
 moon:{name:'Moonshard',tag:'ODD',faces:[1,1,3,3,5,5],desc:'Low-average rolls with guaranteed odd outcomes.',power:'Odd Strikes deal +1 damage.',color:'odd'},
 gravebone:{name:'Gravebone',tag:'TACTIC',faces:[1,2,3,3,5,6],desc:'The Grave Warden’s measured die. No 4, two 3s.',power:'Guard with 1: +2 Charge. Skill with 6: refund 1 Charge.',color:'six'},
 stormglass:{name:'Stormglass',tag:'SURGE',faces:[1,2,3,4,5,6],desc:'Special-attack focused, with all six faces.',power:'Skills on 4+ deal +1 damage.',color:'surge'}
};
export const HEROES={
 guardian:{name:'The Guardian',title:'IRONBOUND',hp:38,physical:1,arcane:0,strikeType:'physical',strikeRange:1,skillType:'physical',skill:'Shield Bash',desc:'Range 1 · Stun one enemy; damage reduced versus Strike',passive:'Bulwark: Guard +2. Physical +1.',unlock:'Starting hero'},
 ranger:{name:'The Ranger',title:'WAYFINDER',hp:32,physical:1,arcane:0,strikeType:'physical',strikeRange:3,skillType:'physical',skill:'Aimed Shot',desc:'Range 4 · Pierces armor; extra damage on 6',passive:'Deadeye: Ranged Strike range 3; Physical +1.',unlock:'Reach room 3'},
 arcanist:{name:'The Arcanist',title:'STORMCALLER',hp:29,physical:0,arcane:2,strikeType:'arcane',strikeRange:3,skillType:'arcane',skill:'Chain Bolt',desc:'Range 3 · Chains half damage to nearby enemies',passive:'Channeler: Arcane +2; spells bypass physical armor.',unlock:'Defeat your first elite'},
 rogue:{name:'The Rogue',title:'NIGHTBLADE',hp:28,physical:1,arcane:0,strikeType:'physical',strikeRange:1,skillType:'physical',skill:'Shadowstep',desc:'Range 2 · Reposition, guard +2, lower direct damage',passive:'Trickster: One free reroll/round; odd Strikes cause Bleed.',unlock:'Defeat the Grave Warden'}
};
export const ENEMIES={
 slime:{name:'Mire Slime',hp:8,damage:3,range:1,armor:0,ward:1,weakness:'Physical attacks',drop:'mire'},
 skeleton:{name:'Boneguard',hp:11,damage:4,range:1,armor:2,ward:0,weakness:'Arcane attacks',drop:'bone'},
 archer:{name:'Ash Archer',hp:8,damage:3,range:3,armor:0,ward:1,weakness:'Physical attacks',drop:'ash'},
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
 {id:'brutegrip',icon:'⌘',name:'Hollow Grip',desc:'Skills against adjacent enemies deal +2. Dropped by Brutes.',tags:['SKILL','MELEE'],drop:'brute'}
];
const rand=n=>Math.floor(Math.random()*n),pick=a=>a[rand(a.length)],clamp=(n,a,b)=>Math.max(a,Math.min(n,b)),k=p=>`${p.x},${p.y}`,d=(a,b)=>Math.abs(a.x-b.x)+Math.abs(a.y-b.y),grid=()=>Array.from({length:25},(_,i)=>({x:i%5,y:Math.floor(i/5)}));
const num=(r,id)=>r.relics.filter(x=>x===id).length;
const mapDie=t=>t==='twinsix'?'gravebone':t;
const heroAffinity={guardian:['GUARD','MELEE','PHYSICAL'],ranger:['RANGED','PHYSICAL','DICE'],arcanist:['ARCANE','SKILL','DICE'],rogue:['BLEED','DICE','POSITION']};
const normHeroes=m=>['guardian',...(m.best>=3?['ranger']:[]),...(m.elites>=1?['arcanist']:[]),...(m.wins>=1?['rogue']:[])];
export const fresh=()=>({version:3,phase:'home',meta:{shards:0,best:0,wins:0,runs:0,elites:0,heroes:['guardian'],blueprints:['standard'],equipped:['standard','standard','standard']},run:null,muted:false,message:''});
export function equipDie(s,slot,type){if(s.phase!=='home'||!Number.isInteger(slot)||slot<0||slot>2||!DICE_TYPES[type]||!s.meta.blueprints.includes(type))return false;s.meta.equipped[slot]=type;return true;}
function normalizeMeta(meta,version){const old=version<3,m={...fresh().meta,shards:Math.max(0,Number(meta?.shards)||0),best:Math.max(0,Number(meta?.best)||0),wins:Math.max(0,Number(meta?.wins)||0),runs:Math.max(0,Number(meta?.runs)||0),elites:Math.max(0,Number(meta?.elites)||0)};
 m.blueprints=['standard',...(Array.isArray(meta?.blueprints)?meta.blueprints.map(mapDie).filter(x=>x!=='standard'&&DICE_TYPES[x]):[])];if(m.wins>=1)m.blueprints.push('gravebone');if(m.wins>=2)m.blueprints.push('stormglass');m.blueprints=[...new Set(m.blueprints)];m.equipped=Array.from({length:3},(_,i)=>{const id=mapDie(meta?.equipped?.[i]);return m.blueprints.includes(id)?id:'standard';});
 // Never remove access to the three initially playable classes from existing players.
 const legacy=old?['guardian','ranger','arcanist',...(m.shards>=40||m.wins>=1?['rogue']:[])]:[];
 m.heroes=[...new Set(['guardian',...legacy,...(Array.isArray(meta?.heroes)?meta.heroes.filter(x=>HEROES[x]):[]),...normHeroes(m)])];return m;}
export const unlocked=(s,id)=>!!HEROES[id]&&(s.meta.heroes.includes(id)||normHeroes(s.meta).includes(id));
export function start(s,id){if(!unlocked(s,id))return false;const h=HEROES[id];s.run={hero:id,hp:h.hp,max:h.hp,potions:2,tonics:1,gold:0,depth:1,kind:'battle',relics:[],upgrade:{strike:0,skill:0},kills:0,combat:null,choices:[],paths:[],diceLoadout:[...s.meta.equipped],newBlueprint:'',newHero:''};s.meta.runs++;enter(s,'battle');return true;}
const roll=loadout=>[0,1,2].map(id=>{const kind=DICE_TYPES[loadout?.[id]]?loadout[id]:'standard';return {id,kind,value:pick(DICE_TYPES[kind].faces),used:false};});
const alive=c=>c.enemies.filter(e=>e.hp>0);
const occupied=(c,p)=>c.rocks.some(v=>k(v)===k(p))||alive(c).some(e=>k(e)===k(p));
function path(c,from,max){let q=[from],seen=new Map([[k(from),0]]);for(let i=0;i<q.length;i++){let a=q[i],n=seen.get(k(a));if(n>=max)continue;for(let b of [{x:a.x+1,y:a.y},{x:a.x-1,y:a.y},{x:a.x,y:a.y+1},{x:a.x,y:a.y-1}]){if(b.x<0||b.x>=5||b.y<0||b.y>=5||seen.has(k(b))||occupied(c,b))continue;seen.set(k(b),n+1);q.push(b);}}return q.slice(1);}
function intents(c){for(let e of alive(c)){let spec=ENEMIES[e.type];e.intent=e.stun?{type:'stun',name:'STUNNED',targets:[]}:d(e,c.player)<=spec.range?{type:'attack',name:e.type==='archer'?'SHOOT':e.type==='boss'?'SMASH':'STRIKE',targets:[{...c.player}]}:{type:'move',name:'ADVANCE',targets:[]};}}
function gain(s,n){const c=s.run?.combat;if(c)c.charge=clamp((c.charge||0)+n,0,MAX_CHARGE);}
function log(c,t){c.log.unshift(t);c.log=c.log.slice(0,5);}
function grantHero(s){const m=s.meta;for(const id of ['ranger','arcanist','rogue']){if(normHeroes(m).includes(id)&&!m.heroes.includes(id)){m.heroes.push(id);if(s.run)s.run.newHero=id;}}}
function availableRelics(s){const r=s.run;const ownership=new Set(r.relics),pool=RELICS.filter(x=>!x.drop&&(!ownership.has(x.id)||['vial','tonic','heart','chalice'].includes(x.id))&&!(r.hero==='arcanist'&&['fang','parity','nightoil','hawkeye'].includes(x.id))&&!(r.hero!=='arcanist'&&['lens','capacitor'].includes(x.id))&&!(HEROES[r.hero].strikeRange===1&&['ash','hawkeye'].includes(x.id)));const affinity=heroAffinity[r.hero]||[];pool.sort((a,b)=>b.tags.filter(t=>affinity.includes(t)).length-a.tags.filter(t=>affinity.includes(t)).length);return pool;}
function rewards(s,source=null){const pool=availableRelics(s);const out=[];if(source){const drop=RELICS.find(x=>x.drop===source);if(drop&&!s.run.relics.includes(drop.id))out.push(drop);}
 // One affinity-weighted option in each choice set; the other slots remain unpredictable.
 if(!out.length){const suggested=pool.filter(x=>x.tags.some(t=>heroAffinity[s.run.hero]?.includes(t)));if(suggested.length){const item=pick(suggested);out.push(item);pool.splice(pool.indexOf(item),1);}}
 while(out.length<3&&pool.length){out.push(pool.splice(rand(pool.length),1)[0]);}return out;}
export function enter(s,kind){let r=s.run;r.kind=kind;r.newBlueprint='';r.newHero='';s.meta.best=Math.max(s.meta.best,r.depth);grantHero(s);r.combat=null;
 if(kind==='camp'){r.choices=[{id:'rest',icon:'♥',name:'Rest by the fire',desc:'Recover 40% of maximum HP.'},{id:'train',icon:'⚔',name:'Sharpen your weapon',desc:'Strikes gain +1 damage.'},{id:'meditate',icon:'✦',name:'Focus your power',desc:'Skills gain +1 damage.'}];s.phase='choice';return;}
 if(kind==='cache'){r.choices=rewards(s);s.phase='choice';return;}
 if(kind==='merchant'){r.choices=[{id:'potion',name:'Restorative Vial',icon:'✚',desc:'Gain one healing potion.',cost:10},{id:'tonic',name:'Fortune Tonic',icon:'↻',desc:'One extra die reroll, usable in any battle.',cost:9},{id:'forge',name:'Warrior’s Edge',icon:'⚔',desc:'Strikes gain +1 damage.',cost:15},{id:'blessing',name:'Warden’s Blessing',icon:'♥',desc:'Gain 5 max HP and heal 5.',cost:19}];s.phase='shop';return;}
 const cells=grid().filter(p=>p.y>0&&p.y<4&&p.x!==2),rocks=[];for(let j=0;j<2;j++)rocks.push(cells.splice(rand(cells.length),1)[0]);
 const spots=grid().filter(p=>p.y<3&&!rocks.some(b=>k(b)===k(p))),enemies=[];const count=kind==='boss'?1:kind==='elite'?Math.min(4,2+Math.floor(r.depth/4)):Math.min(3,1+Math.floor(r.depth/3));
 for(let i=0;i<count;i++){const type=kind==='boss'?'boss':kind==='elite'&&i===0?'brute':pick(r.depth<3?['slime','skeleton']:['slime','skeleton','archer','brute']);const p=spots.splice(rand(spots.length),1)[0],base=ENEMIES[type],hp=base.hp+(type==='boss'?0:Math.floor((r.depth-1)/3)*2+(kind==='elite'?3:0));enemies.push({id:`${type}-${i}`,type,...p,hp,maxHp:hp,damage:base.damage+(kind==='elite'?1:0),stun:0,bleed:0,bleedTurns:0,intent:null});}
 r.combat={player:{x:2,y:4},rocks,enemies,defeated:[],dice:roll(r.diceLoadout),selected:0,action:'move',turn:1,shield:3*num(r,'shell'),charge:1,focus:1+num(r,'mirror'),trickUsed:false,log:[kind==='boss'?'The Grave Warden stirs.':'The darkness has company.']};intents(r.combat);s.phase='combat';s.message='';
}
export const die=s=>s.run?.combat?.dice[s.run.combat.selected];
export const available=c=>c.dice.filter(v=>!v.used).length;
export function setDie(s,i){const c=s.run?.combat;if(!c||!c.dice[i]||c.dice[i].used)return false;c.selected=i;return true;}
export function setAction(s,a){const c=s.run?.combat;if(!c||!['move','strike','guard','skill'].includes(a))return false;c.action=a;return true;}
export function actionPreview(s){const r=s.run,c=r?.combat,v=die(s);if(!c||!v||v.used)return null;const h=HEROES[r.hero],n=v.value,type=DICE_TYPES[v.kind]||DICE_TYPES.standard;
 const base=2+Math.ceil(n/2),strType=h.strikeType,skillType=h.skillType,skillBase=1+Math.ceil(n/2);
 const typeBonus=t=>t==='physical'?h.physical:h.arcane;
 let strike=base+typeBonus(strType)+r.upgrade.strike+(strType==='arcane'?num(r,'lens')*2:0)+(n===6?num(r,'tooth')*3:0)+(type.tag==='ODD'&&n%2?1:0)+(strType==='physical'&&n%2===0?num(r,'parity')*2:0);
 let guard=n+1+num(r,'ward')*2+(r.hero==='guardian'?2:0)+(type.tag==='EVEN'&&n%2===0?2:0)+(n%2===0?num(r,'bone')*2:0)+(n<=2?num(r,'bastion')*3:0);
 let skill=skillBase+typeBonus(skillType)+r.upgrade.skill+(skillType==='arcane'?num(r,'lens')*2:0)+(n%2?num(r,'oddwood')*2:0)+(type.tag==='SURGE'&&n>=4?1:0)+(r.hero==='ranger'&&n===6?2:0);
 return {move:n+num(r,'boots'),strike,guard,skill:n<3?null:skill,strikeType:strType,skillType,range:{guardian:1,arcanist:3,ranger:4,rogue:2}[r.hero],strikeRange:h.strikeRange,charge:c.charge||0,skillCost:SKILL_COST,skillReady:n>=3&&(c.charge||0)>=SKILL_COST,type:type.name};}
export function damageAgainst(s,e,action){const p=actionPreview(s);if(!p||!['strike','skill'].includes(action))return null;const h=HEROES[s.run.hero],n=die(s).value,kind=p[action+'Type'];let raw=p[action];if(raw==null)return null;
 if(action==='strike'){
 if(h.strikeRange>1&&d(s.run.combat.player,e)>=2)raw+=num(s.run,'ash')*2;
 if(h.strikeRange>1&&n>=5)raw+=num(s.run,'hawkeye')*2;
 }else{
 if(d(s.run.combat.player,e)===1)raw+=num(s.run,'brutegrip')*2;
 // Aimed Shot has true armor piercing; armor does not reduce its damage.
 }
 const resist=action==='skill'&&s.run.hero==='ranger'?0:(kind==='physical'?ENEMIES[e.type].armor:ENEMIES[e.type].ward);
 return Math.max(1,raw-resist);
}
export function incoming(s){if(s.phase!=='combat')return {total:0,blocked:0,hpLoss:0};const c=s.run.combat,total=alive(c).reduce((a,e)=>a+(e.intent?.type==='attack'&&e.intent.targets?.some(p=>k(p)===k(c.player))?e.damage:0),0);return {total,blocked:Math.min(total,c.shield),hpLoss:Math.max(0,total-c.shield)};}
export function reroll(s,index=s.run?.combat?.selected){if(s.phase!=='combat')return false;const r=s.run,c=r.combat,v=c.dice[index];if(!v||v.used)return false;const free=r.hero==='rogue'&&!c.trickUsed;if(!free&&c.focus<=0&&r.tonics<=0)return false;const source=free?'Trickster':c.focus>0?'focus':'tonic';if(free)c.trickUsed=true;else if(c.focus>0)c.focus--;else r.tonics--;v.value=pick((DICE_TYPES[v.kind]||DICE_TYPES.standard).faces);c.selected=index;log(c,`Rerolled die ${index+1}: ${v.value} (${source}).`);s.message='';return true;}
export function targets(s){if(s.phase!=='combat')return [];const r=s.run,c=r.combat,v=die(s),h=HEROES[r.hero];if(!v||v.used)return [];if(c.action==='move')return path(c,c.player,v.value+num(r,'boots'));
 if(c.action==='strike')return alive(c).filter(e=>d(c.player,e)<=h.strikeRange).map(e=>({x:e.x,y:e.y}));
 if(c.action==='skill'&&actionPreview(s).skillReady)return alive(c).filter(e=>d(c.player,e)<=actionPreview(s).range).map(e=>({x:e.x,y:e.y}));return [];}
function hit(s,e,hp){if(e.hp<=0)return 0;const c=s.run.combat;e.hp=Math.max(0,e.hp-hp);log(c,`${ENEMIES[e.type].name} takes ${hp} damage${e.hp===0?' and falls!':'.'}`);if(!e.hp){s.run.gold+=e.type==='boss'?25:e.type==='brute'?5:3;s.run.kills++;c.defeated??=[];c.defeated.push(e.type);}return hp;}
function applyBleed(s,e,stacks){if(stacks<=0||e.hp<=0)return;e.bleed=Math.min(6,(e.bleed||0)+stacks);e.bleedTurns=2;log(s.run.combat,`${ENEMIES[e.type].name} bleeds (${e.bleed}/turn, 2 turns).`);}
function unlockBlueprint(s){const r=s.run,candidates=r.kind==='boss'?['gravebone','stormglass']:['evenstone','moon'],next=candidates.find(id=>!s.meta.blueprints.includes(id));if(next){s.meta.blueprints.push(next);r.newBlueprint=next;return next;}if(r.kind==='elite')r.tonics++;r.newBlueprint='';return null;}
function cleared(s){let r=s.run,c=r.combat;c.enemies=alive(c);if(c.enemies.length)return false;const defeated=c.defeated||[];if(['elite','boss'].includes(r.kind))unlockBlueprint(s);if(r.kind==='elite'){s.meta.elites++;grantHero(s);}r.hp=clamp(r.hp+num(r,'chalice')*3,0,r.max);s.meta.shards+=r.kind==='boss'?25:r.kind==='elite'?4:2;r.combat=null;
 if(r.kind==='boss'){s.meta.wins++;grantHero(s);s.phase='victory';s.message='The darkness retreats.';}
 else{const source=[...defeated].reverse().find(type=>ENEMIES[type]?.drop);r.choices=rewards(s,source);s.phase='reward';s.message='Room cleared. Choose one relic.';}return true;}
export function act(s,target){if(s.phase!=='combat')return false;const r=s.run,c=r.combat,v=die(s);if(!v||v.used)return false;const n=v.value,h=HEROES[r.hero],p=actionPreview(s);
 if(c.action==='guard'){c.shield+=p.guard;gain(s,1+(v.kind==='gravebone'&&n===1?2:0)+(n<=2?num(r,'bastion'):0));log(c,`Guard +${p.guard}; Charge ${c.charge}/${MAX_CHARGE}.`);}
 else{
 if(c.action==='skill'&&!p.skillReady){s.message=n<3?'Skills require a die of 3+.':`Skills cost ${SKILL_COST} Charge. Strike or Guard to build it.`;return false;}
 if(!target||!targets(s).some(t=>k(t)===k(target))){s.message='Tap a highlighted target.';return false;}
 if(c.action==='move'){c.player={...target};log(c,'You reposition.');}
 else{const e=alive(c).find(x=>k(x)===k(target));if(!e)return false;
 if(c.action==='strike'){
 const dealt=damageAgainst(s,e,'strike');hit(s,e,dealt);let bleed=0;if(h.strikeType==='physical'&&num(r,'fang'))bleed+=num(r,'fang');if(n%2===1){bleed+=num(r,'mire');if(h.strikeType==='physical')bleed+=num(r,'nightoil')+(r.hero==='rogue'?1:0);}applyBleed(s,e,bleed);gain(s,1);log(c,`Strike generated 1 Charge (${c.charge}/${MAX_CHARGE}).`);
 }else{
 const dealt=damageAgainst(s,e,'skill');gain(s,-SKILL_COST);hit(s,e,dealt);let totalHits=dealt>0?1:0;
 if(r.hero==='guardian'&&e.hp){e.stun=1;e.intent={type:'stun',name:'STUNNED',targets:[]};log(c,'Shield Bash stunned the enemy.');}
 if(r.hero==='arcanist'){for(const other of alive(c).filter(x=>x!==e&&d(x,e)<=1)){hit(s,other,Math.max(1,Math.ceil(dealt/2)-ENEMIES[other.type].ward));totalHits++;}}
 if(r.hero==='rogue'){const spots=path(c,c.player,2).filter(p=>d(p,e)===1);if(spots.length)c.player=spots[0];c.shield+=2;}
 if(num(r,'echo'))r.hp=Math.min(r.max,r.hp+num(r,'echo'));
 if(v.kind==='gravebone'&&n===6)gain(s,1);
 if(num(r,'capacitor')&&totalHits>=2)gain(s,num(r,'capacitor'));
 log(c,`${h.skill} spent ${SKILL_COST} Charge (${c.charge}/${MAX_CHARGE} left).`);
 }
 }
 }
 v.used=true;const next=c.dice.findIndex(x=>!x.used);if(next>=0)c.selected=next;s.message='';if(cleared(s))return true;if(next<0)enemyTurn(s);return true;
}
function enemyTurn(s){const r=s.run,c=r.combat;for(const e of alive(c)){if((e.bleed||0)>0){hit(s,e,e.bleed);e.bleedTurns=Math.max(0,(e.bleedTurns||0)-1);if(!e.bleedTurns)e.bleed=0;}}
 if(cleared(s))return;
 for(const e of alive(c)){const t=e.intent;if(t.type==='attack'&&t.targets.some(p=>k(p)===k(c.player))){let blocked=Math.min(c.shield,e.damage),hp=e.damage-blocked;c.shield-=blocked;r.hp=Math.max(0,r.hp-hp);log(c,`${ENEMIES[e.type].name} hits for ${hp}${blocked?` (${blocked} blocked)`:''}.`);}
 else if(t.type==='move'){const options=grid().filter(p=>d(p,e)===1&&!occupied(c,p)&&k(p)!==k(c.player)).sort((a,b)=>d(a,c.player)-d(b,c.player));if(options.length&&d(options[0],c.player)<d(e,c.player)){e.x=options[0].x;e.y=options[0].y;}}
 else if(t.type==='attack')log(c,`${ENEMIES[e.type].name} misses.`);else log(c,`${ENEMIES[e.type].name} is stunned.`);}
 if(r.hp<=0){r.combat=null;s.phase='defeat';return;}for(const e of c.enemies)e.stun=Math.max(0,e.stun-1);c.turn++;c.shield=0;c.action='move';c.dice=roll(r.diceLoadout);c.selected=0;c.focus=1+num(r,'mirror');c.trickUsed=false;intents(c);s.message='';}
export function endTurn(s){if(s.phase!=='combat')return false;enemyTurn(s);return true;}
export function potion(s){if(s.phase!=='combat'||s.run.potions<1||s.run.hp===s.run.max)return false;const r=s.run;r.potions--;const h=Math.min(12,r.max-r.hp);r.hp+=h;log(r.combat,`You drink a potion (+${h} HP).`);return true;}
export function choose(s,id){if(!['choice','reward'].includes(s.phase))return false;const r=s.run,x=r.choices.find(i=>i.id===id);if(!x)return false;
 if(id==='rest')r.hp=Math.min(r.max,r.hp+Math.ceil(r.max*.4));else if(id==='train')r.upgrade.strike++;else if(id==='meditate')r.upgrade.skill++;
 else{r.relics.push(id);if(id==='heart'){r.max+=6;r.hp+=6;}if(id==='vial')r.potions++;if(id==='tonic')r.tonics+=2;}
 if(s.phase==='choice')s.meta.shards++;r.choices=[];makePaths(s);return true;}
export function makePaths(s){const r=s.run,n=r.depth+1;
 if(n===10)r.paths=[{id:'boss',kind:'boss',icon:'☠',name:'The Grave Gate',desc:'Face the final guardian.',risk:'BOSS'}];
 else if(n===4||n===7)r.paths=[{id:'camp',kind:'camp',icon:'♨',name:'Quiet Hearth',desc:'Rest or train.',risk:'SAFE'},{id:'elite',kind:'elite',icon:'⚔',name:'Forsaken Hall',desc:'More danger, permanent dice loot.',risk:'DANGER'}];
 else if(n===6)r.paths=[{id:'cache',kind:'cache',icon:'✧',name:'Forgotten Vault',desc:'Claim a treasure.',risk:'TREASURE'},{id:'elite',kind:'elite',icon:'⚔',name:'Bone Citadel',desc:'A difficult encounter.',risk:'DANGER'}];
 else if(n===8)r.paths=[{id:'merchant',kind:'merchant',icon:'◈',name:'Lantern Merchant',desc:'Spend gold on upgrades.',risk:'TRADER'},{id:'elite',kind:'elite',icon:'⚔',name:'The Gauntlet',desc:'Tough foes. Greater shards.',risk:'DANGER'}];
 else r.paths=[{id:'battle',kind:'battle',icon:'◇',name:pick(['Fungal Crossing','Moonlit Crypt','Broken Stair','Echoing Depths']),desc:'A standard encounter.',risk:'BATTLE'},{id:'elite',kind:'elite',icon:'⚔',name:pick(['The Bloodwell','Hollow Sanctum','Shattered Barracks']),desc:'Harder enemies, more shards.',risk:'DANGER'}];
 s.phase='path';}
export function takePath(s,id){if(s.phase!=='path')return false;const opt=s.run.paths.find(i=>i.id===id);if(!opt)return false;s.run.depth++;enter(s,opt.kind);return true;}
export function buy(s,id){if(s.phase!=='shop')return false;const r=s.run,x=r.choices.find(i=>i.id===id);if(!x||r.gold<x.cost||(id==='potion'&&r.potions>=5))return false;r.gold-=x.cost;if(id==='potion')r.potions++;if(id==='tonic')r.tonics++;if(id==='forge')r.upgrade.strike++;if(id==='blessing'){r.max+=5;r.hp+=5;}r.choices=r.choices.filter(i=>i.id!==id);return true;}
export function leaveShop(s){if(s.phase!=='shop')return false;s.meta.shards++;makePaths(s);return true;}
export function pause(s){if(s.phase==='home'||!s.run)return false;s.run.paused=s.phase;s.phase='home';return true;}
export function resume(s){if(s.phase!=='home'||!s.run?.paused)return false;s.phase=s.run.paused;delete s.run.paused;return true;}
export function abandon(s){s.run=null;s.phase='home';return true;}
export function restore(raw){if(!raw||![1,2,3].includes(raw.version)||!raw.meta)return fresh();const s=fresh();s.meta=normalizeMeta(raw.meta,raw.version);s.muted=!!raw.muted;
 if(['home','combat','choice','reward','path','shop','defeat','victory'].includes(raw.phase)&&raw.run&&HEROES[raw.run.hero]&&raw.run.depth>0&&raw.run.depth<=10&&raw.run.hp>=0&&Array.isArray(raw.run.relics)){
 if(raw.phase==='combat'&&!raw.run.combat?.dice?.length)return s;if(raw.phase==='home'&&!raw.run.paused)return s;s.phase=raw.phase;s.run=raw.run;s.run.tonics=Math.max(0,Number(raw.run.tonics??1)||0);s.run.newBlueprint=mapDie(raw.run.newBlueprint||'');s.run.newHero=raw.run.newHero||'';s.run.diceLoadout=Array.from({length:3},(_,i)=>{const id=mapDie(raw.run.diceLoadout?.[i]);return DICE_TYPES[id]?id:s.meta.equipped[i];});s.run.upgrade??={strike:0,skill:0};if(s.run.combat){const c=s.run.combat;c.focus=Math.max(0,Number(c.focus??1)||0);c.charge=clamp(Number(c.charge??1)||0,0,MAX_CHARGE);c.trickUsed=!!c.trickUsed;c.defeated??=[];c.dice.forEach((v,i)=>{v.kind=DICE_TYPES[mapDie(v.kind)]?mapDie(v.kind):s.run.diceLoadout[i];});c.enemies.forEach(e=>{e.bleed??=0;e.bleedTurns??=0;});}}
 return s;}

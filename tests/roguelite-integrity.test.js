import test from 'node:test';
import assert from 'node:assert/strict';
import {
  fresh, restore, start, abandon, pause, resume, enter, choose,
  diceOptions, firstRoomDice, buy, HEROES, COMMON_DICE, DISCOVERY_DICE,
} from '../engine.js';

const unlockAll=s=>{s.meta.heroes=Object.keys(HEROES);return s;};
function withRandom(value,fn){const old=Math.random;Math.random=()=>value;try{return fn();}finally{Math.random=old;}}

test('a new expedition always has a fixed, class-specific kit with no inherited stats',()=>{
 for(const hero of Object.keys(HEROES)){
  const s=unlockAll(fresh());
  s.meta.blueprints.push(...DISCOVERY_DICE);
  // v0.6 prep fields must have no effect even if copied into new metadata.
  s.meta.equipped=['gravebone','stormglass','moon'];
  s.meta.starters={[hero]:'gravebone'};
  assert.ok(start(s,hero));
  assert.deepEqual(s.run.diceLoadout,HEROES[hero].startingDice);
  assert.equal(s.run.hp,HEROES[hero].hp);
  assert.equal(s.run.max,HEROES[hero].hp);
  assert.equal(s.run.depth,1);
  assert.equal(s.run.gold,0);
  assert.equal(s.run.potions,2);
  assert.equal(s.run.tonics,1);
  assert.deepEqual(s.run.relics,[]);
  assert.deepEqual(s.run.upgrade,{strike:0,skill:0});
  assert.equal(s.run.oath,null);
  assert.ok(abandon(s));
  assert.ok(start(s,hero));
  assert.deepEqual(s.run.diceLoadout,HEROES[hero].startingDice);
 }
});

test('blueprint unlocks grow dungeon loot rather than granting permanent starting dice',()=>{
 const s=fresh();
 assert.deepEqual(diceOptions({run:{hero:'guardian'},meta:s.meta}),COMMON_DICE);
 s.meta.blueprints.push('evenstone','gravebone');
 assert.ok(start(s,'guardian'));
 assert.deepEqual(s.run.diceLoadout,['ironheart']);
 assert.ok(diceOptions(s).includes('evenstone'));
 assert.ok(diceOptions(s).includes('gravebone'));
 s.meta.heroes.push('rogue');
 const rogue=unlockAll(fresh());rogue.meta.blueprints.push('gravebone','stormglass');
 start(rogue,'rogue');
 assert.equal(diceOptions(rogue).includes('gravebone'),false,'6-only Gravebone perk impossible for Rogue');
 assert.equal(diceOptions(rogue).includes('stormglass'),true,'4+ Surge perk works for Rogue');
});

test('room-one offers vary by expedition and guarantee viable + restricted dice',()=>{
 const s=fresh();start(s,'guardian');s.meta.blueprints.push(...DISCOVERY_DICE);
 const low=withRandom(0,()=>firstRoomDice(s));
 const high=withRandom(.999,()=>firstRoomDice(s));
 assert.deepEqual(low.map(x=>x.id),['die:standard','die:stride','die:ember']);
 assert.deepEqual(high.map(x=>x.id),['die:stormglass','die:bastiondie','die:cinder']);
 for(const options of [low,high]){
  assert.equal(new Set(options.map(x=>x.id)).size,3);
  assert.equal(options.length,3);
  assert.ok(options.every(x=>x.id.startsWith('die:')));
 }
});

test('undiscovered elite and boss dice never leak into new runs or rewards',()=>{
 const s=fresh();start(s,'guardian');
 for(const id of DISCOVERY_DICE)assert.equal(diceOptions(s).includes(id),false,id);
 assert.ok(firstRoomDice(s).every(x=>!DISCOVERY_DICE.some(id=>x.id===`die:${id}`)));
});

test('merchant sells a visible, specific die for run-only gold, not mystery equipment',()=>{
 const s=fresh();start(s,'guardian');s.run.depth=8;s.run.gold=50;
 withRandom(.8,()=>enter(s,'merchant'));
 const offer=s.run.choices.find(x=>x.id.startsWith('die:'));
 assert.ok(offer);
 assert.match(offer.desc,/Faces:/);
 assert.equal(s.run.choices.some(x=>x.id==='newdie'),false);
 assert.ok(buy(s,offer.id));
 assert.equal(s.run.gold,34);
 assert.equal(s.run.diceLoadout[1],offer.id.slice(4));
 abandon(s);start(s,'guardian');
 assert.deepEqual(s.run.diceLoadout,['ironheart']);
 assert.equal(s.run.gold,0);
});

test('elite/boss discoveries and hero unlock records persist but expedition power does not',()=>{
 const s=unlockAll(fresh());start(s,'guardian');
 s.meta.blueprints.push('moon');s.meta.best=8;s.meta.elites=2;
 s.run.diceLoadout.push('ember');s.run.relics.push('heart','ward');
 s.run.gold=120;s.run.hp=6;s.run.max=44;s.run.oath='fortress';s.run.upgrade={strike:4,skill:3};
 const archive=restore(JSON.parse(JSON.stringify(s)));
 assert.deepEqual(archive.run.diceLoadout,['ironheart','ember'],'the in-progress expedition is restored');
 abandon(archive);start(archive,'guardian');
 assert.deepEqual(archive.run.diceLoadout,['ironheart']);
 assert.deepEqual(archive.run.relics,[]);
 assert.deepEqual(archive.run.upgrade,{strike:0,skill:0});
 assert.equal(archive.run.max,HEROES.guardian.hp);
 assert.equal(archive.run.hp,HEROES.guardian.hp);
 assert.equal(archive.run.oath,null);
 assert.equal(archive.run.gold,0);
 assert.ok(archive.meta.blueprints.includes('moon'));
 assert.equal(archive.meta.best,8);
 assert.equal(archive.meta.elites,2);
});

test('v0.6 starter selectors and shards are discarded, old in-progress dice remain',()=>{
 const s=unlockAll(fresh());start(s,'arcanist');s.run.diceLoadout=['moon','cinder'];
 s.run.combat.dice=[{id:0,kind:'moon',value:3,used:false},{id:1,kind:'cinder',value:5,used:false}];
 s.version=6;s.meta.blueprints.push('moon');s.meta.starters={arcanist:'moon'};
 s.meta.equipped=['moon','moon','moon'];s.meta.shards=256;
 const restored=restore(JSON.parse(JSON.stringify(s)));
 assert.equal(restored.version,7);
 assert.equal(restored.meta.starters,undefined);
 assert.equal(restored.meta.equipped,undefined);
 assert.equal(restored.meta.shards,undefined);
 assert.deepEqual(restored.run.diceLoadout,['moon','cinder']);
 assert.equal(restored.run.combat.dice[1].value,5);
 abandon(restored);start(restored,'arcanist');
 assert.deepEqual(restored.run.diceLoadout,['aether']);
});

test('legacy shards honor pre-v0.3 Rogue unlock without reintroducing shards as a currency',()=>{
 const s=fresh();s.version=2;s.meta.heroes=[];s.meta.shards=40;
 const restored=restore(s);
 assert.ok(restored.meta.heroes.includes('rogue'));
 assert.equal('shards'in restored.meta,false);
});

test('completed expeditions cannot become resumable via the home button',()=>{
 const s=fresh();start(s,'guardian');s.phase='victory';
 assert.equal(pause(s),false);
 assert.equal(start(s,'guardian'),false);
 abandon(s);assert.ok(start(s,'guardian'));
 s.phase='defeat';assert.equal(pause(s),false);
});

test('pause/resume preserves the current expedition without equipping anything for the next',()=>{
 const s=fresh();start(s,'guardian');s.run.relics.push('ward');s.run.diceLoadout.push('stride');
 assert.ok(pause(s));const resumed=restore(JSON.parse(JSON.stringify(s)));
 assert.equal(resumed.phase,'home');assert.ok(resume(resumed));
 assert.deepEqual(resumed.run.diceLoadout,['ironheart','stride']);
 abandon(resumed);start(resumed,'guardian');
 assert.deepEqual(resumed.run.diceLoadout,['ironheart']);
});

test('legacy merchant random-die offer migrates to an explicit dice purchase',()=>{
 const s=fresh();start(s,'guardian');s.run.depth=8;enter(s,'merchant');
 s.version=6;s.run.choices=s.run.choices.map(x=>x.id.startsWith('die:')?{...x,id:'newdie',name:'Wandering Die',desc:'Random die'}:x);
 const imported=restore(s);
 const visible=imported.run.choices.find(x=>x.id.startsWith('die:'));
 assert.ok(visible);
 assert.match(visible.desc,/Faces:/);
});

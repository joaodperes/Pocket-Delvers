import test from 'node:test';
import assert from 'node:assert/strict';
import {
  fresh,start,enter,makePaths,takePath,choose,endTurn,act,targets,setAction,actionPreview,
  restore,ENEMIES,ELITE_TYPES,poisonAt,incoming,damageFor,bossPhase,damageAgainst
} from '../engine.js';
function fixture(type='slime',hero='guardian',count=2){
 const s=fresh();s.meta.heroes.push(hero);start(s,hero);const c=s.run.combat;
 c.rocks=[];c.hazards=[];c.player={x:2,y:4};s.run.diceLoadout=Array(count).fill('standard');
 c.dice=Array.from({length:count},(_,id)=>({id,kind:'standard',value:5,used:false}));
 c.enemies=[{id:type+'-0',type,x:2,y:2,hp:ENEMIES[type].hp,maxHp:ENEMIES[type].hp,damage:ENEMIES[type].damage,stun:0,recovery:0,stagger:0,rally:0,bleed:0,bleedTurns:0,intent:{type:'recover',name:'WAIT',targets:[]}}];
 c.charge=4;return s;
}
const target={x:2,y:2};
test('mandatory champion at room 5 cannot be bypassed by safe route choices',()=>{
 const s=fixture();s.run.depth=4;makePaths(s);assert.deepEqual(s.run.paths.map(x=>x.kind),['elite']);
 assert.match(s.run.paths[0].name,/Trial/);assert.equal(takePath(s,'nonexistent'),false);
 assert.equal(takePath(s,s.run.paths[0].id),true);assert.equal(s.run.depth,5);assert.equal(s.run.kind,'elite');
 assert.ok(s.run.combat.enemies.some(e=>ELITE_TYPES.includes(e.type)));
});
test('each champion has distinct health and unique mechanics, not just boosted Brute damage',()=>{
 for(const id of ELITE_TYPES){assert.equal(ENEMIES[id].elite,true);assert.ok(ENEMIES[id].hp>=23);assert.ok(ENEMIES[id].drop);}
 assert.equal(new Set(ELITE_TYPES).size,3);
});
test('Executioner marks multiple tiles and must recover after sweeping even if player dodges',()=>{
 const s=fixture('executioner'),c=s.run.combat,e=c.enemies[0];e.y=3;endTurn(s);
 assert.equal(e.intent.type,'attack');assert.match(e.intent.name,/HAMMER SWEEP/);assert.ok(e.intent.targets.length>=2);
 c.player={x:0,y:4};endTurn(s);assert.equal(e.recovery,1);
 assert.equal(e.intent.type,'recover');endTurn(s);assert.equal(e.recovery,0);
});
test('Venom Spore announces poison before placing it, and placement does not deal damage',()=>{
 const s=fixture('spore'),c=s.run.combat,e=c.enemies[0];endTurn(s);
 // On turn 2 the Spore may seek position; force the already-telegraphed hazard for this step.
 e.intent={type:'hazard',name:'TOXIC SEEDS',targets:[{...c.player}]};const hp=s.run.hp;
 endTurn(s);assert.equal(s.run.hp,hp);assert.ok(poisonAt(c,c.player));
 assert.equal(incoming(s).terrain,2);
});
test('poison ignores shield, hurts at turn end, and expires after two hazardous turns',()=>{
 const s=fixture('spore'),c=s.run.combat;
 c.enemies[0].intent={type:'recover',name:'WAIT'};
 c.hazards=[{x:2,y:4,kind:'poison',readyAt:1,expiresAt:3,damage:2}];
 c.shield=100;const hp=s.run.hp;endTurn(s);assert.equal(s.run.hp,hp-2);
 c.enemies[0].intent={type:'recover',name:'WAIT'};endTurn(s);assert.equal(s.run.hp,hp-4);
 assert.equal(poisonAt(c,c.player),undefined);
});
test('entering a toxic tile hurts immediately, with an explicit run-relic mitigation',()=>{
 for(const item of [null,'mycelium']){
 const s=fixture('slime'),c=s.run.combat;c.enemies[0].x=0;c.enemies[0].y=0;
 c.hazards=[{x:2,y:3,kind:'poison',readyAt:1,expiresAt:3,damage:2}];if(item)s.run.relics.push(item);
 const hp=s.run.hp,charge=c.charge;c.charge=1;setAction(s,'move');assert.ok(act(s,{x:2,y:3}));
 assert.equal(s.run.hp,hp-(item?0:1));if(item)assert.equal(c.charge,2);
 }
});
test('Shieldbreaker destroys 3 Guard before ordinary damage mitigation',()=>{
 const s=fixture('shieldbreaker'),c=s.run.combat,e=c.enemies[0];e.x=2;e.y=3;
 e.intent={type:'attack',name:'GUARD CRACK',targets:[{...c.player}],tracking:false};c.shield=5;
 const hp=s.run.hp;endTurn(s);assert.equal(s.run.hp,hp-(e.damage-2));
});
test('Duelist only ripostes the second adjacent Strike, and never a Skill',()=>{
 const s=fixture('duelist'),c=s.run.combat,e=c.enemies[0];e.y=3;e.hp=70;e.maxHp=70;
 e.intent={type:'counter',name:'RIPOSTE',targets:[{...e}]};
 const hp=s.run.hp;setAction(s,'strike');assert.ok(act(s,{x:2,y:3}));assert.equal(s.run.hp,hp);
 assert.ok(act(s,{x:2,y:3}));assert.equal(s.run.hp,hp-3);
});
test('War Drummer rallies allied attack damage, which drops immediately when drummer dies',()=>{
 const s=fixture('drummer'),c=s.run.combat,e=c.enemies[0];
 c.enemies.push({id:'ally',type:'skeleton',x:1,y:3,hp:30,maxHp:30,damage:4,intent:{type:'recover',name:'WAIT'}});
 e.intent={type:'buff',name:'WAR CHANT'};endTurn(s);
 assert.equal(damageFor(c,c.enemies[1]),5);e.hp=0;assert.equal(damageFor(c,c.enemies[1]),4);
});
test('Hex Sniper telegraphs a full lane instead of tracking a moving hero',()=>{
 const s=fixture('sniper'),c=s.run.combat,e=c.enemies[0];e.x=2;e.y=0;endTurn(s);
 assert.equal(e.intent.type,'attack');assert.equal(e.intent.tracking,undefined);
 assert.ok(e.intent.targets.length>=4);
 const hp=s.run.hp;c.player={x:1,y:4};endTurn(s);assert.equal(s.run.hp,hp);
});
test('Summoner adds at most two Wisps and a new minion does not attack on spawning turn',()=>{
 const s=fixture('summoner'),c=s.run.combat,e=c.enemies[0];e.intent={type:'summon',name:'SUMMON'};
 const hp=s.run.hp;endTurn(s);assert.equal(s.run.hp,hp);
 assert.equal(c.enemies.filter(v=>v.type==='wisp').length,1);
 assert.equal(c.enemies.find(v=>v.type==='wisp').intent.name,'SEEK POSITION');
});
test('Soul Binder seals a die only with 2+ dice; destroying Crystal restores it',()=>{
 const s=fixture('binder'),c=s.run.combat,e=c.enemies[0];e.intent={type:'seal',name:'BIND'};
 endTurn(s);const crystal=c.enemies.find(v=>v.type==='crystal');assert.ok(crystal);assert.equal(c.dice.filter(v=>v.sealed).length,1);
 crystal.x=2;crystal.y=3;crystal.hp=1;setAction(s,'strike');assert.ok(act(s,{x:2,y:3}));
 assert.equal(c.dice.filter(v=>v.sealed).length,0);assert.equal(c.dice.filter(v=>!v.used).length,1);
});
test('Soul Binder can never seal the only die in a single-die kit',()=>{
 const s=fixture('binder','guardian',1),c=s.run.combat;c.enemies[0].intent={type:'seal',name:'BIND'};
 endTurn(s);assert.equal(c.dice.length,1);assert.equal(c.dice[0].used,false);assert.equal(c.enemies.some(e=>e.type==='crystal'),false);
});
test('Grave Warden transitions at 70% and 35%, and phase three raises Boneguards',()=>{
 const s=fixture('boss'),c=s.run.combat,e=c.enemies[0];e.hp=e.maxHp=58;
 e.x=2;e.y=3;assert.equal(bossPhase(e),1);setAction(s,'strike');e.hp=41;assert.ok(act(s,{x:2,y:3}));
 assert.equal(bossPhase(e),2);assert.equal(c.enemies.some(v=>v.type==='skeleton'),false);
 c.dice[1].value=6;e.hp=20;e.stun=0;assert.ok(act(s,{x:2,y:3}));
 assert.equal(bossPhase(e),3);assert.equal(c.enemies.filter(v=>v.type==='skeleton').length,2);
});
test('Warden requires two landed Skills for stagger; one Guardian bash is not a permanent stun',()=>{
 const s=fixture('boss','guardian',3),c=s.run.combat,e=c.enemies[0];e.hp=200;e.maxHp=200;e.y=3;c.dice[0].value=5;c.dice[1].value=5;c.charge=4;
 setAction(s,'skill');act(s,{x:2,y:3});assert.equal(e.stun,0);assert.equal(e.stagger,1);
 act(s,{x:2,y:3});assert.equal(e.stun,1);assert.equal(e.stagger,0);
});
test('v0.7 combat saves migrate hazards and champion counters with safe defaults',()=>{
 const s=fixture('slime');s.version=7;delete s.run.combat.hazards;delete s.run.combat.spawnSerial;
 const upgraded=restore(s);assert.equal(upgraded.version,8);assert.deepEqual(upgraded.run.combat.hazards,[]);
 assert.equal(upgraded.run.combat.spawnSerial,0);assert.equal(upgraded.run.combat.enemies[0].stagger,0);
});
test('boss-ready poison and summons survive save / resume with exact hazard lifecycle',()=>{
 const s=fixture('boss'),c=s.run.combat;c.hazards=[{x:2,y:4,kind:'poison',readyAt:2,expiresAt:4,damage:3}];
 c.enemies[0].hp=15;const copy=restore(JSON.parse(JSON.stringify(s)));
 assert.deepEqual(copy.run.combat.hazards,c.hazards);assert.equal(bossPhase(copy.run.combat.enemies[0]),3);
});
test('regular encounters can contain six tactical archetypes, not only stronger basic enemies',()=>{
 let found=new Set();for(let i=0;i<160;i++){const s=fixture('slime');s.run.depth=8;enter(s,'battle');for(const e of s.run.combat.enemies)found.add(e.type);}
 for(const type of ['shieldbreaker','duelist','spore','sniper','drummer','summoner'])assert.ok(found.has(type),type);
});
test('moving across poison hurts even with a safe destination when roll is short',async()=>{
 const {movementPoisonRisk}=await import('../engine.js');
 const s=fixture('slime'),c=s.run.combat;c.enemies[0].x=0;c.enemies[0].y=0;
 c.dice[0].value=2;c.hazards=[{x:2,y:3,kind:'poison',readyAt:1,expiresAt:3,damage:2}];
 assert.equal(movementPoisonRisk(s,{x:2,y:2}),1);const hp=s.run.hp;
 assert.ok(act(s,{x:2,y:2}));assert.equal(s.run.hp,hp-1);
});
test('high movement die can take longer safe route rather than crossing poisonous square',async()=>{
 const {movementPoisonRisk,movementRoute}=await import('../engine.js');
 const s=fixture('slime'),c=s.run.combat;c.enemies[0].x=0;c.enemies[0].y=0;
 c.dice[0].value=4;c.hazards=[{x:2,y:3,kind:'poison',readyAt:1,expiresAt:3,damage:2}];
 assert.equal(movementPoisonRisk(s,{x:2,y:2}),0);
 assert.equal(movementRoute(s,{x:2,y:2}).length,4);
 const hp=s.run.hp;assert.ok(act(s,{x:2,y:2}));assert.equal(s.run.hp,hp);
});
test('killing the Binder shatters orphan crystals rather than leaving an unwinnable fight',()=>{
 const s=fixture('binder'),c=s.run.combat,e=c.enemies[0];e.y=3;e.hp=1;c.enemies.push({id:'crystal',type:'crystal',x:1,y:0,hp:7,maxHp:7,damage:0,intent:{type:'recover',name:'WAIT'}});
 setAction(s,'strike');assert.ok(act(s,{x:2,y:3}));assert.equal(s.phase,'reward');
});

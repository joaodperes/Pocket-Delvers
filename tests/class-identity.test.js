import test from 'node:test';
import assert from 'node:assert/strict';
import {
  fresh, restore, start, enter, choose, setAction, act, endTurn, reroll, equipStarter,
  availableStartingDice, actionPreview, damageAgainst, maxChargeFor, maxDiceFor,
  rollCapFor, DICE_TYPES, HEROES, RELICS
} from '../engine.js';

function arena(hero='guardian', roll=4, monster='skeleton') {
  const s=fresh(); s.meta.heroes.push(hero);
  assert.ok(start(s,hero));
  const c=s.run.combat;
  c.player={x:2,y:4}; c.rocks=[];
  c.enemies=[{id:'dummy',type:monster,x:2,y:3,hp:50,maxHp:50,damage:3,stun:0,bleed:0,bleedTurns:0,intent:{type:'stun',name:'STUNNED',targets:[]} }];
  c.dice[0].value=roll; c.selected=0;
  return s;
}
const tile={x:2,y:3};

test('each hero has a distinct, internally coherent signature kit',()=>{
  const expected={guardian:['ironheart',1,3,4,6],ranger:['wayfinder',1,3,4,6],arcanist:['aether',1,3,6,6],rogue:['knives',2,4,4,4]};
  for(const [hero,[first,count,maxDice,charge,ceiling]] of Object.entries(expected)){
    const h=HEROES[hero],s=fresh();s.meta.heroes.push(hero);
    assert.equal(h.startingDice[0],first);
    assert.ok(start(s,hero));
    assert.equal(s.run.diceLoadout.length,count);
    assert.equal(s.run.combat.dice.length,count);
    assert.equal(maxDiceFor(hero),maxDice);
    assert.equal(maxChargeFor(s),charge);
    assert.equal(rollCapFor(hero),ceiling);
    assert.ok(s.run.combat.dice.every(v=>v.value<=ceiling));
  }
  const distributions=Object.keys(expected).map(hero=>DICE_TYPES[HEROES[hero].startingDice[0]].faces.join(','));
  assert.equal(new Set(distributions).size,4);
});

test('per-class starter choices do not overwrite each other or grant locked dice',()=>{
  const s=fresh();s.meta.heroes.push('arcanist');
  assert.deepEqual(availableStartingDice(s,'guardian'),['ironheart','standard']);
  assert.equal(equipStarter(s,'guardian','moon'),false);
  s.meta.blueprints.push('moon');
  assert.ok(equipStarter(s,'guardian','moon'));
  assert.equal(equipStarter(s,'arcanist','standard'),true);
  assert.equal(s.meta.starters.ranger,'wayfinder');
  assert.equal(s.meta.starters.rogue,'knives');
  const restored=restore(JSON.parse(JSON.stringify(s)));
  assert.equal(restored.meta.starters.guardian,'moon');
  assert.equal(restored.meta.starters.arcanist,'standard');
  assert.equal(restored.meta.starters.ranger,'wayfinder');
  assert.ok(start(restored,'guardian'));
  assert.equal(restored.run.diceLoadout[0],'moon');
});

test('Arcanist basic Strikes are dice-minus-two BEFORE Ward, and still channel Charge at zero damage',()=>{
  const s=arena('arcanist',2,'slime'),c=s.run.combat,e=c.enemies[0];
  assert.equal(actionPreview(s).strike,0);
  assert.equal(damageAgainst(s,e,'strike'),0);
  assert.equal(c.charge,2); // automatic Charge at the start of round one
  assert.ok(setAction(s,'strike'));
  assert.ok(act(s,tile));
  assert.equal(e.hp,50);
  assert.equal(c.charge,4); // +1 Strike, then +1 at the next turn start after the last die.
  // A roll of six becomes four direct damage before resistance, not the old class bonus.
  const next=arena('arcanist',6,'skeleton');
  assert.equal(actionPreview(next).strike,4);
  assert.equal(damageAgainst(next,next.run.combat.enemies[0],'strike'),4);
});

test('Arcanist gains exactly one automatic Charge per new combat turn and caps at six',()=>{
  const s=arena('arcanist',4),c=s.run.combat;
  assert.equal(c.charge,2);
  endTurn(s);
  assert.equal(c.turn,2);
  assert.equal(c.charge,3);
  c.charge=6;
  endTurn(s);
  assert.equal(c.charge,6);
  assert.equal(actionPreview(s).maxCharge,6);
});

test('Rogue gets two starter dice, all die types cap at four, and can earn a fourth die',()=>{
  const s=arena('rogue',4),r=s.run,c=r.combat;
  assert.equal(c.dice.length,2);
  r.diceLoadout.push('stride');
  r.depth=5; r.oath='shade'; enter(s,'battle');
  assert.ok(s.run.combat.dice.every(v=>v.value<=4));
  for(let i=0;i<100;i++){
    s.run.combat.focus=1;
    assert.ok(reroll(s,2));
    assert.ok(s.run.combat.dice[2].value<=4);
  }
  // The rogue's cap is a property of the hero, not of the individual die.
  assert.equal(rollCapFor('rogue'),4);
  const battle=s.run.combat;
  battle.enemies=[{id:'last',type:'slime',x:2,y:3,hp:1,maxHp:8,damage:2,stun:0,bleed:0,bleedTurns:0,intent:{type:'stun',name:'STUNNED',targets:[]} }];
  battle.player={x:2,y:4};battle.rocks=[];battle.dice[0].value=4;battle.dice[0].used=false;battle.selected=0;
  setAction(s,'strike');assert.ok(act(s,tile));
  assert.equal(s.phase,'reward');
  const offer=s.run.choices.find(x=>x.id.startsWith('die:'));
  assert.ok(offer,'fourth die is a possible reward');
  assert.ok(choose(s,offer.id));
  assert.equal(r.diceLoadout.length,4);
});

test('Rogue first room offers build options, not an immediate third action',()=>{
  const s=arena('rogue',4,'slime');
  s.run.combat.enemies[0].hp=1;
  setAction(s,'strike');act(s,tile);
  assert.equal(s.phase,'reward');
  assert.equal(s.run.choices.length,3);
  assert.ok(s.run.choices.every(x=>!x.id.startsWith('die:')));
  assert.ok(s.run.choices.some(x=>x.id==='twincut'));
  assert.ok(s.run.choices.some(x=>x.id==='underhand'));
});

test('Arcanist can build for large Charge and stronger Skills at the expense of Guard and Strike',()=>{
  const s=arena('arcanist',4),c=s.run.combat;
  const baseline=actionPreview(s);
  s.run.relics.push('unstable','reservoir');
  c.charge=5;
  const build=actionPreview(s);
  assert.equal(maxChargeFor(s),8);
  assert.equal(build.maxCharge,8);
  assert.equal(build.guard,Math.max(0,baseline.guard-5));
  assert.equal(build.strike,Math.max(0,baseline.strike-2));
  assert.equal(build.skill,baseline.skill+5);
  c.charge=8;assert.ok(setAction(s,'guard'));act(s);
  assert.equal(c.charge,8);
});

test('Blood Conduit grants dangerous spell power but cannot be exploited at one HP',()=>{
  const s=arena('arcanist',5),c=s.run.combat,e=c.enemies[0];
  c.charge=5;s.run.relics.push('bloodmagic');
  const spell=actionPreview(s).skill;
  assert.ok(setAction(s,'skill'));assert.ok(act(s,tile));
  assert.equal(s.run.hp,HEROES.arcanist.hp-2);
  assert.equal(e.hp,50-spell); // skeleton ward zero
  s.run.hp=2;c.charge=3;c.dice[0].used=false;
  assert.equal(actionPreview(s).skillReady,false);
  assert.equal(act(s,tile),false);
  assert.equal(s.run.hp,2);
});

test('Guardian Guard-vs-mobility choice and Ranger distance choice have measurable costs',()=>{
  const g=arena('guardian',4);const base=actionPreview(g);
  g.run.relics.push('counterweight');const heavy=actionPreview(g);
  assert.equal(heavy.guard,base.guard+3);
  assert.equal(heavy.move,base.move-1);
  const ra=arena('ranger',5),c=ra.run.combat,e=c.enemies[0];
  ra.run.relics.push('longshot');c.player={x:2,y:4};e.x=2;e.y=1;
  const distant=damageAgainst(ra,e,'strike');
  e.y=3;const near=damageAgainst(ra,e,'strike');
  assert.equal(distant-near,5);
});

test('Rogue low-roll and second-Strike relics encourage different spending sequences',()=>{
  const s=arena('rogue',2),c=s.run.combat,e=c.enemies[0];
  const base=actionPreview(s);
  s.run.relics.push('underhand','twincut');
  assert.equal(actionPreview(s).strike,base.strike+3);
  assert.equal(actionPreview(s).guard,Math.max(0,base.guard-2));
  setAction(s,'strike');assert.ok(act(s,tile));
  assert.equal(e.bleed,0);
  c.selected=1;c.dice[1].value=2;
  assert.ok(setAction(s,'strike'));assert.ok(act(s,tile));
  assert.equal(e.bleed,2);
});

test('class-specific tradeoffs are never randomly offered to other classes',()=>{
  const exclusive=RELICS.filter(x=>x.exclusive);
  assert.ok(exclusive.length>=8);
  for(const hero of Object.keys(HEROES)){
    const s=arena(hero,4,'slime');const c=s.run.combat;
    s.run.depth=2;c.enemies[0].hp=1;setAction(s,'strike');act(s,tile);
    if(s.phase==='reward'){
      for(const x of s.run.choices) assert.ok(!x.exclusive||x.exclusive===hero,x.id);
    }
  }
});

test('v0.4 save migration preserves a chosen legacy blueprint and all existing dice',()=>{
  const s=arena('rogue',4);s.version=4;
  delete s.meta.starters;
  s.meta.blueprints.push('moon');s.meta.equipped[0]='moon';
  s.run.diceLoadout=['standard','stride','moon','knives'];
  s.run.combat.dice=s.run.diceLoadout.map((kind,id)=>({id,kind,value:6,used:false}));
  const next=restore(s);
  assert.equal(next.version,6);
  assert.equal(next.meta.starters.rogue,'moon');
  assert.equal(next.run.diceLoadout.length,4);
  assert.ok(next.run.combat.dice.every(v=>v.value===4));
});


test('Arcanist spells hit harder than the standard raw spell formula to pay off Charge building',()=>{
 const s=arena('arcanist',4);const h=HEROES.arcanist;
 const ordinaryBase=1+Math.ceil(4/2)+h.arcane;
 assert.equal(actionPreview(s).skill,ordinaryBase+2);
});
test('Rogue gets an extra action in exchange for weaker physical strikes',()=>{
 const r=arena('rogue',4),g=arena('guardian',4);
 assert.equal(actionPreview(r).strike,actionPreview(g).strike-1);
 assert.equal(r.run.combat.dice.length,2);
 assert.equal(g.run.combat.dice.length,1);
});

test('Ranger signature die can actually trigger its 5+ Aimed Shot bonus',()=>{
 const a=arena('ranger',4),b=arena('ranger',5);
 const expectedChange=Math.ceil(5/2)-Math.ceil(4/2);
 assert.equal(actionPreview(b).skill-actionPreview(a).skill,expectedChange+1);
 assert.equal(DICE_TYPES.wayfinder.faces.filter(x=>x===5).length,2);
});

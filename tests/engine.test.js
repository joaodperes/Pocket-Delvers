import test from 'node:test';
import assert from 'node:assert/strict';
import {fresh,start,setAction,targets,act,setDie,endTurn,potion,choose,enter,buy,leaveShop,pause,resume,restore,unlocked,actionPreview,damageAgainst,incoming,reroll,equipDie,available,canUse,dieOffer,threatens,DICE_TYPES,HEROES,SKILL_COST,MAX_CHARGE,ENEMIES} from '../engine.js';

function trainingBattle(hero='guardian',value=4,type='skeleton'){
 const s=fresh();s.meta.heroes.push(hero);assert.ok(start(s,hero));const c=s.run.combat;s.run.diceLoadout=['standard','standard','standard'];c.dice=[...c.dice,{id:1,kind:'standard',value:3,used:false},{id:2,kind:'standard',value:3,used:false}];c.rocks=[];c.player={x:2,y:4};
 c.enemies=[{id:'target',type,x:2,y:3,hp:50,maxHp:50,damage:4,stun:0,bleed:0,bleedTurns:0,intent:{type:'attack',name:'STRIKE',targets:[{x:2,y:4}]}}];
 c.dice.forEach((v,i)=>{v.value=i===0?value:3;v.used=false;});c.selected=0;return s;
}
const target={x:2,y:3};
test('New saves start with Guardian only, other heroes unlock with separate milestones',()=>{
 const s=fresh();assert.deepEqual(s.meta.heroes,['guardian']);assert.ok(start(s,'guardian'));assert.equal(unlocked(s,'ranger'),false);s.run.depth=3;enter(s,'battle');assert.equal(unlocked(s,'ranger'),true);assert.equal(unlocked(s,'arcanist'),false);assert.equal(unlocked(s,'rogue'),false);
});
test('Ranger, Arcanist and Rogue unlock in milestone order without shard grinding',()=>{
 const s=trainingBattle();s.meta.best=3;s.meta.elites=1;s.meta.wins=1;const restored=restore(s);for(const hero of ['guardian','ranger','arcanist','rogue'])assert.ok(unlocked(restored,hero));
});
test('Combat starts with ONE die, one Charge and readable enemy intentions',()=>{const s=fresh();start(s,'guardian');assert.equal(s.phase,'combat');assert.equal(s.run.combat.dice.length,1);assert.equal(s.run.combat.charge,1);assert.ok(s.run.combat.enemies.every(e=>e.intent));});
test('Dice values are exact movement path length',()=>{
 const s=trainingBattle('guardian',1),c=s.run.combat;c.enemies=[{...c.enemies[0],x:2,y:2}];let t=targets(s);assert.ok(t.some(p=>p.x===1&&p.y===4));assert.ok(!t.some(p=>p.x===0&&p.y===4));c.dice[0].value=2;t=targets(s);assert.ok(t.some(p=>p.x===0&&p.y===4));
});
test('Movement cannot pass through blocked corridors',()=>{const s=trainingBattle('guardian',5),c=s.run.combat;c.rocks=[{x:1,y:4},{x:3,y:4},{x:2,y:3}];c.enemies[0].y=1;assert.deepEqual(targets(s),[]);});
test('Skills require both a 3+ die and 2 Charge; failed casts use no die',()=>{
 const s=trainingBattle('guardian',4),c=s.run.combat;setAction(s,'skill');assert.equal(SKILL_COST,2);assert.equal(actionPreview(s).skillReady,false);assert.deepEqual(targets(s),[]);assert.equal(act(s,target),false);assert.equal(c.dice[0].used,false);assert.match(s.message,/2 Charge/);c.charge=2;c.dice[0].value=2;assert.equal(actionPreview(s).skillReady,false);c.dice[0].value=3;assert.equal(actionPreview(s).skillReady,true);
});
test('A normal Strike generates Charge and uses exact post-armor damage',()=>{
 const s=trainingBattle('guardian',4),c=s.run.combat,e=c.enemies[0];const actual=damageAgainst(s,e,'strike');assert.equal(actual,actionPreview(s).strike-ENEMIES.skeleton.armor);setAction(s,'strike');assert.ok(act(s,target));assert.equal(e.hp,50-actual);assert.equal(c.charge,2);assert.equal(c.dice[0].used,true);
});
test('Guard generates Charge, previews exact shield, and caps Charge at four',()=>{
 const s=trainingBattle('guardian',2),c=s.run.combat;c.charge=MAX_CHARGE-1;setAction(s,'guard');const shield=actionPreview(s).guard;assert.ok(act(s));assert.equal(c.shield,shield);assert.equal(c.charge,MAX_CHARGE);
});
test('Spending a skill consumes two Charge and Shield Bash stuns',()=>{
 const s=trainingBattle('guardian',6),c=s.run.combat,e=c.enemies[0];c.charge=3;setAction(s,'skill');const hp=damageAgainst(s,e,'skill');assert.ok(act(s,target));assert.equal(c.charge,1);assert.equal(e.stun,1);assert.equal(e.hp,50-hp);
});
test('Guardian normally strikes harder than their control-focused special',()=>{const s=trainingBattle('guardian',4,'slime');s.run.combat.charge=2;const e=s.run.combat.enemies[0];assert.ok(damageAgainst(s,e,'strike')>damageAgainst(s,e,'skill'));});
test('Ranger physical attacks have range three and Aimed Shot pierces armor',()=>{
 const s=trainingBattle('ranger',6),c=s.run.combat,e=c.enemies[0];e.y=1;setAction(s,'strike');assert.ok(targets(s).some(p=>p.x===2&&p.y===1));e.y=2;c.charge=2;setAction(s,'skill');assert.equal(damageAgainst(s,e,'skill'),actionPreview(s).skill);assert.ok(damageAgainst(s,e,'strike')<actionPreview(s).strike);
});
test('Arcanist deals arcane attacks, has range three, and chains adjacent enemies',()=>{
 const s=trainingBattle('arcanist',4),c=s.run.combat,e=c.enemies[0];c.charge=2;const secondary={...e,id:'other',x:3,y:3,hp:50,maxHp:50};c.enemies.push(secondary);assert.equal(actionPreview(s).strikeType,'arcane');setAction(s,'skill');assert.ok(act(s,target));assert.ok(e.hp<50);assert.ok(secondary.hp<50);assert.equal(c.charge,0);
});
test('Rogue odd Strikes apply 2 turns of Bleed; even rolls do not',()=>{
 const s=trainingBattle('rogue',3),c=s.run.combat,e=c.enemies[0];setAction(s,'strike');act(s,target);assert.equal(e.bleed,1);assert.equal(e.bleedTurns,2);const before=e.hp;endTurn(s);assert.equal(e.hp,before-1);
});
test('Class synergies change decisions: low-roll guard with Bastion and Gravebone',()=>{
 const s=trainingBattle('guardian',1),c=s.run.combat;s.run.relics.push('bastion');c.dice[0].kind='gravebone';setAction(s,'guard');assert.ok(actionPreview(s).guard>5);act(s);assert.equal(c.charge,4);
});
test('Monster armor/ward makes damage types matter without hiding numbers',()=>{
 const a=trainingBattle('arcanist',4,'skeleton'),b=trainingBattle('guardian',4,'skeleton');const ea=a.run.combat.enemies[0],eb=b.run.combat.enemies[0];assert.equal(damageAgainst(a,ea,'strike'),actionPreview(a).strike);assert.equal(damageAgainst(b,eb,'strike'),actionPreview(b).strike-2);
});
test('Enemy loot includes a monster-specific relic alongside choices',()=>{
 const s=trainingBattle('guardian',5,'slime'),c=s.run.combat;c.enemies[0].hp=1;setAction(s,'strike');act(s,target);assert.equal(s.phase,'reward');assert.equal(s.run.choices.length,3);assert.ok(s.run.choices.some(x=>x.id==='mire'));choose(s,'mire');assert.ok(s.run.relics.includes('mire'));
});
test('Healing potions preserve dice and enemy intents',()=>{const s=trainingBattle();s.run.hp-=15;assert.ok(potion(s));assert.equal(s.run.potions,1);assert.equal(available(s.run.combat),3);});
test('Reroll uses actual custom-die faces, does not spend the die',()=>{
 const s=trainingBattle(),c=s.run.combat;c.dice[0].kind='evenstone';assert.ok(reroll(s,0));assert.ok(DICE_TYPES.evenstone.faces.includes(c.dice[0].value));assert.equal(c.focus,0);assert.equal(available(c),3);assert.ok(reroll(s,0));assert.equal(s.run.tonics,0);assert.equal(reroll(s,0),false);
});
test('Rogue free reroll and Mirror add per-round rerolls',()=>{
 const s=trainingBattle('rogue'),c=s.run.combat;c.focus=0;s.run.tonics=0;assert.ok(reroll(s));assert.equal(c.trickUsed,true);s.run.relics.push('mirror');endTurn(s);assert.equal(c.focus,2);assert.equal(c.trickUsed,false);
});
test('Reroll and dice distributions are not unconditionally stronger',()=>{
 assert.ok(!DICE_TYPES.gravebone.faces.includes(4));assert.equal(DICE_TYPES.gravebone.faces.filter(n=>n===6).length,1);assert.equal(DICE_TYPES.gravebone.faces.filter(n=>n===3).length,2);assert.equal(DICE_TYPES.evenstone.faces.includes(1),true);
});
test('Gravebone face six refunds 1 Charge on skill',()=>{const s=trainingBattle('guardian',6),c=s.run.combat;c.dice[0].kind='gravebone';c.charge=2;setAction(s,'skill');act(s,target);assert.equal(c.charge,1);});
test('Elite permanently unlocks a die and Arcanist, boss unlocks Gravebone and Rogue',()=>{
 const s=trainingBattle('guardian',4),c=s.run.combat;s.run.kind='elite';c.enemies[0].hp=1;setAction(s,'strike');act(s,target);assert.equal(s.phase,'reward');assert.ok(s.meta.blueprints.includes('evenstone'));assert.ok(unlocked(s,'arcanist'));
 s.phase='home';s.run=null;assert.ok(equipDie(s,1,'evenstone'));assert.ok(start(s,'guardian'));const b=s.run.combat;b.rocks=[];b.enemies=[{id:'boss',type:'boss',x:2,y:3,hp:1,maxHp:49,damage:7,stun:0,intent:{type:'attack',name:'SMASH',targets:[{x:2,y:4}]}}];s.run.kind='boss';setAction(s,'strike');act(s,target);assert.equal(s.phase,'victory');assert.ok(unlocked(s,'rogue'));assert.ok(s.meta.blueprints.includes('gravebone'));
});
test('v0.2 save migrates to v0.3 preserving access to original heroes and old boss die',()=>{
 const old=trainingBattle();old.version=2;old.meta.blueprints=['standard','twinsix'];old.meta.equipped=['twinsix','standard','standard'];old.meta.wins=1;old.meta.best=10;old.run.diceLoadout=['twinsix','standard','standard'];old.run.combat.dice[0].kind='twinsix';delete old.run.combat.charge;delete old.meta.heroes;const s=restore(JSON.parse(JSON.stringify(old)));assert.equal(s.version,4);assert.ok(s.meta.blueprints.includes('gravebone'));assert.equal(s.meta.equipped[0],'gravebone');assert.equal(s.run.combat.dice[0].kind,'gravebone');assert.equal(s.run.combat.charge,1);for(const id of Object.keys(HEROES))assert.ok(unlocked(s,id));
});
test('v0.1 save without custom dice still loads and never loses older hero access',()=>{
 const old=trainingBattle();old.version=1;delete old.meta.blueprints;delete old.meta.equipped;delete old.meta.heroes;delete old.run.diceLoadout;delete old.run.tonics;delete old.run.combat.focus;delete old.run.combat.charge;old.run.combat.dice.forEach(d=>delete d.kind);const s=restore(old);assert.equal(s.version,4);assert.equal(s.run.combat.dice[0].kind,'standard');assert.equal(s.run.combat.charge,1);assert.ok(unlocked(s,'arcanist'));assert.ok(unlocked(s,'ranger'));
});
test('Player can pause and resume mid-combat with active Charge and remaining dice',()=>{
 const s=trainingBattle();s.run.combat.charge=3;assert.ok(pause(s));const r=restore(JSON.parse(JSON.stringify(s)));assert.equal(r.phase,'home');assert.ok(resume(r));assert.equal(r.phase,'combat');assert.equal(r.run.combat.charge,3);
});
test('Merchant purchases upgrades for gold and continues progression',()=>{const s=trainingBattle();s.run.depth=8;s.run.gold=30;enter(s,'merchant');assert.ok(buy(s,'forge'));assert.equal(s.run.gold,15);assert.ok(leaveShop(s));assert.equal(s.phase,'path');});
test('Incoming damage considers planned attack tiles and current shield',()=>{const s=trainingBattle(),c=s.run.combat;c.shield=2;assert.deepEqual(incoming(s),{total:4,blocked:2,hpLoss:2});c.player.x=1;assert.deepEqual(incoming(s),{total:0,blocked:0,hpLoss:0});});

// v0.4: difficulty and replayability regression tests
const forceWin=s=>{const c=s.run.combat;c.enemies=[{id:'one',type:'slime',x:2,y:3,hp:1,maxHp:8,damage:3,stun:0,bleed:0,bleedTurns:0,intent:{type:'attack',name:'STRIKE',targets:[{x:2,y:4}]}}];c.player={x:2,y:4};c.rocks=[];c.selected=0;c.dice[0].value=4;setAction(s,'strike');assert.ok(act(s,{x:2,y:3}));};
test('Each fresh expedition starts with one die even if guild has a full legacy loadout',()=>{const s=fresh();s.meta.equipped=['standard','standard','standard'];start(s,'guardian');assert.equal(s.run.diceLoadout.length,1);assert.equal(s.run.combat.dice.length,1);});
test('First room forces a meaningful choice of second die; no free relic reward',()=>{const s=fresh();start(s,'guardian');forceWin(s);assert.equal(s.phase,'reward');assert.equal(s.run.choices.length,3);assert.ok(s.run.choices.every(x=>x.id.startsWith('die:')));assert.ok(s.run.choices.some(x=>x.id==='die:stride'));assert.ok(choose(s,'die:stride'));assert.equal(s.run.diceLoadout.length,2);assert.equal(s.run.diceLoadout[1],'stride');assert.equal(s.phase,'path');});
test('Restricted high-face die cannot attack, and action selection communicates failure',()=>{const s=fresh();start(s,'guardian');const c=s.run.combat;c.dice[0]={id:0,kind:'stride',value:6,used:false};c.action='move';assert.equal(canUse(c.dice[0],'strike'),false);assert.equal(setAction(s,'strike'),false);c.action='strike';assert.equal(act(s,{x:2,y:3}),false);c.action='move';assert.equal(c.dice[0].used,false);assert.ok(setAction(s,'guard'));assert.ok(act(s));});
test('Emberfang gives up movement and skills for low-roll offensive synergy',()=>{const s=trainingBattle('guardian',1,'slime'),c=s.run.combat;c.dice[0].kind='ember';assert.equal(canUse(c.dice[0],'move'),false);assert.equal(canUse(c.dice[0],'skill'),false);assert.equal(canUse(c.dice[0],'strike'),true);assert.equal(actionPreview(s).strike,2+1+3+1);});
test('Enemy archers have actual tracking shots: a sideways move does not evade but cover does',()=>{const s=trainingBattle(),c=s.run.combat;c.rocks=[];c.enemies=[{id:'archer',type:'archer',x:0,y:1,hp:10,maxHp:10,damage:4,stun:0,intent:{type:'attack',name:'TRACKING SHOT',tracking:true,range:4,targets:[{x:2,y:3}]}}];c.player={x:2,y:3};assert.equal(threatens(c,c.enemies[0]),true);c.player={x:1,y:3};assert.equal(threatens(c,c.enemies[0]),true);c.rocks=[{x:0,y:2},{x:1,y:2}];assert.equal(threatens(c,c.enemies[0]),false);});
test('Incoming damage includes tracking damage at the hero current position after moving',()=>{const s=trainingBattle(),c=s.run.combat;c.rocks=[];c.shield=0;c.enemies=[{id:'archer',type:'archer',x:0,y:0,hp:9,maxHp:9,damage:4,intent:{type:'attack',name:'TRACKING SHOT',tracking:true,range:4,targets:[{x:2,y:2}]}}];c.player={x:2,y:2};assert.equal(incoming(s).total,4);c.player={x:2,y:3};assert.equal(incoming(s).total,0);});
test('Enemy hunting closes two squares per round instead of one',()=>{const s=trainingBattle(),c=s.run.combat;c.enemies=[{id:'hunter',type:'skeleton',x:2,y:0,hp:11,maxHp:11,damage:4,stun:0,bleed:0,bleedTurns:0,intent:{type:'move',name:'HUNT',steps:2,targets:[]}}];c.player={x:2,y:4};endTurn(s);assert.equal(c.enemies[0].x,2);assert.equal(c.enemies[0].y,2);});
test('Ranged archers appear in ordinary depth-two rooms',()=>{const s=fresh();start(s,'guardian');s.run.depth=2;enter(s,'battle');assert.ok(s.run.combat.enemies.some(e=>e.type==='archer'));});
test('Deep expedition rewards can add a third die, at most three total',()=>{const s=trainingBattle(),r=s.run;r.diceLoadout=['standard','stride'];r.depth=5;r.kind='battle';forceWin(s);assert.ok(r.choices.some(x=>x.id.startsWith('die:')));const choice=r.choices.find(x=>x.id.startsWith('die:'));assert.ok(choose(s,choice.id));assert.equal(r.diceLoadout.length,3);});
test('v0.3 save with an ongoing three-die expedition preserves all three dice',()=>{const s=trainingBattle();s.version=3;const old=JSON.parse(JSON.stringify(s));const restored=restore(old);assert.equal(restored.version,4);assert.equal(restored.run.diceLoadout.length,3);assert.equal(restored.run.combat.dice.length,3);});

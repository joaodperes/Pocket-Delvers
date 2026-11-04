import test from 'node:test';
import assert from 'node:assert/strict';
import {
 fresh,start,enter,diceOptions,setAction,setDie,act,endTurn,choose,actionPreview,damageAgainst,
 targets,skillCostFor,OATHS,oathOptions,HEROES,DICE_TYPES,restore,maxChargeFor
} from '../engine.js';
const near={x:2,y:3};
function combat(hero='guardian',type='skeleton',n=4){
 const s=fresh();s.meta.heroes.push(hero);assert.ok(start(s,hero));
 const c=s.run.combat;c.player={x:2,y:4};c.rocks=[];
 c.enemies=[{id:'target',type,x:2,y:3,hp:60,maxHp:60,damage:4,stun:0,bleed:0,bleedTurns:0,intent:{type:'stun',name:'STUNNED',targets:[]} }];
 c.dice[0].value=n;c.selected=0;return s;
}
function secondDie(s,n=4){const c=s.run.combat;s.run.diceLoadout.push('standard');c.dice.push({id:c.dice.length,kind:'standard',value:n,used:false});}
test('twelve exclusive hero Paths are meaningful choices, not a permanent unlock',()=>{
 assert.equal(Object.keys(OATHS).length,12);
 for(const hero of Object.keys(HEROES)){
  const list=oathOptions(hero);assert.equal(list.length,3);
  assert.ok(list.every(x=>x.hero===hero&&x.desc.includes('−')||x.hero===hero&&/lose|cannot|cost|instead|penalty|immediately|Skills −|Strikes −|Guard −|Movement cannot/i.test(x.desc)));
  assert.equal(new Set(list.map(x=>x.id)).size,3);
  const s=combat(hero,'slime');s.run.depth=2;s.run.combat.enemies[0].hp=1;
  setAction(s,'strike');assert.ok(act(s,near));assert.equal(s.phase,'reward');
  assert.deepEqual(s.run.choices.map(x=>x.id),list.map(x=>x.id));
  const picked=list[1].id;assert.ok(choose(s,picked));assert.equal(s.run.oath,picked.slice(5));
  assert.equal(s.phase,'path');assert.ok(!choose(s,list[0].id));
  const copy=restore(JSON.parse(JSON.stringify(s)));assert.equal(copy.run.oath,picked.slice(5));
  assert.equal(start(fresh(),'guardian'),true);
 }
});
test('Stone Sentinel adds Guard but *actually* caps reachable movement to two tiles',()=>{
 const s=combat('guardian','slime',5),c=s.run.combat;
 s.run.oath='fortress';const v=actionPreview(s);assert.equal(v.move,2);
 setAction(s,'move');assert.ok(!targets(s).some(p=>p.x===2&&p.y===1));
 setAction(s,'guard');assert.equal(actionPreview(s).guard,5+1+2+3);
 c.charge=1;c.shield=3;c.enemies[0].intent={type:'attack',name:'STRIKE',targets:[{...c.player}]};
 endTurn(s);assert.equal(c.charge,2,'blocking gives Charge only when hit is absorbed');
});
test('Vengeful Edge heals only on a killing Strike and sacrifices Guard',()=>{
 const s=combat('guardian','slime',4);s.run.oath='avenger';s.run.hp-=7;
 const a=actionPreview(s);s.run.oath=null;const b=actionPreview(s);s.run.oath='avenger';
 assert.equal(a.strike,b.strike+1);assert.equal(a.guard,b.guard-2);
 s.run.combat.enemies[0].hp=1;setAction(s,'strike');act(s,near);
 assert.equal(s.run.hp,HEROES.guardian.hp-6);
});
test('Shield Runner rewards movement but gives up Skill damage',()=>{
 const s=combat('guardian','slime',4);secondDie(s);s.run.oath='march';
 const skill=actionPreview(s).skill;s.run.oath=null;assert.equal(actionPreview(s).skill,skill+1);s.run.oath='march';
 setAction(s,'move');act(s,{x:0,y:4});assert.equal(s.run.combat.shield,3);
});
test('Ranger Paths split distance, focus-fire and moving cover tactics',()=>{
 const s=combat('ranger','slime',5),c=s.run.combat,e=c.enemies[0];
 s.run.oath='eagle';e.y=1;const far=damageAgainst(s,e,'strike');e.y=3;const close=damageAgainst(s,e,'strike');assert.equal(far-close,5);
 s.run.oath='seeker';e.y=3;const first=damageAgainst(s,e,'strike');secondDie(s,5);setAction(s,'strike');act(s,near);
 assert.equal(c.markedTarget,'target');setDie(s,1);assert.equal(damageAgainst(s,e,'strike'),first+2);
 const move=combat('ranger','slime',4);secondDie(move);move.run.oath='wind';move.run.combat.charge=1;setAction(move,'move');act(move,{x:0,y:4});
 assert.equal(move.run.combat.shield,2);assert.equal(move.run.combat.charge,2);
});
test('Arcanist Paths offer true spell cost, protective casting or an HP tradeoff',()=>{
 const s=combat('arcanist','skeleton',5),c=s.run.combat;
 const plain=actionPreview(s).skill;
 s.run.oath='storm';assert.equal(skillCostFor(s),3);assert.equal(actionPreview(s).skill,plain+4);
 c.charge=2;assert.equal(actionPreview(s).skillReady,false);
 c.charge=3;assert.equal(actionPreview(s).skillReady,true);setAction(s,'skill');assert.ok(act(s,near));assert.equal(c.charge,1);
 const w=combat('arcanist','skeleton',5);secondDie(w);w.run.oath='weave';w.run.combat.charge=3;setAction(w,'skill');act(w,near);assert.equal(w.run.combat.shield,3);
 const r=combat('arcanist','skeleton',5);r.run.depth=2;r.phase='reward';r.run.choices=oathOptions('arcanist');assert.ok(choose(r,'oath:rift'));
 assert.equal(r.run.max,HEROES.arcanist.hp-5);assert.equal(r.run.hp,HEROES.arcanist.hp-5);
});
test('Rogue paths reward combinations rather than raw high faces',()=>{
 const s=combat('rogue','skeleton',4),c=s.run.combat,e=c.enemies[0];s.run.oath='flurry';
 const before=damageAgainst(s,e,'strike');setAction(s,'strike');act(s,near);
 setDie(s,1);c.dice[1].value=4;assert.equal(damageAgainst(s,e,'strike'),before+2);
 const t=combat('rogue','slime',4);t.run.oath='trick';enter(t,'battle');assert.equal(t.run.combat.focus,2);
 const smoke=combat('rogue','slime',4);smoke.run.oath='shade';smoke.run.combat.charge=1;
 setAction(smoke,'move');act(smoke,{x:0,y:4});assert.equal(smoke.run.combat.shield,2);assert.equal(smoke.run.combat.charge,2);
});
test('Cinder Seer tracking shot drains Charge only if HP damage penetrates shield',()=>{
 for(const shield of [0,5]){
  const s=combat('guardian','seer',3),c=s.run.combat;c.charge=3;c.shield=shield;
  c.enemies[0].intent={type:'attack',name:'HEX DRAIN',tracking:true,range:3,targets:[{...c.player}]};
  const hp=s.run.hp;endTurn(s);
  assert.equal(s.run.hp,hp-(shield?0:4));
  assert.equal(c.charge,shield?3:2);
 }
});
test('Gloom Hound sprints three tiles and telegraphs a dodgeable pounce',()=>{
 const s=combat('guardian','hound',3),c=s.run.combat,e=c.enemies[0];e.x=2;e.y=0;
 e.intent={type:'move',name:'SPRINT',steps:3,targets:[]};endTurn(s);
 assert.equal(e.y,3);assert.equal(e.intent.name,'POUNCE · DODGE');assert.equal(e.intent.tracking,false);
 const initialHP=s.run.hp;const target=e.intent.targets[0];c.player={x:0,y:4};endTurn(s);assert.equal(s.run.hp,initialHP);
 assert.deepEqual(target,{x:2,y:4});
});
test('run-specific utility dice gate their actions; their face effects are real',()=>{
 assert.deepEqual(DICE_TYPES.cinder.allowed,['strike','skill']);
 assert.deepEqual(DICE_TYPES.bastiondie.allowed,['move','guard']);
 const s=combat('guardian','skeleton',4),c=s.run.combat;c.dice[0].kind='bastiondie';
 assert.equal(setAction(s,'strike'),false);assert.ok(setAction(s,'guard'));
 c.charge=1;act(s);assert.equal(c.charge,3);
 const x=combat('guardian','skeleton',6);x.run.combat.dice[0].kind='cinder';x.run.combat.charge=4;
 assert.equal(setAction(x,'move'),false);setAction(x,'skill');assert.ok(act(x,near));assert.equal(x.run.combat.charge,3);
});
test('v0.5 saves keep their build and migrate cleanly with no phantom Paths',()=>{
 const s=combat('rogue');s.version=5;s.run.relics.push('twincut');s.run.diceLoadout.push('stride');
 const migrated=restore(JSON.parse(JSON.stringify(s)));
 assert.equal(migrated.version,8);assert.equal(migrated.run.oath,null);assert.ok(migrated.run.relics.includes('twincut'));
 assert.equal(migrated.run.diceLoadout.length,3);
});

test('Rogue random loot cannot include dice whose only trigger requires an impossible six',()=>{
 const s=combat('rogue');assert.ok(!diceOptions(s).includes('cinder'));
 assert.ok(diceOptions(combat('arcanist')).includes('cinder'));
});

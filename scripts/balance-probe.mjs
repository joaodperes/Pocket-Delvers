// Diagnostic only: seeded first-fit bot, not a human win-rate model.
import * as G from '../engine.js';
const dist=(a,b)=>Math.abs(a.x-b.x)+Math.abs(a.y-b.y);
function chooseAction(s){const c=s.run.combat;
 for(let i=0;i<c.dice.length;i++){
  const die=c.dice[i];if(die.used)continue;G.setDie(s,i);
  let firstEnemy=c.enemies.filter(x=>x.hp>0).sort((a,b)=>dist(a,c.player)-dist(b,c.player))[0];
  if(!firstEnemy)break;
  if(G.canUse(die,'skill') && G.actionPreview(s).skillReady){G.setAction(s,'skill');const ts=G.targets(s);if(ts.length){let e=c.enemies.filter(e=>ts.some(t=>t.x===e.x&&t.y===e.y)).sort((a,b)=>G.damageAgainst(s,b,'skill')-G.damageAgainst(s,a,'skill'))[0];G.act(s,{x:e.x,y:e.y});return true;}}
  if(G.canUse(die,'strike')){G.setAction(s,'strike');const ts=G.targets(s);if(ts.length){const e=c.enemies.find(e=>ts.some(t=>t.x===e.x&&t.y===e.y));if(G.damageAgainst(s,e,'strike')>0){G.act(s,{x:e.x,y:e.y});return true;}}}
  if(G.canUse(die,'move')){G.setAction(s,'move');const ts=G.targets(s);if(ts.length){const best=ts.sort((a,b)=>dist(a,firstEnemy)-dist(b,firstEnemy))[0];if(dist(best,firstEnemy)<dist(c.player,firstEnemy)){G.act(s,best);return true;}}}
  if(G.canUse(die,'guard')){G.setAction(s,'guard');G.act(s);return true;}
 }
 G.endTurn(s);return false;
}
function rng(seed){return ()=>{seed=(Math.imul(1664525,seed)+1013904223)|0;return (seed>>>0)/4294967296;};}
let old=Math.random;
for(const hero of Object.keys(G.HEROES)){
 let win=0,dead=0,stall=0,depth=0,turns=0,hp=0;
 for(let j=1;j<=200;j++){
  Math.random=rng(j*1049+11);
  const s=G.fresh();s.meta.heroes.push(hero);G.start(s,hero);
  let it=0;
  while(!['defeat','victory'].includes(s.phase)&&it++<240){
    if(s.phase==='combat'){chooseAction(s);continue;}
    if(s.phase==='reward'||s.phase==='choice'){
      const r=s.run;
      const options=r.choices;
      const selected=options.find(x=>x.id==='die:standard') || (s.phase==='choice'&&r.kind==='camp'&&r.hp<r.max-8?options.find(x=>x.id==='rest'):null) || options.find(x=>x.id==='train'||x.id==='meditate') || options[0];
      if(!selected || !G.choose(s,selected.id))throw Error('choice failed '+JSON.stringify(options));
      continue;
    }
    if(s.phase==='path'){
      const selected=s.run.paths.find(x=>x.kind==='battle')||s.run.paths.find(x=>x.kind==='camp')||s.run.paths.find(x=>x.kind==='cache')||s.run.paths.find(x=>x.kind==='merchant')||s.run.paths[0];
      if(!G.takePath(s,selected.id))throw Error('path failed');
      continue;
    }
    if(s.phase==='shop'){G.leaveShop(s);continue;}
    throw Error('unexpected '+s.phase);
  }
  depth+=s.run?.depth||0;
  if(s.phase==='victory'){win++;hp+=s.run.hp;}else if(s.phase==='defeat')dead++;else stall++;
 }
 console.log(hero,{win,dead,stall,avgDepth:(depth/200).toFixed(2),hpIfWon:(hp/Math.max(1,win)).toFixed(2)});
}
Math.random=old;

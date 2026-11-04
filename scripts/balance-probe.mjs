// Diagnostic only. Seeded simple agent; its results are NOT human win-rate estimates.
import * as G from '../engine.js';
const dist=(a,b)=>Math.abs(a.x-b.x)+Math.abs(a.y-b.y);
const rng=seed=>()=>{seed=(Math.imul(1664525,seed)+1013904223)|0;return (seed>>>0)/4294967296;};
function nextAction(s){const c=s.run.combat;
 for(let i=0;i<c.dice.length;i++){
  const die=c.dice[i];if(die.used)continue;G.setDie(s,i);
  const enemies=c.enemies.filter(x=>x.hp>0),first=enemies.sort((a,b)=>dist(a,c.player)-dist(b,c.player))[0];if(!first)break;
  if(G.canUse(die,'skill')&&G.actionPreview(s).skillReady){G.setAction(s,'skill');const ts=G.targets(s);
   if(ts.length){let e=enemies.filter(e=>ts.some(t=>t.x===e.x&&t.y===e.y)).sort((a,b)=>G.damageAgainst(s,b,'skill')-G.damageAgainst(s,a,'skill'))[0];G.act(s,{x:e.x,y:e.y});return true;}}
  if(G.canUse(die,'strike')){G.setAction(s,'strike');const ts=G.targets(s);
   if(ts.length){const e=enemies.find(e=>ts.some(t=>t.x===e.x&&t.y===e.y));if(G.damageAgainst(s,e,'strike')>0){G.act(s,{x:e.x,y:e.y});return true;}}}
  // Movement considers the targeted destination's impending damage, not only distance.
  if(G.canUse(die,'move')){G.setAction(s,'move');const ts=G.targets(s);if(ts.length){
   const best=ts.sort((a,b)=>(dist(a,first)+c.enemies.filter(e=>G.threatens(c,e,a)).length*2)-(dist(b,first)+c.enemies.filter(e=>G.threatens(c,e,b)).length*2))[0];
   if(dist(best,first)<dist(c.player,first)||(c.enemies.filter(e=>G.threatens(c,e,best)).length<c.enemies.filter(e=>G.threatens(c,e,c.player)).length)){G.act(s,best);return true;}}}
  if(G.canUse(die,'guard')){G.setAction(s,'guard');G.act(s);return true;}
 }
 G.endTurn(s);return false;
}
const DEFAULT_RUNS=Number.parseInt(process.env.RUNS||'80',10),RUNS=Math.max(1,Math.min(300,Number.isFinite(DEFAULT_RUNS)?DEFAULT_RUNS:80));
const scenarios=[];for(const hero of Object.keys(G.HEROES))for(const oath of G.oathOptions(hero))scenarios.push({hero,oath:oath.id});
const random=Math.random;const metrics=[];
try{
 for(const {hero,oath} of scenarios){let win=0,dead=0,stall=0,depth=0,turns=0,remaining=0;
  for(let i=0;i<RUNS;i++){Math.random=rng(1049*(i+1)+73);const s=G.fresh();s.meta.heroes.push(hero);G.start(s,hero);
   let iterations=0,priorTurn=0;
   while(!['defeat','victory'].includes(s.phase)&&iterations++<260){
    if(s.phase==='combat'){if(s.run.combat.turn!==priorTurn){priorTurn=s.run.combat.turn;turns++;}nextAction(s);continue;}
    if(['reward','choice'].includes(s.phase)){
     const options=s.run.choices;
     const selection=options.find(x=>x.id===oath) || options.find(x=>x.id==='die:standard') ||
      (s.run.kind==='camp'&&s.run.hp<s.run.max-8?options.find(x=>x.id==='rest'):null) ||
      options.find(x=>x.id==='train'||x.id==='meditate') || options[0];
     if(!selection||!G.choose(s,selection.id))throw Error('choice failed '+JSON.stringify(options));continue;
    }
    if(s.phase==='path'){const options=s.run.paths;const selection=options.find(x=>x.kind==='battle')||options.find(x=>x.kind==='camp')||options.find(x=>x.kind==='cache')||options.find(x=>x.kind==='merchant')||options[0];G.takePath(s,selection.id);continue;}
    if(s.phase==='shop'){G.leaveShop(s);continue;}
    throw Error('unexpected phase '+s.phase);
   }
   depth+=s.run?.depth||0;if(s.phase==='victory'){win++;remaining+=s.run.hp;}else if(s.phase==='defeat')dead++;else stall++;
  }
  metrics.push({hero,oath:oath.slice(5),runs:RUNS,win,dead,stall,meanDepth:+(depth/RUNS).toFixed(2),meanHPWhenWon:+(remaining/Math.max(1,win)).toFixed(2)});
 }
}finally{Math.random=random;}
console.table(metrics);
console.log('Interpretation: fixed first-fit bot, not human skill. Compare outliers within the SAME class; rerun with RUNS=200 for more stable numbers.');

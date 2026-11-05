// Deterministic diagnostic agents, NOT human win-rate estimates.
// Compare identical seed lists, both safe and champion-seeking routes, and
// class-aware action preferences. The heuristic still cannot prove game balance.
import * as G from '../engine.js';
const rng=seed=>()=>{seed=(Math.imul(seed,1664525)+1013904223)|0;return (seed>>>0)/4294967296;};
const dist=(a,b)=>Math.abs(a.x-b.x)+Math.abs(a.y-b.y);
const count=Number.parseInt(process.env.RUNS||'40',10);
const RUNS=Math.min(300,Math.max(1,Number.isFinite(count)?count:40));
const profiles=['native-safe','native-trial','generic-risk'];
function movedRisk(c,p){return c.enemies.filter(e=>e.hp>0&&G.threatens(c,e,p)).reduce((a,e)=>a+G.damageFor(c,e),0)+(G.poisonAt(c,p)?5:0);}
function evaluateMove(s,pos,profile){const c=s.run.combat,h=G.HEROES[s.run.hero],ranged=['arcanist','ranger'].includes(s.run.hero)&&!profile.startsWith('generic');
 const enemies=c.enemies.filter(e=>e.hp>0&&e.type!=='crystal').sort((a,b)=>dist(a,pos)-dist(b,pos));
 const key=enemies[0];if(!key)return -999;
 const desired=ranged?(s.run.hero==='ranger'?3:2):1;
 const separation=dist(pos,key);
 const risk=movedRisk(c,pos),current=movedRisk(c,c.player);
 const offensive=Math.min(5,Math.abs(dist(c.player,key)-desired)*2)-Math.min(5,Math.abs(separation-desired)*2);
 return offensive+(current-risk)*1.6-(ranged&&separation===1?2:0);
}
function actOne(s,profile){const c=s.run.combat,h=G.HEROES[s.run.hero];if(!c)return false;
 const alive=c.enemies.filter(e=>e.hp>0),danger=movedRisk(c,c.player),ranged=profile!=='generic-risk'&&['ranger','arcanist'].includes(s.run.hero);
 for(let index=0;index<c.dice.length;index++){
  const v=c.dice[index];if(v.used)continue;G.setDie(s,index);
  const old=c.action;
  const strikeTargets=G.canUse(v,'strike')&&G.setAction(s,'strike')?G.targets(s):[];
  const skills=G.canUse(v,'skill')&&G.setAction(s,'skill')&&G.actionPreview(s).skillReady?G.targets(s):[];
  const ordered=(arr,action)=>arr.map(p=>({p,e:alive.find(e=>e.x===p.x&&e.y===p.y)})).filter(x=>x.e).sort((a,b)=>{
   const score=e=>G.damageAgainst(s,e,action)+(e.hp<=G.damageAgainst(s,e,action)?5:0)+(e.type==='drummer'||e.type==='summoner'?3:0);
   return score(b.e)-score(a.e);
  });
  let best=null,score=-Infinity;
  if(strikeTargets.length){G.setAction(s,'strike');const opt=ordered(strikeTargets,'strike')[0];if(opt){best={type:'strike',p:opt.p};score=G.damageAgainst(s,opt.e,'strike')*1.3+(opt.e.hp<=G.damageAgainst(s,opt.e,'strike')?6:0)+1;}}
  if(skills.length){G.setAction(s,'skill');const opt=ordered(skills,'skill')[0];if(opt){let val=G.damageAgainst(s,opt.e,'skill')*1.3-2+(opt.e.hp<=G.damageAgainst(s,opt.e,'skill')?6:0)+(s.run.hero==='arcanist'?4:0)+(s.run.hero==='guardian'&&G.threatens(c,opt.e)?4:0);
   if(val>score){best={type:'skill',p:opt.p};score=val;}}}
  let choice=null,moveScore=-Infinity;if(G.canUse(v,'move')){G.setAction(s,'move');const positions=G.targets(s);
   for(const p of positions){const value=evaluateMove(s,p,profile);if(value>moveScore){moveScore=value;choice=p;}}}
  if(choice&&danger>2&&moveScore>Math.max(3,score*1.75)){
   G.setAction(s,'move');G.act(s,choice);return true;}
  if(best&&score>1){G.setAction(s,best.type);if(G.act(s,best.p))return true;}
  if(choice){G.setAction(s,'move');G.act(s,choice);return true;}
  if(G.canUse(v,'guard')){G.setAction(s,'guard');G.act(s);return true;}
  // Restricted die with no legal useful action: leave it unused.
  if(G.canUse(v,old))G.setAction(s,old);
 }
 G.endTurn(s);return false;
}
function chooseReward(s,profile){const r=s.run,options=r.choices||[];
 if(!options.length)throw new Error('Empty reward list');
 const chosen=options.find(x=>x.id.startsWith('oath:')&&x.id.slice(5)===G.oathOptions(r.hero)[0].id.slice(5))
 || options.find(x=>x.id==='rest'&&r.hp<r.max*.55)
 || options.find(x=>x.id==='die:standard'&&r.diceLoadout.length<G.maxDiceFor(r.hero))
 || options.find(x=>x.tags?.some(tag=>({guardian:['GUARD'],ranger:['RANGED'],arcanist:['ARCANE','CHARGE'],rogue:['BLEED','DICE']}[r.hero]||[]).includes(tag)))
 || options.find(x=>x.id.startsWith('die:'))
 || options.find(x=>x.id==='train'||x.id==='meditate')||options[0];
 if(!G.choose(s,chosen.id))throw new Error('Reward selection failed '+chosen.id);
}
function chooseRoute(s,profile){const opts=s.run.paths;
 const risk=profile.includes('trial')||profile.includes('risk');
 const choice=(risk?opts.find(x=>x.kind==='elite'):opts.find(x=>x.kind==='camp'||x.kind==='cache'||x.kind==='merchant'))
 ||opts.find(x=>x.kind==='battle')||opts[0];
 if(!G.takePath(s,choice.id))throw new Error('Route unavailable '+choice.id);
}
function play(hero,profile,seed){const orig=Math.random;Math.random=rng(seed);let s,turns=0,actions=0,damageTaken=0,elite=0;
 try{s=G.fresh();s.meta.heroes.push(hero);G.start(s,hero);
  for(let i=0;i<700&&!['victory','defeat'].includes(s.phase);i++){
   if(s.phase==='combat'){const beforeHP=s.run.hp,prevTurn=s.run.combat.turn,kind=s.run.kind;
    actOne(s,profile);actions++;if(s.run.hp<beforeHP)damageTaken+=beforeHP-s.run.hp;
    if(s.phase==='combat'&&s.run.combat.turn>prevTurn)turns++;
    if(s.phase==='reward'&&kind==='elite')elite++;
   }else if(s.phase==='reward'||s.phase==='choice')chooseReward(s,profile);
   else if(s.phase==='path')chooseRoute(s,profile);
   else if(s.phase==='shop')G.leaveShop(s);
   else throw Error('Unexpected phase '+s.phase);
  }
  return {hero,profile,won:s.phase==='victory',dead:s.phase==='defeat',stalled:!['victory','defeat'].includes(s.phase),depth:s.run?.depth||0,turns,actions,damageTaken,eliteClears:s.run?.eliteClears||elite,hp:s.run?.hp||0};
 }finally{Math.random=orig;}}
const results=[];for(const hero of Object.keys(G.HEROES))for(const profile of profiles){const rows=[];for(let i=0;i<RUNS;i++)rows.push(play(hero,profile,19851+(i+1)*7919));
 const mean=key=>(rows.reduce((sum,v)=>sum+v[key],0)/RUNS).toFixed(1);
 results.push({hero,profile,runs:RUNS,wins:rows.filter(x=>x.won).length,deaths:rows.filter(x=>x.dead).length,stalls:rows.filter(x=>x.stalled).length,meanDepth:mean('depth'),avgTurns:mean('turns'),avgHPDamage:mean('damageTaken'),avgChampionClears:mean('eliteClears')});}
console.table(results);console.log('CAUTION: Different strategies are heuristic bots, not skilled players. Use trends, inspect individual seeds, then phone playtest.');

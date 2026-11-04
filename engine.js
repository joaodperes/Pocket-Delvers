// Pocket Delvers — rule engine. No external dependencies.
export const MAX_ROOMS=10, SIZE=5, STORAGE_KEY='pocket-delvers-save-v1';
export const HEROES={
 guardian:{name:'The Guardian',title:'IRONBOUND',hp:38,skill:'Shield Bash',desc:'Melee · 3+ · Damage and stun'},
 arcanist:{name:'The Arcanist',title:'STORMCALLER',hp:29,skill:'Chain Bolt',desc:'Range 3 · 3+ · Lightning chains'},
 ranger:{name:'The Ranger',title:'WAYFINDER',hp:32,skill:'Aimed Shot',desc:'Range 4 · 3+ · Critical on six'},
 rogue:{name:'The Rogue',title:'NIGHTBLADE',hp:28,skill:'Shadowstep',desc:'Range 2 · 3+ · Reposition and guard'}
};
export const ENEMIES={slime:{name:'Mire Slime',hp:8,damage:3,range:1},skeleton:{name:'Boneguard',hp:11,damage:4,range:1},archer:{name:'Ash Archer',hp:8,damage:3,range:3},brute:{name:'Hollow Brute',hp:17,damage:6,range:1},boss:{name:'Grave Warden',hp:49,damage:7,range:1}};
export const RELICS=[
 {id:'fang',icon:'✦',name:'Serrated Fang',desc:'Strikes deal +2 damage.'},
 {id:'ward',icon:'⬡',name:'Stone Ward',desc:'Guard grants +2 shield.'},
 {id:'boots',icon:'➤',name:'Windstrider Boots',desc:'Move one extra tile.'},
 {id:'lens',icon:'◈',name:'Arcane Lens',desc:'Specials deal +2 damage.'},
 {id:'chalice',icon:'✧',name:'Dusk Chalice',desc:'Heal 3 after each battle.'},
 {id:'heart',icon:'♥',name:'Ember Heart',desc:'Gain +6 max HP and heal 6.'},
 {id:'tooth',icon:'◆',name:'Lucky Tooth',desc:'Strikes with a six deal +3 damage.'},
 {id:'shell',icon:'⬟',name:'Iron Shell',desc:'Start each battle with 3 guard.'},
 {id:'vial',icon:'✚',name:'Crimson Vial',desc:'Gain a healing potion.'},
 {id:'echo',icon:'❖',name:'Echo Charm',desc:'Special attacks heal 1 HP.'}
];
const rand=n=>Math.floor(Math.random()*n),pick=a=>a[rand(a.length)],clamp=(n,a,b)=>Math.max(a,Math.min(n,b)),k=p=>`${p.x},${p.y}`,d=(a,b)=>Math.abs(a.x-b.x)+Math.abs(a.y-b.y),grid=()=>Array.from({length:25},(_,i)=>({x:i%5,y:Math.floor(i/5)}));
const num=(r,id)=>r.relics.filter(x=>x===id).length;
export const fresh=()=>({version:1,phase:'home',meta:{shards:0,best:0,wins:0,runs:0},run:null,muted:false,message:''});
export const unlocked=(s,id)=>id!=='rogue'||s.meta.shards>=40||s.meta.wins>0;
export function start(s,id){if(!HEROES[id]||!unlocked(s,id))return false;const h=HEROES[id];s.run={hero:id,hp:h.hp,max:h.hp,potions:2,gold:0,depth:1,kind:'battle',relics:[],upgrade:{strike:0,skill:0},kills:0,combat:null,choices:[],paths:[]};s.meta.runs++;enter(s,'battle');return true;}
const roll=()=>[0,1,2].map(id=>({id,value:1+rand(6),used:false}));
const alive=c=>c.enemies.filter(e=>e.hp>0);
const occupied=(c,p)=>c.rocks.some(v=>k(v)===k(p))||alive(c).some(e=>k(e)===k(p));
function path(c,from,max){let q=[from],seen=new Map([[k(from),0]]);for(let i=0;i<q.length;i++){let a=q[i],n=seen.get(k(a));if(n>=max)continue;for(let b of [{x:a.x+1,y:a.y},{x:a.x-1,y:a.y},{x:a.x,y:a.y+1},{x:a.x,y:a.y-1}]){if(b.x<0||b.x>=5||b.y<0||b.y>=5||seen.has(k(b))||occupied(c,b))continue;seen.set(k(b),n+1);q.push(b);}}return q.slice(1);}
function intents(c){for(let e of alive(c)){let spec=ENEMIES[e.type];e.intent=e.stun?{type:'stun',name:'STUNNED',targets:[]}:d(e,c.player)<=spec.range?{type:'attack',name:e.type==='archer'?'SHOOT':e.type==='boss'?'SMASH':'STRIKE',targets:[{...c.player}]}:{type:'move',name:'ADVANCE',targets:[]};}}
export function enter(s,kind){let r=s.run;r.kind=kind;s.meta.best=Math.max(s.meta.best,r.depth);r.combat=null;
 if(kind==='camp'){r.choices=[{id:'rest',icon:'♥',name:'Rest by the fire',desc:'Recover 40% of maximum HP.'},{id:'train',icon:'⚔',name:'Sharpen your weapon',desc:'All strikes gain +1 damage.'},{id:'meditate',icon:'✦',name:'Focus your power',desc:'All special attacks gain +1 damage.'}];s.phase='choice';return;}
 if(kind==='cache'){r.choices=rewards();s.phase='choice';return;}
 if(kind==='merchant'){r.choices=[{id:'potion',name:'Restorative Vial',icon:'✚',desc:'Gain one healing potion.',cost:10},{id:'forge',name:'Warrior’s Edge',icon:'⚔',desc:'Strikes gain +1 damage.',cost:15},{id:'blessing',name:'Warden’s Blessing',icon:'♥',desc:'Gain 5 max HP and heal 5.',cost:19}];s.phase='shop';return;}
 const cells=grid().filter(p=>p.y>0&&p.y<4&&p.x!==2);const rocks=[];for(let j=0;j<2;j++)rocks.push(cells.splice(rand(cells.length),1)[0]);
 const spots=grid().filter(p=>p.y<3&&!rocks.some(b=>k(b)===k(p)));
 const enemies=[];const count=kind==='boss'?1:kind==='elite'?Math.min(4,2+Math.floor(r.depth/4)):Math.min(3,1+Math.floor(r.depth/3));
 for(let i=0;i<count;i++){const type=kind==='boss'?'boss':kind==='elite'&&i===0?'brute':pick(r.depth<3?['slime','skeleton']:['slime','skeleton','archer','brute']);const p=spots.splice(rand(spots.length),1)[0],base=ENEMIES[type],hp=base.hp+(type==='boss'?0:Math.floor((r.depth-1)/3)*2+(kind==='elite'?3:0));enemies.push({id:`${type}-${i}`,type,...p,hp,maxHp:hp,damage:base.damage+(kind==='elite'?1:0),stun:0,intent:null});}
 r.combat={player:{x:2,y:4},rocks,enemies,dice:roll(),selected:0,action:'move',turn:1,shield:3*num(r,'shell'),log:[kind==='boss'?'The Grave Warden stirs.':'The darkness has company.']};intents(r.combat);s.phase='combat';s.message='';
}
export const die=s=>s.run?.combat?.dice[s.run.combat.selected];
export const available=c=>c.dice.filter(v=>!v.used).length;
export function setDie(s,i){const c=s.run?.combat;if(!c||!c.dice[i]||c.dice[i].used)return false;c.selected=i;return true;}
export function setAction(s,a){const c=s.run?.combat;if(!c||!['move','strike','guard','skill'].includes(a))return false;c.action=a;return true;}
export function targets(s){if(s.phase!=='combat')return [];const r=s.run,c=r.combat,v=die(s);if(!v||v.used)return [];if(c.action==='move')return path(c,c.player,(v.value>=5?2:1)+num(r,'boots'));
 if(c.action==='strike')return alive(c).filter(e=>d(c.player,e)===1).map(e=>({x:e.x,y:e.y}));
 if(c.action==='skill'&&v.value>=3){const range={guardian:1,arcanist:3,ranger:4,rogue:2}[r.hero];return alive(c).filter(e=>d(c.player,e)<=range).map(e=>({x:e.x,y:e.y}));}return [];}
const log=(c,t)=>{c.log.unshift(t);c.log=c.log.slice(0,4);};
function hit(s,e,hp){const c=s.run.combat;e.hp=Math.max(0,e.hp-hp);log(c,`${ENEMIES[e.type].name} takes ${hp} damage${e.hp===0?' and falls!':'.'}`);if(!e.hp){s.run.gold+=e.type==='boss'?25:e.type==='brute'?5:3;s.run.kills++;}}
const rewards=()=>{const pool=[...RELICS],items=[];for(let n=0;n<3;n++)items.push(pool.splice(rand(pool.length),1)[0]);return items;};
function cleared(s){let r=s.run,c=r.combat;c.enemies=alive(c);if(c.enemies.length)return false;r.hp=clamp(r.hp+num(r,'chalice')*3,0,r.max);s.meta.shards+=r.kind==='boss'?25:r.kind==='elite'?4:2;r.combat=null;
 if(r.kind==='boss'){s.meta.wins++;s.phase='victory';s.message='The darkness retreats.';}
 else{r.choices=rewards();s.phase='reward';s.message='Room cleared. Choose one relic.';}return true;}
export function act(s,target){if(s.phase!=='combat')return false;const r=s.run,c=r.combat,v=die(s);if(!v||v.used)return false;
 if(c.action==='guard'){let n=v.value+1+num(r,'ward')*2;c.shield+=n;log(c,`You brace yourself (+${n} guard).`);}
 else{if(!target||!targets(s).some(p=>k(p)===k(target))){s.message=c.action==='skill'&&v.value<3?'Special abilities require a die of 3+.':'Tap a highlighted target.';return false;}
 if(c.action==='move'){c.player={...target};log(c,'You move to safety.');}
 else{const e=alive(c).find(x=>k(x)===k(target));if(!e)return false;
 if(c.action==='strike')hit(s,e,2+Math.ceil(v.value/2)+r.upgrade.strike+num(r,'fang')*2+(v.value===6?num(r,'tooth')*3:0));
 else{let dmg=1+v.value+r.upgrade.skill+num(r,'lens')*2;
 if(r.hero==='guardian'){hit(s,e,dmg+1);if(e.hp){e.stun=1;e.intent={type:'stun',name:'STUNNED',targets:[]};log(c,'Enemy stunned!');}}
 else if(r.hero==='arcanist'){hit(s,e,dmg);for(const other of alive(c).filter(x=>x!==e&&d(x,e)<=1))hit(s,other,Math.ceil(dmg/2));}
 else if(r.hero==='ranger')hit(s,e,dmg+(v.value===6?4:1));
 else{hit(s,e,dmg);const spots=path(c,c.player,2).filter(p=>d(p,e)===1);if(spots.length)c.player=spots[0];c.shield+=2;}
 if(num(r,'echo'))r.hp=Math.min(r.max,r.hp+num(r,'echo'));
 }} }
 v.used=true;const next=c.dice.findIndex(x=>!x.used);if(next>=0)c.selected=next;s.message='';if(cleared(s))return true;if(next<0)enemyTurn(s);return true;
}
function enemyTurn(s){let r=s.run,c=r.combat;for(const e of alive(c)){const t=e.intent;if(t.type==='attack'&&t.targets.some(p=>k(p)===k(c.player))){let blocked=Math.min(c.shield,e.damage),hp=e.damage-blocked;c.shield-=blocked;r.hp=Math.max(0,r.hp-hp);log(c,`${ENEMIES[e.type].name} hits for ${hp}${blocked?` (${blocked} blocked)`:''}.`);}
 else if(t.type==='move'){const options=grid().filter(p=>d(p,e)===1&&!occupied(c,p)&&k(p)!==k(c.player)).sort((a,b)=>d(a,c.player)-d(b,c.player));if(options.length&&d(options[0],c.player)<d(e,c.player)){e.x=options[0].x;e.y=options[0].y;}}
 else if(t.type==='attack')log(c,`${ENEMIES[e.type].name} misses.`);else log(c,`${ENEMIES[e.type].name} is stunned.`);}
 if(r.hp<=0){r.combat=null;s.phase='defeat';return;}for(const e of c.enemies)e.stun=Math.max(0,e.stun-1);c.turn++;c.shield=0;c.action='move';c.dice=roll();c.selected=0;intents(c);s.message='';}
export function endTurn(s){if(s.phase!=='combat')return false;enemyTurn(s);return true;}
export function potion(s){if(s.phase!=='combat'||s.run.potions<1||s.run.hp===s.run.max)return false;const r=s.run;r.potions--;let h=Math.min(12,r.max-r.hp);r.hp+=h;log(r.combat,`You drink a potion (+${h} HP).`);return true;}
export function choose(s,id){if(!['choice','reward'].includes(s.phase))return false;const r=s.run,x=r.choices.find(i=>i.id===id);if(!x)return false;
 if(id==='rest')r.hp=Math.min(r.max,r.hp+Math.ceil(r.max*.4));else if(id==='train')r.upgrade.strike++;else if(id==='meditate')r.upgrade.skill++;
 else{r.relics.push(id);if(id==='heart'){r.max+=6;r.hp+=6;}if(id==='vial')r.potions++;}
 if(s.phase==='choice')s.meta.shards++;r.choices=[];makePaths(s);return true;}
export function makePaths(s){const r=s.run,n=r.depth+1;
 if(n===10)r.paths=[{id:'boss',kind:'boss',icon:'☠',name:'The Grave Gate',desc:'Face the final guardian.',risk:'BOSS'}];
 else if(n===4||n===7)r.paths=[{id:'camp',kind:'camp',icon:'♨',name:'Quiet Hearth',desc:'Rest or train.',risk:'SAFE'},{id:'elite',kind:'elite',icon:'⚔',name:'Forsaken Hall',desc:'More danger, more shards.',risk:'DANGER'}];
 else if(n===6)r.paths=[{id:'cache',kind:'cache',icon:'✧',name:'Forgotten Vault',desc:'Claim a treasure.',risk:'TREASURE'},{id:'elite',kind:'elite',icon:'⚔',name:'Bone Citadel',desc:'A difficult encounter.',risk:'DANGER'}];
 else if(n===8)r.paths=[{id:'merchant',kind:'merchant',icon:'◈',name:'Lantern Merchant',desc:'Spend gold on upgrades.',risk:'TRADER'},{id:'elite',kind:'elite',icon:'⚔',name:'The Gauntlet',desc:'Tough foes. Greater shards.',risk:'DANGER'}];
 else r.paths=[{id:'battle',kind:'battle',icon:'◇',name:pick(['Fungal Crossing','Moonlit Crypt','Broken Stair','Echoing Depths']),desc:'A standard encounter.',risk:'BATTLE'},{id:'elite',kind:'elite',icon:'⚔',name:pick(['The Bloodwell','Hollow Sanctum','Shattered Barracks']),desc:'Harder enemies, more shards.',risk:'DANGER'}];
 s.phase='path';}
export function takePath(s,id){if(s.phase!=='path')return false;let opt=s.run.paths.find(i=>i.id===id);if(!opt)return false;s.run.depth++;enter(s,opt.kind);return true;}
export function buy(s,id){if(s.phase!=='shop')return false;let r=s.run,x=r.choices.find(i=>i.id===id);if(!x||r.gold<x.cost||(id==='potion'&&r.potions>=5))return false;r.gold-=x.cost;if(id==='potion')r.potions++;if(id==='forge')r.upgrade.strike++;if(id==='blessing'){r.max+=5;r.hp+=5;}r.choices=r.choices.filter(i=>i.id!==id);return true;}
export function leaveShop(s){if(s.phase!=='shop')return false;s.meta.shards++;makePaths(s);return true;}
export function pause(s){if(s.phase==='home'||!s.run)return false;s.run.paused=s.phase;s.phase='home';return true;}
export function resume(s){if(s.phase!=='home'||!s.run?.paused)return false;s.phase=s.run.paused;delete s.run.paused;return true;}
export function abandon(s){s.run=null;s.phase='home';return true;}
export function restore(raw){if(!raw||raw.version!==1||!raw.meta)return fresh();const s=fresh();s.meta={shards:Math.max(0,Number(raw.meta.shards)||0),best:Math.max(0,Number(raw.meta.best)||0),wins:Math.max(0,Number(raw.meta.wins)||0),runs:Math.max(0,Number(raw.meta.runs)||0)};s.muted=!!raw.muted;
 if(['home','combat','choice','reward','path','shop','defeat','victory'].includes(raw.phase)&&raw.run&&HEROES[raw.run.hero]&&raw.run.depth>0&&raw.run.depth<=10&&raw.run.hp>=0&&Array.isArray(raw.run.relics)){
 if(raw.phase==='combat'&&!raw.run.combat?.dice?.length)return s;if(raw.phase==='home'&&!raw.run.paused)return s;s.phase=raw.phase;s.run=raw.run;}
 return s;}

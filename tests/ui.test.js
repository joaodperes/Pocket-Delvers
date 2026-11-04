import test from 'node:test';
import assert from 'node:assert/strict';
import {fresh,start,setAction} from '../engine.js';

test('UI renders new charge economy, exact target damage and class-specific abilities',async()=>{
 const state=fresh();start(state,'guardian');const c=state.run.combat;c.rocks=[];c.dice[0].value=4;c.selected=0;c.charge=2;c.enemies=[{id:'s',type:'skeleton',x:2,y:3,hp:30,maxHp:30,damage:4,intent:{type:'attack',name:'STRIKE',targets:[{x:2,y:4}]}}];setAction(state,'strike');
 let html='',clickHandler=null;const root={set innerHTML(t){html=t},get innerHTML(){return html},addEventListener(type,fn){if(type==='click')clickHandler=fn}};
 const storage={data:JSON.stringify(state),getItem(){return this.data},setItem(k,v){this.data=v}};
 globalThis.document={getElementById(id){return id==='app'?root:null},querySelector(){return null}};
 globalThis.localStorage=storage;globalThis.window={addEventListener(){}};Object.defineProperty(globalThis,'navigator',{value:{},configurable:true});globalThis.location={protocol:'file:'};
 await import('../app.js');
 assert.match(html,/Charge 2\/4/);assert.match(html,/damage-preview/);assert.match(html,/Shield Bash/);assert.match(html,/armor|Armor/);assert.match(html,/Strength|Physical|PHY/);
 assert.ok(clickHandler);
 clickHandler({target:{closest(){return {dataset:{action:'skill'},disabled:false}}}});
 assert.match(html,/Skills cost 2/);assert.match(html,/charge-bar/);
});

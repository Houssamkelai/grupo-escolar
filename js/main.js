import {Viewer} from './viewer.js';
import {Tour} from './tour.js';
import {Hotspots} from './hotspots.js';
import {UI} from './ui.js';
const ui=new UI();document.querySelector('#history').onclick=()=>ui.history();document.querySelector('#about').onclick=()=>ui.about();
async function json(url){const r=await fetch(url);if(!r.ok)throw new Error(`${url}: ${r.status}`);return r.json();}
try{
 const [config,tourData,points,collisions]=await Promise.all(['./data/config.json','./data/tour.json','./data/hotspots.json','./data/collisions.json'].map(json));
 // Future interiors must supply a model, navigation mesh, tours and their own collision validation.
 // This release never creates interior geometry or enables an interior entry point.
 if(config.modeInterior||config.interior.enabled)throw new Error('Interior mode requires a future validated release.');
 const viewer=new Viewer(document.querySelector('#viewer'),collisions);viewer.onError=e=>ui.error(e);viewer.onCollision=()=>ui.status('blocked');
 const tour=new Tour(viewer,tourData.steps,t=>ui.tour(t));const hotspots=new Hotspots(viewer,points,ui);
 ui.onLanguage=()=>{ui.mode(viewer.mode);ui.tour(tour);hotspots.refresh();viewer.resize();};
 ui.onDialog=()=>{if(viewer.mode==='tour'&&tour.playing)tour.toggle();};
 const start=()=>{ui.mode('tour');tour.start().catch(e=>ui.error(e));};
 const explore=()=>{tour.stop();viewer.setMode('free');ui.mode('free');};
 const home=async()=>{tour.stop();viewer.setMode('home');ui.mode('home');await viewer.flyTo(config.freeViews.aerial.position,config.freeViews.aerial.target);};
 document.querySelector('#start').onclick=start;document.querySelector('#free-tour').onclick=start;document.querySelector('#restart').onclick=start;
 for(const id of ['explore','end-explore','exit-tour'])document.getElementById(id).onclick=explore;
 document.querySelector('#back-home').onclick=home;document.querySelector('#home-link').onclick=e=>{e.preventDefault();home();};
 document.querySelector('#next').onclick=()=>tour.go(tour.index+1);document.querySelector('#prev').onclick=()=>tour.go(tour.index-1);document.querySelector('#play').onclick=()=>tour.toggle();document.querySelector('#open-steps').onclick=()=>ui.steps(tour);document.querySelector('#help').onclick=()=>ui.help();
 document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>{const v=config.freeViews[b.dataset.view];viewer.flyTo(v.position,v.target).catch(e=>ui.error(e));});
 document.querySelector('#toggle-hotspots').onclick=e=>e.currentTarget.setAttribute('aria-pressed',String(hotspots.toggle()));
 document.querySelector('#fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else if(document.documentElement.requestFullscreen)await document.documentElement.requestFullscreen();}catch{ui.status('help');}};
 let held=null;document.querySelectorAll('[data-move]').forEach(b=>{b.addEventListener('pointerdown',e=>{b.setPointerCapture(e.pointerId);held=b.dataset.move;});for(const name of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(name,()=>held=null);});
 const keyMap={w:'forward',z:'forward',s:'back',a:'left',q:'left',d:'right',ArrowUp:'forward',ArrowDown:'back',ArrowLeft:'left',ArrowRight:'right'};addEventListener('keydown',e=>{if(viewer.mode==='free'&&!ui.dialog.open&&keyMap[e.key]&&!['INPUT','TEXTAREA','BUTTON'].includes(document.activeElement.tagName)){held=keyMap[e.key];e.preventDefault();}});addEventListener('keyup',()=>held=null);addEventListener('blur',()=>held=null);viewer.frames.push(dt=>{if(held&&!ui.dialog.open)viewer.move(held,dt*5);});
 await viewer.load(config.model,n=>ui.progress(n));const initial=config.freeViews.aerial;viewer.camera.position.fromArray(initial.position);viewer.controls.target.fromArray(initial.target);viewer.controls.update();viewer.previous.copy(viewer.camera.position);viewer.previousTarget.copy(viewer.controls.target);ui.ready();ui.mode('home');
 // Small public diagnostics also used by the offline deployment regression tests.
 window.visitApp={viewer,tour,hotspots,ui,config,ready:true};
}catch(error){ui.error(error);}

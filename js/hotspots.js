import * as THREE from './vendor/three.module.js';
export class Hotspots {
 constructor(viewer,items,ui){this.viewer=viewer;this.items=items;this.ui=ui;this.visible=true;this.root=document.querySelector('#hotspots');this.buttons=items.map((item,i)=>{const b=document.createElement('button');b.className='hotspot';b.textContent=String(i+1).padStart(2,'0');b.addEventListener('click',()=>ui.hotspot(item));this.root.append(b);return b;});this.refresh();viewer.frames.push(()=>this.update());}
 refresh(){this.items.forEach((it,i)=>this.buttons[i].setAttribute('aria-label',this.ui.local(it.title)));}
 update(){const v=this.viewer;this.items.forEach((it,i)=>{const p=new THREE.Vector3(...it.position),q=p.clone().project(v.camera);const hidden=!this.visible||v.mode==='home'||q.z>1||q.z< -1||Math.abs(q.x)>1||Math.abs(q.y)>1;const b=this.buttons[i];b.hidden=hidden;if(!hidden){const toward=p.clone().sub(v.camera.position);const short=v.camera.position.clone().add(toward.multiplyScalar(Math.max(0,1-1.4/toward.length())));b.hidden=v.world.blocked(v.camera.position,short);b.style.transform=`translate(${(q.x*.5+.5)*innerWidth-16}px,${(-q.y*.5+.5)*innerHeight-16}px)`;}});}
 toggle(){this.visible=!this.visible;return this.visible;}
}
